import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://indulohithnarisetty.com',
    NEXT_PUBLIC_COUNTER_URL:
      process.env.NEXT_PUBLIC_COUNTER_URL || 'https://visitor-counter.indulohithnarisetty.workers.dev',
    NEXT_PUBLIC_CAL_USERNAME: process.env.NEXT_PUBLIC_CAL_USERNAME || 'indulohithnarisetty',
  },
};

export default withMDX(nextConfig);
