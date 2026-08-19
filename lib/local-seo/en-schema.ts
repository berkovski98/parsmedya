import { safeJsonLd } from '@/lib/seo'
import { canonicalAbsoluteUrl } from '@/lib/site-url'
import type { EnLocalHubModel, EnLocalServicePageModel } from '@/lib/local-seo/en-content'
import type { LocalBreadcrumb } from '@/lib/local-seo/content'

const ORGANIZATION_ID = `${canonicalAbsoluteUrl('/')}#organization`

function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Pars Medya',
    url: canonicalAbsoluteUrl('/'),
  }
}

function breadcrumbNode(items: LocalBreadcrumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalAbsoluteUrl(item.href),
    })),
  }
}

function faqNode(faqs: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function enLocalServiceJsonLd(model: EnLocalServicePageModel) {
  const pageUrl = canonicalAbsoluteUrl(model.canonicalPath)
  const graph = [
    organizationNode(),
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: model.title,
      description: model.description,
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', url: canonicalAbsoluteUrl('/en') },
    },
    {
      '@type': 'Service',
      name: model.h1,
      description: model.description,
      url: pageUrl,
      provider: { '@id': ORGANIZATION_ID },
      areaServed: model.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
      serviceType: model.enService.title,
    },
    breadcrumbNode(model.breadcrumbs),
    faqNode(model.faqs),
  ]
  return safeJsonLd({ '@context': 'https://schema.org', '@graph': graph })
}

export function enLocalHubJsonLd(model: EnLocalHubModel) {
  const pageUrl = canonicalAbsoluteUrl(model.canonicalPath)
  const graph = [
    organizationNode(),
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: model.title,
      description: model.description,
      inLanguage: 'en',
    },
    breadcrumbNode(model.breadcrumbs),
    faqNode(model.faqs),
  ]
  return safeJsonLd({ '@context': 'https://schema.org', '@graph': graph })
}
