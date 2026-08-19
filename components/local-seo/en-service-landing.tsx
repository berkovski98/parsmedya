import type { ReactNode } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { LocalBreadcrumbs } from '@/components/local-seo/breadcrumbs'
import type { EnLocalServicePageModel } from '@/lib/local-seo/en-content'
import { cn } from '@/lib/utils'

function Section({ id, title, children, className }: { id?: string; title: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn('border-b border-border py-12 sm:py-16', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

export function EnServiceLanding({ model }: { model: EnLocalServicePageModel }) {
  const Icon = model.service.icon
  return (
    <article className="overflow-x-hidden bg-background">
      <section className="relative overflow-x-clip border-b border-border">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(ellipse 60% 45% at 10% 0%, color-mix(in oklab, var(--primary) 18%, transparent), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)' }} />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <LocalBreadcrumbs items={model.breadcrumbs} />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{model.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl font-bold tracking-tight sm:text-5xl">{model.h1}</h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{model.heroDescription}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/en/contact" className={buttonVariants({ size: 'lg', className: 'h-11 px-5' })}>Discuss Your Project</Link>
            <Link href="/en/services" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 px-5' })}>All Services</Link>
          </div>
        </div>
      </section>

      <Section id="service-overview" title="Service Overview">
        <div className="max-w-3xl space-y-4">
          <p className="text-pretty leading-relaxed text-muted-foreground">{model.serviceOverview}</p>
          {model.detailParagraphs.map((p) => (
            <p key={p.slice(0, 48)} className="text-pretty leading-relaxed text-muted-foreground">{p}</p>
          ))}
        </div>
      </Section>

      <Section title="Local Business Context" className="bg-secondary/40">
        <p className="max-w-3xl text-pretty leading-relaxed text-muted-foreground">{model.localContext}</p>
      </Section>

      <Section title="What We Build">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {model.solutionAreas.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Core Capabilities" className="bg-secondary/40">
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

      {model.useCases.length > 0 ? (
        <Section title="Business Use Cases">
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

      <Section title="Industries" className="bg-secondary/40">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {model.industries.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Development Process">
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

      <Section title="Technology & Integrations" className="bg-secondary/40">
        <div className="flex flex-wrap gap-2">
          {model.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium">{tech}</span>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {model.integrations.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why Work With Pars Medya?">
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
        <Section title={`Districts in ${model.city.name}`} className="bg-secondary/40">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {model.districts.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary">{item.name}</Link>
            ))}
          </div>
        </Section>
      ) : null}

      {model.otherDistricts.length > 0 ? (
        <Section title={`Other Districts in ${model.city.name}`}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {model.otherDistricts.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary">{item.name}</Link>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Frequently Asked Questions" className="bg-secondary/40">
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
            <Link href="/en/contact" className={buttonVariants({ size: 'lg', className: 'h-11 bg-accent px-5 text-accent-foreground hover:bg-accent/90' })}>Tell Us About Your Project</Link>
            <Link href="mailto:info@parsmedya.net" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-11 border-primary-foreground/20 bg-transparent px-5 text-primary-foreground hover:bg-primary-foreground/10' })}>Get in Touch</Link>
          </div>
        </div>
      </section>

      <Section title="Related Services">
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
        <Section title="Nearby Locations" className="border-b-0">
          <div className="flex flex-wrap gap-2">
            {model.relatedLocations.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm transition-colors hover:border-primary/30">{item.name}</Link>
            ))}
          </div>
        </Section>
      ) : null}
    </article>
  )
}
