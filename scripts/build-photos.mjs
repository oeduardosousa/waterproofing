// Grades every photo with the single treatment from DESIGN.md section 7, writes
// responsive AVIF + WebP files, a manifest for the site and CREDITS.md.
// Usage: node scripts/build-photos.mjs <originals-dir>
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const srcDir = process.argv[2];
if (!srcDir) {
  console.error('Usage: node scripts/build-photos.mjs <originals-dir>');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const config = JSON.parse(await readFile(join(here, 'photos.config.json'), 'utf8'));
const sources = JSON.parse(await readFile(join(here, 'photos.sources.json'), 'utf8'));

const WIDTHS = [480, 800, 1200, 1600, 2400];
const AVIF = { quality: 50, effort: 4 };
const WEBP = { quality: 74, effort: 4 };

// Single colour grade: saturation -15%, contrast slightly up, cool shadows
// pushed toward navy, warm highlights leaning amber. Applied to every photo.
const SATURATION = 0.85;
const CONTRAST = 1.08;
const SHADOW_TINT = [-0.018, 0.0, 0.034];
const HIGHLIGHT_TINT = [0.034, 0.014, -0.03];

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

function grade(data) {
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const shadow = (1 - l) * (1 - l);
    const light = l * l;
    const px = [r, g, b];
    for (let c = 0; c < 3; c++) {
      let v = l + (px[c] - l) * SATURATION;
      v = 0.5 + (v - 0.5) * CONTRAST;
      v += shadow * SHADOW_TINT[c] + light * HIGHLIGHT_TINT[c];
      data[i + c] = clamp(Math.round(v * 255));
    }
  }
}

const outRoot = join(root, 'public', 'images');
await rm(outRoot, { recursive: true, force: true });

const manifest = {};
const credits = [];

for (const item of config) {
  const src = sources.photos[item.slug];
  if (!src) throw new Error(`No source metadata for ${item.slug}`);

  const { data, info } = await sharp(join(srcDir, `${item.role}.jpg`), { limitInputPixels: false })
    .rotate()
    .resize({ width: item.maxWidth, withoutEnlargement: true })
    .removeAlpha()
    .toColourspace('srgb')
    .raw()
    .toBuffer({ resolveWithObject: true });
  grade(data);

  const widths = [...WIDTHS.filter((w) => w < info.width), info.width];
  const dir = join(outRoot, item.role);
  await mkdir(dir, { recursive: true });

  const sizes = {};
  for (const w of widths) {
    const base = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } }).resize({ width: w });
    await base.clone().avif(AVIF).toFile(join(dir, `${item.role}-${w}.avif`));
    await base.clone().webp(WEBP).toFile(join(dir, `${item.role}-${w}.webp`));
    sizes[w] = Math.round((w * info.height) / info.width);
  }

  const [photographer, photographerUrl, camera, published] = src;
  const pageUrl = `https://www.pexels.com/photo/${item.slug}/`;
  manifest[item.role] = {
    section: item.section,
    alt: item.alt,
    sample: true,
    path: `/images/${item.role}/${item.role}`,
    formats: ['avif', 'webp'],
    width: info.width,
    height: info.height,
    variants: widths.map((w) => ({ width: w, height: sizes[w] })),
    credit: { photographer, photographerUrl, pageUrl, license: 'Pexels License' },
  };
  credits.push({ role: item.role, section: item.section, photographer, photographerUrl, pageUrl, camera, published });
  console.log(`${item.role}: ${widths.join(', ')}`);
}

await mkdir(join(root, 'src', 'data'), { recursive: true });
await writeFile(join(root, 'src', 'data', 'photos.json'), JSON.stringify(manifest, null, 2) + '\n');

const rows = credits
  .map((c) => `| \`${c.role}\` | ${c.section} | [${c.photographer}](${c.photographerUrl}) | [Pexels](${c.pageUrl}) |`)
  .join('\n');

const md = `# Créditos de fotografia

Todas as fotos deste site são imagens reais obtidas no [Pexels](https://www.pexels.com) sob a [Licença Pexels](https://www.pexels.com/license/): uso gratuito, inclusive comercial, sem atribuição obrigatória. Os créditos abaixo são dados por cortesia e para rastreabilidade.

Este é um projeto de portfólio de uma empresa fictícia. Toda foto aparece no site marcada como "exemplo" e pode ser substituída por fotos próprias do proprietário.

## Fotos

| Papel no site | Seção | Fotógrafo(a) | Fonte |
|---|---|---|---|
${rows}

Fotos consultadas e licença conferida em 2026-11-01.

## Tratamento aplicado

Cada foto foi redimensionada, convertida para AVIF e WebP e recebeu a mesma correção de cor (\`scripts/build-photos.mjs\`): saturação reduzida em cerca de 15%, contraste levemente maior, sombras frias em direção ao azul-marinho e realces quentes em direção ao âmbar. Nenhuma foto foi recortada para alterar o sentido do conteúdo, e nenhuma imagem foi gerada por IA.

## Restrições da licença a respeitar

- Não vender nem redistribuir as fotos como arquivos avulsos.
- Não sugerir que as pessoas fotografadas apoiam a empresa. A empresa é fictícia e as fotos são ilustrativas.

## Regenerar

\`\`\`bash
npm run photos:fetch -- <pasta-dos-originais>
npm run photos:build -- <pasta-dos-originais>
\`\`\`

Os originais não ficam no repositório. O manifesto usado pelo site é \`src/data/photos.json\`.
`;
await writeFile(join(root, 'CREDITS.md'), md);
console.log('Wrote manifest and CREDITS.md');
