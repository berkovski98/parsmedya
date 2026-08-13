import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { AnalyticsDetails, AnalyticsSummary } from '@/lib/analytics-types'

export const emptyAnalyticsSummary: AnalyticsSummary = {
  today_views: 0,
  seven_day_views: 0,
  thirty_day_views: 0,
  total_views: 0,
  today_visitors: 0,
  thirty_day_visitors: 0,
  total_visitors: 0,
  top_pages: [],
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const { data, error } = await (await createClient()).rpc('get_analytics_summary')
  return error || !data ? emptyAnalyticsSummary : data as AnalyticsSummary
}

export async function getAnalyticsDetails(): Promise<AnalyticsDetails> {
  const { data, error } = await (await createClient()).rpc('get_analytics_details')
  return error || !data ? {
    seven_day_views: 0,
    thirty_day_views: 0,
    seven_day_visitors: 0,
    thirty_day_visitors: 0,
    daily: [],
    top_pages: [],
    top_referrers: [],
  } : data as AnalyticsDetails
}
