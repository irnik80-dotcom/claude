// A coniuga.html-ből (Claude artifact) elkészíti a webes változatot: docs/index.html
// Futtatás: node tools/build-site.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let src = readFileSync(join(root, 'coniuga.html'), 'utf8');

const must = (needle) => { if (!src.includes(needle)) throw new Error('Nem található: ' + needle); };

// 1) a Claude-specifikus viewport meta helyett rendes HTML-fej
must('<meta name="claude:viewport-fit-sides" content="cover">\n');
src = src.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '');

// 2) kiegészítő stílusok a bejelentkezéshez
const extraCss = `
body{margin:0}
[hidden]{display:none!important}
.auth{display:flex; flex-wrap:wrap; gap:8px; align-items:center}
dialog.login{border:1px solid var(--line); border-radius:14px; background:var(--card); color:var(--ink); padding:24px; width:min(400px, calc(100vw - 32px))}
dialog.login::backdrop{background:rgba(10,14,25,.45)}
dialog.login h2{font-family:var(--f-display); font-weight:400; margin:0 0 4px; font-size:1.6rem}
dialog.login form{display:grid; gap:10px; margin-top:14px}
dialog.login input{font:inherit; padding:10px 12px; border-radius:8px; border:1.5px solid var(--line); background:var(--paper); color:var(--ink)}
dialog.login .or{display:flex; align-items:center; gap:10px; color:var(--ink-soft); font-size:.8rem; margin-top:14px}
dialog.login .or::before, dialog.login .or::after{content:""; flex:1; border-top:1px solid var(--line)}
dialog.login .err{color:var(--pen); font-size:.88rem; margin:0; min-height:1.2em}
dialog.login .row{display:flex; flex-wrap:wrap; gap:8px}
dialog.login .row .btn{flex:1 1 140px}
.linkbtn{font:inherit; background:none; border:0; color:var(--accent); cursor:pointer; padding:0; text-decoration:underline; font-size:.88rem; justify-self:start}
`;
must('</style>');
src = src.replace('</style>', extraCss + '</style>');

// 3) bejelentkezés gomb a fejlécbe
must('<nav class="tabs" role="tablist">');
src = src.replace('<nav class="tabs" role="tablist">',
  '<div class="auth" id="auth" hidden><button class="btn ghost" id="login-open" type="button">Bejelentkezés</button><button class="btn quiet" id="logout" type="button" hidden>Kijelentkezés</button></div>\n    <nav class="tabs" role="tablist">');

// 4) a Claude-os profilkezelés helyett Firebase
must('\ninitCloud();');
src = src.replace('\ninitCloud();', '');

const dialog = `
<dialog class="login" id="login">
  <h2>Bejelentkezés</h2>
  <p class="muted" style="margin:0">Így minden eszközödön megmaradnak az eredményeid.</p>
  <div class="row" style="margin-top:16px"><button class="btn" id="login-google" type="button">Belépés Google-fiókkal</button></div>
  <div class="or">vagy e-maillel</div>
  <form id="login-form" method="dialog">
    <input id="login-email" type="email" autocomplete="email" placeholder="E-mail-cím" required>
    <input id="login-pass" type="password" autocomplete="current-password" placeholder="Jelszó (legalább 6 karakter)" required minlength="6">
    <p class="err" id="login-err" role="alert"></p>
    <div class="row">
      <button class="btn" type="submit" id="login-submit">Belépés</button>
      <button class="btn ghost" type="button" id="login-register">Regisztráció</button>
    </div>
    <button class="linkbtn" type="button" id="login-reset">Elfelejtettem a jelszavam</button>
    <button class="btn quiet" type="button" id="login-close">Mégse</button>
  </form>
</dialog>
<script type="module" src="auth.js"></script>
`;

const head = `<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Olasz igeragozás gyakorló: több mint 300 ige, hat igeidő, a rendhagyó alakok jelölésével.">
`;
must('<div class="wrap">');
src = head + src.replace('<div class="wrap">', '</head>\n<body>\n<div class="wrap">') + dialog + '</body>\n</html>\n';

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs', 'index.html'), src);
console.log('docs/index.html elkészült (' + src.length + ' bájt)');
