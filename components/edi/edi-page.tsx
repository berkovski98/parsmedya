import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ChevronRight, ChevronDown, FileCheck2, Gauge, ListChecks, Repeat2, Send, Waypoints } from 'lucide-react'
import { ContactActionsOnInk } from '@/components/contact-actions'
import { ContactCta } from '@/components/contact-cta'
import { EdiFlow } from '@/components/edi/edi-flow'
import { PixelField } from '@/components/pixel-field'
import { EDI_COPY, EDI_PATHS } from '@/lib/edi'
import { localeHomePath, paths, type Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'
import { createPageMetadata, safeJsonLd } from '@/lib/seo'
import { canonicalAbsoluteUrl } from '@/lib/site-url'

const capabilityIcons = [Waypoints, ListChecks, Send, Repeat2, FileCheck2, Gauge]

export function ediMetadata(locale: Locale): Metadata {
  const t = EDI_COPY[locale]
  return createPageMetadata({ title: t.metaTitle, description: t.metaDescription, canonical: EDI_PATHS[locale], tr: EDI_PATHS.tr, en: EDI_PATHS.en, locale })
}

function ediJsonLd(locale: Locale) {
  const t = EDI_COPY[locale]
  const url = canonicalAbsoluteUrl(EDI_PATHS[locale])
  const english = locale === 'en'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: t.label,
        serviceType: 'EDI Integration',
        description: t.metaDescription,
        url,
        inLanguage: english ? 'en' : 'tr-TR',
        areaServed: ['TR', 'Worldwide'],
        provider: { '@type': 'Organization', name: 'Pars Medya', url: canonicalAbsoluteUrl('/') },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: english ? 'Home' : 'Ana Sayfa', item: canonicalAbsoluteUrl(localeHomePath(locale)) },
          { '@type': 'ListItem', position: 2, name: english ? 'Services' : 'Hizmetler', item: canonicalAbsoluteUrl(paths.services(locale)) },
          { '@type': 'ListItem', position: 3, name: t.label, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: t.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
    ],
  }
}

