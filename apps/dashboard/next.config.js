/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@botforge/database', '@botforge/config', '@botforge/shared-types'],
  images: {
    domains: ['cdn.discordapp.com'],
  },
};

module.exports = nextConfig;
