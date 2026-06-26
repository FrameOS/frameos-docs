import Link from 'next/link';
import Image from 'next/image';
import {
  Blocks,
  CloudOff,
  Cpu,
  ExternalLink,
  Gauge,
  Monitor,
  Printer,
  QrCode,
  Server,
} from 'lucide-react';
import { CopyCommand } from '@/components/copy-command';
import { Slideshow, type Slide } from '@/components/slideshow';
import { links } from '@/lib/shared';

const INSTALL_COMMAND = 'bash <(curl -fsSL https://frameos.net/install.sh)';

// Swap or reorder freely - the slideshows render whatever is listed here.
const frameSlides: Slide[] = [
  {
    src: '/images/photos/IMG_6030.jpg',
    alt: '13.3 inch Spectra 6 e-ink panel in a 3D-printed case on a wall',
    caption: '13.3" Spectra 6 color e-ink on the wall - refreshes a few times a day',
  },
  {
    src: '/images/photos/kitchen-calendar2.jpg',
    alt: 'Kitchen calendar on a 12.48 inch e-ink display',
    caption: 'Kitchen calendar, synced from iCal on a 12.48" 3-color panel',
  },
  {
    src: '/images/photos/IMG_5975.jpg',
    alt: 'Two e-ink frames with 3D-printed kickstands',
    caption: '7.3" and 13.3" panels in 3D-printed cases with print-in-place kickstands',
  },
  {
    src: '/images/photos/ukseraam.jpg',
    alt: 'Hallway dashboard on a 5.7 inch e-ink display by the front door',
    caption: 'Hallway dashboard: weather, windows, and the next bus - by the front door',
  },
  {
    src: '/images/photos/phone-pasta-2.jpg',
    alt: 'Phone scanning the QR code shown on a frame to control it',
    caption: 'Scan the QR code on any frame to control it - served by the frame itself',
  },
  {
    src: '/images/photos/slop.jpg',
    alt: 'AI-generated image and haiku on a 12.48 inch e-ink display',
    caption: 'Daily AI-generated art and haikus, straight from the OpenAI apps',
  },
  {
    src: '/images/photos/frame-bathroom.jpg',
    alt: 'Round LCD showing a thermostat in a bathroom',
    caption: 'Real-time LCDs too: a bathroom thermostat on a round 480×480 display',
  },
];

const appSlides: Slide[] = [
  {
    src: '/images/guide/good-run.png',
    alt: 'The FrameOS scene editor with a node graph',
    caption: 'Design scenes in the visual editor: events, data, render apps and state',
  },
  {
    src: '/images/guide/sample-scenes2.png',
    alt: 'Prebuilt scenes in the FrameOS backend',
    caption: 'Start from prebuilt gallery and sample scenes, then make them yours',
  },
  {
    src: '/images/app/control-fields.gif',
    alt: 'Scene control fields in the FrameOS backend',
    caption: 'Scenes expose controls - change them live without redeploying',
  },
  {
    src: '/images/guide/fork-openai.png',
    alt: 'Editing the source code of an app in FrameOS',
    caption: 'Go deeper: fork any app and edit its source, in Nim or JavaScript',
  },
  {
    src: '/images/app/frame-settings-new.png',
    alt: 'Frame settings in the on-device admin panel',
    caption: 'Every frame serves its own admin panel on port 8787 - no backend needed',
  },
];

const sceneStrip = [
  { src: '/images/scenes/gallery/made-in-space.jpg', alt: 'Made in Space gallery scene' },
  { src: '/images/scenes/samples/calendar.jpg', alt: 'Calendar scene' },
  { src: '/images/scenes/gallery/masterpieces.jpg', alt: 'Masterpieces gallery scene' },
  { src: '/images/scenes/samples/message-board.jpg', alt: 'Message board scene' },
  { src: '/images/scenes/gallery/abstract-architecture.jpg', alt: 'Abstract architecture scene' },
  { src: '/images/scenes/samples/split-agenda.jpg', alt: 'Split agenda scene' },
  { src: '/images/scenes/samples/xkcd.jpg', alt: 'XKCD scene' },
  { src: '/images/scenes/gallery/cyberpunk-eu.jpg', alt: 'CyberPunk EU gallery scene' },
];

