import type { Service } from '@/lib/services'

/**
 * SEO fields for the six original services, which had none (Ö15 / bulgu 19), and the intent split
 * that keeps overlapping services from competing for the same query (bulgu 18). URLs are unchanged;
 * each pair links to its counterpart through relatedSlugs.
 *   web-sitesi-gelistirme  → corporate / showcase websites   (web-yazilim-gelistirme → web apps, panels)
 *   mobil-uygulama         → brand apps, one codebase, stores (mobil-uygulama-gelistirme → product apps tied to business systems)
 *   e-ticaret-cozumleri    → ready-to-sell store setup         (e-ticaret-yazilimi → custom commerce infrastructure)
 */
export const LEGACY_SERVICE_SEO: Record<string, Pick<Service, 'seoTitle' | 'seoDescription' | 'relatedSlugs'>> = {
  'web-sitesi-gelistirme': {
    seoTitle: 'Kurumsal Web Sitesi Geliştirme | SEO Uyumlu | Pars Medya',
    seoDescription: 'Markanızı yansıtan, hızlı açılan ve SEO uyumlu kurumsal web siteleri. Kolay içerik yönetimi, mobil uyumlu tasarım ve ölçülebilir performansla Pars Medya.',
    relatedSlugs: ['web-yazilim-gelistirme', 'seo-dijital-pazarlama', 'ui-ux-tasarim'],
  },
  'mobil-uygulama': {
    seoTitle: 'iOS ve Android Mobil Uygulama | Tek Kod Tabanı | Pars Medya',
    seoDescription: 'Markanız için iOS ve Android uygulamalarını tek kod tabanıyla tasarlıyor, geliştiriyor ve App Store ile Google Play’de yayına alıyoruz. Bakım desteği dahil.',
    relatedSlugs: ['mobil-uygulama-gelistirme', 'ui-ux-tasarim', 'api-sistem-entegrasyonlari'],
  },
  'e-ticaret-cozumleri': {
    seoTitle: 'E-Ticaret Sitesi Kurulumu ve Yönetimi | Pars Medya',
    seoDescription: 'Güvenli ödeme, kolay ürün ve sipariş yönetimiyle satışa hazır e-ticaret sitesi kurulumu. Pazaryeri ve kargo bağlantıları, mağaza taşıma desteğiyle Pars Medya.',
    relatedSlugs: ['e-ticaret-yazilimi', 'seo-dijital-pazarlama', 'stok-siparis-yonetim-sistemleri'],
  },
  'seo-dijital-pazarlama': {
    seoTitle: 'SEO ve Dijital Pazarlama Hizmetleri | Pars Medya',
    seoDescription: 'Teknik SEO, içerik stratejisi ve reklam yönetimiyle nitelikli görünürlük ve dönüşüm. Aylık raporlar ve canlı panellerle bütçenizi ölçülebilir biçimde yönetin.',
    relatedSlugs: ['web-sitesi-gelistirme', 'e-ticaret-cozumleri', 'ui-ux-tasarim'],
  },
  'ui-ux-tasarim': {
    seoTitle: 'UI/UX Tasarım Hizmetleri | Arayüz ve Deneyim | Pars Medya',
    seoDescription: 'Kullanıcı araştırması, bilgi mimarisi, prototip ve kullanılabilirlik testleriyle markanızı yansıtan, dönüşüm odaklı web ve uygulama arayüzleri tasarlıyoruz.',
    relatedSlugs: ['web-sitesi-gelistirme', 'mobil-uygulama-gelistirme', 'web-yazilim-gelistirme'],
  },
  'yazilim-danismanligi': {
    seoTitle: 'Yazılım Danışmanlığı ve Teknik Mimari | Pars Medya',
    seoDescription: 'Teknik denetim, bulut mimarisi, güvenlik incelemesi ve geliştirme süreçlerinde ekibinize yol gösteren yazılım danışmanlığı ve gerektiğinde geliştirme desteği.',
    relatedSlugs: ['yazilim-modernizasyonu', 'ozel-yazilim-gelistirme', 'api-sistem-entegrasyonlari'],
  },
}

export function withLegacySeo(service: Service): Service {
  const seo = LEGACY_SERVICE_SEO[service.slug]
  return seo ? { ...service, ...seo } : service
}
