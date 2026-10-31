// Coniuga AI-közvetítő (Cloudflare Worker)
// Feladata: a Gemini API-kulcsot titokban tartja, csak bejelentkezett (Firebase) felhasználóktól fogad kérést,
// és kizárólag olasz fordítás javítására használható.
//
// Beállítás a Cloudflare-ben: Settings → Variables and Secrets → Add
//   GEMINI_API_KEY  (Secret)  – a Google AI Studióban kapott kulcs
// Opcionális:
//   MODEL           (Text)    – alapból: gemini-flash-latest
//   DAILY_LIMIT     (Text)    – egy felhasználó napi javításainak száma, alapból: 60

const FIREBASE_PROJECT = 'coniuga80';
const ALLOWED_ORIGINS = ['https://irnik80-dotcom.github.io'];
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
const MAX_LEN = 600;

let jwksCache = { keys: null, until: 0 };
const usage = new Map(); // uid|nap -> darab (példányonkénti, „jóhiszemű” korlát)

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };
    const reply = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method === 'GET') return reply(200, { ok: true, service: 'coniuga-ai', configured: !!env.GEMINI_API_KEY });
    if (request.method !== 'POST') return reply(405, { error: 'method' });
    if (!ALLOWED_ORIGINS.includes(origin)) return reply(403, { error: 'origin' });
    if (!env.GEMINI_API_KEY) return reply(500, { error: 'not_configured', message: 'Hiányzik a GEMINI_API_KEY titkos változó.' });

    // 1) bejelentkezés ellenőrzése
    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    let uid;
    try { uid = await verifyFirebaseToken(token); }
    catch (e) { return reply(401, { error: 'auth', message: 'Jelentkezz be újra.' }); }

    // 2) napi korlát
    const limit = parseInt(env.DAILY_LIMIT || '60', 10);
    const key = uid + '|' + new Date().toISOString().slice(0, 10);
    const used = usage.get(key) || 0;
    if (used >= limit) return reply(429, { error: 'limit', message: `Mára elérted a napi ${limit} javítást. Holnap folytathatod.` });

    // 3) bemenet
    let body;
    try { body = await request.json(); } catch (e) { return reply(400, { error: 'json' }); }
    const hu = String(body.hu || '').slice(0, MAX_LEN).trim();
    const ref = String(body.ref || '').slice(0, MAX_LEN).trim();
    const given = String(body.given || '').slice(0, MAX_LEN).trim();
    if (!hu || !given) return reply(400, { error: 'input', message: 'Hiányzik a magyar szöveg vagy a fordítás.' });

    usage.set(key, used + 1);
    if (usage.size > 5000) usage.clear();

    // 4) Gemini
    try {
      const result = await askGemini(env, hu, ref, given);
      return reply(200, { result, left: Math.max(0, limit - used - 1) });
    } catch (e) {
      usage.set(key, used); // a sikertelen kérés ne számítson bele
      const status = e.status === 429 ? 429 : 502;
      return reply(status, { error: 'ai', detail: e.detail || String(e.message || ''), message: e.status === 429 ? 'Az AI ingyenes kerete most elfogyott. Próbáld újra később.' : e.status === 503 ? 'Az AI most túlterhelt. Próbáld újra pár másodperc múlva.' : 'Az AI most nem válaszolt. Próbáld újra.' });
    }
  }
};

