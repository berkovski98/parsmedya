import { requireAdmin } from '@/lib/supabase/auth'
import { getAnalyticsDetails } from '@/lib/analytics'
import { analyticsDisabledReason } from '@/lib/analytics-config'
import {
  AnalyticsError,
  DailyChart,
  MetricCards,
  TopPages,
  TrafficSources,
} from '@/components/admin/analytics-widgets'

export default async function AnalyticsPage() {
  await requireAdmin()
  const analyticsResult = await getAnalyticsDetails()
  const trackingDisabled = analyticsDisabledReason()
  if (!analyticsResult.ok) {
    console.error(JSON.stringify({ event: 'admin_analytics_failed', code: analyticsResult.error.code, message: analyticsResult.error.message }))
    return (
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-3xl font-bold">İstatistikler</h1>
        <p className="mt-2 text-muted-foreground">Son 30 günlük anonim ziyaretçi hareketlerini inceleyin.</p>
        <div className="mt-8"><AnalyticsError error={analyticsResult.error} /></div>
      </div>
    )
  }
  const analytics = analyticsResult.data
  const started = analytics.tracking_started_at
    ? new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeZone: 'Europe/Istanbul' }).format(new Date(analytics.tracking_started_at))
    : null
  const metrics = [
    { label: 'Son 7 gün görüntülenme', value: analytics.seven_day_views },
    { label: 'Son 7 gün tekil ziyaretçi', value: analytics.seven_day_visitors },
    { label: 'Son 30 gün görüntülenme', value: analytics.thirty_day_views },
    { label: 'Son 30 gün tekil ziyaretçi', value: analytics.thirty_day_visitors },
  ]
  const locales = [
    { label: 'Türkçe görüntülenme', value: analytics.tr_views, hint: `Tekil ziyaretçi: ${analytics.tr_visitors.toLocaleString('tr-TR')}` },
    { label: 'İngilizce görüntülenme', value: analytics.en_views, hint: `Tekil ziyaretçi: ${analytics.en_visitors.toLocaleString('tr-TR')}` },
  ]
  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="font-display text-3xl font-bold">İstatistikler</h1>
      <p className="mt-2 text-muted-foreground">Son 30 günlük anonim ziyaretçi hareketlerini inceleyin.</p>
      {trackingDisabled ? (
        <p className="mt-6 rounded-lg border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
          Ziyaretçi takibi kapalı: {trackingDisabled}. Production için NEXT_PUBLIC_ANALYTICS_ENABLED=true ve ANALYTICS_ENABLED=true ayarlayın.
        </p>
      ) : null}
      {started ? (
        <p className="mt-6 rounded-lg border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
          Analytics tracking {started} tarihinden itibaren veri toplamaya başladı. Önceki döneme ait ziyaretler uydurulmaz.
        </p>
      ) : (
        <p className="mt-6 rounded-lg border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
          Henüz kaydedilmiş ziyaret yok. Public sayfalar gezildikten sonra burada gerçek sayılar görünür.
        </p>
      )}
      <div className="mt-8"><MetricCards items={metrics} /></div>
      <div className="mt-4"><MetricCards items={locales} /></div>
      <section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
        <h2 className="font-display text-xl font-bold">Günlük görüntülenme ve tekil ziyaretçi</h2>
        <p className="mt-1 text-sm text-muted-foreground">Europe/Istanbul günlerine göre. Trafik olmayan günler 0 olarak yer alır.</p>
        <div className="mt-8"><DailyChart days={analytics.daily} /></div>
      </section>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">En çok görüntülenen sayfalar</h2>
          <div className="mt-6"><TopPages pages={analytics.top_pages} /></div>
        </section>
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Trafik kaynakları</h2>
          <div className="mt-3"><TrafficSources sources={analytics.traffic_sources} /></div>
        </section>
      </div>
    </div>
  )
}
