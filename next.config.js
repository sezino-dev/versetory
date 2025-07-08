/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.genius.com',
      },
      {
        protocol: 'https',
        hostname: 'images.rapgenius.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.genius.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.genius.com',
      },
    ],
  },
}

module.exports = nextConfig