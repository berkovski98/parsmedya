import type { Metadata } from 'next'
import { ReferencesPage } from '@/components/references-page'
import { REFERENCES_PUBLISHED } from '@/lib/company-profile'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'References and Case Studies | Pars Medya',
  description: 'Client-approved case studies from Pars Medya web, custom software and integration projects: the problem, the solution and the measured result.',
  canonical: '/en/references',
  tr: '/referanslar',
  en: '/en/references',
  locale: 'en',
  // Stays noindex until real, client-approved case studies are added (Ö12).
  index: REFERENCES_PUBLISHED,
})

export default function EnglishReferencesPage() {
  return <ReferencesPage locale="en" />
}
