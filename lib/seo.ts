import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { canonicalAbsoluteUrl } from '@/lib/site-url'

export const SITE_NAME = 'Pars Medya'
export const DEFAULT_SOCIAL_IMAGE = '/og/parsmedya-og-1200x630.jpg'
export const DEFAULT_SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 } as const

export const ogLocale = (locale: Locale) => (locale === 'en' ? 'en_US' : 'tr_TR')
export const ogAlternateLocale = (locale: Locale) => (locale === 'en' ? 'tr_TR' : 'en_US')

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

/** tr/en/x-default cluster. Pass `en: null` for pages without an English equivalent. */
export function localizedAlternates(canonical: string, tr: string, en: string | null): Metadata['alternates'] {
  return absoluteAlternates(canonical, en ? { tr, en, 'x-default': tr } : { tr, 'x-default': tr })
}

/** Image entry for openGraph.images; the default share image carries its real size. */
export function socialImage(image: string, alt: string) {
  return image === DEFAULT_SOCIAL_IMAGE ? { url: image, alt, ...DEFAULT_SOCIAL_IMAGE_SIZE } : { url: image, alt }
}

export function createPageMetadata({
  title,
  description,
  canonical,
  tr,
  en,
  locale,
  image = DEFAULT_SOCIAL_IMAGE,
  type = 'website',
  index = true,
}: {
  title: string
  description: string
  canonical: string
  tr: string
  en: string | null
  locale: Locale
  image?: string
  type?: 'website' | 'article'
  index?: boolean
}): Metadata {
  const canonicalUrl = canonicalAbsoluteUrl(canonical)
  return {
    title,
    description,
    alternates: localizedAlternates(canonical, tr, en),
    ...(index ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      locale: ogLocale(locale),
      alternateLocale: [ogAlternateLocale(locale)],
      images: [socialImage(image, title)],
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
