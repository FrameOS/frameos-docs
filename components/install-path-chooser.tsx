'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Cloud, Cpu, ExternalLink, Server } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CopyCommand } from '@/components/copy-command';

const INSTALL_COMMAND = 'bash <(curl -fsSL https://frameos.net/install.sh)';
// Release assets are versioned, so link the release page rather than pinning a
// filename that goes stale: raspberry-pi-64 (Zero 2 W / 3 / 4), raspberry-pi-5
// (Pi 5 / CM5) and raspberry-pi-32 (Zero / Zero W / Pi 1) images live there.
const PI_IMAGE_URL = 'https://github.com/FrameOS/frameos/releases/latest';
const CLOUD_SIGNUP_URL = 'https://cloud.frameos.net/signup';

type InstallPath = 'frame' | 'backend' | 'cloud';

const installOptions = [
  {
    id: 'frame',
    icon: Cpu,
    title: 'Just a frame',
    description: 'Flash a Pi, set it up from your phone. No backend, no account.',
  },
  {
    id: 'backend',
    icon: Server,
    title: 'Self-hosted',
    description: 'Run the backend on your laptop, server or NAS. Full control.',
  },
  {
    id: 'cloud',
    icon: Cloud,
    title: 'FrameOS Cloud',
    description: 'Manage frames from a browser, nothing to host. Free in beta.',
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

export function InstallPathChooser({ className }: { className?: string }) {
  const [selectedPath, setSelectedPath] = useState<InstallPath | null>(null);

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-fd-muted-foreground">
          Get started
        </p>
        <h2 className="mt-1 text-base font-semibold">How do you want to run it?</h2>
      </div>

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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
                <div>
                  <p className="text-sm font-medium">Flash a FrameOS image to a Raspberry Pi</p>
                  <p className="mt-1 text-sm text-fd-muted-foreground">
                    Pick <code>raspberry-pi-64</code> for a Zero 2 W, Pi 3 or Pi 4,{' '}
                    <code>raspberry-pi-5</code> for a Pi 5 or CM5, or{' '}
                    <code>raspberry-pi-32</code> for a Zero, Zero W or Pi 1.
                  </p>
                </div>
                <ExternalButton href={PI_IMAGE_URL}>Download .img.gz</ExternalButton>
              </div>
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
                Copy the one-liner below. It installs Docker if needed, then starts FrameOS on port
                8989. Then add a frame: flash a preconfigured SD image, deploy over SSH, or flash
                an ESP32 from the browser.
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
                    Your browser builds a personalized SD image for a Pi, or flashes an ESP32 over
                    USB. The frame enrolls on first boot.
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
        <p className="mt-2 text-sm text-fd-muted-foreground">
          Choose a path to see the next step. All three render on the device, and a frame can move
          between them.
        </p>
      )}
    </div>
  );
}
