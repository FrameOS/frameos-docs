import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { InstallPathChooser } from '@/components/install-path-chooser';
import { Slideshow, type Slide } from '@/components/slideshow';
import { TextLink } from '@/components/text-link';
import { LightboxImage } from '@/components/lightbox';
import { LiveSceneEmbed, type EmbedScene } from '@/components/live-scene-embed';
import { CompareGallery, type ComparePhoto } from '@/components/compare-gallery';
import { links } from '@/lib/shared';

// Swap or reorder freely - the slideshows render whatever is listed here.
const frameSlides: Slide[] = [
  {
    src: '/images/photos/frame-13in3-spectra6.jpg',
    alt: '13.3 inch Spectra 6 color e-ink panel in a 3D-printed rosewood frame',
    caption: (
      <>
        A <TextLink href="/devices/waveshare-epd-13in3e">13.3&quot; Spectra 6</TextLink> color e-ink
        panel in a <TextLink href="/cases">3D-printed frame</TextLink>
      </>
    ),
  },
  {
    src: '/images/photos/frame-13in3-inside.jpg',
    alt: 'The back of the 13.3 inch frame: Raspberry Pi Zero, Waveshare e-paper HAT and a soldered SD card extension',
    caption: 'Inside: a Pi Zero, the Waveshare HAT, and a soldered SD card extension made from a micro SD adapter',
  },
  {
    src: '/images/photos/frame-13in3-printing.jpg',
    alt: 'The 13.3 inch frame being 3D printed on a Bambu Lab printer',
    caption: (
      <>
        Printing the frame in{' '}
        <TextLink href="https://eu.store.bambulab.com/products/pla-wood">Bambu rosewood PLA</TextLink>{' '}
        - designed in the <TextLink href="/cases">Case Maker</TextLink>
      </>
    ),
  },
  {
    src: '/images/photos/hdmi-framebuffer.jpg',
    alt: 'A portable HDMI monitor showing the FrameOS welcome screen from a Raspberry Pi',
    caption: 'HDMI works too: a Pi Zero 2W with a portable 1080p monitor, managed from FrameOS Cloud',
  },
  {
    src: '/images/photos/IMG_5975.jpg',
    alt: 'Two e-ink frames with 3D-printed kickstands',
    caption: '7.3" and 13.3" panels in 3D-printed cases with print-in-place kickstands',
  },
  {
    src: '/images/photos/spectra6-vs-acep.jpg',
    alt: 'Two 4 inch frames side by side, one with a Spectra 6 panel and one with an ACeP panel',
    caption: 'Same image on Spectra 6 (left) and 7-color ACeP (right) - Spectra is brighter and more saturated',
  },
  {
    src: '/images/photos/phone-pasta-2.jpg',
    alt: 'Phone scanning the QR code shown on a frame to control it',
    caption: 'Scanning a QR code on a Pimoroni display to control it from a phone, no backend needed',
  },
  {
    src: '/images/photos/slop.jpg',
    alt: 'AI-generated image and haiku on a 12.48 inch e-ink display',
    caption: 'All the AI-slop you can generate, if you\'re into that kind of stuff',
  },
];

// Each thumbnail links to the scene's page in the store: `${links.sceneStore}/s/${slug}`.
const sceneStrip = [
  { src: '/images/scenes/gallery/made-in-space.jpg', alt: 'Made in Space gallery scene', slug: 'made-in-space' },
  { src: '/images/scenes/samples/word-clock.jpg', alt: 'Word clock scene spelling out the time in a letter grid', slug: 'word-clock' },
  { src: '/images/scenes/samples/message-board.jpg', alt: 'Message board scene', slug: 'message-board' },
  { src: '/images/scenes/samples/year-progress-memento-mori.jpg', alt: 'Year progress / memento mori scene, showing the year as a dot grid', slug: 'year-progress-memento-mori' },
  { src: '/images/scenes/samples/weather.jpg', alt: 'Weather scene with current conditions and an hourly forecast', slug: 'weather' },
  { src: '/images/scenes/samples/calendar.jpg', alt: 'Calendar scene', slug: 'calendar' },
  { src: '/images/scenes/gallery/cuteness-overload.jpg', alt: 'Cuteness Overload gallery scene with a cartoon toucan', slug: 'cuteness-overload' },
  { src: '/images/scenes/samples/xkcd.jpg', alt: 'XKCD scene', slug: 'xkcd' },
];

