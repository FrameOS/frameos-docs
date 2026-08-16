// Crops the flat background margin off the product photos in public/images/devices.
//
// Vendor product shots are usually a small object floating in a big white frame,
// which looks like a broken image once it sits in a fixed-height thumbnail. This
// finds the bounding box of the actual product (sharp's trim, seeded with the
// top-left pixel) and re-crops the original with a small margin left in place.
//
// Usage:
//   node scripts/trim-device-images.mjs [--dry-run] [file...]

import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public/images/devices');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const only = args.filter((arg) => !arg.startsWith('--')).map((arg) => path.basename(arg));

// Tolerance for JPEG noise in the background, and the margin (share of the long
// edge) we leave around the product so it doesn't touch the frame.
const THRESHOLD = 12;
const PADDING_RATIO = 0.02;
// Below this the trim almost certainly ate the product itself, so leave it alone.
const MIN_AREA_RATIO = 0.05;
// Above this there was no meaningful whitespace to begin with.
const SKIP_AREA_RATIO = 0.97;

async function trim(file) {
  const filePath = path.join(dir, file);
  const input = sharp(filePath);
  const { width, height } = await input.metadata();
  if (!width || !height) return { file, status: 'unreadable' };

  let info;
  try {
    ({ info } = await sharp(filePath)
      .trim({ threshold: THRESHOLD })
      .toBuffer({ resolveWithObject: true }));
  } catch {
    return { file, status: 'no-trim' };
  }

  const left = -(info.trimOffsetLeft ?? 0);
  const top = -(info.trimOffsetTop ?? 0);
  const areaRatio = (info.width * info.height) / (width * height);

  if (areaRatio > SKIP_AREA_RATIO) return { file, status: 'already-tight', width, height };
  if (areaRatio < MIN_AREA_RATIO) return { file, status: 'suspicious', width, height, areaRatio };

  const pad = Math.round(Math.max(info.width, info.height) * PADDING_RATIO);
  const box = {
    left: Math.max(0, left - pad),
    top: Math.max(0, top - pad),
  };
  box.width = Math.min(width - box.left, info.width + pad * 2 + (left - pad < 0 ? left - pad : 0));
  box.height = Math.min(height - box.top, info.height + pad * 2 + (top - pad < 0 ? top - pad : 0));

  const isPng = path.extname(file).toLowerCase() === '.png';
  const pipeline = sharp(filePath).extract(box);
  const output = await (isPng
    ? pipeline.png({ compressionLevel: 9 })
    : pipeline.jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
  ).toBuffer();

  if (!dryRun) await writeFile(filePath, output);

  return {
    file,
    status: 'trimmed',
    from: `${width}x${height}`,
    to: `${box.width}x${box.height}`,
    saved: `${Math.round((1 - areaRatio) * 100)}%`,
  };
}

const files = (only.length ? only : await readdir(dir))
  .filter((file) => /\.(jpe?g|png)$/i.test(file))
  .sort();

const results = [];
for (const file of files) results.push(await trim(file));

for (const result of results) {
  if (result.status === 'trimmed') {
    console.log(`${result.file}: ${result.from} -> ${result.to} (-${result.saved} area)`);
  } else {
    console.log(`${result.file}: ${result.status}`);
  }
}

const counts = results.reduce((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
console.log(`\n${dryRun ? '[dry run] ' : ''}${files.length} files:`, counts);
