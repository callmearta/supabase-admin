/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
          bodySizeLimit: '10mb',
        },
      },
};

module.exports = nextConfig;
