import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EnServiceLanding } from '@/components/local-seo/en-service-landing'
import { buildEnLocalServicePage } from '@/lib/local-seo/en-content'
import { resolveEnDistrictService } from '@/lib/local-seo/en-resolve'
import { createEnLocalPageMetadata } from '@/lib/local-seo/en-metadata'
import { enLocalServiceJsonLd } from '@/lib/local-seo/en-schema'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ region: string; city: string; slug: string; service: string }> }): Promise<Metadata> {
  const { region, city, slug, service } = await params
  const route = resolveEnDistrictService(region, city, slug, service)
  if (!route) return { title: 'Page not found | Pars Medya' }
  const model = buildEnLocalServicePage(route.city, route.service, route.district)
  return createEnLocalPageMetadata({ title: model.title, description: model.description, canonical: model.canonicalPath, trCanonical: model.trCanonicalPath })
}

export default async function EnDistrictServicePage({ params }: { params: Promise<{ region: string; city: string; slug: string; service: string }> }) {
  const { region, city, slug, service } = await params
  const route = resolveEnDistrictService(region, city, slug, service)
  if (!route) notFound()
  const model = buildEnLocalServicePage(route.city, route.service, route.district)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: enLocalServiceJsonLd(model) }} />
      <EnServiceLanding model={model} />
    </>
  )
}
