import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'
import {
  getServiceCategory,
  serviceCategoryOrder,
  services,
} from '@/lib/services'
import { englishServices } from '@/lib/services-en'

type CardService = { slug: string; title: string; description: string; icon: LucideIcon }

interface ServicesProps {
  home?: boolean
  locale?: Locale
  /** English listing page shows every service in one grid. */
  all?: boolean
}

function ServiceCard({ service, index, locale }: { service: CardService; index: number; locale: Locale }) {
  const english = locale === 'en'
  const href = english ? `/en/services/${service.slug}` : `/hizmetler/${service.slug}`
  return (
    <article data-reveal style={stagger(index % 3)} className="card-hairline group relative flex h-full flex-col bg-card p-7 transition-colors duration-500 hover:bg-secondary/50 sm:p-8">
      <div className="flex items-start justify-between">
        <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-background text-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
          <service.icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="font-display text-xs font-bold tabular-nums tracking-wider text-muted-foreground/60" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-7 font-display text-xl font-bold tracking-tight text-foreground">
        <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-sm focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring">
          {service.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground">
        {service.description}
      </p>
      <span className="mt-7 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-accent-strong" aria-hidden="true">
        {english ? 'Learn More' : 'Detaylı Bilgi'}
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </article>
  )
}

function ServiceGrid({ items, locale }: { items: CardService[]; locale: Locale }) {
  return (
    <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3 [&>*]:border-b [&>*]:border-r [&>*]:border-border">
      {items.map((service, index) => <ServiceCard key={service.slug} service={service} index={index} locale={locale} />)}
    </div>
  )
}

export function Services({ home = false, locale = 'tr', all = false }: ServicesProps) {
  const english = locale === 'en'
  const source = english ? englishServices : services
  const featured = source.filter((service) => service.featuredOnHome)
  const grouped = !english && !home
  const items = english && !all ? featured : home ? featured : source
  const servicesHref = english ? '/en/services' : '/hizmetler'

  const heading = english
    ? 'Technology solutions designed for sustainable growth'
    : home ? 'Markanızı Dijital Dünyada Büyüten Hizmetler' : 'Web’den kurumsal sistemlere uçtan uca çözümler'
  const intro = english
    ? 'From strategy and product design to software engineering, integrations and digital growth, we plan every engagement around your organization’s goals.'
    : home ? 'Pars Medya olarak markaların dijital dünyada güçlü, ölçülebilir ve sürdürülebilir bir büyüme elde etmesi için ihtiyaç duyduğu çözümleri tek çatı altında sunuyoruz. Stratejiden tasarıma, yazılımdan dijital pazarlamaya kadar tüm süreçleri markanızın hedeflerine özel olarak planlıyoruz.' : null
  const showFooterLink = home || (english && !all)

  return (
    <section id={english ? undefined : 'hizmetler'} aria-labelledby="services-heading" className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div data-reveal>
            <p className="eyebrow">{english ? 'Our Services' : 'Hizmetlerimiz'}</p>
            <h2 id="services-heading" className="text-display mt-5 max-w-3xl text-balance text-[2.1rem] text-foreground sm:text-5xl">
              {heading}
            </h2>
            {intro && <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">{intro}</p>}
          </div>
          {showFooterLink && (
            <Link href={servicesHref} data-reveal className="group hidden h-12 items-center gap-2 rounded-lg border border-border px-5 text-sm font-semibold text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background lg:inline-flex">
              {english ? 'Explore All Services' : 'Tüm Hizmetlerimizi İnceleyin'}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          )}
        </div>

        {grouped ? (
          <div className="mt-14 space-y-16">
            {serviceCategoryOrder.map((category) => {
              const categoryServices = services.filter((service) => getServiceCategory(service) === category)
              if (!categoryServices.length) return null
              const id = `category-${category.replaceAll(' ', '-').toLocaleLowerCase('tr-TR')}`
              return <section key={category} aria-labelledby={id}>
                <div data-reveal="wipe" className="flex items-center gap-4">
                  <h3 id={id} className="font-display text-2xl font-bold tracking-tight text-foreground">{category}</h3>
                  <span className="text-sm tabular-nums text-muted-foreground">{String(categoryServices.length).padStart(2, '0')}</span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="mt-7"><ServiceGrid items={categoryServices} locale={locale} /></div>
              </section>
            })}
          </div>
        ) : (
          <div className="mt-14"><ServiceGrid items={items} locale={locale} /></div>
        )}

        {showFooterLink && <div className="mt-10 flex justify-center lg:hidden"><Link href={servicesHref} className="group inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground">{english ? 'Explore All Services' : 'Tüm Hizmetlerimizi İnceleyin'}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link></div>}
      </div>
    </section>
  )
}
