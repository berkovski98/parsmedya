import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { ContactCta } from '@/components/contact-cta'
import { PageHeader } from '@/components/page-header'
import { CASE_STUDIES, isPublishableCaseStudy } from '@/lib/company-profile'
import { EDI_PATHS } from '@/lib/edi'
import { paths, type Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'
import { orgRef } from '@/lib/schema/organization'
import { safeJsonLd } from '@/lib/seo'
import { canonicalAbsoluteUrl } from '@/lib/site-url'

const COPY = {
  tr: {
    eyebrow: 'Referanslar',
    title: 'Referanslar ve Projeler',
    description: 'Farklı sektörlerde geliştirdiğimiz gerçek projeler: ihtiyaç, kurduğumuz çözüm ve teslim edilenler.',
    note: 'Adını paylaşma izni aldığımız müşterilerimizi adıyla, diğer projeleri müşteri gizliliği gereği sektörüyle anlatıyoruz. Görüşmelerde, müşterinin izin verdiği ölçüde ayrıntı sunabiliriz.',
    problem: 'İhtiyaç',
    solution: 'Çözüm',
    delivered: 'Teslim edilenler',
    technologies: 'Teknolojiler',
    ediLink: 'EDI entegrasyonu hizmetimiz',
    servicesLink: 'Tüm hizmetlerimiz',
  },
  en: {
    eyebrow: 'References',
    title: 'References and Projects',
    description: 'Real projects we have built across industries: the need, the solution and what was delivered.',
    note: 'Clients who have agreed to be named are shown by name; other projects are described by industry to protect client confidentiality. In a call we can share more detail where the client allows it.',
    problem: 'The need',
    solution: 'Solution',
    delivered: 'Delivered',
    technologies: 'Technologies',
    ediLink: 'Our EDI integration service',
    servicesLink: 'All services',
  },
} as const

export function ReferencesPage({ locale }: { locale: Locale }) {
  const text = COPY[locale]
  const studies = CASE_STUDIES.filter(isPublishableCaseStudy)
  const path = locale === 'en' ? '/en/references' : '/referanslar'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': studies.map((study) => ({
      '@type': 'CreativeWork',
      '@id': `${canonicalAbsoluteUrl(path)}#${study.slug}`,
      name: study.title[locale],
      about: study.client ? { '@type': 'Organization', name: study.client.name, ...(study.client.url ? { url: study.client.url } : {}) } : study.sector[locale],
      description: study.solution[locale],
      creator: orgRef(),
      inLanguage: locale === 'en' ? 'en' : 'tr-TR',
      keywords: study.technologies.join(', '),
    })),
  }

  return (
    <>
      {studies.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />}
      <PageHeader locale={locale} eyebrow={text.eyebrow} title={text.title} description={text.description} />
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <p className="max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground" data-reveal>{text.note}</p>
          <div className="mt-10 space-y-6">
            {studies.map((study, index) => (
              <article key={study.slug} id={study.slug} data-reveal style={stagger(index % 2)} className="card-hairline scroll-mt-28 rounded-3xl border border-border bg-card p-6 sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-display text-sm font-bold tabular-nums text-muted-foreground/70">{String(index + 1).padStart(2, '0')}</span>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-strong">{study.sector[locale]}</span>
                  {study.client && (study.client.url
                    ? <a href={study.client.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline">{study.client.name}<ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></a>
                    : <span className="text-sm font-semibold text-foreground">{study.client.name}</span>)}
                </div>
                <h2 className="mt-5 max-w-3xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{study.title[locale]}</h2>
                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr_0.9fr]">
                  <div>
                    <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{text.problem}</h3>
                    <p className="mt-3 leading-relaxed text-foreground/85">{study.problem[locale]}</p>
                  </div>
                  <div>
                    <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{text.solution}</h3>
                    <p className="mt-3 leading-relaxed text-foreground/85">{study.solution[locale]}</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/50 p-5">
                    <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{text.delivered}</h3>
                    <ul className="mt-3 space-y-2">
                      {study.delivered[locale].map((item) => <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />{item}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                  <ul className="flex flex-wrap gap-2" aria-label={text.technologies}>
                    {study.technologies.map((tech) => <li key={tech} className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground/75">{tech}</li>)}
                  </ul>
                  {study.slug === 'konteyner-edi-platformu' && (
                    <Link href={EDI_PATHS[locale]} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong hover:text-foreground">
                      {text.ediLink}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
          <Link href={paths.services(locale)} className="group mt-10 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-sm font-semibold text-foreground hover:text-accent-strong">
            {text.servicesLink}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>
      <ContactCta locale={locale} />
    </>
  )
}
