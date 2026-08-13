export interface AnalyticsPageTotal {
  path: string
  views: number
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

export interface AnalyticsReferrer {
  referrer: string
  views: number
}

export interface AnalyticsDetails {
  seven_day_views: number
  thirty_day_views: number
  seven_day_visitors: number
  thirty_day_visitors: number
  daily: AnalyticsDay[]
  top_pages: AnalyticsPageTotal[]
  top_referrers: AnalyticsReferrer[]
}