// Rendered by the Assets panel's Set colors editor for an 800x480 Spectra 6
// panel: the photo as the panel dithers it with no adjustments, and after the
// frame's automatic fit. e2e/frontend-visual in the main repo has the recipe.
const calibrationPhotos: ComparePhoto[] = [
  { id: 'hoverfly', label: 'Hoverfly', alt: 'A hoverfly in front of a purple flower, from Wikimedia Commons', before: '/images/guide/dither/hoverfly-none.png', after: '/images/guide/dither/hoverfly-auto.png' },
  { id: 'river', label: 'River', alt: 'Willows over a misty river at sunrise', before: '/images/guide/dither/river-none.png', after: '/images/guide/dither/river-auto.png' },
  { id: 'sunset', label: 'Sunset', alt: 'Pine trees in front of a mountain at sunset', before: '/images/guide/dither/sunset-none.png', after: '/images/guide/dither/sunset-auto.png' },
  { id: 'toucan', label: 'Toucan', alt: 'A cartoon toucan from the Cuteness Overload scene', before: '/images/guide/dither/toucan-none.png', after: '/images/guide/dither/toucan-auto.png' },
];

// The scenes the JSX section's buttons open, live in the store's editor (its
// embed mode) or as screenshots of it: public/images/editor/jsx/<slug>-<theme>.png,
// taken at the frame's size, scrolled to each scene's JSX.
const jsxDevices = {
  lcd: { key: 'sensecap-indicator', name: 'SenseCAP Indicator', href: '/devices/seeed-sensecap-indicator' },
  paper: { key: 'reterminal-e1002', name: 'reTerminal E1002 (Spectra 6)', href: '/devices/seeed-reterminal-e1002' },
};
const jsxSceneList: { slug: string; label: string; device: keyof typeof jsxDevices; blurb: string }[] = [
  { slug: 'kitchen-sink', label: 'Kitchen sink', device: 'lcd', blurb: 'switches, a slider you drag, a form with a keyboard on the screen, a paint canvas and Lights Out - six touch pages in one file' },
  { slug: 'flights-above-me', label: 'Flights', device: 'paper', blurb: 'the planes over a map of your area, from OpenSky' },
  { slug: 'colors', label: 'Colors', device: 'lcd', blurb: 'the Tailwind palette to tap through' },
  { slug: 'map', label: 'Map', device: 'lcd', blurb: 'OpenStreetMap drawn on the chip, to drag and pinch' },
  { slug: 'home', label: 'Home', device: 'lcd', blurb: 'a smart home panel to tap through' },
  { slug: 'weather-demo', label: 'Weather', device: 'lcd', blurb: 'a week of made-up weather - tap a day for its details' },
  { slug: 'gallery', label: 'Gallery', device: 'lcd', blurb: 'full-screen pictures from the FrameOS gallery - swipe for the next one or pick a category' },
  { slug: 'dvd-logo-bounce', label: 'DVD', device: 'lcd', blurb: 'the bouncing logo, an <svg> in JSX drawn about 30 times a second' },
  { slug: 'rainbow-clock', label: 'Rainbow clock', device: 'paper', blurb: 'an SVG clock written in JSX, dithered to the panel\'s six inks' },
];
const jsxScenes: EmbedScene[] = jsxSceneList.map(({ slug, label, device, blurb }) => {
  const d = jsxDevices[device];
  const href = `${links.sceneStore}/s/${slug}`;
  const poster = (theme: 'light' | 'dark') => ({
    src: `/images/editor/jsx/${slug}-${theme}.png`,
    alt: `The FrameOS scene editor${theme === 'dark' ? ' in dark mode' : ''} with the ${label} scene's app.tsx beside its live preview as a ${d.name}`,
    width: 2204,
    height: 1470,
  });
  const onDevice = (
    <>
      <TextLink href={d.href}>{d.name}</TextLink>{' '}
      inside the ESP32&apos;s 8&nbsp;MB of memory
    </>
  );
  return {
    key: slug,
    label,
    src: `${href}?embed=1&file=app.tsx&device=${d.key}&memory=esp32`,
    href,
    poster: poster('light'),
    posterDark: poster('dark'),
    caption: (
      <>
        <TextLink href={href}>{label}</TextLink> in the scene editor: {blurb}. Previewed as a {onDevice}.
      </>
    ),
    liveCaption: (
      <>
        This is live: {label} - {blurb}. Change a class in <code>app.tsx</code> and the preview re-renders, as a{' '}
        {onDevice}. Sign in to keep what you change.
      </>
    ),
  };
});

