import { Target, Eye, Gauge } from 'lucide-react'

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
    <section id="hakkimizda" className="border-t border-border bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">
              Kısaca ParsMedya
            </span>
            <h2 className="mt-3 text-balance font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Teknolojiyi işinizin hizmetine sunuyoruz
            </h2>
            <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">
              ParsMedya; web, mobil ve kurumsal yazılım alanında uzmanlaşmış bir dijital
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
                <dt className="font-display text-3xl font-bold text-foreground">120+</dt>
                <dd className="mt-1 text-sm text-muted-foreground">Tamamlanan proje</dd>
              </div>
              <div>
                <dt className="font-display text-3xl font-bold text-foreground">8+</dt>
                <dd className="mt-1 text-sm text-muted-foreground">Yıllık deneyim</dd>
              </div>
              <div>
                <dt className="font-display text-3xl font-bold text-foreground">%98</dt>
                <dd className="mt-1 text-sm text-muted-foreground">Müşteri memnuniyeti</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center rounded-2xl bg-primary px-8 py-12">
              <img
                src="/parsmedya-logo.png"
                alt="ParsMedya logosu"
                className="h-14 w-auto sm:h-16"
              />
            </div>

            {values.map((v) => (
              <div
                key={v.title}
                className="flex gap-4 rounded-xl border border-border bg-card p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
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
