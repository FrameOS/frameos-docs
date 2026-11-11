'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

// What the store's embed posts once its scene has loaded, and what it takes
// from us when the site switches between light and dark
// (frameos cloud/apps/auth-web/src/lib/store-embed.ts).
const READY_MESSAGE = 'frameos-store:embed-ready';
const THEME_MESSAGE = 'frameos-store:theme';
// No ready message by then (the store refuses to be framed, or the network is
// slow): the screenshot stays and the frame goes.
const READY_TIMEOUT_MS = 20000;

type Poster = { src: string; alt: string; width: number; height: number };

/** The screenshot: a link to the scene's page, where the editor is. */
function PosterLink({ poster, href }: { poster: Poster; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block" title="Open the scene in the editor">
      <Image src={poster.src} alt={poster.alt} width={poster.width} height={poster.height} className="w-full rounded-xl border" />
    </a>
  );
}

/** Whether the site is in dark mode (fumadocs puts `dark` on <html>), live. */
function useSiteDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => setDark(document.documentElement.classList.contains('dark'));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributeFilter: ['class'], attributes: true });
    return () => observer.disconnect();
  }, []);
  return dark;
}

/**
 * A scene from scenes.frameos.net, live in its editor: the store's embed mode
 * in an iframe on wide screens, loaded when it nears the viewport, in the
 * site's light or dark. The screenshot (one per theme) stands in until the
 * embed says its scene is loaded, and stays on phones (an editor in a
 * phone-sized frame would swallow the page's scroll) and wherever the embed
 * doesn't come up; a click on it opens the scene's page.
 */
export function LiveSceneEmbed({
  src,
  href,
  title,
  poster,
  posterDark,
  caption,
  liveCaption,
  className,
}: {
  /** The embed's URL: `https://scenes.frameos.net/s/<slug>?embed=1&…`. */
  src: string;
  /** The scene's own page, which the screenshot opens. */
  href: string;
  /** The iframe's accessible name. */
  title: string;
  poster: Poster;
  /** The same in dark mode. */
  posterDark?: Poster;
  /** Under the screenshot. */
  caption?: ReactNode;
  /** Under the live editor, once it has come up. */
  liveCaption?: ReactNode;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const dark = useSiteDark();
  const darkRef = useRef(dark);
  darkRef.current = dark;

  // Wide screens only, once the section is close; it starts in the site's
  // theme as it is then.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof IntersectionObserver === 'undefined') return;
    const wide = window.matchMedia('(min-width: 768px)');
    if (!wide.matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          const url = new URL(src);
          url.searchParams.set('theme', darkRef.current ? 'dark' : 'light');
          setFrameSrc(url.toString());
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [src]);

  useEffect(() => {
    if (!frameSrc || ready) return;
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
  }, [frameSrc, ready, src]);

  // The site switched between light and dark: so does the editor.
  useEffect(() => {
    if (!ready) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: THEME_MESSAGE, theme: dark ? 'dark' : 'light' },
      new URL(src).origin,
    );
  }, [dark, ready, src]);

  const live = frameSrc !== null && !failed;
  const shownCaption = ready ? (liveCaption ?? caption) : caption;
  return (
    <div className={className}>
      <div ref={boxRef} className="relative">
        <div className={cn(ready && 'invisible')} aria-hidden={ready || undefined}>
          <div className={cn(posterDark && 'dark:hidden')}>
            <PosterLink poster={poster} href={href} />
          </div>
          {posterDark ? (
            <div className="hidden dark:block">
              <PosterLink poster={posterDark} href={href} />
            </div>
          ) : null}
        </div>
        {live ? (
          <iframe
            ref={frameRef}
            src={frameSrc}
            title={title}
            // Scripts and its own origin for the editor and the preview's
            // workers. Its bar's Back, Sign in, Fork, Install and AI open the
            // scene's page in this window, on a click; its zip downloads.
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-downloads"
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
