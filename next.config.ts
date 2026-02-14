import type { NextConfig } from 'next'
import path from 'path'
import withBundleAnalyzer from '@next/bundle-analyzer'
import { webpack } from 'next/dist/compiled/webpack/webpack'
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const emptyModule = path.resolve(__dirname, 'src/empty-module.js')

      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /\/polyfills?\/(polyfill-module|process)\.js$/,
          emptyModule
        )
      )
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
    minimumCacheTTL: 31536000, // 1 ano de cache
    qualities: [60, 75], // Next.js 15+
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

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
