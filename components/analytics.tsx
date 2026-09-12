'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import type posthogJs from 'posthog-js';

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

// Init once per page load, not once per navigation. The effect below runs on
// every route change, so the promise is what keeps them all on one instance.
let pending: Promise<typeof posthogJs> | undefined;

function load() {
  pending ??= import('posthog-js').then(({ default: posthog }) => {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      defaults: '2026-05-30',
      cookieless_mode: 'always',
      // identify() becomes a no-op. Nothing on a docs site should be
      // calling it, and this makes that structural rather than a rule.
      person_profiles: 'never',
      // We send pageviews ourselves - see below. Pageleave has to be asked
      // for explicitly once pageview capture is off, because its default
      // ('if_capture_pageview') would otherwise switch it off with it, and
      // pageleave is what bounce rate is computed from.
      capture_pageview: false,
      capture_pageleave: true,
    });
    return posthog;
  });
  return pending;
}

// Pageviews are captured by hand because PostHog's automatic capture does not
// fire in cookieless mode: on a real page load the SDK initialises, reports
// itself as capturing, sends the $pageleave on the way out - and never sends
// the $pageview in between. Verified against 1.419.0 on the deployed site,
// with the manual capture below landing from the same page that the automatic
// one had silently skipped. `usePathname` covers client-side navigation
// between docs pages too, which is most of the movement on this site.
export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    let cancelled = false;
    void load().then((posthog) => {
      if (!cancelled) posthog.capture('$pageview');
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
