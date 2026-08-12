import {
  Code2,
  Smartphone,
  ShoppingCart,
  Search,
  PenTool,
  ServerCog,
  type LucideIcon,
} from 'lucide-react'

export interface Service {
  slug: string
  icon: LucideIcon
  title: string
  description: string
  tagline: string
  intro: string
  highlights: string[]
  stats: { value: string; label: string }[]
  features: { title: string; description: string }[]
  deliverables: string[]
  process: { title: string; description: string }[]
  packages: {
    name: string
    price: string
    description: string
    features: string[]
    featured?: boolean
  }[]
  faqs: { question: string; answer: string }[]
  technologies: string[]
}

export const services: Service[] = [
  {
    slug: 'web-sitesi-gelistirme',
    icon: Code2,
    title: 'Web Sitesi Geliştirme',
    description:
      'Kurumsal, hızlı ve SEO uyumlu web siteleri. Modern teknolojilerle ölçeklenebilir çözümler.',
    tagline: 'Markanızı en iyi yansıtan dijital vitrin',
    intro:
      'Kurumsal kimliğinizi güçlü şekilde yansıtan, hızlı yüklenen ve arama motorlarıyla uyumlu web siteleri geliştiriyoruz. Modern teknolojilerle kurulan altyapı sayesinde siteniz büyüdükçe sorunsuz ölçeklenir.',
    highlights: [
      'Ortalama 1 saniyenin altında açılış süresi',
      'Mobil öncelikli, tamamen responsive tasarım',
      'Google Core Web Vitals uyumlu altyapı',
    ],
    stats: [
      { value: '90+', label: 'Yayınlanan web projesi' },
      { value: '1.2sn', label: 'Ortalama yüklenme süresi' },
      { value: '%99.9', label: 'Kesintisiz çalışma oranı' },
    ],
    features: [
      {
        title: 'Kurumsal Web Siteleri',
        description:
          'Marka kimliğinize uygun, güven veren ve profesyonel tasarımlar.',
      },
      {
        title: 'Yüksek Performans',
        description:
          'Saniyeler içinde açılan, Core Web Vitals değerleri optimize edilmiş siteler.',
      },
      {
        title: 'SEO Uyumlu Altyapı',
        description:
          'Arama motorlarında görünürlüğü artıran teknik SEO temelleri.',
      },
      {
        title: 'Yönetim Paneli',
        description:
          'İçeriğinizi kolayca güncelleyebileceğiniz kullanıcı dostu paneller.',
      },
    ],
    deliverables: [
      'Responsive web sitesi tasarımı ve geliştirmesi',
      'İçerik yönetim paneli (CMS) kurulumu',
      'Temel teknik SEO optimizasyonu',
      'Google Analytics ve Search Console entegrasyonu',
      'SSL sertifikası ve güvenlik yapılandırması',
      '30 gün ücretsiz teknik destek',
    ],
    process: [
      {
        title: 'Keşif ve içerik planlaması',
        description:
          'Hedeflerinizi, rakiplerinizi ve içerik ihtiyaçlarınızı analiz ederek yol haritası çıkarırız.',
      },
      {
        title: 'Tasarım ve prototip',
        description:
          'Marka kimliğinize uygun arayüzü prototip olarak hazırlar, onayınızı alırız.',
      },
      {
        title: 'Geliştirme ve entegrasyon',
        description:
          'Modern teknolojilerle siteyi kodlar, gerekli servisleri entegre ederiz.',
      },
      {
        title: 'Test, yayın ve bakım',
        description:
          'Tüm cihazlarda test eder, yayına alır ve sonrasında destek sağlarız.',
      },
    ],
    packages: [
      {
        name: 'Başlangıç',
        price: 'Talebe göre',
        description: 'Kurumsal tanıtım siteleri için ideal başlangıç paketi.',
        features: [
          '5 sayfaya kadar tasarım',
          'Responsive arayüz',
          'İletişim formu',
          'Temel SEO kurulumu',
        ],
      },
      {
        name: 'Profesyonel',
        price: 'Talebe göre',
        description: 'Büyüyen markalar için gelişmiş özellikli paket.',
        features: [
          'Sınırsız sayfa',
          'İçerik yönetim paneli',
          'Blog ve haber modülü',
          'Gelişmiş SEO ve performans',
          'Çoklu dil desteği',
        ],
        featured: true,
      },
      {
        name: 'Kurumsal',
        price: 'Talebe göre',
        description: 'Özel entegrasyon ihtiyacı olan kurumlar için.',
        features: [
          'Özel yazılım entegrasyonları',
          'API geliştirme',
          'Yük dengeleme ve ölçekleme',
          'Öncelikli 7/24 destek',
        ],
      },
    ],
    faqs: [
      {
        question: 'Bir web sitesi projesi ne kadar sürede tamamlanır?',
        answer:
          'Kapsamına bağlı olarak kurumsal bir site genellikle 3-6 hafta içinde yayına alınır. Keşif toplantısında net bir zaman planı paylaşırız.',
      },
      {
        question: 'Siteyi kendim güncelleyebilir miyim?',
        answer:
          'Evet. Kullanıcı dostu bir yönetim paneli teslim ediyoruz; içerik, görsel ve sayfa düzenlemelerini teknik bilgi gerektirmeden yapabilirsiniz.',
      },
      {
        question: 'Mevcut sitemi yenileyebilir misiniz?',
        answer:
          'Kesinlikle. Mevcut sitenizi analiz eder, içeriklerinizi koruyarak modern bir altyapıya taşırız.',
      },
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'mobil-uygulama',
    icon: Smartphone,
    title: 'Mobil Uygulama',
    description:
      'iOS ve Android için native performansta, kullanıcı odaklı mobil uygulama geliştirme.',
    tagline: 'Cebinizdeki markanız',
    intro:
      'iOS ve Android platformları için native performansta çalışan, akıcı ve kullanıcı odaklı mobil uygulamalar geliştiriyoruz. Tek kod tabanıyla iki platformda da tutarlı deneyim sunuyoruz.',
    highlights: [
      'Tek kod tabanı ile iOS ve Android yayını',
      'Native performansta akıcı kullanıcı deneyimi',
      'App Store ve Google Play yayın yönetimi dahil',
    ],
    stats: [
      { value: '40+', label: 'Yayınlanan mobil uygulama' },
      { value: '4.7', label: 'Ortalama mağaza puanı' },
      { value: '2x', label: 'Daha hızlı geliştirme süreci' },
    ],
    features: [
      {
        title: 'iOS & Android',
        description:
          'Tek geliştirme süreciyle her iki platformda yayınlanan uygulamalar.',
      },
      {
        title: 'Native Performans',
        description:
          'Akıcı animasyonlar ve hızlı yanıt veren kullanıcı deneyimi.',
      },
      {
        title: 'Push Bildirimleri',
        description:
          'Kullanıcılarınızla doğrudan iletişim kuran bildirim altyapısı.',
      },
      {
        title: 'Mağaza Yayını',
        description:
          'App Store ve Google Play yayın süreçlerinin uçtan uca yönetimi.',
      },
    ],
    deliverables: [
      'iOS ve Android uygulama geliştirmesi',
      'UI/UX tasarım ve prototip',
      'Push bildirim altyapısı',
      'Analitik ve çökme raporlama entegrasyonu',
      'App Store ve Google Play yayını',
      'Yayın sonrası bakım ve güncelleme desteği',
    ],
    process: [
      {
        title: 'İhtiyaç analizi ve akış tasarımı',
        description:
          'Uygulamanın hedeflerini ve kullanıcı akışlarını netleştiririz.',
      },
      {
        title: 'UI/UX prototipleme',
        description:
          'Ekran tasarımlarını tıklanabilir prototiplerle test ederiz.',
      },
      {
        title: 'Geliştirme ve test',
        description:
          'Uygulamayı geliştirir, gerçek cihazlarda kapsamlı test ederiz.',
      },
      {
        title: 'Mağaza yayını ve destek',
        description:
          'Yayın süreçlerini yönetir, sonrasında güncellemelerle destekleriz.',
      },
    ],
    packages: [
      {
        name: 'MVP',
        price: 'Talebe göre',
        description: 'Fikrinizi hızlıca test etmek için minimum uygulama.',
        features: [
          'Temel özellik seti',
          'Tek platform veya çapraz platform',
          'Basit backend entegrasyonu',
          'Mağaza yayını',
        ],
      },
      {
        name: 'Standart',
        price: 'Talebe göre',
        description: 'Tam kapsamlı, çift platform mobil uygulama.',
        features: [
          'iOS + Android yayını',
          'Push bildirimleri',
          'Kullanıcı hesabı ve yetkilendirme',
          'Analitik entegrasyonu',
          'Yayın sonrası destek',
        ],
        featured: true,
      },
      {
        name: 'Kurumsal',
        price: 'Talebe göre',
        description: 'Karmaşık entegrasyonlu, ölçeklenebilir uygulamalar.',
        features: [
          'Özel backend ve API',
          'Gerçek zamanlı özellikler',
          'Çoklu dil ve bölge desteği',
          'Öncelikli destek',
        ],
      },
    ],
    faqs: [
      {
        question: 'Uygulamayı hem iOS hem Android için mi geliştiriyorsunuz?',
        answer:
          'Evet. Tek kod tabanıyla her iki platform için yayınlıyoruz; bu hem maliyeti hem de geliştirme süresini önemli ölçüde azaltır.',
      },
      {
        question: 'Mağaza yayın sürecini siz mi yönetiyorsunuz?',
        answer:
          'App Store ve Google Play yayın süreçlerini uçtan uca biz yönetiyoruz; gerekli hesap ve sertifika kurulumlarında da yardımcı oluyoruz.',
      },
      {
        question: 'Yayın sonrası güncellemeler nasıl işliyor?',
        answer:
          'Bakım paketlerimizle hata düzeltmeleri, yeni özellikler ve platform güncellemelerini düzenli olarak sağlıyoruz.',
      },
    ],
    technologies: ['React Native', 'Expo', 'TypeScript', 'Firebase'],
  },
  {
    slug: 'e-ticaret-cozumleri',
    icon: ShoppingCart,
    title: 'E-Ticaret Çözümleri',
    description:
      'Satışa hazır, güvenli ödeme altyapılı ve yönetimi kolay e-ticaret platformları.',
    tagline: 'Online satışa hazır altyapı',
    intro:
      'Satışa hazır, güvenli ödeme altyapısına sahip ve yönetimi kolay e-ticaret platformları kuruyoruz. Ürün, sipariş ve müşteri yönetimini tek panelden kontrol edin.',
    highlights: [
      'Güvenli sanal POS ve ödeme entegrasyonları',
      'Pazaryeri ve kargo senkronizasyonu',
      'Dönüşüm odaklı, hızlı mağaza deneyimi',
    ],
    stats: [
      { value: '%35', label: 'Ortalama dönüşüm artışı' },
      { value: '50+', label: 'Kurulan online mağaza' },
      { value: '7/24', label: 'Kesintisiz satış altyapısı' },
    ],
    features: [
      {
        title: 'Güvenli Ödeme',
        description:
          'Sanal POS ve popüler ödeme sağlayıcılarıyla güvenli entegrasyonlar.',
      },
      {
        title: 'Ürün Yönetimi',
        description:
          'Stok, varyant ve kategori yönetimini kolaylaştıran paneller.',
      },
      {
        title: 'Sipariş Takibi',
        description:
          'Kargo ve sipariş süreçlerini uçtan uca izleyen sistemler.',
      },
      {
        title: 'Pazaryeri Entegrasyonu',
        description:
          'Trendyol, Hepsiburada gibi pazaryerleriyle senkron çalışma.',
      },
    ],
    deliverables: [
      'E-ticaret mağazası tasarımı ve geliştirmesi',
      'Ödeme ve sanal POS entegrasyonu',
      'Ürün, stok ve sipariş yönetim paneli',
      'Kargo ve pazaryeri entegrasyonları',
      'Kampanya ve indirem yönetimi',
      'Satış raporlama ve analitik',
    ],
    process: [
      {
        title: 'Katalog ve ödeme planlaması',
        description:
          'Ürün yapısını, ödeme ve kargo ihtiyaçlarını birlikte planlarız.',
      },
      {
        title: 'Mağaza tasarımı',
        description:
          'Dönüşüm odaklı, kullanıcı dostu mağaza arayüzünü tasarlarız.',
      },
      {
        title: 'Ödeme ve kargo entegrasyonu',
        description:
          'Güvenli ödeme altyapısını ve kargo servislerini entegre ederiz.',
      },
      {
        title: 'Yayın ve satış optimizasyonu',
        description:
          'Mağazayı yayına alır, satışları artıracak iyileştirmeleri uygularız.',
      },
    ],
    packages: [
      {
        name: 'Girişim',
        price: 'Talebe göre',
        description: 'Online satışa yeni başlayanlar için temel mağaza.',
        features: [
          'Ürün kataloğu kurulumu',
          'Tek ödeme sağlayıcı',
          'Temel kargo entegrasyonu',
          'Mobil uyumlu tasarım',
        ],
      },
      {
        name: 'Büyüme',
        price: 'Talebe göre',
        description: 'Satışlarını ölçeklemek isteyen markalar için.',
        features: [
          'Çoklu ödeme entegrasyonu',
          'Pazaryeri senkronizasyonu',
          'Kampanya ve kupon yönetimi',
          'Gelişmiş analitik',
          'Terk edilen sepet takibi',
        ],
        featured: true,
      },
      {
        name: 'Kurumsal',
        price: 'Talebe göre',
        description: 'Yüksek hacimli ve özel süreçli mağazalar için.',
        features: [
          'ERP / muhasebe entegrasyonu',
          'B2B ve bayilik modülleri',
          'Özel altyapı ve ölçekleme',
          'Öncelikli destek',
        ],
      },
    ],
    faqs: [
      {
        question: 'Hangi ödeme yöntemlerini entegre edebiliyorsunuz?',
        answer:
          'Yerli sanal POS sağlayıcılarından uluslararası ödeme servislerine kadar geniş bir yelpazede entegrasyon yapıyoruz.',
      },
      {
        question: 'Pazaryerleriyle entegrasyon mümkün mü?',
        answer:
          'Evet. Trendyol, Hepsiburada gibi pazaryerleriyle stok ve sipariş senkronizasyonu sağlıyoruz.',
      },
      {
        question: 'Mevcut mağazamı taşıyabilir misiniz?',
        answer:
          'Mevcut ürün, müşteri ve sipariş verilerinizi kayıpsız şekilde yeni platforma taşıyabiliriz.',
      },
    ],
    technologies: ['Next.js Commerce', 'Stripe', 'Shopify', 'PostgreSQL'],
  },
  {
    slug: 'seo-dijital-pazarlama',
    icon: Search,
    title: 'SEO & Dijital Pazarlama',
    description:
      'Arama motorlarında üst sıralara taşıyan strateji, içerik ve reklam yönetimi.',
    tagline: 'Doğru kitleye ulaşın',
    intro:
      'Arama motorlarında üst sıralara taşıyan strateji, içerik üretimi ve reklam yönetimi sunuyoruz. Veriye dayalı yaklaşımla bütçenizi en verimli şekilde değerlendiriyoruz.',
    highlights: [
      'Veriye dayalı, ölçülebilir pazarlama stratejisi',
      'Teknik SEO ve içerik üretimi bir arada',
      'Şeffaf raporlama ve düzenli iyileştirme',
    ],
    stats: [
      { value: '%180', label: 'Ortalama organik trafik artışı' },
      { value: 'İlk 3', label: 'Hedef kelimelerde sıralama' },
      { value: '3x', label: 'Reklam yatırım getirisi' },
    ],
    features: [
      {
        title: 'Teknik SEO',
        description: 'Site hızı, yapısal veri ve indeksleme optimizasyonu.',
      },
      {
        title: 'İçerik Stratejisi',
        description:
          'Hedef kitlenize hitap eden, arama niyetine uygun içerikler.',
      },
      {
        title: 'Reklam Yönetimi',
        description:
          'Google Ads ve sosyal medya reklamlarıyla ölçülebilir dönüşüm.',
      },
      {
        title: 'Raporlama',
        description: 'Şeffaf, düzenli ve anlaşılır performans raporları.',
      },
    ],
    deliverables: [
      'SEO ve rakip analiz raporu',
      'Anahtar kelime stratejisi',
      'Teknik SEO iyileştirmeleri',
      'Aylık içerik üretimi',
      'Reklam kampanyası kurulum ve yönetimi',
      'Aylık performans raporu',
    ],
    process: [
      {
        title: 'Mevcut durum ve rakip analizi',
        description:
          'Sitenizi ve rakiplerinizi analiz ederek fırsatları belirleriz.',
      },
      {
        title: 'Anahtar kelime stratejisi',
        description:
          'Dönüşüm potansiyeli yüksek anahtar kelimeleri önceliklendiririz.',
      },
      {
        title: 'Uygulama ve içerik üretimi',
        description:
          'Teknik iyileştirmeleri yapar, hedefli içerikler üretiriz.',
      },
      {
        title: 'Ölçüm ve sürekli iyileştirme',
        description:
          'Sonuçları ölçer, stratejiyi verilere göre sürekli optimize ederiz.',
      },
    ],
    packages: [
      {
        name: 'SEO Temel',
        price: 'Talebe göre',
        description: 'Organik görünürlüğünü artırmak isteyenler için.',
        features: [
          'Teknik SEO denetimi',
          'Anahtar kelime araştırması',
          'Aylık 2 içerik',
          'Aylık raporlama',
        ],
      },
      {
        name: 'Büyüme',
        price: 'Talebe göre',
        description: 'SEO ve reklamı bir arada yürütmek isteyenler için.',
        features: [
          'Sürekli teknik SEO',
          'Aylık 4-6 içerik',
          'Google Ads yönetimi',
          'Dönüşüm optimizasyonu',
          'Detaylı aylık rapor',
        ],
        featured: true,
      },
      {
        name: 'Performans',
        price: 'Talebe göre',
        description: 'Agresif büyüme hedefleyen markalar için.',
        features: [
          'Çok kanallı reklam yönetimi',
          'Kapsamlı içerik operasyonu',
          'Landing page optimizasyonu',
          'Haftalık strateji görüşmesi',
        ],
      },
    ],
    faqs: [
      {
        question: 'SEO sonuçlarını ne zaman görürüm?',
        answer:
          'SEO uzun vadeli bir yatırımdır; genellikle ilk anlamlı sonuçlar 3-6 ay içinde görülür. Reklamlarda ise sonuçlar çok daha hızlı alınır.',
      },
      {
        question: 'Reklam bütçesi dahil mi?',
        answer:
          'Hizmet ücretimiz yönetim bedelidir; reklam bütçesi ayrıca belirlenir ve doğrudan platformlara harcanır.',
      },
      {
        question: 'Raporları ne sıklıkla alırım?',
        answer:
          'Aylık detaylı raporlar sunuyoruz ve istediğiniz an canlı panellerden performansı takip edebilirsiniz.',
      },
    ],
    technologies: [
      'Google Analytics',
      'Search Console',
      'Google Ads',
      'Meta Ads',
    ],
  },
  {
    slug: 'ui-ux-tasarim',
    icon: PenTool,
    title: 'UI/UX Tasarım',
    description:
      'Marka kimliğinizi yansıtan, dönüşüm odaklı ve kullanıcı dostu arayüz tasarımları.',
    tagline: 'Kullanıcıyı merkeze alan tasarım',
    intro:
      'Marka kimliğinizi yansıtan, dönüşüm odaklı ve kullanıcı dostu arayüzler tasarlıyoruz. Her tasarım kararını kullanıcı davranışı ve iş hedefleriyle destekliyoruz.',
    highlights: [
      'Kullanıcı araştırmasına dayalı tasarım kararları',
      'Tıklanabilir prototiplerle hızlı doğrulama',
      'Ölçeklenebilir tasarım sistemi teslimatı',
    ],
    stats: [
      { value: '%45', label: 'Ortalama dönüşüm iyileşmesi' },
      { value: '60+', label: 'Tamamlanan tasarım projesi' },
      { value: '2 hafta', label: 'İlk prototip teslim süresi' },
    ],
    features: [
      {
        title: 'Kullanıcı Araştırması',
        description: 'Hedef kitlenizi anlayarak doğru çözümleri tasarlama.',
      },
      {
        title: 'Wireframe & Prototip',
        description:
          'Fikirleri hızlıca test edilebilir prototiplere dönüştürme.',
      },
      {
        title: 'Tasarım Sistemi',
        description: 'Tutarlı ve ölçeklenebilir bileşen kütüphaneleri.',
      },
      {
        title: 'Dönüşüm Odaklı',
        description:
          'Kullanıcıyı aksiyona yönlendiren, net ve akıcı arayüzler.',
      },
    ],
    deliverables: [
      'Kullanıcı araştırması ve persona çalışması',
      'Bilgi mimarisi ve akış diyagramları',
      'Wireframe ve tıklanabilir prototip',
      'Yüksek çözünürlüklü görsel tasarım',
      'Tasarım sistemi ve bileşen kütüphanesi',
      'Geliştirici teslim dosyaları',
    ],
    process: [
      {
        title: 'Araştırma ve keşif',
        description:
          'Kullanıcı ihtiyaçlarını ve iş hedeflerini derinlemesine anlarız.',
      },
      {
        title: 'Bilgi mimarisi ve wireframe',
        description:
          'İçerik yapısını kurar, düşük çözünürlüklü iskeletler hazırlarız.',
      },
      {
        title: 'Görsel tasarım',
        description:
          'Marka kimliğine uygun, dönüşüm odaklı arayüzleri tasarlarız.',
      },
      {
        title: 'Prototip ve test',
        description:
          'Tasarımları prototiplerle test eder, geri bildirimlerle iyileştiririz.',
      },
    ],
    packages: [
      {
        name: 'UI Kit',
        price: 'Talebe göre',
        description: 'Belirli ekranlar için hızlı arayüz tasarımı.',
        features: [
          'Sınırlı ekran sayısı',
          'Görsel tasarım',
          'Temel bileşenler',
          'Figma teslimi',
        ],
      },
      {
        name: 'Ürün Tasarımı',
        price: 'Talebe göre',
        description: 'Uçtan uca ürün deneyimi tasarımı.',
        features: [
          'Kullanıcı araştırması',
          'Wireframe ve prototip',
          'Tam görsel tasarım',
          'Tasarım sistemi',
          'Geliştirici teslimatı',
        ],
        featured: true,
      },
      {
        name: 'Tasarım Ortaklığı',
        price: 'Talebe göre',
        description: 'Sürekli tasarım desteği gerektiren ekipler için.',
        features: [
          'Aylık tasarım kapasitesi',
          'Sürekli iterasyon',
          'Kullanıcı testleri',
          'Tasarım sistemi bakımı',
        ],
      },
    ],
    faqs: [
      {
        question: 'Tasarımları hangi araçla teslim ediyorsunuz?',
        answer:
          'Tasarımları Figma üzerinden teslim ediyoruz; geliştiricilerin kolayca kullanabileceği bileşenler ve stil kılavuzu dahildir.',
      },
      {
        question: 'Mevcut ürünümüzü yeniden tasarlayabilir misiniz?',
        answer:
          'Evet. Mevcut ürününüzü kullanılabilirlik açısından değerlendirir, veriye dayalı bir yeniden tasarım yaparız.',
      },
      {
        question: 'Tasarım ve geliştirme birlikte alınabilir mi?',
        answer:
          'Tabii ki. Tasarımdan geliştirmeye uçtan uca hizmet sunarak süreci tek elden yönetebiliriz.',
      },
    ],
    technologies: ['Figma', 'Framer', 'Adobe XD', 'Design Tokens'],
  },
  {
    slug: 'yazilim-danismanligi',
    icon: ServerCog,
    title: 'Yazılım Danışmanlığı',
    description:
      'Teknik altyapı, bulut mimarisi ve bakım desteğiyle sürdürülebilir dijital sistemler.',
    tagline: 'Sağlam teknik temeller',
    intro:
      'Teknik altyapı, bulut mimarisi ve bakım desteğiyle sürdürülebilir dijital sistemler kuruyoruz. Ekibinize yol gösterir, projelerinizi doğru mimariyle güvence altına alırız.',
    highlights: [
      'Ölçeklenebilir ve güvenli mimari tasarımı',
      'Bulut maliyetlerinde optimizasyon',
      'CI/CD ile hızlı ve güvenli yayın süreçleri',
    ],
    stats: [
      { value: '%40', label: 'Ortalama altyapı maliyet tasarrufu' },
      { value: '99.9%', label: 'Hedeflenen sistem erişilebilirliği' },
      { value: '10+', label: 'Yıl birikimli teknik tecrübe' },
    ],
    features: [
      {
        title: 'Mimari Danışmanlık',
        description: 'Ölçeklenebilir ve sürdürülebilir sistem tasarımı.',
      },
      {
        title: 'Bulut Altyapısı',
        description:
          'Modern bulut servisleriyle güvenli ve esnek altyapı kurulumu.',
      },
      {
        title: 'Kod İncelemesi',
        description: 'Kalite, güvenlik ve performans odaklı kod denetimleri.',
      },
      {
        title: 'Bakım & Destek',
        description:
          'Kesintisiz çalışma için sürekli izleme ve teknik destek.',
      },
    ],
    deliverables: [
      'Mevcut sistem denetim raporu',
      'Mimari ve teknoloji yol haritası',
      'Bulut altyapı kurulumu ve optimizasyonu',
      'CI/CD pipeline yapılandırması',
      'Kod inceleme ve iyileştirme önerileri',
      'İzleme, uyarı ve bakım desteği',
    ],
    process: [
      {
        title: 'Mevcut sistem denetimi',
        description:
          'Kod tabanınızı ve altyapınızı analiz ederek riskleri belirleriz.',
      },
      {
        title: 'Strateji ve yol haritası',
        description:
          'Hedeflerinize uygun teknik yol haritasını birlikte oluştururuz.',
      },
      {
        title: 'Uygulama ve iyileştirme',
        description:
          'Önerileri hayata geçirir, altyapıyı optimize ederiz.',
      },
      {
        title: 'İzleme ve sürekli destek',
        description:
          'Sistemleri izler, sürekli iyileştirme ve destek sağlarız.',
      },
    ],
    packages: [
      {
        name: 'Denetim',
        price: 'Talebe göre',
        description: 'Sistemlerinizin sağlığını değerlendiren tek seferlik denetim.',
        features: [
          'Kod ve mimari incelemesi',
          'Güvenlik değerlendirmesi',
          'Performans analizi',
          'İyileştirme raporu',
        ],
      },
      {
        name: 'Danışmanlık',
        price: 'Talebe göre',
        description: 'Projelerinize sürekli teknik yön veren paket.',
        features: [
          'Mimari danışmanlık',
          'Bulut altyapı kurulumu',
          'CI/CD yapılandırması',
          'Düzenli kod incelemesi',
          'Aylık strateji görüşmesi',
        ],
        featured: true,
      },
      {
        name: 'Yönetilen Destek',
        price: 'Talebe göre',
        description: 'Altyapınızın tümüyle yönetilmesini isteyenler için.',
        features: [
          '7/24 izleme',
          'Olay müdahalesi',
          'Kapasite planlaması',
          'Öncelikli teknik destek',
        ],
      },
    ],
    faqs: [
      {
        question: 'Kendi geliştirme ekibimizle çalışabilir misiniz?',
        answer:
          'Evet. Ekibinize mentorluk yapar, süreçlerinizi iyileştirir ve gerektiğinde doğrudan geliştirmeye katkı sağlarız.',
      },
      {
        question: 'Hangi bulut sağlayıcılarıyla çalışıyorsunuz?',
        answer:
          'Başta AWS ve Vercel olmak üzere modern bulut platformlarında deneyimliyiz; ihtiyacınıza en uygun çözümü öneririz.',
      },
      {
        question: 'Acil durumlarda destek sağlıyor musunuz?',
        answer:
          'Yönetilen destek paketlerimizde 7/24 izleme ve olay müdahalesi sunuyoruz.',
      },
    ],
    technologies: ['AWS', 'Vercel', 'Docker', 'PostgreSQL', 'CI/CD'],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}
