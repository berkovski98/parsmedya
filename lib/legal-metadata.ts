import type { Metadata } from 'next'
import { LEGAL_PAGES_PUBLISHED } from '@/lib/company-profile'
import { getLegalPage } from '@/lib/legal-pages'
import { createPageMetadata } from '@/lib/seo'

/** Legal pages stay `noindex, follow` until LEGAL_PAGES_PUBLISHED is switched on. */
export function legalPageMetadata(path: string): Metadata {
  const page = getLegalPage(path)
  if (!page) return { title: 'Pars Medya' }
  const tr = page.locale === 'tr' ? page.path : page.alternatePath || page.path
  const en = page.locale === 'en' ? page.path : page.alternatePath
  return createPageMetadata({
    title: page.metaTitle,
    description: page.description,
    canonical: page.path,
    tr,
    en,
    locale: page.locale,
    index: LEGAL_PAGES_PUBLISHED,
  })
}
