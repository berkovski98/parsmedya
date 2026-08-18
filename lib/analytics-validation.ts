const excludedPrefixes = ['/admin', '/api', '/sitemaps']
const excludedPaths = ['/sitemap.xml', '/sitemap-en.xml', '/sitemap-tr.xml', '/robots.txt', '/favicon.ico', '/icon.svg']
const assetPattern = /\.(?:css|js|map|png|jpe?g|gif|webp|svg|ico|woff2?|ttf|xml|txt)$/i
const botPattern = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|discordbot|google-inspectiontool|lighthouse|pagespeed/i
const idPattern = /^[a-zA-Z0-9_-]{8,100}$/

export interface AnalyticsPayload {
  path: string
  visitorId: string
  sessionId: string
  referrer?: string
}

export function isTrackablePath(path: string) {
  return path.startsWith('/') &&
    path.length <= 500 &&
    !excludedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)) &&
    !excludedPaths.includes(path) &&
    !assetPattern.test(path)
}

export function isBotUserAgent(userAgent: string) {
  return !userAgent || botPattern.test(userAgent)
}

export function validateAnalyticsPayload(value: unknown): AnalyticsPayload | null {
  if (!value || typeof value !== 'object') return null
  const payload = value as Record<string, unknown>
  if (typeof payload.path !== 'string' || !isTrackablePath(payload.path)) return null
  if (typeof payload.visitorId !== 'string' || !idPattern.test(payload.visitorId)) return null
  if (typeof payload.sessionId !== 'string' || !idPattern.test(payload.sessionId)) return null
  if (payload.referrer !== undefined && (typeof payload.referrer !== 'string' || payload.referrer.length > 1000)) return null
  return {
    path: payload.path,
    visitorId: payload.visitorId,
    sessionId: payload.sessionId,
    referrer: payload.referrer,
  }
}
