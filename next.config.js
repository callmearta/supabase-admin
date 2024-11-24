/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "sup.mockuply.pro"
      }
    ]
  }
};

module.exports = nextConfig;
