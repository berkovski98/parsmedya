'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, Menu, Phone, X } from 'lucide-react'
import { PhoneLink, WhatsAppIcon, WhatsAppLink } from '@/components/contact-actions'
import { cn } from '@/lib/utils'
import { alternatePath, localeHomePath, type Locale } from '@/lib/i18n'
import { CONTACT_LABELS, phoneDisplay } from '@/lib/contact-info'
import { stagger } from '@/lib/motion'
import { getRegionLinks, getCorporateLinks, getServiceGroups } from '@/lib/navigation'
import { EDI_COPY, EDI_PATHS } from '@/lib/edi'

type Dropdown = 'corporate' | 'services' | 'regions'

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

const topLink = 'relative inline-flex items-center gap-1 whitespace-nowrap py-2 text-[0.875rem] font-medium transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
const topLinkState = (active: boolean) => active ? 'text-white after:scale-x-100' : 'text-white/70 after:scale-x-0 hover:text-white hover:after:scale-x-100'
const panel = 'invisible absolute top-full origin-top translate-y-2 scale-[0.98] rounded-2xl border border-border/80 bg-popover p-2 text-popover-foreground opacity-0 shadow-[0_30px_70px_-25px_rgb(10_20_50/0.45)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:visible group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100'
const panelItem = 'block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:bg-secondary focus-visible:text-foreground focus-visible:outline-none'

