import {
  GitBranch,
  Lock,
  Puzzle,
  Scale,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { SERVICE_UI, tx, type ServicePageModel } from '@/lib/service-page'

const ICONS: LucideIcon[] = [Puzzle, Scale, GitBranch, Lock, Sparkles]

export function ServiceBenefits({
  model,
  whyParagraph,
}: {
  model: ServicePageModel
  whyParagraph?: string
}) {
  const ui = SERVICE_UI[model.locale]

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.whyLabel}</p>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.whyTitle}
        </h2>
        {whyParagraph && (
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">{whyParagraph}</p>
        )}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {model.extras.why.map((item, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <article key={tx(item.title, model.locale)} className="rounded-2xl border border-border bg-card p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-semibold text-foreground">{tx(item.title, model.locale)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(item.text, model.locale)}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
