import assert from 'node:assert/strict'
import { test } from 'node:test'
import { blogAuthorNode, blogShareImage } from '../lib/blog-seo'
import { getTurkeyCities, getTurkeyCity } from '../lib/locations/turkey'
import { buildCityHub, buildDistrictHub, buildLocalServicePage, buildRegionHub } from '../lib/local-seo/content'
import { buildEnLocalServicePage } from '../lib/local-seo/en-content'
import { buildEnLocalCitySitemapEntries, buildEnLocalServiceSitemapEntries, enLocalServiceSitemapNames } from '../lib/local-seo/en-sitemap'
import { cityHubFaqs, cityHubSections, districtHubSections, regionHubSections } from '../lib/local-seo/hub-content'
import { isLocalPageIndexable, LOCAL_INDEX_POLICY, localRobots } from '../lib/local-seo/index-policy'
import { createLocalPageMetadata } from '../lib/local-seo/metadata'
import { buildLocalCitySitemapEntries, buildLocalServiceSitemapEntries, iterateAllLocalServicePaths, localServiceSitemapNames } from '../lib/local-seo/sitemap'
import { clipMeta } from '../lib/local-seo/text-utils'
import { organizationNode, ORG_ID, professionalServiceNode, websiteNode } from '../lib/schema/organization'
import { buildServicePageModel, overviewHeading, serviceJsonLd } from '../lib/service-page'
import { relatedPostsForService } from '../lib/service-links'
import { getService, services } from '../lib/services'
import { englishServices } from '../lib/services-en'
import { getLocalService, getLocalServices } from '../lib/services/service-registry'
import { createPageMetadata, DEFAULT_SOCIAL_IMAGE } from '../lib/seo'
import { inPlace, locativeSuffix, lowerKeepAcronyms, ofPlace } from '../lib/turkish'

test('locative suffix follows vowel harmony and consonant hardening', () => {
  const cases: Array<[string, string]> = [
    ['İstanbul', 'da'], ['Ankara', 'da'], ['İzmir', 'de'], ['Kadıköy', 'de'], ['Çankaya', 'da'],
    ['Tokat', 'ta'], ['Muş', 'ta'], ['Antep', 'te'], ['Of', 'ta'], ['Kemah', 'ta'], ['Erdek', 'te'],
    ['Ege', 'de'], ['Marmara', 'da'], ['Akdeniz', 'de'], ['Doğu Anadolu', 'da'], ['19 Mayıs', 'ta'],
    ['Şişli', 'de'], ['Üsküdar', 'da'], ['Bursa', 'da'], ['Kocaeli', 'de'],
  ]
  for (const [name, suffix] of cases) assert.equal(locativeSuffix(name), suffix, name)
  assert.equal(inPlace('Ankara'), "Ankara'da")
  assert.equal(inPlace('Çankaya'), "Çankaya'da")
  assert.equal(ofPlace('Kadıköy'), "Kadıköy'deki")
  assert.equal(ofPlace('Tokat'), "Tokat'taki")
})

