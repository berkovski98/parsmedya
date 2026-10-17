import { PORTFOLIO_REDIRECTS, TR_PREFIX_REDIRECTS } from './lib/locale-redirects.mjs'

const PRODUCTION_SITE_URL = 'https://parsmedya.net'

function resolvePublicSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || ''
  if (process.env.NODE_ENV === 'development') {
    return value || 'http://localhost:3000'
  }
  // NEXT_PUBLIC_* is inlined at build time. Never trust cPanel leftovers in production builds.
  return PRODUCTION_SITE_URL
}

process.env.NEXT_PUBLIC_SITE_URL = resolvePublicSiteUrl()

const PRODUCTION_SUPABASE_HOST = 'ndjmelccfsgqckjiovtl.supabase.co'

function supabaseStorageHosts() {
  const hosts = new Set([PRODUCTION_SUPABASE_HOST])
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (raw) {
    try {
      const hostname = new URL(raw).hostname
      if (hostname) hosts.add(hostname)
    } catch {
      // Keep the known production host when the env URL is malformed.
    }
  }
  return [...hosts]
}

// Applied to every response. HSTS only matters over HTTPS (production); browsers ignore it on http://localhost.
const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  output: 'standalone',
  // proxy.ts strips trailing slashes (and the legacy /tr prefix) in one redirect.
  skipTrailingSlashRedirect: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 82],
    remotePatterns: supabaseStorageHosts().map((hostname) => ({
      protocol: 'https',
      hostname,
      pathname: '/storage/v1/object/**',
    })),
  },
  async redirects() {
    return [...TR_PREFIX_REDIRECTS, ...PORTFOLIO_REDIRECTS]
  },
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default nextConfig
