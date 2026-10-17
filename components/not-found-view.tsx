import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

const COPY = {
  tr: {
    code: '404',
    title: 'Sayfa bulunamadı',
    text: 'Aradığınız sayfa taşınmış, adı değişmiş ya da hiç var olmamış olabilir. Aşağıdaki bağlantılardan devam edebilirsiniz.',
    links: [
      { href: '/', label: 'Ana Sayfa' },
      { href: '/hizmetler', label: 'Hizmetler' },
      { href: '/hizmet-bolgeleri', label: 'Hizmet Bölgeleri' },
      { href: '/blog', label: 'Blog' },
      { href: '/iletisim', label: 'İletişim' },
    ],
    other: { href: '/en', label: 'English', lang: 'en' },
  },
  en: {
    code: '404',
    title: 'Page not found',
    text: 'The page you are looking for may have moved, been renamed or never existed. You can continue from one of the links below.',
    links: [
      { href: '/en', label: 'Home' },
      { href: '/en/services', label: 'Services' },
      { href: '/en/service-areas', label: 'Service Areas' },
      { href: '/en/blog', label: 'Blog' },
      { href: '/en/contact', label: 'Contact' },
    ],
    other: { href: '/', label: 'Türkçe', lang: 'tr' },
  },
} as const

export function NotFoundView({ locale }: { locale: Locale }) {
  const text = COPY[locale]
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 md:py-32">
        <p className="eyebrow justify-center">{text.code}</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{text.title}</h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">{text.text}</p>
        <nav aria-label={text.title} className="mt-10 flex flex-wrap justify-center gap-3">
          {text.links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/30">
              {link.label}
            </Link>
          ))}
          <Link href={text.other.href} hrefLang={text.other.lang} lang={text.other.lang} className="rounded-full px-4 py-2 text-sm font-medium text-accent-strong hover:underline">
            {text.other.label}
          </Link>
        </nav>
      </div>
    </section>
  )
}
