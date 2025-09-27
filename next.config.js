/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Disable ESLint during production builds
  eslint: {
    // Only run ESLint in development
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
