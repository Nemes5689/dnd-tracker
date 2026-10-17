import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Personal offline copies of the publicly served browser builds, not source code.
const origin = 'https://watabou.github.io/';
const destination = fileURLToPath(new URL('../public/generators/watabou/', import.meta.url));
const tools = [
  ['perilous-shores', 'Realm'], ['city-generator', 'City'],
  ['village-generator', 'Village'], ['cave-generator', 'Cave / Glade'],
  ['one-page-dungeon', 'Dungeon'], ['dwellings', 'Dwelling'],
];
const records = [];

async function downloadTool([directory]) {
  const base = new URL(`${directory}/`, origin);
  const pending = ['index.html'];
  const seen = new Set();
  const missingFonts = [];
  const enqueue = (reference) => {
    const url = new URL(reference, base);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return;
    const relative = decodeURIComponent(url.pathname.slice(base.pathname.length));
    if (!relative || relative.includes('..') || !/\.[a-z0-9]+$/i.test(relative)) return;
    if (!seen.has(relative) && !pending.includes(relative)) pending.push(relative);
  };

  while (pending.length) {
    const relative = pending.shift();
    seen.add(relative);
    const url = new URL(relative, base);
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.status === 404 && /\.(ttf|woff2?|eot|svg)$/i.test(relative)) {
      missingFonts.push(relative);
      continue;
    }
    if (!response.ok) throw new Error(`${response.status}: ${url}`);
    let bytes = Buffer.from(await response.arrayBuffer());
    if (/\.(html|js|css|json)$/i.test(relative)) {
      let source = bytes.toString('utf8');
      if (relative === 'index.html') {
        // Offline copies have no analytics dependency.
        source = source.replace(/<script\b[^>]*src=["']https:\/\/www\.googletagmanager\.com[^]*?<\/script>/gi, '');
        source = source.replace(/<script>\s*window\.dataLayer[^]*?<\/script>/gi, '');
        // Upstream lists legacy font formats that no longer exist. Modern
        // browsers and Electron can use the supplied TrueType fonts directly.
        source = source.replace(/src:\s*[^;]+;/g, (declaration) => {
          const ttf = declaration.match(/url\(['"]?([^)'"\s]+\.ttf)['"]?\)/);
          return ttf ? `src: url('${ttf[1]}') format('truetype');` : declaration;
        });
        bytes = Buffer.from(source);
      }
      if (/\.js$/i.test(relative) && source.includes('https://armoria.herokuapp.com')) {
        // City emblems depend on an online API, including an endless retry
        // when offline. Disable only its request methods in the local build.
        for (const method of ['loadLo', 'loadHi', 'loadSvg']) {
          source = source.replace(new RegExp(`(\\w+)\\.${method}=function\\(\\)\\{[^]*?\\};`), '$1.' + method + '=function(){};');
        }
        bytes = Buffer.from(source);
      }
      for (const match of source.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^\s)'";]+)["']?\s*\)/gi)) {
        const reference = match[1] ?? match[2];
        if (!reference.startsWith('data:')) enqueue(new URL(reference, url).href);
      }
      // OpenFL's embedded Haxe manifest stores asset paths as length-prefixed,
      // URI-encoded strings (for example y21:Assets%2Fdefault.json).
      for (const match of source.matchAll(/y(\d+):/g)) {
        const start = match.index + match[0].length;
        const encoded = source.slice(start, start + Number(match[1]));
        if (/^assets(?:%2f|\/)/i.test(encoded)) {
          enqueue(decodeURIComponent(encoded));
        }
      }
      for (const match of source.matchAll(/["'](assets\/[^"'\r\n]+)["']/gi)) enqueue(match[1]);
    }
    const filename = path.join(destination, directory, relative);
    await mkdir(path.dirname(filename), { recursive: true });
    await writeFile(filename, bytes);
    records.push({ file: `${directory}/${relative}`, source: url.href, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  }
  if (missingFonts.length) {
    const filename = path.join(destination, directory, 'index.html');
    let html = await readFile(filename, 'utf8');
    html = html.replace(/@font-face\s*\{[^}]*\}/g, (rule) => missingFonts.some((font) => rule.includes(font)) ? '' : rule);
    await writeFile(filename, html);
    const record = records.find((item) => item.file === `${directory}/index.html`);
    record.bytes = Buffer.byteLength(html);
    record.sha256 = createHash('sha256').update(html).digest('hex');
    console.log(`${directory}: omitted ${missingFonts.length} fonts unavailable on the original site`);
  }
  console.log(`${directory}: ${seen.size} files`);
}

// Keep downloads bounded and stop immediately if an asset is missing.
for (const tool of tools) await downloadTool(tool);
await writeFile(path.join(destination, 'manifest.json'), JSON.stringify({ downloadedAt: new Date().toISOString(), author: 'Oleg Dolya / Watabou', source: origin, files: records }, null, 2));
await writeFile(path.join(destination, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Generators — Watabou</title>
<style>body{font:16px system-ui;margin:0;padding:32px;background:#fcf8ee;color:#1a1a1a}h1{font-size:26px}nav{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin:24px 0}nav a{padding:28px 20px;border:1px solid #c5c2b8;border-radius:6px;color:#635022;background:#f0e9db;text-decoration:none}a:focus-visible{outline:3px solid #635022;outline-offset:3px}p{line-height:1.6}</style></head>
<body><h1>Choose a generator</h1><p>Build your next adventure with these local tools.</p><nav aria-label="Generators">${tools.map(([directory, label]) => `<a href="./${directory}/index.html">${label}</a>`).join('')}</nav><p>Generators by <a href="https://watabou.github.io/" target="_blank" rel="noopener noreferrer">Oleg Dolya / Watabou</a>.<br>Personal offline copies. Export your maps before switching tools.</p></body></html>`);
console.log(`Downloaded ${records.length} files (${(records.reduce((sum, record) => sum + record.bytes, 0) / 1024 / 1024).toFixed(1)} MB).`);
