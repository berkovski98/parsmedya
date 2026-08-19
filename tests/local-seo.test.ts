import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toLocationSlug } from '../lib/locations/slug'
import { getDistrictCount, getTurkeyCity, getTurkeyCities } from '../lib/locations/turkey'
import { buildCityHub, buildDistrictHub, buildLocalServicePage, buildNationalHub, buildRegionHub } from '../lib/local-seo/content'
import { localHubJsonLd, localServiceJsonLd } from '../lib/local-seo/schema'
import { isValidLocalPath, resolveCityChild, resolveDistrictService, resolveRegionHub } from '../lib/local-seo/resolve'
import { getLocalSeoInventory } from '../lib/local-seo/stats'
import { buildLocalCitySitemapEntries, buildLocalServiceSitemapChunk, buildLocalServiceSitemapEntries, localServiceSitemapNames } from '../lib/local-seo/sitemap'
import { getLocalService, getLocalServices } from '../lib/services/service-registry'
import { canonicalAbsoluteUrl, PRODUCTION_SITE_URL } from '../lib/site-url'
import { buildEnglishSitemapEntries, childSitemapPath, locUrls, sitemapIndex, urlset } from '../lib/sitemap-xml'

test('official Turkey dataset has 81 cities and 973 districts', () => {
  const cities = getTurkeyCities()
  assert.equal(cities.length, 81)
  assert.equal(getDistrictCount(), 973)
  const istanbul = getTurkeyCity('istanbul')
  const ankara = getTurkeyCity('ankara')
  const izmir = getTurkeyCity('izmir')
  assert.equal(istanbul?.name, 'İstanbul')
  assert.equal(istanbul?.plate, '34')
  assert.equal(istanbul?.districts.length, 39)
  assert.ok(istanbul?.districts.some((district) => district.slug === 'kadikoy' && district.name === 'Kadıköy'))
  assert.ok(istanbul?.districts.some((district) => district.slug === 'sisli'))
  assert.ok(istanbul?.districts.some((district) => district.slug === 'kagithane'))
  assert.equal(ankara?.districts.some((district) => district.slug === 'cankaya'), true)
  assert.equal(istanbul?.districts.some((district) => district.slug === 'cankaya'), false)
  assert.equal(izmir?.districts.length, 30)
})

test('location slug utility converts Turkish characters to ASCII kebab-case', () => {
  assert.equal(toLocationSlug('İstanbul'), 'istanbul')
  assert.equal(toLocationSlug('Şişli'), 'sisli')
  assert.equal(toLocationSlug('Büyükçekmece'), 'buyukcekmece')
  assert.equal(toLocationSlug('Çankaya'), 'cankaya')
  assert.equal(toLocationSlug('Kâğıthane'), 'kagithane')
  assert.equal(toLocationSlug('Kağıthane'), 'kagithane')
})

test('region slugs and hub routes resolve for all geographic regions', () => {
  assert.equal(toLocationSlug('Marmara'), 'marmara')
  assert.equal(toLocationSlug('İç Anadolu'), 'ic-anadolu')
  assert.equal(toLocationSlug('Doğu Anadolu'), 'dogu-anadolu')
  assert.equal(toLocationSlug('Güneydoğu Anadolu'), 'guneydogu-anadolu')
  assert.equal(isValidLocalPath('/hizmet-bolgeleri/marmara'), true)
  assert.equal(isValidLocalPath('/hizmet-bolgeleri/ic-anadolu'), true)
  assert.equal(isValidLocalPath('/hizmet-bolgeleri/olmayan-bolge'), false)
  const route = resolveRegionHub('marmara')
  assert.equal(route?.type, 'region-hub')
  assert.equal(route?.region, 'Marmara')
})

