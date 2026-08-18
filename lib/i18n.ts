import { services } from '@/lib/services'

export type Locale = 'tr' | 'en'

export const localeHomePath = (locale: Locale) => locale === 'en' ? '/en' : '/tr'

export function localeFromPathname(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'tr'
}

export function trPath(path = '') {
  if (!path || path === '/') return '/tr'
  return path.startsWith('/tr') ? path : `/tr${path.startsWith('/') ? path : `/${path}`}`
}

export function enPath(path = '') {
  if (!path || path === '/') return '/en'
  return path.startsWith('/en') ? path : `/en${path.startsWith('/') ? path : `/${path}`}`
}

export const paths = {
  home: (locale: Locale) => localeHomePath(locale),
  about: (locale: Locale) => locale === 'en' ? '/en/about' : '/tr/hakkimizda',
  vision: (locale: Locale) => locale === 'en' ? '/en/vision' : '/tr/vizyonumuz',
  mission: (locale: Locale) => locale === 'en' ? '/en/mission' : '/tr/misyonumuz',
  services: (locale: Locale) => locale === 'en' ? '/en/services' : '/tr/hizmetler',
  service: (locale: Locale, slug: string) => `${locale === 'en' ? '/en/services' : '/tr/hizmetler'}/${slug}`,
  blog: (locale: Locale) => locale === 'en' ? '/en/blog' : '/tr/blog',
  blogPost: (locale: Locale, slug: string) => `${locale === 'en' ? '/en/blog' : '/tr/blog'}/${slug}`,
  contact: (locale: Locale) => locale === 'en' ? '/en/contact' : '/tr/iletisim',
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
  '/tr': '/en',
  '/tr/hakkimizda': '/en/about',
  '/tr/vizyonumuz': '/en/vision',
  '/tr/misyonumuz': '/en/mission',
  '/tr/hizmetler': '/en/services',
  '/tr/blog': '/en/blog',
  '/tr/iletisim': '/en/contact',
}

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname || '/tr'
}

function canonicalizeSwitchPath(pathname: string) {
  const current = normalizePath(pathname)
  if (current === '/') return '/tr'
  if (current === '/vizyon') return '/tr/vizyonumuz'
  if (current === '/misyon') return '/tr/misyonumuz'
  if (current.startsWith('/tr') || current.startsWith('/en') || current.startsWith('/admin')) return current
  return `/tr${current}`
}

export function alternatePath(pathname: string): string {
  const current = canonicalizeSwitchPath(pathname)

  if (current.startsWith('/en/services/')) {
    const slug = toTurkishServiceSlug(current.split('/').pop() || '')
    return slug ? `/tr/hizmetler/${slug}` : '/tr/hizmetler'
  }
  if (current.startsWith('/tr/hizmetler/')) {
    const slug = toEnglishServiceSlug(current.split('/').pop() || '')
    return slug ? `/en/services/${slug}` : '/en/services'
  }
  if (current.startsWith('/en/blog/')) return '/tr/blog'
  if (current.startsWith('/tr/blog/')) return '/en/blog'

  if (current.startsWith('/en')) {
    return Object.entries(staticPairs).find(([, en]) => en === current)?.[0] || '/tr'
  }
  return staticPairs[current] || '/en'
}
