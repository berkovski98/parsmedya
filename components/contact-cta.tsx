import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { ContactActionsOnInk } from '@/components/contact-actions'
import { PixelField } from '@/components/pixel-field'
import { CONTACT_EMAIL } from '@/lib/contact-info'
import type { Locale } from '@/lib/i18n'

const content = {
  tr: {
    eyebrow: 'İletişim',
    title: 'Projenizi birlikte hayata geçirelim',
    text: 'Aklınızdaki fikri anlatın, size özel çözümü ve ücretsiz teklifi hazırlayalım. Uzman ekibimiz 24 saat içinde geri dönüş yapar.',
    cta: { label: 'Teklif Al', href: '/iletisim' },
  },
  en: {
    eyebrow: 'Contact',
    title: 'Let’s turn your next idea into a reliable digital product',
    text: 'Tell us about your goals. We will review the opportunity and return with a practical next step.',
    cta: { label: 'Start a Conversation', href: '/en/contact' },
  },
} as const

export function ContactCta({ locale = 'tr' }: { locale?: Locale }) {
  const t = content[locale]
  return (
    <section id={locale === 'tr' ? 'iletisim' : undefined} data-track="cta" className="bg-background px-4 pb-16 pt-6 sm:px-6 md:pb-24 md:pt-10">
      <div data-reveal="scale" className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-3xl bg-ink px-6 py-14 text-ink-foreground sm:px-12 md:py-20 lg:px-16">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 bg-right-top text-white [mask-image:radial-gradient(ellipse_70%_90%_at_100%_0%,#000,transparent_70%)]" />
        <PixelField className="-z-10 hidden md:block [mask-image:radial-gradient(ellipse_70%_90%_at_100%_0%,#000,transparent_70%)]" />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow eyebrow-on-ink">{t.eyebrow}</p>
            <h2 className="text-display mt-5 max-w-2xl text-balance text-[2.1rem] text-white sm:text-5xl">{t.title}</h2>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/70">{t.text}</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <Link href={t.cta.href} className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-[0.9375rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {t.cta.label}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <ContactActionsOnInk locale={locale} />
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 pt-1 text-sm text-white/65 transition-colors hover:text-white lg:justify-end">
              <Mail className="h-4 w-4" aria-hidden="true" />{CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
