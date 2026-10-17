'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  LAST_PATH_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  VISITOR_STORAGE_KEY,
  isAnalyticsDomEnabled,
  shouldSkipDuplicatePath,
} from '@/lib/analytics-client'
import { getOrCreateId, placementOf, trackSiteEvent } from '@/lib/analytics-events-client'
import { captureAttribution } from '@/lib/attribution-client'
import { contactEventForHref } from '@/lib/site-events'
import { isTrackablePath, localeFromPath, normalizeAnalyticsPath } from '@/lib/analytics-validation'

export function AnalyticsTracker() {
  const pathname = usePathname()

  // Source of the visit (UTM / referrer) once per session, plus contact-link clicks anywhere on the site.
  useEffect(() => {
    const { isNew } = captureAttribution()
    if (isNew) trackSiteEvent('session_start')
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href]')
      if (!link) return
      const kind = contactEventForHref(link.getAttribute('href') || '')
      if (kind) trackSiteEvent(kind, placementOf(link))
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

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
