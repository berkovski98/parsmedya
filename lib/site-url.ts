export const PRODUCTION_SITE_URL = 'https://parsmedya.net'

function isLocalhostUrl(value: string) {
  try {
    const { hostname } = new URL(value)
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  } catch {
    return /localhost|127\.0\.0\.1/i.test(value)
  }
}

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')

  if (process.env.NODE_ENV === 'development') {
    return fromEnv || 'http://localhost:3000'
  }

  if (fromEnv && !isLocalhostUrl(fromEnv)) {
    return fromEnv
  }

  return PRODUCTION_SITE_URL
}

export function absoluteUrl(path = '/') {
  const siteUrl = getSiteUrl()
  if (/^https?:\/\//i.test(path)) return path
  if (!path || path === '/') return `${siteUrl}/`
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
