import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EnRegionHub } from '@/components/local-seo/en-hub-pages'
import { buildEnRegionHub } from '@/lib/local-seo/en-content'
import { resolveEnRegionHub } from '@/lib/local-seo/en-resolve'
import { createEnLocalPageMetadata } from '@/lib/local-seo/en-metadata'
import { enLocalHubJsonLd } from '@/lib/local-seo/en-schema'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region } = await params
  const route = resolveEnRegionHub(region)
  if (!route) return { title: 'Page not found | Pars Medya' }
  const model = buildEnRegionHub(route.region)
  return createEnLocalPageMetadata({ title: model.title, description: model.description, canonical: model.canonicalPath, trCanonical: model.trCanonicalPath })
}

export default async function EnRegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params
  const route = resolveEnRegionHub(region)
  if (!route) notFound()
  const model = buildEnRegionHub(route.region)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: enLocalHubJsonLd(model) }} />
      <EnRegionHub model={model} region={route.region} />
    </>
  )
}
