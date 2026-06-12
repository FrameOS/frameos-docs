import Link from 'next/link';
import type { Device } from '@/lib/device-schema';

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-fd-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

export function DeviceSpecs({ device }: { device: Device }) {
  return (
    <div className="not-prose rounded-lg border bg-fd-card p-4">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-4">
        <Spec label="Vendor">{device.vendor}</Spec>
        <Spec label="Model">{device.model}</Spec>
        <Spec label="Technology">{device.technology}</Spec>
        <Spec label="Colors">{device.colors}</Spec>
        <Spec label="Resolution">
          {device.width && device.height ? `${device.width}×${device.height} px` : 'Any / configurable'}
        </Spec>
        <Spec label="Size">{device.diagonal ? `${device.diagonal}″ diagonal` : '-'}</Spec>
        <Spec label="Interface">{device.interface}</Spec>
        <Spec label="Status">
          {device.status === 'tested' ? (
            <span className="text-green-700 dark:text-green-400">🟢 Confirmed working</span>
          ) : (
            <span className="text-amber-700 dark:text-amber-400">🟡 Should work</span>
          )}
        </Spec>
        {device.buttons ? <Spec label="Buttons">{device.buttons} (usable in scenes)</Spec> : null}
        <Spec label="FrameOS driver">
          <code className="rounded bg-fd-muted px-1.5 py-0.5 text-xs">{device.driver}</code>
        </Spec>
        {device.productUrl ? (
          <Spec label="Product page">
            <Link href={device.productUrl} rel="noopener" className="text-fd-primary hover:underline">
              {new URL(device.productUrl).hostname.replace(/^www\./, '')} ↗
            </Link>
          </Spec>
        ) : null}
      </dl>
      <p className="mt-4 border-t pt-3 text-xs text-fd-muted-foreground">
        Part of the <Link href="/devices" className="text-fd-primary hover:underline">FrameOS device database</Link>.
        Spotted an error, or tested this panel? Edit this page on GitHub - it's a markdown file.
      </p>
    </div>
  );
}
