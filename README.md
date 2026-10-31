# Coniuga

Olasz igeragozás gyakorló: 319 ige három szinten, hat igeidő/mód, a rendhagyó alakok jelölve.

- `coniuga.html`: a forrás (ez fut Claude artifactként is).
- `docs/`: a nyilvános weboldal (GitHub Pages), saját bejelentkezéssel (Firebase). Fülek: Ragozás, Szójelentés (4 lehetőség közül), Igetár, Tanári nézet.
  A `docs/index.html` generált fájl. Ha a `coniuga.html` változik: `node tools/build-site.mjs`.
- `firestore.rules`: az adatbázis biztonsági szabályai (mindenki csak a saját profilját látja).

## Weboldal beüzemelése

### 1. Firebase-projekt (bejelentkezés + adatbázis), ingyenes
1. Nyisd meg: https://console.firebase.google.com → **Create a project** (Projekt létrehozása). Név pl. `coniuga`. A Google Analytics kikapcsolható.
2. A projekt főoldalán kattints a **`</>`** (Web) ikonra → becenév: `coniuga` → **Register app**. A *Firebase Hosting* jelölőnégyzetet ne pipáld be.
3. Megjelenik egy `const firebaseConfig = { ... }` blokk. Az értékeit másold be a `docs/firebase-config.js` fájlba (vagy küldd el Claude-nak, és ő beírja).
4. Bal menü **Build → Authentication → Get started** → **Sign-in method** fül:
   - **Google** → Enable → adj meg egy support e-mail-címet → Save.
   - **Email/Password** → Enable (csak az első kapcsoló) → Save.
5. **Authentication → Settings → Authorized domains → Add domain**: `irnik80-dotcom.github.io`
6. Bal menü **Build → Firestore Database → Create database** → helyszín: `eur3 (europe-west)` → **Start in production mode** → Create.
7. A Firestore **Rules** fülén töröld a meglévő szöveget, másold be a `firestore.rules` tartalmát → **Publish**.

### 2. GitHub Pages (a weboldal tárhelye), ingyenes
1. Ingyenes GitHub-fióknál a Pages csak nyilvános repóból működik: **Settings → General → Danger Zone → Change visibility → Make public**.
   (A repóban nincs titkos adat; a Firebase-beállítás nyilvánosnak készült, az adatokat a szabályok védik.)
2. Az `claude/italian-verb-practice-385vui` ágat olvaszd be a `main` ágba (Pull request → Merge).
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main`, mappa: **`/docs`** → Save.
4. 1–2 perc múlva az oldal elérhető: **https://irnik80-dotcom.github.io/claude/**
