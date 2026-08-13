import { requireAdmin } from '@/lib/supabase/auth'
import { getAnalyticsDetails } from '@/lib/analytics'
import { DailyChart, MetricCards, TopPages, TopReferrers } from '@/components/admin/analytics-widgets'

export default async function AnalyticsPage() {
  await requireAdmin()
  const analytics = await getAnalyticsDetails()
  const metrics = [
    { label: 'Son 7 gün görüntülenme', value: analytics.seven_day_views },
    { label: 'Son 7 gün tekil ziyaretçi', value: analytics.seven_day_visitors },
    { label: 'Son 30 gün görüntülenme', value: analytics.thirty_day_views },
    { label: 'Son 30 gün tekil ziyaretçi', value: analytics.thirty_day_visitors },
  ]
  return <div className="mx-auto max-w-7xl"><h1 className="font-display text-3xl font-bold">İstatistikler</h1><p className="mt-2 text-muted-foreground">Son 30 günlük anonim ziyaretçi hareketlerini inceleyin.</p><div className="mt-8"><MetricCards items={metrics} /></div><section className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6"><h2 className="font-display text-xl font-bold">Günlük Görüntülenme ve Tekil Ziyaretçi</h2><p className="mt-1 text-sm text-muted-foreground">Çubuklar görüntülenmeyi, üzerine gelinen değerler tekil ziyaretçiyi de gösterir.</p><div className="mt-8"><DailyChart days={analytics.daily} /></div></section><div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-border bg-card p-6"><h2 className="font-display text-xl font-bold">En Çok Ziyaret Edilen Sayfalar</h2><div className="mt-6"><TopPages pages={analytics.top_pages} /></div></section><section className="rounded-xl border border-border bg-card p-6"><h2 className="font-display text-xl font-bold">En Çok Trafik Gönderen Kaynaklar</h2><div className="mt-3"><TopReferrers referrers={analytics.top_referrers} /></div></section></div></div>
}
