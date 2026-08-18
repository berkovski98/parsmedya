import type { AnalyticsQueryError, AnalyticsQueryResult } from '@/lib/analytics-types'

export type AnalyticsEventRow = {
  path: string
  visitorId: string
  createdAt: string
  locale?: 'tr' | 'en'
  referrer?: string | null
}

const DAY_MS = 24 * 60 * 60 * 1000

export function istanbulDayKey(value: Date | string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}

export function inLastDays(createdAt: string, days: number, now = new Date()) {
  return new Date(createdAt).getTime() >= now.getTime() - days * DAY_MS
}

export function uniqueCount(ids: string[]) {
  return new Set(ids).size
}

export function summarizePageViews(rows: AnalyticsEventRow[], now = new Date()) {
  const last7 = rows.filter((row) => inLastDays(row.createdAt, 7, now))
  const last30 = rows.filter((row) => inLastDays(row.createdAt, 30, now))
  const tr = last30.filter((row) => (row.locale || 'tr') === 'tr')
  const en = last30.filter((row) => row.locale === 'en')
  return {
    seven_day_views: last7.length,
    seven_day_visitors: uniqueCount(last7.map((row) => row.visitorId)),
    thirty_day_views: last30.length,
    thirty_day_visitors: uniqueCount(last30.map((row) => row.visitorId)),
    tr_views: tr.length,
    tr_visitors: uniqueCount(tr.map((row) => row.visitorId)),
    en_views: en.length,
    en_visitors: uniqueCount(en.map((row) => row.visitorId)),
  }
}

export function mapRpcResult<T>(
  data: T | null | undefined,
  error: { code?: string; message?: string } | null | undefined,
  fallback: string,
): AnalyticsQueryResult<T> {
  if (error || !data || typeof data !== 'object') {
    return {
      ok: false,
      error: {
        code: error?.code || (!data ? 'EMPTY_ANALYTICS' : 'ANALYTICS_QUERY_FAILED'),
        message: error?.message || fallback,
      },
    }
  }
  return { ok: true, data }
}

export function publicAnalyticsError(error: AnalyticsQueryError) {
  const missing = error.code === 'PGRST202' || /does not exist|schema cache/i.test(error.message)
  return {
    title: 'İstatistik verileri alınamadı.',
    message: missing
      ? 'Analytics tablosu veya sorgusu Supabase’de henüz yok. 002 ve 008 migration dosyalarını SQL editor’de çalıştırın.'
      : 'İstatistik sorgusu tamamlanamadı. Lütfen daha sonra yeniden deneyin.',
    code: error.code,
  }
}

export function classifyTrafficSource(referrer?: string | null) {
  if (!referrer) return 'Direct'
  const value = referrer.toLowerCase()
  if (value.includes('google.')) return 'Google'
  if (value.includes('bing.')) return 'Bing'
  return 'Diğer yönlendirmeler'
}
