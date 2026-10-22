/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com', 'raw.githubusercontent.com', 'cdn.jsdelivr.net'],
  },
};

module.exports = nextConfig;
