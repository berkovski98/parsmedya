import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalServiceLanding } from '@/components/local-seo/service-landing'
import { buildLocalServicePage } from '@/lib/local-seo/content'
import { createLocalPageMetadata } from '@/lib/local-seo/metadata'
import { getLocalSeoOverride } from '@/lib/local-seo/overrides'
import { resolveDistrictService } from '@/lib/local-seo/resolve'
import { localServiceJsonLd } from '@/lib/local-seo/schema'

export const revalidate = 86400
export const dynamicParams = true

export function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; district: string; service: string }>
}): Promise<Metadata> {
  const { city, district, service } = await params
  const route = resolveDistrictService(city, district, service)
  if (!route) return { title: 'Sayfa bulunamadı | Pars Medya' }
  const override = await getLocalSeoOverride(route.city.slug, route.district.slug, route.service.slug)
  const model = buildLocalServicePage(route.city, route.service, route.district, override)
  return createLocalPageMetadata({
    title: model.title,
    description: model.description,
    canonical: model.canonicalPath,
    indexable: model.indexable,
  })
}

export default async function DistrictServicePage({
  params,
}: {
  params: Promise<{ city: string; district: string; service: string }>
}) {
  const { city, district, service } = await params
  const route = resolveDistrictService(city, district, service)
  if (!route) notFound()
  const override = await getLocalSeoOverride(route.city.slug, route.district.slug, route.service.slug)
  const model = buildLocalServicePage(route.city, route.service, route.district, override)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localServiceJsonLd(model) }} />
      <LocalServiceLanding model={model} />
    </>
  )
}