// The "Best for…" cards under Pick your hardware.
const hardwarePicks = [
  {
    best: 'Best for large photos',
    name: 'Seeed reTerminal E1004',
    note: '13.3" Spectra 6 color, on a 5000 mAh battery',
    href: '/devices/seeed-reterminal-e1004',
    image: '/images/devices/seeed-reterminal-e1004.jpg',
  },
  {
    best: 'Best for daily use',
    name: 'Seeed reTerminal Sticky',
    note: 'A 3.97" touch screen for a desk or a fridge',
    href: '/devices/seeed-reterminal-sticky',
    image: '/images/devices/seeed-reterminal-sticky.jpg',
  },
  {
    best: 'Best for DIY',
    name: 'Waveshare 7.3" (E) e-Paper',
    note: 'Spectra 6 for a Pi or an ESP32, in a case you print',
    href: '/devices/waveshare-epd-7in3e',
    image: '/images/devices/waveshare-epd-7in3e.jpg',
  },
  {
    best: 'Best for Raspberry Pi',
    name: 'Pimoroni Inky Impression 7.3"',
    note: 'Spectra 6 that plugs onto a Pi, with four buttons',
    href: '/devices/pimoroni-inky-impression-7-2025',
    image: '/images/devices/pimoroni-inky-impression-spectra-7-1.jpg',
  },
];

