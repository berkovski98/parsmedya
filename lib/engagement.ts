import type { Locale } from '@/lib/i18n'

/** Contact-form subject keys for the engagement stages; `?konu=<key>` pre-fills the subject. */
export const ENGAGEMENT_TOPICS = {
  discovery: { tr: 'Keşif Atölyesi talebi', en: 'Discovery workshop request' },
  pilot: { tr: 'Sabit kapsamlı pilot talebi', en: 'Fixed-scope pilot request' },
  support: { tr: 'Aylık destek talebi', en: 'Monthly support request' },
} as const
export type EngagementTopic = keyof typeof ENGAGEMENT_TOPICS

export function topicSubject(search: string, locale: Locale) {
  const key = new URLSearchParams(search).get('konu')
  return key && key in ENGAGEMENT_TOPICS ? ENGAGEMENT_TOPICS[key as EngagementTopic][locale] : null
}
