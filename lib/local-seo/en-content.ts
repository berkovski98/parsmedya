import { getServicePageExtras } from '@/lib/service-page-copy'
import {
  getCitiesForRegion,
  getRelatedCities,
  getSiblingDistricts,
  type TurkeyCity,
  type TurkeyDistrict,
  type TurkeyRegion,
} from '@/lib/locations/turkey'
import { getEnglishService, type EnglishService } from '@/lib/services-en'
import { getRelatedLocalServices, getLocalServices, type LocalServiceRecord } from '@/lib/services/service-registry'
import { enServiceSlug, enCityPath, enCityServicePath, enDistrictPath, enDistrictServicePath, enNationalHubPath, enRegionName, enRegionPath, ENGLISH_REGION_NAMES } from '@/lib/local-seo/en-resolve'
import { toEnglishServiceSlug } from '@/lib/i18n'
import { hash, pick, pickMany, clipMeta } from '@/lib/local-seo/text-utils'
import type { LocalSeoFaq } from '@/lib/local-seo/types'
import type { LocalBreadcrumb } from '@/lib/local-seo/content'

export type EnLocalServicePageModel = {
  kind: 'en-city-service' | 'en-district-service'
  canonicalPath: string
  trCanonicalPath: string
  indexable: boolean
  title: string
  description: string
  h1: string
  eyebrow: string
  heroDescription: string
  serviceOverview: string
  localContext: string
  detailParagraphs: string[]
  solutionAreas: { title: string; description: string }[]
  capabilities: { title: string; description: string }[]
  features: { title: string; description: string }[]
  technologies: string[]
  integrations: { title: string; description: string }[]
  process: { title: string; description: string }[]
  useCases: { title: string; description: string }[]
  industries: { title: string; description: string }[]
  why: { title: string; text: string }[]
  faqs: LocalSeoFaq[]
  breadcrumbs: LocalBreadcrumb[]
  districts: { name: string; href: string }[]
  otherDistricts: { name: string; href: string }[]
  relatedServices: { title: string; href: string; description: string }[]
  relatedLocations: { name: string; href: string }[]
  ctaTitle: string
  ctaText: string
  city: TurkeyCity
  district: TurkeyDistrict | null
  service: LocalServiceRecord
  enService: EnglishService
  areaServed: string[]
}

const REGION_ECONOMY: Record<TurkeyRegion, string> = {
  Marmara: 'trade, logistics, manufacturing and corporate services',
  Ege: 'manufacturing, agriculture, tourism and export-oriented businesses',
  Akdeniz: 'tourism, agriculture, retail and regional trade',
  'İç Anadolu': 'public sector, manufacturing, logistics and service industries',
  Karadeniz: 'manufacturing, agriculture, fishing and regional services',
  'Doğu Anadolu': 'public sector, trade, logistics and local services',
  'Güneydoğu Anadolu': 'agriculture, trade, manufacturing and regional services',
}

function enClipMeta(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length >= 140 && normalized.length <= 160) return normalized
  if (normalized.length > 160) {
    const sliced = normalized.slice(0, 159)
    const cut = Math.max(sliced.lastIndexOf(' '), 120)
    return `${sliced.slice(0, cut).replace(/[,:;.-]+$/, '')}.`
  }
  return `${normalized} Plan your project with Pars Medya.`.slice(0, 160)
}

function enServiceTitle(service: LocalServiceRecord) {
  const en = getEnglishService(toEnglishServiceSlug(service.slug))
  return en?.title || service.title
}

function enServiceDesc(service: LocalServiceRecord) {
  const en = getEnglishService(toEnglishServiceSlug(service.slug))
  return en?.description || service.shortDescription
}

function heroDescription(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null, seed: string) {
  const title = enServiceTitle(service).toLowerCase()
  const place = district ? `${district.name} and across ${city.name}` : city.name
  const economy = REGION_ECONOMY[city.region]
  const frames = [
    `We provide ${title} services for businesses operating in ${place}. Projects are scoped around your workflows, users and integrations rather than a fixed feature set.`,
    `${title} for ${economy} in ${place}. We analyse processes, define scope and deliver maintainable systems through a structured remote engagement.`,
    `Scalable, secure ${title} for organizations in ${place}. From discovery to launch, we work as a single accountable team coordinating across ${city.region}.`,
  ]
  return pick(frames, seed, 1)
}

