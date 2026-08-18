import { getTurkeyCities } from '@/lib/locations/turkey'
import { getLocalServices } from '@/lib/services/service-registry'
import {
  localCityPath,
  localCityServicePath,
  localDistrictPath,
  localDistrictServicePath,
  localNationalHubPath,
} from '@/lib/local-seo/resolve'
import { CHILD_SITEMAP_FILES } from '@/lib/sitemap-index'
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

export function* iterateLocalServicePaths(excluded = new Set<string>()): Generator<string> {
  const cities = getTurkeyCities()
  const slugs = serviceSlugs()
  for (const city of cities) {
    if (!city?.slug) continue
    for (const slug of slugs) {
      const path = localCityServicePath(city.slug, slug)
      if (!excluded.has(path)) yield path
    }
    for (const district of city.districts || []) {
      if (!district?.slug) continue
      for (const slug of slugs) {
        const path = localDistrictServicePath(city.slug, district.slug, slug)
        if (!excluded.has(path)) yield path
      }
    }
  }
}

export function buildLocalCitySitemapEntries(now = new Date()): SitemapEntry[] {
  if (cityEntriesCache) return cityEntriesCache
  try {
    const cities = getTurkeyCities()
    const entries = compactLocalEntries([
      toSitemapEntry(localNationalHubPath(), now),
      ...cities.flatMap((city) => {
        if (!city?.slug) return []
        return [
          toSitemapEntry(localCityPath(city.slug), now),
          ...city.districts.map((district) => (
            district?.slug ? toSitemapEntry(localDistrictPath(city.slug, district.slug), now) : null
          )),
        ]
      }),
    ])
    cityEntriesCache = entries
    return entries
  } catch (error) {
    console.error('[sitemap] local city dataset failed', error)
    return compactLocalEntries([toSitemapEntry(localNationalHubPath(), now)])
  }
}

export function buildLocalServiceSitemapChunk(
  chunkIndex: number,
  {
    now = new Date(),
    excluded = new Set<string>(),
  }: {
    now?: Date
    excluded?: Set<string>
  } = {},
): SitemapEntry[] {
  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) return []
  const start = chunkIndex * LOCAL_SITEMAP_CHUNK_SIZE
  const end = start + LOCAL_SITEMAP_CHUNK_SIZE
  const entries: SitemapEntry[] = []
  try {
    let index = 0
    for (const path of iterateLocalServicePaths(excluded)) {
      if (index >= end) break
      if (index >= start) {
        const entry = toSitemapEntry(path, now)
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
  now = new Date(),
  excluded = new Set<string>(),
}: {
  now?: Date
  excluded?: Set<string>
} = {}): SitemapEntry[] {
  try {
    return compactLocalEntries([...iterateLocalServicePaths(excluded)].map((path) => toSitemapEntry(path, now)))
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

export function localServiceSitemapNames() {
  return CHILD_SITEMAP_FILES.filter((file) => file.startsWith('local-services-'))
}
