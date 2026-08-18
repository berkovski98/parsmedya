import { SERVICE_UI, tx, type ServicePageModel } from '@/lib/service-page'

export function ServiceProcess({ model }: { model: ServicePageModel }) {
  const ui = SERVICE_UI[model.locale]
  const steps = model.extras.process

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.processLabel}</p>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.processTitle}
        </h2>

        <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-5">
          <span aria-hidden="true" className="absolute left-[8%] right-[8%] top-5 hidden h-px bg-border xl:block" />
          {steps.map((step, index) => (
            <li key={tx(step.title, model.locale)} className="relative">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-display text-sm font-bold tabular-nums text-primary">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{tx(step.title, model.locale)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tx(step.text, model.locale)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
