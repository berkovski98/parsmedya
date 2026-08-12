import { CheckCircle2 } from 'lucide-react'

const reasons = [
  {
    title: 'Şeffaf Süreç',
    description:
      'Projenizin her aşamasında düzenli raporlama ve net iletişim sunuyoruz.',
  },
  {
    title: 'Zamanında Teslim',
    description:
      'Planlanan takvime sadık kalarak projelerinizi vaktinde teslim ediyoruz.',
  },
  {
    title: 'Güvenlik Öncelikli',
    description:
      'Güncel güvenlik standartları ve KVKK uyumlu altyapılar geliştiriyoruz.',
  },
  {
    title: 'Uzun Vadeli Destek',
    description:
      'Yayın sonrası bakım, güncelleme ve teknik destekle yanınızdayız.',
  },
]

export function WhyUs() {
  return (
    <section id="neden-biz" className="border-b border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Neden ParsMedya?
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Güvenle çalışabileceğiniz bir ekip
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Sadece kod yazmıyor, işinizi anlıyoruz. Hedeflerinize ulaşmanız için
            teknolojiyi doğru şekilde kullanmanıza yardımcı oluyoruz. Uzun soluklu
            iş ortaklıkları kuruyoruz.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <CheckCircle2 className="h-6 w-6 text-accent" />
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {reason.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
