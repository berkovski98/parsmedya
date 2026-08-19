import { createPageMetadata } from '@/lib/seo'
import { canonicalAbsoluteUrl } from '@/lib/site-url'
import type { Metadata } from 'next'

export function createEnLocalPageMetadata({
  title,
  description,
  canonical,
  trCanonical,
  indexable = true,
}: {
  title: string
  description: string
  canonical: string
  trCanonical: string
  indexable?: boolean
}): Metadata {
  const metadata = createPageMetadata({
    title,
    description,
    canonical,
    tr: trCanonical,
    en: canonical,
    locale: 'en',
  })
  return {
    ...metadata,
    alternates: {
      canonical: canonicalAbsoluteUrl(canonical),
      languages: {
        en: canonicalAbsoluteUrl(canonical),
        tr: canonicalAbsoluteUrl(trCanonical),
        'x-default': canonicalAbsoluteUrl(trCanonical),
      },
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  }
}
