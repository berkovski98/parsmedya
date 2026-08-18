import { SERVICE_UI, tx, type ServicePageModel } from '@/lib/service-page'

export function ServiceArchitecture({ model }: { model: ServicePageModel }) {
  const ui = SERVICE_UI[model.locale]
  const { layers, sides } = model.extras.architecture
  const mid = Math.ceil(sides.length / 2)
  const left = sides.slice(0, mid)
  const right = sides.slice(mid)

  return (
    <section className="border-b border-border bg-secondary/35">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.architectureLabel}</p>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.architectureTitle}
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{ui.architectureLead}</p>

        <div className="mt-10 overflow-x-clip rounded-2xl border border-border bg-card p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_minmax(180px,240px)_1fr] lg:items-center">
            <div className="hidden space-y-3 lg:block">
              {left.map((side) => (
                <SideNode key={tx(side.title, model.locale)} label={tx(side.title, model.locale)} />
              ))}
            </div>

            <div className="mx-auto flex w-full max-w-xs flex-col items-center">
              {layers.map((layer, index) => (
                <div key={tx(layer.title, model.locale)} className="flex w-full flex-col items-center">
                  <div className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-foreground">
                    {tx(layer.title, model.locale)}
                  </div>
                  {index < layers.length - 1 && (
                    <span aria-hidden="true" className="h-6 w-px bg-border" />
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {right.map((side) => (
                <SideNode key={tx(side.title, model.locale)} label={tx(side.title, model.locale)} />
              ))}
              <div className="contents lg:hidden">
                {left.map((side) => (
                  <SideNode key={`m-${tx(side.title, model.locale)}`} label={tx(side.title, model.locale)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SideNode({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-secondary/60 px-3 py-2.5 text-center text-sm font-medium text-foreground">
      {label}
    </div>
  )
}
