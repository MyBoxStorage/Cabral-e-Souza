import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { resolve } from 'node:path'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  outputFileTracingRoot: resolve(__dirname, '../..'),
  experimental: {
    // typedRoutes: true, — habilitar na Etapa 12 quando todas as rotas existirem
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  logging: {
    fetches: { fullUrl: true },
  },
}

export default withNextIntl(nextConfig)
