// Bejelentkezés (Firebase Authentication) és a profil mentése (Cloud Firestore).
// Az oldal fő szkriptje globálisan adja: attachCloud(ref, me), detachCloud(), setWho(me, msg).
import { firebaseConfig } from './firebase-config.js';
import { AI_URL } from './ai-config.js';

const $ = (id) => document.getElementById(id);

if (!firebaseConfig.apiKey) {
  // Nincs még beállítva: az oldal böngészős mentéssel működik.
  console.info('Coniuga: a Firebase nincs beállítva (docs/firebase-config.js), csak böngészős mentés.');
} else {
  start().catch((e) => {
    console.error(e);
    setWho(null, 'A bejelentkezés most nem érhető el; az eredményeid ebben a böngészőben maradnak.');
  });
}

const MSG = {
  'auth/invalid-email': 'Ez nem érvényes e-mail-cím.',
  'auth/missing-password': 'Add meg a jelszót.',
  'auth/weak-password': 'A jelszó legyen legalább 6 karakter.',
  'auth/email-already-in-use': 'Ezzel az e-mail-címmel már van fiók. Lépj be helyette.',
  'auth/invalid-credential': 'Hibás e-mail-cím vagy jelszó.',
  'auth/wrong-password': 'Hibás jelszó.',
  'auth/user-not-found': 'Nincs fiók ezzel az e-mail-címmel. Regisztrálj!',
  'auth/too-many-requests': 'Túl sok próbálkozás. Várj pár percet.',
  'auth/popup-closed-by-user': 'Bezártad a Google-ablakot, mielőtt befejeződött volna a belépés.',
  'auth/popup-blocked': 'A böngésző letiltotta a felugró ablakot. Engedélyezd, majd próbáld újra.',
  'auth/unauthorized-domain': 'Ez a webcím nincs engedélyezve a Firebase-ben (Authentication → Settings → Authorized domains).',
  'auth/network-request-failed': 'Nincs internetkapcsolat.'
};
const msgOf = (e) => MSG[e && e.code] || 'Nem sikerült. ' + ((e && e.message) || '');

