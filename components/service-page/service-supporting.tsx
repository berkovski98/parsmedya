import Link from 'next/link'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { toEnglishServiceSlug } from '@/lib/i18n'
import { SERVICE_UI, turkishServiceSlug, type ServicePageModel } from '@/lib/service-page'
import { getService, services, type Service } from '@/lib/services'
import { englishServices, getEnglishService, type EnglishService } from '@/lib/services-en'

export function ServiceUseCases({
  model,
  useCases,
}: {
  model: ServicePageModel
  useCases: NonNullable<Service['useCases']>
}) {
  const ui = SERVICE_UI[model.locale]
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.useCasesLabel}</p>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.useCasesTitle}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <article key={useCase.title} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display font-semibold text-foreground">{useCase.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{useCase.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ServicePackages({
  model,
  packages,
}: {
  model: ServicePageModel
  packages: Service['packages']
}) {
  const ui = SERVICE_UI[model.locale]
  if (packages.length === 0) return null

  return (
    <section className="border-b border-border bg-secondary/35">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.packagesLabel}</p>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.packagesTitle}
        </h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                pkg.featured ? 'border-accent bg-card shadow-sm' : 'border-border bg-card'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  <Sparkles className="h-3 w-3" />
                  {ui.featured}
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-foreground">{pkg.name}</h3>
              <p className="mt-1 font-display text-2xl font-bold text-accent">{pkg.price}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span className="leading-relaxed text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={model.contactHref}
                className={buttonVariants({
                  variant: pkg.featured ? 'default' : 'outline',
                  className: 'mt-6 w-full',
                })}
              >
                {ui.quote}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ServiceFaq({
  model,
  faqs,
}: {
  model: ServicePageModel
  faqs: Service['faqs']
}) {
  const ui = SERVICE_UI[model.locale]
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.faqLabel}</p>
        <h2 className="mt-3 text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.faqTitle}
        </h2>
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-foreground">
                {faq.question}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ServiceRelated({
  model,
  current,
}: {
  model: ServicePageModel
  current: Service | EnglishService
}) {
  const ui = SERVICE_UI[model.locale]
  const related = relatedServices(current, model.locale)

  return (
    <section className="border-b border-border bg-secondary/35">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">{ui.relatedTitle}</h2>
          <Link href={model.servicesHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            {ui.relatedAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              href={`${model.servicesHref}/${item.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/60"
            >
              <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                {ui.relatedCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function relatedServices(current: Service | EnglishService, locale: 'tr' | 'en') {
  const trSlug = turkishServiceSlug(current)
  const source = locale === 'en' ? getService(trSlug) : (current as Service)
  const relatedSlugs = source?.relatedSlugs ?? []

  if (locale === 'en') {
    const mapped = relatedSlugs
      .map((slug) => getEnglishService(toEnglishServiceSlug(slug)))
      .filter((item): item is EnglishService => Boolean(item))
      .slice(0, 3)
    if (mapped.length > 0) return mapped
    return englishServices.filter((item) => item.slug !== current.slug && item.category === current.category).slice(0, 3)
  }

  const mapped = relatedSlugs
    .map((slug) => getService(slug))
    .filter((item): item is Service => Boolean(item))
    .slice(0, 3)
  if (mapped.length > 0) return mapped
  return services.filter((item) => item.slug !== current.slug).slice(0, 3)
}
