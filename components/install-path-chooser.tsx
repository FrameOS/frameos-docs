'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Cloud, Cpu, Download, Server, Usb } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CopyCommand } from '@/components/copy-command';
import { TextLink } from '@/components/text-link';

const INSTALL_COMMAND = 'bash <(curl -fsSL https://frameos.net/install.sh)';
// Release assets are versioned (frameos-<version>-<board>-buildroot.img.gz),
// so the download button resolves the latest release through the GitHub API
// on click and falls back to the release page if that fails.
const RELEASES_URL = 'https://github.com/FrameOS/frameos/releases/latest';
const LATEST_RELEASE_API = 'https://api.github.com/repos/FrameOS/frameos/releases/latest';
const CLOUD_URL = 'https://cloud.frameos.net/';
const CLOUD_SIGNUP_URL = 'https://cloud.frameos.net/signup';
const DOCKER_HUB_URL = 'https://hub.docker.com/r/frameos/frameos';

// flash.frameos.net flashes and sets up a standalone ESP32-S3 from the
// browser over USB, with no account (cloud/docs/flasher.md in the main repo).
// A C3 or a Pico is a thin client: something has to render for it, so it is
// listed here only to say where to go instead.
const FLASHER_URL = 'https://flash.frameos.net/';

const platformGroups = [
  {
    label: 'Raspberry Pi',
    options: [
      { id: 'raspberry-pi-64', label: 'Raspberry Pi Zero 2 W / 3 / 4 / CM4 (64-bit)' },
      { id: 'raspberry-pi-5', label: 'Raspberry Pi 5 / CM5' },
      { id: 'raspberry-pi-32', label: 'Raspberry Pi Zero / Zero W / 1 / CM1 (32-bit)' },
    ],
  },
  {
    label: 'ESP32',
    options: [
      { id: 'esp32-s3', label: 'ESP32-S3 (Seeed reTerminal, Waveshare PhotoPainter, XIAO and more)' },
      { id: 'esp32-c3', label: 'ESP32-C3 (TRMNL OG, XTEINK X4) - needs a backend' },
    ],
  },
  {
    label: 'Raspberry Pi Pico',
    options: [{ id: 'pico', label: 'Pico W / Pico 2 W (Pimoroni Inky Frame) - needs a backend' }],
  },
  {
    label: 'Anything else',
    options: [{ id: 'other', label: 'Other Linux (Debian or Ubuntu on arm64, armhf, armv6, amd64)' }],
  },
] as const;

type Platform = (typeof platformGroups)[number]['options'][number]['id'];
type PiImage = Extract<Platform, `raspberry-pi-${string}`>;

function isPiImage(platform: Platform): platform is PiImage {
  return platform.startsWith('raspberry-pi-');
}

// The standalone installer (scripts/frameos-setup.sh in the main repo), served
// with the newest release stamped in. Without a claim token it installs a
// standalone frame - it asks about the display and an admin password, and
// optionally a self-hosted backend to connect to.
const LINUX_INSTALL_COMMAND = 'curl -fsSL https://cloud.frameos.net/install.sh | sudo sh';

