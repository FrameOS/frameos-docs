// Draws an SVG placeholder for every device page that has no `image:` in its
// frontmatter, so the /devices table and spec cards have no empty photo cells.
//
// The placeholder is a stylised panel in the device's own aspect ratio, with a
// palette strip for its colour class and a short label. Generic drivers (HDMI,
// HTTP upload, web only) get a matching pictogram instead of a panel.
//
// Usage:
//   node scripts/generate-device-placeholders.mjs [--write-frontmatter] [--force]
//
// Writes public/images/devices/placeholders/<slug>.svg. With --write-frontmatter
// it also inserts `image: /images/devices/placeholders/<slug>.svg` into the page.
// Existing SVGs are skipped unless --force is passed; a real photo added later
// simply replaces the frontmatter line and the SVG can be deleted.

import { mkdir, readdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const contentDir = path.join(root, 'content/docs/devices');
const outDir = path.join(root, 'public/images/devices/placeholders');
const args = process.argv.slice(2);
const writeFrontmatter = args.includes('--write-frontmatter');
const force = args.includes('--force');

const W = 400;
const H = 300;

const palettes = {
  bw: ['#111111', '#f4f4f0'],
  gray: ['#111111', '#555555', '#a8a8a8', '#f4f4f0'],
  accent: ['#111111', '#f4f4f0', '#d1352b'],
  acep: ['#111111', '#f4f4f0', '#2e8b3a', '#2956c5', '#d1352b', '#e8c832', '#e5842b'],
  spectra: ['#111111', '#f4f4f0', '#e8c832', '#d1352b', '#2956c5', '#2e8b3a'],
  rgb: ['#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#264653', '#6a4c93'],
  varies: ['#111111', '#f4f4f0', '#d1352b', '#e8c832'],
};

// Accent palettes vary by model: yellow panels get a yellow swatch.
function paletteFor(device) {
  const cls = device.colorClass ?? 'bw';
  const base = palettes[cls] ?? palettes.bw;
  if (cls === 'accent' && /yellow/i.test(device.colors ?? '')) {
    return ['#111111', '#f4f4f0', '#e8c832'];
  }
  return base;
}

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

function label(device) {
  if (device.diagonal) {
    const res = device.width && device.height ? ` · ${device.width}×${device.height}` : '';
    return `${device.diagonal}"${res}`;
  }
  return device.model;
}

function swatches(colors, x, y, size = 14, gap = 6) {
  return colors
    .map(
      (c, i) =>
        `<rect x="${x + i * (size + gap)}" y="${y}" width="${size}" height="${size}" rx="3" fill="${c}" stroke="#00000022"/>`,
    )
    .join('');
}

function frame(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#ffffff"/>
${inner}
</svg>
`;
}

// A panel drawn in the device's aspect ratio, sitting on a darker bezel, with
// a ribbon cable stub so it reads as an e-paper module rather than a blank box.
function panelSvg(device) {
  const ratio = device.width && device.height ? device.width / device.height : 4 / 3;
  const maxW = 300;
  const maxH = 180;
  let pw = maxW;
  let ph = pw / ratio;
  if (ph > maxH) {
    ph = maxH;
    pw = ph * ratio;
  }
  // Tiny panels (1.54") still need to be legible as thumbnails.
  if (pw < 120) {
    pw = 120;
    ph = pw / ratio;
  }
  const bezel = 10;
  const bx = (W - pw) / 2 - bezel;
  const by = 40 + (maxH - ph) / 2 - bezel;
  const colors = paletteFor(device);
  const text = label(device);

  // A faint dither pattern hints at e-ink without pretending to be a photo.
  const pattern = `<defs><pattern id="d" width="4" height="4" patternUnits="userSpaceOnUse">
<rect width="4" height="4" fill="#f4f4f0"/><rect width="1" height="1" fill="#d8d8d2"/></pattern></defs>`;
  const cable = `<rect x="${bx + bezel + pw - 40}" y="${by + ph + 2 * bezel - 2}" width="26" height="18" rx="2" fill="#c9a86a"/>`;

  return frame(`${pattern}
<rect x="${bx}" y="${by}" width="${pw + 2 * bezel}" height="${ph + 2 * bezel}" rx="6" fill="#2b2b2b"/>
${cable}
<rect x="${bx + bezel}" y="${by + bezel}" width="${pw}" height="${ph}" fill="url(#d)"/>
${swatches(colors, (W - (colors.length * 20 - 6)) / 2, 252)}
<text x="${W / 2}" y="286" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15" fill="#555">${esc(text)}</text>`);
}

function hdmiSvg() {
  return frame(`<rect x="60" y="40" width="280" height="170" rx="8" fill="#2b2b2b"/>
<rect x="72" y="52" width="256" height="146" fill="#1f6feb"/>
<rect x="72" y="52" width="256" height="146" fill="url(#g)"/>
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.25"/><stop offset="1" stop-color="#000000" stop-opacity="0.25"/></linearGradient></defs>
<rect x="180" y="210" width="40" height="18" fill="#2b2b2b"/>
<rect x="140" y="228" width="120" height="10" rx="4" fill="#2b2b2b"/>
<text x="200" y="286" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15" fill="#555">HDMI / framebuffer</text>`);
}

function webSvg() {
  return frame(`<rect x="60" y="44" width="280" height="190" rx="10" fill="#2b2b2b"/>
<rect x="68" y="52" width="264" height="174" rx="6" fill="#ffffff"/>
<rect x="68" y="52" width="264" height="28" rx="6" fill="#e9e9e9"/>
<circle cx="84" cy="66" r="5" fill="#e63946"/><circle cx="100" cy="66" r="5" fill="#e9c46a"/><circle cx="116" cy="66" r="5" fill="#2a9d8f"/>
<rect x="132" y="58" width="190" height="16" rx="8" fill="#ffffff"/>
<rect x="84" y="96" width="232" height="114" rx="4" fill="#1f6feb" opacity="0.85"/>
<text x="200" y="286" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15" fill="#555">Renders in the browser</text>`);
}

function httpSvg() {
  return frame(`<path d="M120 190a40 40 0 0 1 6-79 62 62 0 0 1 118-20 48 48 0 0 1 44 99z" fill="#e9eef7" stroke="#2b2b2b" stroke-width="6" stroke-linejoin="round"/>
<path d="M200 222v-96M164 162l36-36 36 36" fill="none" stroke="#1f6feb" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
<text x="200" y="286" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15" fill="#555">POSTs each render over HTTP</text>`);
}

function svgFor(slug, device) {
  if (slug === 'framebuffer-hdmi') return hdmiSvg();
  if (slug === 'web-only') return webSvg();
  if (slug === 'http-upload') return httpSvg();
  return panelSvg(device);
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

await mkdir(outDir, { recursive: true });
const files = (await readdir(contentDir)).filter((f) => f.endsWith('.mdx') && f !== 'index.mdx');
const results = { written: 0, skipped: 0, hasPhoto: 0 };

for (const file of files) {
  const slug = file.replace(/\.mdx$/, '');
  const filePath = path.join(contentDir, file);
  const source = await readFile(filePath, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) continue;
  const fm = yaml.load(match[1]);
  const device = fm?.device;
  if (!device) continue;
  if (device.image) {
    results.hasPhoto++;
    continue;
  }

  const outPath = path.join(outDir, `${slug}.svg`);
  if (!force && (await exists(outPath))) {
    results.skipped++;
  } else {
    await writeFile(outPath, svgFor(slug, device));
    results.written++;
    console.log(`${slug}.svg`);
  }

  if (writeFrontmatter) {
    const imageLine = `  image: "/images/devices/placeholders/${slug}.svg"`;
    const updated = source.replace(/^(  status:.*)$/m, `${imageLine}\n$1`);
    if (updated === source) {
      console.warn(`  could not place image: in ${file} (no status: line)`);
    } else {
      await writeFile(filePath, updated);
    }
  }
}

console.log(results);
