'use client'

import { useEffect, useState } from 'react'
import { topicSubject } from '@/lib/engagement'
import { CheckCircle2, Send } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { trackSiteEvent } from '@/lib/analytics-events-client'
import { readAttribution } from '@/lib/attribution-client'
import { ContactChannels } from '@/components/contact-channels'
import { INTERNATIONAL_STATEMENT } from '@/lib/company-claims'
import { LegalConsentNote } from '@/components/legal-consent-note'

const field = 'rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem] font-normal outline-none transition-[border-color,box-shadow] duration-300 hover:border-foreground/25 focus:border-accent focus:ring-4 focus:ring-accent/15'

export function EnglishContactSection() {
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    const subject = topicSubject(window.location.search, 'en')
    const input = document.querySelector<HTMLInputElement>('form input[name="subject"]')
    if (subject && input && !input.value) input.value = subject
  }, [])
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const form = event.currentTarget
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(new FormData(form).entries()), locale: 'en', startedAt, sourcePath: window.location.pathname, ...readAttribution() }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error)
      form.reset(); setSent(true); trackSiteEvent('form_submit', 'contact_form')
    } catch { setError('We could not send your message. Please review the form or try again later.'); setStartedAt(Date.now()) } finally { setLoading(false) }
  }
  return <section className="bg-background py-16 sm:py-24"><div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16"><div><p className="eyebrow">Contact Us</p><h2 className="text-display mt-5 text-balance text-[2.1rem] sm:text-5xl">Let’s discuss your project</h2><p className="mt-4 leading-relaxed text-muted-foreground">Share your goals and current challenges. Our team will review your message and respond with a practical next step.</p><ContactChannels locale="en" /><div className="mt-12 border-t border-border pt-10"><h3 className="font-display text-xl font-bold">International projects</h3><p className="mt-3 leading-relaxed text-muted-foreground">{INTERNATIONAL_STATEMENT.en} We work in English and Turkish.</p></div></div><div data-reveal="scale" className="h-fit rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-40px_rgb(10_20_50/0.35)] sm:p-10">{sent ? <div className="flex h-full flex-col items-center justify-center py-12 text-center"><CheckCircle2 className="h-12 w-12 text-accent" /><h3 className="mt-4 font-display text-xl font-semibold">Thank you</h3><p className="mt-2 text-sm text-muted-foreground">Your message has been delivered. We will contact you as soon as possible.</p></div> : <form onSubmit={submit} className="flex flex-col gap-5"><div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="en-website">Website</label><input id="en-website" name="website" tabIndex={-1} autoComplete="off" /></div><div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm font-medium">Name *<input name="name" required maxLength={120} className={field} /></label><label className="flex flex-col gap-2 text-sm font-medium">Email *<input name="email" type="email" required maxLength={254} className={field} /></label><label className="flex flex-col gap-2 text-sm font-medium">Phone<input name="phone" type="tel" maxLength={40} className={field} /></label><label className="flex flex-col gap-2 text-sm font-medium">Company<input name="company" maxLength={150} className={field} /></label></div><label className="flex flex-col gap-2 text-sm font-medium">Subject<input name="subject" maxLength={200} className={field} /></label><label className="flex flex-col gap-2 text-sm font-medium">Message *<textarea name="message" required maxLength={5000} rows={6} className={field} /></label>{error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<button disabled={loading} className={cn(buttonVariants({ size: 'lg' }), 'group h-12 w-full rounded-xl bg-ink text-[0.9375rem] font-semibold text-ink-foreground hover:bg-primary')}>{loading ? 'Sending…' : 'Send Message'}<Send className="h-4 w-4" /></button><LegalConsentNote locale="en" /></form>}</div></div></section>
}
