import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Gauge, ShieldCheck } from 'lucide-react'
import { WhatsAppIcon, WhatsAppLink } from '@/components/contact-actions'
import { PixelField } from '@/components/pixel-field'
import { CountUp } from '@/components/motion/count-up'
import { PointerParallax } from '@/components/motion/pointer-parallax'
import { CONTACT_LABELS } from '@/lib/contact-info'
import type { Locale } from '@/lib/i18n'
import { depthStyle, stagger } from '@/lib/motion'
import { EDI_COPY } from '@/lib/edi'
import { services } from '@/lib/services'
import { englishServices } from '@/lib/services-en'

const copy = {
  tr: {
    badge: 'Güvenilir dijital çözüm ortağınız',
    lines: [{ text: 'İşinizi büyüten' }, { text: 'web ve yazılım', accent: true }, { text: 'çözümleri' }],
    intro: 'ParsMedya olarak; kurumsal web siteleri, mobil uygulamalar ve e-ticaret sistemleri geliştiriyoruz. Markanızı dijitalde güçlü, hızlı ve güvenilir bir şekilde konumlandırıyoruz.',
    primary: { label: 'Ücretsiz Teklif Al', href: '/iletisim' },
    secondary: { label: 'Hizmetleri İncele', href: '/hizmetler' },
    whatsappLead: 'ya da hemen',
    stats: [['120+', 'Tamamlanan Proje'], ['8 Yıl', 'Sektör Deneyimi'], ['%98', 'Müşteri Memnuniyeti']],
    imageAlt: 'ParsMedya tarafından geliştirilen web ve mobil uygulama arayüzü',
    chips: ['Güvenlik öncelikli, KVKK uyumlu', 'Performans odaklı geliştirme'],
    marquee: 'Uzmanlık alanlarımız',
  },
  en: {
    badge: 'Your trusted digital technology partner',
    lines: [{ text: 'Software and digital experiences that' }, { text: 'move your business forward', accent: true }],
    intro: 'Pars Medya helps organizations grow through custom software, enterprise platforms, high-performing websites and measurable digital strategy—delivered by one accountable team.',
    primary: { label: 'Get a Free Proposal', href: '/en/contact' },
    secondary: { label: 'Explore Services', href: '/en/services' },
    whatsappLead: 'or',
    stats: [['120+', 'Projects Delivered'], ['8 Years', 'Industry Experience'], ['98%', 'Client Satisfaction']],
    imageAlt: 'Digital products and software solutions developed by Pars Medya',
    chips: ['Security by design', 'Performance-focused engineering'],
    marquee: 'Areas of expertise',
  },
} as const

export function Hero({ locale = 'tr' }: { locale?: Locale }) {
  const t = copy[locale]
  const capabilities = [EDI_COPY[locale].label, ...(locale === 'en' ? englishServices : services).slice(0, 13).map((service) => service.title)]

  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 bg-right-top text-white [mask-image:radial-gradient(ellipse_75%_70%_at_70%_30%,#000_20%,transparent_75%)]" />
      <div aria-hidden="true" className="absolute -right-40 top-1/3 -z-10 size-[38rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_65%)] blur-2xl" />
      <PixelField className="-z-10 hidden lg:block [mask-image:radial-gradient(ellipse_75%_70%_at_70%_30%,#000_20%,transparent_75%)]" />

      <PointerParallax className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-12 sm:px-6 md:pb-20 md:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-24 lg:pt-20">
        <div>
          <p className="intro inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] py-1 pl-1.5 pr-3.5 text-xs font-medium text-white/80" style={stagger(0)}>
            <span className="flex size-5 items-center justify-center rounded-full bg-accent/15"><ShieldCheck className="h-3 w-3 text-accent" aria-hidden="true" /></span>
            {t.badge}
          </p>

          <h1 className="text-display mt-7 text-balance text-[2.6rem] text-white sm:text-6xl lg:text-[4.25rem] xl:text-[4.6rem]">
            {t.lines.map((line, index) => (
              <span key={line.text} className="hero-line">
                <span style={stagger(index)} className={'accent' in line && line.accent ? 'text-accent' : undefined}>{line.text}</span>
              </span>
            ))}
          </h1>

          <p className="intro mt-7 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg" style={stagger(2)}>{t.intro}</p>

          <div className="intro mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={stagger(3)}>
            <Link href={t.primary.href} className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 text-[0.9375rem] font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-14px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
              {t.primary.label}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link href={t.secondary.href} className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 px-6 text-[0.9375rem] font-semibold text-white transition-all duration-300 hover:border-white/35 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              {t.secondary.label}
            </Link>
          </div>
          <p className="intro mt-5 flex items-center gap-2 text-sm text-white/55" style={stagger(4)}>
            {t.whatsappLead}
            <WhatsAppLink locale={locale} className="group inline-flex items-center gap-1.5 font-semibold text-white underline-offset-4 hover:underline">
              <WhatsAppIcon className="size-4 text-[#25D366] transition-transform duration-300 group-hover:-rotate-12" />{CONTACT_LABELS[locale].whatsapp}
            </WhatsAppLink>
          </p>

          <dl className="intro mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8" style={stagger(5)}>
            {t.stats.map(([value, label]) => (
              <div key={label} className="flex flex-col">
                <dt className="order-2 mt-1 text-xs text-white/55 sm:text-sm">{label}</dt>
                <dd className="order-1 font-display text-2xl font-extrabold tracking-tight text-white sm:text-[2rem]"><CountUp value={value} /></dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="parallax relative mx-auto w-full max-w-xl lg:max-w-none" style={{ '--parallax-from': '24px', '--parallax-to': '-48px' } as React.CSSProperties}>
          <div className="intro-fade relative" style={stagger(1)}>
            <div aria-hidden="true" className="absolute -inset-3 rounded-[1.75rem] border border-white/10 sm:-inset-5" style={depthStyle(6)} />
            <div aria-hidden="true" className="absolute -bottom-6 -left-6 hidden size-24 rounded-2xl border border-accent/40 sm:block" style={depthStyle(-14)} />
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-30px_rgb(0_0_0/0.65)] ring-1 ring-white/10" style={depthStyle(10)}>
              <Image
                src="/parsmedya-hero.png"
                alt={t.imageAlt}
                width={720}
                height={576}
                sizes="(min-width: 1280px) 600px, (min-width: 1024px) 46vw, calc(100vw - 2rem)"
                quality={82}
                className="h-auto w-full"
                priority
              />
            </div>
            <div className="float-soft absolute -left-4 top-8 sm:-left-10" style={stagger(0)}>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-ink/85 px-3.5 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur-md sm:text-sm" style={depthStyle(22)}>
                <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />{t.chips[0]}
              </div>
            </div>
            <div className="float-soft absolute -right-3 bottom-10 sm:-right-8" style={stagger(1)}>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-ink/85 px-3.5 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur-md sm:text-sm" style={depthStyle(-18)}>
                <Gauge className="h-4 w-4 text-accent" aria-hidden="true" />{t.chips[1]}
              </div>
            </div>
          </div>
        </div>
      </PointerParallax>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-5 sm:px-6">
          <p className="hidden shrink-0 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/45 md:block">{t.marquee}</p>
          <div className="marquee min-w-0 flex-1 overflow-hidden">
            <ul className="marquee-track gap-10">
              {[...capabilities, ...capabilities].map((title, index) => (
                <li key={`${title}-${index}`} aria-hidden={index >= capabilities.length || undefined} className="flex shrink-0 items-center gap-10 whitespace-nowrap text-sm font-medium text-white/70">
                  {title}<span className="size-1.5 rounded-[2px] bg-accent/70" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
