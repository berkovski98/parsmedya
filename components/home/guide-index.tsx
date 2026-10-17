'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** Sticky in-page index for the long services guide, highlighting the section in view. */
export function GuideIndex({ items, label }: { items: { id: string; title: string }[]; label: string }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-30% 0px -60% 0px' })
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) io.observe(element)
    })
    return () => io.disconnect()
  }, [items])

  return (
    <nav aria-label={label} className="sticky top-28 hidden self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 lg:block">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <ol className="mt-4 space-y-0.5 border-l border-border">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              className={cn(
                '-ml-px flex gap-3 border-l-2 py-1.5 pl-4 text-[0.8125rem] leading-snug transition-colors duration-300',
                active === item.id ? 'border-accent font-semibold text-foreground' : 'border-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground',
              )}
            >
              <span className="tabular-nums text-muted-foreground/70">{String(index + 1).padStart(2, '0')}</span>
              <span>{item.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
