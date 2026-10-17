import type { LocalSeoOverride } from '@/lib/local-seo/types'

/**
 * INDEX POLICY FOR PROGRAMMATIC LOCAL PAGES — the single place to adjust it.
 *
 * Every local URL stays live and reachable (HTTP 200, same path, same canonical and hreflang).
 * This rule only decides two things per page, identically for Turkish and English:
 *   1. robots meta: `index, follow` or `noindex, follow` (links keep passing signals), and
 *   2. whether the URL is listed in the XML sitemaps.
 *
 * Default (Ö4 in SEO-RAPORU.md):
 *   - indexed: national hub, 7 region hubs, 81 city hubs, district hubs of priority cities,
 *     city × service pages of priority cities, and any service page whose admin override adds
 *     its own copy (Admin → Yerel SEO: intro / location intro / FAQ).
 *   - noindex, follow + left out of sitemaps: everything else, i.e. district hubs outside the
 *     priority cities, city × service pages outside them and all district × service pages.
 *   - an override with "indexlenebilir" switched off always wins (noindex), for TR and EN.
 *
 * To widen or narrow the indexed set, edit LOCAL_INDEX_POLICY below; nothing else needs to change.
 */
export const LOCAL_INDEX_POLICY = {
  /** City slugs whose city × service pages (and district hubs) are indexed. */
  priorityCities: ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'kocaeli'] as readonly string[],
  /** Turkish service slugs indexed in priority cities; 'all' means every active service. */
  priorityServices: 'all' as 'all' | readonly string[],
  /** District hub pages (e.g. /istanbul/kadikoy): 'priority-cities', 'all' or 'none'. */
  districtHubs: 'priority-cities' as 'priority-cities' | 'all' | 'none',
  /** District × service pages (e.g. /istanbul/kadikoy/crm-yazilim-cozumleri) without own copy. */
  districtServicePages: false,
} as const

export type LocalPageKind =
  | 'national-hub'
  | 'region-hub'
  | 'city-hub'
  | 'district-hub'
  | 'city-service'
  | 'district-service'

export type LocalIndexOverride = Pick<LocalSeoOverride, 'is_indexable' | 'content_json' | 'faq_json'> | null | undefined

/** True when an admin override carries its own copy, which makes a page worth indexing. */
export function hasCustomLocalContent(override: LocalIndexOverride) {
  if (!override) return false
  const content = override.content_json
  return Boolean(content?.intro?.trim() || content?.locationIntro?.trim() || override.faq_json?.length)
}

function isPriorityCity(citySlug: string | undefined) {
  return Boolean(citySlug && LOCAL_INDEX_POLICY.priorityCities.includes(citySlug))
}

function isPriorityService(serviceSlug: string | undefined) {
  const services = LOCAL_INDEX_POLICY.priorityServices
  if (services === 'all') return Boolean(serviceSlug)
  return Boolean(serviceSlug && services.includes(serviceSlug))
}

/**
 * Decides whether a local page is indexable. Slugs are always the Turkish ones
 * (English pages pass the Turkish city/service slugs of their counterpart).
 */
export function isLocalPageIndexable({
  kind,
  citySlug,
  serviceSlug,
  override,
}: {
  kind: LocalPageKind
  citySlug?: string
  serviceSlug?: string
  override?: LocalIndexOverride
}) {
  if (override && override.is_indexable === false) return false
  if (kind === 'national-hub' || kind === 'region-hub' || kind === 'city-hub') return true
  if (kind === 'district-hub') {
    if (LOCAL_INDEX_POLICY.districtHubs === 'all') return true
    if (LOCAL_INDEX_POLICY.districtHubs === 'none') return false
    return isPriorityCity(citySlug)
  }
  if (hasCustomLocalContent(override)) return true
  if (kind === 'city-service') return isPriorityCity(citySlug) && isPriorityService(serviceSlug)
  return LOCAL_INDEX_POLICY.districtServicePages
}

/** Override paths (Turkish canonical paths) that change the default decision in sitemaps. */
export type LocalIndexOverrideSets = {
  /** Paths forced to noindex by an override. */
  excluded: Set<string>
  /** Service paths promoted to index because their override adds own copy. */
  promoted: Set<string>
}

export const emptyOverrideSets = (): LocalIndexOverrideSets => ({ excluded: new Set(), promoted: new Set() })

/** Sitemap decision for a Turkish local service path, using the same rule as the page itself. */
export function isLocalServicePathListed(
  path: string,
  kind: 'city-service' | 'district-service',
  citySlug: string,
  serviceSlug: string,
  sets: LocalIndexOverrideSets,
) {
  if (sets.excluded.has(path)) return false
  if (sets.promoted.has(path)) return true
  return isLocalPageIndexable({ kind, citySlug, serviceSlug })
}

export const localRobots = (indexable: boolean) => (indexable ? { index: true, follow: true } : { index: false, follow: true })
