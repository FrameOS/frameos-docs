'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { CompareSlider } from '@/components/compare-slider';

export interface ComparePhoto {
  id: string;
  /** Short name under the thumbnail. */
  label: string;
  /** What the photo shows, for the images' alt text. */
  alt: string;
  before: string;
  after: string;
}

/**
 * A before/after slider with a row of thumbnails to switch the photo. Every
 * pair has the same pixel size; the stage renders it pixel-for-pixel on 1x
 * screens and at an integer scale on 2x ones, so a dither stays crisp.
 */
export function CompareGallery({
  photos,
  width,
  height,
  beforeLabel,
  afterLabel,
  className,
}: {
  photos: ComparePhoto[];
  width: number;
  height: number;
  beforeLabel: string;
  afterLabel: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(photos[0]?.id);
  const active = photos.find((p) => p.id === activeId) ?? photos[0];
  if (!active) return null;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <CompareSlider
        key={active.id}
        before={{ src: active.before, alt: `${active.alt}, dithered for a Spectra 6 panel with no adjustments`, label: beforeLabel }}
        after={{ src: active.after, alt: `${active.alt}, dithered for a Spectra 6 panel after the automatic fit`, label: afterLabel }}
        width={width}
        height={height}
        initial={50}
        pixelated
      />
      <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Photos">
        {photos.map((photo) => {
          const selected = photo.id === active.id;
          return (
            <button
              key={photo.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveId(photo.id)}
              className={cn(
                'flex w-24 flex-col items-center gap-1 rounded-lg border p-1 text-xs transition-colors',
                selected ? 'border-fd-primary bg-fd-accent' : 'hover:bg-fd-accent/60',
              )}
            >
              <Image
                src={photo.after}
                alt=""
                width={width}
                height={height}
                className="aspect-[5/3] w-full rounded object-cover"
                style={{ imageRendering: 'auto' }}
              />
              <span className="truncate">{photo.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
