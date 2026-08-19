import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EnCityHub } from '@/components/local-seo/en-hub-pages'
import { buildEnCityHub } from '@/lib/local-seo/en-content'
import { resolveEnCityHub } from '@/lib/local-seo/en-resolve'
import { createEnLocalPageMetadata } from '@/lib/local-seo/en-metadata'
import { enLocalHubJsonLd } from '@/lib/local-seo/en-schema'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ region: string; city: string }> }): Promise<Metadata> {
  const { region, city } = await params
  const route = resolveEnCityHub(region, city)
  if (!route) return { title: 'Page not found | Pars Medya' }
  const model = buildEnCityHub(route.city)
  return createEnLocalPageMetadata({ title: model.title, description: model.description, canonical: model.canonicalPath, trCanonical: model.trCanonicalPath })
}

export default async function EnCityPage({ params }: { params: Promise<{ region: string; city: string }> }) {
  const { region, city } = await params
  const route = resolveEnCityHub(region, city)
  if (!route) notFound()
  const model = buildEnCityHub(route.city)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: enLocalHubJsonLd(model) }} />
      <EnCityHub model={model} city={route.city} />
    </>
  )
}
