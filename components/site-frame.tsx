'use client'

import { usePathname } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnalyticsTracker } from '@/components/analytics-tracker'

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'tr'
  if (isAdmin) return children
  return <div className="flex min-h-screen flex-col"><AnalyticsTracker /><SiteHeader locale={locale} /><main className="flex-1">{children}</main><SiteFooter locale={locale} /></div>
}
