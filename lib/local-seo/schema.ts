import { safeJsonLd } from '@/lib/seo'
import { canonicalAbsoluteUrl } from '@/lib/site-url'
import type { LocalBreadcrumb, LocalHubModel, LocalServicePageModel } from '@/lib/local-seo/content'

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

function faqNode(faqs: LocalHubModel['faqs']) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

export function localServiceJsonLd(model: LocalServicePageModel) {
  const pageUrl = canonicalAbsoluteUrl(model.canonicalPath)
  const graph = [
    organizationNode(),
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: model.title,
      description: model.description,
      inLanguage: 'tr-TR',
      isPartOf: { '@type': 'WebSite', url: canonicalAbsoluteUrl('/') },
    },
    {
      '@type': 'Service',
      name: `${model.district?.name || model.city.name} ${model.service.title}`,
      description: model.description,
      url: pageUrl,
      provider: { '@id': ORGANIZATION_ID },
      areaServed: model.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
      serviceType: model.service.title,
    },
    breadcrumbNode(model.breadcrumbs),
    faqNode(model.faqs),
  ]
  return safeJsonLd({ '@context': 'https://schema.org', '@graph': graph })
}

export function localHubJsonLd(model: LocalHubModel) {
  const pageUrl = canonicalAbsoluteUrl(model.canonicalPath)
  const graph = [
    organizationNode(),
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: model.title,
      description: model.description,
      inLanguage: 'tr-TR',
    },
    breadcrumbNode(model.breadcrumbs),
    faqNode(model.faqs),
  ]
  return safeJsonLd({ '@context': 'https://schema.org', '@graph': graph })
}