function serviceOverview(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null, seed: string) {
  const en = getEnglishService(toEnglishServiceSlug(service.slug))
  const title = en?.title || service.title
  const place = district ? district.name : city.name
  const frames = [
    `${title} addresses the operational challenges businesses in ${place} face when generic tools no longer scale. We examine current processes, user roles, data flows and external integrations before defining a maintainable architecture.`,
    `Rather than offering a fixed product, we scope ${title.toLowerCase()} projects around what your team actually needs. The result is a system designed for daily operations, not a checklist of features.`,
    `${title} from Pars Medya combines business analysis, product design and engineering in one team. Security, performance and scalability are considered from the start so the product can grow with your organization.`,
  ]
  return pick(frames, seed, 2)
}

function localContext(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null, seed: string) {
  const title = enServiceTitle(service).toLowerCase()
  const districtCount = city.districts.length
  if (district) {
    const frames = [
      `Businesses in ${district.name} typically serve customers across ${city.name} and beyond. We design ${title} systems that handle multi-location workflows, branch permissions and centralized reporting from day one.`,
      `${district.name} is one of ${districtCount} districts in ${city.name}. Our ${title} projects are not limited to a single location; scope is planned to cover branches, field teams and headquarters as needed.`,
    ]
    return pick(frames, seed, 3)
  }
  const frames = [
    `${city.name} is a ${city.metropolitan ? 'metropolitan' : 'provincial'} center in ${enRegionName(city.region)} with ${districtCount} districts. We deliver ${title} projects that scale across locations, departments and user roles without locking teams into rigid templates.`,
    `Operating across ${districtCount} districts, businesses in ${city.name} need systems that connect field, branch and headquarters operations. We plan ${title} scope accordingly.`,
  ]
  return pick(frames, seed, 3)
}

function detailParagraphs(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null, seed: string) {
  const en = getEnglishService(toEnglishServiceSlug(service.slug))
  const title = en?.title || service.title
  const place = district ? district.name : city.name
  const long = en?.longDescription || []
  const frames = [
    long[0] || `${title} is delivered through phased sprints with clear review points. Each iteration is scoped to deliver measurable progress.`,
    `For businesses in ${place}, we assess existing tools, APIs and data before defining what to build. This prevents scope creep and keeps delivery predictable.`,
    long[2] || 'Security, accessibility and performance are architectural decisions made early, not afterthoughts applied before launch.',
    `After launch, monitoring, maintenance and feature additions continue under an agreed support plan. The system evolves with your operations.`,
  ]
  return pickMany(frames.filter(Boolean), seed, 4, 50) as string[]
}

function industries(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null) {
  const place = district ? district.name : city.name
  return [
    { title: 'Retail & Distribution', description: `Multi-channel sales, stock visibility and order management for retail businesses in ${place}.` },
    { title: 'Manufacturing', description: 'Production tracking, quality control and supply-chain coordination systems.' },
    { title: 'Tourism & Hospitality', description: 'Reservation, channel management and guest experience applications.' },
    { title: 'Professional Services', description: 'Project, proposal and client portfolio management for consultancies and agencies.' },
    { title: 'Logistics', description: 'Shipment tracking, warehouse operations and field team coordination.' },
    { title: 'E-Commerce', description: 'Marketplace integration, payment orchestration and scalable storefront platforms.' },
  ]
}

function integrations(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null) {
  return [
    { title: 'Accounting & ERP', description: 'Bidirectional sync with invoicing, ledger and financial reporting systems.' },
    { title: 'Payment providers', description: 'Secure virtual POS, instalment plans and reconciliation workflows.' },
    { title: 'Shipping & logistics', description: 'Carrier APIs, tracking numbers and fulfilment status updates.' },
    { title: 'Email & messaging', description: 'Transactional notifications, verification codes and marketing automation.' },
    { title: 'Marketplace platforms', description: 'Product listing, stock and order synchronization across sales channels.' },
    { title: 'Authentication & SSO', description: 'Secure sign-in, role management and access control integration.' },
  ]
}

