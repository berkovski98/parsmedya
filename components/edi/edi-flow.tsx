import { ArrowLeftRight, Building2, Database, ShieldCheck } from 'lucide-react'
import type { EdiCopy } from '@/lib/edi'
import { stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

function Wire({ packets }: { packets: string[] }) {
  return (
    <div aria-hidden="true" className="edi-wire relative mx-auto h-14 w-px bg-gradient-to-b from-white/5 via-white/25 to-white/5 md:mx-0 md:h-px md:w-full md:self-center md:bg-gradient-to-r">
      {packets.map((packet, index) => <i key={packet} style={stagger(index)} />)}
    </div>
  )
}

/** Partners → EDI hub → internal systems, with animated message packets. Decorative but labelled. */
export function EdiFlow({ flow, className }: { flow: EdiCopy['flow']; className?: string }) {
  const node = 'flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/85'
  return (
    <figure aria-label={`${flow.partners} → ${flow.hub} → ${flow.systems}`} className={cn('grid items-stretch gap-0 md:grid-cols-[1fr_3.5rem_1.15fr_3.5rem_1fr] md:gap-0', className)}>
      <div className="space-y-2.5">
        <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/45">{flow.partners}</p>
        {flow.partnerItems.map((item) => <div key={item} className={node}><Building2 className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />{item}</div>)}
      </div>

      <Wire packets={flow.packets} />

      <div className="relative rounded-2xl border border-accent/40 bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-5 shadow-[0_0_60px_-20px_var(--accent)]">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-ink"><ArrowLeftRight className="h-4 w-4" aria-hidden="true" /></span>
          <p className="font-display text-base font-bold text-white">{flow.hub}</p>
        </div>
        <ol className="mt-4 grid grid-cols-2 gap-2">
          {flow.hubSteps.map((step, index) => (
            <li key={step} className="flex items-center gap-2 rounded-lg bg-ink/60 px-3 py-2 text-sm text-white/80 ring-1 ring-white/10">
              <span className="font-display text-[0.6875rem] font-bold tabular-nums text-accent">{String(index + 1).padStart(2, '0')}</span>{step}
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {flow.packets.map((packet) => <span key={packet} className="rounded-md bg-white/10 px-2 py-1 font-mono text-[0.6875rem] font-semibold tracking-wider text-white/80">{packet}</span>)}
        </div>
      </div>

      <Wire packets={[...flow.packets].reverse()} />

      <div className="space-y-2.5">
        <p className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/45">{flow.systems}</p>
        {flow.systemItems.map((item, index) => (
          <div key={item} className={node}>
            {index === 0 ? <Database className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true" /> : <ShieldCheck className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />}
            {item}
          </div>
        ))}
      </div>
    </figure>
  )
}
