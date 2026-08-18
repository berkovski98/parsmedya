const WINDOW_MS = 60_000
const MAX_EVENTS = 40

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export function allowAnalyticsRequest(key: string, now = Date.now()) {
  const current = buckets.get(key)
  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (current.count >= MAX_EVENTS) return false
  current.count += 1
  return true
}

export function resetAnalyticsRateLimit() {
  buckets.clear()
}
