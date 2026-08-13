import type { AnalyticsDay, AnalyticsPageTotal, AnalyticsReferrer } from '@/lib/analytics-types'

export function MetricCards({ items }: { items: { label: string; value: number }[] }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{items.map((item) => <div key={item.label} className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{item.label}</p><p className="mt-2 font-display text-3xl font-bold text-foreground">{item.value.toLocaleString('tr-TR')}</p></div>)}</div>
}

export function TopPages({ pages }: { pages: AnalyticsPageTotal[] }) {
  const max = Math.max(...pages.map((item) => item.views), 1)
  return <div className="space-y-4">{pages.map((item) => <div key={item.path}><div className="mb-1.5 flex items-center justify-between gap-4 text-sm"><span className="truncate font-medium text-foreground">{item.path}</span><span className="text-muted-foreground">{item.views.toLocaleString('tr-TR')}</span></div><div className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-accent" style={{ width: `${Math.max((item.views / max) * 100, 2)}%` }} /></div></div>)}{pages.length === 0 && <p className="text-sm text-muted-foreground">Henüz ziyaret verisi yok.</p>}</div>
}

export function DailyChart({ days }: { days: AnalyticsDay[] }) {
  const max = Math.max(...days.map((item) => item.views), 1)
  return <div className="overflow-x-auto pb-2"><div className="flex min-w-[720px] items-end gap-2" style={{ height: 240 }}>{days.map((day) => <div key={day.date} className="flex h-full flex-1 flex-col justify-end gap-2"><div className="flex flex-1 items-end"><div title={`${day.views} görüntülenme, ${day.visitors} ziyaretçi`} className="w-full rounded-t bg-primary transition-colors hover:bg-accent" style={{ height: `${Math.max((day.views / max) * 100, day.views ? 4 : 1)}%` }} /></div><span className="-rotate-45 whitespace-nowrap text-[10px] text-muted-foreground">{new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(new Date(day.date))}</span></div>)}</div></div>
}

export function TopReferrers({ referrers }: { referrers: AnalyticsReferrer[] }) {
  return <div className="divide-y divide-border">{referrers.map((item) => <div key={item.referrer} className="flex items-center justify-between gap-4 py-3 text-sm"><span className="min-w-0 truncate text-foreground">{item.referrer}</span><span className="shrink-0 font-medium text-muted-foreground">{item.views.toLocaleString('tr-TR')}</span></div>)}{referrers.length === 0 && <p className="py-4 text-sm text-muted-foreground">Henüz referrer verisi yok.</p>}</div>
}
