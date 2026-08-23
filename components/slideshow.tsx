'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LightboxOverlay } from '@/components/lightbox';

export interface Slide {
  src: string;
  alt: string;
  caption: React.ReactNode;
}

export function Slideshow({
  slides,
  interval = 5000,
  aspect = 'aspect-[4/3]',
  fit = 'cover',
  frame = true,
  className,
}: {
  slides: Slide[];
  interval?: number;
  /** tailwind aspect-ratio class for the stage */
  aspect?: string;
  fit?: 'cover' | 'contain';
  /** draw a border + card background behind the slides (off for screenshots with their own window shadow) */
  frame?: boolean;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length),
    [slides.length],
  );

  // Restart the timer whenever the slide changes (so a manual click gives the new
  // slide a full interval) and stop it entirely while the pointer is over the figure.
  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => go(1), interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [go, interval, paused, index]);

  return (
    <figure
      className={cn('group relative', className)}
      // pointermove as well as enter: if the page hydrates with the cursor already
      // over the slideshow, no enter event ever fires.
      onPointerEnter={() => setPaused(true)}
      onPointerMove={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div
        className={cn('relative w-full cursor-zoom-in overflow-hidden rounded-xl', frame && 'border bg-fd-card', aspect)}
        onClick={() => setZoomed(true)}
        role="button"
        tabIndex={0}
        aria-label="View slide larger"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setZoomed(true);
          }
        }}
      >
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            priority={i === 0}
            className={cn(
              'transition-opacity duration-700',
              fit === 'cover' ? 'object-cover' : 'object-contain',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      {/* Fixed two-line caption height: captions of different lengths must not
          resize the figure, or everything below it jumps on every slide change. */}
      <figcaption className="mt-3 flex items-start justify-between gap-4">
        <span className="line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-fd-muted-foreground">
          {slides[index].caption}
        </span>
        <span className="flex shrink-0 gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'size-2 cursor-pointer rounded-full transition-colors',
                i === index ? 'bg-fd-primary' : 'bg-fd-muted-foreground/30 hover:bg-fd-muted-foreground/60',
              )}
            />
          ))}
        </span>
      </figcaption>
      {zoomed ? (
        <LightboxOverlay
          src={slides[index].src}
          alt={slides[index].alt}
          caption={slides[index].caption}
          onClose={() => setZoomed(false)}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
        />
      ) : null}
    </figure>
  );
}
