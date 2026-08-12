const steps = [
  {
    step: '01',
    title: 'Keşif & Analiz',
    description:
      'İhtiyaçlarınızı dinliyor, hedeflerinizi ve rakiplerinizi analiz ediyoruz.',
  },
  {
    step: '02',
    title: 'Tasarım & Planlama',
    description:
      'Kullanıcı deneyimini önceleyen arayüz tasarımları ve yol haritası oluşturuyoruz.',
  },
  {
    step: '03',
    title: 'Geliştirme',
    description:
      'Modern teknolojilerle ölçeklenebilir, güvenli ve hızlı çözümler kodluyoruz.',
  },
  {
    step: '04',
    title: 'Yayın & Destek',
    description:
      'Projeyi yayına alıyor, ardından sürekli bakım ve destek sağlıyoruz.',
  },
]

export function Process() {
  return (
    <section id="surec" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Çalışma Sürecimiz
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Fikirden yayına dört adım
          </h2>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <li
              key={item.step}
              className="relative rounded-xl border border-border bg-card p-6"
            >
              <span className="font-display text-3xl font-bold text-accent/30">
                {item.step}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
