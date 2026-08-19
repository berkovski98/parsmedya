import {
  getTurkeyCity,
  getTurkeyDistrict,
  getTurkeyRegion,
  toRegionSlug,
  type TurkeyCity,
  type TurkeyDistrict,
  type TurkeyRegion,
} from '@/lib/locations/turkey'
import { getLocalService, type LocalServiceRecord } from '@/lib/services/service-registry'

export const RESERVED_TR_CITY_SEGMENTS = [
  'hizmetler',
  'blog',
  'hakkimizda',
  'iletisim',
  'misyonumuz',
  'vizyonumuz',
  'hizmet-bolgeleri',
  'en',
  'admin',
  'api',
  'tr',
  'sitemaps',
  'sitemap.xml',
  'sitemap-en.xml',
  'robots.txt',
  'geo',
] as const

const reserved = new Set<string>(RESERVED_TR_CITY_SEGMENTS)

export type NationalHubRoute = { type: 'national-hub' }
export type RegionHubRoute = { type: 'region-hub'; region: TurkeyRegion; slug: string }
export type CityHubRoute = { type: 'city-hub'; city: TurkeyCity }
export type DistrictHubRoute = { type: 'district-hub'; city: TurkeyCity; district: TurkeyDistrict }
export type CityServiceRoute = { type: 'city-service'; city: TurkeyCity; service: LocalServiceRecord }
export type DistrictServiceRoute = { type: 'district-service'; city: TurkeyCity; district: TurkeyDistrict; service: LocalServiceRecord }

export type LocalRoute =
  | NationalHubRoute
  | RegionHubRoute
  | CityHubRoute
  | DistrictHubRoute
  | CityServiceRoute
  | DistrictServiceRoute

export function isReservedTrCitySegment(slug: string) {
  return reserved.has(slug)
}

export function localNationalHubPath() {
  return '/hizmet-bolgeleri'
}

export function localRegionPath(region: TurkeyRegion | string) {
  const match = getTurkeyRegion(region)
  return `/hizmet-bolgeleri/${match ? toRegionSlug(match) : region}`
}

export function resolveRegionHub(slug: string): RegionHubRoute | null {
  const region = getTurkeyRegion(slug)
  if (!region) return null
  return { type: 'region-hub', region, slug: toRegionSlug(region) }
}

export function localCityPath(city: string) {
  return `/${city}`
}

export function localDistrictPath(city: string, district: string) {
  return `/${city}/${district}`
}

export function localCityServicePath(city: string, service: string) {
  return `/${city}/${service}`
}

export function localDistrictServicePath(city: string, district: string, service: string) {
  return `/${city}/${district}/${service}`
}

export function resolveCityHub(citySlug: string): CityHubRoute | null {
  if (isReservedTrCitySegment(citySlug)) return null
  const city = getTurkeyCity(citySlug)
  if (!city) return null
  return { type: 'city-hub', city }
}

export function resolveCityChild(citySlug: string, slug: string): DistrictHubRoute | CityServiceRoute | null {
  const city = getTurkeyCity(citySlug)
  if (!city || isReservedTrCitySegment(citySlug)) return null
  const district = getTurkeyDistrict(city, slug)
  if (district) return { type: 'district-hub', city, district }
  const service = getLocalService(slug)
  if (service) return { type: 'city-service', city, service }
  return null
}

export function resolveDistrictService(citySlug: string, districtSlug: string, serviceSlug: string): DistrictServiceRoute | null {
  const city = getTurkeyCity(citySlug)
  if (!city || isReservedTrCitySegment(citySlug)) return null
  const district = getTurkeyDistrict(city, districtSlug)
  if (!district) return null
  const service = getLocalService(serviceSlug)
  if (!service) return null
  return { type: 'district-service', city, district, service }
}

function stripLegacyTrPrefix(pathname: string) {
  if (pathname === '/tr') return '/'
  if (pathname.startsWith('/tr/')) return pathname.slice(3)
  return pathname
}

export function isValidLocalPath(pathname: string) {
  const raw = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname
  const path = stripLegacyTrPrefix(raw)
  if (path === '/hizmet-bolgeleri') return true
  if (path.startsWith('/hizmet-bolgeleri/')) {
    const slug = path.slice('/hizmet-bolgeleri/'.length)
    return Boolean(resolveRegionHub(slug))
  }
  const parts = path.split('/').filter(Boolean)
  if (parts.length < 1 || parts.length > 3) return false
  if (parts.length === 1) return Boolean(resolveCityHub(parts[0]))
  if (parts.length === 2) return Boolean(resolveCityChild(parts[0], parts[1]))
  return Boolean(resolveDistrictService(parts[0], parts[1], parts[2]))
}
