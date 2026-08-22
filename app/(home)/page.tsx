import Link from 'next/link';
import Image from 'next/image';
import {
  Blocks,
  Cloud,
  Cpu,
  ExternalLink,
  Gauge,
  HardDrive,
  Image as ImageIcon,
  Monitor,
  Printer,
  QrCode,
  Server,
  Store,
  WifiOff,
} from 'lucide-react';
import { InstallPathChooser } from '@/components/install-path-chooser';
import { Slideshow, type Slide } from '@/components/slideshow';
import { links } from '@/lib/shared';

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

// Each thumbnail links to the scene's page in the store: `${links.sceneStore}/s/${slug}`.
const sceneStrip = [
  { src: '/images/scenes/gallery/made-in-space.jpg', alt: 'Made in Space gallery scene', slug: 'made-in-space' },
  { src: '/images/scenes/samples/calendar.jpg', alt: 'Calendar scene', slug: 'calendar' },
  { src: '/images/scenes/gallery/masterpieces.jpg', alt: 'Masterpieces gallery scene', slug: 'masterpieces' },
  { src: '/images/scenes/samples/message-board.jpg', alt: 'Message board scene', slug: 'message-board' },
  { src: '/images/scenes/gallery/abstract-architecture.jpg', alt: 'Abstract architecture scene', slug: 'abstract-architecture' },
  { src: '/images/scenes/samples/split-agenda.jpg', alt: 'Split agenda scene', slug: 'ical-agenda' },
  { src: '/images/scenes/samples/xkcd.jpg', alt: 'XKCD scene', slug: 'xkcd' },
  { src: '/images/scenes/gallery/cyberpunk-eu.jpg', alt: 'CyberPunk EU gallery scene', slug: 'cyberpunk-eu' },
];

const features = [
  {
    icon: WifiOff,
    title: 'Runs on the device',
    body: 'Scenes run on the frame itself, in a single native binary. Unplug your router, shut down the backend, lose the cloud - the frame keeps doing its job.',
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
    icon: Cloud,
    title: 'Or let the cloud manage it',
    body: 'FrameOS Cloud enrolls a Pi or ESP32 from your browser and assigns scenes from anywhere. Deliberately limited: no shell, no compiled code, only sandboxed scenes. Free in beta.',
  },
  {
    icon: Store,
    title: 'A scene store',
    body: 'Browse community scenes with live previews at scenes.frameos.net. One click onto a cloud frame, one pasted link into a self-hosted backend, fork and edit in the browser.',
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
    title: 'Microcontrollers too',
    body: 'An ESP32-S3 renders full scenes on-device and deep-sleeps between refreshes, so a frame can run on a battery. Flash it from the browser.',
  },
  {
    icon: ImageIcon,
    title: 'Images of any size',
    body: 'A 12-megapixel photo renders on a board with 8 MB of RAM: the decoder scales as it decodes, straight into the panel. No proxy, no resize server.',
  },
  {
    icon: HardDrive,
    title: 'Prebuilt SD images',
    body: 'Flash a ready-made FrameOS image for any Pi - WiFi preconfigured or set up via the frame’s own hotspot. Precompiled binaries mean no slow on-device builds.',
  },
  {
    icon: Printer,
    title: '3D-printed cases',
    body: 'The parametric Case Maker generates a printable case around your exact panel and Pi: kickstands, wall mounts, USB-C cutouts.',
  },
];

function HeroLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-fd-foreground underline decoration-fd-muted-foreground/50 underline-offset-4 hover:decoration-fd-primary">
      {children}
    </Link>
  );
}

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
            Turn a <HeroLink href="/guide/raspberry">Raspberry Pi</HeroLink> or{' '}
            <HeroLink href="/guide/esp32">ESP32</HeroLink>, and{' '}
            <HeroLink href="/devices">any display</HeroLink> - e-ink, HDMI or LCD - into a
            calendar, dashboard or art frame that runs itself. Everything renders{' '}
            <strong>on the device</strong>. Run it{' '}
            <HeroLink href="/guide/standalone">standalone</HeroLink>, control it with a{' '}
            <HeroLink href="/guide/backend">self-hosted backend</HeroLink>, or manage it from{' '}
            <HeroLink href="/guide/cloud">FrameOS Cloud</HeroLink> - the frame works the same
            either way.
          </p>
          <p className="text-sm text-fd-muted-foreground">
            Free &amp; open source{' '}
            <Link href="/blog/why-frameos" className="text-fd-primary hover:underline">
              since 2023
            </Link>{' '}
            (AGPL-3.0) · Works offline · Cloud optional · Yours forever
          </p>
        </div>
        <Slideshow slides={frameSlides} aspect="aspect-[4/3]" />
      </section>

      {/* Get started */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto w-full max-w-4xl px-6 py-20">
          <SectionTitle
            kicker="Get started"
            title="How do you want to get started?"
            sub="All three render on the device, and a frame can move between them without reflashing."
          />
          <InstallPathChooser hideHeader />
        </div>
      </section>

      {/* Raspberry Pi or ESP32 */}
      <section className="border-t">
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
                A <strong>Raspberry Pi</strong> is the most capable option. Any model works, from the
                Pi Zero 2 W to the Pi 5. It drives over 120 e-ink panels as well as HDMI and LCD
                screens, runs scenes written in JavaScript or compiled Nim, renders TrueType fonts
                and SVGs, dithers for color e-ink, takes screenshots of web pages with headless
                Chromium, and serves its own admin page and HTTP API. You can boot it from a
                prebuilt FrameOS SD image or install FrameOS on an existing Linux system.
              </p>
              <p>
                An <strong>ESP32-S3</strong> is a small microcontroller for a battery-powered,
                wire-free frame. It renders scenes on the chip itself, with the same JavaScript
                apps, an on-device scheduler, assets on an SD card, and over-the-air firmware
                updates. You flash it from the browser over USB, and it deep-sleeps between
                refreshes. It supports Waveshare SPI e-paper panels and all-in-one boards like the
                PhotoPainter, TRMNL DIY kits and the Seeed reTerminal. Boards without PSRAM - the
                original TRMNL, XTEINK X4, Pimoroni Inky Frame - run as thin clients that display
                what the backend renders.
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
        </div>
      </section>

      {/* Scenes strip */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <SectionTitle
            kicker="Batteries included"
            title="Deploy a scene in your first five minutes"
            sub="Curated galleries, calendars, agendas, message boards, weather, webcams, AI art - built in, plus a community scene store with live previews. Installable with one click, editable down to the source."
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
                  height={240}
                  className="aspect-[5/3] w-full object-cover"
                />
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={links.sceneStore}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse the scene store
              <ExternalLink className="size-4" aria-hidden="true" />
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

      {/* The app */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <SectionTitle
          kicker="The editor"
          title="A visual editor backed by real code"
          sub="Scenes are node graphs: red events, green data apps, blue render apps, yellow state. The same editor runs in the backend, on the frame's own admin page, and in the cloud. Deploy one and it runs on the frame, seconds later."
        />
        <Slideshow slides={appSlides} aspect="aspect-[16/10]" fit="contain" interval={6000} className="mx-auto max-w-4xl" />
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