export function SiteHeader({ locale = 'tr' }: { locale?: Locale }) {
  const [openPath, setOpenPath] = useState<string | null>(null)
  const [mobileSection, setMobileSection] = useState<Dropdown | null>(null)
  const [dismissedDropdown, setDismissedDropdown] = useState<Dropdown | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const open = openPath === pathname
  const english = locale === 'en'
  const text = CONTACT_LABELS[locale]
  const corporateLinks = getCorporateLinks(locale)
  const serviceGroups = getServiceGroups(locale)
  const regionLinks = getRegionLinks(locale)
  const homeHref = localeHomePath(locale)
  const servicesHref = english ? '/en/services' : '/hizmetler'
  const regionsHref = english ? '/en/service-areas' : '/hizmet-bolgeleri'
  const contactHref = english ? '/en/contact' : '/iletisim'
  const simpleLinks = english
    ? [{ label: 'Home', href: '/en' }, { label: 'Blog', href: '/en/blog' }, { label: 'Contact', href: '/en/contact' }]
    : [{ label: 'Ana Sayfa', href: '/' }, { label: 'Blog', href: '/blog' }, { label: 'İletişim', href: '/iletisim' }]
  const isActive = (href: string) => href === '/' || href === '/en' ? pathname === href : pathname.startsWith(href)
  const regionsActive = pathname === regionsHref || pathname.startsWith(`${regionsHref}/`)
  const closeMobile = () => { setOpenPath(null); setMobileSection(null) }
  const closeDesktop = (dropdown: Dropdown, element: HTMLElement) => {
    setDismissedDropdown(dropdown)
    element.blur()
  }
  const switchTarget = english ? 'tr' : 'en'
  const switchHref = useSyncExternalStore(
    subscribeLanguageSwitch,
    () => languageSwitchHref(pathname, switchTarget),
    () => alternatePath(pathname),
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') closeMobile() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const dropdownTrigger = (dropdown: Dropdown, label: string, active: boolean) => (
    <button
      type="button"
      onMouseEnter={() => setDismissedDropdown(null)}
      onFocus={() => setDismissedDropdown(null)}
      className={cn(topLink, topLinkState(active))}
      aria-haspopup="true"
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />
    </button>
  )
  const dismissed = (dropdown: Dropdown) => dismissedDropdown === dropdown && '!invisible !opacity-0 pointer-events-none'

  const mobileToggle = (section: Dropdown, label: string) => (
    <button
      type="button"
      onClick={() => setMobileSection((value) => value === section ? null : section)}
      className="flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left font-display text-lg font-semibold text-white transition-colors hover:bg-white/5"
      aria-expanded={mobileSection === section}
    >
      {label}
      <ChevronDown className={cn('h-5 w-5 text-white/60 transition-transform duration-300', mobileSection === section && 'rotate-180 text-accent')} aria-hidden="true" />
    </button>
  )

  return <header
    className={cn(
      'sticky top-0 z-50 border-b text-ink-foreground transition-[background-color,box-shadow,border-color] duration-500',
      // backdrop-filter would turn the header into the containing block of the fixed mobile menu.
      open
        ? 'border-white/10 bg-ink'
        : scrolled
          ? 'border-white/10 bg-ink/90 shadow-[0_12px_40px_-20px_rgb(5_10_30/0.7)] backdrop-blur-xl supports-[backdrop-filter]:bg-ink/80'
          : 'border-transparent bg-ink',
    )}
  >
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem]">
      <Link
        href={homeHref}
        className="group/logo flex shrink-0 items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
        aria-label={english ? 'Pars Medya home' : 'Pars Medya ana sayfa'}
      >
        <Image src="/parsmedya-logo.png" alt="Pars Medya" width={196} height={40} sizes="196px" className="h-7 w-auto transition-opacity duration-300 group-hover/logo:opacity-90 lg:h-8" loading="eager" fetchPriority="high" />
      </Link>

      <nav className="relative hidden items-center gap-5 lg:flex xl:gap-7" aria-label={english ? 'Main menu' : 'Ana menü'}>
        <Link href={simpleLinks[0].href} className={cn(topLink, topLinkState(isActive(simpleLinks[0].href)))}>{simpleLinks[0].label}</Link>

        <div className="group relative py-4">
          {dropdownTrigger('corporate', english ? 'Corporate' : 'Kurumsal', corporateLinks.some((item) => isActive(item.href)))}
          <div className={cn(panel, '-left-3 w-60', dismissed('corporate'))}>
            {corporateLinks.map((item) => <Link key={item.href} href={item.href} onClick={(event) => closeDesktop('corporate', event.currentTarget)} className={panelItem}>{item.label}</Link>)}
          </div>
        </div>

        <div className="group static py-4">
          {dropdownTrigger('services', english ? 'Services' : 'Hizmetlerimiz', isActive(servicesHref))}
          <div className={cn(panel, 'fixed left-4 right-4 top-16 w-auto p-6 lg:left-1/2 lg:right-auto lg:top-[4.5rem] lg:w-[940px] lg:-translate-x-1/2 lg:group-hover:-translate-x-1/2 lg:group-focus-within:-translate-x-1/2', dismissed('services'))}>
            <Link href={EDI_PATHS[locale]} onClick={(event) => closeDesktop('services', event.currentTarget)} className="group/edi mb-6 flex items-center justify-between gap-4 rounded-xl bg-ink px-5 py-4 text-ink-foreground transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <span className="flex items-center gap-3">
                <span className="rounded-md bg-accent px-2 py-1 font-mono text-[0.6875rem] font-bold tracking-wider text-ink">EDI</span>
                <span>
                  <span className="block text-sm font-semibold text-white">{EDI_COPY[locale].label}</span>
                  <span className="block text-xs text-white/60">{EDI_COPY[locale].spotlight.points.slice(0, 3).join(' · ')}</span>
                </span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-accent">{EDI_COPY[locale].badge}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/edi:translate-x-1" aria-hidden="true" /></span>
            </Link>
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {serviceGroups.map((group) => <div key={group.label}>
                <p className="mb-2 px-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent-strong">{group.label}</p>
                <div className="space-y-0.5">{group.links.map((item) => <Link key={item.href} href={item.href} onClick={(event) => closeDesktop('services', event.currentTarget)} className="group/item flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[0.8125rem] leading-snug text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:bg-secondary focus-visible:outline-none">{item.label}<ArrowRight className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" aria-hidden="true" /></Link>)}</div>
              </div>)}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <Link href={servicesHref} onClick={(event) => closeDesktop('services', event.currentTarget)} className="group/all inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong hover:text-foreground">{english ? 'View All Services' : 'Tüm Hizmetlerimizi İnceleyin'}<ArrowRight className="h-4 w-4 transition-transform group-hover/all:translate-x-1" aria-hidden="true" /></Link>
              <WhatsAppLink locale={locale} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"><WhatsAppIcon className="size-4 text-[#1faa53]" />{text.whatsapp}</WhatsAppLink>
            </div>
          </div>
        </div>

        <div className="group relative py-4">
          {dropdownTrigger('regions', english ? 'Service Areas' : 'Bölgelerimiz', regionsActive)}
          <div className={cn(panel, '-left-3 w-72', dismissed('regions'))}>
            {regionLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={(event) => closeDesktop('regions', event.currentTarget)} className={cn(panelItem, 'flex items-center justify-between')}>
                <span>{item.label}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">{item.cityCount} {english ? 'provinces' : 'il'}</span>
              </Link>
            ))}
            <Link href={regionsHref} onClick={(event) => closeDesktop('regions', event.currentTarget)} className="mt-1 block rounded-lg border-t border-border px-3 py-2.5 text-sm font-semibold text-accent-strong hover:text-foreground">{english ? 'All regions →' : 'Tüm bölgeler →'}</Link>
          </div>
        </div>

        {simpleLinks.slice(1).map((item) => <Link key={item.href} href={item.href} className={cn(topLink, topLinkState(isActive(item.href)))}>{item.label}</Link>)}
      </nav>

      <div className="hidden items-center gap-2 lg:flex xl:gap-3">
        <Link href={switchHref} className="inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-white/15 px-2.5 text-xs font-bold tracking-wider text-white/80 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" aria-label={english ? 'Türkçe sürüm' : 'English version'} hrefLang={switchTarget} lang={switchTarget}>{english ? 'TR' : 'EN'}</Link>
        <PhoneLink locale={locale} className="group inline-flex h-9 items-center gap-2 rounded-full px-2 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent xl:px-3">
          <span className="flex size-7 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-accent group-hover:text-ink"><Phone className="h-3.5 w-3.5" aria-hidden="true" /></span>
          <span className="hidden tabular-nums xl:inline">{phoneDisplay(locale)}</span>
        </PhoneLink>
        <Link href={contactHref} className="group inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg bg-accent px-4 text-sm font-semibold text-ink transition-all duration-300 hover:-translate-y-px hover:bg-[color-mix(in_oklab,var(--accent)_88%,white)] hover:shadow-[0_10px_30px_-12px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          {text.quote}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="flex items-center gap-1 lg:hidden">
        <PhoneLink locale={locale} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10">
          <Phone className="h-5 w-5" aria-hidden="true" />
        </PhoneLink>
        <button
          type="button"
          onClick={() => { setOpenPath(open ? null : pathname); if (open) setMobileSection(null) }}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          aria-label={open ? (english ? 'Close menu' : 'Menüyü kapat') : (english ? 'Open menu' : 'Menüyü aç')}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
    </div>

    {open && <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col overflow-y-auto overscroll-contain bg-ink text-ink-foreground lg:hidden">
      <nav className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-1 px-4 pb-6 pt-4" aria-label={english ? 'Mobile menu' : 'Mobil menü'}>
        <div className="pop-in" style={stagger(0)}><Link href={simpleLinks[0].href} onClick={closeMobile} className="flex min-h-12 items-center rounded-xl px-3 font-display text-lg font-semibold hover:bg-white/5">{simpleLinks[0].label}</Link></div>
        <div className="pop-in" style={stagger(1)}>
          {mobileToggle('corporate', english ? 'Corporate' : 'Kurumsal')}
          {mobileSection === 'corporate' && <div className="ml-3 border-l border-white/10 pl-2">{corporateLinks.map((item) => <Link key={item.href} href={item.href} onClick={closeMobile} className="block rounded-lg px-3 py-2.5 text-[0.9375rem] text-white/70 hover:bg-white/5 hover:text-white">{item.label}</Link>)}</div>}
        </div>
        <div className="pop-in" style={stagger(2)}>
          {mobileToggle('services', english ? 'Services' : 'Hizmetlerimiz')}
          {mobileSection === 'services' && <div className="ml-3 space-y-4 border-l border-white/10 py-2 pl-3"><Link href={EDI_PATHS[locale]} onClick={closeMobile} className="flex items-center gap-2.5 rounded-lg bg-white/5 px-2 py-2.5 text-[0.9375rem] font-semibold text-white"><span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[0.625rem] font-bold text-ink">EDI</span>{EDI_COPY[locale].label}</Link>{serviceGroups.map((group) => <div key={group.label}><p className="px-2 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-accent">{group.label}</p><div className="mt-1">{group.links.map((item) => <Link key={item.href} href={item.href} onClick={closeMobile} className="block rounded-lg px-2 py-2.5 text-[0.9375rem] text-white/70 hover:bg-white/5 hover:text-white">{item.label}</Link>)}</div></div>)}<Link href={servicesHref} onClick={closeMobile} className="block px-2 py-2 text-sm font-semibold text-accent">{english ? 'View All Services' : 'Tüm Hizmetlerimizi İnceleyin'} →</Link></div>}
        </div>
        <div className="pop-in" style={stagger(3)}>
          {mobileToggle('regions', english ? 'Service Areas' : 'Bölgelerimiz')}
          {mobileSection === 'regions' && (
            <div className="ml-3 border-l border-white/10 pl-2">
              {regionLinks.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMobile} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[0.9375rem] text-white/70 hover:bg-white/5 hover:text-white">
                  <span>{item.label}</span>
                  <span className="text-xs text-white/50">{item.cityCount} {english ? 'provinces' : 'il'}</span>
                </Link>
              ))}
              <Link href={regionsHref} onClick={closeMobile} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-accent">{english ? 'All regions →' : 'Tüm bölgeler →'}</Link>
            </div>
          )}
        </div>
        {simpleLinks.slice(1).map((item, index) => <div key={item.href} className="pop-in" style={stagger(4 + index)}><Link href={item.href} onClick={closeMobile} className={cn('flex min-h-12 items-center rounded-xl px-3 font-display text-lg font-semibold hover:bg-white/5', isActive(item.href) && 'text-accent')}>{item.label}</Link></div>)}

        <div className="pop-in mt-auto space-y-3 border-t border-white/10 pt-6" style={stagger(7)}>
          <Link href={contactHref} onClick={closeMobile} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-ink">{text.quote}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          <div className="grid grid-cols-2 gap-3">
            <WhatsAppLink locale={locale} onClick={closeMobile} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-ink"><WhatsAppIcon className="size-5" />{text.whatsappShort}</WhatsAppLink>
            <PhoneLink locale={locale} onClick={closeMobile} className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 text-sm font-semibold text-white"><Phone className="h-4 w-4" aria-hidden="true" />{text.call}</PhoneLink>
          </div>
          <Link href={switchHref} onClick={closeMobile} hrefLang={switchTarget} className="flex h-11 items-center justify-center rounded-xl text-sm font-semibold text-white/70 hover:text-white">{english ? 'TR — Türkçe' : 'EN — English'}</Link>
        </div>
      </nav>
    </div>}
  </header>
}
