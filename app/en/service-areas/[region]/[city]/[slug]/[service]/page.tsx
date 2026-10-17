import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EnServiceLanding } from '@/components/local-seo/en-service-landing'
import { buildEnLocalServicePage } from '@/lib/local-seo/en-content'
import { resolveEnDistrictService } from '@/lib/local-seo/en-resolve'
import { createEnLocalPageMetadata } from '@/lib/local-seo/en-metadata'
import { getLocalSeoOverride } from '@/lib/local-seo/overrides'
import { enLocalServiceJsonLd } from '@/lib/local-seo/en-schema'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ region: string; city: string; slug: string; service: string }> }): Promise<Metadata> {
  const { region, city, slug, service } = await params
  const route = resolveEnDistrictService(region, city, slug, service)
  if (!route) return { title: 'Page not found | Pars Medya' }
  const override = await getLocalSeoOverride(route.city.slug, route.district.slug, route.service.slug)
  const model = buildEnLocalServicePage(route.city, route.service, route.district, override)
  return createEnLocalPageMetadata({ title: model.title, description: model.description, canonical: model.canonicalPath, trCanonical: model.trCanonicalPath, indexable: model.indexable })
}

export default async function EnDistrictServicePage({ params }: { params: Promise<{ region: string; city: string; slug: string; service: string }> }) {
  const { region, city, slug, service } = await params
  const route = resolveEnDistrictService(region, city, slug, service)
  if (!route) notFound()
  const override = await getLocalSeoOverride(route.city.slug, route.district.slug, route.service.slug)
  const model = buildEnLocalServicePage(route.city, route.service, route.district, override)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: enLocalServiceJsonLd(model) }} />
      <EnServiceLanding model={model} />
    </>
  )
}
