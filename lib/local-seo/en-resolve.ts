import {
  getTurkeyCity,
  getTurkeyDistrict,
  getTurkeyRegion,
  toRegionSlug,
  TURKEY_REGION_ORDER,
  type TurkeyCity,
  type TurkeyDistrict,
  type TurkeyRegion,
} from '@/lib/locations/turkey'
import { getLocalService, type LocalServiceRecord } from '@/lib/services/service-registry'
import { toEnglishServiceSlug, toTurkishServiceSlug } from '@/lib/i18n/service-slugs'

export const ENGLISH_REGION_SLUGS: Record<TurkeyRegion, string> = {
  Marmara: 'marmara',
  Ege: 'aegean',
  Akdeniz: 'mediterranean',
  'İç Anadolu': 'central-anatolia',
  Karadeniz: 'black-sea',
  'Doğu Anadolu': 'eastern-anatolia',
  'Güneydoğu Anadolu': 'southeastern-anatolia',
}

export const ENGLISH_REGION_NAMES: Record<TurkeyRegion, string> = {
  Marmara: 'Marmara',
  Ege: 'Aegean',
  Akdeniz: 'Mediterranean',
  'İç Anadolu': 'Central Anatolia',
  Karadeniz: 'Black Sea',
  'Doğu Anadolu': 'Eastern Anatolia',
  'Güneydoğu Anadolu': 'Southeastern Anatolia',
}

const regionByEnSlug = new Map(
  TURKEY_REGION_ORDER.map((region) => [ENGLISH_REGION_SLUGS[region], region]),
)

export function enRegionSlug(region: TurkeyRegion) {
  return ENGLISH_REGION_SLUGS[region]
}

export function enRegionName(region: TurkeyRegion) {
  return ENGLISH_REGION_NAMES[region]
}

export function resolveEnRegion(slug: string): TurkeyRegion | null {
  return regionByEnSlug.get(slug) ?? null
}

export function enServiceSlug(trSlug: string) {
  return toEnglishServiceSlug(trSlug) || trSlug
}

export function resolveEnService(enSlug: string): LocalServiceRecord | null {
  const trSlug = toTurkishServiceSlug(enSlug)
  if (!trSlug) return null
  return getLocalService(trSlug)
}

// Path builders
export const EN_SERVICE_AREAS_ROOT = '/en/service-areas'

export function enNationalHubPath() {
  return EN_SERVICE_AREAS_ROOT
}

export function enRegionPath(region: TurkeyRegion) {
  return `${EN_SERVICE_AREAS_ROOT}/${enRegionSlug(region)}`
}

export function enCityPath(city: TurkeyCity) {
  return `${enRegionPath(city.region)}/${city.slug}`
}

export function enDistrictPath(city: TurkeyCity, district: TurkeyDistrict) {
  return `${enCityPath(city)}/${district.slug}`
}

export function enCityServicePath(city: TurkeyCity, service: LocalServiceRecord) {
  return `${enCityPath(city)}/${enServiceSlug(service.slug)}`
}

export function enDistrictServicePath(city: TurkeyCity, district: TurkeyDistrict, service: LocalServiceRecord) {
  return `${enDistrictPath(city, district)}/${enServiceSlug(service.slug)}`
}

// Route resolvers for dynamic pages
export type EnNationalHubRoute = { type: 'en-national-hub' }
export type EnRegionHubRoute = { type: 'en-region-hub'; region: TurkeyRegion }
export type EnCityHubRoute = { type: 'en-city-hub'; city: TurkeyCity }
export type EnDistrictHubRoute = { type: 'en-district-hub'; city: TurkeyCity; district: TurkeyDistrict }
export type EnCityServiceRoute = { type: 'en-city-service'; city: TurkeyCity; service: LocalServiceRecord }
export type EnDistrictServiceRoute = { type: 'en-district-service'; city: TurkeyCity; district: TurkeyDistrict; service: LocalServiceRecord }

