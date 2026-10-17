import { Phone } from 'lucide-react'
import { WhatsAppIcon } from '@/components/contact-actions'
import { CONTACT_LABELS, MOBILE_PHONE, phoneDisplay, whatsappHref } from '@/lib/contact-info'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/** WhatsApp + call buttons for local landing pages; `tone` matches a light hero or a dark CTA band. */
export function LocalContactActions({ locale, tone = 'light' }: { locale: Locale; tone?: 'light' | 'dark' }) {
  const text = CONTACT_LABELS[locale]
  const base = 'group inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
  return (
    <>
      <a href={whatsappHref(locale)} target="_blank" rel="noopener noreferrer" aria-label={text.whatsappAria} data-track="local_page" className={cn(base, 'bg-[#25D366] text-ink')}>
        <WhatsAppIcon className="size-4" />{text.whatsappShort}
      </a>
      <a href={MOBILE_PHONE.href} data-track="local_page" aria-label={`${text.callUs}: ${phoneDisplay(locale)}`} className={cn(base, tone === 'light' ? 'border border-border bg-background text-foreground hover:border-foreground/30' : 'border border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10')}>
        <Phone className="h-4 w-4" aria-hidden="true" /><span className="tabular-nums">{phoneDisplay(locale)}</span>
      </a>
    </>
  )
}
