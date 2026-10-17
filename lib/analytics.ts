import 'server-only'
import { isMissingFunctionError } from '@/lib/site-events'
import { mapRpcResult } from '@/lib/analytics-query'
import type { AnalyticsDetails, AnalyticsQueryResult, AnalyticsSummary } from '@/lib/analytics-types'
import { createClient } from '@/lib/supabase/server'

function asNumber(value: unknown) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

function normalizeDetails(raw: Record<string, unknown>): AnalyticsDetails {
  const topPages = Array.isArray(raw.top_pages) ? raw.top_pages.map((item) => {
    const row = item as Record<string, unknown>
    return {
      path: String(row.path || ''),
      views: asNumber(row.views),
      visitors: asNumber(row.visitors),
    }
  }) : []
  const traffic = Array.isArray(raw.traffic_sources)
    ? raw.traffic_sources.map((item) => {
      const row = item as Record<string, unknown>
      return {
        source: String(row.source || row.referrer || 'Direct'),
        views: asNumber(row.views),
        visitors: asNumber(row.visitors),
      }
    })
    : Array.isArray(raw.top_referrers)
      ? raw.top_referrers.map((item) => {
        const row = item as Record<string, unknown>
        return { source: String(row.referrer || 'Direct'), views: asNumber(row.views), visitors: 0 }
      })
      : []
  const daily = Array.isArray(raw.daily) ? raw.daily.map((item) => {
    const row = item as Record<string, unknown>
    return {
      date: String(row.date || ''),
      views: asNumber(row.views),
      visitors: asNumber(row.visitors),
    }
  }) : []
  return {
    seven_day_views: asNumber(raw.seven_day_views),
    thirty_day_views: asNumber(raw.thirty_day_views),
    seven_day_visitors: asNumber(raw.seven_day_visitors),
    thirty_day_visitors: asNumber(raw.thirty_day_visitors),
    tr_views: asNumber(raw.tr_views),
    tr_visitors: asNumber(raw.tr_visitors),
    en_views: asNumber(raw.en_views),
    en_visitors: asNumber(raw.en_visitors),
    tracking_started_at: raw.tracking_started_at ? String(raw.tracking_started_at) : null,
    daily,
    top_pages: topPages,
    traffic_sources: traffic,
  }
}

function logAnalyticsError(scope: string, error: { code?: string; message?: string } | unknown) {
  const record = error && typeof error === 'object' ? error as { code?: string; message?: string } : {}
  console.error(JSON.stringify({
    event: 'analytics_query_failed',
    scope,
    code: record.code || 'EXCEPTION',
    message: record.message || (error instanceof Error ? error.message : 'unknown'),
  }))
}

export async function getAnalyticsSummary(): Promise<AnalyticsQueryResult<AnalyticsSummary>> {
  try {
    const { data, error } = await (await createClient()).rpc('get_analytics_summary')
    if (error) logAnalyticsError('summary', error)
    return mapRpcResult(data as AnalyticsSummary, error, 'İstatistik verileri alınamadı.')
  } catch (error) {
    logAnalyticsError('summary', error)
    return {
      ok: false,
      error: {
        code: 'EXCEPTION',
        message: error instanceof Error ? error.message : 'İstatistik verileri alınamadı.',
      },
    }
  }
}

export async function getAnalyticsDetails(): Promise<AnalyticsQueryResult<AnalyticsDetails>> {
  try {
    const { data, error } = await (await createClient()).rpc('get_analytics_details')
    if (error) logAnalyticsError('details', error)
    const mapped = mapRpcResult(data as Record<string, unknown>, error, 'İstatistik verileri alınamadı.')
    if (!mapped.ok) return mapped
    return { ok: true, data: normalizeDetails(mapped.data) }
  } catch (error) {
    logAnalyticsError('details', error)
    return {
      ok: false,
      error: {
        code: 'EXCEPTION',
        message: error instanceof Error ? error.message : 'İstatistik verileri alınamadı.',
      },
    }
  }
}

export type ConversionSummary = {
  events: Partial<Record<'session_start' | 'whatsapp_click' | 'phone_click' | 'email_click' | 'form_submit', number>>
  contact_messages: number
  sources: { source: string; sessions: number; conversions: number }[]
  targets: { event: string; target: string; total: number }[]
}

/** Conversion summary for the last 30 days; `missing` is true until migration 010 is applied. */
export async function getConversionSummary(): Promise<{ ok: true; data: ConversionSummary } | { ok: false; missing: boolean }> {
  try {
    const { data, error } = await (await createClient()).rpc('get_conversion_summary')
    if (error) {
      const missing = isMissingFunctionError(error)
      if (!missing) logAnalyticsError('conversions', error)
      return { ok: false, missing }
    }
    const value = (data || {}) as Partial<ConversionSummary>
    return { ok: true, data: { events: value.events || {}, contact_messages: Number(value.contact_messages || 0), sources: value.sources || [], targets: value.targets || [] } }
  } catch (error) {
    logAnalyticsError('conversions', error)
    return { ok: false, missing: false }
  }
}
