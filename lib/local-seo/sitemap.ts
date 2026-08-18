import { getTurkeyCities } from '@/lib/locations/turkey'
import { getLocalServices } from '@/lib/services/service-registry'
import { getLocalSeoInventory } from '@/lib/local-seo/stats'
import { canonicalAbsoluteUrl } from '@/lib/site-url'
import { filterSitemapEntries, type SitemapEntry } from '@/lib/sitemap-xml'

export const LOCAL_SITEMAP_CHUNK_SIZE = 10000

export function buildLocalCitySitemapEntries(now = new Date()): SitemapEntry[] {
  const cities = getTurkeyCities()
  const entries: SitemapEntry[] = [
    { url: canonicalAbsoluteUrl('/tr/hizmet-bolgeleri'), lastModified: now },
    ...cities.map((city) => ({ url: canonicalAbsoluteUrl(`/tr/${city.slug}`), lastModified: now })),
    ...cities.flatMap((city) => city.districts.map((district) => ({
      url: canonicalAbsoluteUrl(`/tr/${city.slug}/${district.slug}`),
      lastModified: now,
    }))),
  ]
  return filterSitemapEntries(entries, 'tr')
}

export function buildLocalServiceSitemapEntries({
  now = new Date(),
  excluded = new Set<string>(),
}: {
  now?: Date
  excluded?: Set<string>
} = {}): SitemapEntry[] {
  const cities = getTurkeyCities()
  const services = getLocalServices()
  const entries: SitemapEntry[] = []
  for (const city of cities) {
    for (const service of services) {
      const path = `/tr/${city.slug}/${service.slug}`
      if (!excluded.has(path)) entries.push({ url: canonicalAbsoluteUrl(path), lastModified: now })
    }
    for (const district of city.districts) {
      for (const service of services) {
        const path = `/tr/${city.slug}/${district.slug}/${service.slug}`
        if (!excluded.has(path)) entries.push({ url: canonicalAbsoluteUrl(path), lastModified: now })
      }
    }
  }
  return filterSitemapEntries(entries, 'tr')
}

export function chunkSitemapEntries(entries: SitemapEntry[], size = LOCAL_SITEMAP_CHUNK_SIZE) {
  const chunks: SitemapEntry[][] = []
  for (let index = 0; index < entries.length; index += size) {
    chunks.push(entries.slice(index, index + size))
  }
  return chunks.length ? chunks : [[]]
}

export function localServiceSitemapNames() {
  const { cityServicePages, districtServicePages } = getLocalSeoInventory()
  const chunkCount = Math.max(1, Math.ceil((cityServicePages + districtServicePages) / LOCAL_SITEMAP_CHUNK_SIZE))
  return Array.from({ length: chunkCount }, (_, index) => `local-services-${index + 1}.xml`)
}
