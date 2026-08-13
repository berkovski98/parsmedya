import {
  Blocks,
  Bot,
  Boxes,
  Cable,
  ChartNoAxesCombined,
  CloudCog,
  CodeXml,
  Factory,
  Network,
  PanelsTopLeft,
  RefreshCw,
  ShoppingBag,
  Smartphone,
  UsersRound,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { Service, ServiceCategory } from '@/lib/services'

interface Seed {
  title: string
  slug: string
  icon: LucideIcon
  category: ServiceCategory
  description: string
  heroTitle: string
  overview: [string, string, string]
  features: string[]
  benefits: string[]
  useCases: string[]
  related: string[]
  seoTitle: string
  seoDescription: string
  faq: [string, string][]
  featured?: boolean
}

const splitItem = (item: string) => {
  const [title, description] = item.split('|')
  return { title, description }
}

function createService(seed: Seed): Service {
  return {
    slug: seed.slug,
    icon: seed.icon,
    title: seed.title,
    description: seed.description,
    tagline: seed.heroTitle,
    intro: seed.overview[0],
    category: seed.category,
    featuredOnHome: seed.featured,
    longDescription: seed.overview,
    highlights: seed.benefits.slice(0, 3),
    stats: [
      { value: 'Uçtan uca', label: 'Analizden canlıya alma süreci' },
      { value: 'Güvenli', label: 'Rol ve veri odaklı mimari' },
      { value: 'Ölçeklenebilir', label: 'Büyümeye hazır altyapı' },
    ],
    features: seed.features.map(splitItem),
    deliverables: seed.benefits,
    benefits: seed.benefits,
    useCases: seed.useCases.map(splitItem),
    process: [
      { title: 'İhtiyaç analizi', description: `${seed.title} hedeflerini, kullanıcıları ve başarı ölçütlerini birlikte netleştiririz.` },
      { title: 'İş süreçlerinin analizi', description: 'Mevcut akışları, veri kaynaklarını, darboğazları ve entegrasyon ihtiyaçlarını haritalarız.' },
      { title: 'Teknik mimari', description: 'Güvenlik, performans, ölçeklenebilirlik ve bakım gereksinimlerine uygun mimariyi tasarlarız.' },
      { title: 'UI/UX tasarımı', description: 'Kullanıcı rollerine ve gerçek görev akışlarına göre anlaşılır ekranlar ve prototipler hazırlarız.' },
      { title: 'Yazılım geliştirme', description: 'Onaylanan kapsamı kısa iterasyonlarla geliştirir, düzenli olarak çalışan çıktılar paylaşırız.' },
      { title: 'Test ve güvenlik', description: 'Fonksiyon, yetki, veri bütünlüğü, performans ve farklı cihaz senaryolarını test ederiz.' },
      { title: 'Canlıya alma', description: 'Veri geçişi, eğitim ve yayın planını kontrollü biçimde tamamlarız.' },
      { title: 'Destek ve geliştirme', description: 'Kullanım verileri ve yeni iş ihtiyaçları doğrultusunda sistemi sürdürülebilir biçimde geliştiririz.' },
    ],
    packages: [],
    faqs: [
      ...seed.faq.map(([question, answer]) => ({ question, answer })),
      { question: `${seed.title} projesi ne kadar sürer?`, answer: 'Süre; kullanıcı rolleri, modül sayısı, entegrasyonlar ve veri geçişi kapsamına göre belirlenir. Analiz sonrasında fazlara ayrılmış gerçekçi bir takvim sunarız.' },
      { question: 'Mevcut sistemlerimizle entegre olabilir mi?', answer: 'Evet. Uygun API, web servisleri veya güvenli veri aktarım yöntemleri üzerinden mevcut uygulamalarınızla kontrollü entegrasyon kurabiliriz.' },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Cloud'],
    whyParsMedya: `Pars Medya, ${seed.title.toLocaleLowerCase('tr-TR')} projelerini yalnız teknik teslimat olarak değil, iş hedeflerini destekleyen uzun vadeli bir ürün yatırımı olarak ele alır. Analiz, kullanıcı deneyimi, güvenlik ve entegrasyon kararlarını aynı ekip içinde yönetir; şeffaf iletişim ve sürdürülebilir kod yapısıyla kurumunuzun gelişen ihtiyaçlarına uyum sağlayan çözümler üretir.`,
    relatedSlugs: seed.related,
    seoTitle: seed.seoTitle,
    seoDescription: seed.seoDescription,
  }
}

const seeds: Seed[] = [
  {
    title: 'Web Yazılım Geliştirme', slug: 'web-yazilim-gelistirme', icon: CodeXml, category: 'Web ve Dijital', featured: true,
    description: 'Tarayıcı üzerinden çalışan, çok kullanıcılı ve iş süreçlerinize özel güvenli web uygulamaları geliştiriyoruz.',
    heroTitle: 'İş süreçlerinizi güçlü web uygulamalarına dönüştürün',
    overview: [
      'Web yazılım geliştirme; yalnızca marka ve içerik sunan bir web sitesi hazırlamaktan farklı olarak kullanıcı girişi, veri yönetimi, yetkilendirme, iş kuralları ve entegrasyonlar içeren etkileşimli uygulamalar üretme sürecidir.',
      'Kurumsal yönetim panelleri, müşteri ve bayi portalları, rezervasyon sistemleri, sipariş yönetimi, iş takip platformları ve üyelik sistemleri gibi çözümleri kurumunuzun gerçek operasyonlarına göre tasarlarız.',
      'Responsive arayüz, role-based access, API bağlantıları, performans, güvenlik ve ölçeklenebilirlik kararlarını projenin başından itibaren birlikte ele alarak çok kullanıcılı uygulamanın uzun vadede sürdürülebilir kalmasını sağlarız.',
    ],
    features: ['Yönetim panelleri|Operasyon, kullanıcı ve içerik süreçlerini tek merkezden yöneten arayüzler.', 'Müşteri ve bayi portalları|Farklı kullanıcı gruplarına özel veri, belge ve işlem ekranları.', 'Rezervasyon sistemleri|Takvim, kapasite, ödeme ve bildirimlerle çalışan rezervasyon akışları.', 'Sipariş yönetimi|Siparişten teslimata durum, onay ve operasyon takibi.', 'İş takip platformları|Görev, sorumlu, termin ve ilerleme bilgilerinin merkezi yönetimi.', 'Üyelik sistemleri|Kayıt, giriş, profil, abonelik ve rol bazlı erişim.', 'API entegrasyonları|Ödeme, ERP, CRM ve üçüncü taraf servislerle güvenli veri alışverişi.', 'Responsive uygulamalar|Masaüstü, tablet ve mobilde tutarlı çalışan kullanıcı deneyimi.'],
    benefits: ['Manuel ve dağınık süreçleri tek platformda toplar', 'Kullanıcı rollerine göre güvenli erişim sağlar', 'Operasyonların anlık izlenmesini kolaylaştırır', 'Tekrarlayan veri girişini ve hata riskini azaltır', 'Yeni modül ve kullanıcılarla ölçeklenebilir', 'Kurumsal verinin kontrollü yönetilmesini sağlar'],
    useCases: ['Servis operasyonu|Saha taleplerinin, ekiplerin ve iş emirlerinin web üzerinden yönetilmesi.', 'Bayi ağı|Bayilerin sipariş, stok, kampanya ve belge süreçlerine erişmesi.', 'Rezervasyon|Şube, personel veya kaynak kapasitesine göre online randevu alınması.', 'Üyelik platformu|Farklı paket ve yetkilere sahip kullanıcıların içerik ve hizmetlere erişmesi.'],
    related: ['ozel-yazilim-gelistirme', 'api-sistem-entegrasyonlari', 'musteri-bayi-portali', 'dashboard-raporlama-sistemleri'],
    seoTitle: 'Web Yazılım Geliştirme | Kurumsal Web Uygulamaları | Pars Medya', seoDescription: 'Yönetim paneli, müşteri portalı, rezervasyon, sipariş ve iş takip süreçleri için güvenli ve ölçeklenebilir web yazılımları geliştiriyoruz.',
    faq: [['Web sitesi ile web yazılımı arasındaki fark nedir?', 'Web sitesi çoğunlukla içerik sunar; web yazılımı kullanıcı, veri, rol, iş kuralı ve entegrasyonlarla işlem gerçekleştiren dinamik bir sistemdir.'], ['Çok kullanıcılı ve yetkili yapı kurulabilir mi?', 'Evet. Her rolün görebileceği veri ve yapabileceği işlemler ayrıntılı biçimde tanımlanabilir, kritik hareketler kayıt altına alınabilir.']],
  },
  {
    title: 'Özel Yazılım Geliştirme', slug: 'ozel-yazilim-gelistirme', icon: Blocks, category: 'Kurumsal Yazılımlar', featured: true,
    description: 'Hazır paketlerin karşılamadığı süreçler için kurumunuza ve sektörünüze özel uygulamalar geliştiriyoruz.', heroTitle: 'İş modelinize uyum sağlayan özel çözümler',
    overview: ['Hazır paketler standart ihtiyaçları karşılayabilir; ancak kurumun rekabet avantajı yaratan özel iş akışları çoğu zaman bu kalıplara sığmaz. Özel geliştirme, sistemi işinize uydurur.', 'Operasyon yönetimi, şirket içi uygulamalar, sektör bazlı platformlar ve çok kullanıcılı sistemleri gerçek roller, onay mekanizmaları ve veri akışlarına göre tasarlarız.', 'Dashboard, kullanıcı yetkilendirmesi, entegrasyon ve otomasyon ihtiyaçlarını aynı mimaride birleştirerek gereksiz lisans ve manuel iş yükünü azaltan sürdürülebilir bir ürün oluştururuz.'],
    features: ['Özel iş akışları|Kuruma özgü adım, onay ve istisnaların modellenmesi.', 'Operasyon yönetimi|Günlük faaliyetlerin tek merkezden planlanması ve izlenmesi.', 'Şirket içi uygulamalar|Ekiplerin güvenli biçimde kullandığı görev ve veri ekranları.', 'Çok kullanıcılı sistemler|Rol, ekip, şube ve yetki matrisleri.', 'Dashboard|Karar vericiler için anlık performans ve durum görünümü.', 'Otomasyon|Tekrarlayan işlerin kurallara bağlı otomatik çalıştırılması.'],
    benefits: ['İşletmenizin çalışma biçimine tam uyum sağlar', 'Gereksiz modül ve lisans maliyetini azaltır', 'Operasyonel görünürlüğü artırır', 'Değişen süreçlere kontrollü biçimde uyarlanır', 'Veri tekrarını ve manuel hataları düşürür'],
    useCases: ['Üretim dışı operasyon|Tekliften teslimata özel onay ve takip akışları.', 'Sektörel platform|Standart ürünlerde bulunmayan sektöre özgü hesaplama ve kayıtlar.', 'İç talep yönetimi|Satın alma, izin, masraf veya destek taleplerinin dijitalleştirilmesi.', 'Saha yönetimi|Ekip, görev, konum ve sonuç bilgilerinin merkezle paylaşılması.'],
    related: ['web-yazilim-gelistirme', 'is-surecleri-otomasyonu', 'api-sistem-entegrasyonlari', 'dashboard-raporlama-sistemleri'], seoTitle: 'Özel Yazılım Geliştirme | Kurumsal Çözümler | Pars Medya', seoDescription: 'Hazır paketlerin yetersiz kaldığı iş akışları için kurumunuza özel, güvenli, entegre ve ölçeklenebilir yazılım çözümleri geliştiriyoruz.',
    faq: [['Hazır ürün yerine ne zaman özel geliştirme tercih edilmeli?', 'Süreçleriniz rekabet avantajı yaratıyor, çok sayıda manuel uyarlama gerektiriyor veya hazır ürünün lisans modeli sürdürülebilir değilse özel çözüm anlamlıdır.'], ['Kaynak kod ve ürün sahipliği nasıl yönetilir?', 'Teslimat, kullanım ve fikri hak kapsamını proje başlangıcında sözleşmede açık biçimde tanımlarız.']],
  },
  {
    title: 'CRM Yazılım Çözümleri', slug: 'crm-yazilim-cozumleri', icon: UsersRound, category: 'Kurumsal Yazılımlar', featured: true,
    description: 'Müşteri, lead, satış fırsatı, teklif ve görüşme süreçlerini tek platformda yöneten özel CRM çözümleri.', heroTitle: 'Müşteri ve satış süreçlerinizi tek merkezde yönetin',
    overview: ['CRM; müşteri ve firma kayıtlarından lead yönetimine, satış fırsatlarından teklif ve sipariş dönüşümüne kadar ticari ilişkinin tüm geçmişini ortak bir platformda toplar.', 'Pipeline, görevler, hatırlatmalar, görüşme kayıtları, satış ekibi performansı, raporlama ve yetkilendirme modülleri sayesinde ekipler güncel bilgiyle koordineli çalışır.', 'Hazır CRM ürünleri hızlı başlangıç sunar; şirkete özel CRM ise kurumunuzun satış terminolojisini, onaylarını, teklif yapısını ve entegrasyonlarını olduğu gibi modele taşır. Gereksiz alanlar yerine ekibinizin gerçekten kullandığı akışlara odaklanır.'],
    features: ['Müşteri ve firma kayıtları|İletişim, segment, ilişki ve hareket geçmişinin merkezi kaydı.', 'Lead yönetimi|Kaynak, durum, sorumlu ve takip adımlarının yönetimi.', 'Satış pipeline|Fırsatların aşama, tutar, olasılık ve kapanış tarihiyle izlenmesi.', 'Teklif ve sipariş|Versiyonlu tekliflerin onaylanması ve siparişe dönüştürülmesi.', 'Görev ve hatırlatmalar|Arama, toplantı ve takip işlerinin planlanması.', 'Görüşme kayıtları|E-posta, telefon ve toplantı notlarının müşteri geçmişinde tutulması.', 'Performans raporları|Ekip, kanal, ürün ve dönem bazında satış görünümü.', 'E-posta ve API|Mesajlaşma, ERP, muhasebe ve diğer sistemlerle veri bağlantısı.'],
    benefits: ['Satış fırsatlarının kaybolmasını önler', 'Müşteri geçmişini ekip için görünür kılar', 'Teklif ve takip disiplinini güçlendirir', 'Satış tahmini ve performans ölçümünü iyileştirir', 'Rol bazlı yetkilendirmeyle ticari veriyi korur', 'Tekrarlayan veri girişini entegrasyonlarla azaltır'],
    useCases: ['B2B satış|Uzun satış döngüsü ve çok paydaşlı fırsatların takibi.', 'Teklif yoğun işletme|Fiyat, revizyon, onay ve sipariş dönüşümünün yönetimi.', 'Saha satış ekibi|Ziyaret planı, görüşme notu ve takip görevlerinin paylaşılması.', 'Müşteri hizmetleri|Talep ve temas geçmişinin müşteri kaydıyla birlikte görülmesi.'],
    related: ['erp-yazilim-cozumleri', 'dashboard-raporlama-sistemleri', 'api-sistem-entegrasyonlari', 'is-surecleri-otomasyonu'], seoTitle: 'CRM Yazılım Çözümleri | Özel CRM Geliştirme | Pars Medya', seoDescription: 'İşletmenize özel CRM yazılımı ile müşteri, satış, teklif, görüşme ve operasyon süreçlerinizi tek platform üzerinden yönetin.',
    faq: [['Hazır CRM ile özel CRM arasındaki temel fark nedir?', 'Hazır CRM genel süreçlere göre şekillenir; özel CRM terminolojinizi, satış aşamalarınızı, yetkilerinizi ve mevcut sistem bağlantılarınızı doğrudan destekler.'], ['Mevcut müşteri verileri yeni CRM’e aktarılabilir mi?', 'Evet. Veri kalitesi incelendikten sonra eşleme, temizleme, deneme aktarımı ve doğrulama adımlarıyla kontrollü geçiş yapılabilir.']],
  },
  {
    title: 'ERP Yazılım Çözümleri', slug: 'erp-yazilim-cozumleri', icon: Factory, category: 'Kurumsal Yazılımlar', featured: true,
    description: 'Satış, satın alma, stok, depo, üretim ve operasyon verilerini departmanlar arasında birleştiren ERP çözümleri.', heroTitle: 'Departmanlarınızı ortak veri ve süreçlerde birleştirin',
    overview: ['ERP, satıştan satın almaya; stok ve depodan cari, tedarikçi, üretim, personel ve şube yönetimine kadar kurumun temel kaynaklarını tek sistem altında birleştirir.', 'Departmanların ayrı tablolarla çalışması yerine ortak veri modeli kurar. Bir siparişteki değişiklik ilgili stok, operasyon ve finansal veri alışverişine kontrollü biçimde yansır.', 'İşletmenizin kapsamına uygun modüler yapı, yetkilendirme, raporlama ve muhasebe veya finans sistemleriyle entegrasyon sayesinde operasyonun bütününü izlenebilir hale getirir.'],
    features: ['Satış ve sipariş|Teklif, sipariş, sevk ve durum akışlarının yönetimi.', 'Satın alma|Talep, teklif toplama, onay ve tedarik süreçleri.', 'Stok ve depo|Çoklu depo, hareket, sayım, rezervasyon ve transfer işlemleri.', 'Cari ve tedarikçi|Firma hesapları, risk ve işlem geçmişi.', 'Üretim ve operasyon|İş emri, malzeme ihtiyacı, aşama ve sonuç takibi.', 'Personel ve yetki|Rol, departman, şube ve işlem bazlı erişim.', 'Şube yönetimi|Merkezi standartlarla farklı lokasyonların takibi.', 'Finansal entegrasyon|Muhasebe ve finans uygulamalarıyla güvenli veri alışverişi.'],
    benefits: ['Departmanlar arasında tek ve güncel veri oluşturur', 'Stok ve sipariş hatalarını azaltır', 'Onay ve sorumlulukları görünür kılar', 'Operasyon maliyetlerinin izlenmesini kolaylaştırır', 'Şube ve depo performansını karşılaştırır', 'Yönetim raporlarını hızlandırır'],
    useCases: ['Dağıtım şirketi|Satın alma, çoklu depo, sipariş ve sevk akışlarının birleşmesi.', 'Üretim işletmesi|Malzeme, iş emri, operasyon ve ürün hareketlerinin izlenmesi.', 'Çok şubeli yapı|Şube satış, stok ve taleplerinin merkezi kurallarla yönetimi.', 'Proje operasyonu|Tedarik, kaynak, maliyet ve teslimat verilerinin ortaklaşması.'],
    related: ['crm-yazilim-cozumleri', 'stok-siparis-yonetim-sistemleri', 'api-sistem-entegrasyonlari', 'dashboard-raporlama-sistemleri'], seoTitle: 'ERP Yazılım Çözümleri | Kurumsal ERP Geliştirme | Pars Medya', seoDescription: 'Satış, satın alma, stok, depo ve operasyon süreçlerini işletmenize özel ERP yazılımı ile merkezi olarak yönetin.',
    faq: [['ERP tüm departmanları aynı anda mı kapsamalı?', 'Hayır. Öncelikli süreçlerle başlayıp veri modeli ve mimariyi sonraki modüllere hazır kurarak aşamalı geçiş yapılabilir.'], ['Muhasebe programımız değişmek zorunda mı?', 'Çoğu durumda hayır. Uygun bağlantı olanakları varsa ERP ile mevcut muhasebe sistemi arasında kontrollü veri alışverişi kurulabilir.']],
  },
  {
    title: 'E-Ticaret Yazılımı', slug: 'e-ticaret-yazilimi', icon: ShoppingBag, category: 'Web ve Dijital', featured: true,
    description: 'Ürün, fiyat, kampanya, ödeme, kargo ve operasyon süreçlerinize özel e-ticaret altyapıları.', heroTitle: 'Satış modelinize göre şekillenen e-ticaret altyapısı',
    overview: ['E-ticaret yazılımını yalnız vitrin ve sepetten ibaret görmeyiz; ürün verisi, fiyat kuralları, stok, sipariş, ödeme, kargo ve müşteri hizmetleri aynı operasyonun parçalarıdır.', 'B2C, B2B veya hibrit satış modelinize göre katalog, üyelik, kampanya ve checkout deneyimini özelleştiririz.', 'ERP, CRM, pazaryeri ve kargo entegrasyonlarıyla siparişin arka ofise doğru ve hızlı akmasını sağlayan performanslı bir altyapı kurarız.'],
    features: ['Ürün ve varyant|Katalog, kategori, özellik ve varyant yönetimi.', 'Fiyat ve kampanya|Segment, kupon, iskonto ve dönemsel fiyat kuralları.', 'Ödeme|Kart, havale ve uygun ödeme sağlayıcılarıyla güvenli checkout.', 'Stok ve sipariş|Rezervasyon, durum, iptal, iade ve operasyon takibi.', 'Kargo|Firma seçimi, etiket, takip kodu ve teslimat akışı.', 'Pazaryeri|Ürün, stok ve sipariş bilgilerinin senkronizasyonu.'],
    benefits: ['Satış modeline özel müşteri deneyimi sunar', 'Sipariş operasyonunu otomatikleştirir', 'Stok tutarsızlığını azaltır', 'Kampanya ve fiyat yönetimini merkezileştirir', 'Yeni kanal ve entegrasyonlara hazırdır'],
    useCases: ['D2C marka|Markanın doğrudan tüketiciye kontrollü deneyimle satış yapması.', 'B2B sipariş|Müşteriye özel fiyat, limit ve onaylarla toplu sipariş.', 'Çok kanallı satış|Web ve pazaryeri stoklarının ortak yönetimi.', 'Abonelik|Belirli dönemlerde tekrarlanan ürün veya hizmet tahsilatı.'],
    related: ['b2b-b2c-platform-gelistirme', 'stok-siparis-yonetim-sistemleri', 'api-sistem-entegrasyonlari', 'crm-yazilim-cozumleri'], seoTitle: 'E-Ticaret Yazılımı | Özel E-Ticaret Altyapısı | Pars Medya', seoDescription: 'Ürün, stok, sipariş, ödeme, kargo ve pazaryeri süreçlerinize uygun performanslı e-ticaret yazılımı geliştirin.',
    faq: [['Hazır e-ticaret paketi yerine özel altyapı ne zaman gerekir?', 'Özel fiyat, yoğun entegrasyon, farklı sipariş akışı veya standart paketlerin kısıtladığı müşteri deneyimi varsa özel altyapı değerlendirilebilir.'], ['Pazaryeri ve kargo entegrasyonları yapılabilir mi?', 'Evet. İlgili sağlayıcıların API olanaklarına göre ürün, stok, sipariş, etiket ve takip süreçleri entegre edilebilir.']],
  },
  {
    title: 'Kurumsal Web Uygulamaları', slug: 'kurumsal-web-uygulamalari', icon: PanelsTopLeft, category: 'Web ve Dijital',
    description: 'Ekiplerin güvenli biçimde kullandığı intranet, operasyon ve self-servis web uygulamaları.', heroTitle: 'Kurum içi süreçlere her yerden güvenli erişim',
    overview: ['Kurumsal web uygulamaları çalışanların, yöneticilerin ve iş ortaklarının tarayıcı üzerinden ortak süreçlere erişmesini sağlar.', 'İntranet, talep yönetimi, belge akışı, görev ve self-servis ekranlarını kullanıcı rollerine göre tasarlarız.', 'Merkezi kimlik, kayıt izleri, responsive kullanım ve mevcut sistem entegrasyonlarıyla yönetilebilir bir dijital çalışma ortamı oluştururuz.'],
    features: ['İntranet|Duyuru, belge ve kurum içi kaynakların merkezi erişimi.', 'Talep yönetimi|İzin, satın alma, destek ve operasyon talepleri.', 'Belge akışı|Versiyon, onay ve erişim kuralları.', 'Self-servis ekranlar|Kullanıcının kendi bilgi ve taleplerini yönetmesi.', 'Rol bazlı erişim|Departman ve görev bazında güvenli yetkilendirme.', 'İşlem kayıtları|Kritik hareketlerin izlenebilirliği.'],
    benefits: ['Kurum içi bilgiye erişimi kolaylaştırır', 'E-posta ile yürüyen süreçleri azaltır', 'Onay sürelerini kısaltır', 'Yetki ve sorumlulukları netleştirir', 'Uzaktan ve mobil çalışmayı destekler'],
    useCases: ['Çalışan portalı|Belge, duyuru, izin ve bordro erişimi.', 'İç destek|BT ve operasyon taleplerinin SLA ile takibi.', 'Kalite yönetimi|Prosedür, revizyon ve onay süreçleri.', 'Proje ofisi|Portföy, görev, risk ve karar kayıtlarının yönetimi.'],
    related: ['web-yazilim-gelistirme', 'ozel-yazilim-gelistirme', 'is-surecleri-otomasyonu'], seoTitle: 'Kurumsal Web Uygulamaları | İntranet ve Portallar | Pars Medya', seoDescription: 'İntranet, talep, belge, görev ve self-servis süreçleri için güvenli ve responsive kurumsal web uygulamaları geliştiriyoruz.',
    faq: [['Uygulama şirket ağıyla sınırlandırılabilir mi?', 'Evet. Kimlik sağlayıcı, VPN, IP politikası veya çok faktörlü doğrulama gibi seçenekler kurumun güvenlik yaklaşımına göre değerlendirilebilir.'], ['Mobil cihazlarda kullanılabilir mi?', 'Responsive arayüz sayesinde uygun iş akışları telefon ve tabletlerden güvenli biçimde kullanılabilir.']],
  },
  {
    title: 'Mobil Uygulama Geliştirme', slug: 'mobil-uygulama-gelistirme', icon: Smartphone, category: 'Web ve Dijital',
    description: 'Müşteri, çalışan ve saha ekipleri için iOS ve Android mobil uygulamaları.', heroTitle: 'İş süreçlerinizi kullanıcıların cebine taşıyın',
    overview: ['Mobil uygulamalar müşterilere, çalışanlara veya saha ekiplerine ihtiyaç duydukları işlemi doğru anda sunar.', 'Kullanıcı akışını, çevrimdışı ihtiyaçları, bildirimleri ve cihaz özelliklerini ürün hedefleriyle birlikte değerlendiririz.', 'Backend, yönetim paneli, analitik ve mağaza yayın süreçlerini uçtan uca ele alırız.'],
    features: ['iOS ve Android|Platformlara uygun tutarlı deneyim.', 'Push bildirimleri|İşlem ve iletişim odaklı bildirim akışları.', 'Çevrimdışı kullanım|Uygun verilerin bağlantısız senaryolarda yönetimi.', 'Konum ve kamera|Saha süreçlerinde cihaz yeteneklerinin kullanımı.', 'Güvenli oturum|Kimlik, token ve cihaz bazlı koruma.', 'Yönetim paneli|İçerik, kullanıcı ve operasyon kontrolü.'],
    benefits: ['Hizmete erişimi hızlandırır', 'Saha verisini kaynağında toplar', 'Müşteri bağlılığını destekler', 'Bildirimlerle zamanında iletişim kurar', 'Web ve kurumsal sistemlerle bütünleşir'],
    useCases: ['Saha servis|Görev, konum, fotoğraf ve sonuç kaydı.', 'Müşteri uygulaması|Sipariş, talep, sadakat ve bildirim işlemleri.', 'Ekip uygulaması|Vardiya, görev ve kurum içi iletişim.', 'Rezervasyon|Mobil randevu, ödeme ve hatırlatma.'],
    related: ['web-yazilim-gelistirme', 'api-sistem-entegrasyonlari', 'crm-yazilim-cozumleri'], seoTitle: 'Mobil Uygulama Geliştirme | iOS ve Android | Pars Medya', seoDescription: 'Müşteri, çalışan ve saha süreçleri için güvenli, entegre ve kullanıcı odaklı iOS ve Android uygulamaları geliştiriyoruz.',
    faq: [['Native mi çapraz platform mu tercih edilmeli?', 'Karar; cihaz yetenekleri, performans beklentisi, ekip ve ürün yol haritasına göre verilir. Analiz sonucunda uygun yaklaşımı öneririz.'], ['Mağaza yayın sürecini yönetiyor musunuz?', 'Evet. Hesap hazırlığı, paketleme, test ve mağaza inceleme adımlarında destek sağlarız.']],
  },
  {
    title: 'API ve Sistem Entegrasyonları', slug: 'api-sistem-entegrasyonlari', icon: Cable, category: 'Platform ve Entegrasyon',
    description: 'ERP, CRM, ödeme, muhasebe, kargo ve üçüncü taraf sistemler arasında güvenli veri akışı.', heroTitle: 'Sistemleriniz konuşsun, veri akışınız otomatikleşsin',
    overview: ['Entegrasyonlar farklı uygulamalarda tekrar girilen veriyi azaltır ve süreçlerin olaylara göre otomatik ilerlemesini sağlar.', 'Ödeme, ERP, CRM, muhasebe, SMS, e-posta, kargo, pazaryeri, banka, harita ve diğer üçüncü taraf API’lerle güvenli bağlantılar kurarız.', 'Hata yönetimi, tekrar deneme, kayıt izleri ve veri eşleme kurallarıyla entegrasyonun operasyon içinde güvenilir çalışmasını sağlarız.'],
    features: ['Ödeme sistemleri|Tahsilat, iade ve durum bildirimlerinin bağlantısı.', 'ERP ve CRM|Müşteri, ürün, teklif ve sipariş senkronizasyonu.', 'Muhasebe|Fiş, fatura ve cari veri alışverişi.', 'SMS ve e-posta|İşleme bağlı otomatik bildirimler.', 'Kargo ve pazaryeri|Sipariş, stok, etiket ve takip akışları.', 'Banka ve harita|Finansal veya konum servislerinin sisteme bağlanması.'],
    benefits: ['Tekrarlayan veri girişini azaltır', 'Sistemler arası tutarlılığı artırır', 'İşlem sürelerini kısaltır', 'Entegrasyon hatalarını görünür kılar', 'Yeni servislerin eklenmesini kolaylaştırır'],
    useCases: ['Sipariş akışı|E-ticaretten ERP’ye, depoya ve kargoya otomatik veri aktarımı.', 'Müşteri senkronu|CRM ve muhasebe arasında firma bilgilerinin eşlenmesi.', 'Ödeme bildirimi|Başarılı tahsilatın üyelik veya sipariş durumunu güncellemesi.', 'Pazaryeri|Stok ve fiyat değişikliklerinin kanallara dağıtılması.'],
    related: ['erp-yazilim-cozumleri', 'crm-yazilim-cozumleri', 'is-surecleri-otomasyonu', 'e-ticaret-yazilimi'], seoTitle: 'API ve Sistem Entegrasyonları | Pars Medya', seoDescription: 'ERP, CRM, muhasebe, ödeme, kargo, pazaryeri ve üçüncü taraf sistemler arasında güvenli ve otomatik veri akışı kurun.',
    faq: [['API’si olmayan eski sistemler entegre edilebilir mi?', 'Veritabanı, dosya aktarımı veya sağlayıcının sunduğu diğer yöntemler güvenlik ve veri bütünlüğü açısından incelenerek uygun çözüm belirlenir.'], ['Entegrasyon hataları nasıl takip edilir?', 'İşlem kayıtları, hata kuyrukları, tekrar deneme kuralları ve uyarılarla başarısız akışlar görünür ve yönetilebilir hale getirilir.']],
  },
  {
    title: 'İş Süreçleri Otomasyonu', slug: 'is-surecleri-otomasyonu', icon: Workflow, category: 'Kurumsal Yazılımlar',
    description: 'Tekrarlayan görevleri, onayları ve sistemler arası işlemleri kurallarla otomatikleştiriyoruz.', heroTitle: 'Tekrarlayan işleri azaltın, ekibinizi değer üreten işe odaklayın',
    overview: ['İş süreçleri otomasyonu, belirli kurallarla tekrarlanan görevlerin insan müdahalesini azaltacak biçimde dijitalleştirilmesidir.', 'Talep, onay, bildirim, belge üretimi ve veri aktarımı adımlarını süreç sahipleriyle birlikte modelleriz.', 'İstisnaları ve kontrol noktalarını koruyarak hız, izlenebilirlik ve tutarlılık sağlayan akışlar geliştiririz.'],
    features: ['Onay akışları|Tutar, departman ve role göre dinamik onaylar.', 'Görev atama|Koşullara göre sorumlu ve termin oluşturma.', 'Bildirim|E-posta, SMS veya uygulama içi uyarılar.', 'Belge üretimi|Şablondan teklif, rapor veya form oluşturma.', 'Veri aktarımı|Sistemler arasında kurala bağlı senkronizasyon.', 'İstisna yönetimi|Otomasyona uymayan durumların insana yönlendirilmesi.'],
    benefits: ['İşlem sürelerini kısaltır', 'Manuel hata ve unutmayı azaltır', 'Süreç performansını ölçülebilir yapar', 'Standart çalışma biçimi oluşturur', 'Denetim izi sağlar'],
    useCases: ['Satın alma talebi|Bütçe ve tutara göre onay zinciri.', 'Müşteri onboarding|Kayıt, belge, görev ve bilgilendirme adımları.', 'Fatura işleme|Belge kontrolü, eşleme ve onay yönlendirmesi.', 'Çalışan süreci|İşe giriş veya ayrılış görevlerinin koordinasyonu.'],
    related: ['ozel-yazilim-gelistirme', 'api-sistem-entegrasyonlari', 'yapay-zeka-destekli-yazilim'], seoTitle: 'İş Süreçleri Otomasyonu | Dijital İş Akışları | Pars Medya', seoDescription: 'Onay, görev, bildirim, belge ve veri aktarımı süreçlerini güvenli iş akışlarıyla otomatikleştirin.',
    faq: [['Hangi süreçler otomasyona uygundur?', 'Tekrarlanan, kuralları belirli, ölçülebilir girdisi ve çıktısı olan süreçler iyi adaylardır. Önce değer ve risk analizi yaparız.'], ['İnsan onayı tamamen kaldırılır mı?', 'Hayır. Riskli, istisnai veya karar gerektiren adımlarda insan kontrolü korunabilir.']],
  },
  {
    title: 'B2B ve B2C Platform Geliştirme', slug: 'b2b-b2c-platform-gelistirme', icon: Network, category: 'Platform ve Entegrasyon',
    description: 'Tedarikçi, bayi, müşteri ve son kullanıcıları ortak işlem akışlarında buluşturan platformlar.', heroTitle: 'İş ekosisteminizi ölçeklenebilir bir platformda birleştirin',
    overview: ['B2B ve B2C platformlar farklı kullanıcı gruplarını ürün, hizmet, içerik veya işlem etrafında buluşturur.', 'Katalog, fiyat, üyelik, sipariş, talep ve komisyon kurallarını her kullanıcı segmentine göre tasarlarız.', 'Çok taraflı yapının güvenlik, performans, ödeme ve entegrasyon ihtiyaçlarını ölçeklenebilir mimariyle yönetiriz.'],
    features: ['Kullanıcı segmentleri|Kurumsal ve bireysel rollere özel deneyim.', 'Özel fiyat ve katalog|Müşteri, bayi veya bölge bazlı kurallar.', 'Sipariş ve talep|Farklı satış ve hizmet akışları.', 'Komisyon|Platform veya iş ortağı paylarının hesaplanması.', 'Ödeme|Tekli veya çok taraflı tahsilat senaryoları.', 'Entegrasyon|ERP, CRM, lojistik ve diğer servis bağlantıları.'],
    benefits: ['Yeni dijital satış kanalı oluşturur', 'İş ortaklarıyla süreci standartlaştırır', 'Farklı segmentlere özel deneyim sunar', 'Operasyon verisini merkezileştirir', 'Yeni pazar ve kullanıcılarla ölçeklenir'],
    useCases: ['Bayi sipariş platformu|Özel fiyat ve stokla kurumsal sipariş.', 'Hizmet pazaryeri|Talep ve sağlayıcı eşleştirmesi.', 'Tedarik portalı|Teklif, sipariş ve teslimat iş birliği.', 'B2C üyelik|İçerik, hizmet veya avantaj paketleri.'],
    related: ['e-ticaret-yazilimi', 'musteri-bayi-portali', 'saas-yazilim-gelistirme'], seoTitle: 'B2B ve B2C Platform Geliştirme | Pars Medya', seoDescription: 'Bayi, tedarikçi, müşteri ve son kullanıcıları güvenli, entegre ve ölçeklenebilir B2B/B2C platformlarda buluşturun.',
    faq: [['B2B ve B2C aynı altyapıda çalışabilir mi?', 'Ortak ürün ve operasyon verisi korunurken fiyat, ödeme, kayıt ve deneyim kuralları kullanıcı tipine göre ayrıştırılabilir.'], ['Platform yüksek kullanıcı sayısına hazırlanabilir mi?', 'Mimari kapasite hedefleri, önbellek, kuyruk ve gözlemleme ihtiyaçları başlangıçta planlanarak kademeli ölçekleme sağlanır.']],
  },
  {
    title: 'SaaS Yazılım Geliştirme', slug: 'saas-yazilim-gelistirme', icon: CloudCog, category: 'Platform ve Entegrasyon',
    description: 'Abonelik, paket, tenant, rol ve kullanım limitleriyle çalışan ölçeklenebilir SaaS ürünleri.', heroTitle: 'Fikrinizi ölçeklenebilir bir SaaS ürününe dönüştürün',
    overview: ['SaaS ürünleri birden fazla müşteriye internet üzerinden hizmet sunarken her kurumun verisini ve ayarlarını güvenli biçimde ayırır.', 'Multi-tenant mimari, abonelik, kullanıcı yönetimi, paketler, ödeme, rol ve yetkiler ile kullanım limitlerini ürün modeliyle birlikte tasarlarız.', 'Dashboard, bildirim, onboarding ve operasyon araçlarıyla yalnız uygulamayı değil, yönetilebilir bir dijital ürünü hayata geçiririz.'],
    features: ['Multi-tenant mimari|Müşteri verisi ve ayarlarının güvenli ayrımı.', 'Abonelik ve paketler|Plan, dönem, yükseltme ve iptal akışları.', 'Ödeme entegrasyonu|Tahsilat ve abonelik durumunun yönetimi.', 'Kullanıcı ve roller|Tenant içinde ekip ve yetki yönetimi.', 'Kullanım limitleri|Paket bazlı özellik ve kota kontrolü.', 'Dashboard ve bildirim|Ürün kullanımını yöneten merkezi ekranlar.'],
    benefits: ['Tek ürünle çok müşteriye hizmet verir', 'Tekrarlanabilir gelir modelini destekler', 'Tenant bazlı güvenli veri ayrımı sağlar', 'Paket ve kullanım yönetimini otomatikleştirir', 'Yeni müşteri ve özelliklerle ölçeklenir'],
    useCases: ['Dikey SaaS|Belirli sektörün ortak problemini çözen abonelik ürünü.', 'Raporlama servisi|Müşteri verilerinden düzenli dashboard ve çıktı.', 'Operasyon ürünü|Ekiplerin görev ve süreç yönettiği çok kiracılı platform.', 'API ürünü|Kullanım kotası ve anahtar yönetimiyle sunulan servis.'],
    related: ['b2b-b2c-platform-gelistirme', 'api-sistem-entegrasyonlari', 'dashboard-raporlama-sistemleri'], seoTitle: 'SaaS Yazılım Geliştirme | Multi-Tenant Ürünler | Pars Medya', seoDescription: 'Multi-tenant mimari, abonelik, ödeme, kullanıcı, rol, paket ve kullanım limitleriyle ölçeklenebilir SaaS ürünleri geliştiriyoruz.',
    faq: [['Multi-tenant mimari neden önemlidir?', 'Müşterilerin veri ve ayarlarını güvenli biçimde ayırırken ortak altyapının verimli yönetilmesini sağlar.'], ['Abonelik ve ödeme yönetimi dahil mi?', 'Uygun ödeme sağlayıcısıyla plan, tahsilat, yenileme ve durum bildirimleri ürün akışına entegre edilebilir.']],
  },
  {
    title: 'Dashboard ve Raporlama Sistemleri', slug: 'dashboard-raporlama-sistemleri', icon: ChartNoAxesCombined, category: 'Platform ve Entegrasyon',
    description: 'Farklı kaynaklardaki verileri karar verilebilir KPI ve raporlara dönüştüren yönetim ekranları.', heroTitle: 'Verinizi anlaşılır ve eyleme dönük hale getirin',
    overview: ['Dashboard sistemleri farklı kaynaklardaki operasyon ve performans verisini ortak göstergelerde birleştirir.', 'KPI tanımları, filtreler, rol bazlı görünüm, dönem karşılaştırmaları ve dışa aktarımları karar süreçlerine göre tasarlarız.', 'Verinin güncelliğini ve anlamını koruyan entegrasyonlarla manuel rapor hazırlama yükünü azaltırız.'],
    features: ['KPI kartları|Önemli göstergelerin anlık özeti.', 'Grafik ve tablolar|Trendi ve dağılımı açıklayan görünümler.', 'Filtre ve segment|Dönem, şube, ekip veya ürün bazlı analiz.', 'Rol bazlı rapor|Her kullanıcının yetkili olduğu veriye erişmesi.', 'Dışa aktarım|Planlı veya isteğe bağlı rapor çıktıları.', 'Veri entegrasyonu|ERP, CRM ve diğer kaynaklardan beslenme.'],
    benefits: ['Rapor hazırlama süresini azaltır', 'Tek KPI tanımı oluşturur', 'Sorun ve fırsatları erken görünür kılar', 'Departmanlar arası karşılaştırma sağlar', 'Kararları güncel veriye dayandırır'],
    useCases: ['Satış yönetimi|Pipeline, hedef ve gerçekleşen performansı.', 'Operasyon|Sipariş, termin, kapasite ve hata takibi.', 'Finans görünümü|Gelir, maliyet ve tahsilat göstergeleri.', 'Müşteri hizmetleri|Talep hacmi, süre ve memnuniyet eğilimleri.'],
    related: ['crm-yazilim-cozumleri', 'erp-yazilim-cozumleri', 'api-sistem-entegrasyonlari'], seoTitle: 'Dashboard ve Raporlama Sistemleri | Pars Medya', seoDescription: 'ERP, CRM ve operasyon verilerinizi rol bazlı dashboard, KPI ve yönetim raporlarına dönüştürün.',
    faq: [['Veriler gerçek zamanlı gösterilebilir mi?', 'Kaynak sistemin yetenekleri ve iş ihtiyacına göre gerçek zamanlı, yakın gerçek zamanlı veya planlı güncelleme kullanılabilir.'], ['Excel raporları sisteme taşınabilir mi?', 'Evet. Mevcut raporların hesaplama ve veri kaynakları incelenerek merkezi ve tekrarlanabilir yapıya dönüştürülebilir.']],
  },
  {
    title: 'Müşteri ve Bayi Portalı Geliştirme', slug: 'musteri-bayi-portali', icon: PanelsTopLeft, category: 'Kurumsal Yazılımlar',
    description: 'Müşteri ve bayilerin sipariş, talep, belge ve hesap süreçlerini self-servis yönetebildiği portallar.', heroTitle: 'Müşteri ve bayilerinize güvenli self-servis deneyim sunun',
    overview: ['Portal çözümleri müşterilerin ve bayilerin ihtiyaç duydukları bilgi ve işlemlere kurumunuzun kurallarıyla erişmesini sağlar.', 'Sipariş, stok, fiyat, teklif, talep, belge ve hesap ekranlarını kullanıcı segmentlerine göre düzenleriz.', 'ERP ve CRM entegrasyonlarıyla portal bilgisinin iç sistemlerle tutarlı kalmasını sağlarız.'],
    features: ['Hesap ve yetki|Firma, kullanıcı ve rol yönetimi.', 'Özel fiyat|Müşteri veya bayi bazlı fiyat ve iskonto.', 'Sipariş|Sepet, onay, geçmiş ve durum takibi.', 'Talep|Destek, iade ve operasyon talepleri.', 'Belge|Fatura, sözleşme ve teknik doküman erişimi.', 'Entegrasyon|ERP, CRM ve lojistik veri bağlantısı.'],
    benefits: ['Telefon ve e-posta trafiğini azaltır', '7/24 işlem erişimi sağlar', 'Bayi operasyonunu standartlaştırır', 'Müşteri deneyimini iyileştirir', 'İç sistemlerle veri tutarlılığı sağlar'],
    useCases: ['Bayi siparişi|Özel fiyat ve limitlerle sipariş oluşturma.', 'Müşteri destek|Talep açma, belge ekleme ve durum izleme.', 'Doküman merkezi|Güncel sözleşme, katalog ve fatura paylaşımı.', 'Servis portalı|Cihaz, bakım ve iş emri geçmişine erişim.'],
    related: ['b2b-b2c-platform-gelistirme', 'crm-yazilim-cozumleri', 'erp-yazilim-cozumleri'], seoTitle: 'Müşteri ve Bayi Portalı Geliştirme | Pars Medya', seoDescription: 'Sipariş, fiyat, talep, belge ve hesap süreçleri için ERP ve CRM entegre müşteri ve bayi portalları geliştirin.',
    faq: [['Her bayi farklı fiyat görebilir mi?', 'Evet. Firma, grup, sözleşme veya kampanya bazlı fiyat ve iskonto kuralları uygulanabilir.'], ['Portal verileri ERP’den gelebilir mi?', 'Uygun entegrasyonla ürün, stok, fiyat, sipariş ve belge verileri ERP ile senkron tutulabilir.']],
  },
  {
    title: 'Stok ve Sipariş Yönetim Sistemleri', slug: 'stok-siparis-yonetim-sistemleri', icon: Boxes, category: 'Kurumsal Yazılımlar',
    description: 'Çoklu depo, stok hareketi, sipariş, rezervasyon ve sevk süreçlerini izlenebilir hale getiren sistemler.', heroTitle: 'Stok ve sipariş akışınızı uçtan uca kontrol edin',
    overview: ['Stok ve sipariş sistemleri ürünün girişinden rezervasyon, toplama, sevk ve iadeye kadar hareketlerini izler.', 'Çoklu depo, transfer, sayım, kritik seviye ve seri veya lot gibi ihtiyaçları operasyon yapınıza göre modelleriz.', 'Satış kanalları, ERP, kargo ve muhasebe bağlantılarıyla güncel stok bilgisinin tüm süreçlere ulaşmasını sağlarız.'],
    features: ['Çoklu depo|Lokasyon bazlı stok ve transfer.', 'Stok hareketleri|Giriş, çıkış, düzeltme ve iz kaydı.', 'Sipariş akışı|Onay, rezervasyon, toplama ve sevk.', 'Sayım|Planlı sayım ve fark yönetimi.', 'Kritik seviye|Minimum stok ve tedarik uyarıları.', 'İade|Müşteri ve tedarikçi iade süreçleri.'],
    benefits: ['Stok doğruluğunu artırır', 'Eksik ve fazla stok riskini azaltır', 'Sipariş durumunu görünür kılar', 'Depo hareketlerini izlenebilir yapar', 'Satış kanallarında tutarlılık sağlar'],
    useCases: ['E-ticaret deposu|Çok kanallı sipariş ve stok rezervasyonu.', 'Dağıtım|Depolar arası transfer ve sevkiyat planı.', 'Servis yedek parça|Araç, teknisyen ve merkez stoklarının takibi.', 'Üretim malzemesi|Hammadde giriş, tüketim ve ihtiyaç görünümü.'],
    related: ['erp-yazilim-cozumleri', 'e-ticaret-yazilimi', 'api-sistem-entegrasyonlari'], seoTitle: 'Stok ve Sipariş Yönetim Sistemleri | Pars Medya', seoDescription: 'Çoklu depo, stok hareketi, sipariş, rezervasyon, sayım, sevk ve iade süreçlerini tek sistemde yönetin.',
    faq: [['Barkod veya seri numarası desteklenebilir mi?', 'İş modeline göre barkod, seri veya lot bazlı izleme ve okutma akışları sisteme eklenebilir.'], ['Birden fazla satış kanalının stoğu yönetilebilir mi?', 'Entegrasyon olanaklarına göre kanallardaki stok ve sipariş bilgileri merkezi sisteme bağlanabilir.']],
  },
  {
    title: 'Yapay Zeka Destekli Yazılım Çözümleri', slug: 'yapay-zeka-destekli-yazilim', icon: Bot, category: 'Yeni Teknolojiler', featured: true,
    description: 'Doküman, arama, sınıflandırma, özetleme ve destek süreçlerine kontrollü yapay zeka yetenekleri ekliyoruz.', heroTitle: 'Yapay zekayı gerçek iş süreçlerine kontrollü biçimde uyarlayın',
    overview: ['Yapay zeka, doğru problem ve veriyle eşleştirildiğinde bilgiye erişimi hızlandırabilir ve yoğun içerik işlemlerini destekleyebilir.', 'Doküman analizi, sınıflandırma, chatbot, müşteri hizmetleri, veri özetleme, akıllı arama ve kurum içi bilgi asistanları gibi kullanım alanlarını süreç ve risk analiziyle ele alırız.', 'İnsan kontrolü, kaynak gösterimi, erişim yetkisi ve çıktı kalitesi sınırlarını tanımlayarak doğrulanamayacak başarı iddiaları yerine ölçülebilir iş hedeflerine odaklanırız.'],
    features: ['Doküman analizi|Belge içeriğinin çıkarılması ve yapılandırılması.', 'Sınıflandırma|Talep veya içeriğin uygun kategoriye yönlendirilmesi.', 'Chatbot|Tanımlı bilgi ve işlem alanlarında kullanıcı desteği.', 'Özetleme|Uzun metin ve kayıtların kısa çalışma özetleri.', 'Akıllı arama|Anlama dayalı kurum içi bilgi erişimi.', 'İş akışı desteği|İçerik işleme sonucunun süreçlere aktarılması.'],
    benefits: ['Yoğun içerik işlemlerini hızlandırır', 'Bilgiye erişim süresini azaltır', 'Tekrarlayan sınıflandırmayı destekler', 'Müşteri hizmetlerine yardımcı olur', 'İnsan kararına düzenli girdi sağlar'],
    useCases: ['Bilgi asistanı|Yetkili kurum dokümanlarında soru-cevap.', 'Destek sınıflandırma|Taleplerin konu ve önceliğe göre yönlendirilmesi.', 'Doküman özeti|Sözleşme, rapor veya görüşme kayıtlarının özetlenmesi.', 'Akıllı arama|Ürün, prosedür veya vaka bilgisinin anlamla bulunması.'],
    related: ['is-surecleri-otomasyonu', 'ozel-yazilim-gelistirme', 'dashboard-raporlama-sistemleri'], seoTitle: 'Yapay Zeka Destekli Yazılım Çözümleri | Pars Medya', seoDescription: 'Doküman analizi, chatbot, sınıflandırma, özetleme, akıllı arama ve kurum içi bilgi asistanlarını iş süreçlerinize uyarlayın.',
    faq: [['Yapay zeka çıktıları her zaman doğru mudur?', 'Hayır. Kullanım alanına göre kaynak gösterimi, doğrulama, insan onayı ve kalite eşikleri tasarlanmalıdır.'], ['Kurum verileri nasıl korunur?', 'Veri sınıflandırması, yetkilendirme, sağlayıcı koşulları ve saklama politikaları proje öncesinde değerlendirilir; hassas veri için uygun mimari seçilir.']],
  },
  {
    title: 'Mevcut Yazılım Modernizasyonu', slug: 'yazilim-modernizasyonu', icon: RefreshCw, category: 'Yeni Teknolojiler',
    description: 'Eski, yavaş veya bakımı zor sistemleri kontrollü biçimde güncel ve sürdürülebilir mimariye taşıyoruz.', heroTitle: 'Mevcut yatırımınızı koruyarak teknoloji borcunu azaltın',
    overview: ['Modernizasyon, çalışan sistemi bir anda değiştirmek yerine riskleri, bağımlılıkları ve iş önceliklerini analiz ederek kademeli iyileştirme yapar.', 'Kod, veritabanı, arayüz, güvenlik, performans ve deployment yapısını inceleyerek yeniden yazma, parçalara ayırma veya kontrollü geçiş seçeneklerini değerlendiririz.', 'İş sürekliliğini koruyan fazlar, test ve geri dönüş planlarıyla bakım maliyetini azaltan güncel bir temel oluştururuz.'],
    features: ['Teknik denetim|Kod, bağımlılık, güvenlik ve performans analizi.', 'Mimari dönüşüm|Monolitin modüler veya servis tabanlı yapıya hazırlanması.', 'Arayüz yenileme|Mevcut işlevleri koruyan modern kullanıcı deneyimi.', 'Veri geçişi|Şema, kalite ve bütünlük kontrolleriyle taşıma.', 'Cloud hazırlığı|Dağıtım, izleme ve ölçekleme altyapısı.', 'Test otomasyonu|Kritik işlevlerin değişikliklere karşı korunması.'],
    benefits: ['Bakım ve geliştirme hızını artırır', 'Güvenlik risklerini azaltır', 'Performans ve kullanılabilirliği iyileştirir', 'Yeni entegrasyonlara zemin hazırlar', 'Kontrollü geçişle iş sürekliliğini korur'],
    useCases: ['Eski intranet|Güncel tarayıcı ve mobil uyumlu arayüze geçiş.', 'Monolit uygulama|Kritik modüllerin aşamalı ayrıştırılması.', 'Eski veritabanı|Veri modeli ve sorguların iyileştirilmesi.', 'Manuel deployment|CI/CD, test ve gözlemleme altyapısının kurulması.'],
    related: ['ozel-yazilim-gelistirme', 'api-sistem-entegrasyonlari', 'kurumsal-web-uygulamalari'], seoTitle: 'Mevcut Yazılım Modernizasyonu | Pars Medya', seoDescription: 'Eski ve bakımı zor uygulamalarınızı iş sürekliliğini koruyarak güvenli, performanslı ve sürdürülebilir mimariye taşıyın.',
    faq: [['Modernizasyon için sistemi tamamen yeniden yazmak gerekir mi?', 'Her zaman değil. Teknik analiz sonucunda iyileştirme, modülerleştirme, kademeli yenileme veya yeniden yazma seçenekleri karşılaştırılır.'], ['Geçiş sırasında mevcut sistem çalışmaya devam eder mi?', 'Fazlı geçiş, paralel çalışma ve geri dönüş planlarıyla kesinti riski mümkün olduğunca azaltılır.']],
  },
]

export const softwareServices: Service[] = seeds.map(createService)
