export interface AnalyticsPageTotal {
  path: string
  views: number
  visitors: number
}

export interface AnalyticsSummary {
  today_views: number
  seven_day_views: number
  thirty_day_views: number
  total_views: number
  today_visitors: number
  thirty_day_visitors: number
  total_visitors: number
  top_pages: AnalyticsPageTotal[]
}

export interface AnalyticsDay {
  date: string
  views: number
  visitors: number
}

export interface AnalyticsTrafficSource {
  source: string
  views: number
  visitors: number
}

export interface AnalyticsLocaleStats {
  views: number
  visitors: number
}

export interface AnalyticsDetails {
  seven_day_views: number
  thirty_day_views: number
  seven_day_visitors: number
  thirty_day_visitors: number
  tr_views: number
  tr_visitors: number
  en_views: number
  en_visitors: number
  tracking_started_at: string | null
  daily: AnalyticsDay[]
  top_pages: AnalyticsPageTotal[]
  traffic_sources: AnalyticsTrafficSource[]
}

export interface AnalyticsQueryError {
  code: string
  message: string
}

export type AnalyticsQueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AnalyticsQueryError }
