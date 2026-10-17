import { getTurkeyCities, TURKEY_REGION_ORDER } from '@/lib/locations/turkey'
import { getLocalServices } from '@/lib/services/service-registry'
import { toEnglishServiceSlug } from '@/lib/i18n'
import { enCityPath, enDistrictPath, enNationalHubPath, enRegionPath } from '@/lib/local-seo/en-resolve'
import {
  emptyOverrideSets,
  isLocalPageIndexable,
  isLocalServicePathListed,
  type LocalIndexOverrideSets,
} from '@/lib/local-seo/index-policy'
import { localCityServicePath, localDistrictServicePath } from '@/lib/local-seo/resolve'
import { LEGACY_LOCAL_SERVICE_CHUNKS } from '@/lib/sitemap-index'
import { STATIC_CONTENT_UPDATED_AT } from '@/lib/sitemap-lastmod'
import { toSitemapEntry, type SitemapEntry } from '@/lib/sitemap-xml'

export const EN_LOCAL_SITEMAP_CHUNK_SIZE = 10000

let enCityEntriesCache: SitemapEntry[] | null = null

function serviceSlugPairs() {
  return getLocalServices()
    .map((service) => ({ tr: service.slug, en: toEnglishServiceSlug(service.slug) }))
    .filter((pair) => Boolean(pair.en))
}

export function buildEnLocalCitySitemapEntries(lastModified: Date | string = STATIC_CONTENT_UPDATED_AT): SitemapEntry[] {
  if (enCityEntriesCache) return enCityEntriesCache
  const entries: SitemapEntry[] = []
  const hub = toSitemapEntry(enNationalHubPath(), lastModified)
  if (hub) entries.push(hub)
  for (const region of TURKEY_REGION_ORDER) {
    const entry = toSitemapEntry(enRegionPath(region), lastModified)
    if (entry) entries.push(entry)
  }
  for (const city of getTurkeyCities()) {
    if (!city?.slug) continue
    const cityEntry = toSitemapEntry(enCityPath(city), lastModified)
    if (cityEntry) entries.push(cityEntry)
    if (!isLocalPageIndexable({ kind: 'district-hub', citySlug: city.slug })) continue
    for (const district of city.districts || []) {
      if (!district?.slug) continue
      const dEntry = toSitemapEntry(enDistrictPath(city, district), lastModified)
      if (dEntry) entries.push(dEntry)
    }
  }
  enCityEntriesCache = entries
  return entries
}

/**
 * English local service paths listed in the sitemap. The decision uses the Turkish
 * counterpart (same policy, same TR overrides) so both languages stay in sync.
 */
export function* iterateEnLocalServicePaths(sets: LocalIndexOverrideSets = emptyOverrideSets()): Generator<string> {
  const pairs = serviceSlugPairs()
  for (const city of getTurkeyCities()) {
    if (!city?.slug) continue
    for (const pair of pairs) {
      const trPath = localCityServicePath(city.slug, pair.tr)
      if (isLocalServicePathListed(trPath, 'city-service', city.slug, pair.tr, sets)) yield `${enCityPath(city)}/${pair.en}`
    }
    for (const district of city.districts || []) {
      if (!district?.slug) continue
      for (const pair of pairs) {
        const trPath = localDistrictServicePath(city.slug, district.slug, pair.tr)
        if (isLocalServicePathListed(trPath, 'district-service', city.slug, pair.tr, sets)) yield `${enDistrictPath(city, district)}/${pair.en}`
      }
    }
  }
}

export function buildEnLocalServiceSitemapChunk(
  chunkIndex: number,
  { lastModified = STATIC_CONTENT_UPDATED_AT, sets = emptyOverrideSets() }: { lastModified?: Date | string; sets?: LocalIndexOverrideSets } = {},
): SitemapEntry[] {
  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) return []
  const start = chunkIndex * EN_LOCAL_SITEMAP_CHUNK_SIZE
  const end = start + EN_LOCAL_SITEMAP_CHUNK_SIZE
  const entries: SitemapEntry[] = []
  let index = 0
  for (const path of iterateEnLocalServicePaths(sets)) {
    if (index >= end) break
    if (index >= start) {
      const entry = toSitemapEntry(path, lastModified)
      if (entry) entries.push(entry)
    }
    index += 1
  }
  return entries
}

export function buildEnLocalServiceSitemapEntries(
  { lastModified = STATIC_CONTENT_UPDATED_AT, sets = emptyOverrideSets() }: { lastModified?: Date | string; sets?: LocalIndexOverrideSets } = {},
): SitemapEntry[] {
  return [...iterateEnLocalServicePaths(sets)]
    .map((path) => toSitemapEntry(path, lastModified))
    .filter((entry): entry is SitemapEntry => entry !== null)
}

export function enLocalServiceSitemapChunkCount(sets: LocalIndexOverrideSets = emptyOverrideSets()): number {
  let count = 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _path of iterateEnLocalServicePaths(sets)) count += 1
  return Math.max(1, Math.ceil(count / EN_LOCAL_SITEMAP_CHUNK_SIZE))
}

export function enLocalServiceSitemapNames(sets: LocalIndexOverrideSets = emptyOverrideSets()) {
  return Array.from({ length: enLocalServiceSitemapChunkCount(sets) }, (_, index) => `en-local-services-${index + 1}.xml`)
}

export function maxServedEnLocalServiceChunk(sets: LocalIndexOverrideSets = emptyOverrideSets()) {
  return Math.max(LEGACY_LOCAL_SERVICE_CHUNKS, enLocalServiceSitemapChunkCount(sets))
}
