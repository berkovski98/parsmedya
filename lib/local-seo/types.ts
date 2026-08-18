export type LocalSeoFaq = {
  question: string
  answer: string
}

export type LocalSeoOverride = {
  locale: string
  city_slug: string
  district_slug: string | null
  service_slug: string
  seo_title: string | null
  meta_description: string | null
  hero_title: string | null
  hero_description: string | null
  content_json: { intro?: string; locationIntro?: string } | null
  faq_json: LocalSeoFaq[] | null
  is_indexable: boolean
}

export function overrideKey(city: string, district: string | null, service: string) {
  return `${city}::${district || ''}::${service}`
}
