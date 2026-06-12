// Scaffolds one MDX page per FrameOS display driver into content/docs/devices/.
//
// The MDX files are the source of truth for the device database - this script
// only creates files that don't exist yet (so hand-edits are never overwritten).
// Run it again after adding new drivers to scripts/device-data.json:
//
//   node scripts/generate-device-pages.mjs
//
// Use --dry-run to preview, --force to overwrite generated files.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataFile = path.join(root, 'scripts', 'device-data.json');
const outDir = path.join(root, 'content', 'docs', 'devices');

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');

const devices = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

const reportUrl = 'https://github.com/FrameOS/frameos/issues/65';

const titleOverrides = {
  web_only: 'Web only (no physical display)',
  'http.upload': 'HTTP upload (bring your own display)',
};

const colorIntro = {
  bw: 'Two-tone e-ink has the fastest refresh of any e-paper type - a full update takes only a couple of seconds - and the high contrast works great for text, dashboards and dithered photos.',
  accent:
    'Panels with an accent ink run a multi-pass refresh that takes roughly 15-30 seconds, so they suit art, calendars and dashboards that update every few minutes rather than every second.',
  gray: 'Grayscale e-ink renders dithered photos noticeably better than pure black-and-white panels, while keeping a quick refresh.',
  acep: 'ACeP ("Advanced Color ePaper") packs seven real ink colors into every pixel. A full refresh takes around 30 seconds, and the palette is softer than a backlit screen - ideal for photos and generative art with a paper-like look.',
  spectra:
    'Spectra 6 is the current generation of color e-ink: six vivid ink colors with much better saturation than the older 7-color ACeP panels. A full refresh takes roughly 15-30 seconds.',
};

function colorsPhrase(d) {
  switch (d.colorClass) {
    case 'bw':
      return 'black and white';
    case 'accent':
      return d.colors.toLowerCase().split(' / ').join(', ').replace(/, ([^,]+)$/, ' and $1');
    case 'gray':
      return d.colors.toLowerCase();
    case 'acep':
      return 'seven ACeP ink colors';
    case 'spectra':
      return 'six Spectra 6 ink colors';
    default:
      return d.colors.toLowerCase();
  }
}

// Short color wording for meta descriptions
function descColors(d) {
  switch (d.colorClass) {
    case 'bw':
      return 'black & white';
    case 'accent':
      return d.colors.toLowerCase().split(' / ').join('/');
    case 'gray':
      return d.colors.toLowerCase();
    case 'acep':
      return '7-color ACeP';
    case 'spectra':
      return 'Spectra 6 full-color';
    default:
      return d.colors.toLowerCase();
  }
}

function yamlString(value) {
  return JSON.stringify(value);
}

function frontmatter(d, title, description) {
  const lines = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    'device:',
    `  vendor: ${yamlString(d.vendor)}`,
    `  model: ${yamlString(d.model)}`,
    `  driver: ${yamlString(d.driver)}`,
    `  label: ${yamlString(d.label)}`,
    `  technology: ${yamlString(d.technology)}`,
    `  interface: ${yamlString(d.interface)}`,
  ];
  if (d.diagonal != null) lines.push(`  diagonal: ${d.diagonal}`);
  if (d.width != null) lines.push(`  width: ${d.width}`);
  if (d.height != null) lines.push(`  height: ${d.height}`);
  lines.push(`  colors: ${yamlString(d.colors)}`);
  if (d.colorCount != null) lines.push(`  colorCount: ${d.colorCount}`);
  if (d.colorClass) lines.push(`  colorClass: ${yamlString(d.colorClass)}`);
  if (d.buttons) lines.push(`  buttons: 4`);
  lines.push(`  status: ${yamlString(d.status)}`);
  lines.push('---');
  return lines.join('\n');
}

