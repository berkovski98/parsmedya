import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { WhatsAppIcon } from '@/components/contact-actions'
import type { Locale } from '@/lib/i18n'
import { CONTACT_EMAIL, CONTACT_LABELS, MOBILE_PHONE, OFFICE_PHONE, officePhoneDisplay, phoneDisplay, whatsappHref } from '@/lib/contact-info'

/** Contact methods for the contact pages: WhatsApp and mobile first, office line and email kept. */
export function ContactChannels({ locale }: { locale: Locale }) {
  const english = locale === 'en'
  const text = CONTACT_LABELS[locale]
  const row = 'group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_16px_40px_-24px_rgb(10_20_50/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5'
  const icon = 'flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105'
  const arrow = <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />

  return (
    <div className="mt-10 space-y-3" data-track="contact_page">
      <a href={whatsappHref(locale)} target="_blank" rel="noopener noreferrer" aria-label={text.whatsappAria} className={row}>
        <span className={`${icon} bg-[#25D366] text-ink`}><WhatsAppIcon className="size-6" /></span>
        <span className="min-w-0">
          <span className="block text-sm text-muted-foreground">{english ? 'Fastest reply' : 'En hızlı yanıt'}</span>
          <span className="block font-display text-lg font-bold text-foreground">{text.whatsapp}</span>
        </span>
        {arrow}
      </a>
      <a href={MOBILE_PHONE.href} className={row}>
        <span className={`${icon} bg-ink text-accent`}><Phone className="h-5 w-5" aria-hidden="true" /></span>
        <span className="min-w-0">
          <span className="block text-sm text-muted-foreground">{text.phone}</span>
          <span className="block font-display text-lg font-bold tabular-nums text-foreground">{phoneDisplay(locale)}</span>
        </span>
        {arrow}
      </a>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={`mailto:${CONTACT_EMAIL}`} className={row}>
          <span className={`${icon} size-10 bg-secondary text-primary`}><Mail className="h-4 w-4" aria-hidden="true" /></span>
          <span className="min-w-0">
            <span className="block text-sm text-muted-foreground">{text.email}</span>
            <span className="block truncate font-semibold text-foreground">{CONTACT_EMAIL}</span>
          </span>
        </a>
        <a href={OFFICE_PHONE.href} className={row}>
          <span className={`${icon} size-10 bg-secondary text-primary`}><Phone className="h-4 w-4" aria-hidden="true" /></span>
          <span className="min-w-0">
            <span className="block text-sm text-muted-foreground">{text.office}</span>
            <span className="block font-semibold tabular-nums text-foreground">{officePhoneDisplay(locale)}</span>
          </span>
        </a>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 px-1 pt-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-accent-strong" aria-hidden="true" />{english ? 'Istanbul, Türkiye' : 'İstanbul, Türkiye'}</span>
        <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-accent-strong" aria-hidden="true" />{english ? 'Weekdays 09:00 – 18:00' : 'Hafta içi 09:00 – 18:00'}</span>
      </div>
    </div>
  )
}
