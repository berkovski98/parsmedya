import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'

export const DEFAULT_SOCIAL_IMAGE = '/parsmedya-hero.png'

export function localizedAlternates(canonical: string, tr: string, en: string): Metadata['alternates'] {
  return { canonical, languages: { tr, en, 'x-default': tr } }
}

export function createPageMetadata({ title, description, canonical, tr, en, locale, image = DEFAULT_SOCIAL_IMAGE, type = 'website' }: { title: string; description: string; canonical: string; tr: string; en: string; locale: Locale; image?: string; type?: 'website' | 'article' }): Metadata {
  return {
    title,
    description,
    alternates: localizedAlternates(canonical, tr, en),
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      locale: locale === 'en' ? 'en_US' : 'tr_TR',
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export const safeJsonLd = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c')
