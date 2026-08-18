import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { LocalBreadcrumb } from '@/lib/local-seo/content'

export function LocalBreadcrumbs({ items }: { items: LocalBreadcrumb[] }) {
  return (
    <nav aria-label="Sayfa yolu" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, index) => {
        const last = index === items.length - 1
        return (
          <span key={`${item.href}:${item.name}`} className="inline-flex items-center gap-1.5">
            {index > 0 ? <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
            {last ? (
              <span className="text-foreground">{item.name}</span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-foreground">
                {item.name}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
