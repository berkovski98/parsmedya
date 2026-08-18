import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalDistrictHub } from '@/components/local-seo/hub-pages'
import { LocalServiceLanding } from '@/components/local-seo/service-landing'
import { buildDistrictHub, buildLocalServicePage } from '@/lib/local-seo/content'
import { createLocalPageMetadata } from '@/lib/local-seo/metadata'
import { getLocalSeoOverride } from '@/lib/local-seo/overrides'
import { resolveCityChild } from '@/lib/local-seo/resolve'
import { localHubJsonLd, localServiceJsonLd } from '@/lib/local-seo/schema'

export const revalidate = 86400
export const dynamicParams = true

export function generateStaticParams() {
  return []
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}): Promise<Metadata> {
  const { city, slug } = await params
  const route = resolveCityChild(city, slug)
  if (!route) return { title: 'Sayfa bulunamadı | Pars Medya' }
  if (route.type === 'district-hub') {
    const model = buildDistrictHub(route.city, route.district)
    return createLocalPageMetadata({
      title: model.title,
      description: model.description,
      canonical: model.canonicalPath,
    })
  }
  const override = await getLocalSeoOverride(route.city.slug, null, route.service.slug)
  const model = buildLocalServicePage(route.city, route.service, null, override)
  return createLocalPageMetadata({
    title: model.title,
    description: model.description,
    canonical: model.canonicalPath,
    indexable: model.indexable,
  })
}

export default async function CityChildPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city, slug } = await params
  const route = resolveCityChild(city, slug)
  if (!route) notFound()
  if (route.type === 'district-hub') {
    const model = buildDistrictHub(route.city, route.district)
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localHubJsonLd(model) }} />
        <LocalDistrictHub model={model} city={route.city} district={route.district} />
      </>
    )
  }
  const override = await getLocalSeoOverride(route.city.slug, null, route.service.slug)
  const model = buildLocalServicePage(route.city, route.service, null, override)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localServiceJsonLd(model) }} />
      <LocalServiceLanding model={model} />
    </>
  )
}
