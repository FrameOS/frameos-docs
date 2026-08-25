import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { Analytics, AnalyticsConsentBanner } from '@/components/analytics';
import { appDescription, appName } from '@/lib/shared';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://frameos.net'),
  title: {
    default: `${appName} - The operating system for smart frames`,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  icons: { icon: '/img/logo.svg' },
  openGraph: {
    siteName: appName,
    images: '/img/social-card.jpg',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
        <AnalyticsConsentBanner />
        <Analytics />
      </body>
    </html>
  );
}