async function latestImageUrl(board: PiImage): Promise<string> {
  const res = await fetch(LATEST_RELEASE_API, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const release = (await res.json()) as { assets?: { name: string; browser_download_url: string }[] };
  const asset = release.assets?.find((a) => a.name.endsWith(`-${board}-buildroot.img.gz`));
  if (!asset) throw new Error('asset not found');
  return asset.browser_download_url;
}

type InstallPath = 'frame' | 'backend' | 'cloud';

// A fine, theme-neutral noise texture layered over each tile's gradient.
const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0.45 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const installOptions = [
  {
    id: 'frame',
    icon: Cpu,
    title: 'Standalone frame',
    description: 'Flash a Pi and set it up over its WiFi hotspot, flash an ESP32 at flash.frameos.net, or install on any Linux. No backend, no account.',
    // logo gold #c8a247
    tint: 'from-[#c8a247]/30 via-[#c8a247]/10 to-fd-background dark:from-[#c8a247]/25 dark:via-[#c8a247]/10 dark:to-fd-background',
    glow: 'bg-[#c8a247]/50 dark:bg-[#c8a247]/30',
    iconColor: 'text-[#8a6c1e] dark:text-[#e2c468]',
  },
  {
    id: 'backend',
    icon: Server,
    title: 'Self-hosted backend',
    description: 'Run the frameos Docker image on your laptop, server or NAS. Then manage frames in your network over SSH.',
    // logo lime #8baa3a
    tint: 'from-[#8baa3a]/30 via-[#8baa3a]/10 to-fd-background dark:from-[#8baa3a]/25 dark:via-[#8baa3a]/10 dark:to-fd-background',
    glow: 'bg-[#8baa3a]/50 dark:bg-[#8baa3a]/30',
    iconColor: 'text-[#5a7320] dark:text-[#b5d45c]',
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'FrameOS Cloud',
    description: 'Nothing to install. Download customized SD cards and flash ESP32s over USB. Forever free for personal use, quotas permitting.',
    // logo teal #1c7c66
    tint: 'from-[#1c7c66]/30 via-[#1c7c66]/10 to-fd-background dark:from-[#1c7c66]/35 dark:via-[#1c7c66]/12 dark:to-fd-background',
    glow: 'bg-[#1c7c66]/50 dark:bg-[#1c7c66]/40',
    iconColor: 'text-[#1c7c66] dark:text-[#5fc4a8]',
  },
] as const;

function LinkButton({
  href,
  variant = 'primary',
  dataAttr,
  children,
}: {
  href: string;
  variant?: 'primary' | 'secondary';
  dataAttr?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-attr={dataAttr}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium',
        variant === 'primary'
          ? 'bg-fd-primary text-fd-primary-foreground transition-opacity hover:opacity-90'
          : 'border transition-colors hover:bg-fd-accent',
      )}
    >
      {children}
    </Link>
  );
}

