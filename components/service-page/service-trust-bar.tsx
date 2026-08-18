import {
  Cable,
  Layers,
  MonitorSmartphone,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { SERVICE_UI, tx, type ServicePageModel } from '@/lib/service-page'
import type { ServiceVisualKey } from '@/lib/service-page-copy'

const TRUST_ICONS: Record<ServiceVisualKey, LucideIcon[]> = {
  software: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  crm: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  erp: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  api: [Cable, ShieldCheck, Layers, MonitorSmartphone],
  commerce: [MonitorSmartphone, ShieldCheck, Cable, Layers],
  mobile: [MonitorSmartphone, ShieldCheck, Cable, Layers],
  ai: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  dashboard: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  seo: [Layers, ShieldCheck, MonitorSmartphone, Cable],
  website: [MonitorSmartphone, ShieldCheck, Layers, Cable],
  saas: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  portal: [ShieldCheck, Layers, Cable, MonitorSmartphone],
  inventory: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  automation: [Layers, Cable, ShieldCheck, MonitorSmartphone],
  platform: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  consulting: [Layers, ShieldCheck, Cable, MonitorSmartphone],
  design: [MonitorSmartphone, Layers, ShieldCheck, Cable],
  modernize: [Layers, ShieldCheck, Cable, MonitorSmartphone],
}

export function ServiceTrustBar({ model }: { model: ServicePageModel }) {
  const ui = SERVICE_UI[model.locale]
  const icons = TRUST_ICONS[model.visual] ?? TRUST_ICONS.software

  return (
    <section aria-label={ui.highlightsLabel} className="border-b border-border bg-secondary/50">
      <div className="mx-auto grid max-w-6xl gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
        {model.extras.trust.map((item, index) => {
          const Icon = icons[index] ?? Layers
          return (
            <div key={tx(item.title, model.locale)} className="flex items-center gap-3 bg-background px-4 py-4 sm:px-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium leading-snug text-foreground">{tx(item.title, model.locale)}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
