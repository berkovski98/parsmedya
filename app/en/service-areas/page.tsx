import type { Metadata } from 'next'
import { EnNationalHub } from '@/components/local-seo/en-hub-pages'
import { buildEnNationalHub } from '@/lib/local-seo/en-content'
import { createEnLocalPageMetadata } from '@/lib/local-seo/en-metadata'
import { enLocalHubJsonLd } from '@/lib/local-seo/en-schema'

export const revalidate = 86400

export function generateMetadata(): Metadata {
  const model = buildEnNationalHub()
  return createEnLocalPageMetadata({
    title: model.title,
    description: model.description,
    canonical: model.canonicalPath,
    trCanonical: model.trCanonicalPath,
  })
}

export default function EnServiceAreasPage() {
  const model = buildEnNationalHub()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: enLocalHubJsonLd(model) }} />
      <EnNationalHub model={model} />
    </>
  )
}