test('valid and invalid local paths resolve correctly', () => {
  assert.equal(isValidLocalPath('/istanbul'), true)
  assert.equal(isValidLocalPath('/istanbul/kadikoy'), true)
  assert.equal(isValidLocalPath('/istanbul/ozel-yazilim-gelistirme'), true)
  assert.equal(isValidLocalPath('/istanbul/kadikoy/ozel-yazilim-gelistirme'), true)
  assert.equal(isValidLocalPath('/ankara/cankaya/crm-yazilim-cozumleri'), true)
  assert.equal(isValidLocalPath('/tr/istanbul'), true)
  assert.equal(isValidLocalPath('/istanbul/cankaya/crm-yazilim-cozumleri'), false)
  assert.equal(isValidLocalPath('/istanbul/kadikoy/olmayan-hizmet'), false)
  assert.equal(isValidLocalPath('/olmayan-il'), false)
  assert.equal(resolveCityChild('istanbul', 'cankaya'), null)
  assert.equal(resolveDistrictService('istanbul', 'cankaya', 'crm-yazilim-cozumleri'), null)
  assert.equal(resolveCityChild('istanbul', 'kadikoy')?.type, 'district-hub')
  assert.equal(resolveCityChild('istanbul', 'ozel-yazilim-gelistirme')?.type, 'city-service')
})

test('local SEO inventory matches city, district and service registries', () => {
  const inventory = getLocalSeoInventory()
  const services = getLocalServices().length
  assert.ok(services >= 22)
  assert.equal(inventory.services, services)
  assert.equal(inventory.cities, 81)
  assert.equal(inventory.districts, 973)
  assert.equal(inventory.cityHubs, 81)
  assert.equal(inventory.districtHubs, 973)
  assert.equal(inventory.cityServicePages, 81 * services)
  assert.equal(inventory.districtServicePages, 973 * services)
  assert.equal(
    inventory.totalLocalUrls,
    1 + 81 + 973 + inventory.cityServicePages + inventory.districtServicePages,
  )
})

test('service pages produce unique title, description, H1 and self-canonical', () => {
  const cities = getTurkeyCities().slice(0, 10)
  const services = getLocalServices().slice(0, 10)
  const districts = getTurkeyCities()
    .flatMap((city) => city.districts.slice(0, 3).map((district) => ({ city, district })))
    .slice(0, 20)
  const titles = new Set<string>()
  const descriptions = new Set<string>()
  const headings = new Set<string>()
  const canonicals = new Set<string>()

  for (const city of cities) {
    const hub = buildCityHub(city)
    assert.ok(hub.h1.includes(city.name))
    assert.equal(hub.canonicalPath, `/${city.slug}`)
    assert.equal(canonicalAbsoluteUrl(hub.canonicalPath).startsWith(PRODUCTION_SITE_URL), true)
  }

  for (const { city, district } of districts) {
    const hub = buildDistrictHub(city, district)
    assert.ok(hub.h1.includes(district.name))
    assert.equal(hub.canonicalPath, `/${city.slug}/${district.slug}`)
  }

  for (const city of cities) {
    for (const service of services) {
      const model = buildLocalServicePage(city, service)
      assert.equal(titles.has(model.title), false, model.title)
      assert.equal(descriptions.has(model.description), false, model.description)
      assert.equal(headings.has(model.h1), false, model.h1)
      assert.equal(canonicals.has(model.canonicalPath), false)
      titles.add(model.title)
      descriptions.add(model.description)
      headings.add(model.h1)
      canonicals.add(model.canonicalPath)
      assert.equal(model.title, `${city.name} ${service.title} | Pars Medya`)
      assert.equal(model.h1, `${city.name} ${service.title}`)
      assert.equal(model.canonicalPath, `/${city.slug}/${service.slug}`)
      assert.ok(!model.description.toLowerCase().includes('localhost'))
      assert.ok(model.description.length >= 120)
      assert.ok(model.breadcrumbs.some((item) => item.name === city.name))
      assert.equal(model.indexable, true)
    }
  }

  for (const { city, district } of districts.slice(0, 10)) {
    for (const service of services.slice(0, 4)) {
      const model = buildLocalServicePage(city, service, district)
      assert.equal(model.h1, `${district.name} ${service.title}`)
      assert.equal(model.canonicalPath, `/${city.slug}/${district.slug}/${service.slug}`)
      assert.ok(model.heroDescription.includes(city.name) || model.locationIntro.includes(city.name))
      assert.deepEqual(model.areaServed, [district.name, city.name])
      assert.equal(canonicals.has(model.canonicalPath), false)
      canonicals.add(model.canonicalPath)
    }
  }
})

