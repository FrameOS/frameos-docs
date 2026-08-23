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
import { TextLink } from '@/components/text-link';
import { LightboxImage } from '@/components/lightbox';
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

const appSlides: Slide[] = [
  {
    src: '/images/editor/editor-agenda.png',
    alt: 'The FrameOS scene editor showing the iCal agenda scene as a node graph',
    caption: (
      <>
        <TextLink href={`${links.sceneStore}/s/ical-agenda#scene-editor`}>The iCal agenda scene</TextLink>: fetch a URL,
        turn it into events, lay them out as text - every step is a node you can inspect and change
      </>
    ),
  },
  {
    src: '/images/editor/inline-code.png',
    alt: 'A code node in the scene editor with a few lines of JavaScript building a caption from photo metadata',
    caption: (
      <>
        Need a line of logic? Drop a code node into the graph and write it right there, as we do in{' '}
        <TextLink href={`${links.sceneStore}/s/unsplash-image`}>Unsplash image</TextLink>
      </>
    ),
  },
  {
    src: '/images/editor/weatherpanel-js-app.png',
    alt: 'The TypeScript source of the weather panel app open in the in-browser editor',
    caption: (
      <>
        Apps are TypeScript and you can edit them in the browser - this is the{' '}
        <TextLink href={`${links.sceneStore}/s/weather`}>weather panel</TextLink> drawing its forecast chart
      </>
    ),
  },
  {
    src: '/images/editor/live-preview.png',
    alt: 'The browser preview of the weather scene in FrameOS Cloud, with its state and runtime log',
    caption: (
      <>
        Preview any scene in the browser before it touches a frame - the{' '}
        <TextLink href={`${links.sceneStore}/s/weather`}>weather panel</TextLink> again, rendered with the
        FrameOS interpreter compiled to WebAssembly, with its live state and runtime log
      </>
    ),
  },
];

// Each thumbnail links to the scene's page in the store: `${links.sceneStore}/s/${slug}`.
const sceneStrip = [
  { src: '/images/scenes/gallery/made-in-space.jpg', alt: 'Made in Space gallery scene', slug: 'made-in-space' },
  { src: '/images/scenes/samples/calendar.jpg', alt: 'Calendar scene', slug: 'calendar' },
  { src: '/images/scenes/gallery/masterpieces.jpg', alt: 'Masterpieces gallery scene', slug: 'masterpieces' },
  { src: '/images/scenes/samples/message-board.jpg', alt: 'Message board scene', slug: 'message-board' },
  { src: '/images/scenes/samples/weather.jpg', alt: 'Weather scene with current conditions and an hourly forecast', slug: 'weather' },
  { src: '/images/scenes/samples/split-agenda.jpg', alt: 'Split agenda scene', slug: 'ical-agenda' },
  { src: '/images/scenes/samples/xkcd.jpg', alt: 'XKCD scene', slug: 'xkcd' },
  { src: '/images/scenes/gallery/cuteness-overload.jpg', alt: 'Cuteness Overload gallery scene with a cartoon toucan', slug: 'cuteness-overload' },
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

function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
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

      {/* Get started */}
      <section className="border-t bg-fd-card/50">
        <div className="mx-auto w-full max-w-4xl px-6 py-20">
          <SectionTitle
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
                A <TextLink href="/guide/raspberry"><strong>Raspberry Pi</strong></TextLink> is the classic option. Any model from the Zero W to the Pi 5 will do.
                Supports <TextLink href="/devices">120+ e-ink panels</TextLink> and other outputs like HDMI. You can manage the frame through{' '}
                <TextLink href="/guide/control">their own admin page and HTTP API</TextLink>. Boot
                from a <TextLink href="/guide/raspberry#option-1-prebuilt-frameos-sd-image-recommended">prebuilt SD image</TextLink>{' '}
                or <TextLink href="/guide/raspberry#option-3-no-ssh-install-with-a-script">install on any Linux</TextLink> with a shell script.
              </p>
              <p>
                An <TextLink href="/guide/esp32"><strong>ESP32-S3</strong></TextLink> lets you build battery-powered frames that <TextLink href="/guide/esp32#power">deep-sleep between refreshes</TextLink>. 
                It's still the full FrameOS experience. Everything is rendered on device, including 50MB JPEGs.
                Works with custom setups, and <TextLink href="/guide/esp32#supported-boards">Waveshare, PhotoPainter, TRMNL and reTerminal boards</TextLink>.
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
        </div>
      </section>

      {/* Scenes strip */}
      <section className="border-t bg-fd-card/50">
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
          sub="Build a scene by wiring nodes together, then open any of them to see the code underneath. Apps are TypeScript or Nim with a config.json; add a code node for one-off logic. The same editor runs in the backend, on the frame's own admin page, and in FrameOS Cloud, and a deployed scene is live on the frame seconds later."
        />
        <Slideshow slides={appSlides} aspect="aspect-[10/7]" fit="contain" interval={6000} className="mx-auto max-w-4xl" />
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
    </main>
  );
}
