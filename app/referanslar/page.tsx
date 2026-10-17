import type { Metadata } from 'next'
import { ReferencesPage } from '@/components/references-page'
import { REFERENCES_PUBLISHED } from '@/lib/company-profile'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Referanslar ve Projeler | Pars Medya',
  description: 'Pars Medya’nın EDI, özel yazılım, e-ticaret ve iş yazılımı projeleri: ihtiyaç, kurulan çözüm, teslim edilenler ve kullanılan teknolojiler.',
  canonical: '/referanslar',
  tr: '/referanslar',
  en: '/en/references',
  locale: 'tr',
  // Real projects, published without client names (owner decision).
  index: REFERENCES_PUBLISHED,
})

export default function ReferanslarPage() {
  return <ReferencesPage locale="tr" />
}
