// Consent state for the one thing on this site that needs consent: PostHog
// analytics in the browser. A port of cloud/apps/auth-web/src/lib/analytics-consent.ts
// from the main FrameOS repo - same cookie name, same values, same domain - so a
// choice made on cloud.frameos.net carries over to frameos.net and back, and
// nobody is asked twice for the same thing.
//
// Analytics storage needs opt-in consent, and that consent must be as easy to
// withdraw as to give: nothing loads before an answer, "Decline" is a button of
// equal weight next to "Accept", and the choice can be changed later from the
// footer of every page.

export type ConsentChoice = 'denied' | 'granted';

export const consentCookieName = 'frameos_analytics_consent';

// One year. Long enough not to nag, short enough that consent is refreshed
// rather than inherited forever.
export const consentMaxAgeSeconds = 365 * 24 * 60 * 60;

// The banner, the footer button and the analytics loader are separate client
// components with no common ancestor that re-renders on this. A window event
// is the smallest thing that keeps them in step.
export const consentChangeEvent = 'frameos:analytics-consent';

// The cookie is shared with the cloud apps, which set it on `.frameos.net`.
// Anywhere else (localhost, a preview deploy) it stays host-only.
const sharedCookieDomain = 'frameos.net';

function cookieDomain(): string | undefined {
  const host = window.location.hostname.toLowerCase();
  return host === sharedCookieDomain || host.endsWith(`.${sharedCookieDomain}`)
    ? sharedCookieDomain
    : undefined;
}

export function parseConsent(value: string | undefined): ConsentChoice | undefined {
  return value === 'granted' || value === 'denied' ? value : undefined;
}

export function readConsentFromDocument(): ConsentChoice | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${consentCookieName}=`));
  return parseConsent(match?.slice(consentCookieName.length + 1));
}

function writeCookie(value: string, maxAge: number) {
  const parts = [`${consentCookieName}=${value}`, 'path=/', `max-age=${maxAge}`, 'samesite=lax'];
  const domain = cookieDomain();
  if (domain) parts.push(`domain=.${domain}`);
  if (window.location.protocol === 'https:') parts.push('secure');
  document.cookie = parts.join('; ');
  window.dispatchEvent(new CustomEvent(consentChangeEvent));
}

export function writeConsentToDocument(choice: ConsentChoice) {
  if (typeof document === 'undefined') return;
  writeCookie(choice, consentMaxAgeSeconds);
}

// Withdrawal: drop the cookie entirely rather than storing "denied". That
// stops capture immediately AND brings the banner back, so withdrawing and
// re-deciding is the same one click as the original choice.
export function clearConsentInDocument() {
  if (typeof document === 'undefined') return;
  writeCookie('', 0);
}
