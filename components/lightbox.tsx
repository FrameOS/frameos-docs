'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Full-screen overlay showing `src` at a large size. Closes on click, Escape or the X. */
export function LightboxOverlay({
  src,
  alt,
  caption,
  onClose,
  onPrev,
  onNext,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  onClose: () => void;
  /** When given, previous/next arrows are shown and ←/→ keys navigate. */
  onPrev?: () => void;
  onNext?: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev?.();
      else if (e.key === 'ArrowRight') onNext?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-zoom-out flex-col items-center justify-center gap-3 bg-black/85 p-4 backdrop-blur-sm md:p-8"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>
      <div className="relative h-[calc(100vh-8rem)] w-full max-w-7xl">
        <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" priority />
      </div>
      {onPrev ? (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:left-6"
        >
          <ChevronLeft className="size-6" />
        </button>
      ) : null}
      {onNext ? (
        <button
          type="button"
          aria-label="Next image"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 md:right-6"
        >
          <ChevronRight className="size-6" />
        </button>
      ) : null}
      {caption ? (
        <p className="max-w-3xl text-center text-sm text-white/80" onClick={(e) => e.stopPropagation()}>
          {caption}
        </p>
      ) : null}
    </div>
  );
}

/** A clickable image that opens itself in a lightbox. */
export function LightboxImage({
  src,
  alt,
  width,
  height,
  caption,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        className={cn('block w-full cursor-zoom-in', className)}
      >
        <Image src={src} alt={alt} width={width} height={height} className="w-full rounded-xl border" />
      </button>
      {open ? <LightboxOverlay src={src} alt={alt} caption={caption} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
