'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { RevealObserver } from '@/components/motion/reveal-observer'

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // The first page load is left untouched for LCP; later client navigations fade in.
  const [firstPath] = useState(pathname)
  const isAdmin = pathname.startsWith('/admin')
  const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'tr'
  if (isAdmin) return children
  return <div className="flex min-h-screen flex-col">
    <AnalyticsTracker />
    <RevealObserver />
    <a href="#main-content" className="sr-only z-[60] rounded-lg bg-accent px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">{locale === 'en' ? 'Skip to content' : 'İçeriğe geç'}</a>
    <SiteHeader locale={locale} />
    <main id="main-content" key={pathname} className={pathname === firstPath ? 'flex-1' : 'page-enter flex-1'}>{children}</main>
    <SiteFooter locale={locale} />
    <FloatingWhatsApp locale={locale} />
  </div>
}
