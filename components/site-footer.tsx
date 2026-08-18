import Link from 'next/link'
import Image from 'next/image'

import { localeHomePath, type Locale } from '@/lib/i18n'

export function SiteFooter({ locale = 'tr' }: { locale?: Locale }) {
  const english = locale === 'en'
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <Link
          href={localeHomePath(locale)}
          className="flex max-w-full items-center rounded-lg bg-primary px-3.5 py-2"
          aria-label={english ? 'ParsMedya home' : 'ParsMedya ana sayfa'}
        >
          <Image
            src="/parsmedya-logo.png"
            alt="ParsMedya"
            width={196}
            height={40}
            sizes="196px"
            className="h-7 max-w-full w-auto"
          />
        </Link>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <nav aria-label="Alt menü" className="flex items-center gap-5 text-sm">
            <Link
              href={english ? '/en/services' : '/tr/hizmetler'}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {english ? 'Services' : 'Hizmetler'}
            </Link>
            {!english ? (
              <Link
                href="/tr/hizmet-bolgeleri"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Hizmet Bölgeleri
              </Link>
            ) : null}
            <Link
              href={english ? '/en/blog' : '/tr/blog'}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              href={english ? '/en/contact' : '/tr/iletisim'}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {english ? 'Contact' : 'İletişim'}
            </Link>
          </nav>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ParsMedya. {english ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
