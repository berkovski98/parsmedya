import { ServiceArchitecture } from '@/components/service-page/service-architecture'
import { ServiceBenefits } from '@/components/service-page/service-benefits'
import { ServiceCapabilities } from '@/components/service-page/service-capabilities'
import { ServiceCTA } from '@/components/service-page/service-cta'
import { ServiceHero } from '@/components/service-page/service-hero'
import { ServiceOutcomes } from '@/components/service-page/service-outcomes'
import { ServiceOverview, serviceOverviewParagraphs } from '@/components/service-page/service-overview'
import { ServiceProcess } from '@/components/service-page/service-process'
import { ServiceFaq, ServicePackages, ServiceRelated, ServiceUseCases } from '@/components/service-page/service-supporting'
import { ServiceTechStack } from '@/components/service-page/service-tech-stack'
import { ServiceTrustBar } from '@/components/service-page/service-trust-bar'
import { ServiceVisual } from '@/components/service-page/service-visual'
import { EdiCallout } from '@/components/edi/edi-callout'
import type { Locale } from '@/lib/i18n'
import { buildServicePageModel, mergeTechStack, serviceHighlights, serviceJsonLd } from '@/lib/service-page'
import { safeJsonLd } from '@/lib/seo'
import type { Service } from '@/lib/services'
import type { EnglishService } from '@/lib/services-en'

export {
  ServiceArchitecture,
  ServiceBenefits,
  ServiceCapabilities,
  ServiceCTA,
  ServiceHero,
  ServiceOutcomes,
  ServiceOverview,
  ServiceProcess,
  ServiceTechStack,
  ServiceTrustBar,
  ServiceVisual,
}

const EDI_RELATED_SLUGS = new Set(['api-sistem-entegrasyonlari', 'api-system-integrations', 'erp-yazilim-cozumleri', 'erp-software-solutions', 'stok-siparis-yonetim-sistemleri', 'inventory-order-management'])

export function ServicePage({
  service,
  locale,
}: {
  service: Service | EnglishService
  locale: Locale
}) {
  const model = buildServicePageModel(service, locale)
  const paragraphs = serviceOverviewParagraphs(service, locale)
  const jsonLd = serviceJsonLd(service, model)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <ServiceHero model={model} />
      <ServiceTrustBar model={model} />
      <ServiceOverview
        model={model}
        paragraphs={paragraphs}
        highlights={serviceHighlights(service, locale)}
      />
      <ServiceCapabilities model={model} features={service.features} />
      {EDI_RELATED_SLUGS.has(service.slug) ? <div className="py-6"><EdiCallout locale={locale} /></div> : null}
      <ServiceProcess model={model} />
      <ServiceArchitecture model={model} />
      <ServiceTechStack model={model} technologies={mergeTechStack(service, model.visual)} />
      <ServiceBenefits model={model} whyParagraph={service.whyParsMedya} />
      <ServiceOutcomes model={model} />
      {service.useCases && service.useCases.length > 0 ? <ServiceUseCases model={model} useCases={service.useCases} /> : null}
      <ServicePackages model={model} packages={service.packages} />
      <ServiceFaq model={model} faqs={service.faqs} />
      <ServiceRelated model={model} current={service} />
      <ServiceCTA model={model} />
    </>
  )
}
