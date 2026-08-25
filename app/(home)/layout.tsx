import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { SiteFooter } from '@/components/site-footer';

// The legal footer lives here, not in the root layout: it only makes sense
// under the homepage and blog. The docs layout (guide, devices, cases) has a
// sidebar, where a footer under the whole grid looked odd and added little.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <HomeLayout {...baseOptions()}>
      {children}
      <SiteFooter />
    </HomeLayout>
  );
}
