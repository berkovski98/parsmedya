import type { Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'

const content = {
  tr: {
    eyebrow: 'Çalışma Sürecimiz',
    title: 'Fikirden yayına dört adım',
    steps: [
      { title: 'Keşif & Analiz', description: 'İhtiyaçlarınızı dinliyor; hedeflerinizi, kullanıcılarınızı, iş süreçlerinizi ve rakiplerinizi analiz ediyoruz.' },
      { title: 'Tasarım & Planlama', description: 'Teknik mimariyi ve yol haritasını planlıyor, kullanıcı deneyimini önceleyen UI/UX tasarımları hazırlıyoruz.' },
      { title: 'Geliştirme', description: 'Ölçeklenebilir, güvenli ve hızlı yazılımı entegrasyonlarıyla birlikte geliştiriyor; test ve güvenlik kontrollerinden geçiriyoruz.' },
      { title: 'Yayın & Destek', description: 'Projeyi kontrollü biçimde canlıya alıyor, ardından bakım, ölçümleme ve sürekli geliştirmeyle destekliyoruz.' },
    ],
  },
  en: {
    eyebrow: 'How We Work',
    title: 'From idea to launch in four steps',
    steps: [
      { title: 'Discovery & Analysis', description: 'We listen to your needs and analyse your goals, users, business processes and competitors.' },
      { title: 'Design & Planning', description: 'We plan the technical architecture and roadmap, then design UI/UX that puts users first.' },
      { title: 'Development', description: 'We build scalable, secure and fast software with its integrations, then put it through testing and security review.' },
      { title: 'Launch & Support', description: 'We launch in a controlled way and continue with maintenance, measurement and continuous improvement.' },
    ],
  },
} as const

export function Process({ locale = 'tr' }: { locale?: Locale }) {
  const t = content[locale]
  return (
    <section id={locale === 'tr' ? 'surec' : undefined} className="relative overflow-hidden bg-ink text-ink-foreground">
      <div aria-hidden="true" className="bg-grid absolute inset-0 text-white opacity-70 [mask-image:linear-gradient(to_bottom,#000,transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
        <div className="max-w-2xl" data-reveal>
          <p className="eyebrow eyebrow-on-ink">{t.eyebrow}</p>
          <h2 className="text-display mt-5 text-balance text-[2.1rem] text-white sm:text-5xl">{t.title}</h2>
        </div>

        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden="true" data-reveal="wipe" className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-accent via-white/20 to-transparent lg:block" />
          {t.steps.map((item, index) => (
            <li key={item.title} data-reveal style={stagger(index + 1)} className="group relative">
              <span className="relative flex size-12 items-center justify-center rounded-full border border-white/15 bg-ink font-display text-sm font-bold tabular-nums text-accent transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-white">{item.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-white/65">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
