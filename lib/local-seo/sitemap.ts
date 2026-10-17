import { getTurkeyCities, getTurkeyRegions } from '@/lib/locations/turkey'
import { getLocalServices } from '@/lib/services/service-registry'
import {
  emptyOverrideSets,
  isLocalPageIndexable,
  isLocalServicePathListed,
  type LocalIndexOverrideSets,
} from '@/lib/local-seo/index-policy'
import {
  localCityPath,
  localCityServicePath,
  localDistrictPath,
  localDistrictServicePath,
  localNationalHubPath,
  localRegionPath,
} from '@/lib/local-seo/resolve'
import { LEGACY_LOCAL_SERVICE_CHUNKS } from '@/lib/sitemap-index'
import { STATIC_CONTENT_UPDATED_AT } from '@/lib/sitemap-lastmod'
import { toSitemapEntry, type SitemapEntry } from '@/lib/sitemap-xml'

export const LOCAL_SITEMAP_CHUNK_SIZE = 10000

let cityEntriesCache: SitemapEntry[] | null = null

function compactLocalEntries(entries: Array<SitemapEntry | null>): SitemapEntry[] {
  return entries.filter((entry): entry is SitemapEntry => Boolean(entry))
}

function serviceSlugs() {
  try {
    return getLocalServices().map((service) => service.slug).filter(Boolean)
  } catch (error) {
    console.error('[sitemap] local service slugs failed', error)
    return []
  }
}

/** Every Turkish local service path, listed or not (used for inventory and tests). */
export function* iterateAllLocalServicePaths(): Generator<{ path: string; kind: 'city-service' | 'district-service'; city: string; service: string }> {
  const slugs = serviceSlugs()
  for (const city of getTurkeyCities()) {
    if (!city?.slug) continue
    for (const slug of slugs) {
      yield { path: localCityServicePath(city.slug, slug), kind: 'city-service', city: city.slug, service: slug }
    }
    for (const district of city.districts || []) {
      if (!district?.slug) continue
      for (const slug of slugs) {
        yield { path: localDistrictServicePath(city.slug, district.slug, slug), kind: 'district-service', city: city.slug, service: slug }
      }
    }
  }
}

/** Turkish local service paths that belong in the sitemap under the index policy. */
export function* iterateLocalServicePaths(sets: LocalIndexOverrideSets = emptyOverrideSets()): Generator<string> {
  for (const item of iterateAllLocalServicePaths()) {
    if (isLocalServicePathListed(item.path, item.kind, item.city, item.service, sets)) yield item.path
  }
}

export function buildLocalCitySitemapEntries(lastModified: Date | string = STATIC_CONTENT_UPDATED_AT): SitemapEntry[] {
  if (cityEntriesCache) return cityEntriesCache
  try {
    const entries = compactLocalEntries([
      toSitemapEntry(localNationalHubPath(), lastModified),
      ...getTurkeyRegions().map((region) => toSitemapEntry(localRegionPath(region.name), lastModified)),
      ...getTurkeyCities().flatMap((city) => {
        if (!city?.slug) return []
        return [
          toSitemapEntry(localCityPath(city.slug), lastModified),
          ...city.districts.map((district) => (
            district?.slug && isLocalPageIndexable({ kind: 'district-hub', citySlug: city.slug })
              ? toSitemapEntry(localDistrictPath(city.slug, district.slug), lastModified)
              : null
          )),
        ]
      }),
    ])
    cityEntriesCache = entries
    return entries
  } catch (error) {
    console.error('[sitemap] local city dataset failed', error)
    return compactLocalEntries([toSitemapEntry(localNationalHubPath(), lastModified)])
  }
}

export function buildLocalServiceSitemapChunk(
  chunkIndex: number,
  {
    lastModified = STATIC_CONTENT_UPDATED_AT,
    sets = emptyOverrideSets(),
  }: {
    lastModified?: Date | string
    sets?: LocalIndexOverrideSets
  } = {},
): SitemapEntry[] {
  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) return []
  const start = chunkIndex * LOCAL_SITEMAP_CHUNK_SIZE
  const end = start + LOCAL_SITEMAP_CHUNK_SIZE
  const entries: SitemapEntry[] = []
  try {
    let index = 0
    for (const path of iterateLocalServicePaths(sets)) {
      if (index >= end) break
      if (index >= start) {
        const entry = toSitemapEntry(path, lastModified)
        if (entry) entries.push(entry)
      }
      index += 1
    }
    return entries
  } catch (error) {
    console.error('[sitemap] local service chunk failed', chunkIndex, error)
    return entries
  }
}

export function buildLocalServiceSitemapEntries({
  lastModified = STATIC_CONTENT_UPDATED_AT,
  sets = emptyOverrideSets(),
}: {
  lastModified?: Date | string
  sets?: LocalIndexOverrideSets
} = {}): SitemapEntry[] {
  try {
    return compactLocalEntries([...iterateLocalServicePaths(sets)].map((path) => toSitemapEntry(path, lastModified)))
  } catch (error) {
    console.error('[sitemap] local service dataset failed', error)
    return []
  }
}

export function chunkSitemapEntries(entries: SitemapEntry[], size = LOCAL_SITEMAP_CHUNK_SIZE) {
  const chunks: SitemapEntry[][] = []
  for (let index = 0; index < entries.length; index += size) {
    chunks.push(entries.slice(index, size + index))
  }
  return chunks.length ? chunks : [[]]
}

/** Number of non-empty local-services-N.xml files for the current policy (at least 1). */
export function localServiceSitemapChunkCount(sets: LocalIndexOverrideSets = emptyOverrideSets()) {
  let count = 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _path of iterateLocalServicePaths(sets)) count += 1
  return Math.max(1, Math.ceil(count / LOCAL_SITEMAP_CHUNK_SIZE))
}

/** Active local-services-N.xml names, computed from the URL count instead of a fixed list. */
export function localServiceSitemapNames(sets: LocalIndexOverrideSets = emptyOverrideSets()) {
  return Array.from({ length: localServiceSitemapChunkCount(sets) }, (_, index) => `local-services-${index + 1}.xml`)
}

/** Highest chunk number still answered with 200 (older submitted files keep resolving). */
export function maxServedLocalServiceChunk(sets: LocalIndexOverrideSets = emptyOverrideSets()) {
  return Math.max(LEGACY_LOCAL_SERVICE_CHUNKS, localServiceSitemapChunkCount(sets))
}
