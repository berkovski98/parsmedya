import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { services, getService } from '@/lib/services'
import { PageHeader } from '@/components/page-header'
import { ContactCta } from '@/components/contact-cta'
import { buttonVariants } from '@/components/ui/button'
import { localizedAlternates } from '@/lib/seo'
import { toEnglishServiceSlug } from '@/lib/i18n'

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return { title: 'Hizmet Bulunamadı | ParsMedya' }
  return {
    title: service.seoTitle ?? `${service.title} | ParsMedya`,
    description: service.seoDescription ?? service.description,
    alternates: localizedAlternates(`/hizmetler/${service.slug}`, `/hizmetler/${service.slug}`, `/en/services/${toEnglishServiceSlug(service.slug)}`),
  }
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = getService(slug)

  if (!service) {
    notFound()
  }

  const Icon = service.icon
  const otherServices = service.relatedSlugs?.length
    ? service.relatedSlugs
        .map((relatedSlug) => getService(relatedSlug))
        .filter((related): related is NonNullable<typeof related> => Boolean(related))
        .slice(0, 3)
    : services.filter((candidate) => candidate.slug !== service.slug).slice(0, 3)

  return (
    <>
      <PageHeader
        eyebrow={service.title}
        title={service.tagline}
        description={service.intro}
      />

      {service.longDescription && (
        <section className="border-b border-border bg-background">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto] md:items-end md:py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-accent">
                Hizmete genel bakış
              </p>
              <h2 className="mt-3 text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {service.title} nedir?
              </h2>
              <div className="mt-6 space-y-4">
                {service.longDescription.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <Link href="/iletisim" className={buttonVariants()}>
              Ücretsiz Teklif Al
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Highlights + stats */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                    {service.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Neden ParsMedya?
                  </p>
                </div>
              </div>
              <ul className="mt-8 space-y-4">
                {service.highlights.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="leading-relaxed text-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {service.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <p className="font-display text-3xl font-bold text-accent">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            {service.longDescription ? 'Neler geliştiriyoruz?' : 'Neler sunuyoruz?'}
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {service.longDescription
              ? `${service.title} kapsamında geliştirdiğimiz çözümler`
              : 'Bu hizmet kapsamında öne çıkanlar'}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {service.features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-accent">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables + process */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                {service.benefits ? 'İşletmenize ne kazandırır?' : 'Teslimatlar'}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {service.benefits
                  ? 'İş süreçlerinizi güçlendiren ölçülebilir ve sürdürülebilir kazanımlar.'
                  : 'Proje sonunda elinize geçecek somut çıktılar.'}
              </p>
              <ul className="mt-6 space-y-3">
                {(service.benefits ?? service.deliverables).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span className="text-sm leading-relaxed text-foreground">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                Çalışma sürecimiz
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Şeffaf ve öngörülebilir bir yol izliyoruz.
              </p>
              <ol className="mt-6 space-y-6">
                {service.process.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-display font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-14">
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
              Kullandığımız teknolojiler
            </h3>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {service.useCases && (
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Kullanım alanları
            </p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hangi işletmeler ve süreçler için uygundur?
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.useCases.map((useCase) => (
                <article
                  key={useCase.title}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 shrink-0 text-accent" />
                    <h3 className="font-display font-semibold text-foreground">
                      {useCase.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {useCase.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      {service.packages.length > 0 && (
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Paketler
          </p>
          <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            İhtiyacınıza uygun çalışma modeli
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {service.packages.map((pkg) => (
              <article
                key={pkg.name}
                className={`relative flex flex-col rounded-xl border p-6 ${
                  pkg.featured
                    ? 'border-accent bg-card shadow-sm'
                    : 'border-border bg-card'
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    <Sparkles className="h-3 w-3" />
                    En çok tercih edilen
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-foreground">
                  {pkg.name}
                </h3>
                <p className="mt-1 font-display text-2xl font-bold text-accent">
                  {pkg.price}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {pkg.description}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="leading-relaxed text-foreground">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/iletisim"
                  className={buttonVariants({
                    variant: pkg.featured ? 'default' : 'outline',
                    className: 'mt-6 w-full',
                  })}
                >
                  Teklif Al
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {service.whyParsMedya && (
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent">
              Neden ParsMedya?
            </p>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Yazılım projenizde güvenilir teknoloji ortağı
            </h2>
            <div className="mt-8 max-w-4xl rounded-xl border border-border bg-card p-6 sm:p-8">
              <p className="leading-relaxed text-muted-foreground">
                {service.whyParsMedya}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Sık sorulan sorular
          </p>
          <h2 className="mt-3 text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Aklınıza takılanlar
          </h2>
          <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-foreground">
                  {faq.question}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {service.relatedSlugs ? 'İlgili hizmetler' : 'Diğer hizmetler'}
            </h2>
            <Link
              href="/hizmetler"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              Tümü
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {otherServices.map((other) => (
              <Link
                key={other.slug}
                href={`/hizmetler/${other.slug}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <other.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                  {other.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {other.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  Detaylı bilgi
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  )
}
