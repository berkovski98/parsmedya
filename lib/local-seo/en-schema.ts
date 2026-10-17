import { safeJsonLd } from '@/lib/seo'
import { orgRef, websiteRef } from '@/lib/schema/organization'
import { canonicalAbsoluteUrl } from '@/lib/site-url'
import type { EnLocalHubModel, EnLocalServicePageModel } from '@/lib/local-seo/en-content'
import type { LocalBreadcrumb } from '@/lib/local-seo/content'

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
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: model.title,
      description: model.description,
      inLanguage: 'en-US',
      isPartOf: websiteRef(),
    },
    {
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: model.h1,
      description: model.description,
      url: pageUrl,
      provider: orgRef(),
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
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: model.title,
      description: model.description,
      inLanguage: 'en-US',
      isPartOf: websiteRef(),
    },
    breadcrumbNode(model.breadcrumbs),
    faqNode(model.faqs),
  ]
  return safeJsonLd({ '@context': 'https://schema.org', '@graph': graph })
}