export function InstallPathChooser({
  className,
  hideHeader = false,
}: {
  className?: string;
  hideHeader?: boolean;
}) {
  const [selectedPath, setSelectedPath] = useState<InstallPath | null>(null);
  const [board, setBoard] = useState<Platform>('raspberry-pi-64');
  const [downloading, setDownloading] = useState(false);

  async function downloadImage() {
    if (!isPiImage(board)) return;
    setDownloading(true);
    try {
      window.location.href = await latestImageUrl(board);
    } catch {
      window.open(RELEASES_URL, '_blank', 'noopener,noreferrer');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {hideHeader ? null : (
        <div className="mb-3">
          <h2 className="mt-1 text-base font-semibold">How do you want to get started?</h2>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {installOptions.map((option) => {
          const Icon = option.icon;
          const selected = selectedPath === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              data-attr={`install-path-${option.id}`}
              onClick={() => setSelectedPath(option.id)}
              className={cn(
                'group relative isolate flex h-full cursor-pointer flex-col items-start gap-2 overflow-hidden rounded-xl border p-4 text-left transition-all',
                'bg-gradient-to-br',
                option.tint,
                selected
                  ? 'border-fd-primary shadow-md ring-1 ring-fd-primary'
                  : 'hover:-translate-y-0.5 hover:border-fd-primary/50 hover:shadow-md',
              )}
            >
              {/* noise texture */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-50 mix-blend-overlay dark:opacity-30"
                style={{ backgroundImage: NOISE_TEXTURE }}
              />
              {/* soft glow in the corner */}
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute -right-10 -top-10 -z-10 size-40 rounded-full blur-2xl transition-opacity group-hover:opacity-100',
                  selected ? 'opacity-100' : 'opacity-70',
                  option.glow,
                )}
              />
              {/* large watermark icon */}
              <Icon
                aria-hidden="true"
                strokeWidth={1}
                className={cn(
                  'pointer-events-none absolute -bottom-6 -right-6 -z-10 size-32 opacity-[0.08] transition-transform duration-300 group-hover:scale-110 group-hover:opacity-[0.12] dark:opacity-[0.1]',
                  option.iconColor,
                )}
              />
              <span
                className={cn(
                  'inline-flex size-8 shrink-0 items-center justify-center rounded-full border bg-fd-background/80 backdrop-blur-sm',
                  selected ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground' : option.iconColor,
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">{option.title}</span>
                <span className="mt-1 block text-sm text-fd-foreground/80">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selectedPath ? (
        <div
          data-attr={`install-panel-${selectedPath}`}
          className="mt-3 rounded-xl border border-fd-primary bg-fd-card/50 p-4 text-left shadow-md ring-1 ring-fd-primary"
        >
          {selectedPath === 'frame' ? (
            <>
              <div className="border-b pb-3">
                <p className="font-semibold">Pick a platform</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Platform"
                    data-attr="install-frame-board"
                    value={board}
                    onChange={(e) => setBoard(e.target.value as Platform)}
                    className="min-w-0 flex-1 rounded-lg border bg-fd-background px-3 py-1.5 text-sm"
                  >
                    {platformGroups.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.options.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {isPiImage(board) ? (
                    <button
                      type="button"
                      data-attr={`install-frame-download-${board}`}
                      onClick={downloadImage}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      {downloading ? 'Finding latest…' : 'Download'}
                    </button>
                  ) : board === 'esp32-s3' ? (
                    <LinkButton href={FLASHER_URL} dataAttr="install-frame-flasher">
                      <Usb className="size-3.5" aria-hidden="true" />
                      Open flash.frameos.net
                    </LinkButton>
                  ) : board === 'esp32-c3' || board === 'pico' ? (
                    <button
                      type="button"
                      data-attr={`install-frame-to-backend-${board}`}
                      onClick={() => setSelectedPath('backend')}
                      className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-fd-accent"
                    >
                      Self-hosted backend
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
                {isPiImage(board) ? (
                  <p className="mt-2 text-xs text-fd-muted-foreground">
                    Latest release, <code>{board}</code>. All images and checksums are on{' '}
                    <TextLink href={RELEASES_URL}>
                      GitHub
                    </TextLink>
                    .
                  </p>
                ) : board === 'esp32-s3' ? (
                  <p className="mt-2 text-xs text-fd-muted-foreground">
                    No account and nothing to install: it flashes over a USB cable from Chrome or Edge
                    on a computer.
                  </p>
                ) : null}
              </div>
              {board === 'other' ? (
                <>
                  <p className="mt-3 text-fd-muted-foreground">
                    Already running Linux? Prebuilt binaries exist for <strong>Debian</strong>{' '}
                    (buster through trixie) and <strong>Ubuntu</strong> (22.04, 24.04, 26.04) on{' '}
                    <code>arm64</code>, <code>armhf</code>, <code>armv6</code> and <code>amd64</code>{' '}
                    - Raspberry Pi OS included. Run this on the device:
                  </p>
                  <CopyCommand command={LINUX_INSTALL_COMMAND} dataAttr="install-frame-copy-command" className="mt-3 w-full" />
                  <p className="mt-3 text-fd-muted-foreground">
                    It asks for your display and an admin password, installs the latest release
                    as a systemd service, and starts the frame. Then open{' '}
                    <code>http://&lt;frame-ip&gt;:8787/admin</code> to add scenes. Connect a
                    <TextLink href="/devices">display</TextLink> over SPI or HDMI, or run it{' '}
                    <TextLink href="/devices/http-upload">with no display at all</TextLink>.
                  </p>
                </>
              ) : board === 'esp32-s3' ? (
                <>
                  <ol className="mt-3 space-y-2 text-fd-muted-foreground">
                    <li>
                      1. Plug the board into your computer and open{' '}
                      <TextLink href={FLASHER_URL}>flash.frameos.net</TextLink>.
                    </li>
                    <li>
                      2. Pick your board - a preset for a{' '}
                      <TextLink href="/devices/seeed-buying-guide">Seeed reTerminal</TextLink>, a
                      Waveshare <TextLink href="/devices/waveshare-esp32-s3-photopainter">PhotoPainter</TextLink>{' '}
                      and <TextLink href="/guide/esp32#supported-boards">many more</TextLink>, or any other
                      ESP32-S3 with a panel wired to it. Then give it a name, your WiFi and the scenes
                      to start with.
                    </li>
                    <li>
                      3. Click <strong>Flash FrameOS &amp; set it up</strong>. The latest release goes on
                      once its signature checks out, then your settings and scenes follow over the
                      cable. The first boot formats the board&apos;s storage, which takes a few minutes.
                    </li>
                    <li>
                      4. Add more scenes from the{' '}
                      <TextLink href="/guide/scene-store">Scene store</TextLink> on the frame itself.
                    </li>
                  </ol>
                  <p className="mt-3 text-fd-muted-foreground">
                    An ESP32 has no admin page. To change its WiFi, restart it, or update the
                    firmware and keep its settings and scenes, plug it back in and use the board
                    tools on the same page. Your WiFi password goes straight to the board and is
                    never uploaded.
                  </p>
                </>
              ) : board === 'esp32-c3' || board === 'pico' ? (
                <p className="mt-3 text-fd-muted-foreground">
                  {board === 'esp32-c3' ? (
                    <>
                      An <TextLink href="/guide/esp32">ESP32-C3</TextLink>{' '}
                      has no PSRAM, so it can&apos;t render a scene itself.
                    </>
                  ) : (
                    <>
                      A <TextLink href="/guide/pico">Pico W or Pico 2 W</TextLink>{' '}
                      can&apos;t hold a renderer.
                    </>
                  )}{' '}
                  It runs as a <TextLink href="/guide/esp32#render-on-server">thin client</TextLink>:
                  a <TextLink href="/guide/backend">self-hosted backend</TextLink> renders every
                  refresh and the board draws the result. Neither standalone nor FrameOS Cloud can
                  do that yet, so start with the backend, then{' '}
                  {board === 'esp32-c3' ? (
                    <>
                      flash the board from its{' '}
                      <TextLink href="/guide/esp32#flash-the-device">USB card</TextLink>.
                    </>
                  ) : (
                    <>
                      copy the <TextLink href="/guide/pico#flash-it">FrameOS UF2</TextLink> onto
                      the board.
                    </>
                  )}
                </p>
              ) : (
              <ol className="mt-3 space-y-2 text-fd-muted-foreground">
                <li>
                  1. Flash the image with{' '}
                  <TextLink href="https://www.raspberrypi.com/software/">
                    Raspberry Pi Imager
                  </TextLink>{' '}
                  or{' '}
                  <TextLink href="https://etcher.balena.io/">
                    balenaEtcher
                  </TextLink>
                  .
                </li>
                <li>
                  2. Boot the Pi and join <code>FrameOS-Setup</code> with password{' '}
                  <code>frame1234</code>.
                </li>
                <li>
                  3. Open <code>http://10.42.0.1/</code>, connect WiFi, pick your display, and
                  choose <strong>Nothing (standalone)</strong> under <em>Manage via</em>.
                </li>
                <li>
                  4. Open <code>http://&lt;frame-ip&gt;:8787/admin</code> and{' '}
                  <TextLink href="/guide/standalone#3-open-the-admin-page">add scenes</TextLink>.
                </li>
              </ol>
              )}
              {board === 'esp32-s3' ? (
                <p className="mt-3 border-t pt-3 text-fd-muted-foreground">
                  Want over-the-air updates, logs and previews?{' '}
                  <TextLink href="/guide/cloud#flash-an-esp32-from-the-browser">FrameOS Cloud</TextLink> and a{' '}
                  <TextLink href="/guide/backend">self-hosted backend</TextLink> flash ESP32s from the
                  browser too. Details in <TextLink href="/guide/esp32">the ESP32 guide</TextLink>.
                </p>
              ) : isPiImage(board) || board === 'other' ? (
                <p className="mt-3 border-t pt-3 text-fd-muted-foreground">
                  Details in <TextLink href="/guide/standalone">the standalone frame guide</TextLink>. You can
                  hand the frame to a <TextLink href="/guide/backend">backend</TextLink> or{' '}
                  <TextLink href="/guide/cloud">the cloud</TextLink> later - no reflash.
                </p>
              ) : null}
            </>
          ) : selectedPath === 'backend' ? (
            <>
              <p className="mb-2 font-semibold">Run the backend on your computer or server</p>
              <p className="text-fd-muted-foreground">
                Copy the one-liner below. It installs Docker if needed, then runs the{' '}
                <TextLink href={DOCKER_HUB_URL}>
                  <code>frameos/frameos</code>
                </TextLink>{' '}
                image on port 8989. Then add a frame:{' '}
                <TextLink href="/guide/raspberry#option-1-prebuilt-frameos-sd-image-recommended">flash a preconfigured SD image</TextLink>,{' '}
                <TextLink href="/guide/raspberry#option-2-stock-raspberry-pi-os-lite">deploy over SSH</TextLink> to a Pi,
                or <TextLink href="/guide/esp32#flash-the-device">flash an ESP32</TextLink> from the browser.
              </p>
              <CopyCommand command={INSTALL_COMMAND} dataAttr="install-backend-copy-command" className="mt-3 w-full" />
              <p className="mt-3 text-fd-muted-foreground">
                Prefer another method? There's a{' '}
                <TextLink href="/guide/backend#home-assistant-add-on">Home Assistant add-on</TextLink>,{' '}
                <TextLink href="/guide/backend#running-via-docker-manually">manual Docker</TextLink> and{' '}
                <TextLink href="/guide/backend#local-development-with-flox">local development with Flox</TextLink>,
                all in <TextLink href="/guide/backend">the backend guide</TextLink>. You can also{' '}
                <TextLink href="/guide/backend#cloud">link the backend to FrameOS Cloud</TextLink> later.
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                <div>
                  <p className="font-semibold">Create an account, then add a frame</p>
                  <p className="mt-1 text-fd-muted-foreground">
                    Your browser{' '}
                    <TextLink href="/guide/cloud#sd-card-image-raspberry-pi">builds a personalized SD image</TextLink> for a Pi
                    or <TextLink href="/guide/cloud#flash-an-esp32-from-the-browser">flashes an ESP32</TextLink> over USB,
                    or you run a{' '}
                    <TextLink href="/guide/cloud#install-script-any-pi-most-linux">one-line install script</TextLink> on any
                    Linux box. The frame enrolls on first boot.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <LinkButton href={CLOUD_SIGNUP_URL} dataAttr="install-cloud-signup">
                    Sign up at cloud.frameos.net
                  </LinkButton>
                  <LinkButton href={CLOUD_URL} variant="secondary" dataAttr="install-cloud-login">
                    Log in
                  </LinkButton>
                </div>
              </div>
              <ul className="mt-3 space-y-2 text-fd-muted-foreground">
                <li>
                  This is the quickest way to try FrameOS, and nothing locks you in: a frame can{' '}
                  <TextLink href="/guide/cloud#moving-between-cloud-backend-and-standalone">move to a self-hosted backend or go standalone</TextLink>{' '}
                  at any time, keeping its scenes.
                </li>
                <li>
                  Built secure by default, with a narrower footprint than the self-hosted backend: no shell, no compiled code,
                  only <TextLink href="/guide/scenes#execution">sandboxed scenes</TextLink>, and your WiFi password never
                  leaves the browser. See{' '}
                  <TextLink href="/guide/cloud#what-the-cloud-does-and-deliberately-doesnt">what the cloud does, and deliberately doesn't</TextLink>.
                </li>
                <li>
                  The cloud is <TextLink href="https://github.com/FrameOS/frameos">open source</TextLink> too. You can
                  run your own instance, though we don't recommend it (yet).
                </li>
              </ul>
              <p className="mt-3 border-t pt-3 text-fd-muted-foreground">
                Forever free for personal use, quotas permitting. Read the{' '}
                <TextLink href="/guide/cloud">FrameOS Cloud guide</TextLink> for what it can and
                cannot do, and its <TextLink href="/guide/cloud#privacy">privacy</TextLink> and{' '}
                <TextLink href="/guide/cloud#limits">limits</TextLink>.
              </p>
            </>
          )}
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-fd-muted-foreground">
          Choose a path to see the next step.
        </p>
      )}
    </div>
  );
}
