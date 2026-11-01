#!/usr/bin/env python3
"""Oldalak előállítása: docs/<téma>.html (GitHub Pages) és önálló, beágyazott változatok (artifacthoz).
Használat: python3 tools/build.py [kimeneti_mappa_az_artifacthoz]"""
import os, sys, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')
TOPICS = {
  'bevezetes':     ('Bevezetés a fizikába', 'Fizika 7. · I. fejezet'),
  'energia':       ('Energia', 'Fizika 7. · II. fejezet'),
  'mozgas':        ('Mozgás és erő', 'Fizika 7. · III. fejezet'),
  'lendulet':      ('Lendület és egyszerű gépek', 'Fizika 7. · IV. fejezet'),
  'vizlevego':     ('Víz és levegő', 'Fizika 7. · V. fejezet'),
  'elektromossag': ('Elektromosság', 'Fizika 7. · VI. fejezet'),
  'feny':          ('Világítás, fény', 'Fizika 7. · VII. fejezet'),
  'hullamok':      ('Hullámok', 'Fizika 7. · VIII. fejezet'),
  'kornyezet':     ('Környezetünk globális problémái', 'Fizika 7. · IX. fejezet'),
  'egijelensegek': ('Égi jelenségek', 'Fizika 7. · X. fejezet'),
}
def rd(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()

BODY = '''<header class="top">
  <a class="brand" href="index.html">⛏ FIZIKA<br>KALANDOK</a>
  <div class="tools">
    <button class="tool" id="ttsBtn" type="button" aria-label="Felolvasás">🔊</button>
    <button class="tool" id="fsBtn" type="button" aria-label="Betűméret váltása">Aa</button>
    <button class="tool" id="themeBtn" type="button" aria-label="Világos / sötét mód">🌓</button>
  </div>
  <div class="row2"><span class="chip" id="chip"></span><div class="bar" aria-hidden="true"><i id="barfill" style="width:0"></i></div></div>
</header>
<main id="stage" tabindex="-1"></main>
<div class="nav">
  <button class="btn alt" id="back" type="button">◀ Vissza</button>
  <button class="btn" id="next" type="button">Tovább ▶</button>
</div>
'''
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;800&family=Press+Start+2P&display=swap">'

def page(t, inline):
    title = TOPICS[t][0]
    head = '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<title>%s – Fizika kalandok</title>\n%s\n' % (title, FONTS)
    if inline:
        css = '<style>%s</style>' % rd('assets/style.css')
        js = '<script>%s</script>\n<script>%s</script>\n<script>%s</script>' % (rd('assets/svg.js'), rd('topics/%s.js' % t), rd('assets/engine.js'))
    else:
        css = '<link rel="stylesheet" href="assets/style.css">'
        js = '<script src="assets/svg.js"></script>\n<script src="topics/%s.js"></script>\n<script src="assets/engine.js"></script>' % t
    return '<!doctype html>\n<html lang="hu">\n<head>\n%s%s\n</head>\n<body class="fs-1">\n%s%s\n</body>\n</html>\n' % (head, css, BODY, js)

CARDS = [
  ('bevezetes', '📏', 'Bevezetés a fizikába', 'Mérés, sűrűség, idő, hőmérséklet', 'I. fejezet'),
  ('energia', '⚡', 'Energia', 'Energiafajták, energiaforrások, teljesítmény', 'II. fejezet'),
  ('mozgas', '🏃', 'Mozgás és erő', 'Sebesség, gyorsulás, Newton törvényei', 'III. fejezet'),
  ('lendulet', '🏀', 'Lendület és egyszerű gépek', 'Ütközés, forgás, inga, munka, emelők', 'IV. fejezet'),
  ('vizlevego', '💧', 'Víz és levegő', 'Halmazállapotok, nyomás, Arkhimédész', 'V. fejezet'),
  ('elektromossag', '🔌', 'Elektromosság', 'Áram, feszültség, Ohm, mágnesek', 'VI. fejezet'),
  ('feny', '💡', 'Világítás, fény', 'Tükrök, fénytörés, lencsék, szem', 'VII. fejezet'),
  ('hullamok', '🔊', 'Hullámok', 'Hang, hangszerek, fényhullámok', 'VIII. fejezet'),
  ('kornyezet', '🌍', 'Környezetünk globális problémái', 'Légkör, energiatakarékosság, klíma', 'IX. fejezet'),
  ('egijelensegek', '🪐', 'Égi jelenségek', 'Nap, Hold, bolygók, űrkutatás', 'X. fejezet'),
]
SOON = []

def index(inline):
    cards = ''.join('<a class="lesson-link" href="%s.html"><div class="card"><div class="big-icon">%s</div><h2>%s</h2><p>%s</p><p class="hint">%s · tanulás, játék, dolgozat gyakorló</p></div></a>\n    ' % (k, i, n, d, c) for k, i, n, d, c in CARDS)
    soon = ''.join('<div class="card soon"><div class="big-icon">🔒</div><h2>%s</h2><p>Hamarosan</p></div>\n    ' % s for s in SOON)
    css = ('<style>%s</style>' % rd('assets/style.css')) if inline else '<link rel="stylesheet" href="assets/style.css">'
    return '''<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Fizika kalandok</title>
%s
%s
</head>
<body class="fs-1 home">
<header class="top"><span class="brand">⛏ FIZIKA<br>KALANDOK</span></header>
<main>
  <h1 style="font-size:1.6em;margin:0 0 6px">Szia! Mit tanulunk ma?</h1>
  <p class="hint" style="margin:0 0 18px">7. osztályos fizika – rövid, képes leckék, játékok és dolgozat gyakorló.</p>
  <div class="grid">
    %s%s</div>
</main>
</body>
</html>
''' % (FONTS, css, cards, soon)

if __name__ == '__main__':
    for t in TOPICS:
        open(os.path.join(ROOT, t + '.html'), 'w', encoding='utf-8').write(page(t, False))
    open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(index(False))
    if len(sys.argv) > 1:
        out = sys.argv[1]; os.makedirs(out, exist_ok=True)
        for t in TOPICS:
            open(os.path.join(out, t + '.html'), 'w', encoding='utf-8').write(page(t, True))
        open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(index(True))
    print('kész')
