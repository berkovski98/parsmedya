import { MetricsSkeleton } from '@/components/admin/analytics-widgets'

export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
      <div className="mt-3 h-4 w-80 animate-pulse rounded bg-secondary" />
      <div className="mt-8"><MetricsSkeleton /></div>
      <div className="mt-8 h-64 animate-pulse rounded-xl bg-secondary" />
    </div>
  )
}