function enFaqs(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null): LocalSeoFaq[] {
  const title = enServiceTitle(service).toLowerCase()
  const place = district ? district.name : city.name
  return [
    { question: `Do you provide ${title} services in ${place}?`, answer: `Yes. We deliver projects for businesses across ${place} and ${city.name} through our remote project management model. Discovery meetings can be held online or in person as needed.` },
    { question: 'Can projects be delivered remotely?', answer: `Yes. We coordinate discovery, design, development and testing remotely using shared project boards, sprint demos and written scope agreements.` },
    { question: 'Can you modernize an existing application?', answer: 'Yes. We offer architecture audits, interface modernization, data migration and cloud readiness improvements for existing systems.' },
    { question: 'Do you develop ERP and CRM systems?', answer: 'Yes. We build custom ERP and CRM solutions tailored to your user roles, workflows and reporting requirements.' },
    { question: 'Can you integrate with our existing software?', answer: 'Yes. We assess available APIs and define secure integration approaches during the discovery phase.' },
    { question: 'Do you provide ongoing maintenance after launch?', answer: 'Yes. Monitoring, security updates, bug fixes and feature additions continue under a support agreement.' },
    { question: `How long does a ${title} project take?`, answer: 'Timing depends on scope, integrations and migration needs. After discovery we provide a phased plan with realistic delivery estimates.' },
    { question: `Do you have an office in ${place}?`, answer: `We do not publish branch addresses for individual districts. Projects are coordinated through our standard remote engagement model, with in-person coordination available when required.` },
  ]
}

function enBreadcrumbs(city: TurkeyCity, district: TurkeyDistrict | null, service: LocalServiceRecord): LocalBreadcrumb[] {
  const crumbs: LocalBreadcrumb[] = [
    { name: 'Home', href: '/en' },
    { name: 'Service Areas', href: enNationalHubPath() },
    { name: enRegionName(city.region), href: enRegionPath(city.region) },
    { name: city.name, href: enCityPath(city) },
  ]
  if (district) crumbs.push({ name: district.name, href: enDistrictPath(city, district) })
  crumbs.push({ name: enServiceTitle(service), href: district ? enDistrictServicePath(city, district, service) : enCityServicePath(city, service) })
  return crumbs
}

export function buildEnLocalServicePage(
  city: TurkeyCity,
  service: LocalServiceRecord,
  district: TurkeyDistrict | null = null,
): EnLocalServicePageModel {
  const seed = `en:${city.slug}:${district?.slug || ''}:${service.slug}`
  const en = getEnglishService(toEnglishServiceSlug(service.slug))!
  const place = district ? district.name : city.name
  const kind = district ? 'en-district-service' : 'en-city-service'
  const canonicalPath = district
    ? enDistrictServicePath(city, district, service)
    : enCityServicePath(city, service)
  const trCanonicalPath = district
    ? `/${city.slug}/${district.slug}/${service.slug}`
    : `/${city.slug}/${service.slug}`
  const title = `${enServiceTitle(service)} in ${place} | Pars Medya`
  const description = enClipMeta(`${enServiceTitle(service)} for businesses in ${place} and ${city.name}. Build scalable systems with Pars Medya.`)
  const h1 = `${enServiceTitle(service)} in ${place}`

  const extras = getServicePageExtras(service.slug)
  const districtCards = district ? [] : city.districts.map((d) => ({
    name: d.name,
    href: enDistrictServicePath(city, d, service),
  }))
  const otherDistricts = district ? getSiblingDistricts(city, district.slug, 10).map((d) => ({
    name: d.name,
    href: enDistrictServicePath(city, d, service),
  })) : []

  const relatedServices = getRelatedLocalServices(service.slug, 4).map((s) => ({
    title: `${enServiceTitle(s)} in ${place}`,
    href: district ? enDistrictServicePath(city, district, s) : enCityServicePath(city, s),
    description: enServiceDesc(s),
  }))

  const relatedLocations = district
    ? getSiblingDistricts(city, district.slug, 8).map((d) => ({ name: d.name, href: enDistrictServicePath(city, d, service) }))
    : getRelatedCities(city, 6).map((c) => ({ name: c.name, href: enCityServicePath(c, service) }))

  return {
    kind,
    canonicalPath,
    trCanonicalPath,
    indexable: true,
    title,
    description,
    h1,
    eyebrow: district
      ? `${city.name.toUpperCase()} • ${district.name.toUpperCase()} • ${enServiceTitle(service).toUpperCase()}`
      : `${city.name.toUpperCase()} • ${enServiceTitle(service).toUpperCase()}`,
    heroDescription: heroDescription(service, city, district, seed),
    serviceOverview: serviceOverview(service, city, district, seed),
    localContext: localContext(service, city, district, seed),
    detailParagraphs: detailParagraphs(service, city, district, seed),
    solutionAreas: (en.useCases || en.features).slice(0, 6).map((item) => ({
      title: item.title,
      description: item.description,
    })),
    capabilities: extras.architecture.layers.map((layer) => ({
      title: layer.title.en || layer.title.tr,
      description: `The ${(layer.title.en || layer.title.tr).toLowerCase()} layer is delivered as part of the ${enServiceTitle(service).toLowerCase()} scope for ${place}.`,
    })),
    features: en.features.slice(0, 6),
    technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    integrations: integrations(service, city, district),
    process: extras.process.map((step) => ({
      title: step.title.en || step.title.tr,
      description: step.text.en || step.text.tr,
    })),
    useCases: (en.useCases || []).slice(0, 6),
    industries: industries(service, city, district),
    why: extras.why.map((item) => ({ title: item.title.en || item.title.tr, text: item.text.en || item.text.tr })),
    faqs: enFaqs(service, city, district),
    breadcrumbs: enBreadcrumbs(city, district, service),
    districts: districtCards,
    otherDistricts,
    relatedServices,
    relatedLocations,
    ctaTitle: 'Plan Your Project With Us',
    ctaText: `Discuss your ${enServiceTitle(service).toLowerCase()} requirements with the Pars Medya team. We work with businesses across ${place} and Turkey.`,
    city,
    district,
    service,
    enService: en,
    areaServed: district ? [district.name, city.name] : [city.name],
  }
}

