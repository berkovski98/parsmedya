import { getCitiesForRegion, TURKEY_REGION_ORDER, type TurkeyCity, type TurkeyDistrict, type TurkeyRegion } from '@/lib/locations/turkey'
import { enCityPath, enDistrictPath, enNationalHubPath, enRegionName, enRegionPath } from '@/lib/local-seo/en-resolve'
import { getLocalServices } from '@/lib/services/service-registry'
import { getEnglishService } from '@/lib/services-en'
import { toEnglishServiceSlug } from '@/lib/i18n'
import { pickMany } from '@/lib/local-seo/text-utils'
import type { HubContentCard, HubProcessStep, HubSections, HubServiceCard } from '@/lib/local-seo/hub-content'

const SERVICE_SLUGS_EN = [
  'custom-software-development',
  'crm-software-solutions',
  'erp-software-solutions',
  'enterprise-web-applications',
  'e-commerce-development',
  'mobile-app-development',
  'api-system-integrations',
  'ai-powered-software-solutions',
] as const

const DISTRICT_POPULAR_EN = [
  'web-software-development',
  'custom-software-development',
  'crm-software-solutions',
  'erp-software-solutions',
  'e-commerce-development',
  'seo-digital-marketing',
] as const

const WHY_CARDS: HubContentCard[] = [
  { title: 'End-to-end delivery', description: 'Analysis, design, development, testing and launch managed by one accountable team.' },
  { title: 'Scalable architecture', description: 'Modular systems that grow with users, locations and integrations without re-platforming.' },
  { title: 'Security by design', description: 'Permissions, data isolation and update discipline planned from the project start.' },
  { title: 'Integration capability', description: 'Accounting, ERP, payment, shipping and third-party APIs connected through a managed integration layer.' },
  { title: 'Continuous improvement', description: 'Post-launch maintenance, feature additions and performance improvements managed transparently.' },
  { title: 'Location-independent support', description: 'The same project management model applied regardless of where your team operates in Turkey.' },
]

const PROCESS_STEPS: HubProcessStep[] = [
  { title: 'Discovery', description: 'We map existing processes, user roles, integration points and priorities together.' },
  { title: 'Technical Planning', description: 'Architecture, data model, module scope and delivery phases are defined in a clear roadmap.' },
  { title: 'Design', description: 'User flows, interfaces and experience design aligned with business objectives.' },
  { title: 'Development', description: 'Agile sprints with intermediate demos and feedback cycles.' },
  { title: 'Testing', description: 'Functional, integration and performance testing with realistic data scenarios.' },
  { title: 'Launch & Support', description: 'Deployment, training, monitoring and ongoing maintenance under an agreed plan.' },
]

const SOLUTION_CARDS: HubContentCard[] = [
  { title: 'Custom Software', description: 'Purpose-built modules, permissions and reporting layers for your operations.' },
  { title: 'ERP Systems', description: 'Inventory, purchasing, production and finance connected through shared data.' },
  { title: 'CRM Solutions', description: 'Customer records, proposals, sales pipeline and team coordination in one system.' },
  { title: 'E-Commerce', description: 'Payment, shipping and marketplace integrations for end-to-end online sales.' },
  { title: 'API Integrations', description: 'Secure, automated data flow between accounting, logistics and external services.' },
  { title: 'Web Platforms', description: 'Corporate sites, customer portals and management panels.' },
  { title: 'Mobile Applications', description: 'iOS and Android apps for field teams, dealers and end users.' },
  { title: 'Digital Marketing', description: 'SEO, content strategy and conversion-focused growth infrastructure.' },
]

const USE_CASES: HubContentCard[] = [
  { title: 'Dealer management', description: 'Applications, stock visibility, order approval and performance reporting.' },
  { title: 'Order systems', description: 'End-to-end order lifecycle tracking from quote to shipment.' },
  { title: 'Production tracking', description: 'Work orders, materials and quality control monitored in real time.' },
  { title: 'Customer portals', description: 'Order history, invoices, support tickets and self-service operations.' },
  { title: 'B2B / B2C platforms', description: 'Segment-based catalogues, pricing rules and payment workflows.' },
  { title: 'Dashboard & reporting', description: 'Management KPIs, role-based views and exportable analytics.' },
  { title: 'Process automation', description: 'Approval chains, notifications and repetitive task elimination.' },
]

