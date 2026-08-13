import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { localeHomePath, type Locale } from '@/lib/i18n'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  locale?: Locale
  parent?: { label: string; href?: string }
}

export function PageHeader({ eyebrow, title, description, locale = 'tr', parent }: PageHeaderProps) {
  return (
    <section className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <nav
          aria-label="Sayfa yolu"
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <Link href={localeHomePath(locale)} className="transition-colors hover:text-foreground">
            {locale === 'en' ? 'Home' : 'Ana Sayfa'}
          </Link>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          {parent && <>{parent.href ? <Link href={parent.href} className="transition-colors hover:text-foreground">{parent.label}</Link> : <span>{parent.label}</span>}<ChevronRight className="h-4 w-4" aria-hidden="true" /></>}
          <span className="text-foreground">{eyebrow}</span>
        </nav>

        <h1 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
