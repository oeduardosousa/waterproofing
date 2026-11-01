// Downloads the original photos listed in photos.config.json from the Pexels CDN.
// Source metadata (photographer, license) lives in photos.sources.json.
// Usage: node scripts/fetch-photos.mjs <output-dir>
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.argv[2];
if (!outDir) {
  console.error('Usage: node scripts/fetch-photos.mjs <output-dir>');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(await readFile(join(here, 'photos.config.json'), 'utf8'));
const headers = { 'User-Agent': 'Mozilla/5.0 (portfolio-project photo fetch)' };

await mkdir(outDir, { recursive: true });

for (const item of config) {
  const id = item.slug.match(/(\d+)$/)[1];
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(join(outDir, `${item.role}.jpg`), buf);
  console.log(`${item.role}: ${(buf.length / 1048576).toFixed(1)} MB`);
}
