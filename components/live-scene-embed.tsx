'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LightboxImage } from '@/components/lightbox';
import { cn } from '@/lib/cn';

// What the store's embed posts once its scene has loaded
// (frameos cloud/apps/auth-web/src/lib/store-embed.ts).
const READY_MESSAGE = 'frameos-store:embed-ready';
// No ready message by then (the store refuses to be framed, or the network is
// slow): the screenshot stays and the frame goes.
const READY_TIMEOUT_MS = 20000;

/**
 * A scene from scenes.frameos.net, live in its editor: the store's embed mode
 * in an iframe on wide screens, loaded when it nears the viewport. The
 * screenshot stands in until the embed says its scene is loaded, and stays on
 * phones (an editor in a phone-sized frame would swallow the page's scroll)
 * and wherever the embed doesn't come up.
 */
export function LiveSceneEmbed({
  src,
  title,
  poster,
  caption,
  liveCaption,
  className,
}: {
  /** The embed's URL: `https://scenes.frameos.net/s/<slug>?embed=1&…`. */
  src: string;
  /** The iframe's accessible name. */
  title: string;
  poster: { src: string; alt: string; width: number; height: number; caption?: string };
  /** Under the screenshot. */
  caption?: ReactNode;
  /** Under the live editor, once it has come up. */
  liveCaption?: ReactNode;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Wide screens only, once the section is close.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof IntersectionObserver === 'undefined') return;
    const wide = window.matchMedia('(min-width: 768px)');
    if (!wide.matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted || ready) return;
    const origin = new URL(src).origin;
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin === origin &&
        event.source === frameRef.current?.contentWindow &&
        (event.data as { type?: unknown } | null)?.type === READY_MESSAGE
      ) {
        setReady(true);
      }
    };
    window.addEventListener('message', onMessage);
    const timer = window.setTimeout(() => setFailed(true), READY_TIMEOUT_MS);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(timer);
    };
  }, [mounted, ready, src]);

  const live = mounted && !failed;
  const shownCaption = ready ? (liveCaption ?? caption) : caption;
  return (
    <div className={className}>
      <div ref={boxRef} className="relative">
        <div className={cn(ready && 'invisible')} aria-hidden={ready || undefined}>
          <LightboxImage {...poster} caption={poster.caption} />
        </div>
        {live ? (
          <iframe
            ref={frameRef}
            src={src}
            title={title}
            // Scripts and its own origin for the editor and the preview's
            // workers; popups for its "Open in the store", into a normal tab.
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            allow="clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            className={cn(
              'absolute inset-0 h-full w-full rounded-xl border bg-fd-background transition-opacity duration-500',
              ready ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
          />
        ) : null}
      </div>
      {shownCaption ? (
        <p className="mx-auto mt-3 max-w-3xl text-center text-sm text-fd-muted-foreground">{shownCaption}</p>
      ) : null}
    </div>
  );
}
