'use client'

import { useState } from 'react'
import { CheckCircle2, MapPin, Send } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const field = 'rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40'

export function EnglishContactSection() {
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const form = event.currentTarget
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(new FormData(form).entries()), locale: 'en', startedAt }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error)
      form.reset(); setSent(true)
    } catch { setError('We could not send your message. Please review the form or try again later.'); setStartedAt(Date.now()) } finally { setLoading(false) }
  }
  return <section className="bg-background py-16 sm:py-24"><div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2"><div><p className="text-sm font-semibold uppercase tracking-widest text-accent">Contact Us</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Let’s discuss your project</h2><p className="mt-4 leading-relaxed text-muted-foreground">Share your goals and current challenges. Our team will review your message and respond with a practical next step.</p><dl className="mt-8 space-y-4"><div><dt className="text-sm text-muted-foreground">Email</dt><dd><a className="font-medium text-accent" href="mailto:info@parsmedya.net">info@parsmedya.net</a></dd></div><div><dt className="text-sm text-muted-foreground">Phone</dt><dd><a className="font-medium text-accent" href="tel:+902129637777">+90 212 963 77 77</a></dd></div></dl><div className="mt-10"><h3 className="font-display text-xl font-bold">International Business Network</h3><p className="mt-3 leading-relaxed text-muted-foreground">From our Istanbul base, we support brands internationally through business relationships and project experience across Dubai, Moscow and Switzerland.</p><ul className="mt-5 grid grid-cols-2 gap-3">{['Istanbul','Dubai','Moscow','Switzerland'].map((place) => <li key={place} className="flex items-center gap-2 rounded-lg border border-border p-3"><MapPin className="h-4 w-4 text-accent" />{place}</li>)}</ul></div></div><div className="rounded-2xl border border-border bg-card p-6 sm:p-8">{sent ? <div className="flex h-full flex-col items-center justify-center py-12 text-center"><CheckCircle2 className="h-12 w-12 text-accent" /><h3 className="mt-4 font-display text-xl font-semibold">Thank you</h3><p className="mt-2 text-sm text-muted-foreground">Your message has been delivered. We will contact you as soon as possible.</p></div> : <form onSubmit={submit} className="flex flex-col gap-5"><div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="en-website">Website</label><input id="en-website" name="website" tabIndex={-1} autoComplete="off" /></div><div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm font-medium">Name *<input name="name" required maxLength={120} className={field} /></label><label className="flex flex-col gap-2 text-sm font-medium">Email *<input name="email" type="email" required maxLength={254} className={field} /></label><label className="flex flex-col gap-2 text-sm font-medium">Phone<input name="phone" type="tel" maxLength={40} className={field} /></label><label className="flex flex-col gap-2 text-sm font-medium">Company<input name="company" maxLength={150} className={field} /></label></div><label className="flex flex-col gap-2 text-sm font-medium">Subject<input name="subject" maxLength={200} className={field} /></label><label className="flex flex-col gap-2 text-sm font-medium">Message *<textarea name="message" required maxLength={5000} rows={6} className={field} /></label>{error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<button disabled={loading} className={cn(buttonVariants({ size: 'lg' }), 'w-full')}>{loading ? 'Sending…' : 'Send Message'}<Send className="h-4 w-4" /></button></form>}</div></div></section>
}