// Hub models
export type EnLocalHubModel = {
  kind: 'en-national-hub' | 'en-region-hub' | 'en-city-hub' | 'en-district-hub'
  canonicalPath: string
  trCanonicalPath: string
  title: string
  description: string
  h1: string
  intro: string
  breadcrumbs: LocalBreadcrumb[]
  faqs: LocalSeoFaq[]
}

export function buildEnNationalHub(): EnLocalHubModel {
  return {
    kind: 'en-national-hub',
    canonicalPath: enNationalHubPath(),
    trCanonicalPath: '/hizmet-bolgeleri',
    title: 'Software Development & Digital Services Across Turkey | Pars Medya',
    description: enClipMeta('Custom software, web, CRM, ERP, e-commerce and digital solutions for businesses across all 81 provinces of Turkey. Plan your project with Pars Medya.'),
    h1: 'Software & Digital Solutions Across Turkey',
    intro: 'Pars Medya delivers custom software, enterprise platforms, web applications and digital growth projects for businesses across Turkey. Our remote project management model ensures consistent quality regardless of location.',
    breadcrumbs: [
      { name: 'Home', href: '/en' },
      { name: 'Service Areas', href: enNationalHubPath() },
    ],
    faqs: [
      { question: 'Do you provide services across all of Turkey?', answer: 'Yes. We publish service area pages for all 81 provinces and their official districts. Project coordination is location-independent.' },
      { question: 'Do you have offices in every city?', answer: 'No. Service area pages indicate coverage, not physical offices. Projects are delivered through our standard remote engagement model.' },
      { question: 'Can projects be delivered remotely?', answer: 'Yes. Discovery, design, development and testing are coordinated remotely with sprint demos and written scope agreements.' },
      { question: 'What types of software do you develop?', answer: 'Custom software, CRM, ERP, web platforms, e-commerce, mobile apps, API integrations, SaaS products and AI-powered solutions.' },
      { question: 'How long does a typical project take?', answer: 'Timing depends on scope and complexity. After discovery we provide a phased plan with realistic delivery estimates.' },
      { question: 'Do you offer support after launch?', answer: 'Yes. Maintenance, security updates and feature additions continue under a support agreement.' },
    ],
  }
}

export function buildEnRegionHub(region: TurkeyRegion): EnLocalHubModel {
  const cities = getCitiesForRegion(region)
  const name = enRegionName(region)
  return {
    kind: 'en-region-hub',
    canonicalPath: enRegionPath(region),
    trCanonicalPath: `/hizmet-bolgeleri/${region === 'Marmara' ? 'marmara' : region === 'Ege' ? 'ege' : region === 'Akdeniz' ? 'akdeniz' : region === 'İç Anadolu' ? 'ic-anadolu' : region === 'Karadeniz' ? 'karadeniz' : region === 'Doğu Anadolu' ? 'dogu-anadolu' : 'guneydogu-anadolu'}`,
    title: `${name} Software Development & Digital Services | Pars Medya`,
    description: enClipMeta(`Software development and digital services for ${cities.length} provinces in the ${name} region. Web, CRM, ERP and enterprise solutions.`),
    h1: `${name} Software Development & Digital Services`,
    intro: `We deliver software and digital solutions for businesses across the ${name} region of Turkey. ${cities.length} provinces are covered through our remote project coordination model.`,
    breadcrumbs: [
      { name: 'Home', href: '/en' },
      { name: 'Service Areas', href: enNationalHubPath() },
      { name: name, href: enRegionPath(region) },
    ],
    faqs: [
      { question: `Which provinces do you cover in ${name}?`, answer: `We publish service area pages for all ${cities.length} provinces in ${name} and their official districts.` },
      { question: `Do you work with businesses outside ${name}?`, answer: 'Yes. Region pages show coverage scope; project coordination covers all of Turkey.' },
      { question: `Do you send teams to ${name}?`, answer: 'Our standard model is remote. In-person coordination can be arranged when the project scope requires it.' },
      { question: 'Which services are available?', answer: 'Custom software, CRM, ERP, web platforms, e-commerce, mobile apps, API integrations and digital marketing services are all available.' },
      { question: 'How long do projects take?', answer: 'Timing depends on scope. After discovery we provide a phased delivery plan.' },
    ],
  }
}

