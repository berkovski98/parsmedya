const PRODUCTION_SITE_URL = 'https://parsmedya.net'

function resolvePublicSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || ''
  const isLocalhost = !value || /localhost|127\.0\.0\.1/i.test(value)
  if (process.env.NODE_ENV === 'development') {
    return value || 'http://localhost:3000'
  }
  return isLocalhost ? PRODUCTION_SITE_URL : value
}

process.env.NEXT_PUBLIC_SITE_URL = resolvePublicSiteUrl()

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 82],
  },
}

export default nextConfig
