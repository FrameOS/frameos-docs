import Link from 'next/link';
import { cn } from '@/lib/cn';

// The one style for links inside running text - hero, chooser boxes, sections.
// External links open in a new tab.
export function TextLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const external = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'text-fd-foreground underline decoration-fd-muted-foreground/50 underline-offset-4 hover:decoration-fd-primary',
        className,
      )}
    >
      {children}
    </Link>
  );
}
