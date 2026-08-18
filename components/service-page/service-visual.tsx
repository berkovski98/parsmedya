import type { ReactNode } from 'react'
import type { ServiceVisualKey } from '@/lib/service-page-copy'
import { cn } from '@/lib/utils'

type VisualProps = {
  visual: ServiceVisualKey
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-primary p-4 sm:min-h-[320px] sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  )
}

function Pane({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-xl border border-white/10 bg-white/[0.07] p-3 shadow-[0_8px_30px_rgba(0,0,0,0.18)]', className)}>
      {children}
    </div>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-medium tracking-wide text-primary-foreground/80">
      {children}
    </span>
  )
}

function Bar({ width, accent = false }: { width: string; accent?: boolean }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
      <div className={cn('h-full rounded-full', accent ? 'bg-accent' : 'bg-white/45')} style={{ width }} />
    </div>
  )
}

function Dot({ accent = false }: { accent?: boolean }) {
  return <span className={cn('h-1.5 w-1.5 rounded-full', accent ? 'bg-accent' : 'bg-white/40')} />
}

function SoftwareVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-[88px_1fr]">
      <Pane className="hidden space-y-2 sm:block">
        {['API', 'Auth', 'DB'].map((item) => (
          <div key={item} className="flex items-center gap-2 rounded-lg bg-white/5 px-2 py-2 text-[11px] text-primary-foreground/80">
            <Dot accent />
            {item}
          </div>
        ))}
      </Pane>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {['12.4k', '98%', '24'].map((value, index) => (
            <Pane key={value} className="p-2.5">
              <p className="text-[10px] text-primary-foreground/55">{['Requests', 'Uptime', 'Jobs'][index]}</p>
              <p className="mt-1 font-display text-sm font-semibold text-primary-foreground">{value}</p>
            </Pane>
          ))}
        </div>
        <Pane>
          <div className="mb-3 flex items-end gap-1.5">
            {[40, 58, 46, 72, 64, 88, 70].map((height, index) => (
              <div key={height} className="flex-1 rounded-sm bg-white/15" style={{ height: `${height * 0.7}px` }}>
                {index === 5 ? <div className="h-full rounded-sm bg-accent/80" /> : null}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip>Dashboard</Chip>
            <Chip>REST</Chip>
            <Chip>PostgreSQL</Chip>
          </div>
        </Pane>
      </div>
    </div>
  )
}

function CrmVisual() {
  const columns = [
    { title: 'Lead', items: ['Acme', 'Nordic'] },
    { title: 'Proposal', items: ['Helix', 'Atlas'] },
    { title: 'Won', items: ['Orbit'] },
  ]
  return (
    <div className="grid grid-cols-3 gap-2">
      {columns.map((column, columnIndex) => (
        <Pane key={column.title} className="space-y-2 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60">{column.title}</p>
          {column.items.map((item, index) => (
            <div key={item} className="rounded-lg bg-white/8 px-2 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-primary-foreground">{item}</span>
                <Dot accent={columnIndex === 2} />
              </div>
              {index === 0 ? <div className="mt-2"><Bar width={columnIndex === 2 ? '92%' : '58%'} accent={columnIndex === 2} /></div> : null}
            </div>
          ))}
        </Pane>
      ))}
    </div>
  )
}

function ErpVisual() {
  const modules = ['Finance', 'Stock', 'Purchase', 'Ops', 'Reports', 'Users']
  return (
    <div className="grid grid-cols-3 gap-2">
      {modules.map((module, index) => (
        <Pane key={module} className={cn('flex min-h-[72px] flex-col justify-between p-2.5', index === 0 && 'border-accent/40')}>
          <Dot accent={index === 0 || index === 4} />
          <p className="text-[11px] font-medium text-primary-foreground">{module}</p>
        </Pane>
      ))}
    </div>
  )
}

function ApiVisual() {
  const nodes = ['Web', 'Mobile', 'API', 'CRM', 'ERP', 'Pay']
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-2">
        {nodes.map((node, index) => (
          <div
            key={node}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[11px] font-medium',
              index === 2 ? 'border-accent/50 bg-accent text-accent-foreground' : 'border-white/10 bg-white/10 text-primary-foreground',
            )}
          >
            {node}
          </div>
        ))}
      </div>
      <Pane className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-primary-foreground/80">
          <span>POST /webhooks</span>
          <span className="text-accent">200</span>
        </div>
        <Bar width="76%" accent />
        <div className="flex gap-1.5">
          <Chip>REST</Chip>
          <Chip>Webhook</Chip>
          <Chip>Sync</Chip>
        </div>
      </Pane>
    </div>
  )
}

