import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Headphones,
  Layers,
  RefreshCw,
  Shield,
  Zap,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n'
import type { HubContentCard, HubLocationCard, HubProcessStep, HubRegionCard, HubSections, HubServiceCard } from '@/lib/local-seo/hub-content'
import { getLocalService } from '@/lib/services/service-registry'
import { cn } from '@/lib/utils'

const WHY_ICONS = [Layers, Shield, Zap, Globe, RefreshCw, Headphones] as const

/** Fixed hub labels per language; TR and EN hubs share these components. */
const HUB_COPY = {
  tr: {
    details: 'Detaylı incele',
    cities: 'il',
    viewRegion: 'Bölgeyi incele',
    servicesTitle: 'Hangi Hizmetleri Sunuyoruz?',
    regionsTitle: 'Hizmet Verdiğimiz Bölgeler',
    solutions: 'Sunduğumuz Çözümler',
    digitalization: 'Dijitalleştirme Alanları',
    useCases: 'Örnek Kullanım Alanları',
    audience: 'Kimler İçin Uygun?',
    sectors: 'Hangi Sektörlere Uygun?',
    popular: 'Popüler Hizmetler',
    locations: 'Lokasyonlar',
    faq: 'Sık sorulan sorular',
    ctaTitle: 'Projenizi Birlikte Planlayalım',
    ctaText: 'İşletmenize özel yazılım, web, otomasyon veya dijital büyüme ihtiyacınızı Pars Medya ekibiyle değerlendirin.',
    ctaPrimary: 'Projenizi Anlatın',
    ctaSecondary: 'İletişime Geçin',
    contactHref: '/iletisim',
  },
  en: {
    details: 'Learn more',
    cities: 'provinces',
    viewRegion: 'View region',
    servicesTitle: 'What We Offer',
    regionsTitle: 'Regions We Serve',
    solutions: 'Solutions We Deliver',
    digitalization: 'Digitalization Areas',
    useCases: 'Example Use Cases',
    audience: 'Who Is It For?',
    sectors: 'Industries We Serve',
    popular: 'Popular Services',
    locations: 'Locations',
    faq: 'Frequently asked questions',
    ctaTitle: 'Plan Your Project With Us',
    ctaText: 'Discuss your software, web, automation or digital growth needs with the Pars Medya team.',
    ctaPrimary: 'Tell Us About Your Project',
    ctaSecondary: 'Get in Touch',
    contactHref: '/en/contact',
  },
} as const satisfies Record<Locale, Record<string, string>>

