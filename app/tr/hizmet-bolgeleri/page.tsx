import type { Metadata } from 'next'
import { LocalNationalHub } from '@/components/local-seo/hub-pages'
import { buildNationalHub } from '@/lib/local-seo/content'
import { createLocalPageMetadata } from '@/lib/local-seo/metadata'
import { localHubJsonLd } from '@/lib/local-seo/schema'

export const revalidate = 86400

const model = buildNationalHub()

export const metadata: Metadata = createLocalPageMetadata({
  title: model.title,
  description: model.description,
  canonical: model.canonicalPath,
})

export default function HizmetBolgeleriPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localHubJsonLd(model) }} />
      <LocalNationalHub model={model} />
    </>
  )
}
