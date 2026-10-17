import type { Metadata } from 'next'
import { NotFoundView } from '@/components/not-found-view'

export const metadata: Metadata = {
  title: 'Page not found | Pars Medya',
  robots: { index: false, follow: true },
}

export default function EnglishNotFound() {
  return <NotFoundView locale="en" />
}
