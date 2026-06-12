import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { appName, links } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src="/img/logo.png" alt="" width={24} height={24} className="rounded" />
          {appName}
        </>
      ),
    },
    links: [
      { text: 'Docs', url: '/guide', active: 'nested-url' },
      { text: 'Devices', url: '/devices', active: 'nested-url' },
      { text: 'Cases', url: '/cases', active: 'nested-url' },
      { text: 'Blog', url: '/blog', active: 'nested-url' },
    ],
    githubUrl: links.github,
  };
}
