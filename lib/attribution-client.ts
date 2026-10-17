'use client'

import { type Attribution, cleanPath, cleanReferrer, utmFromSearch } from '@/lib/site-events'

const ATTRIBUTION_KEY = 'parsmedya_attribution'

/**
 * Captures where this browser session came from (UTM tags, external referrer, landing page).
 * Stored once per session; returns `isNew` the first time so a session_start event can be sent.
 */
export function captureAttribution(): { attribution: Attribution; isNew: boolean } {
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_KEY)
    if (stored) return { attribution: JSON.parse(stored) as Attribution, isNew: false }
    const attribution: Attribution = {
      landingPath: cleanPath(window.location.pathname),
      referrer: cleanReferrer(document.referrer, window.location.host),
      ...utmFromSearch(window.location.search),
    }
    window.sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution))
    return { attribution, isNew: true }
  } catch {
    return { attribution: {}, isNew: false }
  }
}

export function readAttribution(): Attribution {
  try {
    const stored = window.sessionStorage.getItem(ATTRIBUTION_KEY)
    return stored ? (JSON.parse(stored) as Attribution) : {}
  } catch {
    return {}
  }
}
