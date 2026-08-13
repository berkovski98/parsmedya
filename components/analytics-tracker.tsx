'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { isTrackablePath } from '@/lib/analytics-validation'

const visitorKey = 'parsmedya_visitor_id'
const sessionKey = 'parsmedya_session_id'
const lastPathKey = 'parsmedya_last_tracked_path'

function getOrCreateId(storage: Storage, key: string) {
  const existing = storage.getItem(key)
  if (existing) return existing
  const value = crypto.randomUUID()
  storage.setItem(key, value)
  return value
}

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true' || !isTrackablePath(pathname)) return
    if (window.sessionStorage.getItem(lastPathKey) === pathname) return
    window.sessionStorage.setItem(lastPathKey, pathname)
    const visitorId = getOrCreateId(window.localStorage, visitorKey)
    const sessionId = getOrCreateId(window.sessionStorage, sessionKey)
    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: pathname, visitorId, sessionId, referrer: document.referrer.slice(0, 1000) }),
      keepalive: true,
    }).catch(() => window.sessionStorage.removeItem(lastPathKey))
  }, [pathname])

  return null
}
