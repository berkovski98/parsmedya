'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  LAST_PATH_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  VISITOR_STORAGE_KEY,
  createAnonymousId,
  isAnalyticsDomEnabled,
  shouldSkipDuplicatePath,
} from '@/lib/analytics-client'
import { isTrackablePath, localeFromPath, normalizeAnalyticsPath } from '@/lib/analytics-validation'

function getOrCreateId(storage: Storage, key: string) {
  try {
    const created = createAnonymousId(storage.getItem(key))
    storage.setItem(key, created)
    return created
  } catch {
    return createAnonymousId()
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    try {
      const path = normalizeAnalyticsPath(pathname)
      if (!isAnalyticsDomEnabled(document.documentElement.dataset.analytics) || !isTrackablePath(path)) return
      if (shouldSkipDuplicatePath(window.sessionStorage.getItem(LAST_PATH_STORAGE_KEY), path)) return
      window.sessionStorage.setItem(LAST_PATH_STORAGE_KEY, path)
      const visitorId = getOrCreateId(window.localStorage, VISITOR_STORAGE_KEY)
      const sessionId = getOrCreateId(window.sessionStorage, SESSION_STORAGE_KEY)
      const referrer = document.referrer ? document.referrer.split('?')[0].slice(0, 1000) : ''
      void fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          event: 'page_view',
          pathname: path,
          visitorId,
          sessionId,
          locale: localeFromPath(path),
          referrer,
        }),
        keepalive: true,
      }).then((response) => {
        if (!response.ok && response.status >= 500) window.sessionStorage.removeItem(LAST_PATH_STORAGE_KEY)
      }).catch(() => {
        window.sessionStorage.removeItem(LAST_PATH_STORAGE_KEY)
      })
    } catch {
      // Tracking must never crash the public site.
    }
  }, [pathname])

  return null
}
