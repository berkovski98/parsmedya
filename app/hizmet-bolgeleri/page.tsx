import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalNationalHub } from '@/components/local-seo/hub-pages'
import { buildNationalHub } from '@/lib/local-seo/content'
import { createLocalPageMetadata } from '@/lib/local-seo/metadata'
import { localHubJsonLd } from '@/lib/local-seo/schema'

export const revalidate = 86400
export const dynamic = 'force-dynamic'

function nationalHub() {
  try {
    return buildNationalHub()
  } catch (error) {
    console.error('[local-seo] national hub failed', error)
    return null
  }
}

export function generateMetadata(): Metadata {
  const model = nationalHub()
  if (!model) return { title: 'Hizmet Bölgeleri | Pars Medya' }
  return createLocalPageMetadata({
    title: model.title,
    description: model.description,
    canonical: model.canonicalPath,
  })
}

export default function HizmetBolgeleriPage() {
  const model = nationalHub()
  if (!model) notFound()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localHubJsonLd(model) }} />
      <LocalNationalHub model={model} />
    </>
  )
}
