'use client'

import {
  SESSION_STORAGE_KEY,
  VISITOR_STORAGE_KEY,
  createAnonymousId,
  isAnalyticsDomEnabled,
} from '@/lib/analytics-client'
import { readAttribution } from '@/lib/attribution-client'
import { isTrackablePath, localeFromPath, normalizeAnalyticsPath } from '@/lib/analytics-validation'
import type { SiteEventType } from '@/lib/site-events'

export function getOrCreateId(storage: Storage, key: string) {
  try {
    const created = createAnonymousId(storage.getItem(key))
    storage.setItem(key, created)
    return created
  } catch {
    return createAnonymousId()
  }
}

/** Sends a conversion event. Never throws; tracking must not affect the page. */
export function trackSiteEvent(event: SiteEventType, target?: string) {
  try {
    if (!isAnalyticsDomEnabled(document.documentElement.dataset.analytics)) return
    const path = normalizeAnalyticsPath(window.location.pathname)
    if (!isTrackablePath(path)) return
    const body = JSON.stringify({
      event,
      target,
      pathname: path,
      locale: localeFromPath(path),
      visitorId: getOrCreateId(window.localStorage, VISITOR_STORAGE_KEY),
      sessionId: getOrCreateId(window.sessionStorage, SESSION_STORAGE_KEY),
      ...readAttribution(),
    })
    void fetch('/api/analytics/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true }).catch(() => {})
  } catch {
    // Tracking must never crash the public site.
  }
}

/** Short label for where on the page a link sits, e.g. "header", "footer", "floating". */
export function placementOf(element: Element) {
  const explicit = element.closest<HTMLElement>('[data-track]')?.dataset.track
  if (explicit) return explicit
  if (element.closest('#mobile-menu')) return 'mobile_menu'
  if (element.closest('header')) return 'header'
  if (element.closest('footer')) return 'footer'
  return 'content'
}
