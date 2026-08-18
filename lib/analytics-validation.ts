const excludedPrefixes = ['/admin', '/api', '/sitemaps', '/_next']
const excludedPaths = ['/sitemap.xml', '/sitemap-en.xml', '/sitemap-tr.xml', '/robots.txt', '/favicon.ico', '/icon.svg']
const assetPattern = /\.(?:css|js|map|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|xml|txt)$/i
const botPattern = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|discordbot|google-inspectiontool|lighthouse|pagespeed/i
const idPattern = /^[a-zA-Z0-9_-]{8,100}$/

export interface AnalyticsPayload {
  path: string
  visitorId: string
  sessionId: string
  locale: 'tr' | 'en'
  referrer?: string
}

export function normalizeAnalyticsPath(path: string) {
  const raw = path.trim()
  if (!raw.startsWith('/')) return ''
  const withoutQuery = raw.split('#')[0].split('?')[0]
  if (withoutQuery.length > 1 && withoutQuery.endsWith('/')) return withoutQuery.slice(0, -1)
  return withoutQuery
}

export function localeFromPath(path: string): 'tr' | 'en' {
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'tr'
}

export function isTrackablePath(path: string) {
  const normalized = normalizeAnalyticsPath(path)
  return Boolean(normalized) &&
    normalized.length <= 500 &&
    !excludedPrefixes.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)) &&
    !excludedPaths.includes(normalized) &&
    !assetPattern.test(normalized)
}

export function isBotUserAgent(userAgent: string) {
  return !userAgent || botPattern.test(userAgent)
}

export function sanitizeReferrer(referrer: string | undefined) {
  if (!referrer) return undefined
  const trimmed = referrer.trim().slice(0, 1000)
  if (!trimmed) return undefined
  try {
    const url = new URL(trimmed)
    return `${url.protocol}//${url.host}${url.pathname}`
  } catch {
    return trimmed.split('?')[0].split('#')[0]
  }
}

export function validateAnalyticsPayload(value: unknown): AnalyticsPayload | null {
  if (!value || typeof value !== 'object') return null
  const payload = value as Record<string, unknown>
  const event = payload.event
  if (event !== undefined && event !== 'page_view') return null
  const rawPath = typeof payload.pathname === 'string' ? payload.pathname : typeof payload.path === 'string' ? payload.path : ''
  const path = normalizeAnalyticsPath(rawPath)
  if (!isTrackablePath(path)) return null
  if (typeof payload.visitorId !== 'string' || !idPattern.test(payload.visitorId)) return null
  const sessionId = typeof payload.sessionId === 'string' && payload.sessionId
    ? payload.sessionId
    : payload.visitorId
  if (!idPattern.test(sessionId)) return null
  const locale = payload.locale === 'en' || payload.locale === 'tr' ? payload.locale : localeFromPath(path)
  const referrer = typeof payload.referrer === 'string' ? sanitizeReferrer(payload.referrer) : undefined
  return {
    path,
    visitorId: payload.visitorId,
    sessionId,
    locale,
    referrer,
  }
}
