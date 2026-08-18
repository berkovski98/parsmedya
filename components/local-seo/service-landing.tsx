import type { ReactNode } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { LocalServiceHero } from '@/components/local-seo/service-hero'
import type { LocalServicePageModel } from '@/lib/local-seo/content'
import { cn } from '@/lib/utils'

function Section({
  id,
  title,
  children,
  className,
}: {
  id?: string
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('border-b border-border py-12 sm:py-16', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

export function LocalServiceLanding({ model }: { model: LocalServicePageModel }) {
  const Icon = model.service.icon
  return (
    <article className="overflow-x-hidden bg-background">
      <LocalServiceHero model={model} />

      <Section id="hizmet-ozeti" title={`${model.service.title} özeti`}>
        <p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">{model.serviceSummary}</p>
      </Section>

      <Section title={`${model.district?.name || model.city.name} için yaklaşımımız`} className="bg-secondary/40">
        <p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">{model.locationIntro}</p>
      </Section>

      <Section title="İşletmeler için çözüm alanları">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {model.solutionAreas.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/20">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Neler geliştiriyoruz?" className="bg-secondary/40">
        <div className="grid gap-4 sm:grid-cols-2">
          {model.capabilities.map((item) => (
            <div key={item.title} className="flex gap-3 rounded-2xl border border-border bg-card p-5">
              <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="font-display font-semibold">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Hizmet özellikleri">
        <div className="grid gap-4 sm:grid-cols-2">
          {model.features.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Teknoloji altyapısı" className="bg-secondary/40">
        <div className="flex flex-wrap gap-2">
          {model.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium">
              {tech}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Çalışma süreci">
        <ol className="grid gap-4 md:grid-cols-2">
          {model.process.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">0{index + 1}</p>
              <p className="mt-2 font-display font-semibold">{step.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      {model.useCases.length > 0 ? (
        <Section title="Kullanım senaryoları" className="bg-secondary/40">
          <div className="grid gap-4 sm:grid-cols-2">
            {model.useCases.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-display font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Sektörel çözümler">
        <div className="grid gap-4 sm:grid-cols-2">
          {model.sectorNotes.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Neden Pars Medya?" className="bg-secondary/40">
        <div className="grid gap-4 sm:grid-cols-2">
          {model.why.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {model.districts.length > 0 ? (
        <Section title={`${model.city.name}'da hizmet verdiğimiz bölgeler`}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {model.districts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      {model.otherDistricts.length > 0 ? (
        <Section title={`${model.city.name}'daki diğer bölgeler`}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {model.otherDistricts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <Link href={model.allDistrictsHref} className="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
            Tüm bölgeler
          </Link>
        </Section>
      ) : null}

      <Section title="Sık sorulan sorular" className="bg-secondary/40">
        <div className="space-y-4">
          {model.faqs.map((faq) => (
            <details key={faq.question} className="rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-display font-semibold">{faq.question}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight">{model.ctaTitle}</h2>
          <p className="mt-4 max-w-2xl text-pretty text-primary-foreground/80">{model.ctaText}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/tr/iletisim" className={buttonVariants({ size: 'lg', className: 'h-11 bg-accent px-5 text-accent-foreground hover:bg-accent/90' })}>
              Projenizi Anlatın
            </Link>
            <Link href="mailto:info@parsmedya.net" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 border-primary-foreground/20 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10' })}>
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>

      <Section title="İlgili hizmetler">
        <div className="grid gap-4 sm:grid-cols-2">
          {model.relatedServices.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </Section>

      {model.relatedLocations.length > 0 ? (
        <Section title="Yakın ve ilgili lokasyonlar" className="border-b-0">
          <div className="flex flex-wrap gap-2">
            {model.relatedLocations.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm transition-colors hover:border-primary/30"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </article>
  )
}
