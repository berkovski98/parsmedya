import { getTurkeyCities, TURKEY_REGION_ORDER } from '@/lib/locations/turkey'
import { getLocalServices } from '@/lib/services/service-registry'
import { toEnglishServiceSlug } from '@/lib/i18n'
import { enCityPath, enDistrictPath, enNationalHubPath, enRegionPath } from '@/lib/local-seo/en-resolve'
import { toSitemapEntry, type SitemapEntry } from '@/lib/sitemap-xml'

export const EN_LOCAL_SITEMAP_CHUNK_SIZE = 10000

let enCityEntriesCache: SitemapEntry[] | null = null

function enServiceSlugs() {
  return getLocalServices().map((s) => toEnglishServiceSlug(s.slug)).filter(Boolean)
}

export function buildEnLocalCitySitemapEntries(now = new Date()): SitemapEntry[] {
  if (enCityEntriesCache) return enCityEntriesCache
  const cities = getTurkeyCities()
  const entries: SitemapEntry[] = []
  const hub = toSitemapEntry(enNationalHubPath(), now)
  if (hub) entries.push(hub)
  for (const region of TURKEY_REGION_ORDER) {
    const entry = toSitemapEntry(enRegionPath(region), now)
    if (entry) entries.push(entry)
  }
  for (const city of cities) {
    if (!city?.slug) continue
    const cityEntry = toSitemapEntry(enCityPath(city), now)
    if (cityEntry) entries.push(cityEntry)
    for (const district of city.districts || []) {
      if (!district?.slug) continue
      const dEntry = toSitemapEntry(enDistrictPath(city, district), now)
      if (dEntry) entries.push(dEntry)
    }
  }
  enCityEntriesCache = entries
  return entries
}

export function* iterateEnLocalServicePaths(): Generator<string> {
  const cities = getTurkeyCities()
  const slugs = enServiceSlugs()
  for (const city of cities) {
    if (!city?.slug) continue
    for (const slug of slugs) {
      yield `${enCityPath(city)}/${slug}`
    }
    for (const district of city.districts || []) {
      if (!district?.slug) continue
      for (const slug of slugs) {
        yield `${enDistrictPath(city, district)}/${slug}`
      }
    }
  }
}

export function buildEnLocalServiceSitemapChunk(chunkIndex: number, now = new Date()): SitemapEntry[] {
  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) return []
  const start = chunkIndex * EN_LOCAL_SITEMAP_CHUNK_SIZE
  const end = start + EN_LOCAL_SITEMAP_CHUNK_SIZE
  const entries: SitemapEntry[] = []
  let index = 0
  for (const path of iterateEnLocalServicePaths()) {
    if (index >= end) break
    if (index >= start) {
      const entry = toSitemapEntry(path, now)
      if (entry) entries.push(entry)
    }
    index += 1
  }
  return entries
}

export function buildEnLocalServiceSitemapEntries(now = new Date()): SitemapEntry[] {
  return [...iterateEnLocalServicePaths()]
    .map((path) => toSitemapEntry(path, now))
    .filter((entry): entry is SitemapEntry => entry !== null)
}

export function enLocalServiceSitemapChunkCount(): number {
  let count = 0
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _path of iterateEnLocalServicePaths()) count += 1
  return Math.ceil(count / EN_LOCAL_SITEMAP_CHUNK_SIZE) || 1
}
