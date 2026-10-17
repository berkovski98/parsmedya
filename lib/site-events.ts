/** Conversion events recorded alongside page views (see supabase/migrations/010_conversion_tracking.sql). */
export const SITE_EVENT_TYPES = ['session_start', 'whatsapp_click', 'phone_click', 'email_click', 'form_submit'] as const
export type SiteEventType = (typeof SITE_EVENT_TYPES)[number]

export type Attribution = {
  landingPath?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

const tokenPattern = /[^\p{L}\p{N} ._\-/+:]/gu
const targetPattern = /^[a-z0-9_:-]{1,60}$/

/** Keeps UTM values short and free of markup; empty results become undefined. */
export function cleanToken(value: unknown, max = 100) {
  if (typeof value !== 'string') return undefined
  const cleaned = value.normalize('NFKC').replace(tokenPattern, '').trim().slice(0, max)
  return cleaned || undefined
}

export function cleanTarget(value: unknown) {
  return typeof value === 'string' && targetPattern.test(value) ? value : undefined
}

/** Origin + path of an external referrer, without query or fragment. */
export function cleanReferrer(value: unknown, ownHost?: string) {
  if (typeof value !== 'string' || !value) return undefined
  try {
    const url = new URL(value)
    if (!/^https?:$/.test(url.protocol)) return undefined
    if (ownHost && url.host.replace(/^www\./, '') === ownHost.replace(/^www\./, '')) return undefined
    return `${url.protocol}//${url.host}${url.pathname}`.slice(0, 300)
  } catch {
    return undefined
  }
}

export function cleanPath(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/')) return undefined
  const path = value.split('#')[0].split('?')[0].slice(0, 500)
  return path || undefined
}

/** Reads utm_* parameters from a query string. */
export function utmFromSearch(search: string): Pick<Attribution, 'utmSource' | 'utmMedium' | 'utmCampaign'> {
  const params = new URLSearchParams(search)
  return {
    utmSource: cleanToken(params.get('utm_source')),
    utmMedium: cleanToken(params.get('utm_medium')),
    utmCampaign: cleanToken(params.get('utm_campaign')),
  }
}

export function cleanAttribution(value: unknown): Attribution {
  if (!value || typeof value !== 'object') return {}
  const data = value as Record<string, unknown>
  return {
    landingPath: cleanPath(data.landingPath),
    referrer: cleanReferrer(data.referrer),
    utmSource: cleanToken(data.utmSource),
    utmMedium: cleanToken(data.utmMedium),
    utmCampaign: cleanToken(data.utmCampaign),
  }
}

/** Classifies a clicked link; returns null for links that are not contact actions. */
export function contactEventForHref(href: string): Exclude<SiteEventType, 'session_start' | 'form_submit'> | null {
  if (href.startsWith('tel:')) return 'phone_click'
  if (href.startsWith('mailto:')) return 'email_click'
  if (/^https:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//.test(href)) return 'whatsapp_click'
  return null
}

/** True when a Supabase/PostgREST error means the migration that adds a function was not applied yet. */
export function isMissingFunctionError(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false
  return error.code === 'PGRST202' || error.code === '42883' || /could not find the function|does not exist/i.test(error.message || '')
}