const INDUSTRIES: HubContentCard[] = [
  { title: 'Retail', description: 'Stock management, POS integration and multi-channel sales coordination.' },
  { title: 'Services', description: 'Appointment, proposal and client relationship management.' },
  { title: 'Tourism', description: 'Reservation, channel management and guest experience applications.' },
  { title: 'E-Commerce', description: 'Marketplace, shipping and payment infrastructure integrations.' },
  { title: 'Logistics', description: 'Shipment tracking, warehouse management and field operations.' },
  { title: 'Manufacturing', description: 'Work orders, quality control and supply chain digitalization.' },
  { title: 'Consulting', description: 'Project, proposal and client portfolio management.' },
  { title: 'Real Estate', description: 'Portfolio, appointment and client communication systems.' },
]

const DIGITALIZATION: HubContentCard[] = [
  { title: 'Customer management', description: 'Unified customer records, interaction history and segmentation.' },
  { title: 'Inventory tracking', description: 'Warehouse, branch and field stock synchronized in real time.' },
  { title: 'Proposal workflows', description: 'Template-based proposals, approvals and revision tracking.' },
  { title: 'Order management', description: 'Channel-agnostic order collection and status notifications.' },
  { title: 'Reservations', description: 'Calendar, capacity and payment-integrated booking modules.' },
  { title: 'Reporting', description: 'Management dashboards and exportable analysis outputs.' },
  { title: 'Automation', description: 'Recurring tasks, notifications and approval chains.' },
  { title: 'Payment integration', description: 'Virtual POS, bank transfer tracking and instalment scenarios.' },
]

function enServiceCard(enSlug: string, hrefPrefix: string): HubServiceCard | null {
  const en = getEnglishService(enSlug)
  if (!en) return null
  return { slug: enSlug, title: en.title, description: en.description, href: `${hrefPrefix}/${enSlug}` }
}

function enServiceCards(slugs: readonly string[], hrefPrefix: string) {
  return slugs.map((slug) => enServiceCard(slug, hrefPrefix)).filter((item): item is HubServiceCard => item !== null)
}

export function enNationalHubSections(): HubSections {
  return {
    overviewTitle: 'Software Development & Digital Solutions Across Turkey',
    overviewParagraphs: [
      'Pars Medya delivers custom software, web applications, enterprise platforms and digital growth projects for businesses operating anywhere in Turkey. Our location-independent project management model ensures the same quality of discovery, design and delivery regardless of where your team is based.',
      'We scope projects around your actual workflows rather than selling pre-built templates. Custom software, CRM, ERP, e-commerce, mobile applications, API integrations and SaaS platforms are all delivered through phased sprints with clear review points.',
      'Post-launch, we provide maintenance, security updates, performance improvements and new feature development under transparent support agreements. The service area pages below connect you to region, province and district-level pages with relevant internal links.',
    ],
    serviceCards: enServiceCards(SERVICE_SLUGS_EN, '/en/services'),
    processTitle: 'How We Deliver Projects Across Turkey',
    processSteps: PROCESS_STEPS,
    whyTitle: 'Why Work With Pars Medya?',
    whyCards: WHY_CARDS,
    regionCards: TURKEY_REGION_ORDER.map((region) => ({
      name: enRegionName(region),
      description: `Software and digital services for ${getCitiesForRegion(region).length} provinces in ${enRegionName(region)}.`,
      cityCount: getCitiesForRegion(region).length,
      href: enRegionPath(region),
    })),
  }
}

export function enRegionHubSections(region: TurkeyRegion): HubSections {
  const cities = getCitiesForRegion(region)
  const name = enRegionName(region)
  const seed = `en:${region}`
  return {
    overviewTitle: `Software Development in the ${name} Region`,
    overviewParagraphs: [
      `We deliver software and digital solutions for businesses across the ${name} region's ${cities.length} provinces. Projects cover custom software, CRM, ERP, web platforms, e-commerce and integration needs.`,
      `Our remote engagement model means project quality is consistent across all provinces. Discovery, design and development are coordinated through shared boards, sprint demos and written scope agreements.`,
      `The province links below connect to city and district-level service pages with detailed content for each location.`,
    ],
    serviceCards: enServiceCards(SERVICE_SLUGS_EN.slice(0, 6), '/en/services'),
    processTitle: 'Our Development Process',
    processSteps: pickMany(PROCESS_STEPS, seed, 5, 0),
    solutionTitle: `Solutions for ${name} Businesses`,
    solutionCards: pickMany(SOLUTION_CARDS, seed, 8, 10),
    useCaseTitle: `Projects We Deliver in ${name}`,
    useCases: pickMany(USE_CASES, seed, 7, 20),
    whyTitle: 'Why Work With Pars Medya?',
    whyCards: pickMany(WHY_CARDS, seed, 4, 30),
    locationCards: cities.map((city) => ({
      name: city.name,
      description: `Software, web and digital solutions in ${city.name}`,
      href: enCityPath(city),
      cta: 'View',
    })),
    locationSectionTitle: `${name} Provinces`,
  }
}

