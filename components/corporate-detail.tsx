import Link from 'next/link'
import { ArrowRight, CheckCircle2, Globe2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { buttonVariants } from '@/components/ui/button'
import type { Locale } from '@/lib/i18n'

type Card = { title: string; description: string }

export function CorporateDetail({ locale, title, description, paragraphs, principles, steps, globalText, ctaTitle }: { locale: Locale; title: string; description: string; paragraphs: string[]; principles: Card[]; steps?: string[]; globalText?: string; ctaTitle: string }) {
  const english = locale === 'en'
  const contactHref = english ? '/en/contact' : '/tr/iletisim'
  return <>
    <PageHeader locale={locale} parent={{ label: english ? 'Corporate' : 'Kurumsal' }} eyebrow={title} title={title} description={description} />
    <section className="bg-background"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.4fr_.6fr]">
      <article className="space-y-6">{paragraphs.map((paragraph) => <p key={paragraph.slice(0, 42)} className="text-pretty text-lg leading-8 text-muted-foreground">{paragraph}</p>)}</article>
      <aside className="h-fit rounded-2xl border border-border bg-secondary/50 p-6"><Globe2 className="h-8 w-8 text-accent" /><h2 className="mt-4 font-display text-xl font-bold">{english ? 'Technology with lasting value' : 'Kalıcı değer üreten teknoloji'}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{english ? 'We connect business insight, thoughtful design and reliable engineering to create digital systems that can evolve with organizations.' : 'İş bilgisini, kullanıcı odaklı tasarımı ve güvenilir mühendisliği bir araya getirerek kurumlarla birlikte gelişebilen dijital sistemler kuruyoruz.'}</p></aside>
    </div></section>
    {steps && <section className="border-y border-border bg-secondary/40"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20"><p className="text-sm font-semibold uppercase tracking-widest text-accent">{english ? 'Our Approach' : 'Yaklaşımımız'}</p><h2 className="mt-3 font-display text-3xl font-bold">{english ? 'How we work' : 'Nasıl çalışıyoruz?'}</h2><ol className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map((step, index) => <li key={step} className="rounded-xl border border-border bg-card p-5"><span className="text-sm font-bold text-accent">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-3 font-display font-semibold">{step}</h3></li>)}</ol></div></section>}
    <section className={steps ? 'bg-background' : 'border-y border-border bg-secondary/40'}><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24"><p className="text-sm font-semibold uppercase tracking-widest text-accent">{english ? 'Our Principles' : 'İlkelerimiz'}</p><h2 className="mt-3 font-display text-3xl font-bold">{english ? `${title} in practice` : `${title} doğrultusunda temel ilkelerimiz`}</h2><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{principles.map((principle) => <article key={principle.title} className="rounded-xl border border-border bg-card p-6 shadow-sm"><CheckCircle2 className="h-6 w-6 text-accent" /><h3 className="mt-4 font-display text-lg font-bold">{principle.title}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{principle.description}</p></article>)}</div></div></section>
    {globalText && <section className="bg-primary text-primary-foreground"><div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-18"><div className="max-w-4xl"><p className="text-sm font-semibold uppercase tracking-widest text-accent">{english ? 'International Perspective' : 'Global Yaklaşım'}</p><h2 className="mt-3 font-display text-3xl font-bold">{english ? 'Connected across markets' : 'Farklı pazarlarda ortak bir teknoloji yaklaşımı'}</h2><p className="mt-5 text-lg leading-8 text-primary-foreground/75">{globalText}</p></div></div></section>}
    <section className="border-t border-border bg-secondary/40"><div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between"><h2 className="max-w-2xl font-display text-3xl font-bold">{ctaTitle}</h2><Link href={contactHref} className={buttonVariants({ size: 'lg', className: 'w-fit' })}>{english ? 'Contact Us' : 'Bizimle İletişime Geçin'}<ArrowRight className="h-4 w-4" /></Link></div></section>
  </>
}
