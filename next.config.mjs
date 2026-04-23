import createMDX from '@next/mdx';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
      process.env.NEXT_PUBLIC_COUNTER_URL || 'https://visitor-counter.lohithchowdary80.workers.dev',
    NEXT_PUBLIC_CAL_USERNAME: process.env.NEXT_PUBLIC_CAL_USERNAME || 'indulohithnarisetty',
  },
  webpack: (config, { dev, isServer, webpack }) => {
    // Modern browsers only (see `browserslist` in package.json). Next's built-in
    // `polyfill-module` ships polyfills for Array.prototype.at / flat / flatMap,
    // Object.fromEntries, and Promise.prototype.finally, which Lighthouse flags
    // as `legacy-javascript`. Replace it with an empty module in client bundles
    // to shrink chunk 117 (~6-11 KiB saved).
    if (!dev && !isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /[\\/]next[\\/]dist[\\/]build[\\/]polyfills[\\/]polyfill-module/,
          path.resolve(__dirname, 'tools/empty-polyfill-module.js'),
        ),
      );
    }
    return config;
  },
};

export default withMDX(nextConfig);
