import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { LocalBreadcrumbs } from '@/components/local-seo/breadcrumbs'
import { ServiceVisual } from '@/components/service-page/service-visual'
import type { LocalServicePageModel } from '@/lib/local-seo/content'
import { getLocalServiceVisual } from '@/lib/services/service-registry'

export function LocalServiceHero({ model }: { model: LocalServicePageModel }) {
  return (
    <section className="relative overflow-x-clip border-b border-border bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 50% at 80% 0%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 60%), linear-gradient(rgba(15,23,42,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.04) 1px, transparent 1px)',
          backgroundSize: 'auto, 28px 28px, 28px 28px',
        }}
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:py-16">
        <div className="min-w-0">
          <LocalBreadcrumbs items={model.breadcrumbs} />
          <p className="mt-5 inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
            {model.eyebrow}
          </p>
          <h1 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {model.h1}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-foreground/80">
            {model.heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/iletisim" className={buttonVariants({ size: 'lg', className: 'h-11 px-5' })}>
              Projenizi Konuşalım
            </Link>
            <Link href="#hizmet-ozeti" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 px-5' })}>
              Hizmeti İncele
            </Link>
          </div>
        </div>
        <div className="min-w-0">
          <ServiceVisual visual={getLocalServiceVisual(model.service.slug)} />
        </div>
      </div>
    </section>
  )
}
