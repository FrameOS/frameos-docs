'use client';

import { useCallback, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * Two images of the same size on top of each other, with a handle that
 * reveals the `after` image to the left of it. Drag with the pointer, or
 * focus the handle and use the arrow keys.
 */
export function CompareSlider({
  before,
  after,
  width,
  height,
  initial = 50,
  pixelated = false,
  className,
}: {
  before: { src: string; alt: string; label: string };
  after: { src: string; alt: string; label: string };
  width: number;
  height: number;
  /** Starting position of the handle, in percent from the left. */
  initial?: number;
  /** Nearest-neighbour scaling, for dithered images shown at an integer scale. */
  pixelated?: boolean;
  className?: string;
}) {
  const [position, setPosition] = useState(initial);
  const imageStyle = pixelated ? ({ imageRendering: 'pixelated' } as const) : undefined;
  const stageRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const moveTo = useCallback((clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons === 0) return;
    moveTo(e.clientX);
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft') setPosition((p) => Math.max(0, p - step));
    else if (e.key === 'ArrowRight') setPosition((p) => Math.min(100, p + step));
    else if (e.key === 'Home') setPosition(0);
    else if (e.key === 'End') setPosition(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={stageRef}
      className={cn('relative select-none overflow-hidden rounded-xl border bg-fd-card', className)}
      style={{ aspectRatio: `${width} / ${height}`, touchAction: 'none' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <Image src={before.src} alt={before.alt} width={width} height={height} className="block h-full w-full" style={imageStyle} draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={after.src} alt={after.alt} width={width} height={height} className="block h-full w-full" style={imageStyle} draggable={false} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
        {after.label}
      </span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
        {before.label}
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label={`Reveal ${after.label}`}
        aria-describedby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 w-0 cursor-ew-resize outline-none"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" />
        <div className="absolute top-1/2 -ml-5 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-md">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6 3 12l6 6" />
            <path d="m15 6 6 6-6 6" />
          </svg>
        </div>
      </div>
      <span id={labelId} className="sr-only">
        Left of the handle: {after.label}. Right of the handle: {before.label}.
      </span>
    </div>
  );
}
