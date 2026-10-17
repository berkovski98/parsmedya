import { notFound } from 'next/navigation'
import { LegalPageView } from '@/components/legal-page'
import { legalPageMetadata } from '@/lib/legal-metadata'
import { getLegalPage } from '@/lib/legal-pages'

const PATH = '/en/cookie-policy'

export const metadata = legalPageMetadata(PATH)

export default function EnglishCookiePage() {
  const page = getLegalPage(PATH)
  if (!page) notFound()
  return <LegalPageView page={page} />
}
