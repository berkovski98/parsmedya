import { Target, Eye, Gauge } from 'lucide-react'
import Image from 'next/image'
import { CountUp } from '@/components/motion/count-up'
import { stagger } from '@/lib/motion'

const values = [
  {
    icon: Target,
    title: 'Misyonumuz',
    text: 'İşletmelerin dijital hedeflerine ölçülebilir sonuçlarla ulaşmasını sağlayan, sürdürülebilir yazılım çözümleri geliştirmek.',
  },
  {
    icon: Eye,
    title: 'Vizyonumuz',
    text: 'Türkiye’den dünyaya açılan, güvenilirliği ve teknik derinliğiyle tercih edilen bir teknoloji ortağı olmak.',
  },
  {
    icon: Gauge,
    title: 'Yaklaşımımız',
    text: 'Şeffaf iletişim, agile süreçler ve performans odaklı geliştirme ile projeleri zamanında ve bütçesinde teslim etmek.',
  },
]

export function About() {
  return (
    <section id="hakkimizda" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <span className="eyebrow">
              Kısaca Pars Medya
            </span>
            <h2 className="text-display mt-5 text-balance text-[2rem] text-foreground sm:text-[2.75rem]">
              Teknolojiyi işinizin hizmetine sunuyoruz
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
              Pars Medya; web, mobil ve kurumsal yazılım alanında uzmanlaşmış bir dijital
              çözüm ortağıdır. Bir panter kadar hızlı, bir o kadar da kararlı bir yaklaşımla,
              fikirlerinizi ölçeklenebilir ve güvenli teknolojilere dönüştürüyoruz.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Kurulduğumuz günden bu yana onlarca markayla çalıştık; her projede önceliğimiz
              işinizi gerçekten ileri taşıyan, sürdürülebilir ve bakımı kolay ürünler ortaya
              koymak oldu. Uzun vadeli iş birliklerine inanır, teslimden sonra da yanınızda kalırız.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              İstanbul&apos;dan başlayan hizmet ağımızı; Dubai, Moskova ve
              İsviçre&apos;deki iş bağlantılarımız, farklı pazarlardaki proje
              deneyimimiz ve global hizmet yaklaşımımızla uluslararası ölçekte
              genişletiyoruz. Markaların farklı ülkelerdeki dijital ihtiyaçlarına,
              yerel dinamikleri gözeten sürdürülebilir çözümler üretiyoruz.
            </p>

            <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <dt className="font-display text-3xl font-extrabold tracking-tight text-foreground"><CountUp value="120+" /></dt>
                <dd className="mt-1 text-sm text-muted-foreground">Tamamlanan proje</dd>
              </div>
              <div>
                <dt className="font-display text-3xl font-extrabold tracking-tight text-foreground"><CountUp value="8+" /></dt>
                <dd className="mt-1 text-sm text-muted-foreground">Yıllık deneyim</dd>
              </div>
              <div>
                <dt className="font-display text-3xl font-extrabold tracking-tight text-foreground"><CountUp value="%98" /></dt>
                <dd className="mt-1 text-sm text-muted-foreground">Müşteri memnuniyeti</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-4">
            <div data-reveal="scale" className="relative flex items-center justify-center overflow-hidden rounded-3xl bg-ink px-8 py-14"><div aria-hidden="true" className="bg-grid absolute inset-0 text-white [mask-image:radial-gradient(ellipse_at_center,#000,transparent_75%)]" />
              <Image
                src="/parsmedya-logo.png"
                alt="Pars Medya logosu"
                width={384}
                height={77}
                sizes="(min-width: 640px) 384px, 280px"
                className="relative h-14 w-auto sm:h-16"
              />
            </div>

            {values.map((v, index) => (
              <div
                key={v.title}
                data-reveal
                style={stagger(index + 1)}
                className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-[0_16px_40px_-24px_rgb(10_20_50/0.35)] sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-strong transition-colors duration-300 group-hover:bg-ink group-hover:text-accent">
                  <v.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
