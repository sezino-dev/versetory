// /next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            // Genius / Imgur / Google
            { protocol: 'https', hostname: 'images.genius.com' },
            { protocol: 'https', hostname: 'images.rapgenius.com' },
            { protocol: 'https', hostname: 'assets.genius.com' },
            { protocol: 'https', hostname: 'cdn.genius.com' },
            { protocol: 'https', hostname: 'i.imgur.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },

            // Facebook 이미지 CDN 및 프로필 프록시
            { protocol: 'https', hostname: '**.fbcdn.net' },
            { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' },
            { protocol: 'https', hostname: 'lookaside.facebook.com' },
            { protocol: 'https', hostname: 'graph.facebook.com' },

            // Naver
            { protocol: 'https', hostname: 'phinf.pstatic.net' }
        ],
    },

    // 상위 경로의 lockfile 때문에 루트를 오인할 때 경고 제거
    outputFileTracingRoot: path.resolve(__dirname),
};

module.exports = nextConfig;
