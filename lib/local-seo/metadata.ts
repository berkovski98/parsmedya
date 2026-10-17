import { createPageMetadata } from '@/lib/seo'
import { canonicalAbsoluteUrl } from '@/lib/site-url'
import { trLocalPathToEn } from '@/lib/local-seo/en-resolve'
import { localRobots } from '@/lib/local-seo/index-policy'
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
  const enEquivalent = trLocalPathToEn(canonical)
  const metadata = createPageMetadata({
    title,
    description,
    canonical,
    tr: canonical,
    en: enEquivalent || canonical,
    locale: 'tr',
  })
  return {
    ...metadata,
    alternates: {
      canonical: metadata.alternates?.canonical,
      languages: {
        tr: canonicalAbsoluteUrl(canonical),
        ...(enEquivalent ? { en: canonicalAbsoluteUrl(enEquivalent) } : {}),
        'x-default': canonicalAbsoluteUrl(canonical),
      },
    },
    robots: localRobots(indexable),
  }
}