function buildPrompt(hu, ref, given) {
  return `Olasz nyelvtanár vagy, magyar anyanyelvű tanulóknak segítesz.
A tanuló olaszra fordította a magyar szöveget. Értékeld a fordítást, és MAGYARUL válaszolj.

Magyar szöveg: ${JSON.stringify(hu)}
${ref ? `Egy helyes mintafordítás (más is lehet helyes): ${JSON.stringify(ref)}\n` : ''}A tanuló fordítása: ${JSON.stringify(given)}

Szabályok:
- Fogadd el a más szórendet, szinonimát, alany nélküli vagy alannyal írt változatot, ha nyelvtanilag helyes és ugyanazt jelenti.
- A hibáknál nevezd meg a típusát (pl. igeidő, igeragozás, nem/szám egyeztetés, névelő, elöljárószó, szórend, szóválasztás, helyesírás/ékezet).
- A magyarázat legyen rövid, érthető, egy-két mondat.
- Ha nincs hiba, az errors lista legyen üres.
- A "corrected" mező a tanuló fordításának javított változata legyen (a lehető legkevesebb változtatással).
- A score 0-10 közötti egész szám (10 = hibátlan).`;
}

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    score: { type: 'INTEGER' },
    correct: { type: 'BOOLEAN' },
    corrected: { type: 'STRING' },
    errors: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          wrong: { type: 'STRING' },
          fix: { type: 'STRING' },
          type: { type: 'STRING' },
          explanation: { type: 'STRING' }
        },
        required: ['wrong', 'fix', 'explanation']
      }
    },
    comment: { type: 'STRING' }
  },
  required: ['score', 'correct', 'corrected', 'errors', 'comment']
};

async function askGemini(env, hu, ref, given) {
  // ha egy modell túlterhelt vagy nem létezik, a következővel próbálkozik
  const models = [env.MODEL || 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
  const tries = [];
  let lastErr;
  for (const model of [...new Set(models)]) {
    const generationConfig = { temperature: 0.2, responseMimeType: 'application/json', responseSchema: SCHEMA };
    if (model.startsWith('gemini-2.5')) generationConfig.thinkingConfig = { thinkingBudget: 0 }; // gyorsabb válasz
    let r; const t0 = Date.now();
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      signal: AbortSignal.timeout(12000),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: buildPrompt(hu, ref, given) }] }],
        generationConfig
      })
    });
    } catch (e) { tries.push(model + ':timeout'); lastErr = Object.assign(new Error('timeout ' + model), { status: 503, detail: tries.join(', ') }); continue; }
    tries.push(model + ':' + r.status + ':' + (Date.now() - t0) + 'ms');
    if (r.status === 404) { lastErr = Object.assign(new Error('model ' + model), { status: 404, detail: 'model not found: ' + model }); continue; }
    if (!r.ok) {
      let detail = '';
      try { const j = await r.json(); detail = (j.error && (j.error.status + ': ' + j.error.message)) || ''; } catch (e) {}
      lastErr = Object.assign(new Error('gemini ' + r.status), { status: r.status, detail: (model + ' ' + r.status + ' ' + detail).slice(0, 300) });
      if (r.status === 503 || r.status === 500 || r.status === 429) continue; // túlterhelt / keret: próbáljuk a következő modellt
      throw lastErr;
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
    const out = JSON.parse(text);
    out.score = Math.max(0, Math.min(10, Math.round(Number(out.score) || 0)));
    out.errors = Array.isArray(out.errors) ? out.errors.slice(0, 10) : [];
    out.model = model; out.tries = tries.join(', ');
    return out;
  }
  throw lastErr || new Error('no model');
}

// ---- Firebase ID-token ellenőrzése (RS256, Google nyilvános kulcsaival) ----
const b64urlToBytes = (s) => {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  const bin = atob(s + '='.repeat(pad));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};
const b64urlJson = (s) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

async function getKeys() {
  if (jwksCache.keys && Date.now() < jwksCache.until) return jwksCache.keys;
  const r = await fetch(JWKS_URL);
  if (!r.ok) throw new Error('jwks');
  const { keys } = await r.json();
  const m = /max-age=(\d+)/.exec(r.headers.get('Cache-Control') || '');
  jwksCache = { keys, until: Date.now() + (m ? +m[1] * 1000 : 3600e3) };
  return keys;
}

async function verifyFirebaseToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('format');
  const header = b64urlJson(parts[0]);
  const payload = b64urlJson(parts[1]);
  if (header.alg !== 'RS256') throw new Error('alg');
  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== FIREBASE_PROJECT) throw new Error('aud');
  if (payload.iss !== 'https://securetoken.google.com/' + FIREBASE_PROJECT) throw new Error('iss');
  if (!(payload.exp > now - 30) || !(payload.iat < now + 300)) throw new Error('time');
  if (!payload.sub) throw new Error('sub');
  const jwk = (await getKeys()).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('kid');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
  if (!ok) throw new Error('sig');
  return payload.sub;
}
