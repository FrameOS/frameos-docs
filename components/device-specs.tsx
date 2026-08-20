import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { Device } from '@/lib/device-schema';
import { DevicePhoto } from '@/components/device-photo';
import { deviceSupportsEsp32, platformLabels } from '@/lib/device-support';

const waveshareAffiliateId = '79380';

function productUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'www.waveshare.com' || parsed.pathname.startsWith('/wiki/')) {
      return url;
    }
  } catch {
    return url;
  }

  if (url.includes('aff_id=')) return url;
  return url.includes('?') ? `${url}&aff_id=${waveshareAffiliateId}` : `${url}?&aff_id=${waveshareAffiliateId}`;
}

// Store domains we recognise as the vendor's own shop, so the button can say
// "Buy from Pimoroni" instead of a bare "Open product page".
const vendorStoreDomains: Record<string, string> = {
  Waveshare: 'waveshare.com',
  Pimoroni: 'pimoroni.com',
  'Seeed Studio': 'seeedstudio.com',
  TRMNL: 'trmnl.com',
  Elecrow: 'elecrow.com',
  XTEINK: 'xteink.com',
  'Good Display': 'good-display.com',
};

function hostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs uppercase tracking-wide text-fd-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{children}</dd>
    </div>
  );
}

export function DeviceSpecs({ device }: { device: Device }) {
  const supportsEsp32 = deviceSupportsEsp32(device);
  const platforms = device.platforms?.length
    ? device.platforms
    : supportsEsp32
      ? ['raspberry-pi', 'esp32-s3']
      : ['raspberry-pi'];
  const affiliateProductUrl = device.productUrl ? productUrl(device.productUrl) : null;
  const caseOptions = device.cases ?? [];
  const vendorLinks = device.links ?? [];
  const productHost = device.productUrl ? hostname(device.productUrl) : null;
  const vendorDomain = vendorStoreDomains[device.vendor];
  const isKnownStore = Boolean(vendorDomain && productHost?.endsWith(vendorDomain));
  const productCtaLabel = isKnownStore ? `Buy from ${device.vendor}` : 'Open product page';
  // Generated panel drawings (scripts/generate-device-placeholders.mjs) are not photos: no lightbox, no 'photo' label.
  const isPlaceholder = device.image?.includes('/placeholders/') ?? false;
  const productCtaTitle = isKnownStore ? `Official ${device.vendor} store` : 'Product page';
  const productRel = device.vendor === 'Waveshare' ? 'sponsored noopener noreferrer' : 'noopener noreferrer';

  return (
    <div className="not-prose rounded-lg border bg-fd-card p-4">
      {device.image || affiliateProductUrl ? (
        <div className="mb-4 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {device.image && isPlaceholder ? (
              <img
                src={device.image}
                alt=""
                className="h-28 w-44 flex-none rounded border bg-white object-contain p-1"
              />
            ) : device.image ? (
              <DevicePhoto
                src={device.image}
                alt={`${device.vendor} ${device.model}`}
                className="h-28 w-44 flex-none"
              />
            ) : null}
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-fd-muted-foreground">
                {affiliateProductUrl ? productCtaTitle : isPlaceholder ? 'Illustration' : 'Product photo'}
              </p>
              <p className="text-sm font-medium text-fd-foreground">
                {affiliateProductUrl
                  ? isKnownStore
                    ? 'Official store page for this device.'
                    : (productHost ?? device.productUrl)
                  : `${device.vendor} ${device.model}`}
              </p>
            </div>
          </div>
          {affiliateProductUrl ? (
            <Link
              href={affiliateProductUrl}
              target="_blank"
              rel={productRel}
              className="inline-flex flex-none items-center justify-center gap-2 rounded-md bg-fd-primary px-3 py-2 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
            >
              {productCtaLabel}
              <ExternalLink className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      ) : null}
      {vendorLinks.length > 0 ? (
        <div className="mb-4 border-b pb-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-fd-muted-foreground">
            Manufacturer docs &amp; datasheets
          </p>
          <div className="flex flex-wrap gap-2">
            {vendorLinks.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-fd-accent"
              >
                {link.label}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {caseOptions.length > 0 ? (
        <div className="mb-4 border-b pb-4">
          <div className="mb-3">
            <p className="text-xs uppercase tracking-wide text-fd-muted-foreground">3D-printable case</p>
            <p className="text-sm font-medium text-fd-foreground">
              Exact FrameOS Case Maker preset{caseOptions.length === 1 ? '' : 's'} for this display.
            </p>
          </div>
          <div className={`grid gap-4 ${caseOptions.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {caseOptions.map((caseOption) => (
              <div key={caseOption.url} className="flex gap-3">
                {caseOption.image ? (
                  <img
                    src={caseOption.image}
                    alt={`${caseOption.label} preview`}
                    loading="lazy"
                    className="h-24 w-32 flex-none rounded-md border bg-fd-muted object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex flex-col justify-center gap-2">
                  <p className="text-sm font-medium text-fd-foreground">{caseOption.label}</p>
                  <Link
                    href={caseOption.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-fd-accent"
                  >
                    Open Case Maker
                    <ExternalLink className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
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
        <Spec label="Platforms">
          {platforms.map((platform, index) => {
            const entry = platformLabels[platform] ?? { label: platform, href: '/guide' };
            return (
              <span key={platform}>
                {index > 0 ? ' · ' : null}
                {platform === 'raspberry-pi' ? (
                  entry.label
                ) : (
                  <Link href={entry.href} className="text-fd-primary hover:underline">
                    {entry.label}
                  </Link>
                )}
              </span>
            );
          })}
        </Spec>
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
      </dl>
      <p className="mt-4 border-t pt-3 text-xs text-fd-muted-foreground">
        Part of the <Link href="/devices" className="text-fd-primary hover:underline">FrameOS device database</Link>.
        Spotted an error, or tested this panel? Edit this page on GitHub - it's a markdown file.
      </p>
    </div>
  );
}
