import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalRegionHub } from '@/components/local-seo/hub-pages'
import { buildRegionHub } from '@/lib/local-seo/content'
import { createLocalPageMetadata } from '@/lib/local-seo/metadata'
import { resolveRegionHub } from '@/lib/local-seo/resolve'
import { localHubJsonLd } from '@/lib/local-seo/schema'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>
}): Promise<Metadata> {
  const { region } = await params
  const route = resolveRegionHub(region)
  if (!route) return { title: 'Bölge bulunamadı | Pars Medya' }
  const model = buildRegionHub(route.region)
  return createLocalPageMetadata({
    title: model.title,
    description: model.description,
    canonical: model.canonicalPath,
  })
}

export default async function RegionHubPage({
  params,
}: {
  params: Promise<{ region: string }>
}) {
  const { region } = await params
  const route = resolveRegionHub(region)
  if (!route) notFound()
  const model = buildRegionHub(route.region)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localHubJsonLd(model) }} />
      <LocalRegionHub model={model} region={route.region} />
    </>
  )
}
