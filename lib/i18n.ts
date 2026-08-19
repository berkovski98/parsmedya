import { trLocalPathToEn, enLocalPathToTr } from '@/lib/local-seo/en-resolve'
import { serviceSlugPairs, toEnglishServiceSlug, toTurkishServiceSlug } from '@/lib/i18n/service-slugs'

export type Locale = 'tr' | 'en'

export const localeHomePath = (locale: Locale) => locale === 'en' ? '/en' : '/'

export function localeFromPathname(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'tr'
}

export function trPath(path = '') {
  if (!path || path === '/' || path === '/tr') return '/'
  if (path.startsWith('/tr/')) {
    const stripped = path.slice(3)
    return stripped.startsWith('/') ? stripped : `/${stripped}`
  }
  return path.startsWith('/') ? path : `/${path}`
}

export function enPath(path = '') {
  if (!path || path === '/') return '/en'
  return path.startsWith('/en') ? path : `/en${path.startsWith('/') ? path : `/${path}`}`
}

export const paths = {
  home: (locale: Locale) => localeHomePath(locale),
  about: (locale: Locale) => locale === 'en' ? '/en/about' : '/hakkimizda',
  vision: (locale: Locale) => locale === 'en' ? '/en/vision' : '/vizyonumuz',
  mission: (locale: Locale) => locale === 'en' ? '/en/mission' : '/misyonumuz',
  services: (locale: Locale) => locale === 'en' ? '/en/services' : '/hizmetler',
  service: (locale: Locale, slug: string) => `${locale === 'en' ? '/en/services' : '/hizmetler'}/${slug}`,
  blog: (locale: Locale) => locale === 'en' ? '/en/blog' : '/blog',
  blogPost: (locale: Locale, slug: string) => `${locale === 'en' ? '/en/blog' : '/blog'}/${slug}`,
  contact: (locale: Locale) => locale === 'en' ? '/en/contact' : '/iletisim',
}

export { serviceSlugPairs, toEnglishServiceSlug, toTurkishServiceSlug }

const staticPairs: Record<string, string> = {
  '/': '/en',
  '/hakkimizda': '/en/about',
  '/vizyonumuz': '/en/vision',
  '/misyonumuz': '/en/mission',
  '/hizmetler': '/en/services',
  '/blog': '/en/blog',
  '/iletisim': '/en/contact',
}

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname || '/'
}

function canonicalizeSwitchPath(pathname: string) {
  const current = normalizePath(pathname)
  if (current === '/tr') return '/'
  if (current.startsWith('/tr/')) return current.slice(3) || '/'
  if (current === '/vizyon') return '/vizyonumuz'
  if (current === '/misyon') return '/misyonumuz'
  return current
}

export function alternatePath(pathname: string): string {
  const current = canonicalizeSwitchPath(pathname)

  if (current.startsWith('/en/service-areas')) {
    const trPath = enLocalPathToTr(current)
    return trPath || '/'
  }
  if (current === '/hizmet-bolgeleri' || current.startsWith('/hizmet-bolgeleri/')) {
    const enPath = trLocalPathToEn(current)
    return enPath || '/en'
  }

  if (current.startsWith('/en/services/')) {
    const slug = toTurkishServiceSlug(current.split('/').pop() || '')
    return slug ? `/hizmetler/${slug}` : '/hizmetler'
  }
  if (current.startsWith('/hizmetler/')) {
    const slug = toEnglishServiceSlug(current.split('/').pop() || '')
    return slug ? `/en/services/${slug}` : '/en/services'
  }
  if (current.startsWith('/en/blog/')) return '/blog'
  if (current.startsWith('/blog/')) return '/en/blog'

  if (!current.startsWith('/en') && !Object.keys(staticPairs).includes(current)) {
    const enPath = trLocalPathToEn(current)
    if (enPath) return enPath
  }

  if (current.startsWith('/en')) {
    return Object.entries(staticPairs).find(([, en]) => en === current)?.[0] || '/'
  }
  return staticPairs[current] || '/en'
}
