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
import type { HubContentCard, HubLocationCard, HubProcessStep, HubRegionCard, HubSections, HubServiceCard } from '@/lib/local-seo/hub-content'
import { getLocalService } from '@/lib/services/service-registry'
import { cn } from '@/lib/utils'

const WHY_ICONS = [Layers, Shield, Zap, Globe, RefreshCw, Headphones] as const

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

export function HubServiceGridSection({ title, cards }: { title: string; cards: HubServiceCard[] }) {
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
                Detaylı incele
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

export function HubRegionGridSection({ title, cards }: { title: string; cards: HubRegionCard[] }) {
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
                {card.cityCount} il
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Bölgeyi incele
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

export function HubFaqAndCta({ faqs }: { faqs: { question: string; answer: string }[] }) {
  return (
    <>
      <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold">Sık sorulan sorular</h2>
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
              <h2 className="font-display text-3xl font-bold">Projenizi Birlikte Planlayalım</h2>
              <p className="mt-4 max-w-2xl text-primary-foreground/80">
                İşletmenize özel yazılım, web, otomasyon veya dijital büyüme ihtiyacınızı Pars Medya ekibiyle değerlendirin.
              </p>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/iletisim" className={buttonVariants({ size: 'lg', className: 'h-11 bg-accent px-5 text-accent-foreground hover:bg-accent/90' })}>
              Projenizi Anlatın
            </Link>
            <Link href="mailto:info@parsmedya.net" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 border-primary-foreground/20 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10' })}>
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function HubContentSections({ sections }: { sections: HubSections }) {
  return (
    <>
      <HubOverviewSection title={sections.overviewTitle} paragraphs={sections.overviewParagraphs} />
      {sections.serviceCards.length > 0 ? (
        <HubServiceGridSection title="Hangi Hizmetleri Sunuyoruz?" cards={sections.serviceCards} />
      ) : null}
      <HubProcessSection title={sections.processTitle} steps={sections.processSteps} />
      {sections.solutionCards?.length ? (
        <HubCardGridSection title={sections.solutionTitle || 'Sunduğumuz Çözümler'} cards={sections.solutionCards} />
      ) : null}
      {sections.digitalizationAreas?.length ? (
        <HubCardGridSection title={sections.digitalizationTitle || 'Dijitalleştirme Alanları'} cards={sections.digitalizationAreas} />
      ) : null}
      {sections.useCases?.length ? (
        <HubCardGridSection title={sections.useCaseTitle || 'Örnek Kullanım Alanları'} cards={sections.useCases} />
      ) : null}
      {sections.audienceCards?.length ? (
        <HubCardGridSection title={sections.audienceTitle || 'Kimler İçin Uygun?'} cards={sections.audienceCards} />
      ) : null}
      {sections.sectors?.length ? (
        <HubCardGridSection title={sections.sectorTitle || 'Hangi Sektörlere Uygun?'} cards={sections.sectors} />
      ) : null}
      {sections.regionCards?.length ? (
        <HubRegionGridSection title="Hizmet Verdiğimiz Bölgeler" cards={sections.regionCards} />
      ) : null}
      {sections.popularServices?.length ? (
        <HubPopularServicesSection title={sections.popularServicesTitle || 'Popüler Hizmetler'} cards={sections.popularServices} />
      ) : null}
      <HubWhySection title={sections.whyTitle} cards={sections.whyCards} />
      {sections.locationCards?.length ? (
        <HubLocationGridSection
          title={sections.locationSectionTitle || 'Lokasyonlar'}
          cards={sections.locationCards}
        />
      ) : null}
    </>
  )
}
