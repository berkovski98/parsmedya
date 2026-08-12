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

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ParsMedya. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  )
}
