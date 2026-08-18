import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { LocalBreadcrumbs } from '@/components/local-seo/breadcrumbs'
import { getCitiesByRegion, getSiblingDistricts, type TurkeyCity, type TurkeyDistrict } from '@/lib/locations/turkey'
import type { LocalHubModel } from '@/lib/local-seo/content'
import { getLocalServices, getLocalServicesByCategory } from '@/lib/services/service-registry'

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

function FaqAndCta({ model }: { model: LocalHubModel }) {
  return (
    <>
      <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold">Sık sorulan sorular</h2>
          <div className="mt-8 space-y-4">
            {model.faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-border bg-card p-5">
                <summary className="cursor-pointer font-display font-semibold">{faq.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold">Projenizi Birlikte Planlayalım</h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            İşletmenize özel yazılım, web, otomasyon veya dijital büyüme ihtiyacınızı Pars Medya ekibiyle değerlendirin.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/iletisim" className={buttonVariants({ size: 'lg', className: 'h-11 bg-accent px-5 text-accent-foreground hover:bg-accent/90' })}>
              Projenizi Anlatın
            </Link>
            <Link href="mailto:info@parsmedya.net" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 border-primary-foreground/20 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10' })}>
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function LocalNationalHub({ model }: { model: LocalHubModel }) {
  const regions = getCitiesByRegion()
  return (
    <article>
      <HubHero model={model} kicker="Türkiye • Hizmet bölgeleri" />
      {regions.map((group) => (
        <section key={group.region} className="border-b border-border py-10 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl font-bold">{group.region}</h2>
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
      <FaqAndCta model={model} />
    </article>
  )
}

function ServiceGroups({ hrefFor }: { hrefFor: (slug: string) => string }) {
  const groups = getLocalServicesByCategory()
  return (
    <div className="space-y-10">
      {[...groups.entries()].map(([category, items]) => (
        <div key={category}>
          <h2 className="font-display text-2xl font-bold">{category}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {items.map((service) => (
              <Link key={service.slug} href={hrefFor(service.slug)} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                <p className="font-display font-semibold">{service.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function LocalCityHub({ model, city }: { model: LocalHubModel; city: TurkeyCity }) {
  const popular = getLocalServices().filter((service) => service.source.featuredOnHome).slice(0, 6)
  const featured = popular.length ? popular : getLocalServices().slice(0, 6)
  return (
    <article>
      <HubHero model={model} kicker={`${city.region} • ${city.name}`} />
      <section className="border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold">Popüler hizmetler</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((service) => (
              <Link key={service.slug} href={`/${city.slug}/${service.slug}`} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
                <p className="font-display font-semibold">{service.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.shortDescription}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="border-b border-border bg-secondary/40 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ServiceGroups hrefFor={(slug) => `/${city.slug}/${slug}`} />
        </div>
      </section>
      <section className="border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-bold">{city.name} ilçeleri</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {city.districts.map((district) => (
              <Link
                key={district.slug}
                href={`/${city.slug}/${district.slug}`}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary"
              >
                {district.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <FaqAndCta model={model} />
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
      <section className="border-b border-border py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ServiceGroups hrefFor={(slug) => `/${city.slug}/${district.slug}/${slug}`} />
        </div>
      </section>
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
      <FaqAndCta model={model} />
    </article>
  )
}
