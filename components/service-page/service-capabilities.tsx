import {
  BarChart3,
  Boxes,
  Cable,
  LayoutDashboard,
  Shield,
  Smartphone,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { SERVICE_UI, type ServicePageModel } from '@/lib/service-page'
import type { Service } from '@/lib/services'

const ICONS: LucideIcon[] = [LayoutDashboard, Users, Workflow, Boxes, Cable, BarChart3, Shield, Smartphone]

export function ServiceCapabilities({
  model,
  features,
}: {
  model: ServicePageModel
  features: Service['features']
}) {
  const ui = SERVICE_UI[model.locale]

  return (
    <section id="capabilities" className="scroll-mt-24 border-b border-border bg-secondary/35">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{ui.capabilitiesLabel}</p>
        <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {ui.capabilitiesTitle}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = ICONS[index % ICONS.length]
            return (
              <article
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/12 text-accent">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