function CommerceVisual() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {['Orders', 'Stock', 'Paid'].map((label, index) => (
          <Pane key={label} className="p-2.5">
            <p className="text-[10px] text-primary-foreground/55">{label}</p>
            <p className="mt-1 font-display text-sm font-semibold text-primary-foreground">{['128', '4.2k', '94%'][index]}</p>
          </Pane>
        ))}
      </div>
      <Pane className="space-y-2">
        {['#1042 · Shipped', '#1043 · Packed', '#1044 · Payment'].map((row, index) => (
          <div key={row} className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-2 text-[11px] text-primary-foreground/85">
            {row}
            <Bar width={['88%', '62%', '40%'][index]} accent={index === 0} />
          </div>
        ))}
      </Pane>
    </div>
  )
}

function MobileVisual() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="w-[148px] rounded-[1.6rem] border border-white/15 bg-primary-foreground/5 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
        <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-white/20" />
        <div className="space-y-2 rounded-[1.1rem] bg-white/8 p-2.5">
          <div className="h-16 rounded-xl bg-accent/30" />
          <Bar width="70%" accent />
          <Bar width="48%" />
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <div className="h-10 rounded-lg bg-white/10" />
            <div className="h-10 rounded-lg bg-white/10" />
          </div>
        </div>
      </div>
      <div className="hidden flex-1 space-y-2 sm:block">
        <Chip>iOS</Chip>
        <Chip>Android</Chip>
        <Pane className="mt-2 p-2.5">
          <p className="text-[11px] text-primary-foreground/80">Push · Auth · API</p>
          <div className="mt-2"><Bar width="64%" accent /></div>
        </Pane>
      </div>
    </div>
  )
}

function AiVisual() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        {['Data', 'Model', 'Action'].map((label, index) => (
          <Pane key={label} className={cn('flex-1 text-center text-[11px] font-medium text-primary-foreground', index === 1 && 'border-accent/40')}>
            {label}
          </Pane>
        ))}
      </div>
      <Pane className="space-y-2">
        {['Classify document', 'Summarize thread', 'Route request'].map((item, index) => (
          <div key={item} className="flex items-center gap-2 text-[11px] text-primary-foreground/85">
            <Dot accent={index === 0} />
            {item}
          </div>
        ))}
      </Pane>
    </div>
  )
}

function DashboardVisual() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {['Revenue', 'Conversion', 'Latency', 'Active'].map((label, index) => (
          <Pane key={label} className="p-2.5">
            <p className="text-[10px] text-primary-foreground/55">{label}</p>
            <p className="mt-1 font-display text-sm font-semibold text-primary-foreground">{['+18%', '3.4%', '122ms', '1.2k'][index]}</p>
          </Pane>
        ))}
      </div>
      <Pane className="flex items-end gap-1.5 pt-6">
        {[30, 48, 42, 70, 58, 86, 64, 78].map((height, index) => (
          <div key={height} className={cn('flex-1 rounded-sm', index === 5 ? 'bg-accent' : 'bg-white/20')} style={{ height: `${height * 0.7}px` }} />
        ))}
      </Pane>
    </div>
  )
}

function SeoVisual() {
  return (
    <div className="space-y-3">
      <Pane className="flex items-center gap-2">
        <div className="h-2.5 flex-1 rounded-full bg-white/10" />
        <Chip>Search</Chip>
      </Pane>
      <Pane className="space-y-2">
        {['Index coverage', 'Core Web Vitals', 'Query clusters'].map((row, index) => (
          <div key={row} className="flex items-center justify-between text-[11px] text-primary-foreground/85">
            {row}
            <Bar width={['82%', '67%', '54%'][index]} accent={index === 0} />
          </div>
        ))}
      </Pane>
    </div>
  )
}

function WebsiteVisual() {
  return (
    <Pane className="overflow-hidden p-0">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <Dot /><Dot /><Dot accent />
        <div className="ml-2 h-2 flex-1 rounded-full bg-white/10" />
      </div>
      <div className="grid grid-cols-[72px_1fr] gap-2 p-3">
        <div className="space-y-1.5">
          <div className="h-8 rounded-md bg-accent/40" />
          <div className="h-2 rounded bg-white/15" />
          <div className="h-2 w-2/3 rounded bg-white/10" />
        </div>
        <div className="space-y-2">
          <div className="h-10 rounded-md bg-white/10" />
          <div className="grid grid-cols-3 gap-1.5">
            <div className="h-12 rounded-md bg-white/8" />
            <div className="h-12 rounded-md bg-white/8" />
            <div className="h-12 rounded-md bg-white/8" />
          </div>
        </div>
      </div>
    </Pane>
  )
}

