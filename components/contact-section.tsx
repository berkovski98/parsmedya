'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const details = [
  {
    icon: Mail,
    label: 'E-posta',
    value: 'info@parsmedya.net',
    href: 'mailto:info@parsmedya.net',
  },
  {
    icon: Phone,
    label: 'Telefon',
    value: '+90 (000) 000 00 00',
    href: 'tel:+900000000000',
  },
  {
    icon: MapPin,
    label: 'Adres',
    value: 'İstanbul, Türkiye',
  },
  {
    icon: Clock,
    label: 'Çalışma Saatleri',
    value: 'Hafta içi 09:00 – 18:00',
  },
]

export function ContactSection() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Bize Ulaşın
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Projenizi konuşalım
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Aklınızdaki fikri paylaşın; size özel çözümü ve ücretsiz teklifi
            hazırlayalım. Uzman ekibimiz en geç 24 saat içinde geri dönüş yapar.
          </p>

          <dl className="mt-10 grid gap-5 sm:grid-cols-2">
            {details.map((d) => (
              <div
                key={d.label}
                className="flex gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <d.icon className="h-5 w-5" />
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">{d.label}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">
                    {d.href ? (
                      <a href={d.href} className="transition-colors hover:text-accent">
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">
                Teşekkürler!
              </h3>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
                Mesajınız alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                    placeholder="Adınız Soyadınız"
                    className="rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
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
                    placeholder="ornek@eposta.com"
                    className="rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
                  />
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
                  placeholder="Örn. Web sitesi projesi"
                  className="rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
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
                  rows={5}
                  placeholder="Projenizden kısaca bahsedin..."
                  className="resize-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </div>

              <button
                type="submit"
                className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
              >
                Mesaj Gönder
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
