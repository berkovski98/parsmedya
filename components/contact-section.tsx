'use client'

import { useState } from 'react'
import { MapPin, Send, CheckCircle2 } from 'lucide-react'
import { ContactChannels } from '@/components/contact-channels'
import { LegalConsentNote } from '@/components/legal-consent-note'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'


export function ContactSection() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [startedAt, setStartedAt] = useState(() => Date.now())

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const form = e.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, startedAt }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      form.reset()
      setSent(true)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.')
      setStartedAt(Date.now())
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="eyebrow">
            Bize Ulaşın
          </p>
          <h2 className="text-display mt-5 text-balance text-[2.1rem] text-foreground sm:text-5xl">
            Projenizi konuşalım
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Aklınızdaki fikri paylaşın; size özel çözümü ve ücretsiz teklifi
            hazırlayalım. Uzman ekibimiz en geç 24 saat içinde geri dönüş yapar.
          </p>

          <ContactChannels locale="tr" />
        </div>

        <div data-reveal="scale" className="h-fit rounded-3xl border border-border bg-card p-6 shadow-[0_30px_80px_-40px_rgb(10_20_50/0.35)] sm:p-10">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Teşekkürler!
              </h3>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Web sitesi</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Ad Soyad
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    placeholder="Adınız Soyadınız"
                    className="rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/80 hover:border-foreground/25 focus:border-accent focus:ring-4 focus:ring-accent/15"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    E-posta
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    placeholder="ornek@eposta.com"
                    className="rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/80 hover:border-foreground/25 focus:border-accent focus:ring-4 focus:ring-accent/15"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium text-foreground">Telefon</label>
                  <input id="phone" name="phone" type="tel" maxLength={40} placeholder="05xx xxx xx xx" className="rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/80 hover:border-foreground/25 focus:border-accent focus:ring-4 focus:ring-accent/15" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="company" className="text-sm font-medium text-foreground">Firma</label>
                  <input id="company" name="company" type="text" maxLength={150} placeholder="Firma adı" className="rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/80 hover:border-foreground/25 focus:border-accent focus:ring-4 focus:ring-accent/15" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Konu
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  maxLength={200}
                  placeholder="Örn. Web sitesi projesi"
                  className="rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/80 hover:border-foreground/25 focus:border-accent focus:ring-4 focus:ring-accent/15"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  maxLength={5000}
                  rows={5}
                  placeholder="Projenizden kısaca bahsedin..."
                  className="resize-none rounded-xl border border-input bg-background px-4 py-3 text-[0.9375rem] text-foreground outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted-foreground/80 hover:border-foreground/25 focus:border-accent focus:ring-4 focus:ring-accent/15"
                />
              </div>

              {error && <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className={cn(buttonVariants({ size: 'lg' }), 'group h-12 w-full rounded-xl bg-ink text-[0.9375rem] font-semibold text-ink-foreground hover:bg-primary')}
              >
                {submitting ? 'Gönderiliyor…' : 'Mesaj Gönder'}
                <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              <LegalConsentNote locale="tr" />
            </form>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl border-t border-border px-4 pt-16 sm:px-6 sm:pt-20">
        <div className="max-w-3xl">
          <p className="eyebrow">
            Uluslararası Hizmet Ağı
          </p>
          <h2 className="mt-3 text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Faaliyet Noktalarımız
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Pars Medya, İstanbul merkezli yapısıyla birlikte Dubai, Moskova ve
            İsviçre&apos;deki iş ağlarıyla markalara uluslararası ölçekte dijital
            çözümler sunmaktadır.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
          {['İstanbul', 'Dubai', 'Moskova', 'İsviçre'].map((location) => (
            <li
              key={location}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display font-semibold text-foreground">
                {location}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
