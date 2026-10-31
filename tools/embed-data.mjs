// A tools/*.txt adatfájlokat (példamondatok, fordítások) bemásolja a coniuga.html-be.
// Futtatás: node tools/embed-data.mjs   (utána: node tools/build-site.mjs)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => readFileSync(join(root, 'tools', f), 'utf8').trim();
const p = join(root, 'coniuga.html');
let html = readFileSync(p, 'utf8');
for (const [name, file] of [['SENT_RAW', 'sentences.txt'], ['VERB_TR', 'i18n-verbs.txt'], ['SENT_TR', 'i18n-sentences.txt']]) {
  const data = read(file);
  if (data.includes('`') || data.includes('${')) throw new Error(file + ': tiltott karakter');
  const re = new RegExp('const ' + name + ' = `\\n[\\s\\S]*?\\n`;');
  if (!re.test(html)) throw new Error('Nem található: ' + name);
  html = html.replace(re, () => 'const ' + name + ' = `\n' + data + '\n`;');
  console.log(name, '←', file, data.split('\n').length, 'sor');
}
writeFileSync(p, html);
