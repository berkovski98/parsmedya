export const PRODUCTION_SITE_URL = 'https://parsmedya.net'
export const PRODUCTION_SITE_HOST = 'parsmedya.net'

function isLocalhostUrl(value: string) {
  try {
    const { hostname } = new URL(value)
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  } catch {
    return /localhost|127\.0\.0\.1/i.test(value)
  }
}

export function resolveSiteUrl(nodeEnv = process.env.NODE_ENV, siteUrl = process.env.NEXT_PUBLIC_SITE_URL) {
  const fromEnv = siteUrl?.trim().replace(/\/$/, '')

  // Local development may use localhost. Production canonical is never taken from env,
  // including cPanel NEXT_PUBLIC_* leftovers, because those values are also inlined at build.
  if (nodeEnv === 'development') {
    return fromEnv || 'http://localhost:3000'
  }

  return PRODUCTION_SITE_URL
}

export function getSiteUrl() {
  return resolveSiteUrl()
}

export function joinSiteUrl(base: string, path = '/') {
  const origin = base.replace(/\/$/, '')
  if (/^https?:\/\//i.test(path)) return path
  if (!path || path === '/') return origin
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export function absoluteUrl(path = '/') {
  return joinSiteUrl(getSiteUrl(), path)
}

export function canonicalAbsoluteUrl(path = '/') {
  return joinSiteUrl(PRODUCTION_SITE_URL, path)
}

export function isLocalhostHost(value: string) {
  return isLocalhostUrl(value) || /localhost|127\.0\.0\.1/i.test(value)
}
