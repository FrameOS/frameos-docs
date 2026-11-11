'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/cn';

// What the store's embed posts once its scene has loaded, and what it takes
// from us when the site switches between light and dark
// (frameos cloud/apps/auth-web/src/lib/store-embed.ts).
const READY_MESSAGE = 'frameos-store:embed-ready';
const THEME_MESSAGE = 'frameos-store:theme';
// No ready message by then (the store refuses to be framed, or the network is
// slow): the screenshot stays and the frame goes.
const READY_TIMEOUT_MS = 20000;
// How long a frame takes to fade in (the iframe's duration-500).
const FADE_MS = 500;

type Poster = { src: string; alt: string; width: number; height: number };

export type EmbedScene = {
  key: string;
  /** The button's name, and the iframe's. */
  label: string;
  /** The embed's URL: `https://scenes.frameos.net/s/<slug>?embed=1&…`. */
  src: string;
  /** The scene's own page, which its screenshot opens. */
  href: string;
  poster: Poster;
  /** The same in dark mode. */
  posterDark?: Poster;
  /** Under the screenshot. */
  caption?: ReactNode;
  /** Under the live editor, once it has come up. */
  liveCaption?: ReactNode;
};

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

/** The screenshot: a link to the scene's page, where the editor is. */
function PosterLink({ poster, href }: { poster: Poster; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block" title="Open the scene in the editor">
      <Image src={poster.src} alt={poster.alt} width={poster.width} height={poster.height} className="w-full rounded-xl border" />
    </a>
  );
}

/**
 * Scenes from scenes.frameos.net, live in their editor: a row of small
 * buttons picks one, and the store's embed mode shows it in an iframe on wide
 * screens, loaded when it nears the viewport, in the site's light or dark. The
 * scene's screenshot (one per theme) stands in until the embed says its scene
 * is loaded, and stays on phones (an editor in a phone-sized frame would
 * swallow the page's scroll) and wherever the embed doesn't come up; a click
 * on it opens the scene's page.
 */
export function LiveSceneEmbed({
  scenes,
  moreHref,
  moreLabel,
  className,
}: {
  scenes: EmbedScene[];
  /** The link after the buttons: the scene store. */
  moreHref?: string;
  moreLabel?: string;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [index, setIndex] = useState(0);
  const [near, setNear] = useState(false);
  // The theme a scene's frame was loaded in (later switches are messages).
  const [loadTheme, setLoadTheme] = useState<'light' | 'dark'>('light');
  // Which frame URL said it is ready, or gave up: tied to the URL, so a
  // scene picked since starts out as neither, in the very render of the click.
  const [readySrc, setReadySrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  // The frame on screen once one has come up, and its scene's name: while
  // another pick loads, it stays there (no screenshot in between), and the new
  // frame fades in over it.
  const [shown, setShown] = useState<{ src: string; label: string } | null>(null);
  const dark = useSiteDark();
  const darkRef = useRef(dark);
  darkRef.current = dark;
  const scene = scenes[index] ?? scenes[0];
  const frameSrc = useMemo(() => {
    if (!near) return null;
    const url = new URL(scene.src);
    url.searchParams.set('theme', loadTheme);
    return url.toString();
  }, [near, scene.src, loadTheme]);
  const ready = frameSrc !== null && (readySrc === frameSrc || shown?.src === frameSrc);
  const failed = frameSrc !== null && failedSrc === frameSrc;
  const holding = shown !== null && shown.src !== frameSrc && !failed;
  function pick(i: number) {
    setLoadTheme(darkRef.current ? 'dark' : 'light');
    setIndex(i);
  }

  // Wide screens only, once the section is close.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof IntersectionObserver === 'undefined') return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLoadTheme(darkRef.current ? 'dark' : 'light');
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!frameSrc || ready) return;
    const origin = new URL(frameSrc).origin;
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin === origin &&
        event.source === frameRef.current?.contentWindow &&
        (event.data as { type?: unknown } | null)?.type === READY_MESSAGE
      ) {
        setReadySrc(frameSrc);
        // The frame it replaces goes once this one has faded in over it.
        window.setTimeout(() => setShown({ src: frameSrc, label: scene.label }), FADE_MS + 100);
      }
    };
    window.addEventListener('message', onMessage);
    const timer = window.setTimeout(() => setFailedSrc(frameSrc), READY_TIMEOUT_MS);
    return () => {
      window.removeEventListener('message', onMessage);
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameSrc, ready]);

  // The site switched between light and dark: so does the editor.
  useEffect(() => {
    if (!ready || !frameSrc) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: THEME_MESSAGE, theme: dark ? 'dark' : 'light' },
      new URL(frameSrc).origin,
    );
  }, [dark, ready, frameSrc]);

  const live = frameSrc !== null && !failed;
  const shownCaption = ready ? (scene.liveCaption ?? scene.caption) : scene.caption;
  return (
    <div className={className}>
      <div className="mb-4 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Scenes">
        {scenes.map((option, i) => (
          <button
            key={option.key}
            type="button"
            aria-pressed={i === index}
            onClick={() => pick(i)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
              i === index
                ? 'border-transparent bg-fd-primary text-fd-primary-foreground'
                : 'bg-fd-background text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground',
              // Loading behind the scene on screen.
              i === index && holding && !ready && 'animate-pulse',
            )}
          >
            {option.label}
          </button>
        ))}
        {moreHref ? (
          <a
            href={moreHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground"
          >
            {moreLabel ?? 'More scenes'}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </div>
      <div ref={boxRef} className="relative">
        <div className={cn((ready || holding) && 'invisible')} aria-hidden={ready || holding || undefined}>
          <div className={cn(scene.posterDark && 'dark:hidden')}>
            <PosterLink key={`${scene.key}-light`} poster={scene.poster} href={scene.href} />
          </div>
          {scene.posterDark ? (
            <div className="hidden dark:block">
              <PosterLink key={`${scene.key}-dark`} poster={scene.posterDark} href={scene.href} />
            </div>
          ) : null}
        </div>
        {holding && shown ? (
          <iframe
            key={shown.src}
            src={shown.src}
            title={`The ${shown.label} scene, live in the FrameOS scene editor`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation allow-downloads"
            allow="clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            className="pointer-events-none absolute inset-0 h-full w-full rounded-xl border bg-fd-background"
          />
        ) : null}
        {live ? (
          <iframe
            key={frameSrc}
            ref={frameRef}
            src={frameSrc}
            title={`The ${scene.label} scene, live in the FrameOS scene editor`}
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
