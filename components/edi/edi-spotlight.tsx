import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { EdiFlow } from '@/components/edi/edi-flow'
import { PixelField } from '@/components/pixel-field'
import { EDI_COPY, EDI_PATHS } from '@/lib/edi'
import type { Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'

/** Home page feature block that puts the EDI integration expertise in front. */
export function EdiSpotlight({ locale = 'tr' }: { locale?: Locale }) {
  const t = EDI_COPY[locale].spotlight
  const flow = EDI_COPY[locale].flow
  return (
    <section aria-labelledby="edi-spotlight-heading" className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 bg-right-top text-white [mask-image:radial-gradient(ellipse_80%_80%_at_80%_20%,#000_15%,transparent_75%)]" />
      <PixelField className="-z-10 hidden lg:block [mask-image:radial-gradient(ellipse_60%_80%_at_100%_0%,#000_10%,transparent_70%)]" />
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 md:py-28 xl:grid-cols-[0.85fr_1.15fr] xl:items-center xl:gap-16">
        <div data-reveal>
          <p className="eyebrow eyebrow-on-ink">{t.eyebrow}</p>
          <h2 id="edi-spotlight-heading" className="text-display mt-5 text-balance text-[2.1rem] text-white sm:text-5xl">{t.title}</h2>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/70">{t.text}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {t.points.map((point, index) => (
              <li key={point} data-reveal style={stagger(index + 1)} className="flex items-start gap-2.5 text-[0.9375rem] text-white/85">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"><Check className="h-3 w-3" aria-hidden="true" /></span>{point}
              </li>
            ))}
          </ul>
          <Link href={EDI_PATHS[locale]} className="group mt-10 inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-6 text-[0.9375rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {t.cta}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
        <div data-reveal="scale" className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm sm:p-8">
          <EdiFlow flow={flow} />
        </div>
      </div>
    </section>
  )
}
