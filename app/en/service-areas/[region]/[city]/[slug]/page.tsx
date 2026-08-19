import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EnDistrictHub } from '@/components/local-seo/en-hub-pages'
import { EnServiceLanding } from '@/components/local-seo/en-service-landing'
import { buildEnDistrictHub, buildEnLocalServicePage } from '@/lib/local-seo/en-content'
import { resolveEnCityChild } from '@/lib/local-seo/en-resolve'
import { createEnLocalPageMetadata } from '@/lib/local-seo/en-metadata'
import { enLocalHubJsonLd, enLocalServiceJsonLd } from '@/lib/local-seo/en-schema'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ region: string; city: string; slug: string }> }): Promise<Metadata> {
  const { region, city, slug } = await params
  const route = resolveEnCityChild(region, city, slug)
  if (!route) return { title: 'Page not found | Pars Medya' }
  if (route.type === 'en-district-hub') {
    const model = buildEnDistrictHub(route.city, route.district)
    return createEnLocalPageMetadata({ title: model.title, description: model.description, canonical: model.canonicalPath, trCanonical: model.trCanonicalPath })
  }
  const model = buildEnLocalServicePage(route.city, route.service)
  return createEnLocalPageMetadata({ title: model.title, description: model.description, canonical: model.canonicalPath, trCanonical: model.trCanonicalPath })
}

export default async function EnCitySlugPage({ params }: { params: Promise<{ region: string; city: string; slug: string }> }) {
  const { region, city, slug } = await params
  const route = resolveEnCityChild(region, city, slug)
  if (!route) notFound()
  if (route.type === 'en-district-hub') {
    const model = buildEnDistrictHub(route.city, route.district)
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: enLocalHubJsonLd(model) }} />
        <EnDistrictHub model={model} city={route.city} district={route.district} />
      </>
    )
  }
  const model = buildEnLocalServicePage(route.city, route.service)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: enLocalServiceJsonLd(model) }} />
      <EnServiceLanding model={model} />
    </>
  )
}
