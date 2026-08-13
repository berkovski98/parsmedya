import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-display text-sm font-bold">
            P
          </span>
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            Pars<span className="text-accent">Medya</span>
          </span>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <nav aria-label="Alt menü" className="flex items-center gap-5 text-sm">
            <Link
              href="/hizmetler"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Hizmetler
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Blog
            </Link>
            <Link
              href="/iletisim"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              İletişim
            </Link>
          </nav>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} ParsMedya. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
