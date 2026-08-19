import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { LocalBreadcrumbs } from '@/components/local-seo/breadcrumbs'
import { HubContentSections, HubFaqAndCta } from '@/components/local-seo/hub-sections'
import { getSiblingDistricts, type TurkeyCity, type TurkeyDistrict, type TurkeyRegion } from '@/lib/locations/turkey'
import { enCityPath, enDistrictPath, enRegionName, enRegionPath } from '@/lib/local-seo/en-resolve'
import { enNationalHubSections, enRegionHubSections, enCityHubSections, enDistrictHubSections } from '@/lib/local-seo/en-hub-content'
import { getLocalServicesByCategory } from '@/lib/services/service-registry'
import { getEnglishService } from '@/lib/services-en'
import { toEnglishServiceSlug } from '@/lib/i18n'
import type { EnLocalHubModel } from '@/lib/local-seo/en-content'

function EnHubHero({ model, kicker }: { model: EnLocalHubModel; kicker: string }) {
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
          <Link href="/en/contact" className={buttonVariants({ size: 'lg', className: 'h-11 px-5' })}>
            Discuss Your Project
          </Link>
          <Link href="/en/services" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 px-5' })}>
            All Services
          </Link>
        </div>
      </div>
    </section>
  )
}

function EnServiceGroups({ hrefFor, locationLabel }: { hrefFor: (slug: string) => string; locationLabel: string }) {
  const groups = getLocalServicesByCategory()
  return (
    <section className="border-b border-border py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold">Services in {locationLabel}</h2>
        <div className="mt-8 space-y-10">
          {[...groups.entries()].map(([, items]) => (
            <div key={items[0]?.slug} className="grid gap-4 sm:grid-cols-2">
              {items.map((service) => {
                const en = getEnglishService(toEnglishServiceSlug(service.slug))
                if (!en) return null
                return (
                  <Link key={service.slug} href={hrefFor(toEnglishServiceSlug(service.slug))} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                    <p className="font-display font-semibold">{en.title} in {locationLabel}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{en.description}</p>
                  </Link>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EnNationalHub({ model }: { model: EnLocalHubModel }) {
  const sections = enNationalHubSections()
  return (
    <article>
      <EnHubHero model={model} kicker="Turkey • Service Areas" />
      <HubContentSections sections={sections} />
      <HubFaqAndCta faqs={model.faqs} />
    </article>
  )
}

export function EnRegionHub({ model, region }: { model: EnLocalHubModel; region: TurkeyRegion }) {
  const sections = enRegionHubSections(region)
  return (
    <article>
      <EnHubHero model={model} kicker={`Turkey • ${enRegionName(region)}`} />
      <HubContentSections sections={sections} />
      <HubFaqAndCta faqs={model.faqs} />
    </article>
  )
}

export function EnCityHub({ model, city }: { model: EnLocalHubModel; city: TurkeyCity }) {
  const sections = enCityHubSections(city)
  return (
    <article>
      <EnHubHero model={model} kicker={`${enRegionName(city.region)} • ${city.name}`} />
      <HubContentSections sections={sections} />
      <EnServiceGroups hrefFor={(slug) => `${enCityPath(city)}/${slug}`} locationLabel={city.name} />
      <HubFaqAndCta faqs={model.faqs} />
    </article>
  )
}

export function EnDistrictHub({ model, city, district }: { model: EnLocalHubModel; city: TurkeyCity; district: TurkeyDistrict }) {
  const sections = enDistrictHubSections(city, district)
  const others = getSiblingDistricts(city, district.slug, 12)
  return (
    <article>
      <EnHubHero model={model} kicker={`${city.name} • ${district.name}`} />
      <HubContentSections sections={sections} />
      <EnServiceGroups hrefFor={(slug) => `${enDistrictPath(city, district)}/${slug}`} locationLabel={district.name} />
      <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold">Other Districts in {city.name}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {others.map((item) => (
              <Link key={item.slug} href={enDistrictPath(city, item)} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary">
                {item.name}
              </Link>
            ))}
          </div>
          <Link href={enCityPath(city)} className="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
            All districts
          </Link>
        </div>
      </section>
      <HubFaqAndCta faqs={model.faqs} />
    </article>
  )
}
