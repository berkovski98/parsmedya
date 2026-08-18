export function isAnalyticsEnabled() {
  const runtime = process.env.ANALYTICS_ENABLED
  if (runtime === 'true') return true
  if (runtime === 'false') return false
  return process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true'
}

export function analyticsDisabledReason() {
  if (isAnalyticsEnabled()) return null
  if (process.env.ANALYTICS_ENABLED === 'false') return 'ANALYTICS_ENABLED=false'
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'false') return 'NEXT_PUBLIC_ANALYTICS_ENABLED=false'
  if (!process.env.ANALYTICS_ENABLED && !process.env.NEXT_PUBLIC_ANALYTICS_ENABLED) {
    return 'ANALYTICS_ENABLED and NEXT_PUBLIC_ANALYTICS_ENABLED are unset'
  }
  return 'analytics env is not true'
}

export function reportAnalyticsEnvPresence() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'PRESENT' : 'MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'PRESENT' : 'MISSING',
    NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED ? 'PRESENT' : 'MISSING',
    ANALYTICS_ENABLED: process.env.ANALYTICS_ENABLED ? 'PRESENT' : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'PRESENT' : 'MISSING',
  }
}
