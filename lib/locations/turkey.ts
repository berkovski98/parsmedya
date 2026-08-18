import turkeyData from '@/lib/locations/turkey-data.json'

// Official 2025 administrative dataset: 81 provinces and 973 districts.
// Source: TurkiyeAPI v2 / 2025 provinces + districts JSON (api.turkiyeapi.dev).

export type TurkeyRegion =
  | 'Marmara'
  | 'Ege'
  | 'Akdeniz'
  | 'İç Anadolu'
  | 'Karadeniz'
  | 'Doğu Anadolu'
  | 'Güneydoğu Anadolu'

export type TurkeyDistrict = {
  name: string
  slug: string
}

export type TurkeyCity = {
  name: string
  slug: string
  plate: string
  region: TurkeyRegion
  coastal: boolean
  metropolitan: boolean
  districts: TurkeyDistrict[]
}

export const TURKEY_REGION_ORDER: TurkeyRegion[] = [
  'Marmara',
  'Ege',
  'Akdeniz',
  'İç Anadolu',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
]

export const TURKEY_CITIES = turkeyData as TurkeyCity[]

const cityBySlug = new Map(TURKEY_CITIES.map((city) => [city.slug, city]))
const districtByCitySlug = new Map(
  TURKEY_CITIES.map((city) => [city.slug, new Map(city.districts.map((district) => [district.slug, district]))]),
)

export function getTurkeyCities() {
  return TURKEY_CITIES
}

export function getTurkeyCity(slug: string) {
  return cityBySlug.get(slug) ?? null
}

export function getTurkeyDistrict(city: TurkeyCity | string, districtSlug: string) {
  const resolved = typeof city === 'string' ? getTurkeyCity(city) : city
  if (!resolved) return null
  return districtByCitySlug.get(resolved.slug)?.get(districtSlug) ?? null
}

export function getCitiesByRegion() {
  return TURKEY_REGION_ORDER.map((region) => ({
    region,
    cities: TURKEY_CITIES.filter((city) => city.region === region),
  }))
}

export function getDistrictCount() {
  return TURKEY_CITIES.reduce((total, city) => total + city.districts.length, 0)
}

export function getSiblingDistricts(city: TurkeyCity, districtSlug: string, limit = 12) {
  const others = city.districts.filter((district) => district.slug !== districtSlug)
  if (others.length <= limit) return others
  const start = Math.abs(hashSeed(`${city.slug}:${districtSlug}`)) % others.length
  return Array.from({ length: limit }, (_, index) => others[(start + index) % others.length])
}

export function getRelatedCities(city: TurkeyCity, limit = 6) {
  const sameRegion = TURKEY_CITIES.filter((item) => item.region === city.region && item.slug !== city.slug)
  return sameRegion.slice(0, limit)
}

function hashSeed(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}