test('JSON-LD includes BreadcrumbList, Service, FAQPage and no fake LocalBusiness', () => {
  const city = getTurkeyCity('istanbul')!
  const service = getLocalService('ozel-yazilim-gelistirme')!
  const district = city.districts.find((item) => item.slug === 'kadikoy')!
  const model = buildLocalServicePage(city, service, district)
  const json = localServiceJsonLd(model)
  assert.equal(json.includes('localhost'), false)
  const parsed = JSON.parse(json) as { '@graph': Array<Record<string, unknown>> }
  const types = parsed['@graph'].map((node) => node['@type'])
  assert.ok(types.includes('BreadcrumbList'))
  assert.ok(types.includes('Service'))
  assert.ok(types.includes('FAQPage'))
  assert.ok(types.includes('WebPage'))
  assert.ok(types.includes('Organization'))
  assert.equal(types.includes('LocalBusiness'), false)
  const serviceNode = parsed['@graph'].find((node) => node['@type'] === 'Service')!
  assert.equal(serviceNode.url, `${PRODUCTION_SITE_URL}/istanbul/kadikoy/ozel-yazilim-gelistirme`)
  const areas = serviceNode.areaServed as Array<{ name: string }>
  assert.deepEqual(areas.map((item) => item.name), ['Kadıköy', 'İstanbul'])
  const crumbs = parsed['@graph'].find((node) => node['@type'] === 'BreadcrumbList')!
  const names = (crumbs.itemListElement as Array<{ name: string }>).map((item) => item.name)
  assert.deepEqual(names, ['Ana Sayfa', 'Hizmetler', 'İstanbul', 'Kadıköy', 'Özel Yazılım Geliştirme'])
  const hub = localHubJsonLd(buildNationalHub())
  assert.ok(hub.includes('BreadcrumbList'))
  assert.equal(hub.includes('LocalBusiness'), false)
})

test('hub pages include expanded sections, unique overviews and sufficient FAQs', () => {
  const national = buildNationalHub()
  assert.ok(national.sections.overviewParagraphs.length >= 3)
  assert.ok(national.sections.serviceCards.length >= 6)
  assert.ok(national.sections.processSteps.length >= 5)
  assert.ok(national.sections.regionCards?.length === 7)
  assert.ok(national.faqs.length >= 6)

  const marmara = buildRegionHub('Marmara')
  const ege = buildRegionHub('Ege')
  assert.notEqual(marmara.sections.overviewParagraphs[0], ege.sections.overviewParagraphs[0])
  assert.ok((marmara.sections.solutionCards?.length ?? 0) >= 6)
  assert.ok(marmara.faqs.length >= 5)

  const balikesir = buildCityHub(getTurkeyCity('balikesir')!)
  const istanbul = buildCityHub(getTurkeyCity('istanbul')!)
  assert.notEqual(balikesir.sections.overviewParagraphs.join(' '), istanbul.sections.overviewParagraphs.join(' '))
  assert.ok(balikesir.h1.includes('Balıkesir'))
  assert.ok((balikesir.sections.locationCards?.length ?? 0) >= 10)
  assert.ok(balikesir.faqs.length >= 6)

  const erdek = buildDistrictHub(getTurkeyCity('balikesir')!, getTurkeyCity('balikesir')!.districts.find((d) => d.slug === 'erdek')!)
  const kadikoy = buildDistrictHub(getTurkeyCity('istanbul')!, getTurkeyCity('istanbul')!.districts.find((d) => d.slug === 'kadikoy')!)
  assert.notEqual(erdek.sections.overviewParagraphs[0], kadikoy.sections.overviewParagraphs[0])
  assert.ok((erdek.sections.digitalizationAreas?.length ?? 0) >= 6)
  assert.ok((erdek.sections.popularServices?.length ?? 0) >= 4)
  assert.ok(erdek.faqs.length >= 6)
})

