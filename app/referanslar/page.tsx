import type { Metadata } from 'next'
import { ReferencesPage } from '@/components/references-page'
import { REFERENCES_PUBLISHED } from '@/lib/company-profile'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({
  title: 'Referanslar ve Vaka Çalışmaları | Pars Medya',
  description: 'Pars Medya’nın web, özel yazılım ve entegrasyon projelerinden müşteri onaylı vaka çalışmaları: problem, çözüm ve ölçülen sonuçlar.',
  canonical: '/referanslar',
  tr: '/referanslar',
  en: '/en/references',
  locale: 'tr',
  // Stays noindex until real, client-approved case studies are added (Ö12).
  index: REFERENCES_PUBLISHED,
})

export default function ReferanslarPage() {
  return <ReferencesPage locale="tr" />
}
