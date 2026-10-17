import Link from 'next/link'
import { ArrowRight, Clock3, Globe2, Handshake, LifeBuoy, MessagesSquare, ShieldCheck } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'

const content = {
  tr: {
    eyebrow: 'Neden Pars Medya?',
    title: 'Güvenle çalışabileceğiniz bir ekip',
    text: 'Sadece kod yazmıyor, işinizi anlıyoruz. Hedeflerinize ulaşmanız için teknolojiyi doğru şekilde kullanmanıza yardımcı oluyoruz. Uzun soluklu iş ortaklıkları kuruyoruz.',
    cta: { label: 'Bizi daha yakından tanıyın', href: '/hakkimizda' },
    reasons: [
      { icon: MessagesSquare, title: 'Şeffaf Süreç', description: 'Projenizin her aşamasında düzenli raporlama ve net iletişim sunuyoruz.' },
      { icon: Clock3, title: 'Zamanında Teslim', description: 'Planlanan takvime sadık kalarak projelerinizi vaktinde teslim ediyoruz.' },
      { icon: ShieldCheck, title: 'Güvenlik Öncelikli', description: 'Güncel güvenlik standartları ve KVKK uyumlu altyapılar geliştiriyoruz.' },
      { icon: LifeBuoy, title: 'Uzun Vadeli Destek', description: 'Yayın sonrası bakım, güncelleme ve teknik destekle yanınızdayız.' },
    ],
  },
  en: {
    eyebrow: 'Why Pars Medya?',
    title: 'A technology partner that understands the business behind the brief',
    text: 'We combine commercial understanding, product thinking and engineering discipline to create solutions that remain useful, maintainable and measurable.',
    cta: { label: 'Get to know us', href: '/en/about' },
    reasons: [
      { icon: MessagesSquare, title: 'Transparent Delivery', description: 'Clear decisions, review points and regular communication throughout the project.' },
      { icon: ShieldCheck, title: 'Security by Design', description: 'Access, validation and data protection are considered from the first architecture decisions.' },
      { icon: Globe2, title: 'International Perspective', description: 'Project experience and business relationships across Istanbul, Dubai, Moscow and Switzerland.' },
      { icon: Handshake, title: 'Long-Term Partnership', description: 'Maintenance, measurement and further development continue after launch.' },
    ],
  },
} as const

export function WhyUs({ locale = 'tr' }: { locale?: Locale }) {
  const t = content[locale]
  return (
    <section id={locale === 'tr' ? 'neden-biz' : undefined} className="border-y border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="text-display mt-5 text-balance text-[2.1rem] text-foreground sm:text-5xl">{t.title}</h2>
          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">{t.text}</p>
          <Link href={t.cta.href} className="group mt-8 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-sm font-semibold text-foreground transition-colors hover:text-accent-strong">
            {t.cta.label}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <ol className="divide-y divide-border border-y border-border">
          {t.reasons.map((reason, index) => (
            <li key={reason.title} data-reveal style={stagger(index)} className="group grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 py-8 sm:grid-cols-[4.5rem_auto_1fr] sm:items-start sm:gap-x-6 sm:py-10">
              <span className="hidden font-display text-sm font-bold tabular-nums text-muted-foreground/70 sm:block sm:pt-3" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <span className="flex size-12 items-center justify-center rounded-xl bg-card text-primary shadow-sm ring-1 ring-border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:bg-ink group-hover:text-accent group-hover:ring-ink">
                <reason.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">{reason.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">{reason.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
