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
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // oogle 프로필 이미지
      },
    ],
  },
}

module.exports = nextConfig