export function resolveEnRegionHub(regionSlug: string): EnRegionHubRoute | null {
  const region = resolveEnRegion(regionSlug)
  if (!region) return null
  return { type: 'en-region-hub', region }
}

export function resolveEnCityHub(regionSlug: string, citySlug: string): EnCityHubRoute | null {
  const region = resolveEnRegion(regionSlug)
  if (!region) return null
  const city = getTurkeyCity(citySlug)
  if (!city || city.region !== region) return null
  return { type: 'en-city-hub', city }
}

export function resolveEnCityChild(regionSlug: string, citySlug: string, slug: string): EnDistrictHubRoute | EnCityServiceRoute | null {
  const region = resolveEnRegion(regionSlug)
  if (!region) return null
  const city = getTurkeyCity(citySlug)
  if (!city || city.region !== region) return null

  const district = getTurkeyDistrict(city, slug)
  if (district) return { type: 'en-district-hub', city, district }

  const service = resolveEnService(slug)
  if (service) return { type: 'en-city-service', city, service }
  return null
}

export function resolveEnDistrictService(regionSlug: string, citySlug: string, districtSlug: string, serviceSlug: string): EnDistrictServiceRoute | null {
  const region = resolveEnRegion(regionSlug)
  if (!region) return null
  const city = getTurkeyCity(citySlug)
  if (!city || city.region !== region) return null
  const district = getTurkeyDistrict(city, districtSlug)
  if (!district) return null
  const service = resolveEnService(serviceSlug)
  if (!service) return null
  return { type: 'en-district-service', city, district, service }
}

// TR ↔ EN path mapping
export function trLocalPathToEn(trPath: string): string | null {
  if (trPath === '/hizmet-bolgeleri') return enNationalHubPath()
  if (trPath.startsWith('/hizmet-bolgeleri/')) {
    const regionTrSlug = trPath.slice('/hizmet-bolgeleri/'.length)
    const region = getTurkeyRegion(regionTrSlug)
    if (region) return enRegionPath(region)
    return null
  }
  const parts = trPath.split('/').filter(Boolean)
  if (parts.length < 1 || parts.length > 3) return null
  const city = getTurkeyCity(parts[0])
  if (!city) return null
  if (parts.length === 1) return enCityPath(city)
  if (parts.length === 2) {
    const district = getTurkeyDistrict(city, parts[1])
    if (district) return enDistrictPath(city, district)
    const service = getLocalService(parts[1])
    if (service) return enCityServicePath(city, service)
    return null
  }
  const district = getTurkeyDistrict(city, parts[1])
  if (!district) return null
  const service = getLocalService(parts[2])
  if (!service) return null
  return enDistrictServicePath(city, district, service)
}

export function enLocalPathToTr(enPath: string): string | null {
  const stripped = enPath.replace(/^\/en\/service-areas\/?/, '')
  if (!stripped) return '/hizmet-bolgeleri'
  const parts = stripped.split('/').filter(Boolean)
  if (parts.length === 1) {
    const region = resolveEnRegion(parts[0])
    if (!region) return null
    return `/hizmet-bolgeleri/${toRegionSlug(region)}`
  }
  if (parts.length < 2) return null
  const region = resolveEnRegion(parts[0])
  if (!region) return null
  const city = getTurkeyCity(parts[1])
  if (!city || city.region !== region) return null
  if (parts.length === 2) return `/${city.slug}`
  if (parts.length === 3) {
    const district = getTurkeyDistrict(city, parts[2])
    if (district) return `/${city.slug}/${district.slug}`
    const trSlug = toTurkishServiceSlug(parts[2])
    if (trSlug && getLocalService(trSlug)) return `/${city.slug}/${trSlug}`
    return null
  }
  if (parts.length === 4) {
    const district = getTurkeyDistrict(city, parts[2])
    if (!district) return null
    const trSlug = toTurkishServiceSlug(parts[3])
    if (!trSlug || !getLocalService(trSlug)) return null
    return `/${city.slug}/${district.slug}/${trSlug}`
  }
  return null
}
