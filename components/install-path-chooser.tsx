'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Cloud, Cpu, Download, ExternalLink, Server } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CopyCommand } from '@/components/copy-command';

const INSTALL_COMMAND = 'bash <(curl -fsSL https://frameos.net/install.sh)';
// Release assets are versioned (frameos-<version>-<board>-buildroot.img.gz),
// so the download button resolves the latest release through the GitHub API
// on click and falls back to the release page if that fails.
const RELEASES_URL = 'https://github.com/FrameOS/frameos/releases/latest';
const LATEST_RELEASE_API = 'https://api.github.com/repos/FrameOS/frameos/releases/latest';
const CLOUD_SIGNUP_URL = 'https://cloud.frameos.net/signup';
const DOCKER_HUB_URL = 'https://hub.docker.com/r/frameos/frameos';

const piImages = [
  { id: 'raspberry-pi-64', label: 'Raspberry Pi Zero 2 W / 3 / 4 / CM4 (64-bit)' },
  { id: 'raspberry-pi-5', label: 'Raspberry Pi 5 / CM5' },
  { id: 'raspberry-pi-32', label: 'Raspberry Pi Zero / Zero W / 1 / CM1 (32-bit)' },
  { id: 'other', label: 'Other (Debian or Ubuntu on arm64, armhf, armv6, amd64)' },
] as const;

type PiImage = (typeof piImages)[number]['id'];

// The standalone installer (scripts/frameos-setup.sh in the main repo), served
// with the newest release stamped in. Without a claim token it installs a
// standalone frame - it asks about the display and an admin password, and
// optionally a self-hosted backend to connect to.
const LINUX_INSTALL_COMMAND = 'curl -fsSL https://cloud.frameos.net/install.sh | sudo sh';

