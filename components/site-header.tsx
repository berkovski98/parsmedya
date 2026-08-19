'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { alternatePath, localeHomePath, type Locale } from '@/lib/i18n'
import { getRegionLinks, getCorporateLinks, getServiceGroups } from '@/lib/navigation'

function subscribeLanguageSwitch() {
  return () => {}
}

function languageSwitchHref(pathname: string, target: 'tr' | 'en') {
  const fallback = alternatePath(pathname)
  const link = document.querySelector(`link[rel="alternate"][hreflang="${target}"]`)
  const href = link?.getAttribute('href')
  if (!href) return fallback
  try {
    return new URL(href, document.baseURI).pathname || fallback
  } catch {
    return fallback
  }
}

export function SiteHeader({ locale = 'tr' }: { locale?: Locale }) {
  const [openPath, setOpenPath] = useState<string | null>(null)
  const [mobileSection, setMobileSection] = useState<'corporate' | 'services' | 'regions' | null>(null)
  const [dismissedDropdown, setDismissedDropdown] = useState<'corporate' | 'services' | 'regions' | null>(null)
  const pathname = usePathname()
  const open = openPath === pathname
  const english = locale === 'en'
  const corporateLinks = getCorporateLinks(locale)
  const serviceGroups = getServiceGroups(locale)
  const regionLinks = english ? [] : getRegionLinks()
  const homeHref = localeHomePath(locale)
  const servicesHref = english ? '/en/services' : '/hizmetler'
  const regionsHref = '/hizmet-bolgeleri'
  const contactHref = english ? '/en/contact' : '/iletisim'
  const simpleLinks = english
    ? [{ label: 'Home', href: '/en' }, { label: 'Blog', href: '/en/blog' }, { label: 'Contact', href: '/en/contact' }]
    : [{ label: 'Ana Sayfa', href: '/' }, { label: 'Blog', href: '/blog' }, { label: 'İletişim', href: '/iletisim' }]
  const isActive = (href: string) => href === '/' || href === '/en' ? pathname === href : pathname.startsWith(href)
  const closeMobile = () => { setOpenPath(null); setMobileSection(null) }
  const closeDesktop = (dropdown: 'corporate' | 'services' | 'regions', element: HTMLElement) => {
    setDismissedDropdown(dropdown)
    element.blur()
  }
  const switchTarget = english ? 'tr' : 'en'
  const switchHref = useSyncExternalStore(
    subscribeLanguageSwitch,
    () => languageSwitchHref(pathname, switchTarget),
    () => alternatePath(pathname),
  )

  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
      <Link href={homeHref} className="flex shrink-0 items-center rounded-lg bg-primary px-3.5 py-2" aria-label={english ? 'ParsMedya home' : 'ParsMedya ana sayfa'}><Image src="/parsmedya-logo.png" alt="ParsMedya" width={196} height={40} sizes="196px" className="h-7 w-auto" /></Link>
      <nav className="relative hidden items-center gap-5 md:flex lg:gap-7" aria-label={english ? 'Main menu' : 'Ana menü'}>
        <Link href={simpleLinks[0].href} className={cn('text-sm font-medium transition-colors hover:text-foreground', isActive(simpleLinks[0].href) ? 'text-foreground' : 'text-muted-foreground')}>{simpleLinks[0].label}</Link>
        <div className="group relative"><button onMouseEnter={() => setDismissedDropdown(null)} onFocus={() => setDismissedDropdown(null)} className={cn('flex items-center gap-1 py-5 text-sm font-medium transition-colors hover:text-foreground', corporateLinks.some((item) => isActive(item.href)) ? 'text-foreground' : 'text-muted-foreground')} aria-haspopup="true">{english ? 'Corporate' : 'Kurumsal'}<ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" /></button><div className={cn('invisible absolute left-0 top-full w-56 translate-y-1 rounded-xl border border-border bg-background p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100', dismissedDropdown === 'corporate' && '!invisible !opacity-0 pointer-events-none')}>{corporateLinks.map((item) => <Link key={item.href} href={item.href} onClick={(event) => closeDesktop('corporate', event.currentTarget)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</Link>)}</div></div>
        <div className="group static"><button onMouseEnter={() => setDismissedDropdown(null)} onFocus={() => setDismissedDropdown(null)} className={cn('flex items-center gap-1 py-5 text-sm font-medium transition-colors hover:text-foreground', isActive(servicesHref) ? 'text-foreground' : 'text-muted-foreground')} aria-haspopup="true">{english ? 'Services' : 'Hizmetlerimiz'}<ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" /></button><div className={cn('invisible fixed left-4 right-4 top-16 w-auto translate-y-1 rounded-xl border border-border bg-background p-5 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 lg:left-1/2 lg:right-auto lg:w-[900px] lg:-translate-x-1/2', dismissedDropdown === 'services' && '!invisible !opacity-0 pointer-events-none')}><div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">{serviceGroups.map((group) => <section key={group.label}><h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">{group.label}</h2><div className="space-y-0.5">{group.links.map((item) => <Link key={item.href} href={item.href} onClick={(event) => closeDesktop('services', event.currentTarget)} className="block rounded-md px-2 py-1.5 text-xs leading-snug text-muted-foreground hover:bg-muted hover:text-foreground">{item.label}</Link>)}</div></section>)}</div><Link href={servicesHref} onClick={(event) => closeDesktop('services', event.currentTarget)} className="mt-5 block border-t border-border pt-4 text-sm font-semibold text-accent hover:text-accent/80">{english ? 'View All Services' : 'Tüm Hizmetlerimizi İnceleyin'} →</Link></div></div>
        {!english && (
          <div className="group relative">
            <button
              onMouseEnter={() => setDismissedDropdown(null)}
              onFocus={() => setDismissedDropdown(null)}
              className={cn(
                'flex items-center gap-1 py-5 text-sm font-medium transition-colors hover:text-foreground',
                pathname === regionsHref || pathname.startsWith(`${regionsHref}/`) ? 'text-foreground' : 'text-muted-foreground',
              )}
              aria-haspopup="true"
            >
              Bölgelerimiz
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
            </button>
            <div className={cn(
              'invisible absolute left-0 top-full w-72 translate-y-1 rounded-xl border border-border bg-background p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
              dismissedDropdown === 'regions' && '!invisible !opacity-0 pointer-events-none',
            )}
            >
              {regionLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(event) => closeDesktop('regions', event.currentTarget)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-muted-foreground/80">{item.cityCount} il</span>
                </Link>
              ))}
              <Link
                href={regionsHref}
                onClick={(event) => closeDesktop('regions', event.currentTarget)}
                className="mt-1 block rounded-lg border-t border-border px-3 py-2.5 text-sm font-semibold text-accent hover:text-accent/80"
              >
                Tüm bölgeler →
              </Link>
            </div>
          </div>
        )}
        {simpleLinks.slice(1).map((item) => <Link key={item.href} href={item.href} className={cn('text-sm font-medium transition-colors hover:text-foreground', isActive(item.href) ? 'text-foreground' : 'text-muted-foreground')}>{item.label}</Link>)}
      </nav>
      <div className="hidden items-center gap-3 md:flex"><Link href={switchHref} className="text-xs font-semibold text-muted-foreground hover:text-foreground" aria-label={english ? 'Türkçe sürüm' : 'English version'}>{english ? 'TR' : 'EN'}</Link><Link href={contactHref} className={buttonVariants({ size: 'lg' })}>{english ? 'Get a Quote' : 'Teklif Al'}</Link></div>
      <button type="button" onClick={() => { setOpenPath(open ? null : pathname); if (open) setMobileSection(null) }} className="inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden" aria-label={open ? (english ? 'Close menu' : 'Menüyü kapat') : (english ? 'Open menu' : 'Menüyü aç')} aria-expanded={open}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
    </div>
    {open && <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background md:hidden"><nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4" aria-label={english ? 'Mobile menu' : 'Mobil menü'}>
      <Link href={simpleLinks[0].href} onClick={closeMobile} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted">{simpleLinks[0].label}</Link>
      <button onClick={() => setMobileSection((value) => value === 'corporate' ? null : 'corporate')} className="flex min-h-11 items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-muted" aria-expanded={mobileSection === 'corporate'}>{english ? 'Corporate' : 'Kurumsal'}<ChevronDown className={cn('h-4 w-4 transition-transform', mobileSection === 'corporate' && 'rotate-180')} /></button>
      {mobileSection === 'corporate' && <div className="ml-3 border-l border-border pl-2">{corporateLinks.map((item) => <Link key={item.href} href={item.href} onClick={closeMobile} className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted">{item.label}</Link>)}</div>}
      <button onClick={() => setMobileSection((value) => value === 'services' ? null : 'services')} className="flex min-h-11 items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-muted" aria-expanded={mobileSection === 'services'}>{english ? 'Services' : 'Hizmetlerimiz'}<ChevronDown className={cn('h-4 w-4 transition-transform', mobileSection === 'services' && 'rotate-180')} /></button>
      {mobileSection === 'services' && <div className="ml-3 space-y-4 border-l border-border py-2 pl-3">{serviceGroups.map((group) => <section key={group.label}><h2 className="px-2 text-xs font-bold uppercase tracking-wider text-accent">{group.label}</h2><div className="mt-1">{group.links.map((item) => <Link key={item.href} href={item.href} onClick={closeMobile} className="block rounded-md px-2 py-2.5 text-sm text-muted-foreground hover:bg-muted">{item.label}</Link>)}</div></section>)}<Link href={servicesHref} onClick={closeMobile} className="block px-2 py-2 text-sm font-semibold text-accent">{english ? 'View All Services' : 'Tüm Hizmetlerimizi İnceleyin'} →</Link></div>}
      {!english && (
        <>
          <button onClick={() => setMobileSection((value) => value === 'regions' ? null : 'regions')} className="flex min-h-11 items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium hover:bg-muted" aria-expanded={mobileSection === 'regions'}>Bölgelerimiz<ChevronDown className={cn('h-4 w-4 transition-transform', mobileSection === 'regions' && 'rotate-180')} /></button>
          {mobileSection === 'regions' && (
            <div className="ml-3 border-l border-border pl-2">
              {regionLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMobile} className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted">
                  <span>{item.label}</span>
                  <span className="text-xs">{item.cityCount} il</span>
                </Link>
              ))}
              <Link href={regionsHref} onClick={closeMobile} className="block rounded-md px-3 py-2.5 text-sm font-semibold text-accent">Tüm bölgeler →</Link>
            </div>
          )}
        </>
      )}
      {simpleLinks.slice(1).map((item) => <Link key={item.href} href={item.href} onClick={closeMobile} className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted">{item.label}</Link>)}
      <Link href={contactHref} onClick={closeMobile} className={buttonVariants({ size: 'lg', className: 'mt-2' })}>{english ? 'Get a Quote' : 'Teklif Al'}</Link><Link href={switchHref} onClick={closeMobile} className="mt-2 rounded-md border border-border px-3 py-2.5 text-center text-sm font-semibold">{english ? 'TR — Türkçe' : 'EN — English'}</Link>
    </nav></div>}
  </header>
}
