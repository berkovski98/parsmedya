import {
  Gauge,
  Layers,
  LineChart,
  MousePointerClick,
  Timer,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { SERVICE_UI, tx, type ServicePageModel } from '@/lib/service-page'

const ICONS: LucideIcon[] = [Workflow, Layers, Timer, LineChart, MousePointerClick, Gauge]

export function ServiceOutcomes({ model }: { model: ServicePageModel }) {
  const ui = SERVICE_UI[model.locale]

  return (
    <section className="border-b border-border bg-secondary/35">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.outcomesLabel}</p>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.outcomesTitle}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {model.extras.outcomes.map((item, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <article key={tx(item.title, model.locale)} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{tx(item.title, model.locale)}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tx(item.text, model.locale)}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
