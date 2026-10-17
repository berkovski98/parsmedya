'use client'

import { useEffect, useState } from 'react'
import { WhatsAppIcon, WhatsAppLink } from '@/components/contact-actions'
import { CONTACT_LABELS } from '@/lib/contact-info'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/** Fixed WhatsApp button. Hidden near the top on small screens and whenever the footer is visible. */
export function FloatingWhatsApp({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false)
  const [footerVisible, setFooterVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 160)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const footer = document.querySelector('[data-site-footer]')
    const io = footer && 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)), { rootMargin: '0px 0px -40px 0px' })
      : null
    if (footer && io) io.observe(footer)
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  const visible = !footerVisible
  return (
    <div
      className={cn(
        'fixed right-4 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:right-6',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0',
        !scrolled && 'max-md:pointer-events-none max-md:translate-y-6 max-md:opacity-0',
      )}
      style={{ bottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 0.75rem))' }}
    >
      <WhatsAppLink
        locale={locale}
        className="group flex h-14 items-center gap-0 rounded-full bg-ink p-1.5 pr-1.5 text-ink-foreground shadow-[0_18px_40px_-14px_rgb(10_20_50/0.55)] ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:gap-3 hover:pr-5 focus-visible:gap-3 focus-visible:pr-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-ink">
          <WhatsAppIcon className="size-[22px]" />
        </span>
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-[max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-48 group-focus-visible:max-w-48">
          {CONTACT_LABELS[locale].whatsapp}
        </span>
      </WhatsAppLink>
    </div>
  )
}