test('local service pages include detail paragraphs, integrations and expanded FAQs', () => {
  const city = getTurkeyCity('balikesir')!
  const district = city.districts.find((d) => d.slug === 'erdek')!
  const service = getLocalService('ozel-yazilim-gelistirme')!
  const cityModel = buildLocalServicePage(city, service)
  const districtModel = buildLocalServicePage(city, service, district)
  assert.ok(cityModel.detailParagraphs.length >= 3)
  assert.ok(cityModel.integrations.length >= 4)
  assert.ok(cityModel.faqs.length >= 6)
  assert.ok(districtModel.detailParagraphs.length >= 3)
  assert.notEqual(cityModel.detailParagraphs[0], districtModel.detailParagraphs[0])
})

test('local sitemaps contain only valid canonical Turkish URLs and skip English', () => {
  const cityXml = urlset(buildLocalCitySitemapEntries(new Date('2026-08-19T00:00:00.000Z')))
  const serviceXml = urlset(buildLocalServiceSitemapEntries({
    now: new Date('2026-08-19T00:00:00.000Z'),
    excluded: new Set(['/istanbul/kadikoy/ozel-yazilim-gelistirme']),
  }))
  const cityLocs = locUrls(cityXml)
  const serviceLocs = locUrls(serviceXml)
  assert.ok(cityLocs.includes(`${PRODUCTION_SITE_URL}/istanbul`))
  assert.ok(cityLocs.includes(`${PRODUCTION_SITE_URL}/istanbul/kadikoy`))
  assert.ok(cityLocs.includes(`${PRODUCTION_SITE_URL}/hizmet-bolgeleri`))
  assert.ok(serviceLocs.includes(`${PRODUCTION_SITE_URL}/istanbul/ozel-yazilim-gelistirme`))
  assert.ok(serviceLocs.includes(`${PRODUCTION_SITE_URL}/ankara/cankaya/crm-yazilim-cozumleri`))
  assert.equal(serviceLocs.includes(`${PRODUCTION_SITE_URL}/istanbul/kadikoy/ozel-yazilim-gelistirme`), false)
  assert.equal(serviceLocs.includes(`${PRODUCTION_SITE_URL}/istanbul/cankaya/crm-yazilim-cozumleri`), false)
  assert.ok(cityLocs.every((url) => url.startsWith(`${PRODUCTION_SITE_URL}/`) && !url.includes('/tr/')))
  assert.ok(serviceLocs.every((url) => url.startsWith(`${PRODUCTION_SITE_URL}/`) && !url.includes('/tr/')))
  assert.equal(cityXml.includes('localhost'), false)
  const english = urlset(buildEnglishSitemapEntries({ serviceSlugs: ['website-development'] }))
  assert.equal(english.includes('/tr/istanbul'), false)
  assert.equal(english.includes('hizmet-bolgeleri'), false)
})

test('sitemap index lists child sitemaps without exceeding URL limits', () => {
  const now = new Date('2026-08-19T00:00:00.000Z')
  const files = ['tr-pages.xml', 'tr-blog.xml', 'en-pages.xml', 'en-blog.xml', 'local-cities.xml', ...localServiceSitemapNames()]
  const xml = sitemapIndex(files.map((file) => ({ url: childSitemapPath(file), lastModified: now })))
  const locs = locUrls(xml)
  assert.ok(xml.includes('<sitemapindex'))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/sitemaps/tr-pages.xml`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/sitemaps/tr-blog.xml`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/sitemaps/en-pages.xml`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/sitemaps/en-blog.xml`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/sitemaps/local-cities.xml`))
  assert.ok(locs.includes(`${PRODUCTION_SITE_URL}/sitemaps/local-services-1.xml`))
  assert.ok(locs.every((url) => url.startsWith(`${PRODUCTION_SITE_URL}/sitemaps/`)))
  const inventory = getLocalSeoInventory()
  assert.ok(inventory.districtServicePages < 50000)
  assert.ok(buildLocalServiceSitemapEntries().length < 50000)
  const chunk = buildLocalServiceSitemapChunk(0)
  assert.ok(chunk.length > 0)
  assert.ok(chunk.length <= 10000)
  assert.ok(chunk.every((entry) => entry.url.startsWith(PRODUCTION_SITE_URL) && !entry.url.includes('/en/')))
})
