import { CookieSettingsButton } from '@/components/analytics';
import { links } from '@/lib/shared';

const linkClass = 'text-fd-muted-foreground transition-colors hover:text-fd-foreground hover:underline';

// The same legal footer as cloud.frameos.net, under the homepage and blog.
// The terms, privacy policy and imprint live on the cloud origin, hence the
// absolute URLs.
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <nav
        aria-label="Legal"
        className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-5 px-6 py-6 text-[13px]"
      >
        <a href={links.terms} className={linkClass}>
          Terms
        </a>
        <a href={links.privacy} className={linkClass}>
          Privacy
        </a>
        <a href={links.imprint} className={linkClass}>
          Imprint
        </a>
        <CookieSettingsButton className={linkClass} />
      </nav>
    </footer>
  );
}