test('generated hub copy no longer contains broken suffixes', () => {
  const broken = /(Ankara'de|Çankaya'te|İstanbul'de|Kadıköy'te|Ege'daki|İzmir'da|Bursa'de)/
  const istanbul = getTurkeyCity('istanbul')!
  const ankara = getTurkeyCity('ankara')!
  const text = JSON.stringify([
    cityHubSections(istanbul), cityHubSections(ankara), cityHubFaqs(ankara),
    districtHubSections(ankara, ankara.districts.find((item) => item.slug === 'cankaya')!),
    districtHubSections(istanbul, istanbul.districts.find((item) => item.slug === 'kadikoy')!),
    regionHubSections('Ege'), regionHubSections('Marmara'),
  ])
  assert.equal(broken.test(text), false)
  assert.ok(text.includes("İstanbul'da Yazılım Hizmetleri"))
  assert.ok(text.includes("Çankaya'da Yazılım ve Dijital Hizmetler"))
  assert.ok(text.includes("Ege'deki İşletmeler İçin Çözümler"))
})

test('acronyms survive lowercasing inside sentences', () => {
  assert.equal(lowerKeepAcronyms('CRM Yazılım Çözümleri'), 'CRM yazılım çözümleri')
  assert.equal(lowerKeepAcronyms('ERP Yazılım Çözümleri'), 'ERP yazılım çözümleri')
  assert.equal(lowerKeepAcronyms('SaaS Yazılım Geliştirme'), 'SaaS yazılım geliştirme')
  assert.equal(lowerKeepAcronyms('API ve Sistem Entegrasyonları'), 'API ve sistem entegrasyonları')
  assert.equal(lowerKeepAcronyms('B2B ve B2C Platform Geliştirme'), 'B2B ve B2C platform geliştirme')
  assert.equal(lowerKeepAcronyms('UI/UX Tasarım'), 'UI/UX tasarım')
  assert.equal(lowerKeepAcronyms('E-Ticaret Yazılımı'), 'e-ticaret yazılımı')
  assert.equal(lowerKeepAcronyms('İş Süreçleri Otomasyonu'), 'iş süreçleri otomasyonu')
  const model = buildLocalServicePage(getTurkeyCity('izmir')!, getLocalService('crm-yazilim-cozumleri')!)
  assert.equal(/\bcrm\b/.test(`${model.description} ${model.heroDescription} ${model.serviceSummary}`), false)
})

test('clipMeta never repeats the closing sentence and stays within 160 characters', () => {
  const long = 'Türkiye geneli yazılım ve dijital hizmetler. 81 il için web, özel yazılım, CRM, ERP, e-ticaret ve entegrasyon çözümlerini uzaktan proje yönetimiyle Pars Medya ile planlayın.'
  for (const text of [long, `${'kelime '.repeat(40)}son.`, 'Kısa açıklama', 'İstanbul yazılım, web, CRM, ERP, e-ticaret ve dijital büyüme. 39 ilçedeki işletmeler için özel çözümleri Pars Medya ile planlayın.']) {
    const result = clipMeta(text)
    assert.ok(result.length <= 160, `${result.length}: ${result}`)
    assert.ok((result.match(/Pars Medya ile planlayın\./g) || []).length <= 1, result)
    assert.ok((result.match(/Pars Medya/g) || []).length <= 2, result)
  }
  assert.equal(clipMeta('Kısa açıklama'), 'Kısa açıklama. Pars Medya ile kapsamı birlikte netleştirin.')
  assert.ok(clipMeta('Short English text', 'en').endsWith('Plan your project with Pars Medya.'))
  const cities = getTurkeyCities()
  for (const city of cities) {
    const hub = buildCityHub(city)
    assert.ok(hub.description.length <= 160, hub.description)
    assert.equal((hub.description.match(/planlayın\./g) || []).length <= 1, true, hub.description)
  }
  for (const region of ['Marmara', 'Ege', 'Güneydoğu Anadolu'] as const) assert.ok(buildRegionHub(region).description.length <= 160)
})

test('index policy keeps hubs and priority city pages indexed, everything else noindex,follow', () => {
  assert.equal(isLocalPageIndexable({ kind: 'national-hub' }), true)
  assert.equal(isLocalPageIndexable({ kind: 'region-hub' }), true)
  assert.equal(isLocalPageIndexable({ kind: 'city-hub', citySlug: 'tokat' }), true)
  assert.equal(isLocalPageIndexable({ kind: 'district-hub', citySlug: 'istanbul' }), true)
  assert.equal(isLocalPageIndexable({ kind: 'district-hub', citySlug: 'tokat' }), false)
  assert.equal(isLocalPageIndexable({ kind: 'city-service', citySlug: 'istanbul', serviceSlug: 'crm-yazilim-cozumleri' }), true)
  assert.equal(isLocalPageIndexable({ kind: 'city-service', citySlug: 'tokat', serviceSlug: 'crm-yazilim-cozumleri' }), false)
  assert.equal(isLocalPageIndexable({ kind: 'district-service', citySlug: 'istanbul', serviceSlug: 'crm-yazilim-cozumleri' }), false)
  const copy = { is_indexable: true, content_json: { intro: 'Kadıköy için özgün metin' }, faq_json: null }
  assert.equal(isLocalPageIndexable({ kind: 'district-service', citySlug: 'istanbul', serviceSlug: 'crm-yazilim-cozumleri', override: copy }), true)
  const off = { is_indexable: false, content_json: { intro: 'metin' }, faq_json: null }
  assert.equal(isLocalPageIndexable({ kind: 'city-service', citySlug: 'istanbul', serviceSlug: 'crm-yazilim-cozumleri', override: off }), false)
  assert.deepEqual(localRobots(false), { index: false, follow: true })
  const metadata = createLocalPageMetadata({ title: 't', description: 'd', canonical: '/tokat/crm-yazilim-cozumleri', indexable: false })
  assert.deepEqual(metadata.robots, { index: false, follow: true })
  assert.equal((metadata.alternates?.languages as Record<string, string>).en, 'https://parsmedya.net/en/service-areas/black-sea/tokat/crm-software-solutions')
})

test('sitemaps follow the same policy in both languages and every listed URL is a known local URL', () => {
  const services = getLocalServices().length
  const priority = LOCAL_INDEX_POLICY.priorityCities.length
  const trServices = buildLocalServiceSitemapEntries()
  const enServices = buildEnLocalServiceSitemapEntries()
  assert.equal(trServices.length, priority * services)
  assert.equal(enServices.length, trServices.length)
  const priorityDistricts = LOCAL_INDEX_POLICY.priorityCities.reduce((sum, slug) => sum + (getTurkeyCity(slug)?.districts.length || 0), 0)
  assert.equal(buildLocalCitySitemapEntries().length, 1 + 7 + 81 + priorityDistricts)
  assert.equal(buildEnLocalCitySitemapEntries().length, 1 + 7 + 81 + priorityDistricts)
  assert.deepEqual(localServiceSitemapNames(), ['local-services-1.xml'])
  assert.deepEqual(enLocalServiceSitemapNames(), ['en-local-services-1.xml'])
  const all = new Set([...iterateAllLocalServicePaths()].map((item) => `https://parsmedya.net${item.path}`))
  assert.ok(trServices.every((entry) => all.has(entry.url)))
  assert.ok(trServices.every((entry) => entry.lastModified === '2026-10-17T00:00:00.000Z'))
})

test('English local pages mirror the Turkish index decision and override', () => {
  const tokat = getTurkeyCity('tokat')!
  const istanbul = getTurkeyCity('istanbul')!
  const crm = getLocalService('crm-yazilim-cozumleri')!
  assert.equal(buildEnLocalServicePage(tokat, crm).indexable, false)
  assert.equal(buildEnLocalServicePage(istanbul, crm).indexable, true)
  assert.equal(buildEnLocalServicePage(istanbul, crm, null, { is_indexable: false, content_json: null, faq_json: null }).indexable, false)
  const page = buildEnLocalServicePage(istanbul, crm)
  assert.equal(page.description.includes('İstanbul and İstanbul'), false)
  assert.ok(page.description.length <= 160)
  assert.equal(buildDistrictHub(tokat, tokat.districts[0]!).indexable, false)
})

test('English service pages carry no Turkish package cards and have service-specific FAQs', () => {
  const firstQuestions = new Set<string>()
  for (const service of englishServices) {
    assert.deepEqual(service.packages, [])
    assert.ok(service.faqs.length >= 4, service.slug)
    assert.equal(JSON.stringify(service).includes('Talebe göre'), false, service.slug)
    firstQuestions.add(service.faqs[0]!.question)
    assert.notEqual(service.longDescription?.[1], 'We examine users, roles, data and integrations before defining a maintainable solution. The result is designed for everyday operations rather than a generic feature checklist.', service.slug)
  }
  assert.equal(firstQuestions.size, englishServices.length)
  assert.equal(overviewHeading('CRM Software Solutions', 'en'), 'What are CRM Software Solutions?')
  assert.equal(overviewHeading('Website Development', 'en'), 'What is Website Development?')
  assert.equal(overviewHeading('CRM Yazılım Çözümleri', 'tr'), 'CRM Yazılım Çözümleri nedir?')
})

test('service JSON-LD links to the Organization and includes the visible FAQ', () => {
  const service = getService('crm-yazilim-cozumleri')!
  const jsonLd = serviceJsonLd(service, buildServicePageModel(service, 'tr'))
  const graph = jsonLd['@graph']
  const types = graph.map((node) => node['@type'])
  assert.deepEqual(types, ['WebPage', 'BreadcrumbList', 'Service', 'FAQPage'])
  const serviceNode = graph.find((node) => node['@type'] === 'Service')!
  assert.deepEqual(serviceNode.provider, { '@id': ORG_ID })
  assert.equal(serviceNode['@id'], 'https://parsmedya.net/hizmetler/crm-yazilim-cozumleri#service')
  const faq = graph.find((node) => node['@type'] === 'FAQPage')! as { mainEntity: unknown[] }
  assert.equal(faq.mainEntity.length, service.faqs.length)
})

test('legacy services have SEO title and description within limits', () => {
  for (const service of services) {
    const title = service.seoTitle ?? `${service.title} | Pars Medya`
    const description = service.seoDescription ?? service.description
    assert.ok(title.length <= 60, `${service.slug}: ${title.length}`)
    assert.ok(description.length <= 160, `${service.slug}: ${description.length}`)
  }
  for (const slug of ['web-sitesi-gelistirme', 'mobil-uygulama', 'e-ticaret-cozumleri', 'seo-dijital-pazarlama', 'ui-ux-tasarim', 'yazilim-danismanligi']) {
    const service = getService(slug)!
    assert.ok(service.seoTitle && service.seoDescription && service.relatedSlugs?.length, slug)
    assert.ok(service.seoDescription.length >= 140, slug)
  }
  assert.ok(getService('web-yazilim-gelistirme')!.relatedSlugs!.includes('web-sitesi-gelistirme'))
  assert.ok(getService('e-ticaret-yazilimi')!.relatedSlugs!.includes('e-ticaret-cozumleri'))
  assert.ok(getService('mobil-uygulama-gelistirme')!.relatedSlugs!.includes('mobil-uygulama'))
})

test('organization, website and contact business nodes share one NAP', () => {
  const org = organizationNode()
  assert.equal(org['@id'], 'https://parsmedya.net/#organization')
  assert.equal(org.telephone, '+90 539 840 18 98')
  assert.equal(org.email, 'info@parsmedya.net')
  assert.deepEqual(org.contactPoint.map((point) => point.telephone), ['+90 539 840 18 98', '+90 212 963 77 77'])
  assert.equal(org.address.addressLocality, 'İstanbul')
  assert.equal('sameAs' in org, false)
  assert.equal(JSON.stringify(websiteNode('tr')).includes('SearchAction'), false)
  const business = professionalServiceNode('tr')
  assert.equal(business.telephone, org.telephone)
  assert.deepEqual(business.parentOrganization, { '@id': ORG_ID })
  assert.equal('streetAddress' in business.address, false)
})

test('page metadata offers hreflang only for real counterparts and a 1200×630 share image', () => {
  const withEn = createPageMetadata({ title: 'T', description: 'D', canonical: '/blog/x', tr: '/blog/x', en: '/en/blog/y', locale: 'tr' })
  const withoutEn = createPageMetadata({ title: 'T', description: 'D', canonical: '/blog/x', tr: '/blog/x', en: null, locale: 'tr' })
  assert.ok((withEn.alternates?.languages as Record<string, string>).en)
  assert.equal((withoutEn.alternates?.languages as Record<string, string>).en, undefined)
  const og = withEn.openGraph as { siteName: string; images: Array<{ width?: number; height?: number }> }
  assert.equal(og.siteName, 'Pars Medya')
  assert.deepEqual([og.images[0]!.width, og.images[0]!.height], [1200, 630])
  const noindex = createPageMetadata({ title: 'T', description: 'D', canonical: '/en/blog', tr: '/blog', en: '/en/blog', locale: 'en', index: false })
  assert.deepEqual(noindex.robots, { index: false, follow: true })
})

test('blog helpers: team author maps to the Organization, missing cover uses the share card', () => {
  assert.deepEqual(blogAuthorNode('Pars Medya Ekibi'), { '@id': ORG_ID })
  assert.deepEqual(blogAuthorNode('Ayşe Yılmaz'), { '@type': 'Person', name: 'Ayşe Yılmaz' })
  assert.equal(blogShareImage(null), DEFAULT_SOCIAL_IMAGE)
  assert.equal(blogShareImage('/uploads/cover.jpg'), '/uploads/cover.jpg')
  const posts = [{ slug: 'crm-yazilimi-nedir' }, { slug: 'google-maps-kayit-nasil-yapilir' }, { slug: 'erp-nedir' }]
  assert.deepEqual(relatedPostsForService('crm-yazilim-cozumleri', posts).map((post) => post.slug), ['crm-yazilimi-nedir'])
})
