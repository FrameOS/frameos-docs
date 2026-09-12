'use client';
import { useEffect } from 'react';

const posthogKey = 'phc_Qp5EaVoMqQejQnkcAMSgEOj2An44uDDSJpRTecvcq2p';
const posthogHost = 'https://eu.posthog.com';

// PostHog in cookieless mode, which is why this site has no cookie banner.
//
// The banner used to be here because analytics storage needs opt-in consent
// under art. 5(3) of the ePrivacy Directive. But that article is about
// *storing or reading anything on the visitor's device* - and in cookieless
// mode PostHog stores nothing at all: no cookie, no localStorage, no
// sessionStorage. Nothing is stored, so nothing needs consent, so there is
// nothing to ask about. Asking anyway cost us roughly 60% of the numbers for
// a question that did not have to be asked.
//
// Visitors are counted by a hash PostHog computes on its own servers -
// hash(project, daily salt, IP, user agent, hostname) - where the salt is
// thrown away at the end of each day. The hash is one-way and the salt is
// gone, so it cannot be turned back into an IP address or followed from one
// day to the next. That makes the count anonymous rather than pseudonymous,
// which is also why `person_profiles: 'never'` is set below: a persistent
// person profile would put the personal data straight back in.
//
// What we give up for that, deliberately:
//   - Unique visitors only hold within a day. Someone reading the docs all
//     week counts as seven people, so weekly and monthly uniques run high.
//   - No GeoIP and no bot detection: PostHog strips the IP address before
//     those run, so the world map stays empty and crawlers are in the numbers.
//   - Session replay and surveys are unavailable. We do not use either here.
//
// Requires "Enable cookieless tracking" in the PostHog project settings
// (Project settings -> Web analytics). Without it the events are dropped on
// ingestion and this file silently does nothing.
export function Analytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    let cancelled = false;

    void (async () => {
      const { default: posthog } = await import('posthog-js');
      if (cancelled) return;
      posthog.init(posthogKey, {
        api_host: posthogHost,
        defaults: '2026-05-30',
        capture_pageview: 'history_change',
        cookieless_mode: 'always',
        // identify() becomes a no-op. Nothing on a docs site should be
        // calling it, and this makes that structural rather than a rule.
        person_profiles: 'never',
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);
  return null;
}
