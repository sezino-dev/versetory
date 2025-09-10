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
        hostname: 'lh3.googleusercontent.com', // Google 프로필 이미지
      },
    ],
  },
  devIndicators: {
    buildActivity: false, // 개발 모드 하단 N 버튼 제거
  },
}

module.exports = nextConfig
