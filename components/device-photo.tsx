'use client';
import { useEffect, useState } from 'react';
import { Maximize2, X } from 'lucide-react';

/**
 * The product shot in the spec card, with a click-to-zoom overlay. Vendor photos
 * carry readable spec text that is illegible at thumbnail size, so the full
 * image gets its own lightbox (and a plain "open the file" fallback link).
 */
export function DevicePhoto({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Zoom in on ${alt}`}
        className={`group relative block cursor-zoom-in overflow-hidden rounded-md border bg-white transition-colors hover:border-fd-primary ${className ?? ''}`}
      >
        <img src={src} alt={alt} loading="lazy" className="size-full object-contain p-1" />
        <span className="absolute bottom-1 right-1 rounded bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="size-3" aria-hidden="true" />
        </span>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <img
            src={src}
            alt={alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-full max-w-full cursor-default rounded-lg bg-white object-contain p-2 shadow-2xl"
          />
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/25"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/25"
          >
            Open image in a new tab
          </a>
        </div>
      ) : null}
    </>
  );
}
