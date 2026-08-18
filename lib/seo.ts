import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { canonicalAbsoluteUrl } from '@/lib/site-url'

export const DEFAULT_SOCIAL_IMAGE = '/parsmedya-hero.png'

export function absoluteAlternates(
  canonical: string,
  languages: Record<string, string>,
): Metadata['alternates'] {
  return {
    canonical: canonicalAbsoluteUrl(canonical),
    languages: Object.fromEntries(
      Object.entries(languages).map(([key, value]) => [key, canonicalAbsoluteUrl(value)]),
    ),
  }
}

export function localizedAlternates(canonical: string, tr: string, en: string): Metadata['alternates'] {
  return absoluteAlternates(canonical, { tr, en, 'x-default': tr })
}

export function createPageMetadata({ title, description, canonical, tr, en, locale, image = DEFAULT_SOCIAL_IMAGE, type = 'website' }: { title: string; description: string; canonical: string; tr: string; en: string; locale: Locale; image?: string; type?: 'website' | 'article' }): Metadata {
  const canonicalUrl = canonicalAbsoluteUrl(canonical)
  return {
    title,
    description,
    alternates: localizedAlternates(canonical, tr, en),
    openGraph: {
      type,
      title,
      description,
      url: canonicalUrl,
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
