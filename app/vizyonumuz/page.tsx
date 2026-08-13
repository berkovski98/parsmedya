import type { Metadata } from 'next'
import { CorporateDetail } from '@/components/corporate-detail'
import { localizedAlternates } from '@/lib/seo'

export const metadata: Metadata = { title: 'Vizyonumuz | Pars Medya', description: "Pars Medya'nın yazılım, dijital dönüşüm ve global teknoloji çözümlerine yönelik uzun vadeli vizyonunu keşfedin.", alternates: localizedAlternates('/vizyonumuz', '/vizyonumuz', '/en/vision') }

const paragraphs = [
  'Pars Medya olarak vizyonumuz, Türkiye’den global pazarlara değer üreten; teknoloji, tasarım ve iş stratejisini aynı zeminde buluşturan güvenilir bir teknoloji markası olmaktır. Kurumların yalnızca bugünkü ihtiyaçlarını karşılayan değil, değişen pazar koşullarına uyum sağlayabilen dijital altyapılar geliştirmeyi hedefliyoruz.',
  'Web yazılım, özel yazılım, CRM, ERP ve SaaS çözümlerinde her işletmenin çalışma biçiminin farklı olduğu gerçeğinden hareket ediyoruz. Ölçeklenebilir mimari, güvenli veri akışı ve sürdürülebilir kod yapısı sayesinde geliştirilen sistemlerin yeni kullanıcılar, süreçler ve entegrasyonlarla birlikte büyüyebilmesini önemsiyoruz.',
  'Yapay zeka destekli sistemleri, yalnızca teknolojik bir yenilik olarak değil; doğru veriye erişimi kolaylaştıran, tekrar eden işleri azaltan ve karar süreçlerini güçlendiren sorumlu araçlar olarak ele alıyoruz. İnsan denetimini, veri güvenliğini ve gerçek iş değerini her uygulamanın merkezinde tutuyoruz.',
  'Dijital dönüşümün teknoloji yatırımından daha fazlası olduğuna inanıyoruz. Başarılı dönüşüm; kullanıcı deneyimini, ekiplerin günlük alışkanlıklarını ve kurumun uzun vadeli hedeflerini birlikte değerlendirmeyi gerektirir. Bu nedenle ürünleri gerçek kullanıcı ihtiyaçlarıyla şekillendiriyor, karmaşıklığı sade ve anlaşılır deneyimlere dönüştürüyoruz.',
  'Müşterilerimizle proje teslimiyle sona ermeyen, şeffaf iletişime ve ortak öğrenmeye dayanan uzun vadeli ilişkiler kurmayı amaçlıyoruz. Güvenilir teknoloji partnerliği anlayışımız; gerçekçi planlama, ölçülebilir ilerleme, açık sorumluluklar ve sürekli gelişim üzerine kuruludur.',
  'Yenilikçiliği sürdürülebilir büyümeyle birlikte ele alarak uluslararası pazarlarda rekabet edebilen çözümler geliştirmeyi hedefliyoruz. İstanbul’dan başlayan yaklaşımımızı farklı pazarlardaki deneyimlerle zenginleştiriyor, kurumların dijital geleceğe güvenle hazırlanmasına katkı sağlıyoruz.',
]
const principles = [
  { title: 'Yenilikçilik', description: 'Yeni teknolojileri gerçek iş ihtiyaçlarıyla buluşturan, uygulanabilir çözümler geliştiririz.' },
  { title: 'Global Bakış Açısı', description: 'Ürünleri farklı pazarların, kullanıcıların ve operasyon modellerinin ihtiyaçlarını gözeterek tasarlarız.' },
  { title: 'Güvenilirlik', description: 'Şeffaf iletişim, güvenli geliştirme ve öngörülebilir teslim süreçlerini temel alırız.' },
  { title: 'Ölçeklenebilir Teknoloji', description: 'Kullanıcı, veri ve işlem hacmi arttıkça kontrollü biçimde büyüyebilen mimariler kurarız.' },
  { title: 'Kullanıcı Odaklılık', description: 'Karmaşık süreçleri kullanıcıların kolayca anlayıp uygulayabileceği deneyimlere dönüştürürüz.' },
  { title: 'Sürdürülebilir Başarı', description: 'Kısa vadeli kazanımları uzun vadeli bakım, gelişim ve iş değeriyle dengeleriz.' },
]
export default function VisionPage() { return <CorporateDetail locale="tr" title="Vizyonumuz" description="Teknoloji, yazılım ve dijital dönüşüm alanlarında Türkiye’den global pazarlara sürdürülebilir değer üreten güvenilir bir çözüm ortağı olmayı hedefliyoruz." paragraphs={paragraphs} principles={principles} globalText="İstanbul merkezli çalışma anlayışımızı Dubai, Moskova ve İsviçre’deki iş bağlantıları ve proje deneyimleriyle zenginleştiriyoruz. Fiziksel sınırlar yerine güçlü iletişim, yerel pazar farkındalığı ve ortak kalite standartlarıyla markalara farklı ülkelerde dijital çözümler sunuyoruz." ctaTitle="Dijital geleceğinizi birlikte şekillendirelim." /> }