export function buildEnCityHub(city: TurkeyCity): EnLocalHubModel {
  const districtCount = city.districts.length
  return {
    kind: 'en-city-hub',
    canonicalPath: enCityPath(city),
    trCanonicalPath: `/${city.slug}`,
    title: `Software Development & Digital Solutions in ${city.name} | Pars Medya`,
    description: enClipMeta(`Software, web, CRM, ERP and digital solutions for businesses in ${city.name}. ${districtCount} districts covered.`),
    h1: `Software Development & Digital Solutions in ${city.name}`,
    intro: `We deliver software and digital solutions for businesses operating across ${city.name} and its ${districtCount} districts. Projects are coordinated remotely with in-person support available when needed.`,
    breadcrumbs: [
      { name: 'Home', href: '/en' },
      { name: 'Service Areas', href: enNationalHubPath() },
      { name: enRegionName(city.region), href: enRegionPath(city.region) },
      { name: city.name, href: enCityPath(city) },
    ],
    faqs: [
      { question: `Which districts do you cover in ${city.name}?`, answer: `We publish service pages for all ${districtCount} districts in ${city.name}.` },
      { question: `Do you have an office in ${city.name}?`, answer: `We do not publish branch addresses for individual provinces. Projects are delivered through our remote engagement model.` },
      { question: `What software services are available in ${city.name}?`, answer: 'Custom software, CRM, ERP, web platforms, e-commerce, mobile apps, API integrations and digital marketing.' },
      { question: 'Can you integrate with our existing systems?', answer: 'Yes. We assess APIs and define integration approaches during discovery.' },
      { question: 'Do you offer post-launch support?', answer: 'Yes. Maintenance and feature development continue under an agreed support plan.' },
      { question: 'How do I get a proposal?', answer: 'A short discovery call is followed by a written scope document with phases and timeline estimates.' },
    ],
  }
}

export function buildEnDistrictHub(city: TurkeyCity, district: TurkeyDistrict): EnLocalHubModel {
  return {
    kind: 'en-district-hub',
    canonicalPath: enDistrictPath(city, district),
    trCanonicalPath: `/${city.slug}/${district.slug}`,
    title: `Software Development & Digital Solutions in ${district.name} | Pars Medya`,
    description: enClipMeta(`Software and digital solutions for businesses in ${district.name}, ${city.name}. Web, custom software, CRM, ERP and integrations.`),
    h1: `Software Development & Digital Solutions in ${district.name}`,
    intro: `We provide software development and digital services for businesses in ${district.name} and across ${city.name}. Solutions are not limited to a single district; scope can cover branches, teams and operations across the province.`,
    breadcrumbs: [
      { name: 'Home', href: '/en' },
      { name: 'Service Areas', href: enNationalHubPath() },
      { name: enRegionName(city.region), href: enRegionPath(city.region) },
      { name: city.name, href: enCityPath(city) },
      { name: district.name, href: enDistrictPath(city, district) },
    ],
    faqs: [
      { question: `Do you provide services in ${district.name}?`, answer: `Yes. We deliver projects for businesses in ${district.name} and across ${city.name} through our remote coordination model.` },
      { question: 'What can I find on this page?', answer: `Links to all active service pages available for ${district.name}, including web, custom software, CRM, ERP and e-commerce.` },
      { question: `Do you only work with businesses in ${district.name}?`, answer: `No. ${district.name} is a service area page. We work with businesses across ${city.name} and Turkey.` },
      { question: 'Can you modernize existing software?', answer: 'Yes. Architecture audits, interface renewal, data migration and cloud readiness improvements are available.' },
      { question: 'Do you integrate with third-party systems?', answer: 'Yes. API-based integrations with accounting, ERP, payment and logistics providers are part of our standard scope.' },
      { question: 'Is post-launch support available?', answer: 'Yes. Maintenance, security patches and new feature development continue under a support agreement.' },
    ],
  }
}
