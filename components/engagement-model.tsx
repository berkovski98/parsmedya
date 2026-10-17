import Link from 'next/link'
import { ArrowRight, Check, Compass, FlaskConical, LifeBuoy } from 'lucide-react'
import { paths, type Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

import type { EngagementTopic } from '@/lib/engagement'

const content = {
  tr: {
    eyebrow: 'Nasıl çalışırız',
    title: 'Keşiften pilota, pilottan sürekli desteğe',
    text: 'Her projeye küçük ve net bir adımla başlıyoruz. Bir sonraki aşamaya, önceki aşamanın çıktısını gördükten sonra birlikte karar veriyoruz.',
    price: 'Fiyat: ihtiyaca göre teklif',
    cta: 'Bu aşamayı konuşalım',
    stages: [
      { key: 'discovery', icon: Compass, name: 'Keşif Atölyesi', summary: 'Hedefleri, kullanıcıları, mevcut süreçleri ve entegrasyon ihtiyaçlarını birlikte netleştiririz.', items: ['Süreç ve ihtiyaç haritası', 'Kapsam ve öncelik listesi', 'Teknik yaklaşım ve riskler', 'Aşamalı yol haritası ve teklif'] },
      { key: 'pilot', icon: FlaskConical, name: 'Sabit kapsamlı pilot', summary: 'Keşifte seçilen en değerli parçayı, kapsamı ve takvimi önceden sabitlenmiş bir pilot olarak hayata geçiririz.', items: ['Önceden yazılı kapsam ve takvim', 'Düzenli demo ve geri bildirim', 'Test edilmiş, kullanıma hazır ilk sürüm', 'Ölçülecek başarı kriterleri'] },
      { key: 'support', icon: LifeBuoy, name: 'Aylık destek ve geliştirme', summary: 'Yayından sonra sistemi izler, günceller ve yeni ihtiyaçlara göre planlı biçimde geliştiririz.', items: ['Bakım, güncelleme ve güvenlik kontrolleri', 'İzleme ve hata takibi', 'Aylık geliştirme planı', 'Düzenli raporlama'] },
    ],
  },
  en: {
    eyebrow: 'How we engage',
    title: 'From discovery to pilot, from pilot to ongoing support',
    text: 'Every project starts with a small, clear step. We decide on the next stage together once you have seen the results of the previous one.',
    price: 'Price: quoted to your needs',
    cta: 'Discuss this stage',
    stages: [
      { key: 'discovery', icon: Compass, name: 'Discovery workshop', summary: 'We clarify goals, users, current workflows and integration needs together.', items: ['Process and needs map', 'Scope and priority list', 'Technical approach and risks', 'Phased roadmap and proposal'] },
      { key: 'pilot', icon: FlaskConical, name: 'Fixed-scope pilot', summary: 'We deliver the most valuable part identified in discovery as a pilot with scope and timeline agreed up front.', items: ['Written scope and timeline', 'Regular demos and feedback', 'A tested, usable first release', 'Agreed success criteria'] },
      { key: 'support', icon: LifeBuoy, name: 'Monthly support & development', summary: 'After launch we monitor, maintain and keep developing the system in planned increments.', items: ['Maintenance, updates and security checks', 'Monitoring and issue tracking', 'Monthly development plan', 'Regular reporting'] },
    ],
  },
} as const

export function contactHrefFor(locale: Locale, topic: EngagementTopic) {
  return `${paths.contact(locale)}?konu=${topic}`
}

export function EngagementModel({ locale = 'tr', className }: { locale?: Locale; className?: string }) {
  const t = content[locale]
  return (
    <section aria-labelledby="engagement-heading" className={cn('border-y border-border bg-secondary/40', className)}>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="engagement-heading" className="text-display mt-5 text-balance text-[2rem] text-foreground sm:text-[2.75rem]">{t.title}</h2>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{t.text}</p>
        </div>
        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {t.stages.map((stage, index) => (
            <li key={stage.key} data-reveal style={stagger(index)} className="card-hairline relative flex flex-col rounded-2xl border border-border bg-card p-7">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-ink text-accent"><stage.icon className="h-5 w-5" aria-hidden="true" /></span>
                <span className="font-display text-sm font-bold tabular-nums text-muted-foreground/70">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-foreground">{stage.name}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{stage.summary}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {stage.items.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />{item}</li>)}
              </ul>
              <p className="mt-6 border-t border-border pt-4 text-sm font-semibold text-foreground">{t.price}</p>
              <Link href={contactHrefFor(locale, stage.key)} className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong hover:text-foreground">
                {t.cta}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