function SaasVisual() {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {['Tenant A', 'Tenant B'].map((tenant, index) => (
          <Chip key={tenant}>{index === 0 ? `● ${tenant}` : tenant}</Chip>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {['Starter', 'Growth'].map((plan, index) => (
          <Pane key={plan} className={cn(index === 1 && 'border-accent/40')}>
            <p className="text-[11px] font-semibold text-primary-foreground">{plan}</p>
            <div className="mt-2"><Bar width={index === 1 ? '78%' : '42%'} accent={index === 1} /></div>
          </Pane>
        ))}
      </div>
    </div>
  )
}

function PortalVisual() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {['Customer', 'Dealer'].map((role, index) => (
        <Pane key={role}>
          <p className="text-[11px] font-semibold text-primary-foreground">{role}</p>
          <div className="mt-2 space-y-1.5">
            <Bar width={index === 0 ? '70%' : '55%'} accent={index === 0} />
            <Bar width="40%" />
            <Chip>{index === 0 ? 'Orders' : 'Pricing'}</Chip>
          </div>
        </Pane>
      ))}
    </div>
  )
}

function InventoryVisual() {
  return (
    <Pane className="space-y-2">
      {['WH-01  ·  1.240', 'WH-02  ·  860', 'Reserved  ·  122'].map((row, index) => (
        <div key={row} className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-2 text-[11px] text-primary-foreground/85">
          {row}
          <Dot accent={index === 2} />
        </div>
      ))}
      <Bar width="61%" accent />
    </Pane>
  )
}

function AutomationVisual() {
  return (
    <div className="flex flex-col items-stretch gap-2">
      {['Request', 'Approval', 'Notify', 'Complete'].map((step, index) => (
        <div key={step} className="flex items-center gap-2">
          <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold', index === 1 ? 'bg-accent text-accent-foreground' : 'bg-white/10 text-primary-foreground')}>
            {index + 1}
          </span>
          <Pane className="flex-1 py-2 text-[11px] text-primary-foreground">{step}</Pane>
        </div>
      ))}
    </div>
  )
}

function PlatformVisual() {
  return (
    <div className="grid grid-cols-3 items-center gap-2">
      <Pane className="text-center text-[11px] text-primary-foreground">B2B</Pane>
      <Pane className="border-accent/40 text-center text-[11px] font-semibold text-primary-foreground">Platform</Pane>
      <Pane className="text-center text-[11px] text-primary-foreground">B2C</Pane>
      <div className="col-span-3"><Bar width="72%" accent /></div>
    </div>
  )
}

function ConsultingVisual() {
  return (
    <Pane className="space-y-2">
      {['Architecture review', 'Risk map', 'Delivery plan'].map((item, index) => (
        <div key={item} className="flex items-center justify-between text-[11px] text-primary-foreground/85">
          {item}
          <Bar width={['80%', '62%', '48%'][index]} accent={index === 0} />
        </div>
      ))}
    </Pane>
  )
}

function DesignVisual() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Pane className="space-y-2">
        <div className="h-8 rounded-md border border-dashed border-white/25" />
        <div className="h-16 rounded-md bg-white/8" />
      </Pane>
      <Pane className="space-y-2">
        <div className="h-5 w-2/3 rounded bg-accent/40" />
        <div className="h-2 rounded bg-white/15" />
        <div className="h-2 w-1/2 rounded bg-white/10" />
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="h-8 rounded bg-white/10" />
          <div className="h-8 rounded bg-white/10" />
        </div>
      </Pane>
    </div>
  )
}

function ModernizeVisual() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Pane>
        <p className="text-[10px] uppercase tracking-wider text-primary-foreground/50">Legacy</p>
        <div className="mt-2 space-y-1.5">
          <Bar width="38%" />
          <Bar width="52%" />
          <Bar width="24%" />
        </div>
      </Pane>
      <Pane className="border-accent/40">
        <p className="text-[10px] uppercase tracking-wider text-accent">Modern</p>
        <div className="mt-2 space-y-1.5">
          <Bar width="82%" accent />
          <Bar width="70%" accent />
          <Bar width="90%" accent />
        </div>
      </Pane>
    </div>
  )
}

const VISUALS: Record<ServiceVisualKey, () => ReactNode> = {
  software: SoftwareVisual,
  crm: CrmVisual,
  erp: ErpVisual,
  api: ApiVisual,
  commerce: CommerceVisual,
  mobile: MobileVisual,
  ai: AiVisual,
  dashboard: DashboardVisual,
  seo: SeoVisual,
  website: WebsiteVisual,
  saas: SaasVisual,
  portal: PortalVisual,
  inventory: InventoryVisual,
  automation: AutomationVisual,
  platform: PlatformVisual,
  consulting: ConsultingVisual,
  design: DesignVisual,
  modernize: ModernizeVisual,
}

export function ServiceVisual({ visual }: VisualProps) {
  const Content = VISUALS[visual] ?? SoftwareVisual
  return (
    <Frame>
      <Content />
    </Frame>
  )
}
