import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'

const stats = [
  { value: '120+', label: 'Tamamlanan Proje' },
  { value: '8 Yıl', label: 'Sektör Deneyimi' },
  { value: '%98', label: 'Müşteri Memnuniyeti' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            Güvenilir dijital çözüm ortağınız
          </div>

          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            İşinizi büyüten{' '}
            <span className="text-accent">web ve yazılım</span> çözümleri
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            ParsMedya olarak; kurumsal web siteleri, mobil uygulamalar ve
            e-ticaret sistemleri geliştiriyoruz. Markanızı dijitalde güçlü,
            hızlı ve güvenilir bir şekilde konumlandırıyoruz.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/iletisim" className={buttonVariants({ size: 'lg' })}>
              Ücretsiz Teklif Al
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/hizmetler"
              className={buttonVariants({ size: 'lg', variant: 'outline' })}
            >
              Hizmetleri İncele
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {stat.value}
                </dd>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-secondary/60" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <Image
              src="/parsmedya-hero.png"
              alt="ParsMedya tarafından geliştirilen web ve mobil uygulama arayüzü"
              width={720}
              height={560}
              sizes="(min-width: 1024px) 560px, calc(100vw - 2rem)"
              quality={82}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