function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: React.ReactNode }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {kicker && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-fd-primary">{kicker}</p>}
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      {sub ? <p className="mt-3 text-fd-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-2 md:pt-24">
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            The operating system for smart frames
          </h1>
          <p className="text-lg text-fd-muted-foreground">
            Turn a <TextLink href="/guide/raspberry">Raspberry Pi</TextLink> or{' '}
            <TextLink href="/guide/esp32">ESP32</TextLink>, and{' '}
            <TextLink href="/devices">any display</TextLink> - e-ink, HDMI or LCD - into a
            calendar, dashboard or art frame that runs itself. Everything renders{' '}
            <strong>on the device</strong>. Run it{' '}
            <TextLink href="/guide/standalone">standalone</TextLink>, control it with a{' '}
            <TextLink href="/guide/backend">self-hosted backend</TextLink>, or manage it from{' '}
            <TextLink href="/guide/cloud">FrameOS Cloud</TextLink> - the frame works the same
            either way.
          </p>
          <p className="text-sm text-fd-muted-foreground">
            Free &amp; open source{' '}
            <TextLink href="/blog/why-frameos">since 2023</TextLink>{' '}
            (AGPL-3.0) · Works offline · Cloud optional · Yours forever
          </p>
        </div>
        <Slideshow slides={frameSlides} aspect="aspect-[4/3]" />
      </section>

      {/* JSX + Tailwind on an ESP32 */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <SectionTitle
            kicker="JSX + Tailwind on a microcontroller"
            title="Write it like a web app. Run it on an ESP32."
            sub={
              <>
                Build a frame&apos;s UI like a web app: a <code>.tsx</code> file with Tailwind classes,{' '}
                <code>onClick</code>, sliders and text fields, which all build up to an SVG. The ESP32 renders it
                on the chip, React-style, redrawing only what changed - no server, no browser. The same file runs
                on a Pi, on HDMI, on e-paper and in your browser.
              </>
            }
          />
          <LiveSceneEmbed
            scenes={jsxScenes}
            moreHref={links.sceneStore}
            moreLabel="All scenes in the store"
            className="mx-auto max-w-6xl"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                stat: '~85 ms',
                title: 'from tap to picture',
                body: 'A tap on a JSX smart-home panel on a 480x480 SenseCAP Indicator. Only what changed is redrawn.',
              },
              {
                stat: '29.5 fps',
                title: 'animated JSX',
                body: 'The DVD logo bounce, written as JSX, on the same ESP32-S3 LCD.',
              },
              {
                stat: 'Real UI',
                title: 'not just pictures',
                body: 'Flexbox and grid, gradients, inline SVG icons, inputs with an on-screen keyboard, select boxes and lists that scroll.',
              },
              {
                stat: 'One file',
                title: 'every screen',
                body: (
                  <>
                    <code>sm:</code> to <code>2xl:</code> and <code>portrait:</code> follow the panel, and{' '}
                    <code>app.frame.color</code> says when to switch to high contrast.
                  </>
                ),
              },
            ].map((f) => (
              <div key={f.stat} className="rounded-xl border bg-fd-background p-5">
                <p className="text-2xl font-bold tracking-tight text-fd-primary">{f.stat}</p>
                <p className="mb-2 font-semibold">{f.title}</p>
                <p className="text-sm text-fd-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guide/apps#jsx-uis"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              JSX interfaces guide
            </Link>
          </div>
        </div>
      </section>

      {/* Color calibration */}
      <section className="border-t">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <SectionTitle
            kicker="Made for photography"
            title="Colors that actually look good"
            sub={
              <>
                FrameOS maps each image&apos;s luminance histogram, and fits its range onto the shades the panel
                can actually show. We then dither with a hashed jitter to smooth out jagged lines and gradients.
                Want more? Grade each photo by hand. Drag the handle to compare.{' '}
                <TextLink href="/guide/colors">Color controls guide →</TextLink>
              </>
            }
          />
          <CompareGallery
            className="mx-auto max-w-[800px]"
            photos={calibrationPhotos}
            width={800}
            height={480}
            beforeLabel="Clipped"
            afterLabel="FrameOS"
          />
          <p className="mt-3 text-center text-sm text-fd-muted-foreground">
            Each pair is the editor&apos;s preview for a 7.3&quot; Spectra 6 panel at its real 800x480 pixels.
          </p>
          <p className="mx-auto mt-10 max-w-2xl text-center text-fd-muted-foreground">
            Keep your pictures in <strong>Photos</strong>, on your own backend or in FrameOS Cloud: drop in
            albums and folders at any size - a 40-megapixel original is fine, even on an ESP32 - and play an
            album on any frame, shuffled or in order, cropped to fill or shown whole. Each photo can carry its
            own color grade, and the frame gets it with the picture.{' '}
            <TextLink href="/guide/photos">Photos guide&nbsp;→</TextLink>
          </p>
        </div>
      </section>

      {/* Raspberry Pi or ESP32 */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-fd-primary">
              Pick your hardware
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Raspberry Pi or ESP32?
            </h2>
            <div className="flex flex-col gap-3 text-fd-muted-foreground">
              <p>
                A <TextLink href="/guide/raspberry"><strong>Raspberry Pi</strong></TextLink> is the classic option. Any model from the Zero W to the Pi 5 will do.
                Supports <TextLink href="/devices">120+ e-ink panels</TextLink> and other outputs like HDMI. You can manage the frame through{' '}
                <TextLink href="/guide/control">their own admin page and HTTP API</TextLink>. Boot
                from a <TextLink href="/guide/raspberry#option-1-prebuilt-frameos-sd-image-recommended">prebuilt SD image</TextLink>{' '}
                or <TextLink href="/guide/raspberry#option-3-no-ssh-install-with-a-script">install on any Linux</TextLink> with a shell script.
              </p>
              <p>
                An <TextLink href="/guide/esp32"><strong>ESP32-S3</strong></TextLink> lets you build battery-powered frames that <TextLink href="/guide/esp32#power">deep-sleep between refreshes</TextLink>.
                It's still the full FrameOS experience. Everything is rendered on device, including 50MB JPEGs.
                The easiest start is a ready-made <TextLink href="/devices/seeed-buying-guide">Seeed Studio reTerminal</TextLink>: pick
                its preset and flash it from the browser. Waveshare&apos;s <TextLink href="/devices/waveshare-esp32-s3-photopainter">PhotoPainter</TextLink>,
                Seeed&apos;s XIAO ePaper boards, TRMNL kits and <TextLink href="/guide/esp32#supported-boards">custom setups</TextLink> work too.
                Boards without PSRAM (e.g. ESP32-C3) run as thin clients.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium">
              <TextLink href="/guide/raspberry">Raspberry Pi guide →</TextLink>
              <TextLink href="/guide/esp32">ESP32 guide →</TextLink>
              <TextLink href="/guide/esp32#raspberry-pi-or-esp32">Which one should I pick?</TextLink>
            </div>
          </div>
          <LightboxImage
            src="/images/photos/esp32-waveshare-7in3.jpg"
            alt="An ESP32-S3 wired to a 7.3 inch Waveshare e-paper panel, showing a rendered scene"
            width={1600}
            height={1200}
            caption="An ESP32-S3 wired to a Waveshare 7.3&quot; e-paper HAT, rendering a scene on the chip"
          />
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
          {hardwarePicks.map((pick) => (
            <Link
              key={pick.href}
              href={pick.href}
              className="group relative aspect-square overflow-hidden rounded-xl border bg-white"
            >
              <Image
                src={pick.image}
                alt={pick.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/85 via-black/60 to-transparent px-3.5 pb-4 pt-12 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">{pick.best}</span>
                <span className="text-sm font-semibold leading-snug group-hover:underline">{pick.name}</span>
                <span className="hidden text-sm leading-snug text-white/80 sm:block">{pick.note}</span>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </section>

      {/* Scenes strip */}
      <section className="border-t">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <SectionTitle
            kicker="Batteries included"
            title="Deploy a scene in your first five minutes"
            sub="SD card images, calendars, agendas, message boards, weather, AI art, and much more. Installable with one click, editable down to the source. Combine them, schedule them, make them yours."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {sceneStrip.map((s) => (
              <Link
                key={s.src}
                href={`${links.sceneStore}/s/${s.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`${s.alt} - open in the scene store`}
                className="block overflow-hidden rounded-lg border transition-opacity hover:opacity-80"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={400}
                  height={300}
                  className="aspect-[4/3] w-full object-cover"
                />
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={links.sceneStore}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse the scene store
            </Link>
            <Link
              href="/guide/scene-store"
              className="inline-flex items-center rounded-lg border px-5 py-2.5 font-medium transition-colors hover:bg-fd-accent"
            >
              How installing works
            </Link>
          </div>
        </div>
      </section>

      {/* Case Maker */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-fd-primary">
              Case Maker
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Design a printable case around your exact frame
            </h2>
            <div className="flex flex-col gap-3 text-fd-muted-foreground">
              <p>
                The FrameOS Case Maker generates parametric, 3D-printable enclosures for supported
                panels and Raspberry Pi layouts. Pick a template, tune the depth and bezel, add
                wall mounts, kickstands, USB-C cutouts and screw posts, then download the STL.
              </p>
              <p>
                It is built for the same hardware database as the docs, so common Waveshare and
                Pimoroni builds start from sane dimensions instead of a blank CAD file.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={links.caseMaker}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
              >
                Open Case Maker
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/cases"
                className="inline-flex items-center rounded-lg border px-5 py-2.5 font-medium transition-colors hover:bg-fd-accent"
              >
                Read the case guide
              </Link>
            </div>
          </div>
          <Link
            href={links.caseMaker}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the FrameOS Case Maker"
          >
            <Image
              src="/images/guide/casemaker.png"
              alt="The FrameOS Case Maker interface for configuring a 3D-printed frame enclosure"
              width={2558}
              height={1970}
              className="aspect-[4/3] w-full rounded-xl border object-cover object-top"
            />
          </Link>
        </div>
      </section>

      {/* Video */}
      <section className="border-t">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <SectionTitle
            kicker="Watch a full build (Raspberry Pi)"
            title="From bare panel to finished frame"
            sub="Recorded over a year ago, before FrameOS Cloud and ESP32 support existed."
          />
          <div className="mx-auto max-w-4xl">
            <iframe
              className="aspect-video w-full rounded-xl border"
              src="https://www.youtube-nocookie.com/embed/jutMOLQYxSw"
              title="eInk Spectra frame build guide - Waveshare vs Pimoroni"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Build your first frame this weekend</h2>
          <p className="text-fd-muted-foreground">
            A standalone Pi, a self-hosted backend, or a FrameOS Cloud account - the guide walks
            through all three, and the frame you end up with is the same.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/guide"
              className="rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Read the setup guide
            </Link>
            <Link
              href={links.github}
              className="rounded-lg border px-5 py-2.5 font-medium transition-colors hover:bg-fd-accent"
            >
              GitHub
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <TextLink href={links.discord} className="font-medium">
              Join the Discord
            </TextLink>
            <span className="text-fd-muted-foreground">·</span>
            <TextLink href={links.newsletter} className="font-medium">
              Newsletter
            </TextLink>
          </div>
        </div>
      </section>

      {/* Get started */}
      <section className="border-t">
        <div className="mx-auto w-full max-w-4xl px-6 py-20">
          <SectionTitle
            title="How do you want to get started?"
            sub="All three render on the device, and a frame can move between them without reflashing."
          />
          <InstallPathChooser hideHeader />
        </div>
      </section>
    </main>
  );
}
