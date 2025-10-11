import type { NextConfig } from "next";
import path from "path";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",

  // ✅ Delta 1: customWorkerSrc (올바른 옵션명)
  customWorkerSrc: "worker",

  // ✅ Delta 2: 오프라인 폴백 (App Router 표준)
  fallbacks: {
    document: "/~offline",
    image: "/images/offline-image.svg",
  },

  workboxOptions: {
    skipWaiting: false, // ✅ 사용자 승인 시에만 활성화
    clientsClaim: false,
    disableDevLogs: true,
    // ✅ runtimeCaching 제거: customWorkerSrc 사용 시 worker/index.ts에서 모든 캐싱 규칙 관리
    // - 코드 중복 제거
    // - _async_to_generator 에러 해결
    // - sw.js 크기 72% 감소 (36KB → 10KB)
  },
});

const nextConfig: NextConfig = {
  // Next.js 워크스페이스 루트 명시적 설정
  outputFileTracingRoot: path.join(__dirname),

  // TypeScript 설정 (MVP 출시용 임시 설정)
  typescript: {
    ignoreBuildErrors: true, // Sprint 2에서 모든 any 타입 수정 예정
  },

  // ESLint 설정 (MVP 출시용 임시 설정)
  eslint: {
    ignoreDuringBuilds: true, // Sprint 2에서 모든 any 타입 수정 후 활성화
  },

  // 성능 최적화
  compress: true, // Gzip 압축
  poweredByHeader: false, // X-Powered-By 헤더 제거
  reactStrictMode: true, // React Strict Mode

  // 실험적 기능
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'chart.js', 'react-chartjs-2'], // 패키지 임포트 최적화
  },

  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'], // 현대적인 이미지 포맷
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 1분 캐시
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  // 번들 분석 (빌드 시 ANALYZE=true로 실행)
  webpack: (config, { isServer }) => {
    // Tree shaking 최적화
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
    };

    // 번들 분석 (옵션)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    return config;
  },

  // 헤더 최적화
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // 🔧 Fix: Firebase 팝업 로그인을 위해 COOP 완화
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
