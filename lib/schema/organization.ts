import { CONTACT_EMAIL, MOBILE_PHONE, OFFICE_PHONE } from '@/lib/contact-info'
import type { Locale } from '@/lib/i18n'
import { canonicalAbsoluteUrl } from '@/lib/site-url'

/**
 * One source of truth for the Pars Medya entity in structured data.
 * The full Organization and WebSite nodes are printed once per page by the root layout;
 * every other graph links to them by @id instead of repeating the details.
 *
 * NAP (name, address, phone) must stay identical to the visible contact blocks and to the
 * Google Business Profile. Street address, postal code and social profiles are intentionally
 * missing until the owner confirms them (see BUSINESS_PROFILE_TODO).
 */
export const SITE_ORIGIN = canonicalAbsoluteUrl('/')
export const ORG_ID = `${SITE_ORIGIN}/#organization`
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`
export const BRAND_NAME = 'Pars Medya'

export const LOGO = {
  url: canonicalAbsoluteUrl('/parsmedya-logo.png'),
  width: 1920,
  height: 385,
} as const

/** Real profile URLs (LinkedIn, Instagram, Google Business Profile) go here once confirmed. */
export const SAME_AS: string[] = []

/** Details the owner still has to confirm before they can be published. */
export const BUSINESS_PROFILE_TODO = ['streetAddress', 'postalCode', 'sameAs', 'hasMap'] as const

export const BUSINESS_HOURS = {
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  opens: '09:00',
  closes: '18:00',
} as const

export const orgRef = () => ({ '@id': ORG_ID })
export const websiteRef = () => ({ '@id': WEBSITE_ID })

export function postalAddressNode() {
  return {
    '@type': 'PostalAddress',
    addressLocality: 'İstanbul',
    addressCountry: 'TR',
  }
}

export function contactPointNodes() {
  return [
    {
      '@type': 'ContactPoint',
      telephone: MOBILE_PHONE.international,
      contactType: 'sales',
      areaServed: 'TR',
      availableLanguage: ['Turkish', 'English'],
    },
    {
      '@type': 'ContactPoint',
      telephone: OFFICE_PHONE.international,
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: ['Turkish', 'English'],
    },
  ]
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: BRAND_NAME,
    alternateName: 'ParsMedya',
    url: `${SITE_ORIGIN}/`,
    logo: { '@type': 'ImageObject', url: LOGO.url, width: LOGO.width, height: LOGO.height },
    image: LOGO.url,
    email: CONTACT_EMAIL,
    telephone: MOBILE_PHONE.international,
    address: postalAddressNode(),
    areaServed: { '@type': 'Country', name: 'Türkiye' },
    contactPoint: contactPointNodes(),
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  }
}

/** No SearchAction: the site has no search feature. */
export function websiteNode(locale: Locale) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: BRAND_NAME,
    inLanguage: locale === 'en' ? 'en-US' : 'tr-TR',
    publisher: orgRef(),
  }
}

export function siteGraph(locale: Locale) {
  return { '@context': 'https://schema.org', '@graph': [organizationNode(), websiteNode(locale)] }
}

/** ProfessionalService node for the contact pages (Ö2). */
export function professionalServiceNode(locale: Locale) {
  const contactPath = locale === 'en' ? '/en/contact' : '/iletisim'
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${canonicalAbsoluteUrl(contactPath)}#business`,
    name: BRAND_NAME,
    url: `${SITE_ORIGIN}/`,
    image: LOGO.url,
    logo: LOGO.url,
    telephone: MOBILE_PHONE.international,
    email: CONTACT_EMAIL,
    address: postalAddressNode(),
    areaServed: { '@type': 'Country', name: locale === 'en' ? 'Turkey' : 'Türkiye' },
    contactPoint: contactPointNodes(),
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', ...BUSINESS_HOURS }],
    parentOrganization: orgRef(),
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  }
}
