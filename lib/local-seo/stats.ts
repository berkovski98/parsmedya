import { getDistrictCount, getTurkeyCities } from '@/lib/locations/turkey'
import { getLocalServices } from '@/lib/services/service-registry'

export function getLocalSeoInventory() {
  const cities = getTurkeyCities().length
  const districts = getDistrictCount()
  const services = getLocalServices().length
  const cityHubs = cities
  const districtHubs = districts
  const cityServicePages = cities * services
  const districtServicePages = districts * services
  const nationalHub = 1
  const totalLocalUrls = nationalHub + cityHubs + districtHubs + cityServicePages + districtServicePages
  return {
    services,
    cities,
    districts,
    cityHubs,
    districtHubs,
    cityServicePages,
    districtServicePages,
    nationalHub,
    totalLocalUrls,
  }
}

export type LocalSeoInventory = ReturnType<typeof getLocalSeoInventory>
