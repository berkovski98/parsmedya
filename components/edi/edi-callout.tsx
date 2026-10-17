import Link from 'next/link'
import { ArrowRight, ArrowLeftRight } from 'lucide-react'
import { EDI_COPY, EDI_PATHS } from '@/lib/edi'
import type { Locale } from '@/lib/i18n'

/** Cross-link from related service pages (e.g. API integrations) to the EDI page. */
export function EdiCallout({ locale }: { locale: Locale }) {
  const t = EDI_COPY[locale].callout
  return (
    <section className="bg-background px-4 sm:px-6">
      <div data-reveal className="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl bg-ink p-7 text-ink-foreground sm:p-9 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-5">
          <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-ink sm:flex"><ArrowLeftRight className="h-5 w-5" aria-hidden="true" /></span>
          <div>
            <h2 className="font-display text-xl font-bold text-white sm:text-2xl">{t.title}</h2>
            <p className="mt-2 max-w-2xl leading-relaxed text-white/70">{t.text}</p>
          </div>
        </div>
        <Link href={EDI_PATHS[locale]} className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-5 font-semibold text-ink transition-transform hover:-translate-y-0.5">
          {t.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