const features = [
  {
    icon: CloudOff,
    title: 'No cloud. Really.',
    body: 'Scenes run as a compiled binary on the frame itself. Unplug your router, shut down the backend - the frame keeps doing its job.',
  },
  {
    icon: QrCode,
    title: 'Control it locally',
    body: 'Every frame serves a control page and HTTP API on port 8787. Scan the QR code on the display, or curl it from a script or Home Assistant.',
  },
  {
    icon: Server,
    title: 'Self-hosted backend',
    body: 'One Docker container (or a Home Assistant add-on) to design and deploy scenes over SSH. Run it on a server, or just on your laptop when needed.',
  },
  {
    icon: Monitor,
    title: '120+ displays',
    body: 'Waveshare and Pimoroni e-ink from 1" to 13.3" - including Spectra 6 color - plus anything with an HDMI port, LCDs, or no display at all.',
  },
  {
    icon: Gauge,
    title: '60 FPS or 60 s/frame',
    body: 'The same scene system drives a 60 FPS HDMI dashboard on a Pi 5 and a once-a-minute e-ink calendar on a Pi Zero 2 W.',
  },
  {
    icon: Blocks,
    title: 'Visual editor + real code',
    body: 'Wire up events, data and render apps in a node editor. When that is not enough, fork any app and edit its Nim or JavaScript source.',
  },
  {
    icon: Cpu,
    title: 'Prebuilt SD images',
    body: 'Flash a ready-made FrameOS image - WiFi preconfigured or set up via the frame’s own hotspot. Precompiled binaries mean no slow on-device builds.',
  },
  {
    icon: Printer,
    title: '3D-printed cases',
    body: 'The parametric Case Maker generates a printable case around your exact panel and Pi: kickstands, wall mounts, USB-C cutouts.',
  },
];

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-fd-primary">{kicker}</p>
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
            Turn a Raspberry Pi or ESP32, and any display - e-ink, HDMI or LCD - into a calendar,
            dashboard or art frame that runs itself. Everything renders{' '}
            <strong>on the device</strong>. No cloud, no subscriptions, no compromises.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/guide"
              className="rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href={links.github}
              className="rounded-lg border px-5 py-2.5 font-medium transition-colors hover:bg-fd-accent"
            >
              GitHub
            </Link>
          </div>
          <div className="w-full">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-fd-muted-foreground">
              Install the backend (via docker)
            </p>
            <CopyCommand command={INSTALL_COMMAND} className="w-full" />
          </div>
          <p className="text-sm text-fd-muted-foreground">
            Free &amp; open source{' '}
            <Link href="/blog/why-frameos" className="text-fd-primary hover:underline">
              since 2023
            </Link>{' '}
            (AGPL-3.0) · Works offline · Yours forever
          </p>
        </div>
        <Slideshow slides={frameSlides} aspect="aspect-[4/3]" />
      </section>

      {/* How it works */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <SectionTitle
            kicker="How it works"
            title="Three steps to a frame that runs itself"
            sub="The backend deploys over SSH or a flashed SD card. After that, the frame is on its own - the backend can go back to sleep."
          />
          <ol className="grid gap-8 md:grid-cols-3">
            <li className="rounded-xl border bg-fd-background p-6">
              <span className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-fd-primary font-semibold text-fd-primary-foreground">
                1
              </span>
              <h3 className="mb-2 font-semibold">Run the backend anywhere</h3>
              <p className="text-sm text-fd-muted-foreground">
                One command on your laptop, server or NAS - or install the Home Assistant add-on.
                It&apos;s a local web app, not a service you sign up for.
              </p>
            </li>
            <li className="rounded-xl border bg-fd-background p-6">
              <span className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-fd-primary font-semibold text-fd-primary-foreground">
                2
              </span>
              <h3 className="mb-2 font-semibold">Connect a Pi or ESP32 to a display</h3>
              <p className="text-sm text-fd-muted-foreground">
                Flash a prebuilt FrameOS SD image, stock Raspberry Pi OS Lite - or an ESP32-S3,
                straight from the browser. Plug in any of <Link href="/devices" className="text-fd-primary hover:underline">
                  120+ supported panels
                </Link>, or just an HDMI
                cable (Pi only).
              </p>
            </li>
            <li className="rounded-xl border bg-fd-background p-6">
              <span className="mb-3 inline-flex size-8 items-center justify-center rounded-full bg-fd-primary font-semibold text-fd-primary-foreground">
                3
              </span>
              <h3 className="mb-2 font-semibold">Deploy scenes, then walk away</h3>
              <p className="text-sm text-fd-muted-foreground">
                Pick prebuilt scenes or design your own, hit deploy, and you&apos;re done. The
                frame renders on-device and is controlled from its own QR code and HTTP API (still experimental for ESP32).
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* The app */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <SectionTitle
          kicker="The backend"
          title="A visual editor backed by real code"
          sub="Scenes are node graphs: red events, green data apps, blue render apps, yellow state. They compile to a single binary that runs on the frame."
        />
        <Slideshow slides={appSlides} aspect="aspect-[16/10]" fit="contain" interval={6000} className="mx-auto max-w-4xl" />
      </section>

      {/* Raspberry Pi or ESP32 */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
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
                FrameOS runs best on real Linux - from the $15 Pi Zero 2 W up: deploys over WiFi
                instead of re-flashing firmware, TrueType fonts and SVGs at any resolution,
                dithering for six-color e-ink, TLS, iCal parsing, headless Chromium screenshots,
                and a web server on the frame itself.
              </p>
              <p>
                Want a wire-free frame instead? FrameOS runs on the ESP32-S3 for Waveshare SPI
                e-paper panels: flash it from the browser, render scenes on-device, update over
                the air, and deep-sleep between refreshes for battery power. Each firmware image
                contains one selected panel driver.
              </p>
            </div>
            <Link href="/guide/esp32" className="mt-4 inline-block font-medium text-fd-primary hover:underline">
              Read the ESP32 guide →
            </Link>
          </div>
          <Image
            src="/images/photos/IMG_6022.jpg"
            alt="A slim e-ink frame with a 3D-printed kickstand"
            width={1938}
            height={1575}
            className="rounded-xl border"
          />
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

      {/* Scenes strip */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <SectionTitle
            kicker="Batteries included"
            title="Deploy a scene in your first five minutes"
            sub="Curated galleries, calendars, agendas, message boards, weather, webcams, AI art - installable with one click, editable down to the source."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {sceneStrip.map((s) => (
              <Image
                key={s.src}
                src={s.src}
                alt={s.alt}
                width={400}
                height={240}
                className="aspect-[5/3] w-full rounded-lg border object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <SectionTitle
          kicker="Watch a full build"
          title="From bare panel to finished frame"
          sub="Waveshare vs Pimoroni Spectra 6 panels, 3D-printed slim cases, USB-C power, and the FrameOS software setup - in one video."
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
      </section>

      {/* Final CTA */}
      <section className="border-t">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Build your first frame this weekend</h2>
          <p className="text-fd-muted-foreground">
            A Raspberry Pi or ESP32, a display, and one command to get going.
          </p>
          <CopyCommand command={INSTALL_COMMAND} />
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <Link href="/guide" className="font-medium text-fd-primary hover:underline">
              Read the guide
            </Link>
            <span className="text-fd-muted-foreground">·</span>
            <Link href={links.github} className="font-medium text-fd-primary hover:underline">
              Star on GitHub
            </Link>
            <span className="text-fd-muted-foreground">·</span>
            <Link href={links.discord} className="font-medium text-fd-primary hover:underline">
              Join the Discord
            </Link>
            <span className="text-fd-muted-foreground">·</span>
            <Link href={links.newsletter} className="font-medium text-fd-primary hover:underline">
              Newsletter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