export function EdiPage({ locale }: { locale: Locale }) {
  const t = EDI_COPY[locale]
  const english = locale === 'en'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(ediJsonLd(locale)) }} />

      <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 bg-right-top text-white [mask-image:radial-gradient(ellipse_80%_90%_at_75%_10%,#000_15%,transparent_75%)]" />
        <PixelField className="-z-10 hidden lg:block [mask-image:radial-gradient(ellipse_60%_90%_at_100%_0%,#000_10%,transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-16">
          <nav aria-label={english ? 'Breadcrumb' : 'Sayfa yolu'} className="intro flex flex-wrap items-center gap-1.5 text-sm text-white/55">
            <Link href={localeHomePath(locale)} className="transition-colors hover:text-white">{english ? 'Home' : 'Ana Sayfa'}</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <Link href={paths.services(locale)} className="transition-colors hover:text-white">{english ? 'Services' : 'Hizmetler'}</Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-white" aria-current="page">{t.label}</span>
          </nav>

          <div className="mt-10 grid gap-14 xl:grid-cols-[1fr_1.1fr] xl:items-center">
            <div>
              <p className="eyebrow eyebrow-on-ink intro" style={stagger(0)}>{t.eyebrow}</p>
              <h1 className="text-display mt-6 text-balance text-[2.5rem] text-white sm:text-6xl">
                <span className="hero-line"><span style={stagger(0)}>{t.title}</span></span>
              </h1>
              <p className="intro mt-7 max-w-xl text-pretty text-lg leading-relaxed text-white/70" style={stagger(2)}>{t.lead}</p>
              <div className="intro mt-9 flex flex-col gap-3" style={stagger(3)}>
                <Link href={paths.contact(locale)} className="group inline-flex h-12 w-fit items-center gap-2 rounded-lg bg-accent px-6 text-[0.9375rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_var(--accent)]">
                  {t.primaryCta}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <ContactActionsOnInk locale={locale} />
              </div>
            </div>
            <div className="intro-fade rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8" style={stagger(2)}>
              <EdiFlow flow={t.flow} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div data-reveal className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow">{english ? 'Overview' : 'Genel bakış'}</p>
            <h2 className="text-display mt-5 text-balance text-[2rem] text-foreground sm:text-[2.75rem]">{t.overviewTitle}</h2>
          </div>
          <div className="space-y-6" data-reveal>
            {t.overview.map((paragraph) => <p key={paragraph.slice(0, 40)} className="text-pretty text-lg leading-8 text-muted-foreground">{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
          <div className="max-w-3xl" data-reveal>
            <p className="eyebrow">EDIFACT</p>
            <h2 className="text-display mt-5 text-balance text-[2rem] text-foreground sm:text-[2.75rem]">{t.messagesTitle}</h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{t.messagesLead}</p>
          </div>
          <ul className="mt-12 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3 [&>*]:border-b [&>*]:border-r [&>*]:border-border">
            {t.messages.map((message, index) => (
              <li key={message.code} data-reveal style={stagger(index % 3)} className="card-hairline group bg-card p-7 transition-colors duration-500 hover:bg-background">
                <p className="font-mono text-2xl font-bold tracking-wider text-foreground transition-colors duration-300 group-hover:text-accent-strong">{message.code}</p>
                <p className="mt-3 leading-relaxed text-muted-foreground">{message.description}</p>
              </li>
            ))}
          </ul>

          <h3 className="mt-16 font-display text-2xl font-bold tracking-tight text-foreground" data-reveal>{t.standardsTitle}</h3>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {t.standards.map((group, index) => (
              <div key={group.title} data-reveal style={stagger(index)} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent-strong">{group.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => <li key={item} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-foreground/85"><span className="mt-2 size-1.5 shrink-0 rounded-[2px] bg-accent" aria-hidden="true" />{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
          <div className="max-w-3xl" data-reveal>
            <p className="eyebrow">{english ? 'Capabilities' : 'Yetkinlikler'}</p>
            <h2 className="text-display mt-5 text-balance text-[2rem] text-foreground sm:text-[2.75rem]">{t.capabilitiesTitle}</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.capabilities.map((capability, index) => {
              const Icon = capabilityIcons[index % capabilityIcons.length]
              return (
                <article key={capability.title} data-reveal style={stagger(index % 3)} className="card-hairline group rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgb(10_20_50/0.35)]">
                  <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-primary transition-all duration-500 group-hover:-rotate-6 group-hover:border-accent group-hover:bg-accent group-hover:text-ink"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">{capability.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{capability.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div aria-hidden="true" className="bg-grid absolute inset-0 text-white opacity-70 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow eyebrow-on-ink">{english ? 'Process' : 'Süreç'}</p>
            <h2 className="text-display mt-5 text-balance text-[2rem] text-white sm:text-[2.75rem]">{t.processTitle}</h2>
          </div>
          <ol className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            <span aria-hidden="true" data-reveal="wipe" className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-accent via-white/20 to-transparent lg:block" />
            {t.process.map((step, index) => (
              <li key={step.title} data-reveal style={stagger(index + 1)} className="group relative">
                <span className="relative flex size-12 items-center justify-center rounded-full border border-white/15 bg-ink font-display text-sm font-bold tabular-nums text-accent transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-white">{step.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/65">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow">{english ? 'Industries' : 'Sektörler'}</p>
            <h2 className="text-display mt-5 text-balance text-[2rem] text-foreground sm:text-[2.75rem]">{t.sectorsTitle}</h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{t.sectorsLead}</p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {t.sectors.map((sector) => <li key={sector} className="rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm font-semibold text-foreground">{sector}</li>)}
            </ul>
          </div>
          <div data-reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{t.faqTitle}</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {t.faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-lg font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactCta locale={locale} />
    </>
  )
}
