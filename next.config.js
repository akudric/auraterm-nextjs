// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ethical-champion-a6f0cd3e63.strapiapp.com' },
      // add your CDN/asset hosts here later if needed
    ],
  },
};
export default nextConfig;