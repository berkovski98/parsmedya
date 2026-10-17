import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ContactActionsOnInk } from '@/components/contact-actions'
import type { Locale } from '@/lib/i18n'

const content = {
  tr: { title: 'Projenizi konuşalım', text: 'Kapsamı netleştirmek ve teknik yaklaşımı birlikte değerlendirmek için kısa bir görüşme planlayabilirsiniz.', cta: 'İletişime Geçin', href: '/iletisim' },
  en: { title: 'Let’s talk about your project', text: 'Book a short conversation to clarify the scope and evaluate the technical approach together.', cta: 'Contact Us', href: '/en/contact' },
} as const

export function BlogArticleCta({ locale }: { locale: Locale }) {
  const t = content[locale]
  return (
    <div data-reveal className="relative mx-auto mt-14 max-w-3xl overflow-hidden rounded-2xl bg-ink p-7 text-ink-foreground sm:p-10">
      <div aria-hidden="true" className="bg-grid absolute inset-0 bg-right-top text-white [mask-image:radial-gradient(ellipse_60%_100%_at_100%_0%,#000,transparent_70%)]" />
      <div className="relative">
        <p className="font-display text-2xl font-bold tracking-tight text-white">{t.title}</p>
        <p className="mt-3 max-w-xl leading-relaxed text-white/70">{t.text}</p>
        <div className="mt-7 flex flex-col gap-3 xl:flex-row">
          <Link href={t.href} className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-5 text-[0.9375rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5">
            {t.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <ContactActionsOnInk locale={locale} />
        </div>
      </div>
    </div>
  )
}

export function ReadingProgress() {
  return <div aria-hidden="true" className="reading-progress pointer-events-none fixed inset-x-0 top-16 z-40 h-0.5 bg-accent lg:top-[4.5rem]" />
}
