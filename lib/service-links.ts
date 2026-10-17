import { getTurkeyCity } from '@/lib/locations/turkey'
import { enCityServicePath } from '@/lib/local-seo/en-resolve'
import { LOCAL_INDEX_POLICY, isLocalPageIndexable } from '@/lib/local-seo/index-policy'
import type { Locale } from '@/lib/i18n'
import { getLocalService } from '@/lib/services/service-registry'

/** City pages of this service that the index policy keeps indexable (Ö14 hub → spoke links). */
export function featuredCityLinks(trSlug: string, locale: Locale) {
  const service = getLocalService(trSlug)
  if (!service) return []
  return LOCAL_INDEX_POLICY.priorityCities
    .map((slug) => getTurkeyCity(slug))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))
    .filter((city) => isLocalPageIndexable({ kind: 'city-service', citySlug: city.slug, serviceSlug: trSlug }))
    .map((city) => ({
      name: city.name,
      href: locale === 'en' ? enCityServicePath(city, service) : `/${city.slug}/${trSlug}`,
    }))
}

const GENERIC_SLUG_WORDS = new Set([
  'yazilim', 'yazilimi', 'cozumleri', 'cozumler', 'gelistirme', 'sistemleri', 'sistem', 'platform',
  'hizmetleri', 've', 'ile', 'destekli', 'yonetim', 'nedir', 'nasil', 'icin', 'rehberi',
])

function slugTokens(slug: string) {
  return slug.split('-').filter((token) => token.length >= 3 && !GENERIC_SLUG_WORDS.has(token))
}

/** Blog posts whose slug shares a meaningful word with the service slug, newest first. */
export function relatedPostsForService<T extends { slug: string }>(trSlug: string, posts: T[], limit = 3) {
  const tokens = new Set(slugTokens(trSlug))
  if (!tokens.size) return []
  return posts.filter((post) => slugTokens(post.slug).some((token) => tokens.has(token))).slice(0, limit)
}
