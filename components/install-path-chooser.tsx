'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Cpu, ExternalLink, Server } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CopyCommand } from '@/components/copy-command';

const INSTALL_COMMAND = 'bash <(curl -fsSL https://frameos.net/install.sh)';
const PI_ZERO_2W_IMAGE_URL =
  'https://github.com/FrameOS/frameos/releases/download/v2026.6.27/frameos-2026.6.27-raspberry-pi-zero-2-w-buildroot.img.gz';

type InstallPath = 'backend' | 'frame';

const installOptions = [
  {
    id: 'backend',
    icon: Server,
    title: 'Backend',
    description: 'Dockerized webapp for designing scenes and managing frames.',
  },
  {
    id: 'frame',
    icon: Cpu,
    title: 'Frame',
    description: 'Standalone Pi Zero 2 W image for setting up one frame directly.',
  },
] as const;

export function InstallPathChooser({ className }: { className?: string }) {
  const [selectedPath, setSelectedPath] = useState<InstallPath | null>(null);

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-fd-muted-foreground">
          Install FrameOS
        </p>
        <h2 className="mt-1 text-base font-semibold">Start with the backend or the frame?</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
                'flex h-full items-start gap-3 rounded-lg border bg-fd-background p-4 text-left transition-colors',
                selected
                  ? 'border-fd-primary ring-1 ring-fd-primary'
                  : 'hover:border-fd-primary/50 hover:bg-fd-accent/50',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border',
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
          {selectedPath === 'backend' ? (
            <>
              <p className="mb-2 text-sm font-medium">Run the backend webapp</p>
              <p className="text-sm text-fd-muted-foreground">
                Copy the one-liner below. It installs Docker if needed, then starts FrameOS on port
                8989.
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
                  <p className="text-sm font-medium">Flash the standalone image</p>
                  <p className="mt-1 text-sm text-fd-muted-foreground">
                    This direct image is only for Raspberry Pi Zero 2 W for now. For ESP32, HDMI,
                    other Pis, and custom devices, use the backend instead.
                  </p>
                </div>
                <Link
                  href={PI_ZERO_2W_IMAGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-fd-accent"
                >
                  Download .img.gz
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
              <ol className="mt-3 space-y-2 text-sm text-fd-muted-foreground">
                <li>
                  1. Flash the image with{' '}
                  <Link
                    href="https://etcher.balena.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary hover:underline"
                  >
                    balenaEtcher
                  </Link>{' '}
                  or{' '}
                  <Link
                    href="https://www.raspberrypi.com/software/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fd-primary hover:underline"
                  >
                    Raspberry Pi Imager
                  </Link>
                  .
                </li>
                <li>
                  2. Boot the Pi and join <code>FrameOS-Setup</code> with password{' '}
                  <code>frame1234</code>.
                </li>
                <li>
                  3. Open <code>http://10.42.0.1/</code> to connect WiFi and set up the frame.
                </li>
              </ol>
              <p className="mt-3 border-t pt-3 text-sm text-fd-muted-foreground">
                Prefer another method? See{' '}
                <Link href="/guide/raspberry" className="text-fd-primary hover:underline">
                  the Raspberry Pi docs
                </Link>{' '}
                for generating a preconfigured image in the backend, or installing on stock
                Raspberry Pi OS Lite.
              </p>
            </>
          )}
        </div>
      ) : (
        <p className="mt-2 text-sm text-fd-muted-foreground">
          Choose a path to see the next step.
        </p>
      )}
    </div>
  );
}
