// A tools/ai-prompts.js tartalmát bemásolja a coniuga.html-be (AIP névtérbe csomagolva).
// Futtatás: node tools/embed-prompts.mjs   (utána: node tools/build-site.mjs)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'tools/ai-prompts.js'), 'utf8');
const names = [...src.matchAll(/^export\s+(?:const|function)\s+(\w+)/gm)].map((m) => m[1]);
const body = src.replace(/^export\s+/gm, '').replace(/`/g, '`');
const block = `/*AI-PROMPTS-START: generált, ne szerkeszd – forrás: tools/ai-prompts.js */
const AIP = (() => {
${body}
return { ${names.join(', ')} };
})();
/*AI-PROMPTS-END*/`;
const p = join(root, 'coniuga.html');
let html = readFileSync(p, 'utf8');
const re = /\/\*AI-PROMPTS-START[\s\S]*?\/\*AI-PROMPTS-END\*\//;
if (!re.test(html)) throw new Error('Nincs AI-PROMPTS jelölő a coniuga.html-ben');
html = html.replace(re, () => block);
writeFileSync(p, html);
console.log('AI-promptok beágyazva:', names.join(', '));
