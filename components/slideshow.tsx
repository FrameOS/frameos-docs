'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface Slide {
  src: string;
  alt: string;
  caption: string;
}

export function Slideshow({
  slides,
  interval = 5000,
  aspect = 'aspect-[4/3]',
  fit = 'cover',
  className,
}: {
  slides: Slide[];
  interval?: number;
  /** tailwind aspect-ratio class for the stage */
  aspect?: string;
  fit?: 'cover' | 'contain';
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => go(1), interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [go, interval, paused]);

  return (
    <figure
      className={cn('group relative', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={cn('relative w-full overflow-hidden rounded-xl border bg-fd-card', aspect)}>
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
          onClick={() => go(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4">
        <span className="text-sm text-fd-muted-foreground">{slides[index].caption}</span>
        <span className="flex shrink-0 gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                'size-2 rounded-full transition-colors',
                i === index ? 'bg-fd-primary' : 'bg-fd-muted-foreground/30 hover:bg-fd-muted-foreground/60',
              )}
            />
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