async function latestImageUrl(board: Exclude<PiImage, 'other'>): Promise<string> {
  const res = await fetch(LATEST_RELEASE_API, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const release = (await res.json()) as { assets?: { name: string; browser_download_url: string }[] };
  const asset = release.assets?.find((a) => a.name.endsWith(`-${board}-buildroot.img.gz`));
  if (!asset) throw new Error('asset not found');
  return asset.browser_download_url;
}

type InstallPath = 'frame' | 'backend' | 'cloud';

const installOptions = [
  {
    id: 'frame',
    icon: Cpu,
    title: 'Just a frame',
    description: 'Flash a Pi and set it up through a WiFi hotspot, or install on any Linux. No backend, no account.',
  },
  {
    id: 'backend',
    icon: Server,
    title: 'Self-hosted backend',
    description: 'Run the frameos Docker image on your laptop, server or NAS.',
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'FrameOS Cloud',
    description: 'Manage frames from a browser. Least hassle to setup. Also open source, no lockin.',
  },
] as const;

function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-fd-accent"
    >
      {children}
      <ExternalLink className="size-3.5" aria-hidden="true" />
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
  const [board, setBoard] = useState<PiImage>('raspberry-pi-64');
  const [downloading, setDownloading] = useState(false);

  async function downloadImage() {
    if (board === 'other') return;
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
              onClick={() => setSelectedPath(option.id)}
              className={cn(
                'flex h-full flex-col items-start gap-2 rounded-lg border bg-fd-background p-4 text-left transition-colors',
                selected
                  ? 'border-fd-primary ring-1 ring-fd-primary'
                  : 'hover:border-fd-primary/50 hover:bg-fd-accent/50',
              )}
            >
              <span
                className={cn(
                  'inline-flex size-8 shrink-0 items-center justify-center rounded-full border',
                  selected
                    ? 'border-fd-primary bg-fd-primary text-fd-primary-foreground'
                    : 'bg-fd-background text-fd-muted-foreground',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold">{option.title}</span>
                <span className="mt-1 block text-sm text-fd-muted-foreground">
                  {option.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selectedPath ? (
        <div className="mt-3 rounded-lg border bg-fd-card/50 p-4 text-left">
          {selectedPath === 'frame' ? (
            <>
              <div className="border-b pb-3">
                <p className="text-sm font-medium">Pick a platform</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Raspberry Pi model"
                    value={board}
                    onChange={(e) => setBoard(e.target.value as PiImage)}
                    className="min-w-0 flex-1 rounded-lg border bg-fd-background px-3 py-1.5 text-sm"
                  >
                    {piImages.map((img) => (
                      <option key={img.id} value={img.id}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                  {board !== 'other' ? (
                    <button
                      type="button"
                      onClick={downloadImage}
                      disabled={downloading}
                      className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      <Download className="size-3.5" aria-hidden="true" />
                      {downloading ? 'Finding latest…' : 'Download'}
                    </button>
                  ) : null}
                </div>
                {board !== 'other' ? (
                  <p className="mt-2 text-xs text-fd-muted-foreground">
                    Latest release, <code>{board}</code>. All images and checksums are on{' '}
                    <Link href={RELEASES_URL} target="_blank" rel="noopener noreferrer" className="text-fd-primary hover:underline">
                      GitHub
                    </Link>
                    .
                  </p>
                ) : null}
              </div>
              {board === 'other' ? (
                <>
                  <p className="mt-3 text-sm text-fd-muted-foreground">
                    Already running Linux? Prebuilt binaries exist for <strong>Debian</strong>{' '}
                    (buster through trixie) and <strong>Ubuntu</strong> (22.04, 24.04, 26.04) on{' '}
                    <code>arm64</code>, <code>armhf</code>, <code>armv6</code> and <code>amd64</code>{' '}
                    - Raspberry Pi OS included. Run this on the device:
                  </p>
                  <CopyCommand command={LINUX_INSTALL_COMMAND} className="mt-3 w-full" />
                  <p className="mt-3 text-sm text-fd-muted-foreground">
                    It asks for your display and an admin password, installs the latest release
                    as a systemd service, and starts the frame. Then open{' '}
                    <code>http://&lt;frame-ip&gt;:8787/admin</code> to add scenes. Connect a
                    display over SPI, HDMI, or run it with no display at all.
                  </p>
                </>
              ) : (
              <ol className="mt-3 space-y-2 text-sm text-fd-muted-foreground">
                <li>
                  1. Flash the image with{' '}
                  <Link
                    href="https://www.raspberrypi.com/software/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary hover:underline"
                  >
                    Raspberry Pi Imager
                  </Link>{' '}
                  or{' '}
                  <Link
                    href="https://etcher.balena.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary hover:underline"
                  >
                    balenaEtcher
                  </Link>
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
                  4. Open <code>http://&lt;frame-ip&gt;:8787/admin</code> and add scenes.
                </li>
              </ol>
              )}
              <p className="mt-3 border-t pt-3 text-sm text-fd-muted-foreground">
                Details in{' '}
                <Link href="/guide/standalone" className="text-fd-primary hover:underline">
                  the standalone frame guide
                </Link>
                . You can hand the frame to a backend or the cloud later - no reflash.
              </p>
            </>
          ) : selectedPath === 'backend' ? (
            <>
              <p className="mb-2 text-sm font-medium">Run the backend on your computer or server</p>
              <p className="text-sm text-fd-muted-foreground">
                Copy the one-liner below. It installs Docker if needed, then runs the{' '}
                <Link href={DOCKER_HUB_URL} target="_blank" rel="noopener noreferrer" className="text-fd-primary hover:underline">
                  <code>frameos/frameos</code>
                </Link>{' '}
                image on port 8989. Then add a frame: flash a
                preconfigured SD image, deploy over SSH, or flash an ESP32 from the browser.
              </p>
              <CopyCommand command={INSTALL_COMMAND} className="mt-3 w-full" />
              <p className="mt-3 text-sm text-fd-muted-foreground">
                Prefer another method? See{' '}
                <Link href="/guide/backend" className="text-fd-primary hover:underline">
                  the backend docs
                </Link>{' '}
                for the Home Assistant add-on, manual Docker, and local development.
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                <div>
                  <p className="text-sm font-medium">Create an account, then add a frame</p>
                  <p className="mt-1 text-sm text-fd-muted-foreground">
                    Your browser builds a personalized SD image for a Pi or flashes an ESP32 over
                    USB, or you run a one-line install script on any Linux box. The frame enrolls
                    on first boot.
                  </p>
                </div>
                <ExternalButton href={CLOUD_SIGNUP_URL}>Sign up at cloud.frameos.net</ExternalButton>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-fd-muted-foreground">
                <li>
                  · Assign scenes from the{' '}
                  <Link
                    href="https://scenes.frameos.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary hover:underline"
                  >
                    scene store
                  </Link>
                  , see previews, logs and metrics, queue signed firmware updates.
                </li>
                <li>
                  · Already have a frame running? Link it with the code it shows on its display.
                </li>
                <li>
                  · No shell, no compiled code: the cloud only pushes sandboxed scenes, and the
                  frame keeps working if the cloud is unreachable.
                </li>
              </ul>
              <p className="mt-3 border-t pt-3 text-sm text-fd-muted-foreground">
                Free while in beta. Read{' '}
                <Link href="/guide/cloud" className="text-fd-primary hover:underline">
                  the FrameOS Cloud guide
                </Link>{' '}
                for what it can and cannot do.
              </p>
            </>
          )}
        </div>
      ) : (
        <p className="mt-2 text-center text-sm text-fd-muted-foreground">
          Choose a path to see the next step.
        </p>
      )}
    </div>
  );
}
