import type { Metadata } from 'next'
import { ReferencesPage } from '@/components/references-page'
import { REFERENCES_PUBLISHED } from '@/lib/company-profile'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'References and Projects | Pars Medya',
  description: 'Pars Medya projects in EDI, custom software, e-commerce and practice management: the need, the solution, what was delivered and the technology used.',
  canonical: '/en/references',
  tr: '/referanslar',
  en: '/en/references',
  locale: 'en',
  // Real projects, published without client names (owner decision).
  index: REFERENCES_PUBLISHED,
})

export default function EnglishReferencesPage() {
  return <ReferencesPage locale="en" />
}
