'use client';

import { useState, type ComponentProps } from 'react';
import { createPortal } from 'react-dom';
import Image, { type ImageProps } from 'next/image';
import { LightboxOverlay } from '@/components/lightbox';

/** Markdown `<img>` replacement for blog posts: click to open in a lightbox. */
export function BlogImage({ src, alt, ...rest }: ComponentProps<'img'>) {
  const [open, setOpen] = useState(false);
  if (!src || src instanceof Blob) return <img src={src as string | undefined} alt={alt} {...rest} />;
  const img = src as ImageProps['src'];
  const url = typeof img === 'string' ? img : 'default' in img ? img.default.src : img.src;
  const isGif = url.endsWith('.gif');
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt ?? ''}`}
        className="block w-full cursor-zoom-in"
      >
        <Image
          {...(rest as Omit<ImageProps, 'src' | 'alt'>)}
          src={src as ImageProps['src']}
          alt={alt ?? ''}
          sizes="(max-width: 768px) 100vw, 768px"
          unoptimized={isGif}
          className="w-full border"
        />
      </button>
      {open
        ? createPortal(<LightboxOverlay src={url} alt={alt ?? ''} onClose={() => setOpen(false)} />, document.body)
        : null}
    </>
  );
}