function SectionShell({
  title,
  children,
  className,
  id,
}: {
  title: string
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={cn('border-b border-border py-12 sm:py-16', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

export function HubOverviewSection({ title, paragraphs }: { title: string; paragraphs: string[] }) {
  return (
    <SectionShell title={title}>
      <div className="max-w-3xl space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="text-pretty leading-relaxed text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </SectionShell>
  )
}

export function HubServiceGridSection({ title, cards, locale = 'tr' }: { title: string; cards: HubServiceCard[]; locale?: Locale }) {
  return (
    <SectionShell title={title} className="bg-secondary/40">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const service = getLocalService(card.slug)
          const Icon = service?.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/30"
            >
              {Icon ? (
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              ) : null}
              <p className="mt-4 font-display font-semibold group-hover:text-primary">{card.title}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                {HUB_COPY[locale].details}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        })}
      </div>
    </SectionShell>
  )
}

export function HubCardGridSection({ title, cards }: { title: string; cards: HubContentCard[] }) {
  return (
    <SectionShell title={title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="font-display font-semibold">{card.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}

export function HubProcessSection({ title, steps }: { title: string; steps: HubProcessStep[] }) {
  return (
    <SectionShell title={title} className="bg-secondary/40">
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="relative rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              {String(index + 1).padStart(2, '0')}
            </p>
            <p className="mt-2 font-display font-semibold">{step.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </SectionShell>
  )
}

export function HubWhySection({ title, cards }: { title: string; cards: HubContentCard[] }) {
  return (
    <SectionShell title={title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = WHY_ICONS[index % WHY_ICONS.length]
          return (
            <div key={card.title} className="flex gap-3 rounded-2xl border border-border bg-card p-5">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display font-semibold">{card.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}

export function HubRegionGridSection({ title, cards, locale = 'tr' }: { title: string; cards: HubRegionCard[]; locale?: Locale }) {
  return (
    <SectionShell title={title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/60"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display text-lg font-semibold group-hover:text-primary">{card.name}</p>
              <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {card.cityCount} {HUB_COPY[locale].cities}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              {HUB_COPY[locale].viewRegion}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </SectionShell>
  )
}

export function HubLocationGridSection({ title, cards }: { title: string; cards: HubLocationCard[] }) {
  return (
    <SectionShell title={title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <p className="font-display font-semibold group-hover:text-primary">{card.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              {card.cta}
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </SectionShell>
  )
}

export function HubPopularServicesSection({ title, cards }: { title: string; cards: HubServiceCard[] }) {
  if (!cards.length) return null
  return (
    <SectionShell title={title}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
          >
            <p className="font-display font-semibold">{card.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
          </Link>
        ))}
      </div>
    </SectionShell>
  )
}

export function HubFaqAndCta({ faqs, locale = 'tr' }: { faqs: { question: string; answer: string }[]; locale?: Locale }) {
  const copy = HUB_COPY[locale]
  return (
    <>
      <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold">{copy.faq}</h2>
          <div className="mt-8 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-border bg-card p-5">
                <summary className="cursor-pointer font-display font-semibold">{faq.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-accent" />
            <div>
              <h2 className="font-display text-3xl font-bold">{copy.ctaTitle}</h2>
              <p className="mt-4 max-w-2xl text-primary-foreground/80">
                {copy.ctaText}
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={copy.contactHref} className={buttonVariants({ size: 'lg', className: 'h-11 bg-accent px-5 text-accent-foreground hover:bg-accent/90' })}>
              {copy.ctaPrimary}
            </Link>
            <Link href="mailto:info@parsmedya.net" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 border-primary-foreground/20 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10' })}>
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function HubContentSections({ sections, locale = 'tr' }: { sections: HubSections; locale?: Locale }) {
  const copy = HUB_COPY[locale]
  return (
    <>
      <HubOverviewSection title={sections.overviewTitle} paragraphs={sections.overviewParagraphs} />
      {sections.serviceCards.length > 0 ? (
        <HubServiceGridSection title={copy.servicesTitle} cards={sections.serviceCards} locale={locale} />
      ) : null}
      <HubProcessSection title={sections.processTitle} steps={sections.processSteps} />
      {sections.solutionCards?.length ? (
        <HubCardGridSection title={sections.solutionTitle || copy.solutions} cards={sections.solutionCards} />
      ) : null}
      {sections.digitalizationAreas?.length ? (
        <HubCardGridSection title={sections.digitalizationTitle || copy.digitalization} cards={sections.digitalizationAreas} />
      ) : null}
      {sections.useCases?.length ? (
        <HubCardGridSection title={sections.useCaseTitle || copy.useCases} cards={sections.useCases} />
      ) : null}
      {sections.audienceCards?.length ? (
        <HubCardGridSection title={sections.audienceTitle || copy.audience} cards={sections.audienceCards} />
      ) : null}
      {sections.sectors?.length ? (
        <HubCardGridSection title={sections.sectorTitle || copy.sectors} cards={sections.sectors} />
      ) : null}
      {sections.regionCards?.length ? (
        <HubRegionGridSection title={copy.regionsTitle} cards={sections.regionCards} locale={locale} />
      ) : null}
      {sections.popularServices?.length ? (
        <HubPopularServicesSection title={sections.popularServicesTitle || copy.popular} cards={sections.popularServices} />
      ) : null}
      <HubWhySection title={sections.whyTitle} cards={sections.whyCards} />
      {sections.locationCards?.length ? (
        <HubLocationGridSection
          title={sections.locationSectionTitle || copy.locations}
          cards={sections.locationCards}
        />
      ) : null}
    </>
  )
}
