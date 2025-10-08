import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Next.js 워크스페이스 루트 명시적 설정
  outputFileTracingRoot: path.join(__dirname),

  images: {
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
};

export default nextConfig;
