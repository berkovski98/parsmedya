import type { Metadata } from 'next'
import { CorporateDetail } from '@/components/corporate-detail'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = createPageMetadata({ title: 'Misyonumuz | Pars Medya', description: "Pars Medya'nın işletmelere özel yazılım, dijital dönüşüm ve sürdürülebilir teknoloji çözümleri sunma misyonunu keşfedin.", canonical: '/tr/misyonumuz', tr: '/tr/misyonumuz', en: '/en/mission', locale: 'tr' })
const paragraphs = [
  'Misyonumuz, işletmelerin karmaşık dijital süreçlerini sadeleştiren ve teknolojiyi ölçülebilir iş sonuçlarına dönüştüren çözümler geliştirmektir. Her projeye kurumun hedeflerini, kullanıcılarını ve mevcut operasyonlarını anlayarak başlar; gereksiz karmaşıklık yerine gerçek ihtiyaca odaklanırız.',
  'Standart ürünlerin karşılayamadığı süreçler için şirkete özel yazılımlar geliştiririz. CRM, ERP, web yazılım, mobil uygulama ve entegrasyon çözümlerini kurumun iş kurallarına göre tasarlayarak ekiplerin tek ve güvenilir bir veri kaynağı üzerinden çalışmasını sağlarız.',
  'Manuel operasyonları otomatikleştirmek, tekrar eden işleri azaltmak ve insan hatası riskini kontrol altına almak temel önceliklerimiz arasındadır. Onay akışları, bildirimler, görev yönetimi ve sistemler arası veri transferleriyle ekiplerin zamanını daha değerli çalışmalara ayırmasına yardımcı oluruz.',
  'Dashboard ve raporlama sistemleriyle dağınık veriyi anlaşılır göstergelere dönüştürür, yöneticilere veriye dayalı karar alma imkânı sunarız. Dijital pazarlama ve kullanıcı deneyimi çalışmalarımızla markaların görünürlüğünü ve müşterileriyle kurduğu etkileşimi güçlendiririz.',
  'Geliştirdiğimiz altyapılarda güvenliği, performansı ve sürdürülebilirliği başlangıçtan itibaren ele alırız. Yetkilendirme, veri doğrulama, izlenebilirlik ve bakım kolaylığı gibi konuları ürünün doğal bir parçası olarak değerlendiririz.',
  'Başarıyı yalnızca yazılımın canlıya alınmasıyla ölçmeyiz. Kullanım verilerini, geri bildirimleri ve değişen iş ihtiyaçlarını takip ederek ürünleri sürekli geliştirir; müşterilerimizle şeffaf, sorumlu ve uzun vadeli bir çalışma ilişkisi kurarız.',
]
const principles = [
  { title: 'İş Odaklı Teknoloji', description: 'Her teknik kararı ölçülebilir iş değeri ve gerçek kullanıcı ihtiyacıyla ilişkilendiririz.' }, { title: 'Şeffaf İletişim', description: 'Kapsamı, ilerlemeyi, riskleri ve kararları tüm paydaşlarla açık biçimde paylaşırız.' }, { title: 'Güvenlik', description: 'Veri koruma, yetkilendirme ve güvenli geliştirme pratiklerini sürecin başından uygularız.' }, { title: 'Kalite', description: 'Kod, deneyim ve teslimat kalitesini testler ve düzenli gözden geçirmelerle güvence altına alırız.' }, { title: 'Esneklik', description: 'Değişen ihtiyaçlara kontrollü biçimde uyum sağlayan modüler sistemler geliştiririz.' }, { title: 'Sürekli Gelişim', description: 'Canlı ürünleri kullanıcı geri bildirimi ve ölçülebilir verilerle düzenli olarak iyileştiririz.' },
]
const steps = ['İhtiyaç Analizi', 'Strateji ve Planlama', 'Tasarım ve Kullanıcı Deneyimi', 'Yazılım Geliştirme', 'Test ve Kalite Kontrol', 'Canlıya Alma', 'Destek ve Sürekli Geliştirme']
export default function MissionPage() { return <CorporateDetail locale="tr" title="Misyonumuz" description="İşletmelerin süreçlerini sadeleştiren, ekiplerini güçlendiren ve sürdürülebilir büyümeyi destekleyen dijital çözümler üretiyoruz." paragraphs={paragraphs} principles={principles} steps={steps} ctaTitle="İş süreçlerinizi birlikte dijitalleştirelim." /> }
