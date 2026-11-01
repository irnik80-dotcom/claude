// A spanyol ragozó motort (tools/engine-es.js) bemásolja a coniuga.html-be a jelölők közé.
import { readFileSync, writeFileSync } from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(root + 'coniuga.html', 'utf8');
const src = readFileSync(root + 'tools/engine-es.js', 'utf8').replace(/\nif \(typeof module[^\n]*\n?$/, '\n');
if (src.includes('</script')) throw new Error('a motorban nem lehet </script>');
const A = '/*ENGINE-ES-START*/', B = '/*ENGINE-ES-END*/';
const i = html.indexOf(A), j = html.indexOf(B);
if (i < 0 || j < i) throw new Error('jelölők hiányoznak');
writeFileSync(root + 'coniuga.html', html.slice(0, i + A.length) + '\n' + src + html.slice(j));
console.log('spanyol motor beágyazva (' + src.length + ' bájt)');
