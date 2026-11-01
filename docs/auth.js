// Bejelentkezés (Firebase Authentication) és a profil mentése (Cloud Firestore).
// Az oldal fő szkriptje globálisan adja: attachCloud(ref, me), detachCloud(), setWho(me, msg), t(key, vars), LANG.
import { firebaseConfig } from './firebase-config.js';
import { AI_URL } from './ai-config.js';

const $ = (id) => document.getElementById(id);

if (!firebaseConfig.apiKey) {
  // Nincs még beállítva: az oldal böngészős mentéssel működik.
  console.info('Coniuga: a Firebase nincs beállítva (docs/firebase-config.js), csak böngészős mentés.');
} else {
  start().catch((e) => {
    console.error(e);
    setWho(null, t('auth.unavail'));
  });
}

const msgOf = (e) => {
  const code = e && e.code;
  if (code && I18N[code]) return t(code);
  return t('auth.failed') + ((e && e.message) || '');
};

async function start() {
  const V = '10.12.2';
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  auth.languageCode = LANG;
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
  const AI_OFF = AI_URL ? 'ai.login' : 'ai.notset';
  setAINote(AI_OFF);
  $('login-open').onclick = () => { err.textContent = ''; auth.languageCode = LANG; dlg.showModal(); };
  $('login-close').onclick = () => dlg.close();
  $('login-google').onclick = () => run(() => A.signInWithPopup(auth, new A.GoogleAuthProvider()));
  $('login-form').onsubmit = (e) => { e.preventDefault(); run(() => A.signInWithEmailAndPassword(auth, email(), pass())); };
  $('login-register').onclick = () => {
    if (!$('login-form').reportValidity()) return;
    run(() => A.createUserWithEmailAndPassword(auth, email(), pass()));
  };
  $('login-reset').onclick = async () => {
    if (!email()) { err.textContent = t('auth.resetmail'); return; }
    try { auth.languageCode = LANG; await A.sendPasswordResetEmail(auth, email()); err.textContent = t('auth.resetsent'); }
    catch (e) { err.textContent = msgOf(e); }
  };
  $('logout').onclick = () => A.signOut(auth);

  let attachedUid = null;
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('#who-edit') && typeof window.renameSelf === 'function') window.renameSelf(); });
  A.onAuthStateChanged(auth, async (u) => {
    $('login-open').hidden = !!u;
    $('logout').hidden = !u;
    if (u) {
      if (attachedUid === u.uid) return;
      attachedUid = u.uid;
      const ref = F.doc(db, 'users', u.uid);
      const cloud = {
        get: async () => {
          const s = await F.getDoc(ref); const d = s.exists() ? s.data() : null;
          if (d && d.name && !cloudExtra.name) { cloudExtra.name = d.name; me.name = d.name; }
          if (d && d.tlabels) cloudExtra.tlabels = d.tlabels;
          return { exists: s.exists(), data: () => d };
        },
        set: (obj) => F.setDoc(ref, obj)
      };
      const me = { name: u.displayName || u.email || '', avatarUrl: u.photoURL || '' };
      cloudExtra = { name: u.displayName || '', email: u.email || '' };
      const answers = F.collection(db, 'users', u.uid, 'answers');
      answerHook = (a) => { F.addDoc(answers, Object.assign({ tl: TL }, a)).catch((e) => console.warn('Válasz naplózása sikertelen', e)); };
      const boardRef = F.doc(db, 'board', u.uid);
      boardBackend = {
        uid: u.uid,
        name: u.displayName || (u.email || '').split('@')[0],
        push: (e) => F.setDoc(boardRef, { name: String(e.name || '?').slice(0, 24), week: e.week, pts: Math.max(0, Math.floor(e.pts || 0)), streak: Math.max(0, Math.floor(e.streak || 0)), at: Date.now() }),
        remove: () => F.deleteDoc(boardRef),
        list: async (week) => {
          const snap = await F.getDocs(F.query(F.collection(db, 'board'), F.where('week', '==', week), F.limit(200)));
          return snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
        }
      };
      if (AI_URL) {
        aiBackend = async (p) => {
          const tok = await u.getIdToken();
          let r;
          try {
            r = await fetch(AI_URL, { method: 'POST', signal: AbortSignal.timeout(65000), headers: { 'Authorization': 'Bearer ' + tok, 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
          } catch (e) { throw new Error(e && (e.name === 'TimeoutError' || e.name === 'AbortError') ? t('ai.slow') : (navigator.onLine === false ? t('ai.network') : t('ai.slow'))); }
          const j = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(j.message || t('ai.unavail'));
          return j;
        };
        setAINote('ai.gemini');
      }
      window.renameSelf = async (ask) => {
        const n = (prompt(ask || t('who.askname'), cloudExtra.name || '') || '').trim().slice(0, 40);
        if (!n) return;
        cloudExtra.name = n; me.name = n;
        try { await A.updateProfile(u, { displayName: n }); } catch (e) { console.warn(e); }
        setWho(me); scheduleCloud();
      };
      try { await attachCloud(cloud, me); }
      catch (e) { console.error(e); setWho(null, t('auth.loaderr')); }
      if (!cloudExtra.name) setTimeout(() => window.renameSelf(t('who.askname')), 400);
      teacherCheck(F, db);
    } else if (attachedUid) {
      attachedUid = null;
      answerHook = null; cloudExtra = {}; aiBackend = null; setAINote(AI_OFF); window.renameSelf = null;
      boardBackend = null; BOARD.rows = null; if (typeof renderBoard === 'function') renderBoard();
      $('tab-teacher').hidden = true;
      if (!$('view-teacher').hidden) showTab('practice');
      detachCloud();
    }
  });
}

/* ---------- Tanári nézet ---------- */
const LOCALE = { hu: 'hu-HU', pl: 'pl-PL', en: 'en-GB' };
const fmt = (ms) => ms ? new Date(ms).toLocaleString(LOCALE[LANG] || 'hu-HU', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–';
const pct = (a, b) => b ? Math.round(100 * a / b) + '%' : '–';
const nameOf = (u) => ((cloudExtra.tlabels || {})[u.id]) || u.name || t('t.noname');
const tname = (id) => (TENSES.find((x) => x.id === id) || {}).it || id;
let T = null; // {F, db, rows}
let view = null; // 'list' | felhasználó objektum

async function teacherCheck(F, db) {
  try {
    await F.getDocs(F.query(F.collection(db, 'users'), F.limit(1)));
  } catch (e) { return; } // nem tanár: a szabály elutasítja
  T = { F, db, rows: [] };
  const tab = $('tab-teacher');
  tab.hidden = false;
  tab.onclick = () => { showTab('teacher'); loadList(); };
}
// nyelvváltáskor a nyitott tanári nézet is újrarajzolódik
window.onLangChange = () => {
  if (!T || $('view-teacher').hidden) return;
  if (view === 'list') renderList(); else if (view) loadUser(view);
};

const H3 = (s) => `<h3 style="font-size:.72rem;letter-spacing:.09em;text-transform:uppercase;color:var(--ink-soft);margin:22px 0 0">${s}</h3>`;
const DIRS_T = () => ({ it2hu: t('dir.it2x.btn'), hu2it: t('dir.x2it.btn') });

async function loadList() {
  const box = $('teacher');
  box.innerHTML = `<p class="muted">${t('t.loading')}</p>`;
  try {
    const qs = await T.F.getDocs(T.F.collection(T.db, 'users'));
    T.rows = qs.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => (b.updated || 0) - (a.updated || 0));
  } catch (e) { box.innerHTML = `<p class="badc">${t('t.loaderr')}${esc(e.message || '')}</p>`; return; }
  renderList();
}

function renderList() {
  view = 'list';
  const box = $('teacher'), r = T.rows;
  box.innerHTML = `
    <div class="verb-line"><h2 class="inf" style="font-size:2rem">${t('tab.teacher')}</h2><span class="hu">${t('t.users', { n: r.length })}</span></div>
    <div class="actions" style="margin-top:8px"><button class="btn quiet" id="t-refresh" type="button">${t('t.refresh')}</button></div>
    <div class="tscroll"><table class="ttab">
      <thead><tr><th rowspan="2">${t('t.name')}</th><th rowspan="2">${t('t.email')}</th><th colspan="2" style="text-align:center">${t('tab.practice')}</th><th colspan="2" style="text-align:center">${t('tab.vocab')}</th><th colspan="2" style="text-align:center">${t('tab.sent')}</th><th colspan="2" style="text-align:center">${t('tab.trans')}</th><th colspan="2" style="text-align:center">${t('tab.chat')}</th><th colspan="2" style="text-align:center">${t('tab.read')}</th><th colspan="2" style="text-align:center">${t('tab.adv')}</th><th rowspan="2">${t('t.last')}</th></tr>
      <tr><th class="num">${t('t.answers')}</th><th class="num">${t('t.correct')}</th><th class="num">${t('t.answers')}</th><th class="num">${t('t.correct')}</th><th class="num">${t('t.answers')}</th><th class="num">${t('t.correct')}</th><th class="num">${t('t.count')}</th><th class="num">${t('t.avg')}</th><th class="num">${t('t.count')}</th><th class="num">${t('t.avg')}</th><th class="num">${t('t.count')}</th><th class="num">${t('t.correct')}</th><th class="num">${t('t.count')}</th><th class="num">★</th></tr></thead>
      <tbody>${r.map((u, k) => {
        const L = TL === 'es' ? (u.es || {}) : u;
        const s = L.stats || {}, v = L.vstats || {}, m = L.mstats || {}, x = L.xstats || {}, c = L.cstats || {}, rd = L.rstats || {}, ad = L.astats || {};
        return `<tr class="click" data-k="${k}" tabindex="0"><td><b></b></td><td class="mono"></td><td class="num">${s.total || 0}</td><td class="num">${pct(s.ok || 0, s.total || 0)}</td><td class="num">${v.total || 0}</td><td class="num">${pct(v.ok || 0, v.total || 0)}</td><td class="num">${m.total || 0}</td><td class="num">${pct(m.ok || 0, m.total || 0)}</td><td class="num">${x.total || 0}</td><td class="num">${x.total ? (x.sum / x.total).toFixed(1) : '–'}</td><td class="num">${c.total || 0}</td><td class="num">${c.total ? (c.sum / c.total).toFixed(1) : '–'}</td><td class="num">${rd.total || 0}</td><td class="num">${pct(rd.ok || 0, rd.q || 0)}</td><td class="num">${ad.total || 0}</td><td class="num">${ad.good || 0}</td><td>${fmt(u.updated)}</td></tr>`;
      }).join('') || `<tr><td colspan="17" class="muted">${t('t.nobody')}</td></tr>`}</tbody>
    </table></div>
    <p class="muted">${t('t.tap')}</p>`;
  box.querySelectorAll('tr.click').forEach((tr) => {
    const u = r[+tr.dataset.k];
    tr.cells[0].firstChild.textContent = nameOf(u);
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
  return top.length ? `<table class="ttab"><tbody>${top.map(([inf, n]) => `<tr><td><b>${esc(inf)}</b>${byInf[inf] && byInf[inf].irr ? ` <span class="chip irr">${t('irr')}</span>` : ''}</td><td class="muted">${esc(byInf[inf] ? byInf[inf].hu : '')}</td><td class="num">${n}×</td></tr>`).join('')}</tbody></table>` : `<p class="muted">${t('t.nomiss')}</p>`;
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
const summary = (s, log) => t('t.summary', { n: s.total || 0, p: pct(s.ok || 0, s.total || 0), b: s.best || 0, d: new Set(log.map((a) => new Date(a.at).toDateString())).size });
const okMark = (a) => a.ok ? '<span class="okc">✓</span>' : '<span class="badc">✗</span>';
const section = (title) => `<div class="task" style="margin-top:28px"><span class="task-lbl">${t('t.log')}</span><span class="task-tense">${title}</span></div>`;

async function loadUser(u) {
  view = u;
  const box = $('teacher');
  box.innerHTML = `<p class="muted">${t('t.loading')}</p>`;
  let ans = [];
  try {
    const qs = await T.F.getDocs(T.F.query(T.F.collection(T.db, 'users', u.id, 'answers'), T.F.orderBy('at', 'desc'), T.F.limit(1000)));
    ans = qs.docs.map((d) => d.data()).filter((a) => (a.tl || 'it') === TL);
  } catch (e) { console.warn(e); }
  const tra = ans.filter((a) => a.kind === 'trans'), chats = ans.filter((a) => a.kind === 'chat'), reads = ans.filter((a) => a.kind === 'read'), advs = ans.filter((a) => a.kind === 'adv');
  const L = TL === 'es' ? (u.es || {}) : u;
  const cs = L.cstats || {}, rs = L.rstats || {}, as = L.astats || {};
  const conj = ans.filter((a) => !a.kind || a.kind === 'conj'), voc = ans.filter((a) => a.kind === 'vocab'), sen = ans.filter((a) => a.kind === 'sent');
  const s = L.stats || {}, v = L.vstats || {}, m = L.mstats || {}, x = L.xstats || {};
  const DIRS_ = DIRS_T();
  const gS = group(sen, 't'), gT = group(conj, 't'), gD = group(voc, 'dir');
  const sentRows = rateRows(TENSES.filter((q) => gS[q.id]).map((q) => [q.it, gS[q.id]]));
  const tenseRows = rateRows(TENSES.filter((q) => gT[q.id]).map((q) => [q.it, gT[q.id]]));
  const dirRows = rateRows(Object.keys(DIRS_).filter((d) => gD[d]).map((d) => [DIRS_[d], gD[d]]));
  const none = `<p class="muted">${t('t.nolog')}</p>`;
  const hears = ans.filter((a) => a.kind === 'dict' || a.kind === 'pron'), grams = ans.filter((a) => a.kind === 'gram');
  const gG = group(grams, 'gtype');
  const gramRows = rateRows(['art', 'prep', 'pron', 'neg', 'ger', 'vprep'].filter((k) => gG[k]).map((k) => [t('g.t.' + k), gG[k]]));
  const ps = u.pstats || {};
  const noRow = (n) => `<tr><td colspan="${n}" class="muted">${t('t.nolog')}</td></tr>`;

  box.innerHTML = `
    <div class="actions" style="margin-top:0"><button class="btn quiet" id="t-back" type="button">${t('t.back')}</button>${pdfBtn('teacher')}</div>
    <div class="verb-line" style="margin-top:12px"><h2 class="inf" style="font-size:2rem" id="t-name"></h2><span class="hu mono" id="t-mail"></span></div>
    <div class="actions" style="margin-top:6px"><button class="btn quiet" id="t-rename" type="button">✏️ ${t('t.rename')}</button><span class="muted" id="t-orig"></span></div>
    <p class="muted" style="margin:6px 0 0">${t('t.lastseen', { d: fmt(u.updated) })} · ${t('p.total')}: <b>${ps.total || 0}</b> · ${t('p.best')}: <b>${ps.best || 0}</b></p>

    ${section(t('tab.practice'))}
    <p class="muted" style="margin:0">${summary(s, conj)}</p>
    <div class="tgrid2">
      <div><h3>${t('t.byTense')}</h3>${tenseRows ? `<table class="ttab"><tbody>${tenseRows}</tbody></table>` : none}</div>
      <div><h3>${t('t.missed')}</h3>${missTable(conj, s.miss)}</div>
    </div>
    ${H3(t('t.recent', { n: conj.length }))}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th>${t('t.verb')}</th><th>${t('t.tense')}</th><th>${t('t.person')}</th><th>${t('t.typed')}</th><th>${t('t.right')}</th><th></th></tr></thead>
      <tbody>${conj.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td><b>${esc(a.inf)}</b></td><td>${esc(tname(a.t))}</td><td>${esc(personLabel(a.t, a.p) || '')}</td><td class="mono">${esc(a.given || '—')}</td><td class="mono">${esc(a.right)}</td><td>${okMark(a)}</td></tr>`).join('') || noRow(7)}</tbody>
    </table></div>

    ${section(t('tab.vocab'))}
    <p class="muted" style="margin:0">${summary(v, voc)}</p>
    <div class="tgrid2">
      <div><h3>${t('t.byDir')}</h3>${dirRows ? `<table class="ttab"><tbody>${dirRows}</tbody></table>` : none}</div>
      <div><h3>${t('t.missed')}</h3>${missTable(voc, v.miss)}</div>
    </div>
    ${H3(t('t.recent', { n: voc.length }))}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th>${t('t.question')}</th><th>${t('t.dir')}</th><th>${t('t.chose')}</th><th>${t('t.rightans')}</th><th></th></tr></thead>
      <tbody>${voc.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td><b>${esc(a.dir === 'hu2it' ? (byInf[a.inf] ? byInf[a.inf].hu : a.inf) : a.inf)}</b></td><td>${esc(DIRS_[a.dir] || '')}</td><td>${esc(a.given || '—')}</td><td>${esc(a.right)}</td><td>${okMark(a)}</td></tr>`).join('') || noRow(6)}</tbody>
    </table></div>

    ${section(t('tab.sent'))}
    <p class="muted" style="margin:0">${summary(m, sen)}</p>
    <div class="tgrid2">
      <div><h3>${t('t.byTense')}</h3>${sentRows ? `<table class="ttab"><tbody>${sentRows}</tbody></table>` : none}</div>
      <div><h3>${t('t.missed')}</h3>${missTable(sen, m.miss)}</div>
    </div>
    ${H3(t('t.recent', { n: sen.length }))}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th>${t('t.sentence')}</th><th>${t('t.tense')}</th><th>${t('t.typed')}</th><th>${t('t.rightans')}</th><th></th></tr></thead>
      <tbody>${sen.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td>${esc(SENT_BY[a.inf] ? SENT_BY[a.inf].it.replace('___', '…') : a.inf)} <span class="muted">(${esc(a.inf)})</span></td><td>${esc(tname(a.t))}</td><td class="mono">${esc(a.given || '—')}</td><td class="mono">${esc(a.right)}</td><td>${okMark(a)}</td></tr>`).join('') || noRow(6)}</tbody>
    </table></div>

    ${section(t('t.transAI'))}
    <p class="muted" style="margin:0">${t('t.xsummary', { n: x.total || 0, a: x.total ? (x.sum / x.total).toFixed(1) : '–', p: pct(x.ok || 0, x.total || 0) })}</p>
    ${H3(t('t.recentx', { n: tra.length }))}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th>${t('t.source')}</th><th>${t('t.theirs')}</th><th>${t('t.aifix')}</th><th class="num">${t('t.score')}</th></tr></thead>
      <tbody>${tra.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td>${esc(a.hu || '')}${a.lang && a.lang !== 'hu' ? ` <span class="muted">(${esc(a.lang.toUpperCase())})</span>` : ''}</td><td class="mono">${esc(a.given || '')}</td><td class="mono">${esc(a.corrected || '')}</td><td class="num"><span class="${a.score >= 9 ? 'okc' : a.score >= 6 ? '' : 'badc'}">${a.score}/10</span></td></tr>`).join('') || `<tr><td colspan="5" class="muted">${t('t.noxlog')}</td></tr>`}</tbody>
    </table></div>

    ${section(t('tab.chat'))}
    <p class="muted" style="margin:0">${t('t.csummary', { n: cs.total || 0, a: cs.total ? (cs.sum / cs.total).toFixed(1) : '–' })}</p>
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th>${t('t.scen')}</th><th>${t('t.level')}</th><th class="num">${t('t.turns')}</th><th class="num">${t('t.score')}</th><th>${t('t.summaryCol')}</th></tr></thead>
      <tbody>${chats.slice(0, 100).map((a) => `<tr><td>${fmt(a.at)}</td><td>${esc(t('scen.' + a.scenario))}${a.topic ? ': ' + esc(a.topic) : ''}${a.lang && a.lang !== 'hu' ? ` <span class="muted">(${esc(a.lang.toUpperCase())})</span>` : ''}</td><td>${esc(a.level || '')}</td><td class="num">${a.turns || 0}</td><td class="num"><span class="${a.score >= 8 ? 'okc' : a.score >= 5 ? '' : 'badc'}">${a.score}/10</span></td><td>${esc(a.summary || '')}</td></tr>`).join('') || `<tr><td colspan="6" class="muted">${t('t.nochat')}</td></tr>`}</tbody>
    </table></div>

    ${section(t('tab.read'))}
    <p class="muted" style="margin:0">${t('t.rsummary', { n: rs.total || 0, p: pct(rs.ok || 0, rs.q || 0) })}</p>
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th>${t('t.title')}</th><th>${t('t.level')}</th><th>${t('t.tense')}</th><th class="num">${t('t.result')}</th></tr></thead>
      <tbody>${reads.slice(0, 100).map((a) => `<tr><td>${fmt(a.at)}</td><td>${esc(a.title || '')}</td><td>${esc(a.level || '')}</td><td>${esc((a.tenses || []).map(tname).join(', '))}</td><td class="num"><span class="${a.score === a.total ? 'okc' : a.score ? '' : 'badc'}">${a.score}/${a.total}</span></td></tr>`).join('') || `<tr><td colspan="5" class="muted">${t('t.noread')}</td></tr>`}</tbody>
    </table></div>

    ${section(t('tab.adv'))}
    <p class="muted" style="margin:0">${t('t.asummary', { n: as.total || 0, g: as.good || 0 })}</p>
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th>${t('t.title')}</th><th>${t('t.genre')}</th><th>${t('t.level')}</th><th class="num">${t('t.pagesCol')}</th><th>${t('t.ending')}</th></tr></thead>
      <tbody>${advs.slice(0, 100).map((a) => `<tr><td>${fmt(a.at)}</td><td>${esc(a.title || '')}${a.lang && a.lang !== 'hu' ? ` <span class="muted">(${esc(a.lang.toUpperCase())})</span>` : ''}</td><td>${esc(t('genre.' + a.genre))}</td><td>${esc(a.level || '')}</td><td class="num">${a.pages || 0}</td><td>${a.ending === 'good' ? '<span class="okc">★</span>' : '<span class="badc">✗</span>'}</td></tr>`).join('') || `<tr><td colspan="6" class="muted">${t('t.noadv')}</td></tr>`}</tbody>
    </table></div>

    ${section(t('tab.hear'))}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th></th><th>${t('t.sentence')}</th><th>${t('t.typed')}</th><th class="num">%</th></tr></thead>
      <tbody>${hears.slice(0, 150).map((a) => `<tr><td>${fmt(a.at)}</td><td>${a.kind === 'pron' ? '🎤' : '✍️'}</td><td>${esc(a.sentence || '')}</td><td class="mono">${esc((a.kind === 'pron' ? a.heard : a.given) || '—')}</td><td class="num"><span class="${a.score >= 90 ? 'okc' : a.score >= 60 ? '' : 'badc'}">${a.score || 0}</span></td></tr>`).join('') || noRow(5)}</tbody>
    </table></div>

    ${section(t('tab.gram'))}
    ${gramRows ? `<table class="ttab"><tbody>${gramRows}</tbody></table>` : none}
    <div class="tscroll"><table class="ttab">
      <thead><tr><th>${t('t.time')}</th><th></th><th>${t('t.question')}</th><th>${t('t.typed')}</th><th>${t('t.rightans')}</th><th></th></tr></thead>
      <tbody>${grams.slice(0, 200).map((a) => `<tr><td>${fmt(a.at)}</td><td>${esc(t('g.t.' + a.gtype))}</td><td>${esc(a.q || '')}</td><td class="mono">${esc(a.given || '—')}</td><td class="mono">${esc(a.right || '')}</td><td>${okMark(a)}</td></tr>`).join('') || noRow(6)}</tbody>
    </table></div>`;
  const showName = () => {
    $('t-name').textContent = nameOf(u);
    $('t-orig').textContent = (cloudExtra.tlabels || {})[u.id] && u.name ? t('t.origname', { n: u.name }) : '';
  };
  showName();
  $('t-rename').onclick = () => {
    const v = prompt(t('t.renameq'), (cloudExtra.tlabels || {})[u.id] || u.name || '');
    if (v === null) return;
    const labels = Object.assign({}, cloudExtra.tlabels || {});
    if (v.trim()) labels[u.id] = v.trim().slice(0, 40); else delete labels[u.id];
    cloudExtra.tlabels = labels; showName(); scheduleCloud();
  };
  $('t-mail').textContent = u.email || '';
  $('t-back').onclick = loadList;
  PDF.teacher = () => printDoc(`${nameOf(u) || u.email}`, `<p class="pmeta">${esc(u.email || '')} · ${esc(t('tab.teacher'))}</p>` + printableClone($('teacher')).replace(/<h2[^>]*id="t-name"[^>]*>[\s\S]*?<\/h2>/, ''));
}
