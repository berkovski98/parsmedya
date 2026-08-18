import { services } from '@/lib/services'

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

const serviceSlugMap: Record<string, string> = {
  'web-sitesi-gelistirme': 'website-development', 'mobil-uygulama': 'mobile-apps',
  'e-ticaret-cozumleri': 'e-commerce-solutions', 'seo-dijital-pazarlama': 'seo-digital-marketing',
  'ui-ux-tasarim': 'ui-ux-design', 'yazilim-danismanligi': 'software-consulting',
  'web-yazilim-gelistirme': 'web-software-development', 'ozel-yazilim-gelistirme': 'custom-software-development',
  'crm-yazilim-cozumleri': 'crm-software-solutions', 'erp-yazilim-cozumleri': 'erp-software-solutions',
  'e-ticaret-yazilimi': 'e-commerce-development', 'kurumsal-web-uygulamalari': 'enterprise-web-applications',
  'mobil-uygulama-gelistirme': 'mobile-app-development', 'api-sistem-entegrasyonlari': 'api-system-integrations',
  'is-surecleri-otomasyonu': 'business-process-automation', 'b2b-b2c-platform-gelistirme': 'b2b-b2c-platform-development',
  'saas-yazilim-gelistirme': 'saas-development', 'dashboard-raporlama-sistemleri': 'dashboard-reporting-systems',
  'musteri-bayi-portali': 'customer-dealer-portals', 'stok-siparis-yonetim-sistemleri': 'inventory-order-management',
  'yapay-zeka-destekli-yazilim': 'ai-powered-software-solutions', 'yazilim-modernizasyonu': 'software-modernization',
}

export const serviceSlugPairs = services.map((service) => ({ tr: service.slug, en: serviceSlugMap[service.slug] }))
export const toEnglishServiceSlug = (slug: string) => serviceSlugMap[slug]
export const toTurkishServiceSlug = (slug: string) => serviceSlugPairs.find((pair) => pair.en === slug)?.tr

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

  if (current.startsWith('/en')) {
    return Object.entries(staticPairs).find(([, en]) => en === current)?.[0] || '/'
  }
  return staticPairs[current] || '/en'
}
