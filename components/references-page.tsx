import { PageHeader } from '@/components/page-header'
import { CASE_STUDIES, PLACEHOLDER_PREFIX, REFERENCES_PUBLISHED } from '@/lib/company-profile'
import type { Locale } from '@/lib/i18n'
import { orgRef } from '@/lib/schema/organization'
import { safeJsonLd } from '@/lib/seo'
import { canonicalAbsoluteUrl } from '@/lib/site-url'

const COPY = {
  tr: {
    eyebrow: 'Referanslar',
    title: 'Referanslar ve Vaka Çalışmaları',
    description: 'Müşterilerimizle birlikte çözdüğümüz problemler, kurduğumuz sistemler ve ölçülen sonuçlar.',
    empty: 'Bu sayfa, müşteri onayı alınmış gerçek vaka çalışmaları eklendiğinde yayına alınacaktır.',
    placeholder: 'Müşteri onaylı vaka çalışması: müşteri, problem, çözüm, ölçülen sonuç, teknolojiler',
    problem: 'Problem',
    solution: 'Çözüm',
    result: 'Sonuç',
  },
  en: {
    eyebrow: 'References',
    title: 'References and Case Studies',
    description: 'Problems we solved with our clients, the systems we built and the results that were measured.',
    empty: 'This page will be published once real, client-approved case studies are added.',
    placeholder: 'Client-approved case study: client, problem, solution, measured result, technologies',
    problem: 'Problem',
    solution: 'Solution',
    result: 'Result',
  },
} as const

export function ReferencesPage({ locale }: { locale: Locale }) {
  const text = COPY[locale]
  const studies = CASE_STUDIES.filter((item) => item.clientApproved)
  const path = locale === 'en' ? '/en/references' : '/referanslar'
  const jsonLd = studies.length
    ? {
        '@context': 'https://schema.org',
        '@graph': studies.map((study, index) => ({
          '@type': 'CreativeWork',
          '@id': `${canonicalAbsoluteUrl(path)}#case-${index + 1}`,
          name: study.title,
          about: study.client,
          description: study.result,
          creator: orgRef(),
          keywords: study.technologies.join(', '),
        })),
      }
    : null
  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />}
      <PageHeader locale={locale} eyebrow={text.eyebrow} title={text.title} description={text.description} />
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20">
          {studies.length === 0 || !REFERENCES_PUBLISHED ? (
            <div className="space-y-4 rounded-2xl border border-dashed border-border bg-secondary/40 p-8 text-muted-foreground">
              <p>{text.empty}</p>
              <p><mark className="rounded bg-accent/15 px-1 font-semibold text-foreground">[{PLACEHOLDER_PREFIX}: {text.placeholder}]</mark></p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {studies.map((study) => (
                <article key={study.title} className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-sm font-semibold text-accent-strong">{study.client}</p>
                  <h2 className="mt-2 font-display text-xl font-bold">{study.title}</h2>
                  <dl className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    <div><dt className="font-semibold text-foreground">{text.problem}</dt><dd>{study.problem}</dd></div>
                    <div><dt className="font-semibold text-foreground">{text.solution}</dt><dd>{study.solution}</dd></div>
                    <div><dt className="font-semibold text-foreground">{text.result}</dt><dd>{study.result}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
