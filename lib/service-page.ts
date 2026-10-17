import { toEnglishServiceSlug, type Locale } from '@/lib/i18n'
import { getServiceCategoryLabel } from '@/lib/navigation'
import {
  getServicePageExtras,
  type LocaleText,
  type ServicePageExtras,
  type ServiceVisualKey,
} from '@/lib/service-page-copy'
import type { Service } from '@/lib/services'
import type { EnglishService } from '@/lib/services-en'
import { orgRef, websiteRef } from '@/lib/schema/organization'
import { canonicalAbsoluteUrl } from '@/lib/site-url'

export type ServicePageModel = {
  locale: Locale
  visual: ServiceVisualKey
  extras: ServicePageExtras
  title: string
  tagline: string
  description: string
  category: string
  homeHref: string
  servicesHref: string
  contactHref: string
  canonical: string
  trPath: string
  enPath: string
}

export const SERVICE_UI = {
  tr: {
    home: 'Ana Sayfa',
    services: 'Hizmetlerimiz',
    talk: 'Projenizi Konuşalım',
    explore: 'Hizmetleri İncele',
    overviewLabel: 'Hizmete genel bakış',
    overviewCard: 'İhtiyacınıza göre',
    capabilitiesLabel: 'Kapsam',
    capabilitiesTitle: 'Neler geliştiriyoruz?',
    processLabel: 'Çalışma modeli',
    processTitle: 'Nasıl çalışıyoruz?',
    architectureLabel: 'Sistem mimarisi',
    architectureTitle: 'Örnek sistem mimarisi',
    architectureLead:
      'Kullanıcı arayüzünden API, backend ve veri katmanına; CRM, ERP, ödeme ve üçüncü taraf servislere kadar kontrollü bir yazılım yığını kurarız.',
    techLabel: 'Yetkinlikler',
    techTitle: 'Kullandığımız teknolojiler',
    whyLabel: 'Yaklaşımımız',
    whyTitle: 'Neden Pars Medya?',
    outcomesLabel: 'Kazanımlar',
    outcomesTitle: 'İşletmenize sağladığı faydalar',
    useCasesLabel: 'Kullanım alanları',
    useCasesTitle: 'Hangi işletmeler ve süreçler için uygundur?',
    packagesLabel: 'Örnek kapsamlar',
    packagesTitle: 'Pilot ve destek aşamalarında sık istenen kapsamlar',
    featured: 'En çok tercih edilen',
    quote: 'Teklif Al',
    faqLabel: 'Sık sorulan sorular',
    faqTitle: 'Aklınıza takılanlar',
    relatedTitle: 'İlgili hizmetler',
    relatedAll: 'Tüm hizmetler',
    relatedCta: 'Detaylı bilgi',
    contact: 'İletişime Geçin',
    highlightsLabel: 'Öne çıkanlar',
  },
  en: {
    home: 'Home',
    services: 'Services',
    talk: 'Discuss Your Project',
    explore: 'Explore Capabilities',
    overviewLabel: 'Service overview',
    overviewCard: 'Built around your needs',
    capabilitiesLabel: 'Scope',
    capabilitiesTitle: 'What we build',
    processLabel: 'Delivery model',
    processTitle: 'How we work',
    architectureLabel: 'System architecture',
    architectureTitle: 'Example system architecture',
    architectureLead:
      'We design a controlled stack from user interfaces through API, backend and data layers, with CRM, ERP, payments and third-party services connected where they belong.',
    techLabel: 'Capabilities',
    techTitle: 'Technologies we use',
    whyLabel: 'Our approach',
    whyTitle: 'Why Pars Medya?',
    outcomesLabel: 'Outcomes',
    outcomesTitle: 'What this delivers for your business',
    useCasesLabel: 'Use cases',
    useCasesTitle: 'Where this service fits',
    packagesLabel: 'Example scopes',
    packagesTitle: 'Scopes often chosen for the pilot and support stages',
    featured: 'Most requested',
    quote: 'Request a proposal',
    faqLabel: 'FAQ',
    faqTitle: 'Questions teams usually ask',
    relatedTitle: 'Related services',
    relatedAll: 'All services',
    relatedCta: 'Learn more',
    contact: 'Contact Us',
    highlightsLabel: 'Highlights',
  },
} as const

export type ServiceUiCopy = (typeof SERVICE_UI)[Locale]

