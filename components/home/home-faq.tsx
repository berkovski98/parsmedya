import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { safeJsonLd } from '@/lib/seo'

type Faq = { question: string; answer: string }

const content: Record<Locale, { eyebrow: string; title: string; text: string; cta: { label: string; href: string }; faqs: Faq[] }> = {
  tr: {
    eyebrow: 'Sıkça Sorulan Sorular',
    title: 'Projeye başlamadan önce merak edilenler',
    text: 'Burada yanıtını bulamadığınız bir soru varsa ekibimize doğrudan ulaşabilirsiniz.',
    cta: { label: 'Bize sorun', href: '/iletisim' },
    faqs: [
      { question: 'Bir projeye nasıl başlıyoruz?', answer: 'İletişim formu, telefon veya WhatsApp üzerinden ihtiyacınızı paylaşmanız yeterli. Kısa bir keşif görüşmesiyle hedeflerinizi, kullanıcılarınızı ve mevcut sistemlerinizi anlıyor, ardından kapsamı ve önerimizi içeren ücretsiz bir teklif hazırlıyoruz.' },
      { question: 'Proje süresi ve bütçesi nasıl belirleniyor?', answer: 'Süre ve bütçe; kullanıcı rolleri, modül sayısı, entegrasyonlar, tasarım ihtiyacı ve veri geçişi kapsamına göre belirlenir. Analizin ardından fazlara ayrılmış, gerçekçi bir takvim ve teklif sunuyoruz.' },
      { question: 'Hazır paket yazılım mı, özel yazılım mı tercih etmeliyim?', answer: 'Hazır paket ürünler standart süreçler ve hızlı başlangıç için uygundur. İşletmenize özgü onaylar, fiyatlandırma kuralları, raporlar veya entegrasyonlar gerekiyorsa özel yazılım daha sürdürülebilir olur. Analiz aşamasında iki seçeneği de tarafsız biçimde değerlendiriyoruz.' },
      { question: 'Mevcut sistemlerimizle entegrasyon kurabilir misiniz?', answer: 'Evet. Uygun API, web servisleri veya güvenli veri aktarım yöntemleriyle ERP, CRM, muhasebe, ödeme, kargo ve diğer sistemlerinizle kontrollü entegrasyon kurabiliyoruz.' },
      { question: 'Yayın sonrasında destek veriyor musunuz?', answer: 'Evet. Yayın sonrasında bakım, güncelleme, güvenlik kontrolleri, ölçümleme ve yeni geliştirmelerle projenizi sürdürmeye devam ediyoruz.' },
      { question: 'Türkiye dışındaki projelerde çalışıyor musunuz?', answer: 'Evet. İstanbul merkezli ekibimizle Türkçe ve İngilizce iletişim kuruyor; farklı pazarların diline ve operasyon ihtiyacına uyarlanabilen çok dilli, ölçeklenebilir projeler geliştiriyoruz.' },
    ],
  },
  en: {
    eyebrow: 'Frequently Asked Questions',
    title: 'What clients ask before we start',
    text: 'If your question is not answered here, you can reach our team directly.',
    cta: { label: 'Ask us', href: '/en/contact' },
    faqs: [
      { question: 'How do we start a project?', answer: 'Share your needs through the contact form, by phone or on WhatsApp. A short discovery conversation helps us understand your goals, users and existing systems; we then prepare a free proposal with the scope and our recommendation.' },
      { question: 'How are timeline and budget defined?', answer: 'Timeline and budget depend on user roles, the number of modules, integrations, design needs and data migration. After the analysis we present a realistic, phased plan and proposal.' },
      { question: 'Should I choose packaged or custom software?', answer: 'Packaged products suit standard workflows and fast launches. When your business needs its own approvals, pricing rules, reports or integrations, custom software is the more sustainable choice. We assess both options objectively during analysis.' },
      { question: 'Can you integrate with our existing systems?', answer: 'Yes. Using suitable APIs, web services or secure data-transfer methods, we can build controlled integrations with your ERP, CRM, accounting, payment, shipping and other systems.' },
      { question: 'Do you provide support after launch?', answer: 'Yes. After launch we continue with maintenance, updates, security checks, measurement and further development.' },
      { question: 'Do you work with clients outside Türkiye?', answer: 'Yes. Our Istanbul-based team communicates in English and Turkish and builds multilingual, scalable products that adapt to the language and operational needs of different markets.' },
    ],
  },
}

export function HomeFaq({ locale = 'tr' }: { locale?: Locale }) {
  const t = content[locale]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
  }

  return (
    <section aria-labelledby="faq-heading" className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start" data-reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="faq-heading" className="text-display mt-5 text-balance text-[2.1rem] text-foreground sm:text-5xl">{t.title}</h2>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">{t.text}</p>
          <Link href={t.cta.href} className="group mt-8 inline-flex items-center gap-2 border-b-2 border-accent pb-1 text-sm font-semibold text-foreground transition-colors hover:text-accent-strong">
            {t.cta.label}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div className="divide-y divide-border border-y border-border" data-reveal>
          {t.faqs.map((faq) => (
            <details key={faq.question} className="group/faq">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-lg font-semibold tracking-tight text-foreground transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:text-xl [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-open/faq:rotate-45 group-open/faq:border-accent group-open/faq:bg-accent group-open/faq:text-ink" aria-hidden="true"><Plus className="h-4 w-4" /></span>
              </summary>
              <p className="-mt-1 max-w-2xl pb-7 pr-12 text-pretty leading-7 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
