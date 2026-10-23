import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  trailingSlash: true,
  // `next dev` blocks its scripts, HMR socket and fonts for any origin but localhost, so the site
  // opened from another device on the LAN never hydrates. Dev-only; the static export ignores it.
  allowedDevOrigins: ['10.*.*.*', '192.168.*.*', '*.local'],
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