const TECH_BY_VISUAL: Record<ServiceVisualKey, string[]> = {
  software: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Supabase', 'REST API', 'Authentication', 'Cloud'],
  crm: ['Next.js', 'TypeScript', 'PostgreSQL', 'REST API', 'Workflow', 'Authentication', 'Analytics', 'Cloud'],
  erp: ['Next.js', 'Node.js', 'PostgreSQL', 'REST API', 'Reporting', 'Authentication', 'Cloud'],
  api: ['REST API', 'Webhooks', 'Node.js', 'TypeScript', 'PostgreSQL', 'Cloud', 'Authentication'],
  commerce: ['Next.js', 'TypeScript', 'PostgreSQL', 'Payments', 'Inventory', 'REST API', 'Cloud'],
  mobile: ['React Native', 'TypeScript', 'REST API', 'Push Notifications', 'Authentication', 'Cloud'],
  ai: ['Node.js', 'TypeScript', 'PostgreSQL', 'LLM APIs', 'Authentication', 'Cloud'],
  dashboard: ['Next.js', 'TypeScript', 'PostgreSQL', 'Analytics', 'REST API', 'Reporting', 'Cloud'],
  seo: ['Technical SEO', 'Content', 'Analytics', 'Search Console', 'Core Web Vitals', 'Structured Data'],
  website: ['Next.js', 'React', 'TypeScript', 'CMS', 'SEO', 'Analytics', 'Responsive'],
  saas: ['Next.js', 'TypeScript', 'PostgreSQL', 'Multi-tenant', 'Payments', 'Authentication', 'Cloud'],
  portal: ['Next.js', 'TypeScript', 'PostgreSQL', 'RBAC', 'REST API', 'Authentication', 'Cloud'],
  inventory: ['Next.js', 'PostgreSQL', 'REST API', 'Workflow', 'Reporting', 'Authentication'],
  automation: ['Node.js', 'TypeScript', 'Workflow', 'Webhooks', 'PostgreSQL', 'Cloud'],
  platform: ['Next.js', 'TypeScript', 'PostgreSQL', 'Payments', 'RBAC', 'REST API', 'Cloud'],
  consulting: ['Architecture', 'Security', 'Cloud', 'Delivery', 'Code Review', 'Roadmapping'],
  design: ['Figma', 'Design Systems', 'Prototyping', 'Accessibility', 'User Research', 'Responsive'],
  modernize: ['TypeScript', 'Next.js', 'PostgreSQL', 'Migration', 'Testing', 'Cloud', 'APIs'],
}

export function tx(value: LocaleText, locale: Locale) {
  return value[locale]
}

export function turkishServiceSlug(service: Service | EnglishService) {
  return 'trSlug' in service ? service.trSlug : service.slug
}

export function buildServicePageModel(service: Service | EnglishService, locale: Locale): ServicePageModel {
  const trSlug = turkishServiceSlug(service)
  const extras = getServicePageExtras(trSlug)
  const trPath = `/hizmetler/${trSlug}`
  const enPath = `/en/services/${toEnglishServiceSlug(trSlug)}`
  const canonical = locale === 'en' ? enPath : trPath

  return {
    locale,
    visual: extras.visual,
    extras,
    title: service.title,
    tagline: service.tagline,
    description: service.description,
    category: getServiceCategoryLabel(service.category, locale),
    homeHref: locale === 'en' ? '/en' : '/',
    servicesHref: locale === 'en' ? '/en/services' : '/hizmetler',
    contactHref: locale === 'en' ? '/en/contact' : '/iletisim',
    canonical,
    trPath,
    enPath,
  }
}

export function mergeTechStack(service: Service | EnglishService, visual: ServiceVisualKey) {
  return [...new Set([...TECH_BY_VISUAL[visual], ...service.technologies])]
}

/** "What are CRM Software Solutions?" for plural titles, "What is Website Development?" otherwise. */
export function overviewHeading(title: string, locale: Locale) {
  if (locale !== 'en') return `${title} nedir?`
  const lastWord = title.trim().split(/\s+/).pop() || ''
  const plural = /[^s]s$/i.test(lastWord)
  return `${plural ? 'What are' : 'What is'} ${title}?`
}

export function serviceHighlights(service: Service | EnglishService, locale: Locale) {
  if (locale === 'en') return (service.benefits ?? service.highlights).slice(0, 3)
  return service.highlights
}

export function serviceJsonLd(service: Service | EnglishService, model: ServicePageModel) {
  const url = canonicalAbsoluteUrl(model.canonical)
  const home = canonicalAbsoluteUrl(model.homeHref)
  const services = canonicalAbsoluteUrl(model.servicesHref)
  const ui = SERVICE_UI[model.locale]
  const inLanguage = model.locale === 'en' ? 'en-US' : 'tr-TR'
  const description = service.seoDescription ?? service.description

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: service.seoTitle ?? service.title,
      description,
      inLanguage,
      isPartOf: websiteRef(),
      breadcrumb: { '@id': `${url}#breadcrumb` },
      mainEntity: { '@id': `${url}#service` },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: ui.home, item: home },
        { '@type': 'ListItem', position: 2, name: ui.services, item: services },
        { '@type': 'ListItem', position: 3, name: service.title, item: url },
      ],
    },
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      name: service.title,
      description,
      url,
      inLanguage,
      provider: orgRef(),
      areaServed: { '@type': 'Country', name: model.locale === 'en' ? 'Turkey' : 'Türkiye' },
      serviceType: service.title,
      category: model.category,
    },
  ]

  // The same questions are visible in ServiceFaq on the page.
  if (service.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      inLanguage,
      mainEntity: service.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
