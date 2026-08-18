import { SERVICE_UI, overviewHeading, tx, type ServicePageModel } from '@/lib/service-page'
import type { Service } from '@/lib/services'

export function ServiceOverview({
  model,
  paragraphs,
  highlights,
}: {
  model: ServicePageModel
  paragraphs: string[]
  highlights: string[]
}) {
  const ui = SERVICE_UI[model.locale]

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start md:py-20">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.overviewLabel}</p>
          <h2 className="mt-3 text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {overviewHeading(model.title, model.locale)}
          </h2>
          <div className="mt-6 space-y-4">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
          {highlights.length > 0 && (
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="rounded-2xl border border-border bg-card p-6 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{ui.overviewCard}</p>
          <ol className="mt-5 space-y-4">
            {model.extras.overviewSteps.map((step, index) => (
              <li key={tx(step.title, model.locale)} className="flex gap-3">
                <span className="font-display text-sm font-bold tabular-nums text-primary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-sm leading-relaxed text-foreground">{tx(step.title, model.locale)}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  )
}

export function serviceOverviewParagraphs(service: Service, locale: 'tr' | 'en') {
  if (service.longDescription?.length) return service.longDescription
  return locale === 'en' ? [service.intro, service.description] : [service.intro]
}