export function enCityHubSections(city: TurkeyCity): HubSections {
  const seed = `en:${city.slug}`
  const featured = getLocalServices().filter((s) => s.source.featuredOnHome).slice(0, 6)
  const popularSlugs = featured.length ? featured.map((s) => toEnglishServiceSlug(s.slug)).filter(Boolean) : [...SERVICE_SLUGS_EN.slice(0, 6)]
  const prefix = enCityPath(city)
  return {
    overviewTitle: `Software Development in ${city.name}`,
    overviewParagraphs: [
      `${city.name} is a ${city.metropolitan ? 'metropolitan' : 'provincial'} center in ${enRegionName(city.region)} with ${city.districts.length} districts. We deliver software and digital solutions for businesses operating across all districts.`,
      `Custom software, CRM, ERP, web platforms, e-commerce, mobile applications and API integrations are planned around your operations rather than a generic feature set.`,
      `Discovery, design and delivery are coordinated remotely. In-person coordination is available when the project scope requires it.`,
    ],
    serviceCards: enServiceCards(popularSlugs, prefix),
    processTitle: 'How We Work',
    processSteps: PROCESS_STEPS,
    solutionTitle: 'Solutions We Provide',
    solutionCards: pickMany(SOLUTION_CARDS, seed, 8, 5),
    audienceTitle: 'Who We Work With',
    audienceCards: [
      { title: 'Growing SMEs', description: 'Teams replacing spreadsheets and disconnected tools with managed workflows.' },
      { title: 'Multi-location operations', description: 'Organizations needing shared data across branches, field teams and headquarters.' },
      { title: 'Manufacturing & logistics', description: 'Businesses digitizing stock, order and shipment processes.' },
      { title: 'Service companies', description: 'Teams managing proposals, projects and client relationships in one system.' },
    ],
    useCaseTitle: 'Business Use Cases',
    useCases: pickMany(USE_CASES, seed, 6, 25),
    whyTitle: 'Why Work With Pars Medya?',
    whyCards: pickMany(WHY_CARDS, seed, 4, 35),
    popularServices: enServiceCards(popularSlugs, prefix),
    popularServicesTitle: `Popular Services in ${city.name}`,
    locationCards: city.districts.map((district) => ({
      name: district.name,
      description: `Software and digital solutions in ${district.name}`,
      href: enDistrictPath(city, district),
      cta: 'View',
    })),
    locationSectionTitle: `Districts in ${city.name}`,
  }
}

export function enDistrictHubSections(city: TurkeyCity, district: TurkeyDistrict): HubSections {
  const seed = `en:${city.slug}:${district.slug}`
  const prefix = enDistrictPath(city, district)
  const popularSlugs = [...DISTRICT_POPULAR_EN]
  return {
    overviewTitle: `Software & Digital Services in ${district.name}`,
    overviewParagraphs: [
      `${district.name} is a district in ${city.name}, ${enRegionName(city.region)}. We provide software development and digital services for businesses operating here and across the province.`,
      `Solutions are not limited to a single district. Scope is planned to cover branches, field teams and headquarters as needed. The same project management model applies.`,
      `The service links below connect to detailed pages for each solution available in ${district.name}.`,
    ],
    serviceCards: enServiceCards(popularSlugs, prefix),
    processTitle: 'Project Delivery Process',
    processSteps: PROCESS_STEPS,
    solutionTitle: `Solutions for Businesses in ${district.name}`,
    solutionCards: pickMany(SOLUTION_CARDS, seed, 8, 8),
    digitalizationTitle: 'Business Processes We Can Digitalize',
    digitalizationAreas: pickMany(DIGITALIZATION, seed, 8, 18),
    sectorTitle: 'Industries & Use Cases',
    sectors: pickMany(INDUSTRIES, seed, 6, 28),
    whyTitle: 'Why Work With Pars Medya?',
    whyCards: pickMany(WHY_CARDS, seed, 4, 40),
    popularServices: enServiceCards(popularSlugs, prefix).map((item) => ({
      ...item,
      title: `${item.title} in ${district.name}`,
    })),
    popularServicesTitle: `Popular Services in ${district.name}`,
  }
}
