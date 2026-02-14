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
          /\/polyfills?\/(polyfill-module)\.js$/,
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

    forceSwcTransforms: true,
    optimizeCss: true,
    inlineCss: true,
    cssChunking: 'strict',
    // 🔹 Turbo melhora a velocidade do build e cache incremental
    turbo: {
      rules: {
        // evita polyfills desnecessários no build turbo
        '*.js': {
          loaders: ['swc-loader'],
        },
      },
    },
    esmExternals: true, // força dependências modernas

    // 🔹 Otimiza importações de bibliotecas grandes automaticamente
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "lodash",
      'date-fns', '@heroicons/react',
      "@tabler/icons-react",
    ],

  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    qualities: [40, 50, 60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.paginalocal.com.br',
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
  async rewrites() {
    return [
      {
        source: '/img/:path*',
        destination: 'https://stagingfy-images.s3.amazonaws.com/:path*',
      },
    ]
  },
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