function statusSection(d) {
  if (d.status === 'tested') {
    return `## Status

🟢 **Confirmed working** - tested on real hardware by the maintainers or the community.`;
  }
  return `## Status

🟡 **Should work, not yet confirmed on real hardware.** The driver shares its controller logic
with panels that are confirmed working. If you have this display,
[report your results with a photo](${reportUrl}) and we'll mark it confirmed.`;
}

function waveshareBody(d, title) {
  const intro = colorIntro[d.colorClass] ?? '';
  const quirks = [];
  if (d.driver === 'waveshare.EPD_10in3') {
    quirks.push(
      'This panel is driven through the IT8951 controller board (USB/SPI). It works, but draws more power than typical SPI panels.',
    );
  }
  if (d.driver.startsWith('waveshare.EPD_12in48')) {
    quirks.push(
      'The 12.48" panel uses two driver boards and its own wiring - follow [the 12.48" build video](/blog/frameos-2024) for assembly.',
    );
  }
  if (d.colorClass === 'spectra' || d.colorClass === 'acep') {
    quirks.push(
      'See the [Spectra 6 build video](/blog/eink-spectra-waveshare-pimoroni) for a side-by-side look at color e-ink generations.',
    );
  }
  const quirkBlock = quirks.length ? `\n\n${quirks.join('\n\n')}` : '';

  return `The **${title}** is a ${d.diagonal}″ e-ink panel with a resolution of
**${d.width}×${d.height} pixels** showing **${colorsPhrase(d)}**. ${intro}
Like all e-paper, it keeps the last image with zero power - the frame only wakes up to render.${quirkBlock}

## How it works

FrameOS ships a [native Nim driver](https://github.com/FrameOS/frameos/tree/main/frameos/src/drivers/waveshare)
(\`${d.driver}\`) compiled straight into the binary that runs on your Raspberry Pi - no Python, no
vendor libraries. Each render pass draws your [scene](/guide/scenes) into a full-color image,
dithers it to the panel's palette, and pushes the result to the display over SPI.

## Setup

1. Connect the panel to the Raspberry Pi - plug the HAT onto the GPIO header, or hook up the
   separate driver board with the bundled ribbon cable.
2. [Add a frame](/guide/first-deploy) in the FrameOS backend and select the
   **${d.label}** driver.
3. Save & deploy. The panel blinks through a refresh cycle and shows your scene.

Make sure the letter suffix on your panel's ribbon cable matches the driver - Waveshare reuses
product names across revisions. More tips in the
[Waveshare buying guide](/devices/waveshare-other-displays).

${statusSection(d)}`;
}

function pimoroniEinkBody(d, title) {
  const intro = colorIntro[d.colorClass] ?? '';
  const buttons = d.buttons
    ? `\n\nThe four side buttons are registered automatically and can trigger events in your
[scenes](/guide/scenes) - switch scenes, cycle images, anything.`
    : '';

  return `The **${title}** is a ${d.diagonal}″ e-ink panel with a resolution of
**${d.width}×${d.height} pixels** showing **${colorsPhrase(d)}**. ${intro}
Pimoroni's boards are the easiest e-ink hardware to start with: panel and driver electronics come
as one unit that plugs straight onto the Pi's GPIO header - no soldering, no separate driver board.${buttons}

## How it works

FrameOS ships a [native Nim driver](https://github.com/FrameOS/frameos/tree/main/frameos/src/drivers/inky)
(\`${d.driver}\`) compiled straight into the binary that runs on your Raspberry Pi - no Python, no
vendor libraries. Each render pass draws your [scene](/guide/scenes) into a full-color image,
dithers it to the panel's palette, and pushes the result to the display over SPI.

## Setup

1. Plug the board onto the Pi's GPIO header.
2. [Add a frame](/guide/first-deploy) in the FrameOS backend and select the
   **${d.label}** driver.
3. Save & deploy. The panel blinks through a refresh cycle and shows your scene.

${statusSection(d)}`;
}

