import { services } from '@/lib/services'
import { englishServices } from '@/lib/services-en'
import type { Locale } from '@/lib/i18n'

export type NavigationLink = { label: string; href: string }
export type NavigationGroup = { label: string; links: NavigationLink[] }

const corporate: Record<Locale, NavigationLink[]> = {
  tr: [
    { label: 'Hakkımızda', href: '/tr/hakkimizda' },
    { label: 'Vizyonumuz', href: '/tr/vizyonumuz' },
    { label: 'Misyonumuz', href: '/tr/misyonumuz' },
  ],
  en: [
    { label: 'About Us', href: '/en/about' },
    { label: 'Our Vision', href: '/en/vision' },
    { label: 'Our Mission', href: '/en/mission' },
  ],
}

const categoryOrder = ['Web ve Dijital', 'Kurumsal Yazılımlar', 'Platform ve Entegrasyon', 'Yeni Teknolojiler', 'Dijital Büyüme']
const categoryLabels: Record<Locale, Record<string, string>> = {
  tr: { 'Web ve Dijital': 'Web ve Yazılım', 'Kurumsal Yazılımlar': 'Kurumsal Çözümler', 'Platform ve Entegrasyon': 'Platform ve Entegrasyon', 'Yeni Teknolojiler': 'Yeni Teknolojiler', 'Dijital Büyüme': 'Dijital Hizmetler' },
  en: { 'Web ve Dijital': 'Web & Software', 'Kurumsal Yazılımlar': 'Enterprise Solutions', 'Platform ve Entegrasyon': 'Platforms & Integrations', 'Yeni Teknolojiler': 'Emerging Technology', 'Dijital Büyüme': 'Digital Services' },
}

export function getCorporateLinks(locale: Locale) {
  return corporate[locale]
}

export function getServiceCategoryLabel(category: string | undefined, locale: Locale) {
  const key = category || 'Dijital Büyüme'
  return categoryLabels[locale][key] || key
}

export function getServiceGroups(locale: Locale): NavigationGroup[] {
  const source = locale === 'en' ? englishServices : services
  const prefix = locale === 'en' ? '/en/services' : '/tr/hizmetler'
  return categoryOrder.map((category) => ({
    label: categoryLabels[locale][category],
    links: source
      .filter((service) => (service.category || 'Dijital Büyüme') === category)
      .map((service) => ({ label: service.title, href: `${prefix}/${service.slug}` })),
  })).filter((group) => group.links.length > 0)
}
