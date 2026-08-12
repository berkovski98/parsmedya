import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { services } from '@/lib/services'

interface ServicesProps {
  home?: boolean
}

export function Services({ home = false }: ServicesProps) {
  return (
    <section
      id="hizmetler"
      aria-labelledby="services-heading"
      className="border-b border-border bg-background"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">
          Hizmetlerimiz
        </p>
        <h2
          id="services-heading"
          className="mt-3 max-w-3xl text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {home
            ? 'Markanızı Dijital Dünyada Büyüten Hizmetler'
            : 'Markanızı ileri taşıyacak hizmetler'}
        </h2>
        {home && (
          <p className="mt-5 max-w-4xl text-pretty leading-relaxed text-muted-foreground">
            Pars Medya olarak markaların dijital dünyada güçlü, ölçülebilir ve
            sürdürülebilir bir büyüme elde etmesi için ihtiyaç duyduğu çözümleri
            tek çatı altında sunuyoruz. Stratejiden tasarıma, yazılımdan dijital
            pazarlamaya kadar tüm süreçleri markanızın hedeflerine özel olarak
            planlıyoruz.
          </p>
        )}

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <service.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                <Link
                  href={`/hizmetler/${service.slug}`}
                  className="transition-colors hover:text-accent focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {service.title}
                </Link>
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <Link
                href={`/hizmetler/${service.slug}`}
                aria-label={`${service.title} hakkında detaylı bilgi`}
                className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Detaylı Bilgi
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>

        {home && (
          <div className="mt-10 flex justify-center sm:mt-12">
            <Link
              href="/hizmetler"
              className={buttonVariants({
                size: 'lg',
                className: 'min-h-11 px-5',
              })}
            >
              Tüm Hizmetlerimizi İnceleyin
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