function pimoroniPythonBody(d, title) {
  return `The **${title}** driver is a catch-all for Inky panels that don't have a dedicated
native driver in FrameOS. It uses [Pimoroni's official Python library](https://github.com/pimoroni/inky),
which auto-detects most Inky boards via the EEPROM on the HAT.

## How it works

On the first deploy, FrameOS installs the Inky Python library on the Raspberry Pi and renders
through a small helper process. This is slower to deploy and uses a bit more memory than the
native Nim drivers, but it supports every panel the official library supports - resolution and
colors are detected from the board itself.

If your panel has a dedicated entry in the [device database](/devices), prefer that driver.

## Setup

1. Plug the board onto the Pi's GPIO header.
2. [Add a frame](/guide/first-deploy) in the FrameOS backend and select the
   **${d.label}** driver.
3. Save & deploy. The first deploy takes longer while the Python dependencies install.

${statusSection(d)}`;
}

const customBodies = {
  web_only: `**Web only** runs a frame with no physical display attached. The frame renders your
[scenes](/guide/scenes) on schedule, and you view the result in any browser - straight from the
frame, or mirrored in the FrameOS backend.

Great for:

- Trying out FrameOS before any e-ink hardware arrives.
- Kiosk setups where another machine fullscreens the frame's URL.
- Debugging scenes without waiting for an e-ink refresh.

## Setup

1. [Add a frame](/guide/first-deploy) in the FrameOS backend and select the **Web only** driver.
2. Set any width and height you like - the canvas is fully RGB at whatever resolution you choose.
3. Save & deploy, then open the frame's URL in a browser.

${statusSection({ status: 'tested' })}`,

  'http.upload': `**HTTP upload** pushes every rendered image to a URL of your choosing as an HTTP
POST - so you can drive displays FrameOS has never heard of. Anything that can receive an image
over the network becomes a FrameOS frame: custom microcontroller displays, digital signage
players, other servers, you name it.

## How it works

The frame renders your [scene](/guide/scenes) on its normal schedule. Instead of talking to a
panel over SPI or HDMI, the driver POSTs the rendered PNG to the endpoint you configure in the
frame's settings. Your receiver decides what to do with it.

## Setup

1. [Add a frame](/guide/first-deploy) in the FrameOS backend and select the **HTTP upload**
   driver.
2. Set the width and height to match your target display, and configure the upload URL.
3. Save & deploy. Each render is delivered to your endpoint.

${statusSection({ status: 'tested' })}`,
};

function buildPage(d) {
  const title = titleOverrides[d.driver] ?? `${d.vendor} ${d.model}`;
  let description;
  let body;

  if (customBodies[d.driver]) {
    description =
      d.driver === 'web_only'
        ? 'Run a FrameOS frame with no physical display - render scenes and view them in the browser.'
        : 'Push every rendered FrameOS image to any URL - drive displays FrameOS has never heard of.';
    body = customBodies[d.driver];
  } else if (d.vendor === 'Waveshare') {
    description = `${d.width}×${d.height} ${descColors(d)} e-ink display for FrameOS - specs, setup and driver details.`;
    body = waveshareBody(d, title);
  } else if (d.python) {
    description = `Python fallback driver for Inky panels without a dedicated FrameOS driver - auto-detects the panel.`;
    body = pimoroniPythonBody(d, title);
  } else {
    description = `${d.width}×${d.height} ${descColors(d)} e-ink HAT for FrameOS - specs, setup and driver details.`;
    body = pimoroniEinkBody(d, title);
  }

  return `${frontmatter(d, title, description)}\n\n${body}\n`;
}

let created = 0;
let skipped = 0;
for (const d of devices) {
  if (d.existingPage) continue;
  const file = path.join(outDir, `${d.slug}.mdx`);
  if (fs.existsSync(file) && !force) {
    skipped++;
    continue;
  }
  const content = buildPage(d);
  if (dryRun) {
    console.log(`would write ${path.relative(root, file)}`);
  } else {
    fs.writeFileSync(file, content);
  }
  created++;
}
console.log(`${dryRun ? 'would create' : 'created'} ${created} pages, left ${skipped} existing pages untouched`);
