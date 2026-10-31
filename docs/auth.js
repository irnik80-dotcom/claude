// Bejelentkezés (Firebase Authentication) és a profil mentése (Cloud Firestore).
// Az oldal fő szkriptje globálisan adja: attachCloud(ref, me), detachCloud(), setWho(me, msg).
import { firebaseConfig } from './firebase-config.js';

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
      try { await attachCloud(cloud, me); }
      catch (e) { console.error(e); setWho(null, 'Belépve, de a mentett adataidat most nem sikerült betölteni.'); }
    } else if (attachedUid) {
      attachedUid = null;
      detachCloud();
    }
  });
}
