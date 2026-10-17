import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { NotFoundView } from '@/components/not-found-view'
import { localeFromPathname, type Locale } from '@/lib/i18n'

async function requestLocale(): Promise<Locale> {
  try {
    return localeFromPathname((await headers()).get('x-pathname') || '/')
  } catch {
    // Rendered outside a request (build-time /_not-found); Turkish is the default.
    return 'tr'
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await requestLocale()
  return {
    title: locale === 'en' ? 'Page not found | Pars Medya' : 'Sayfa bulunamadı | Pars Medya',
    robots: { index: false, follow: true },
  }
}

export default async function NotFound() {
  return <NotFoundView locale={await requestLocale()} />
}
