import { services } from '@/lib/services'

export type Locale = 'tr' | 'en'

export const localeHomePath = (locale: Locale) => locale === 'en' ? '/en' : '/'

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

export function alternatePath(pathname: string): string {
  if (pathname.startsWith('/en/services/')) {
    const slug = toTurkishServiceSlug(pathname.split('/').pop() || '')
    return slug ? `/hizmetler/${slug}` : '/hizmetler'
  }
  if (pathname.startsWith('/hizmetler/')) {
    const slug = toEnglishServiceSlug(pathname.split('/').pop() || '')
    return slug ? `/en/services/${slug}` : '/en/services'
  }
  if (pathname.startsWith('/en/blog/')) return '/blog'
  if (pathname.startsWith('/blog/')) return '/en/blog'
  const pairs: Record<string, string> = { '/': '/en', '/hakkimizda': '/en/about', '/vizyonumuz': '/en/vision', '/misyonumuz': '/en/mission', '/hizmetler': '/en/services', '/blog': '/en/blog', '/iletisim': '/en/contact' }
  if (pathname.startsWith('/en')) return Object.entries(pairs).find(([, en]) => en === pathname)?.[0] || '/'
  return pairs[pathname] || '/en'
}
