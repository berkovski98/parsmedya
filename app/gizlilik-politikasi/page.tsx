import { notFound } from 'next/navigation'
import { LegalPageView } from '@/components/legal-page'
import { legalPageMetadata } from '@/lib/legal-metadata'
import { getLegalPage } from '@/lib/legal-pages'

const PATH = '/gizlilik-politikasi'

export const metadata = legalPageMetadata(PATH)

export default function PrivacyPage() {
  const page = getLegalPage(PATH)
  if (!page) notFound()
  return <LegalPageView page={page} />
}
