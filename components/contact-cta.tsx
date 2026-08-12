import { ArrowRight, Mail, Phone } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

export function ContactCta() {
  return (
    <section id="iletisim" className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-xl">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Projenizi birlikte hayata geçirelim
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-primary-foreground/80">
            Aklınızdaki fikri anlatın, size özel çözümü ve ücretsiz teklifi
            hazırlayalım. Uzman ekibimiz 24 saat içinde geri dönüş yapar.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-sm sm:flex-row sm:gap-8">
            <a
              href="mailto:info@parsmedya.net"
              className="inline-flex items-center gap-2 text-primary-foreground/90 transition-colors hover:text-primary-foreground"
            >
              <Mail className="h-4 w-4" />
              info@parsmedya.net
            </a>
            <a
              href="tel:+900000000000"
              className="inline-flex items-center gap-2 text-primary-foreground/90 transition-colors hover:text-primary-foreground"
            >
              <Phone className="h-4 w-4" />
              +90 (000) 000 00 00
            </a>
          </div>
        </div>

        <a
          href="mailto:info@parsmedya.net"
          className={buttonVariants({
            size: 'lg',
            className: 'bg-accent text-accent-foreground hover:bg-accent/90',
          })}
        >
          Teklif Al
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  )
}
