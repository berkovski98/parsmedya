'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SELECTOR = '[data-reveal]:not([data-inview])'

/**
 * Marks `[data-reveal]` elements with `data-inview` once they scroll into view.
 * Styling lives in globals.css; elements stay visible when JS or motion is unavailable.
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    root.dataset.revealBound = '1'
    if (!('IntersectionObserver' in window)) return

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        ;(entry.target as HTMLElement).dataset.inview = ''
        io.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 })

    const scan = (scope: ParentNode) => scope.querySelectorAll<HTMLElement>(SELECTOR).forEach((element) => io.observe(element))
    scan(document)

    // Streamed server components (e.g. blog lists) arrive after the first scan.
    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches(SELECTOR)) io.observe(node)
          scan(node)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
