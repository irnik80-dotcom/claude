// A ragozó motorokat bemásolja a coniuga.html-be a jelölők közé:
//   tools/engine-es.js   -> /*ENGINE-ES-START*/ … /*ENGINE-ES-END*/      (spanyol)
//   tools/engine-slav.js -> /*ENGINE-SLAV-START*/ … /*ENGINE-SLAV-END*/  (orosz és lengyel; a TL dönti el, melyik)
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
let html = readFileSync(root + 'coniuga.html', 'utf8');
for (const [file, tag, name] of [['engine-es.js', 'ES', 'spanyol'], ['engine-slav.js', 'SLAV', 'orosz/lengyel']]){
  const src = readFileSync(root + 'tools/' + file, 'utf8').replace(/\nif \(typeof module[^\n]*\n?$/, '\n');
  if (src.includes('</script')) throw new Error('a motorban nem lehet </script>: ' + file);
  const A = `/*ENGINE-${tag}-START*/`, B = `/*ENGINE-${tag}-END*/`;
  const i = html.indexOf(A), j = html.indexOf(B);
  if (i < 0 || j < i) throw new Error('jelölők hiányoznak: ' + tag);
  html = html.slice(0, i + A.length) + '\n' + src + html.slice(j);
  console.log(name + ' motor beágyazva (' + src.length + ' bájt)');
}
writeFileSync(root + 'coniuga.html', html);
