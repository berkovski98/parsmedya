import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ServiceVisual } from '@/components/service-page/service-visual'
import { SERVICE_UI, type ServicePageModel } from '@/lib/service-page'

type Props = {
  model: ServicePageModel
}

export function ServiceHero({ model }: Props) {
  const ui = SERVICE_UI[model.locale]

  return (
    <section className="relative overflow-x-clip border-b border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 80% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:py-16">
        <div className="min-w-0">
          <nav aria-label={model.locale === 'en' ? 'Breadcrumb' : 'Sayfa yolu'} className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Link href={model.homeHref} className="transition-colors hover:text-foreground">
              {ui.home}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            <Link href={model.servicesHref} className="transition-colors hover:text-foreground">
              {ui.services}
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="text-foreground">{model.title}</span>
          </nav>

          <p className="mt-5 inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
            {model.category}
          </p>

          <h1 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {model.title}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-foreground/80">
            {model.tagline}
          </p>
          <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {model.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={model.contactHref} className={buttonVariants({ size: 'lg', className: 'h-11 px-5' })}>
              {ui.talk}
            </Link>
            <Link
              href="#capabilities"
              className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 px-5' })}
            >
              {ui.explore}
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          <ServiceVisual visual={model.visual} />
        </div>
      </div>
    </section>
  )
}