async function start() {
  const V = '10.12.2';
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  auth.languageCode = 'hu';
  const db = F.getFirestore(app);

  const dlg = $('login'), err = $('login-err');
  const email = () => $('login-email').value.trim();
  const pass = () => $('login-pass').value;
  const busy = (on) => ['login-submit', 'login-register', 'login-google'].forEach((id) => { $(id).disabled = on; });
  const run = async (fn) => {
    err.textContent = ''; busy(true);
    try { await fn(); dlg.close(); } catch (e) { err.textContent = msgOf(e); } finally { busy(false); }
  };

  $('auth').hidden = false;
  const AI_OFF = AI_URL ? 'Az AI-javításhoz jelentkezz be (fent jobbra: Bejelentkezés).' : 'Az AI-javítás még nincs beállítva.';
  setAINote(AI_OFF);
  $('login-open').onclick = () => { err.textContent = ''; dlg.showModal(); };
  $('login-close').onclick = () => dlg.close();
  $('login-google').onclick = () => run(() => A.signInWithPopup(auth, new A.GoogleAuthProvider()));
  $('login-form').onsubmit = (e) => { e.preventDefault(); run(() => A.signInWithEmailAndPassword(auth, email(), pass())); };
  $('login-register').onclick = () => {
    if (!$('login-form').reportValidity()) return;
    run(() => A.createUserWithEmailAndPassword(auth, email(), pass()));
  };
  $('login-reset').onclick = async () => {
    if (!email()) { err.textContent = 'Írd be az e-mail-címed, és oda küldjük a jelszó-visszaállító levelet.'; return; }
    try { await A.sendPasswordResetEmail(auth, email()); err.textContent = 'Elküldtük a levelet. Nézd meg a postafiókod.'; }
    catch (e) { err.textContent = msgOf(e); }
  };
  $('logout').onclick = () => A.signOut(auth);

  let attachedUid = null;
  A.onAuthStateChanged(auth, async (u) => {
    $('login-open').hidden = !!u;
    $('logout').hidden = !u;
    if (u) {
      if (attachedUid === u.uid) return;
      attachedUid = u.uid;
      const ref = F.doc(db, 'users', u.uid);
      const cloud = {
        get: async () => { const s = await F.getDoc(ref); return { exists: s.exists(), data: () => s.data() }; },
        set: (obj) => F.setDoc(ref, obj)
      };
      const me = { name: u.displayName || u.email || 'Saját', avatarUrl: u.photoURL || '' };
      cloudExtra = { name: u.displayName || '', email: u.email || '' };
      const answers = F.collection(db, 'users', u.uid, 'answers');
      answerHook = (a) => { F.addDoc(answers, a).catch((e) => console.warn('Válasz naplózása sikertelen', e)); };
      if (AI_URL) {
        aiBackend = async (p) => {
          const tok = await u.getIdToken();
          let r;
          try {
            r = await fetch(AI_URL, { method: 'POST', headers: { 'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
          } catch (e) { throw new Error('Nem sikerült elérni az AI-t. Ellenőrizd az internetkapcsolatot.'); }
          const j = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(j.message || 'Az AI most nem érhető el.');
          return j;
        };
        setAINote('Az AI-javítást a Google Gemini végzi.');
      }
      try { await attachCloud(cloud, me); }
      catch (e) { console.error(e); setWho(null, 'Belépve, de a mentett adataidat most nem sikerült betölteni.'); }
      teacherCheck(F, db);
    } else if (attachedUid) {
      attachedUid = null;
      answerHook = null; cloudExtra = {}; aiBackend = null; setAINote(AI_OFF);
      $('tab-teacher').hidden = true;
      if (!$('view-teacher').hidden) showTab('practice');
      detachCloud();
    }
  });
}

/* ---------- Tanári nézet ---------- */
const fmt = (ms) => ms ? new Date(ms).toLocaleString('hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–';
const pct = (a, b) => b ? Math.round(100 * a / b) + '%' : '–';
let T = null; // {F, db, rows}

async function teacherCheck(F, db) {
  try {
    await F.getDocs(F.query(F.collection(db, 'users'), F.limit(1)));
  } catch (e) { return; } // nem tanár: a szabály elutasítja
  T = { F, db, rows: [] };
  const tab = $('tab-teacher');
  tab.hidden = false;
  tab.onclick = () => { showTab('teacher'); loadList(); };
}

const H3 = (t) => `<h3 style="font-size:.72rem;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-soft);margin:22px 0 0">${t}</h3>`;
const DIRHU = { it2hu: 'olasz → magyar', hu2it: 'magyar → olasz' };

async function loadList() {
  const box = $('teacher');
  box.innerHTML = '<p class="muted">Betöltés…</p>';
  try {
    const qs = await T.F.getDocs(T.F.collection(T.db, 'users'));
    T.rows = qs.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.updated || 0) - (a.updated || 0));
  } catch (e) { box.innerHTML = '<p class="badc">Nem sikerült betölteni a felhasználókat. ' + esc(e.message || '') + '</p>'; return; }
  const r = T.rows;
  box.innerHTML = `
    <div class="verb-line"><h2 class="inf" style="font-size:2rem">Tanári nézet</h2><span class="hu">${r.length} felhasználó</span></div>
    <div class="actions" style="margin-top:8px"><button class="btn quiet" id="t-refresh" type="button">Frissítés</button></div>
    <div class="tscroll"><table class="ttab">
      <thead><tr><th rowspan="2">Név</th><th rowspan="2">E-mail</th><th colspan="2" style="text-align:center">Ragozás</th><th colspan="2" style="text-align:center">Szójelentés</th><th colspan="2" style="text-align:center">Mondatok</th><th colspan="2" style="text-align:center">Fordítás</th><th rowspan="2">Utoljára</th></tr>
      <tr><th class="num">Válasz</th><th class="num">Helyes</th><th class="num">Válasz</th><th class="num">Helyes</th><th class="num">Válasz</th><th class="num">Helyes</th><th class="num">Darab</th><th class="num">Átlag</th></tr></thead>
      <tbody>${r.map((u, k) => {
        const s = u.stats || {}, v = u.vstats || {}, m = u.mstats || {}, x = u.xstats || {};
        return `<tr class="click" data-k="${k}" tabindex="0"><td><b></b></td><td class="mono"></td><td class="num">${s.total || 0}</td><td class="num">${pct(s.ok || 0, s.total || 0)}</td><td class="num">${v.total || 0}</td><td class="num">${pct(v.ok || 0, v.total || 0)}</td><td class="num">${m.total || 0}</td><td class="num">${pct(m.ok || 0, m.total || 0)}</td><td class="num">${x.total || 0}</td><td class="num">${x.total ? (x.sum / x.total).toFixed(1) : '–'}</td><td>${fmt(u.updated)}</td></tr>`;
      }).join('') || '<tr><td colspan="11" class="muted">Még senki sem lépett be.</td></tr>'}</tbody>
    </table></div>
    <p class="muted">Koppints egy sorra a részletekért.</p>`;
  box.querySelectorAll('tr.click').forEach((tr) => {
    const u = r[+tr.dataset.k];
    tr.cells[0].firstChild.textContent = u.name || '(név nélkül)';
    tr.cells[1].textContent = u.email || '';
    tr.onclick = () => loadUser(u);
    tr.onkeydown = (e) => { if (e.key === 'Enter') loadUser(u); };
  });
  $('t-refresh').onclick = loadList;
}

function missTable(log, fallback) {
  const cnt = {};
  log.forEach((a) => { if (!a.ok) cnt[a.inf] = (cnt[a.inf] || 0) + 1; });
  const src = Object.keys(cnt).length ? cnt : (fallback || {});
  const top = Object.entries(src).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 12);
  return top.length ? `<table class="ttab"><tbody>${top.map(([inf, n]) => `<tr><td><b>${esc(inf)}</b>${byInf[inf] && byInf[inf].irr ? ' <span class="chip irr">rendhagyó</span>' : ''}</td><td class="muted">${esc(byInf[inf] ? byInf[inf].hu : '')}</td><td class="num">${n}×</td></tr>`).join('')}</tbody></table>` : '<p class="muted">Nincs hibája.</p>';
}
function rateRows(groups) {
  return groups.map(([label, o]) => {
    const p = Math.round(100 * o.ok / o.n);
    return `<tr><td>${label}</td><td class="num">${o.ok}/${o.n}</td><td style="width:40%"><div class="bar"><i style="width:${p}%"></i></div></td></tr>`;
  }).join('');
}
function group(log, key) {
  const g = {};
  log.forEach((a) => { const o = g[a[key]] || (g[a[key]] = { ok: 0, n: 0 }); o.n++; if (a.ok) o.ok++; });
  return g;
}
const summary = (s, log) => `${s.total || 0} válasz · ${pct(s.ok || 0, s.total || 0)} helyes · legjobb sorozat: ${s.best || 0} · ${new Set(log.map((a) => new Date(a.at).toDateString())).size} napon gyakorolt (a naplóban)`;

async function loadUser(u) {
  const box = $('teacher');
  box.innerHTML = '<p class="muted">Betöltés…</p>';
  let ans = [];
  try {
    const qs = await T.F.getDocs(T.F.query(T.F.collection(T.db, 'users', u.id, 'answers'), T.F.orderBy('at', 'desc'), T.F.limit(1000)));
    ans = qs.docs.map((d) => d.data());
  } catch (e) { console.warn(e); }
  const tra = ans.filter((a) => a.kind === 'trans');
  const conj = ans.filter((a) => a.kind !== 'vocab' && a.kind !== 'sent' && a.kind !== 'trans'), voc = ans.filter((a) => a.kind === 'vocab'), sen = ans.filter((a) => a.kind === 'sent');
  const s = u.stats || {}, v = u.vstats || {}, m = u.mstats || {}, x = u.xstats || {};
  const gS = group(sen, 't');
  const sentRows = rateRows(TENSES.filter((t) => gS[t.id]).map((t) => [t.it, gS[t.id]]));
  const gT = group(conj, 't'), gD = group(voc, 'dir');
  const tenseRows = rateRows(TENSES.filter((t) => gT[t.id]).map((t) => [t.it, gT[t.id]]));
  const dirRows = rateRows(Object.keys(DIRHU).filter((d) => gD[d]).map((d) => [DIRHU[d], gD[d]]));
  const none = '<p class="muted">Még nincs naplózott válasz.</p>';

  box.innerHTML = `
    <div class="actions" style="margin-top:0"><button class="btn quiet" id="t-back" type="button">← Vissza a listához</button></div>
    <div class="verb-line" style="margin-top:12px"><h2 class="inf" style="font-size:2rem" id="t-name"></h2><span class="hu mono" id="t-mail"></span></div>
    <p class="muted" style="margin:6px 0 0">Utoljára: ${fmt(u.updated)}</p>

    <div class="task" style="margin-top:20px"><span class="task-lbl">Napló</span><span class="task-tense">Ragozás</span></div>
    <p class="muted" style="margin:0">${summary(s, conj)}</p>
    <div class="tgrid2">
      <div><h3>Igeidők szerint</h3>${tenseRows ? `<table class="ttab"><tbody>${tenseRows}</tbody></table>` : none}</div>
      <div><h3>Legtöbbet rontott igék</h3>${missTable(conj, s.miss)}</div>
    </div>
    ${H3(`Legutóbbi válaszok (${conj.length})`)}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>Időpont</th><th>Ige</th><th>Idő</th><th>Személy</th><th>Beírta</th><th>Helyes alak</th><th></th></tr></thead>
      <tbody>${conj.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td><b>${esc(a.inf)}</b></td><td>${esc((TENSES.find((x) => x.id === a.t) || {}).it || a.t)}</td><td>${esc(PERS[a.p] || '')}</td><td class="mono">${esc(a.given || '—')}</td><td class="mono">${esc(a.right)}</td><td>${a.ok ? '<span class="okc">✓</span>' : '<span class="badc">✗</span>'}</td></tr>`).join('') || '<tr><td colspan="7" class="muted">Még nincs naplózott válasz.</td></tr>'}</tbody>
    </table></div>

    <div class="task" style="margin-top:28px"><span class="task-lbl">Napló</span><span class="task-tense">Szójelentés</span></div>
    <p class="muted" style="margin:0">${summary(v, voc)}</p>
    <div class="tgrid2">
      <div><h3>Irány szerint</h3>${dirRows ? `<table class="ttab"><tbody>${dirRows}</tbody></table>` : none}</div>
      <div><h3>Legtöbbet rontott igék</h3>${missTable(voc, v.miss)}</div>
    </div>
    ${H3(`Legutóbbi válaszok (${voc.length})`)}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>Időpont</th><th>Kérdés</th><th>Irány</th><th>Választotta</th><th>Helyes</th><th></th></tr></thead>
      <tbody>${voc.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td><b>${esc(a.dir === 'hu2it' ? (byInf[a.inf] ? byInf[a.inf].hu : a.inf) : a.inf)}</b></td><td>${esc(DIRHU[a.dir] || '')}</td><td>${esc(a.given || '—')}</td><td>${esc(a.right)}</td><td>${a.ok ? '<span class="okc">✓</span>' : '<span class="badc">✗</span>'}</td></tr>`).join('') || '<tr><td colspan="6" class="muted">Még nincs naplózott válasz.</td></tr>'}</tbody>
    </table></div>

    <div class="task" style="margin-top:28px"><span class="task-lbl">Napló</span><span class="task-tense">Mondatok</span></div>
    <p class="muted" style="margin:0">${summary(m, sen)}</p>
    <div class="tgrid2">
      <div><h3>Igeidők szerint</h3>${sentRows ? `<table class="ttab"><tbody>${sentRows}</tbody></table>` : none}</div>
      <div><h3>Legtöbbet rontott igék</h3>${missTable(sen, m.miss)}</div>
    </div>
    ${H3(`Legutóbbi válaszok (${sen.length})`)}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>Időpont</th><th>Mondat</th><th>Idő</th><th>Beírta</th><th>Helyes</th><th></th></tr></thead>
      <tbody>${sen.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td>${esc(SENT_BY[a.inf] ? SENT_BY[a.inf].it.replace('___', '…') : a.inf)} <span class="muted">(${esc(a.inf)})</span></td><td>${esc((TENSES.find((x) => x.id === a.t) || {}).it || a.t)}</td><td class="mono">${esc(a.given || '—')}</td><td class="mono">${esc(a.right)}</td><td>${a.ok ? '<span class="okc">✓</span>' : '<span class="badc">✗</span>'}</td></tr>`).join('') || '<tr><td colspan="6" class="muted">Még nincs naplózott válasz.</td></tr>'}</tbody>
    </table></div>

    <div class="task" style="margin-top:28px"><span class="task-lbl">Napló</span><span class="task-tense">Fordítás (AI-javítással)</span></div>
    <p class="muted" style="margin:0">${x.total || 0} fordítás · átlag: ${x.total ? (x.sum / x.total).toFixed(1) : '–'}/10 · hibátlan: ${pct(x.ok || 0, x.total || 0)}</p>
    ${H3(`Legutóbbi fordítások (${tra.length})`)}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>Időpont</th><th>Magyar</th><th>Fordítása</th><th>AI javítása</th><th class="num">Pont</th></tr></thead>
      <tbody>${tra.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td>${esc(a.hu || '')}</td><td class="mono">${esc(a.given || '')}</td><td class="mono">${esc(a.corrected || '')}</td><td class="num"><span class="${a.score >= 9 ? 'okc' : a.score >= 6 ? '' : 'badc'}">${a.score}/10</span></td></tr>`).join('') || '<tr><td colspan="5" class="muted">Még nincs naplózott fordítás.</td></tr>'}</tbody>
    </table></div>`;
  $('t-name').textContent = u.name || '(név nélkül)';
  $('t-mail').textContent = u.email || '';
  $('t-back').onclick = loadList;
}
