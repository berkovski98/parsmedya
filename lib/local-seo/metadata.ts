import { createPageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export function createLocalPageMetadata({
  title,
  description,
  canonical,
  indexable = true,
}: {
  title: string
  description: string
  canonical: string
  indexable?: boolean
}): Metadata {
  const metadata = createPageMetadata({
    title,
    description,
    canonical,
    tr: canonical,
    en: canonical,
    locale: 'tr',
  })
  return {
    ...metadata,
    alternates: {
      canonical: metadata.alternates?.canonical,
      languages: {
        tr: metadata.alternates?.canonical as string,
        'x-default': metadata.alternates?.canonical as string,
      },
    },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
  }
}
