// Coniuga AI-közvetítő (Cloudflare Worker)
// Feladata: a Gemini API-kulcsot titokban tartja, csak bejelentkezett (Firebase) felhasználóktól fogad kérést,
// és csak a Coniuga feladataira használható (fordításjavítás, szófordítás, beszélgetés, olvasmány).
// A promptok a tools/ai-prompts.js-ben vannak (ugyanezt használja a coniuga.html is).
//
// Beállítás a Cloudflare-ben: Settings → Variables and Secrets → Add
//   GEMINI_API_KEY  (Secret)  – a Google AI Studióban kapott kulcs
// Opcionális:
//   MODEL           (Text)    – alapból: gemini-flash-lite-latest
//   DAILY_LIMIT     (Text)    – egy felhasználó napi AI-kéréseinek száma, alapból: 1000

import { sanitize, buildPrompt, SCHEMAS, normalize, looksBroken } from './ai-prompts.js';

const FIREBASE_PROJECT = 'coniuga80';
const ALLOWED_ORIGINS = ['https://irnik80-dotcom.github.io'];
const JWKS_URL = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';
// a felhasználónak szóló hibaüzenetek a választott nyelven
const MSG = {
  auth: ['Jelentkezz be újra.', 'Zaloguj się ponownie.', 'Please sign in again.'],
  limit: ['Mára elérted a napi {n} AI-kérést. Holnap folytathatod.', 'Wykorzystano dzienny limit ({n}). Wróć jutro.', 'You have reached today’s limit of {n} AI requests. Come back tomorrow.'],
  input: ['Hiányzó vagy hibás adat.', 'Brakujące lub błędne dane.', 'Missing or invalid input.'],
  quota: ['Az AI ingyenes kerete most elfogyott. Próbáld újra később.', 'Darmowy limit AI się wyczerpał. Spróbuj później.', 'The free AI quota has run out. Try again later.'],
  busy: ['Az AI most túlterhelt. Próbáld újra pár másodperc múlva.', 'AI jest teraz przeciążone. Spróbuj za kilka sekund.', 'The AI is overloaded. Try again in a few seconds.'],
  fail: ['Az AI most nem válaszolt. Próbáld újra.', 'AI nie odpowiedziało. Spróbuj ponownie.', 'The AI did not respond. Please try again.']
};
const LI = { hu: 0, pl: 1, en: 2 };
const msg = (lang, k, n) => MSG[k][LI[lang] || 0].replace('{n}', n);

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
    catch (e) { return reply(401, { error: 'auth', message: msg('hu', 'auth') }); }

    // 2) bemenet
    let body;
    try { body = await request.json(); } catch (e) { return reply(400, { error: 'json' }); }
    const p = sanitize(body || {});
    const lang = p ? p.lang : 'hu';
    if (!p) return reply(400, { error: 'input', message: msg(lang, 'input') });

    // 3) napi korlát
    const limit = parseInt(env.DAILY_LIMIT || '1000', 10);
    const key = uid + '|' + new Date().toISOString().slice(0, 10);
    const used = usage.get(key) || 0;
    if (used >= limit) return reply(429, { error: 'limit', message: msg(lang, 'limit', limit) });
    usage.set(key, used + 1);
    if (usage.size > 5000) usage.clear();

    // 4) Gemini
    try {
      const temp = { chat: 0.7, story: 0.8 }[p.type] ?? 0.2;
      let out = await callGemini(env, buildPrompt(p), SCHEMAS[p.type], p.type === 'story' ? 30000 : 15000, temp);
      // ritka modellhiba (idegen írásjelek a szövegben): egyszer újrakérjük
      if (looksBroken(p.type, out)) { try { out = await callGemini(env, buildPrompt(p), SCHEMAS[p.type], p.type === 'story' ? 30000 : 15000, temp); } catch (e) {} }
      return reply(200, { result: normalize(p.type, out, p) });
    } catch (e) {
      usage.set(key, used); // a sikertelen kérés ne számítson bele
      const status = e.status === 429 ? 429 : 502;
      return reply(status, { error: 'ai', detail: e.detail || String(e.message || ''), message: msg(lang, e.status === 429 ? 'quota' : e.status === 503 ? 'busy' : 'fail') });
    }
  }
};

// ha egy modell túlterhelt vagy nem létezik, a következővel próbálkozik
async function callGemini(env, prompt, schema, timeout, temperature) {
  const models = [env.MODEL || 'gemini-flash-lite-latest', 'gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'];
  const tries = [];
  let lastErr;
  for (const model of models) {
    const generationConfig = { temperature, responseMimeType: 'application/json', responseSchema: schema };
    if (model.startsWith('gemini-2.5')) generationConfig.thinkingConfig = { thinkingBudget: 0 }; // gyorsabb válasz
    let r; const t0 = Date.now();
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        signal: AbortSignal.timeout(timeout), method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig })
      });
    } catch (e) { tries.push(model + ':timeout'); lastErr = Object.assign(new Error('timeout'), { status: 503, detail: tries.join(', ') }); continue; }
    tries.push(model + ':' + r.status + ':' + (Date.now() - t0) + 'ms');
    if (!r.ok) {
      let detail = '';
      try { const j = await r.json(); detail = (j.error && (j.error.status + ': ' + j.error.message)) || ''; } catch (e) {}
      lastErr = Object.assign(new Error('gemini ' + r.status), { status: r.status, detail: (tries.join(', ') + ' ' + detail).slice(0, 300) });
      if ([404, 429, 500, 503].includes(r.status)) continue;
      throw lastErr;
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((x) => x.text || '').join('') || '';
    try { return JSON.parse(text); }
    catch (e) { lastErr = Object.assign(new Error('bad json'), { status: 502, detail: model + ' invalid JSON' }); continue; }
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
