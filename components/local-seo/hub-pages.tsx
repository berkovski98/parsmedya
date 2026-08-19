import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { LocalBreadcrumbs } from '@/components/local-seo/breadcrumbs'
import { HubContentSections, HubFaqAndCta } from '@/components/local-seo/hub-sections'
import { getCitiesByRegion, getSiblingDistricts, type TurkeyCity, type TurkeyDistrict, type TurkeyRegion } from '@/lib/locations/turkey'
import { localRegionPath } from '@/lib/local-seo/resolve'
import type { LocalHubModel } from '@/lib/local-seo/content'
import { getLocalServicesByCategory } from '@/lib/services/service-registry'

function ServiceGroups({ hrefFor, locationLabel }: { hrefFor: (slug: string) => string; locationLabel: string }) {
  const groups = getLocalServicesByCategory()
  return (
    <section className="border-b border-border py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold">{locationLabel} Hizmet Sayfaları</h2>
        <div className="mt-8 space-y-10">
          {[...groups.entries()].map(([category, items]) => (
            <div key={category}>
              <h3 className="font-display text-xl font-semibold">{category}</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {items.map((service) => (
                  <Link key={service.slug} href={hrefFor(service.slug)} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                    <p className="font-display font-semibold">{locationLabel} {service.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HubHero({ model, kicker }: { model: LocalHubModel; kicker: string }) {
  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 45% at 10% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)',
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <LocalBreadcrumbs items={model.breadcrumbs} />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">{model.h1}</h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{model.intro}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/iletisim" className={buttonVariants({ size: 'lg', className: 'h-11 px-5' })}>
            Projenizi Konuşalım
          </Link>
          <Link href="/hizmetler" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 px-5' })}>
            Tüm hizmetler
          </Link>
        </div>
      </div>
    </section>
  )
}

export function LocalNationalHub({ model }: { model: LocalHubModel }) {
  const regions = getCitiesByRegion()
  return (
    <article>
      <HubHero model={model} kicker="Türkiye • Bölgelerimiz" />
      <HubContentSections sections={model.sections} />
      {regions.map((group) => (
        <section key={group.region} className="border-b border-border py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-bold">{group.region}</h2>
              <Link href={localRegionPath(group.region)} className="text-sm font-medium text-primary hover:underline">
                Bölge sayfasına git
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {group.cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
      <HubFaqAndCta faqs={model.faqs} />
    </article>
  )
}

export function LocalRegionHub({ model, region }: { model: LocalHubModel; region: TurkeyRegion }) {
  return (
    <article>
      <HubHero model={model} kicker={`Türkiye • ${region}`} />
      <HubContentSections sections={model.sections} />
      <HubFaqAndCta faqs={model.faqs} />
    </article>
  )
}

export function LocalCityHub({ model, city }: { model: LocalHubModel; city: TurkeyCity }) {
  return (
    <article>
      <HubHero model={model} kicker={`${city.region} • ${city.name}`} />
      <HubContentSections sections={model.sections} />
      <ServiceGroups hrefFor={(slug) => `/${city.slug}/${slug}`} locationLabel={city.name} />
      <HubFaqAndCta faqs={model.faqs} />
    </article>
  )
}

export function LocalDistrictHub({
  model,
  city,
  district,
}: {
  model: LocalHubModel
  city: TurkeyCity
  district: TurkeyDistrict
}) {
  const others = getSiblingDistricts(city, district.slug, 12)
  return (
    <article>
      <HubHero model={model} kicker={`${city.name} • ${district.name}`} />
      <HubContentSections sections={model.sections} />
      <ServiceGroups hrefFor={(slug) => `/${city.slug}/${district.slug}/${slug}`} locationLabel={district.name} />
      <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold">{city.name} içindeki diğer bölgeler</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/${city.slug}/${item.slug}`}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link href={`/${city.slug}`} className="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
            Tüm bölgeler
          </Link>
        </div>
      </section>
      <HubFaqAndCta faqs={model.faqs} />
    </article>
  )
}
