import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PixelField } from '@/components/pixel-field'
import { localeHomePath, type Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'

interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  locale?: Locale
  parent?: { label: string; href?: string }
}

export function PageHeader({ eyebrow, title, description, locale = 'tr', parent }: PageHeaderProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 bg-right-top text-white [mask-image:radial-gradient(ellipse_70%_100%_at_85%_0%,#000_10%,transparent_70%)]" />
      <PixelField className="-z-10 hidden md:block [mask-image:radial-gradient(ellipse_60%_100%_at_100%_0%,#000_10%,transparent_70%)]" />
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-16">
        <nav
          aria-label={locale === 'en' ? 'Breadcrumb' : 'Sayfa yolu'}
          className="intro flex flex-wrap items-center gap-1.5 text-sm text-white/55"
        >
          <Link href={localeHomePath(locale)} className="transition-colors hover:text-white">
            {locale === 'en' ? 'Home' : 'Ana Sayfa'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          {parent && <>{parent.href ? <Link href={parent.href} className="transition-colors hover:text-white">{parent.label}</Link> : <span>{parent.label}</span>}<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></>}
          <span className="text-white" aria-current="page">{eyebrow}</span>
        </nav>

        <h1 className="text-display mt-8 max-w-4xl text-balance text-[2.4rem] text-white sm:text-6xl">
          <span className="hero-line"><span style={stagger(0)}>{title}</span></span>
        </h1>
        {description && (
          <p className="intro mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70" style={stagger(2)}>
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
