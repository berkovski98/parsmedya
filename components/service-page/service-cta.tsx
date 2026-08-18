import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { SERVICE_UI, tx, type ServicePageModel } from '@/lib/service-page'

export function ServiceCTA({ model }: { model: ServicePageModel }) {
  const ui = SERVICE_UI[model.locale]

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {tx(model.extras.ctaTitle, model.locale)}
        </h2>
        <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-primary-foreground/80">
          {tx(model.extras.ctaText, model.locale)}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={model.contactHref}
            className={buttonVariants({
              size: 'lg',
              className: 'h-11 bg-accent px-5 text-accent-foreground hover:bg-accent/90',
            })}
          >
            {ui.talk}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={model.contactHref}
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className: 'h-11 border-white/20 bg-transparent px-5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground',
            })}
          >
            {ui.contact}
          </Link>
        </div>
      </div>
    </section>
  )
}
