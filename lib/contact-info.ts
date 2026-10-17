import type { Locale } from '@/lib/i18n'

export const CONTACT_EMAIL = 'info@parsmedya.net'

/** Primary mobile line, also used for WhatsApp. */
export const MOBILE_PHONE = {
  display: '0539 840 18 98',
  international: '+90 539 840 18 98',
  href: 'tel:+905398401898',
} as const

/** Existing office landline, kept as a secondary contact option. */
export const OFFICE_PHONE = {
  display: '0212 963 77 77',
  international: '+90 212 963 77 77',
  href: 'tel:+902129637777',
} as const

const WHATSAPP_NUMBER = '905398401898'

export const WHATSAPP_MESSAGES: Record<Locale, string> = {
  tr: 'Merhaba Pars Medya, hizmetleriniz hakkında bilgi almak istiyorum.',
  en: 'Hello Pars Medya, I would like to learn more about your services.',
}

export function whatsappHref(locale: Locale) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGES[locale])}`
}

export function phoneDisplay(locale: Locale) {
  return locale === 'en' ? MOBILE_PHONE.international : MOBILE_PHONE.display
}

export function officePhoneDisplay(locale: Locale) {
  return locale === 'en' ? OFFICE_PHONE.international : OFFICE_PHONE.display
}

export const CONTACT_LABELS = {
  tr: {
    call: 'Hemen Ara',
    callUs: 'Bizi arayın',
    whatsapp: 'WhatsApp ile Yazın',
    whatsappShort: 'WhatsApp',
    whatsappAria: 'WhatsApp üzerinden Pars Medya ile iletişime geçin (yeni sekmede açılır)',
    phone: 'Telefon',
    office: 'Ofis',
    email: 'E-posta',
    quote: 'Teklif Al',
  },
  en: {
    call: 'Call Now',
    callUs: 'Call us',
    whatsapp: 'Message on WhatsApp',
    whatsappShort: 'WhatsApp',
    whatsappAria: 'Contact Pars Medya on WhatsApp (opens in a new tab)',
    phone: 'Phone',
    office: 'Office',
    email: 'Email',
    quote: 'Get a Quote',
  },
} as const satisfies Record<Locale, Record<string, string>>
