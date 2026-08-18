import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalCityHub } from '@/components/local-seo/hub-pages'
import { buildCityHub } from '@/lib/local-seo/content'
import { createLocalPageMetadata } from '@/lib/local-seo/metadata'
import { resolveCityHub } from '@/lib/local-seo/resolve'
import { localHubJsonLd } from '@/lib/local-seo/schema'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const route = resolveCityHub(city)
  if (!route || route.type !== 'city-hub') return { title: 'Sayfa bulunamadı | Pars Medya' }
  const model = buildCityHub(route.city)
  return createLocalPageMetadata({
    title: model.title,
    description: model.description,
    canonical: model.canonicalPath,
  })
}

export default async function CityHubPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const route = resolveCityHub(city)
  if (!route || route.type !== 'city-hub') notFound()
  const model = buildCityHub(route.city)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localHubJsonLd(model) }} />
      <LocalCityHub model={model} city={route.city} />
    </>
  )
}
