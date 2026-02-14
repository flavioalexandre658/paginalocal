import type { NextConfig } from 'next'
import path from 'path'
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const emptyModule = path.resolve(__dirname, 'src/empty-module.js')

      config.resolve.alias = {
        ...config.resolve.alias,
        // Remove polyfills injetados pelo Next.js
        'next/dist/client/components/app-router-polyfills': emptyModule,
      }
    }
    return config
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
