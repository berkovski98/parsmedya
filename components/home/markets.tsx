import { Globe2 } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getRegionLinks } from '@/lib/navigation'
import { services } from '@/lib/services'

/** Display order for the stack; only names that the service catalogue itself lists are shown. */
const stackOrder = ['Next.js', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'React Native', 'Expo', 'PostgreSQL', 'Firebase', 'Docker', 'AWS', 'Vercel', 'Stripe', 'Shopify', 'Figma', 'Google Analytics', 'Search Console']

const content = {
  tr: {
    eyebrow: 'Sektörler ve Pazarlar',
    title: 'Pars Medya Yazılım Çözümleri Kimler İçin Uygun?',
    text: 'Yaklaşımımız KOBİ’ler, kurumsal şirketler, girişimler, e-ticaret işletmeleri ile üretim, lojistik, hizmet, dış ticaret, saha operasyonları ve profesyonel hizmet ekiplerinin farklı ihtiyaçlarına uyarlanabilir. Uygunluğu doğrulanmamış sektör referanslarıyla değil, gerçek süreç ve hedef analiziyle değerlendiririz.',
    industries: ['KOBİ', 'Kurumsal Şirketler', 'E-Ticaret', 'Üretim', 'Lojistik', 'Hizmet', 'Dış Ticaret', 'Saha Operasyonları', 'Girişimler'],
    stackTitle: 'Kullandığımız Teknolojiler',
    stackText: 'Teknoloji seçimini projenin ölçeğine, ekibinize ve bakım ihtiyacına göre yapıyoruz.',
    globalTitle: 'Türkiye’den Global Dijital Projelere',
    globalText: 'İstanbul merkezli bakış açımızı Dubai, Moskova ve İsviçre bağlantılı iş ağları ve proje deneyimleriyle zenginleştiriyoruz. Fiziksel ofis iddiası oluşturmadan, farklı pazarların diline ve operasyon ihtiyacına uyarlanabilen çok dilli ve ölçeklenebilir yazılımlar geliştiriyoruz.',
    languages: 'Türkçe ve İngilizce iletişim',
    locations: ['İstanbul', 'Dubai', 'Moskova', 'İsviçre'],
  },
  en: {
    eyebrow: 'Industries & Markets',
    title: 'Who Are Pars Medya Software Solutions For?',
    text: 'Our approach can support SMEs, enterprise organizations, startups, e-commerce businesses and teams in manufacturing, logistics, services, foreign trade, field operations and professional services. Suitability depends on the workflow and objective—not an unverified claim of sector experience.',
    industries: ['SMEs', 'Enterprise', 'E-Commerce', 'Manufacturing', 'Logistics', 'Services', 'Foreign Trade', 'Field Operations', 'Startups'],
    stackTitle: 'Technologies We Work With',
    stackText: 'We choose the stack according to the project’s scale, your team and long-term maintenance needs.',
    globalTitle: 'From Türkiye to Global Digital Projects',
    globalText: 'Our Istanbul-based perspective is enriched by business connections and project experience linked to Dubai, Moscow and Switzerland. We design multilingual, scalable products that can adapt to different markets without making unverified physical-office claims.',
    languages: 'Communication in English and Turkish',
    locations: ['Istanbul', 'Dubai', 'Moscow', 'Switzerland'],
  },
} as const

export function HomeMarkets({ locale = 'tr' }: { locale?: Locale }) {
  const t = content[locale]
  const listed = new Set(services.flatMap((service) => service.technologies ?? []))
  const stack = stackOrder.filter((name) => listed.has(name))

  return (
    <section aria-labelledby="markets-heading" className="border-y border-border bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <div data-reveal>
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 id="markets-heading" className="text-display mt-5 text-balance text-[2.1rem] text-foreground sm:text-5xl">{t.title}</h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{t.text}</p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {t.industries.map((industry, index) => (
              <li key={industry} data-reveal="fade" style={stagger(index)} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">{industry}</li>
            ))}
          </ul>

          <div className="mt-14 border-t border-border pt-10" data-reveal>
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">{t.stackTitle}</h3>
            <p className="mt-2 max-w-xl text-pretty leading-relaxed text-muted-foreground">{t.stackText}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {stack.map((name) => (
                <li key={name} className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[0.8125rem] text-foreground/80">{name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal="scale" className="relative isolate self-start overflow-hidden rounded-3xl bg-ink p-7 text-ink-foreground sm:p-10 lg:sticky lg:top-32">
          <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 text-white opacity-60 [mask-image:radial-gradient(ellipse_80%_80%_at_100%_0%,#000,transparent_70%)]" />
          <Globe2 className="h-8 w-8 text-accent" aria-hidden="true" />
          <h3 className="mt-5 text-balance font-display text-2xl font-bold text-white sm:text-3xl">{t.globalTitle}</h3>
          <p className="mt-5 text-pretty leading-7 text-white/70">{t.globalText}</p>
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
            {t.locations.map((location) => <li key={location} className="bg-ink px-4 py-4 text-center font-display text-base font-semibold text-white sm:text-lg">{location}</li>)}
          </ul>
          <p className="mt-6 text-sm font-medium text-white/60">{t.languages}</p>
          <nav aria-label={locale === 'en' ? 'Service areas in Türkiye' : 'Türkiye hizmet bölgeleri'} className="mt-8 border-t border-white/10 pt-6">
            <p className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/45">{locale === 'en' ? 'Service areas in Türkiye' : 'Türkiye’deki hizmet bölgelerimiz'}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {getRegionLinks(locale).map((region) => (
                <li key={region.href}><Link href={region.href} className="group inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-accent hover:text-white">{region.label}<ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
