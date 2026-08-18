import { publicAnalyticsError } from '@/lib/analytics-query'
import type { AnalyticsDay, AnalyticsPageTotal, AnalyticsTrafficSource } from '@/lib/analytics-types'

export function AnalyticsError({ error }: { error: { code: string; message: string } }) {
  const copy = publicAnalyticsError(error)
  return (
    <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-5">
      <p className="font-medium text-destructive">{copy.title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{copy.message}</p>
    </div>
  )
}

export function MetricCards({ items }: { items: { label: string; value: number; hint?: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{item.value.toLocaleString('tr-TR')}</p>
          {item.hint ? <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p> : null}
        </div>
      ))}
    </div>
  )
}

export function MetricsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {['a', 'b', 'c', 'd'].map((key) => (
        <div key={key} className="rounded-xl border border-border bg-card p-5">
          <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
          <div className="mt-3 h-8 w-16 animate-pulse rounded bg-secondary" />
        </div>
      ))}
    </div>
  )
}

export function TopPages({ pages }: { pages: AnalyticsPageTotal[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="pb-3 font-medium">URL</th>
            <th className="pb-3 text-right font-medium">Görüntülenme</th>
            <th className="pb-3 text-right font-medium">Tekil ziyaretçi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pages.map((item) => (
            <tr key={item.path}>
              <td className="max-w-[280px] truncate py-2.5 font-medium">{item.path}</td>
              <td className="py-2.5 text-right tabular-nums">{item.views.toLocaleString('tr-TR')}</td>
              <td className="py-2.5 text-right tabular-nums">{(item.visitors || 0).toLocaleString('tr-TR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pages.length === 0 && <p className="text-sm text-muted-foreground">Henüz ziyaret verisi yok.</p>}
    </div>
  )
}

function dayLabel(date: string) {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(`${date}T12:00:00+03:00`) : new Date(date)
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Istanbul',
  }).format(parsed)
}

export function DailyChart({ days }: { days: AnalyticsDay[] }) {
  const max = Math.max(...days.map((item) => item.views), 1)
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-[720px] items-end gap-2" style={{ height: 240 }}>
        {days.map((day) => (
          <div key={day.date} className="flex h-full flex-1 flex-col justify-end gap-2">
            <div className="flex flex-1 items-end">
              <div
                title={`${dayLabel(day.date)}\nGörüntülenme: ${day.views}\nTekil ziyaretçi: ${day.visitors}`}
                className="w-full rounded-t bg-primary transition-colors hover:bg-accent"
                style={{ height: `${Math.max((day.views / max) * 100, day.views ? 4 : 1)}%` }}
              />
            </div>
            <span className="-rotate-45 whitespace-nowrap text-[10px] text-muted-foreground">
              {new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short', timeZone: 'Europe/Istanbul' }).format(
                /^\d{4}-\d{2}-\d{2}$/.test(day.date) ? new Date(`${day.date}T12:00:00+03:00`) : new Date(day.date),
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function TrafficSources({ sources }: { sources: AnalyticsTrafficSource[] }) {
  const order = ['Direct', 'Google', 'Bing', 'Diğer yönlendirmeler']
  const labels: Record<string, string> = {
    Direct: 'Direct',
    Google: 'Google',
    Bing: 'Bing',
    'Diğer yönlendirmeler': 'Diğer yönlendirmeler',
  }
  const bySource = new Map(sources.map((item) => [item.source, item]))
  const rows = order.map((source) => bySource.get(source) || { source, views: 0, visitors: 0 })
  return (
    <div className="divide-y divide-border">
      {rows.map((item) => (
        <div key={item.source} className="flex items-center justify-between gap-4 py-3 text-sm">
          <span>{labels[item.source] || item.source}</span>
          <span className="tabular-nums text-muted-foreground">
            {item.views.toLocaleString('tr-TR')} görüntülenme · {item.visitors.toLocaleString('tr-TR')} tekil
          </span>
        </div>
      ))}
    </div>
  )
}
