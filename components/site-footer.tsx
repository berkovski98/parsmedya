import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { ContactActionsOnInk } from '@/components/contact-actions'
import { localeHomePath, paths, type Locale } from '@/lib/i18n'
import { CONTACT_EMAIL, CONTACT_LABELS, MOBILE_PHONE, OFFICE_PHONE, officePhoneDisplay, phoneDisplay } from '@/lib/contact-info'
import { LEGAL_PAGES_PUBLISHED, REFERENCES_PUBLISHED } from '@/lib/company-profile'
import { LEGAL_LINKS, REFERENCES_PATHS } from '@/lib/legal-pages'
import { getCorporateLinks } from '@/lib/navigation'
import { EDI_COPY, EDI_PATHS } from '@/lib/edi'
import { services } from '@/lib/services'
import { englishServices } from '@/lib/services-en'

const columnTitle = 'text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/45'
const footerLink = 'group inline-flex items-center gap-1 text-[0.9375rem] text-white/70 transition-colors duration-300 hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

export function SiteFooter({ locale = 'tr' }: { locale?: Locale }) {
  const english = locale === 'en'
  const text = CONTACT_LABELS[locale]
  const featured = (english ? englishServices : services).filter((service) => service.featuredOnHome).slice(0, 6)
  // Legal pages are linked only once their texts are complete (LEGAL_PAGES_PUBLISHED).
  const legalLinks = LEGAL_PAGES_PUBLISHED
    ? (english
        ? [{ label: 'Privacy Policy', href: LEGAL_LINKS.en.privacy }, { label: 'Cookie Policy', href: LEGAL_LINKS.en.cookies }, { label: 'Terms of Use', href: LEGAL_LINKS.en.terms }]
        : [{ label: 'KVKK Aydınlatma Metni', href: LEGAL_LINKS.tr.kvkk }, { label: 'Gizlilik Politikası', href: LEGAL_LINKS.tr.privacy }, { label: 'Çerez Politikası', href: LEGAL_LINKS.tr.cookies }, { label: 'Kullanım Koşulları', href: LEGAL_LINKS.tr.terms }])
    : []
  const explore = [
    { label: english ? 'Services' : 'Hizmetler', href: paths.services(locale) },
    { label: english ? 'Service Areas' : 'Bölgelerimiz', href: english ? '/en/service-areas' : '/hizmet-bolgeleri' },
    { label: 'Blog', href: paths.blog(locale) },
    ...(REFERENCES_PUBLISHED ? [{ label: english ? 'References' : 'Referanslar', href: REFERENCES_PATHS[locale] }] : []),
    { label: english ? 'Contact' : 'İletişim', href: paths.contact(locale) },
  ]

  return (
    <footer data-site-footer className="relative overflow-hidden bg-ink text-ink-foreground">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 text-white opacity-60 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr_1.3fr] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={localeHomePath(locale)} className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label={english ? 'Pars Medya home' : 'Pars Medya ana sayfa'}>
              <Image src="/parsmedya-logo.png" alt="Pars Medya" width={196} height={40} sizes="196px" className="h-8 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-white/60">
              {english
                ? 'Custom software, enterprise platforms and digital growth from Istanbul, for organizations across international markets.'
                : 'İstanbul merkezli; özel yazılım, kurumsal platformlar ve ölçülebilir dijital büyüme çözümleri geliştiren teknoloji ajansı.'}
            </p>
            <ContactActionsOnInk locale={locale} className="mt-7 [&>a]:h-11 [&>a]:px-4 [&>a]:text-sm sm:flex-row lg:flex-col" />
          </div>

          <nav aria-label={english ? 'Corporate' : 'Kurumsal'}>
            <p className={columnTitle}>{english ? 'Corporate' : 'Kurumsal'}</p>
            <ul className="mt-5 space-y-3">
              {getCorporateLinks(locale).map((item) => <li key={item.href}><Link href={item.href} className={footerLink}>{item.label}</Link></li>)}
            </ul>
          </nav>

          <nav aria-label={english ? 'Featured services' : 'Öne çıkan hizmetler'}>
            <p className={columnTitle}>{english ? 'Services' : 'Hizmetler'}</p>
            <ul className="mt-5 space-y-3">
              <li><Link href={EDI_PATHS[locale]} className={footerLink}>{EDI_COPY[locale].label}<span className="ml-1.5 rounded bg-accent/15 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-accent">EDI</span></Link></li>
              {featured.map((service) => <li key={service.slug}><Link href={paths.service(locale, service.slug)} className={footerLink}>{service.title}</Link></li>)}
            </ul>
          </nav>

          <nav aria-label={english ? 'Explore' : 'Keşfet'}>
            <p className={columnTitle}>{english ? 'Explore' : 'Keşfet'}</p>
            <ul className="mt-5 space-y-3">
              {explore.map((item) => <li key={item.href}><Link href={item.href} className={footerLink}>{item.label}<ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" /></Link></li>)}
            </ul>
          </nav>

          <div>
            <p className={columnTitle}>{english ? 'Contact' : 'İletişim'}</p>
            <address className="mt-5 space-y-4 not-italic">
              <a href={MOBILE_PHONE.href} className="flex items-start gap-3 text-white/80 transition-colors hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span><span className="block text-xs text-white/45">{text.phone} · WhatsApp</span><span className="font-semibold tabular-nums">{phoneDisplay(locale)}</span></span>
              </a>
              <a href={OFFICE_PHONE.href} className="flex items-start gap-3 text-white/80 transition-colors hover:text-white">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
                <span><span className="block text-xs text-white/45">{text.office}</span><span className="tabular-nums">{officePhoneDisplay(locale)}</span></span>
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-start gap-3 text-white/80 transition-colors hover:text-white">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
                <span><span className="block text-xs text-white/45">{text.email}</span>{CONTACT_EMAIL}</span>
              </a>
              <p className="flex items-start gap-3 text-sm text-white/60"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />{english ? 'Istanbul, Türkiye' : 'İstanbul, Türkiye'}</p>
              <p className="flex items-start gap-3 text-sm text-white/60"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />{english ? 'Weekdays 09:00 – 18:00' : 'Hafta içi 09:00 – 18:00'}</p>
            </address>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-sm text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Pars Medya. {english ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}</p>
          {legalLinks.length > 0 && (
            <nav aria-label={english ? 'Legal' : 'Yasal'}>
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {legalLinks.map((item) => <li key={item.href}><Link href={item.href} className="transition-colors hover:text-white">{item.label}</Link></li>)}
              </ul>
            </nav>
          )}
          <p className="flex items-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {english ? 'Istanbul · Dubai · Moscow · Switzerland' : 'İstanbul · Dubai · Moskova · İsviçre'}
          </p>
        </div>
      </div>
    </footer>
  )
}
