export const serviceSlugMap: Record<string, string> = {
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

const enToTrMap = new Map(Object.entries(serviceSlugMap).map(([tr, en]) => [en, tr]))

import { services } from '@/lib/services'

export const serviceSlugPairs = services.map((service) => ({ tr: service.slug, en: serviceSlugMap[service.slug] }))
export const toEnglishServiceSlug = (slug: string) => serviceSlugMap[slug]
export const toTurkishServiceSlug = (slug: string) => enToTrMap.get(slug)
