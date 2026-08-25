'use client';
import { useEffect, useState } from 'react';
import {
  clearConsentInDocument,
  consentChangeEvent,
  readConsentFromDocument,
  writeConsentToDocument,
  type ConsentChoice,
} from '@/lib/analytics-consent';
import { links } from '@/lib/shared';

const posthogKey = 'phc_Qp5EaVoMqQejQnkcAMSgEOj2An44uDDSJpRTecvcq2p';
const posthogHost = 'https://eu.posthog.com';

// Loads PostHog only after the visitor has accepted analytics, and switches it
// off again the moment consent is withdrawn from the footer. Rendered once in
// the root layout. The SDK is a dynamic import so declining really does mean
// the analytics code never reaches the browser.
export function Analytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    let cancelled = false;
    let loaded: typeof import('posthog-js').default | undefined;

    const apply = async () => {
      const granted = readConsentFromDocument() === 'granted';
      if (!granted) {
        loaded?.opt_out_capturing();
        return;
      }
      if (!loaded) {
        const { default: posthog } = await import('posthog-js');
        if (cancelled) return;
        posthog.init(posthogKey, {
          api_host: posthogHost,
          defaults: '2026-05-30',
          capture_pageview: 'history_change',
          opt_out_capturing_by_default: true,
          persistence: 'memory',
        });
        loaded = posthog;
        // Consent may have been withdrawn while the SDK was downloading.
        if (readConsentFromDocument() !== 'granted') return;
      }
      loaded.set_config({ persistence: 'localStorage+cookie' });
      loaded.opt_in_capturing();
    };

    void apply();
    const onChange = () => void apply();
    window.addEventListener(consentChangeEvent, onChange);
    return () => {
      cancelled = true;
      window.removeEventListener(consentChangeEvent, onChange);
    };
  }, []);
  return null;
}

// The banner. Deliberately not a modal and does not block the page: consent
// has to be freely given, and a wall that only clears on "Accept" is the
// textbook example of consent that is not. Analytics stays off until answered.
export function AnalyticsConsentBanner() {
  // Undefined until the effect runs: the static HTML has no idea what the
  // visitor chose, and rendering a guess would either flash the banner at
  // people who already answered or hide it from people who have not.
  const [choice, setChoice] = useState<ConsentChoice | undefined>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(readConsentFromDocument());
    setReady(true);
    const onChange = () => setChoice(readConsentFromDocument());
    window.addEventListener(consentChangeEvent, onChange);
    return () => window.removeEventListener(consentChangeEvent, onChange);
  }, []);

  if (!ready || choice) return null;

  const decide = (next: ConsentChoice) => {
    writeConsentToDocument(next);
    setChoice(next);
  };

  return (
    <aside
      aria-label="Cookie consent"
      data-ph-no-capture=""
      className="fixed bottom-4 left-4 z-50 flex w-[min(calc(100vw-2rem),420px)] flex-col gap-3 rounded-xl border bg-fd-background p-4 text-sm shadow-lg"
    >
      <div>
        <strong>Help us fix what breaks?</strong>{' '}
        <span className="text-fd-muted-foreground">
          We use PostHog in the EU to track the errors you run into, so we can fix them without
          waiting for a bug report, and which pages get used, to focus on what matters. That is
          the entire list - no ad networks, no profile sold on. Details in our{' '}
          <a href={links.privacy} className="underline underline-offset-4 hover:text-fd-foreground">
            Privacy Policy
          </a>
          .
        </span>
      </div>
      {/* Identical styling on purpose: a visually louder "Accept" is a nudge
          that undermines consent being freely given. */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={() => decide('denied')}
          className="flex-1 rounded-lg border px-3 py-2 font-medium transition-colors hover:bg-fd-accent"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => decide('granted')}
          className="flex-1 rounded-lg border px-3 py-2 font-medium transition-colors hover:bg-fd-accent"
        >
          Accept
        </button>
      </div>
    </aside>
  );
}

// Footer entry point for changing your mind. Clearing the stored choice stops
// capture at once and brings the banner back so a new choice can be made.
// A button, because withdrawing consent is an action, not a destination;
// styled as a link because that is where people look for it.
export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => clearConsentInDocument()} className={className}>
      Cookie settings
    </button>
  );
}
