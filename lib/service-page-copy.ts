export type LocaleText = { tr: string; en: string }

export type ServiceVisualKey =
  | 'software'
  | 'crm'
  | 'erp'
  | 'api'
  | 'commerce'
  | 'mobile'
  | 'ai'
  | 'dashboard'
  | 'seo'
  | 'website'
  | 'saas'
  | 'portal'
  | 'inventory'
  | 'automation'
  | 'platform'
  | 'consulting'
  | 'design'
  | 'modernize'

export type ServicePageExtras = {
  visual: ServiceVisualKey
  trust: { title: LocaleText }[]
  overviewSteps: { title: LocaleText }[]
  architecture: {
    layers: { title: LocaleText }[]
    sides: { title: LocaleText }[]
  }
  why: { title: LocaleText; text: LocaleText }[]
  outcomes: { title: LocaleText; text: LocaleText }[]
  process: { title: LocaleText; text: LocaleText }[]
  ctaTitle: LocaleText
  ctaText: LocaleText
}

const t = (tr: string, en: string): LocaleText => ({ tr, en })

const DEFAULT_SLUG = 'ozel-yazilim-gelistirme'

export const SERVICE_PAGE_EXTRAS: Record<string, ServicePageExtras> = {
  'web-sitesi-gelistirme': {
    visual: 'website',
    trust: [
      { title: t('Core Web Vitals odaklı performans', 'Core Web Vitals–focused performance') },
      { title: t('Mobil öncelikli responsive yapı', 'Mobile-first responsive structure') },
      { title: t('SEO uyumlu teknik altyapı', 'SEO-ready technical foundation') },
      { title: t('Güvenli barındırma ve SSL', 'Secure hosting and SSL') },
    ],
    overviewSteps: [
      { title: t('Marka ve içerik keşfi', 'Brand and content discovery') },
      { title: t('Bilgi mimarisi ve wireframe', 'Information architecture and wireframes') },
      { title: t('Görsel tasarım ve onay', 'Visual design and approval') },
      { title: t('Next.js geliştirme ve CMS', 'Next.js development and CMS') },
      { title: t('Test, yayın ve eğitim', 'Testing, launch, and training') },
    ],
    architecture: {
      layers: [
        { title: t('Sunum katmanı', 'Presentation layer') },
        { title: t('İçerik yönetimi', 'Content management') },
        { title: t('Form ve iletişim', 'Forms and contact') },
        { title: t('Analitik ve SEO', 'Analytics and SEO') },
        { title: t('Barındırma ve CDN', 'Hosting and CDN') },
      ],
      sides: [
        { title: t('Google Analytics', 'Google Analytics') },
        { title: t('Search Console', 'Search Console') },
        { title: t('E-posta servisleri', 'Email services') },
        { title: t('CRM formları', 'CRM forms') },
      ],
    },
    why: [
      {
        title: t('Hızlı ilk izlenim', 'Strong first impression'),
        text: t(
          'Yavaş açılan siteler ziyaretçi kaybettirir; performansı tasarım kararlarıyla birlikte planlarız.',
          'Slow sites lose visitors—we plan performance alongside design decisions from day one.',
        ),
      },
      {
        title: t('Arama motoru hazırlığı', 'Search engine readiness'),
        text: t(
          'Semantik yapı, meta veriler ve site haritası gibi teknik temelleri yayın öncesinde kurarız.',
          'We establish semantic markup, metadata, and sitemaps before launch.',
        ),
      },
      {
        title: t('Kolay içerik yönetimi', 'Easy content management'),
        text: t(
          'Teknik bilgi gerektirmeden sayfa, blog ve görsel güncellemesi yapabileceğiniz panel teslim ederiz.',
          'We deliver a panel where you can update pages, blogs, and media without technical skills.',
        ),
      },
      {
        title: t('Marka tutarlılığı', 'Brand consistency'),
        text: t(
          'Renk, tipografi ve bileşen dili kurumsal kimliğinizle uyumlu tutulur.',
          'Color, typography, and components stay aligned with your corporate identity.',
        ),
      },
      {
        title: t('Ölçeklenebilir altyapı', 'Scalable infrastructure'),
        text: t(
          'Trafik arttığında ek sunucu yönetimi gerektirmeyen modern barındırma kullanırız.',
          'We use modern hosting that scales with traffic without manual server management.',
        ),
      },
    ],
    outcomes: [
      {
        title: t('Profesyonel dijital vitrin', 'Professional digital storefront'),
        text: t('Markanızı güven veren bir kurumsal yüzle temsil edersiniz.', 'Your brand is represented with a credible corporate presence.'),
      },
      {
        title: t('Mobil uyumlu erişim', 'Mobile-friendly access'),
        text: t('Tüm cihazlarda okunabilir ve kullanılabilir deneyim sunarsınız.', 'Visitors get a readable, usable experience on every device.'),
      },
      {
        title: t('Organik görünürlük temeli', 'Organic visibility foundation'),
        text: t('Arama motorlarının siteyi doğru indekslemesi için teknik zemin hazırlanır.', 'Technical groundwork helps search engines index your site correctly.'),
      },
      {
        title: t('Ölçülebilir trafik', 'Measurable traffic'),
        text: t('Analytics kurulumuyla ziyaretçi kaynaklarını takip edebilirsiniz.', 'Analytics setup lets you track where visitors come from.'),
      },
      {
        title: t('Güvenli iletişim kanalı', 'Secure contact channel'),
        text: t('Formlar ve SSL ile müşteri talepleri güvenli biçimde toplanır.', 'Forms and SSL collect customer inquiries securely.'),
      },
      {
        title: t('Sürdürülebilir güncelleme', 'Sustainable updates'),
        text: t('Yeni sayfa ve kampanyaları hızlıca yayına alabilirsiniz.', 'You can publish new pages and campaigns quickly.'),
      },
    ],
    process: [
      {
        title: t('Keşif toplantısı', 'Discovery session'),
        text: t('Hedef kitle, rakipler ve içerik ihtiyaçlarını birlikte netleştiririz.', 'We clarify audience, competitors, and content needs together.'),
      },
      {
        title: t('Yapı ve tasarım', 'Structure and design'),
        text: t('Site haritası, wireframe ve görsel tasarımı onayınıza sunarız.', 'We present sitemap, wireframes, and visual design for approval.'),
      },
      {
        title: t('Geliştirme', 'Development'),
        text: t('Onaylanan tasarımı performans odaklı kodla hayata geçiririz.', 'We build the approved design with performance-focused code.'),
      },
      {
        title: t('İçerik yerleştirme', 'Content placement'),
        text: t('Metin, görseller ve SEO alanlarını birlikte doldururuz.', 'We populate copy, images, and SEO fields together.'),
      },
      {
        title: t('Kalite kontrol', 'Quality assurance'),
        text: t('Cihaz, tarayıcı ve erişilebilirlik testlerini tamamlarız.', 'We complete device, browser, and accessibility testing.'),
      },
      {
        title: t('Yayın ve destek', 'Launch and support'),
        text: t('Canlıya alır, panel eğitimi verir ve ilk ay destek sağlarız.', 'We go live, train your team on the panel, and support the first month.'),
      },
    ],
    ctaTitle: t('Kurumsal web sitenizi birlikte planlayalım', 'Let’s plan your corporate website together'),
    ctaText: t(
      'Hedeflerinizi paylaşın; size özel bir site yol haritası ve teklif hazırlayalım.',
      'Share your goals and we will prepare a tailored site roadmap and proposal.',
    ),
  },
  'mobil-uygulama': {
    visual: 'mobile',
    trust: [
      { title: t('iOS ve Android tek kod tabanı', 'Single codebase for iOS and Android') },
      { title: t('App Store yayın desteği', 'App Store launch support') },
      { title: t('Push bildirim altyapısı', 'Push notification infrastructure') },
      { title: t('Analitik ve çökme izleme', 'Analytics and crash monitoring') },
    ],
    overviewSteps: [
      { title: t('Ürün hedefleri ve kullanıcı akışı', 'Product goals and user flows') },
      { title: t('UI/UX prototipleme', 'UI/UX prototyping') },
      { title: t('Backend ve API bağlantısı', 'Backend and API integration') },
      { title: t('Cihaz testleri ve optimizasyon', 'Device testing and optimization') },
      { title: t('Mağaza yayını ve bakım', 'Store release and maintenance') },
    ],
    architecture: {
      layers: [
        { title: t('Mobil arayüz', 'Mobile interface') },
        { title: t('Durum yönetimi', 'State management') },
        { title: t('API istemcisi', 'API client') },
        { title: t('Bildirim servisi', 'Notification service') },
        { title: t('Analitik katmanı', 'Analytics layer') },
      ],
      sides: [
        { title: t('Firebase', 'Firebase') },
        { title: t('Apple Push', 'Apple Push') },
        { title: t('Google Play', 'Google Play') },
        { title: t('Ödeme SDK', 'Payment SDK') },
        { title: t('Harita servisleri', 'Map services') },
      ],
    },
    why: [
      {
        title: t('Her an erişim', 'Always-on access'),
        text: t('Müşterileriniz hizmete telefonlarından anında ulaşır.', 'Customers reach your service instantly from their phones.'),
      },
      {
        title: t('Bildirimle etkileşim', 'Engagement through notifications'),
        text: t('Kampanya, hatırlatma ve işlem bildirimleriyle bağlılığı desteklersiniz.', 'Campaign, reminder, and transaction alerts support retention.'),
      },
      {
        title: t('Cihaz yetenekleri', 'Device capabilities'),
        text: t('Kamera, konum ve biyometri gibi özellikler süreçleri hızlandırır.', 'Camera, location, and biometrics speed up real workflows.'),
      },
      {
        title: t('Marka sadakati', 'Brand loyalty'),
        text: t('Ana ekranda yer alan uygulama tekrar ziyareti artırır.', 'A home-screen app increases repeat visits.'),
      },
      {
        title: t('Çapraz platform verimliliği', 'Cross-platform efficiency'),
        text: t('Tek geliştirme hattıyla iki mağazaya ulaşırsınız.', 'One development pipeline reaches both app stores.'),
      },
    ],
    outcomes: [
      {
        title: t('Mağazada görünür ürün', 'Visible product in stores'),
        text: t('App Store ve Google Play’de profesyonel bir varlık oluşturursunuz.', 'You establish a professional presence on App Store and Google Play.'),
      },
      {
        title: t('Akıcı kullanıcı deneyimi', 'Smooth user experience'),
        text: t('Native performansa yakın animasyon ve yanıt süreleri sunarsınız.', 'You deliver near-native animations and response times.'),
      },
      {
        title: t('Anlık iletişim', 'Instant communication'),
        text: t('Push bildirimlerle kullanıcıları doğru anda bilgilendirirsiniz.', 'Push notifications inform users at the right moment.'),
      },
      {
        title: t('Kullanım içgörüleri', 'Usage insights'),
        text: t('Hangi ekranların kullanıldığını veriyle görürsünüz.', 'You see which screens drive engagement through data.'),
      },
      {
        title: t('Güvenli oturum', 'Secure sessions'),
        text: t('Kimlik doğrulama ve token yönetimiyle veriyi korursunuz.', 'Authentication and token handling protect user data.'),
      },
      {
        title: t('Güncellenebilir ürün', 'Evolving product'),
        text: t('Yeni sürümlerle özellik eklemeye devam edebilirsiniz.', 'You can keep adding features through new releases.'),
      },
    ],
    process: [
      {
        title: t('Ürün tanımı', 'Product definition'),
        text: t('Hedef kullanıcı, temel özellikler ve başarı metriklerini belirleriz.', 'We define target users, core features, and success metrics.'),
      },
      {
        title: t('Tasarım sprinti', 'Design sprint'),
        text: t('Ekran akışlarını prototiple test ederiz.', 'We prototype and test screen flows.'),
      },
      {
        title: t('Geliştirme iterasyonları', 'Development iterations'),
        text: t('Her sprintte çalışan bir sürüm teslim ederiz.', 'Each sprint delivers a working build.'),
      },
      {
        title: t('Beta test', 'Beta testing'),
        text: t('Gerçek cihazlarda performans ve kullanılabilirlik doğrulanır.', 'Performance and usability are validated on real devices.'),
      },
      {
        title: t('Mağaza başvurusu', 'Store submission'),
        text: t('Gerekli varlıklar, açıklamalar ve inceleme sürecini yönetiriz.', 'We manage assets, descriptions, and the review process.'),
      },
      {
        title: t('Yayın sonrası iyileştirme', 'Post-launch improvement'),
        text: t('Kullanım verilerine göre hata ve özellik güncellemeleri yaparız.', 'We fix issues and ship features based on usage data.'),
      },
    ],
    ctaTitle: t('Mobil uygulama fikrinizi hayata geçirelim', 'Bring your mobile app idea to life'),
    ctaText: t(
      'Kapsamınızı konuşalım; MVP’den mağaza yayınına kadar net bir plan sunalım.',
      'Let’s discuss scope and outline a clear path from MVP to store launch.',
    ),
  },
  'e-ticaret-cozumleri': {
    visual: 'commerce',
    trust: [
      { title: t('Güvenli ödeme entegrasyonları', 'Secure payment integrations') },
      { title: t('Stok ve sipariş senkronu', 'Stock and order synchronization') },
      { title: t('Pazaryeri bağlantıları', 'Marketplace connections') },
      { title: t('Kargo takip altyapısı', 'Shipping tracking infrastructure') },
    ],
    overviewSteps: [
      { title: t('Ürün kataloğu ve fiyat modeli', 'Product catalog and pricing model') },
      { title: t('Mağaza arayüz tasarımı', 'Storefront design') },
      { title: t('Ödeme ve tahsilat kurulumu', 'Payment and checkout setup') },
      { title: t('Stok ve kargo entegrasyonu', 'Inventory and shipping integration') },
      { title: t('Yayın ve dönüşüm optimizasyonu', 'Launch and conversion optimization') },
    ],
    architecture: {
      layers: [
        { title: t('Vitrin ve sepet', 'Storefront and cart') },
        { title: t('Ürün ve stok motoru', 'Product and inventory engine') },
        { title: t('Ödeme geçidi', 'Payment gateway') },
        { title: t('Sipariş yönetimi', 'Order management') },
        { title: t('Kargo ve bildirim', 'Shipping and notifications') },
      ],
      sides: [
        { title: t('Sanal POS', 'Virtual POS') },
        { title: t('Trendyol / Hepsiburada', 'Trendyol / Hepsiburada') },
        { title: t('Kargo firmaları', 'Courier providers') },
        { title: t('ERP stok', 'ERP inventory') },
        { title: t('E-posta otomasyonu', 'Email automation') },
      ],
    },
    why: [
      {
        title: t('Satışa hazır altyapı', 'Sales-ready infrastructure'),
        text: t('Ürün, fiyat ve stok kurallarını tek panelden yönetirsiniz.', 'You manage products, pricing, and stock rules from one panel.'),
      },
      {
        title: t('Güven veren checkout', 'Trustworthy checkout'),
        text: t('Ödeme adımları sade ve güvenli tasarlanır.', 'Checkout steps are designed to be simple and secure.'),
      },
      {
        title: t('Çok kanallı satış', 'Multi-channel selling'),
        text: t('Web mağaza ile pazaryeri stoklarını uyumlu tutarsınız.', 'You keep web store and marketplace inventory aligned.'),
      },
      {
        title: t('Operasyon otomasyonu', 'Operational automation'),
        text: t('Sipariş onayı, etiket ve takip kodu akışları otomatikleşir.', 'Order confirmation, labels, and tracking codes flow automatically.'),
      },
      {
        title: t('Dönüşüm odaklı tasarım', 'Conversion-focused design'),
        text: t('Sepet ve ödeme sürtünmesini azaltan arayüz kararları uygularız.', 'We apply UI decisions that reduce cart and payment friction.'),
      },
    ],
    outcomes: [
      {
        title: t('7/24 online satış', '24/7 online sales'),
        text: t('Mağazanız kesintisiz sipariş alır.', 'Your store accepts orders around the clock.'),
      },
      {
        title: t('Merkezi ürün yönetimi', 'Central product management'),
        text: t('Varyant, kampanya ve fiyat kurallarını tek yerden kontrol edersiniz.', 'You control variants, campaigns, and pricing from one place.'),
      },
      {
        title: t('Güvenli tahsilat', 'Secure collection'),
        text: t('Kart ve alternatif ödeme yöntemleri PCI uyumlu akışlarla çalışır.', 'Cards and alternative payments run through PCI-aware flows.'),
      },
      {
        title: t('Stok doğruluğu', 'Inventory accuracy'),
        text: t('Satılabilir adetler kanallar arasında tutarlı kalır.', 'Available quantities stay consistent across channels.'),
      },
      {
        title: t('Şeffaf kargo süreci', 'Transparent shipping'),
        text: t('Müşteriler sipariş ve teslimat durumunu izler.', 'Customers track order and delivery status.'),
      },
      {
        title: t('Satış raporları', 'Sales reporting'),
        text: t('Gelir, iade ve kanal performansını ölçersiniz.', 'You measure revenue, returns, and channel performance.'),
      },
    ],
    process: [
      {
        title: t('Katalog planlaması', 'Catalog planning'),
        text: t('Ürün ağacı, varyantlar ve fiyat stratejisini netleştiririz.', 'We clarify product tree, variants, and pricing strategy.'),
      },
      {
        title: t('Mağaza tasarımı', 'Store design'),
        text: t('Kategori, ürün ve checkout ekranlarını tasarlarız.', 'We design category, product, and checkout screens.'),
      },
      {
        title: t('Ödeme kurulumu', 'Payment setup'),
        text: t('Sanal POS ve test işlemlerini tamamlarız.', 'We configure virtual POS and complete test transactions.'),
      },
      {
        title: t('Lojistik entegrasyonu', 'Logistics integration'),
        text: t('Kargo firmaları ve stok kaynaklarını bağlarız.', 'We connect couriers and inventory sources.'),
      },
      {
        title: t('UAT ve yük testi', 'UAT and load testing'),
        text: t('Gerçek senaryolarla sipariş akışını doğrularız.', 'We validate order flows with realistic scenarios.'),
      },
      {
        title: t('Canlı satış', 'Go-live sales'),
        text: t('Yayına alır, ilk kampanya ve izleme kurallarını birlikte belirleriz.', 'We launch and define initial campaigns and monitoring rules together.'),
      },
    ],
    ctaTitle: t('E-ticaret mağazanızı kuralım', 'Launch your e-commerce store'),
    ctaText: t(
      'Ürün yapınızı ve satış kanallarınızı paylaşın; size özel mağaza planı çıkaralım.',
      'Share your product structure and sales channels—we will draft a tailored store plan.',
    ),
  },
  'seo-dijital-pazarlama': {
    visual: 'seo',
    trust: [
      { title: t('Teknik SEO denetimi', 'Technical SEO audit') },
      { title: t('Search Console izleme', 'Search Console monitoring') },
      { title: t('İçerik stratejisi', 'Content strategy') },
      { title: t('Şeffaf aylık raporlama', 'Transparent monthly reporting') },
    ],
    overviewSteps: [
      { title: t('Site ve rakip analizi', 'Site and competitor analysis') },
      { title: t('Anahtar kelime araştırması', 'Keyword research') },
      { title: t('Teknik iyileştirmeler', 'Technical improvements') },
      { title: t('İçerik üretimi ve optimizasyon', 'Content production and optimization') },
      { title: t('Ölçüm ve iterasyon', 'Measurement and iteration') },
    ],
    architecture: {
      layers: [
        { title: t('Site yapısı ve indeksleme', 'Site structure and indexing') },
        { title: t('Sayfa hızı ve Core Web Vitals', 'Page speed and Core Web Vitals') },
        { title: t('Yapılandırılmış veri', 'Structured data') },
        { title: t('İçerik ve meta optimizasyonu', 'Content and meta optimization') },
        { title: t('Analitik ve Search Console', 'Analytics and Search Console') },
      ],
      sides: [
        { title: t('Google Search Console', 'Google Search Console') },
        { title: t('Google Analytics', 'Google Analytics') },
        { title: t('Google Ads', 'Google Ads') },
        { title: t('Meta Ads', 'Meta Ads') },
      ],
    },
    why: [
      {
        title: t('Teknik temel önceliği', 'Technical foundation first'),
        text: t('Tarama, indeksleme ve site hızı sorunlarını içerikten önce ele alırız.', 'We address crawl, indexing, and speed issues before content work.'),
      },
      {
        title: t('Arama niyetine uygun içerik', 'Intent-aligned content'),
        text: t('Kullanıcının gerçek sorusuna cevap veren sayfalar planlarız.', 'We plan pages that answer what users actually search for.'),
      },
      {
        title: t('Ölçülebilir ilerleme', 'Measurable progress'),
        text: t('Trafik, tıklama ve dönüşüm metriklerini düzenli raporlarız.', 'We report traffic, clicks, and conversion metrics regularly.'),
      },
      {
        title: t('Gerçekçi beklenti yönetimi', 'Realistic expectations'),
        text: t('Belirli bir sıralama garantisi vermeyiz; sürdürülebilir görünürlük hedefleriz.', 'We do not guarantee specific rankings—we aim for sustainable visibility.'),
      },
      {
        title: t('Reklam ve organik uyumu', 'Paid and organic alignment'),
        text: t('Google Ads ve organik stratejiyi birbirini destekleyecek şekilde koordine ederiz.', 'We coordinate Google Ads and organic efforts so they reinforce each other.'),
      },
    ],
    outcomes: [
      {
        title: t('Daha sağlıklı site yapısı', 'Healthier site structure'),
        text: t('İç linkler, başlıklar ve site haritası arama motorları için netleşir.', 'Internal links, headings, and sitemaps become clearer for search engines.'),
      },
      {
        title: t('Search Console görünürlüğü', 'Search Console visibility'),
        text: t('Tarama hataları ve performans verilerini takip edersiniz.', 'You track crawl errors and performance data.'),
      },
      {
        title: t('Hedefli içerik planı', 'Targeted content plan'),
        text: t('Öncelikli konular için düzenli yayın takvimi oluşur.', 'A publishing calendar emerges for priority topics.'),
      },
      {
        title: t('Dönüşüm odaklı trafik', 'Conversion-oriented traffic'),
        text: t('Yalnızca tıklama değil, iş hedeflerine bağlı ziyaretçi kalitesi izlenir.', 'Visitor quality tied to business goals is tracked—not clicks alone.'),
      },
      {
        title: t('Reklam verimliliği', 'Ad efficiency'),
        text: t('Kampanya verileri bütçe kararlarını destekler.', 'Campaign data informs budget decisions.'),
      },
      {
        title: t('Sürekli iyileştirme döngüsü', 'Continuous improvement loop'),
        text: t('Aylık raporlar sonraki optimizasyon adımlarını belirler.', 'Monthly reports define the next optimization steps.'),
      },
    ],
    process: [
      {
        title: t('Mevcut durum analizi', 'Current state analysis'),
        text: t('Teknik SEO, içerik ve rakip görünürlüğünü inceleriz.', 'We review technical SEO, content, and competitor visibility.'),
      },
      {
        title: t('Strateji dokümanı', 'Strategy document'),
        text: t('Anahtar kelime, sayfa ve kanal önceliklerini yazılı hale getiririz.', 'We document keyword, page, and channel priorities.'),
      },
      {
        title: t('Teknik uygulama', 'Technical implementation'),
        text: t('Hız, yapılandırılmış veri ve indeksleme düzeltmelerini yaparız.', 'We implement speed, structured data, and indexing fixes.'),
      },
      {
        title: t('İçerik üretimi', 'Content production'),
        text: t('Blog, landing ve meta güncellemelerini planlı şekilde yayınlarız.', 'We publish blogs, landing pages, and meta updates on schedule.'),
      },
      {
        title: t('Reklam optimizasyonu', 'Ad optimization'),
        text: t('Google ve Meta kampanyalarını test ederek iyileştiririz.', 'We test and refine Google and Meta campaigns.'),
      },
      {
        title: t('Aylık değerlendirme', 'Monthly review'),
        text: t('Sonuçları raporlar, bir sonraki dönem planını güncelleriz.', 'We report results and update the next period’s plan.'),
      },
    ],
    ctaTitle: t('SEO ve dijital pazarlama planınızı oluşturalım', 'Build your SEO and digital marketing plan'),
    ctaText: t(
      'Mevcut sitenizi inceleyelim; teknik SEO ve içerik için gerçekçi bir yol haritası sunalım.',
      'Let us review your site and propose a realistic roadmap for technical SEO and content.',
    ),
  },
  'ui-ux-tasarim': {
    visual: 'design',
    trust: [
      { title: t('Kullanıcı araştırmasına dayalı kararlar', 'Research-driven decisions') },
      { title: t('Figma tasarım sistemi', 'Figma design system') },
      { title: t('Erişilebilirlik standartları', 'Accessibility standards') },
      { title: t('Geliştirici teslim dosyaları', 'Developer handoff files') },
    ],
    overviewSteps: [
      { title: t('Keşif ve persona çalışması', 'Discovery and personas') },
      { title: t('Bilgi mimarisi', 'Information architecture') },
      { title: t('Wireframe ve prototip', 'Wireframes and prototypes') },
      { title: t('Görsel tasarım ve bileşenler', 'Visual design and components') },
      { title: t('Kullanılabilirlik testi', 'Usability testing') },
    ],
    architecture: {
      layers: [
        { title: t('Kullanıcı akışları', 'User flows') },
        { title: t('Wireframe iskeleti', 'Wireframe skeleton') },
        { title: t('Görsel arayüz', 'Visual interface') },
        { title: t('Tasarım sistemi', 'Design system') },
        { title: t('Prototip etkileşimleri', 'Prototype interactions') },
      ],
      sides: [
        { title: t('Figma', 'Figma') },
        { title: t('Design tokens', 'Design tokens') },
        { title: t('Storybook', 'Storybook') },
        { title: t('Analytics ısı haritaları', 'Analytics heatmaps') },
      ],
    },
    why: [
      {
        title: t('Kullanıcı merkezli yaklaşım', 'User-centered approach'),
        text: t('Tasarım kararlarını gerçek kullanıcı görevleriyle test ederiz.', 'We validate design decisions against real user tasks.'),
      },
      {
        title: t('Dönüşüm netliği', 'Conversion clarity'),
        text: t('CTA, hiyerarşi ve boşluk kullanımı aksiyonu yönlendirir.', 'CTA placement, hierarchy, and spacing guide action.'),
      },
      {
        title: t('Tutarlı marka deneyimi', 'Consistent brand experience'),
        text: t('Bileşen kütüphanesi tüm ekranlarda aynı dili korur.', 'A component library keeps the same language across screens.'),
      },
      {
        title: t('Geliştirmeye hazır teslimat', 'Development-ready delivery'),
        text: t('Spacing, renk ve tipografi token’ları kod ekibine aktarılır.', 'Spacing, color, and typography tokens are handed to engineering.'),
      },
      {
        title: t('Erişilebilir arayüz', 'Accessible interface'),
        text: t('Kontrast, odak durumları ve okunabilirlik standartlara uygun planlanır.', 'Contrast, focus states, and readability meet accessibility standards.'),
      },
    ],
    outcomes: [
      {
        title: t('Anlaşılır ürün akışları', 'Clear product flows'),
        text: t('Kullanıcılar görevlerini daha az adımda tamamlar.', 'Users complete tasks in fewer steps.'),
      },
      {
        title: t('Profesyonel görsel kimlik', 'Professional visual identity'),
        text: t('Arayüz markanızı dijitalde tutarlı yansıtır.', 'The interface reflects your brand consistently online.'),
      },
      {
        title: t('Test edilmiş prototipler', 'Tested prototypes'),
        text: t('Geliştirmeden önce riskli kararlar doğrulanır.', 'Risky decisions are validated before development.'),
      },
      {
        title: t('Ölçeklenebilir bileşenler', 'Scalable components'),
        text: t('Yeni ekranlar mevcut tasarım sisteminden hızla üretilir.', 'New screens are built quickly from the existing design system.'),
      },
      {
        title: t('Azaltılmış revizyon maliyeti', 'Reduced revision cost'),
        text: t('Erken prototipleme kodda pahalı değişiklikleri önler.', 'Early prototyping prevents costly code changes later.'),
      },
      {
        title: t('Geliştirici verimliliği', 'Developer efficiency'),
        text: t('Net spesifikasyonlar teslim süresini kısaltır.', 'Clear specs shorten delivery time.'),
      },
    ],
    process: [
      {
        title: t('Araştırma oturumları', 'Research sessions'),
        text: t('Kullanıcı ihtiyaçlarını ve mevcut sorunları dinleriz.', 'We listen to user needs and current pain points.'),
      },
      {
        title: t('Akış diyagramları', 'Flow diagrams'),
        text: t('Görev yollarını ve bilgi mimarisini çizeriz.', 'We map task paths and information architecture.'),
      },
      {
        title: t('Düşük ve yüksek çözünürlük', 'Low and high fidelity'),
        text: t('Wireframe’den piksel mükemmel tasarıma ilerleriz.', 'We progress from wireframes to pixel-perfect design.'),
      },
      {
        title: t('Prototip testi', 'Prototype testing'),
        text: t('Gerçek kullanıcılarla tıklanabilir sürümü doğrularız.', 'We validate clickable versions with real users.'),
      },
      {
        title: t('Tasarım sistemi', 'Design system'),
        text: t('Bileşen, renk ve tipografi kütüphanesini tamamlarız.', 'We finalize component, color, and typography libraries.'),
      },
      {
        title: t('Handoff', 'Handoff'),
        text: t('Geliştirici notları ve asset’leri teslim ederiz.', 'We deliver developer notes and assets.'),
      },
    ],
    ctaTitle: t('Kullanıcı odaklı arayüz tasarımına başlayalım', 'Start user-centered interface design'),
    ctaText: t(
      'Ürününüzü ve hedef kitlenizi anlatalım; prototip odaklı bir tasarım planı çıkaralım.',
      'Tell us about your product and audience—we will propose a prototype-led design plan.',
    ),
  },
  'yazilim-danismanligi': {
    visual: 'consulting',
    trust: [
      { title: t('Bağımsız teknik denetim', 'Independent technical audit') },
      { title: t('Bulut maliyet optimizasyonu', 'Cloud cost optimization') },
      { title: t('Güvenlik odaklı inceleme', 'Security-focused review') },
      { title: t('CI/CD ve DevOps rehberliği', 'CI/CD and DevOps guidance') },
    ],
    overviewSteps: [
      { title: t('Mevcut sistem envanteri', 'Current system inventory') },
      { title: t('Risk ve borç analizi', 'Risk and debt analysis') },
      { title: t('Mimari yol haritası', 'Architecture roadmap') },
      { title: t('Öncelikli iyileştirmeler', 'Priority improvements') },
      { title: t('Sürekli mentorluk', 'Ongoing mentorship') },
    ],
    architecture: {
      layers: [
        { title: t('Uygulama katmanı', 'Application layer') },
        { title: t('Veri ve depolama', 'Data and storage') },
        { title: t('Kimlik ve erişim', 'Identity and access') },
        { title: t('Dağıtım pipeline', 'Deployment pipeline') },
        { title: t('Gözlemleme ve uyarı', 'Observability and alerts') },
      ],
      sides: [
        { title: t('AWS / Vercel', 'AWS / Vercel') },
        { title: t('PostgreSQL', 'PostgreSQL') },
        { title: t('Docker', 'Docker') },
        { title: t('GitHub Actions', 'GitHub Actions') },
        { title: t('Sentry', 'Sentry') },
      ],
    },
    why: [
      {
        title: t('Doğru teknoloji seçimi', 'Right technology choices'),
        text: t('Hype yerine iş hedefinize uygun araçları öneririz.', 'We recommend tools that fit your goals—not hype.'),
      },
      {
        title: t('Maliyet kontrolü', 'Cost control'),
        text: t('Bulut ve lisans harcamalarında gereksiz kalemleri tespit ederiz.', 'We identify unnecessary cloud and license spend.'),
      },
      {
        title: t('Güvenlik farkındalığı', 'Security awareness'),
        text: t('Yetki, şifreleme ve güncelleme açıklarını erken görürsünüz.', 'You spot permission, encryption, and patch gaps early.'),
      },
      {
        title: t('Ekip hızlandırma', 'Team acceleration'),
        text: t('İç geliştirici ekibinize süreç ve mimari mentorluk sağlarız.', 'We mentor your in-house team on process and architecture.'),
      },
      {
        title: t('Ölçeklenebilir plan', 'Scalable plan'),
        text: t('Bugünkü ihtiyaçla gelecekteki büyümeyi dengeleyen yol haritası çizeriz.', 'We draw a roadmap balancing today’s needs with future growth.'),
      },
    ],
    outcomes: [
      {
        title: t('Net teknik yön', 'Clear technical direction'),
        text: t('Kararsızlık yerine yazılı mimari öneriler elde edersiniz.', 'You get written architecture recommendations instead of guesswork.'),
      },
      {
        title: t('Azaltılmış teknik borç', 'Reduced technical debt'),
        text: t('Kritik refactor alanları önceliklendirilir.', 'Critical refactor areas are prioritized.'),
      },
      {
        title: t('Güvenli dağıtım', 'Safer releases'),
        text: t('CI/CD ve test pratikleri otomatik kontroller sağlar.', 'CI/CD and testing practices add automated checks.'),
      },
      {
        title: t('Operasyonel görünürlük', 'Operational visibility'),
        text: t('Log, metrik ve uyarı sistemleri sorunları erken gösterir.', 'Logs, metrics, and alerts surface issues early.'),
      },
      {
        title: t('Verimli bulut kullanımı', 'Efficient cloud usage'),
        text: t('Kaynak boyutlandırma ve önbellek kararları maliyeti düşürür.', 'Right-sizing and caching decisions lower costs.'),
      },
      {
        title: t('Güven veren yatırım', 'Confident investment'),
        text: t('Yazılım bütçesi kanıta dayalı kararlarla harcanır.', 'Software budget is spent on evidence-based decisions.'),
      },
    ],
    process: [
      {
        title: t('Kick-off ve kapsam', 'Kick-off and scope'),
        text: t('Sistemler, ekip ve acil sorunları haritalarız.', 'We map systems, team, and urgent issues.'),
      },
      {
        title: t('Derinlemesine denetim', 'In-depth audit'),
        text: t('Kod, altyapı, güvenlik ve performansı inceleriz.', 'We review code, infrastructure, security, and performance.'),
      },
      {
        title: t('Bulgu raporu', 'Findings report'),
        text: t('Risk, etki ve öneri listesini paylaşırız.', 'We share a list of risks, impact, and recommendations.'),
      },
      {
        title: t('Yol haritası atölyesi', 'Roadmap workshop'),
        text: t('Öncelikleri iş değerine göre sıralarız.', 'We prioritize by business value.'),
      },
      {
        title: t('Uygulama desteği', 'Implementation support'),
        text: t('Seçilen iyileştirmelerde ekibinize eşlik ederiz.', 'We guide your team through chosen improvements.'),
      },
      {
        title: t('Periyodik gözden geçirme', 'Periodic review'),
        text: t('Üç aylık kontrollerle ilerlemeyi ölçeriz.', 'We measure progress through quarterly check-ins.'),
      },
    ],
    ctaTitle: t('Yazılım kararlarınızı birlikte netleştirelim', 'Clarify your software decisions together'),
    ctaText: t(
      'Mevcut altyapınızı paylaşın; bağımsız bir denetim ve yol haritası önerelim.',
      'Share your current stack—we will propose an independent audit and roadmap.',
    ),
  },
  'web-yazilim-gelistirme': {
    visual: 'software',
    trust: [
      { title: t('Rol bazlı erişim kontrolü', 'Role-based access control') },
      { title: t('API-first mimari', 'API-first architecture') },
      { title: t('Responsive yönetim panelleri', 'Responsive admin panels') },
      { title: t('Ölçeklenebilir veritabanı tasarımı', 'Scalable database design') },
    ],
    overviewSteps: [
      { title: t('İş süreci ve rol analizi', 'Process and role analysis') },
      { title: t('Veri modeli tasarımı', 'Data model design') },
      { title: t('Arayüz ve panel prototipi', 'Interface and panel prototype') },
      { title: t('Modüler geliştirme', 'Modular development') },
      { title: t('Entegrasyon ve canlıya alma', 'Integration and go-live') },
    ],
    architecture: {
      layers: [
        { title: t('Web arayüzü', 'Web interface') },
        { title: t('Uygulama servisleri', 'Application services') },
        { title: t('Yetkilendirme', 'Authorization') },
        { title: t('Veritabanı', 'Database') },
        { title: t('API katmanı', 'API layer') },
      ],
      sides: [
        { title: t('Ödeme API', 'Payment API') },
        { title: t('ERP bağlantısı', 'ERP connection') },
        { title: t('E-posta / SMS', 'Email / SMS') },
        { title: t('Dosya depolama', 'File storage') },
        { title: t('Harici raporlama', 'External reporting') },
      ],
    },
    why: [
      {
        title: t('Statik siteden öte', 'Beyond static sites'),
        text: t('Giriş, veri ve iş kuralı gerektiren süreçler için dinamik uygulama kurarız.', 'We build dynamic apps for processes that need login, data, and business rules.'),
      },
      {
        title: t('Çok kullanıcılı güvenlik', 'Multi-user security'),
        text: t('Her rolün gördüğü veri ve yapabildiği işlem ayrıntılı tanımlanır.', 'Each role’s visible data and allowed actions are defined in detail.'),
      },
      {
        title: t('Entegrasyon hazırlığı', 'Integration readiness'),
        text: t('API katmanı üçüncü taraf sistemlere bağlanmayı kolaylaştırır.', 'An API layer makes connecting third-party systems straightforward.'),
      },
      {
        title: t('Operasyonel panel', 'Operational panel'),
        text: t('Yöneticiler süreçleri tarayıcıdan anlık izler.', 'Managers monitor processes in real time from the browser.'),
      },
      {
        title: t('Uzun vadeli bakım', 'Long-term maintainability'),
        text: t('Modüler kod yapısı yeni özellik eklemeyi hızlandırır.', 'Modular code speeds up adding new features.'),
      },
    ],
    outcomes: [
      {
        title: t('Merkezi iş uygulaması', 'Central business application'),
        text: t('Dağınık araçlar yerine tek web platformu kullanırsınız.', 'You use one web platform instead of scattered tools.'),
      },
      {
        title: t('Güvenli kullanıcı yönetimi', 'Secure user management'),
        text: t('Kayıt, oturum ve rol atamaları kontrollü yürür.', 'Registration, sessions, and role assignment run under control.'),
      },
      {
        title: t('Gerçek zamanlı operasyon', 'Real-time operations'),
        text: t('Durum güncellemeleri ekipler arasında anında görünür.', 'Status updates are visible across teams instantly.'),
      },
      {
        title: t('Raporlanabilir veri', 'Reportable data'),
        text: t('İşlem geçmişi analiz ve denetim için saklanır.', 'Transaction history is stored for analysis and audit.'),
      },
      {
        title: t('Mobil erişim', 'Mobile access'),
        text: t('Responsive tasarım saha ve ofis kullanımını destekler.', 'Responsive design supports field and office use.'),
      },
      {
        title: t('Genişletilebilir platform', 'Extensible platform'),
        text: t('Yeni modüller mevcut mimariye eklenerek büyür.', 'New modules grow on the existing architecture.'),
      },
    ],
    process: [
      {
        title: t('İhtiyaç analizi', 'Needs analysis'),
        text: t('Kullanıcı rolleri ve iş akışlarını dokümante ederiz.', 'We document user roles and workflows.'),
      },
      {
        title: t('Mimari tasarım', 'Architecture design'),
        text: t('Veri modeli, API ve güvenlik kararlarını netleştiririz.', 'We clarify data model, API, and security decisions.'),
      },
      {
        title: t('UI geliştirme', 'UI development'),
        text: t('Panel ve son kullanıcı ekranlarını iteratif üretiriz.', 'We build admin and end-user screens iteratively.'),
      },
      {
        title: t('Backend geliştirme', 'Backend development'),
        text: t('İş kuralları ve entegrasyonları kodlarız.', 'We code business rules and integrations.'),
      },
      {
        title: t('Test ve güvenlik', 'Testing and security'),
        text: t('Yetki, veri bütünlüğü ve performans testlerini yaparız.', 'We run permission, data integrity, and performance tests.'),
      },
      {
        title: t('Canlıya alma', 'Go-live'),
        text: t('Veri geçişi, eğitim ve destek ile yayına geçeriz.', 'We launch with data migration, training, and support.'),
      },
    ],
    ctaTitle: t('Web yazılım projenizi planlayalım', 'Plan your web software project'),
    ctaText: t(
      'Yönetim paneli veya operasyon uygulaması ihtiyacınızı anlatalım; teknik kapsam çıkaralım.',
      'Describe your admin or operations app needs—we will define the technical scope.',
    ),
  },
  'ozel-yazilim-gelistirme': {
    visual: 'software',
    trust: [
      { title: t('İş akışına özel modüller', 'Workflow-specific modules') },
      { title: t('Dashboard ve raporlama', 'Dashboards and reporting') },
      { title: t('Sistem entegrasyonları', 'System integrations') },
      { title: t('Kaynak kod teslimi', 'Source code delivery') },
    ],
    overviewSteps: [
      { title: t('Süreç keşfi ve istisna analizi', 'Process discovery and exception analysis') },
      { title: t('Dashboard ve KPI tanımı', 'Dashboard and KPI definition') },
      { title: t('İş akışı modelleme', 'Workflow modeling') },
      { title: t('Entegrasyon tasarımı', 'Integration design') },
      { title: t('İteratif teslimat', 'Iterative delivery') },
    ],
    architecture: {
      layers: [
        { title: t('Kullanıcı arayüzü', 'User interface') },
        { title: t('İş kuralı motoru', 'Business rule engine') },
        { title: t('Workflow katmanı', 'Workflow layer') },
        { title: t('Dashboard servisi', 'Dashboard service') },
        { title: t('Entegrasyon hub', 'Integration hub') },
      ],
      sides: [
        { title: t('Muhasebe', 'Accounting') },
        { title: t('CRM', 'CRM') },
        { title: t('E-posta otomasyonu', 'Email automation') },
        { title: t('Dosya sunucusu', 'File server') },
        { title: t('BI araçları', 'BI tools') },
      ],
    },
    why: [
      {
        title: t('Paket yazılıma tam uyum', 'Exact fit beyond packaged software'),
        text: t('Hazır ürünlerin zorladığı manuel uyarlama yerine sürece göre sistem kurarız.', 'We model the system to your process—not manual workarounds around packaged tools.'),
      },
      {
        title: t('Dashboard odaklı görünürlük', 'Dashboard-led visibility'),
        text: t('Yönetim ekranları operasyonu tek bakışta özetler.', 'Management screens summarize operations at a glance.'),
      },
      {
        title: t('Esnek iş akışları', 'Flexible workflows'),
        text: t('Onay, istisna ve rol bazlı adımlar kurumunuza göre tanımlanır.', 'Approvals, exceptions, and role-based steps match your organization.'),
      },
      {
        title: t('Entegrasyon merkezi', 'Integration hub'),
        text: t('Mevcut uygulamalar tek özel platform üzerinden konuşur.', 'Existing apps communicate through one custom platform.'),
      },
      {
        title: t('Sahiplik ve kontrol', 'Ownership and control'),
        text: t('Lisans bağımlılığı olmadan ürününüzü geliştirirsiniz.', 'You evolve the product without license lock-in.'),
      },
    ],
    outcomes: [
      {
        title: t('Tam süreç uyumu', 'Full process alignment'),
        text: t('Yazılım işletmenizin gerçek adımlarına göre çalışır.', 'Software runs according to your actual business steps.'),
      },
      {
        title: t('Canlı dashboard', 'Live dashboards'),
        text: t('KPI ve durum panelleri kararları hızlandırır.', 'KPI and status panels speed up decisions.'),
      },
      {
        title: t('Otomatik veri akışı', 'Automated data flow'),
        text: t('Entegrasyonlar tekrarlayan girişi azaltır.', 'Integrations cut repetitive data entry.'),
      },
      {
        title: t('Ölçeklenebilir modüller', 'Scalable modules'),
        text: t('Yeni departman veya şube ihtiyaçları eklenerek büyür.', 'New departments or branches are added as modules.'),
      },
      {
        title: t('Denetlenebilir kayıtlar', 'Auditable records'),
        text: t('Kritik hareketler izlenebilir şekilde loglanır.', 'Critical actions are logged for traceability.'),
      },
      {
        title: t('Rekabet avantajı', 'Competitive advantage'),
        text: t('Rakiplerin kopyalayamayacağı operasyonel fark yaratır.', 'It creates operational differentiation competitors cannot copy easily.'),
      },
    ],
    process: [
      {
        title: t('Keşif atölyesi', 'Discovery workshop'),
        text: t('Mevcut araçları, darboğazları ve hedefleri birlikte çıkarırız.', 'We map current tools, bottlenecks, and goals together.'),
      },
      {
        title: t('Kapsam ve faz planı', 'Scope and phase plan'),
        text: t('MVP ve sonraki modülleri önceliklendiririz.', 'We prioritize MVP and follow-on modules.'),
      },
      {
        title: t('Tasarım ve prototip', 'Design and prototype'),
        text: t('Dashboard ve akış ekranlarını onaylatırız.', 'We get approval on dashboard and flow screens.'),
      },
      {
        title: t('Geliştirme sprintleri', 'Development sprints'),
        text: t('Her iterasyonda çalışan modül teslim ederiz.', 'Each iteration delivers a working module.'),
      },
      {
        title: t('Entegrasyon testi', 'Integration testing'),
        text: t('Harici sistemlerle veri eşlemesini doğrularız.', 'We validate data mapping with external systems.'),
      },
      {
        title: t('Devreye alma', 'Rollout'),
        text: t('Eğitim, veri geçişi ve destek ile kullanıma açarız.', 'We open for use with training, migration, and support.'),
      },
    ],
    ctaTitle: t('Size özel yazılım çözümünü tasarlayalım', 'Design your custom software solution'),
    ctaText: t(
      'Hazır paketlerin yetmediği süreçlerinizi anlatın; dashboard ve entegrasyon odaklı plan sunalım.',
      'Describe processes packaged tools cannot handle—we will propose a dashboard- and integration-led plan.',
    ),
  },
  'crm-yazilim-cozumleri': {
    visual: 'crm',
    trust: [
      { title: t('Satış pipeline yönetimi', 'Sales pipeline management') },
      { title: t('Lead takip ve atama', 'Lead tracking and assignment') },
      { title: t('Teklif ve aktivite kayıtları', 'Proposal and activity records') },
      { title: t('Rol bazlı satış raporları', 'Role-based sales reports') },
    ],
    overviewSteps: [
      { title: t('Satış süreci haritalama', 'Sales process mapping') },
      { title: t('Lead ve pipeline tanımı', 'Lead and pipeline definition') },
      { title: t('Teklif modülü tasarımı', 'Proposal module design') },
      { title: t('Aktivite ve hatırlatma akışı', 'Activity and reminder flow') },
      { title: t('Entegrasyon ve eğitim', 'Integration and training') },
    ],
    architecture: {
      layers: [
        { title: t('Müşteri ve firma kayıtları', 'Account and company records') },
        { title: t('Lead yönetimi', 'Lead management') },
        { title: t('Pipeline ve fırsatlar', 'Pipeline and opportunities') },
        { title: t('Teklif ve aktiviteler', 'Proposals and activities') },
        { title: t('Raporlama katmanı', 'Reporting layer') },
      ],
      sides: [
        { title: t('E-posta', 'Email') },
        { title: t('ERP sipariş', 'ERP orders') },
        { title: t('Takvim', 'Calendar') },
        { title: t('Telefon / VoIP', 'Phone / VoIP') },
        { title: t('Pazarlama otomasyonu', 'Marketing automation') },
      ],
    },
    why: [
      {
        title: t('Kayıp fırsatları önleme', 'Prevent lost opportunities'),
        text: t('Lead’ler pipeline aşamalarında sahipsiz kalmaz.', 'Leads do not sit unowned in pipeline stages.'),
      },
      {
        title: t('Teklif disiplini', 'Proposal discipline'),
        text: t('Versiyonlu teklifler ve onay geçmişi tek yerde tutulur.', 'Versioned proposals and approval history live in one place.'),
      },
      {
        title: t('Aktivite görünürlüğü', 'Activity visibility'),
        text: t('Arama, toplantı ve e-posta kayıtları müşteri geçmişine bağlanır.', 'Calls, meetings, and emails attach to customer history.'),
      },
      {
        title: t('Satış tahmini', 'Sales forecasting'),
        text: t('Pipeline olasılıkları dönem hedeflerini destekler.', 'Pipeline probabilities support period targets.'),
      },
      {
        title: t('Kuruma özel terminoloji', 'Organization-specific terminology'),
        text: t('Hazır CRM’de zorlanan alan adları ve aşamalar size göre modellenir.', 'Field names and stages are modeled to your sales language—not forced from a generic CRM.'),
      },
    ],
    outcomes: [
      {
        title: t('Tek satış kaynağı', 'Single source of sales truth'),
        text: t('Müşteri, lead ve fırsat verisi dağınık tablolardan çıkar.', 'Customer, lead, and opportunity data leave scattered spreadsheets.'),
      },
      {
        title: t('Hızlı lead yanıtı', 'Faster lead response'),
        text: t('Atama ve hatırlatmalar ilk temas süresini kısaltır.', 'Assignment and reminders shorten time to first contact.'),
      },
      {
        title: t('Tekliften siparişe iz', 'Proposal-to-order trace'),
        text: t('Onaylanan teklifler operasyon sistemine aktarılabilir.', 'Approved proposals can flow into operations systems.'),
      },
      {
        title: t('Ekip performansı', 'Team performance'),
        text: t('Aktivite ve kapanış metrikleri yönetici panelinde görünür.', 'Activity and close metrics appear on manager dashboards.'),
      },
      {
        title: t('Müşteri geçmişi', 'Customer history'),
        text: t('Tüm temas noktaları tek müşteri kartında birleşir.', 'Every touchpoint merges on one customer record.'),
      },
      {
        title: t('Ölçeklenebilir satış', 'Scalable sales'),
        text: t('Yeni ekip ve bölge eklemek mevcut pipeline yapısını bozmaz.', 'Adding teams or regions does not break the pipeline model.'),
      },
    ],
    process: [
      {
        title: t('Satış akışı analizi', 'Sales flow analysis'),
        text: t('Lead kaynakları, aşamalar ve onayları birlikte tanımlarız.', 'We define lead sources, stages, and approvals together.'),
      },
      {
        title: t('Veri modeli', 'Data model'),
        text: t('Firma, kişi, fırsat ve aktivite ilişkilerini kurarız.', 'We establish company, contact, opportunity, and activity relationships.'),
      },
      {
        title: t('Pipeline kurulumu', 'Pipeline setup'),
        text: t('Aşama, olasılık ve sorumlu kurallarını yapılandırırız.', 'We configure stage, probability, and owner rules.'),
      },
      {
        title: t('Teklif modülü', 'Proposal module'),
        text: t('Şablon, revizyon ve onay akışlarını geliştiririz.', 'We build template, revision, and approval flows.'),
      },
      {
        title: t('Entegrasyon', 'Integration'),
        text: t('E-posta, ERP ve pazarlama araçlarını bağlarız.', 'We connect email, ERP, and marketing tools.'),
      },
      {
        title: t('Ekip eğitimi', 'Team training'),
        text: t('Satış ekibine aktivite disiplini ve rapor kullanımını öğretiriz.', 'We train sales on activity discipline and reporting.'),
      },
    ],
    ctaTitle: t('Satış süreçleriniz için özel CRM kuralım', 'Build a custom CRM for your sales process'),
    ctaText: t(
      'Pipeline, lead, teklif ve aktivite ihtiyaçlarınızı paylaşın; CRM mimarisini birlikte tasarlayalım.',
      'Share your pipeline, lead, proposal, and activity needs—we will design the CRM architecture together.',
    ),
  },
  'erp-yazilim-cozumleri': {
    visual: 'erp',
    trust: [
      { title: t('Finans ve cari entegrasyonu', 'Finance and ledger integration') },
      { title: t('Stok ve depo yönetimi', 'Stock and warehouse management') },
      { title: t('Satın alma onay akışları', 'Purchasing approval flows') },
      { title: t('Operasyon modülleri', 'Operations modules') },
    ],
    overviewSteps: [
      { title: t('Departman süreç analizi', 'Department process analysis') },
      { title: t('Ortak veri modeli', 'Shared data model') },
      { title: t('Finans ve stok modülleri', 'Finance and inventory modules') },
      { title: t('Satın alma ve operasyon', 'Purchasing and operations') },
      { title: t('Aşamalı devreye alma', 'Phased rollout') },
    ],
    architecture: {
      layers: [
        { title: t('Finans ve cari', 'Finance and accounts') },
        { title: t('Stok ve depo', 'Inventory and warehouse') },
        { title: t('Satın alma', 'Purchasing') },
        { title: t('Satış ve sipariş', 'Sales and orders') },
        { title: t('Operasyon ve üretim', 'Operations and production') },
      ],
      sides: [
        { title: t('Muhasebe yazılımı', 'Accounting software') },
        { title: t('Banka entegrasyonu', 'Bank integration') },
        { title: t('E-fatura', 'E-invoice') },
        { title: t('CRM', 'CRM') },
        { title: t('BI raporlama', 'BI reporting') },
      ],
    },
    why: [
      {
        title: t('Tek veri gerçeği', 'Single source of truth'),
        text: t('Finans, stok ve operasyon aynı güncel kayıtları kullanır.', 'Finance, inventory, and operations share the same live records.'),
      },
      {
        title: t('Satın alma kontrolü', 'Purchasing control'),
        text: t('Talep, teklif toplama ve onay zinciri şeffaf yürür.', 'Requisition, quote collection, and approval chains run transparently.'),
      },
      {
        title: t('Stok doğruluğu', 'Inventory accuracy'),
        text: t('Depo hareketleri anında merkezi stoğu günceller.', 'Warehouse movements update central stock immediately.'),
      },
      {
        title: t('Operasyon görünürlüğü', 'Operations visibility'),
        text: t('İş emri, kapasite ve teslimat durumu izlenebilir.', 'Work orders, capacity, and delivery status are trackable.'),
      },
      {
        title: t('Modüler büyüme', 'Modular growth'),
        text: t('Önce kritik departmanlarla başlayıp kademeli genişlersiniz.', 'You start with critical departments and expand in phases.'),
      },
    ],
    outcomes: [
      {
        title: t('Birleşik finans görünümü', 'Unified finance view'),
        text: t('Cari, tahsilat ve maliyet verileri tek panelde toplanır.', 'Receivables, collections, and cost data gather in one panel.'),
      },
      {
        title: t('Kontrollü satın alma', 'Controlled purchasing'),
        text: t('Bütçe ve yetki kuralları harcamayı yönlendirir.', 'Budget and authority rules guide spending.'),
      },
      {
        title: t('Depo verimliliği', 'Warehouse efficiency'),
        text: t('Transfer, sayım ve rezervasyon süreçleri standartlaşır.', 'Transfer, count, and reservation processes standardize.'),
      },
      {
        title: t('Operasyonel uyum', 'Operational alignment'),
        text: t('Satış değişiklikleri stok ve üretime yansır.', 'Sales changes reflect in inventory and production.'),
      },
      {
        title: t('Yönetim raporları', 'Management reporting'),
        text: t('Departman performansı karşılaştırılabilir hale gelir.', 'Department performance becomes comparable.'),
      },
      {
        title: t('Denetim hazırlığı', 'Audit readiness'),
        text: t('Onay ve hareket kayıtları izlenebilir saklanır.', 'Approval and movement logs are stored traceably.'),
      },
    ],
    process: [
      {
        title: t('Süreç haritalama', 'Process mapping'),
        text: t('Finans, stok, satın alma ve operasyon akışlarını çıkarırız.', 'We map finance, inventory, purchasing, and operations flows.'),
      },
      {
        title: t('Veri modeli atölyesi', 'Data model workshop'),
        text: t('Ortak tanımlar ve kod yapısını belirleriz.', 'We define shared definitions and coding structure.'),
      },
      {
        title: t('Modül geliştirme', 'Module development'),
        text: t('Öncelikli departman modüllerini iteratif teslim ederiz.', 'We deliver priority department modules iteratively.'),
      },
      {
        title: t('Muhasebe entegrasyonu', 'Accounting integration'),
        text: t('Finans verisini mevcut muhasebe ile eşleriz.', 'We map financial data to existing accounting systems.'),
      },
      {
        title: t('Pilot kullanım', 'Pilot usage'),
        text: t('Seçili şube veya departmanla canlı test yaparız.', 'We run live tests with a selected branch or department.'),
      },
      {
        title: t('Kurumsal yayılım', 'Enterprise rollout'),
        text: t('Eğitim ve veri geçişiyle tüm birimlere açarız.', 'We open to all units with training and data migration.'),
      },
    ],
    ctaTitle: t('ERP ihtiyaçlarınızı birlikte modelleyelim', 'Model your ERP requirements together'),
    ctaText: t(
      'Finans, stok, satın alma ve operasyon süreçlerinizi paylaşın; modüler ERP planı oluşturalım.',
      'Share your finance, inventory, purchasing, and operations processes—we will draft a modular ERP plan.',
    ),
  },
  'e-ticaret-yazilimi': {
    visual: 'commerce',
    trust: [
      { title: t('Özel ürün ve fiyat kuralları', 'Custom product and pricing rules') },
      { title: t('Stok rezervasyon motoru', 'Stock reservation engine') },
      { title: t('Çoklu ödeme yöntemi', 'Multiple payment methods') },
      { title: t('Kargo ve iade yönetimi', 'Shipping and returns management') },
    ],
    overviewSteps: [
      { title: t('Satış modeli analizi', 'Sales model analysis') },
      { title: t('Katalog ve checkout tasarımı', 'Catalog and checkout design') },
      { title: t('Ödeme ve stok entegrasyonu', 'Payment and inventory integration') },
      { title: t('Operasyon paneli', 'Operations panel') },
      { title: t('Performans optimizasyonu', 'Performance optimization') },
    ],
    architecture: {
      layers: [
        { title: t('Ürün kataloğu', 'Product catalog') },
        { title: t('Fiyat ve kampanya motoru', 'Pricing and promotion engine') },
        { title: t('Sepet ve checkout', 'Cart and checkout') },
        { title: t('Stok ve sipariş', 'Inventory and orders') },
        { title: t('Ödeme ve kargo', 'Payments and shipping') },
      ],
      sides: [
        { title: t('Sanal POS', 'Virtual POS') },
        { title: t('ERP stok', 'ERP inventory') },
        { title: t('Pazaryeri API', 'Marketplace API') },
        { title: t('Kargo API', 'Shipping API') },
        { title: t('CRM müşteri', 'CRM customers') },
      ],
    },
    why: [
      {
        title: t('Hazır paket sınırlarını aşma', 'Beyond off-the-shelf limits'),
        text: t('Özel fiyat, B2B checkout veya karma kanal ihtiyaçları için yazılım tasarlarız.', 'We design software for custom pricing, B2B checkout, or hybrid channel needs.'),
      },
      {
        title: t('Stok tutarlılığı', 'Stock consistency'),
        text: t('Rezervasyon kuralları aynı anda satılabilir adeti korur.', 'Reservation rules protect sellable quantity across channels.'),
      },
      {
        title: t('Güvenli ödeme akışı', 'Secure payment flow'),
        text: t(
          'Ürün, stok kontrolü ve ödeme adımları kontrollü sırayla işler.',
          'Product, stock check, and payment steps run in a controlled sequence.',
        ),
      },
      {
        title: t('Operasyon paneli', 'Operations console'),
        text: t('Sipariş, iade ve kargo durumu tek ekrandan yönetilir.', 'Orders, returns, and shipping status are managed from one screen.'),
      },
      {
        title: t('Ölçeklenebilir altyapı', 'Scalable infrastructure'),
        text: t('Kampanya dönemlerinde trafik artışına hazır mimari kurarız.', 'We build architecture ready for traffic spikes during campaigns.'),
      },
    ],
    outcomes: [
      {
        title: t('Modele özel mağaza', 'Model-specific storefront'),
        text: t('B2B, B2C veya abonelik kuralları yazılıma gömülür.', 'B2B, B2C, or subscription rules are embedded in the software.'),
      },
      {
        title: t('Doğru stok görünümü', 'Accurate stock display'),
        text: t('Müşteriler yalnızca gerçekten satılabilir ürünleri görür.', 'Customers see only genuinely available products.'),
      },
      {
        title: t('Güvenilir tahsilat', 'Reliable collection'),
        text: t('Ödeme onayı sipariş durumunu otomatik günceller.', 'Payment confirmation updates order status automatically.'),
      },
      {
        title: t('Hızlı kargo süreci', 'Faster shipping workflow'),
        text: t('Etiket ve takip kodu üretimi otomatikleşir.', 'Label and tracking code generation is automated.'),
      },
      {
        title: t('Kanal senkronu', 'Channel synchronization'),
        text: t('Pazaryeri siparişleri merkezi stokla uyumlu kalır.', 'Marketplace orders stay aligned with central inventory.'),
      },
      {
        title: t('Satış analitiği', 'Sales analytics'),
        text: t('Ürün, kanal ve kampanya performansını ölçersiniz.', 'You measure product, channel, and campaign performance.'),
      },
    ],
    process: [
      {
        title: t('İş modeli atölyesi', 'Business model workshop'),
        text: t('Ürün, fiyat, stok ve ödeme kurallarını netleştiririz.', 'We clarify product, pricing, inventory, and payment rules.'),
      },
      {
        title: t('Mimari ve veri modeli', 'Architecture and data model'),
        text: t('Katalog, sipariş ve stok yapısını tasarlarız.', 'We design catalog, order, and inventory structure.'),
      },
      {
        title: t('Mağaza geliştirme', 'Storefront development'),
        text: t('Vitrin, sepet ve checkout ekranlarını kodlarız.', 'We code storefront, cart, and checkout screens.'),
      },
      {
        title: t('Ödeme entegrasyonu', 'Payment integration'),
        text: t('Sanal POS ve alternatif ödeme yöntemlerini bağlarız.', 'We connect virtual POS and alternative payment methods.'),
      },
      {
        title: t('Lojistik bağlantısı', 'Logistics connection'),
        text: t('Kargo firmaları ve depo stok kaynaklarını entegre ederiz.', 'We integrate couriers and warehouse stock sources.'),
      },
      {
        title: t('Canlı satış ve izleme', 'Live sales and monitoring'),
        text: t('Yayına alır, sipariş ve stok uyarılarını yapılandırırız.', 'We go live and configure order and stock alerts.'),
      },
    ],
    ctaTitle: t('Özel e-ticaret yazılımınızı geliştirelim', 'Develop your custom e-commerce software'),
    ctaText: t(
      'Ürün, stok, ödeme ve kargo gereksinimlerinizi anlatalım; size özel altyapı tasarlayalım.',
      'Tell us your product, inventory, payment, and shipping requirements—we will design a custom platform.',
    ),
  },
  'kurumsal-web-uygulamalari': {
    visual: 'software',
    trust: [
      { title: t('Kurumsal kimlik entegrasyonu', 'Corporate identity integration') },
      { title: t('Rol bazlı intranet', 'Role-based intranet') },
      { title: t('Belge ve onay akışları', 'Document and approval flows') },
      { title: t('Kayıt izi ve denetim', 'Audit trail and logging') },
    ],
    overviewSteps: [
      { title: t('Kullanıcı rol haritası', 'User role mapping') },
      { title: t('Self-servis ekran tasarımı', 'Self-service screen design') },
      { title: t('Kimlik doğrulama kurulumu', 'Authentication setup') },
      { title: t('Modül geliştirme', 'Module development') },
      { title: t('Kurumsal yayın', 'Enterprise launch') },
    ],
    architecture: {
      layers: [
        { title: t('Portal arayüzü', 'Portal interface') },
        { title: t('Kimlik ve SSO', 'Identity and SSO') },
        { title: t('Talep yönetimi', 'Request management') },
        { title: t('Belge deposu', 'Document repository') },
        { title: t('Bildirim servisi', 'Notification service') },
      ],
      sides: [
        { title: t('Active Directory / SSO', 'Active Directory / SSO') },
        { title: t('E-posta', 'Email') },
        { title: t('ERP', 'ERP') },
        { title: t('İK sistemi', 'HR system') },
      ],
    },
    why: [
      {
        title: t('Kurum içi verimlilik', 'Internal efficiency'),
        text: t('Çalışanlar talep ve belgelere tarayıcıdan erişir.', 'Employees access requests and documents from the browser.'),
      },
      {
        title: t('Güvenli erişim', 'Secure access'),
        text: t('Departman ve rol bazlı yetkilendirme hassas veriyi korur.', 'Department and role permissions protect sensitive data.'),
      },
      {
        title: t('E-posta yükünü azaltma', 'Less email overload'),
        text: t('Onay ve talep süreçleri yapılandırılmış akışlara taşınır.', 'Approvals and requests move into structured flows.'),
      },
      {
        title: t('Uzaktan çalışma desteği', 'Remote work support'),
        text: t('Responsive arayüz ofis dışı kullanımı mümkün kılar.', 'Responsive UI enables use outside the office.'),
      },
      {
        title: t('Merkezi bilgi', 'Centralized information'),
        text: t('Duyuru, prosedür ve formlar tek portalda toplanır.', 'Announcements, procedures, and forms live in one portal.'),
      },
    ],
    outcomes: [
      {
        title: t('Dijital çalışma alanı', 'Digital workspace'),
        text: t('Ekipler ortak süreçleri tek uygulamada yürütür.', 'Teams run shared processes in one application.'),
      },
      {
        title: t('Hızlı onay döngüsü', 'Faster approval cycles'),
        text: t('Bekleyen talepler görünür ve takip edilebilir.', 'Pending requests are visible and trackable.'),
      },
      {
        title: t('Belge güvenliği', 'Document security'),
        text: t('Versiyon ve erişim kuralları kontrollü uygulanır.', 'Version and access rules are enforced consistently.'),
      },
      {
        title: t('Denetlenebilir işlemler', 'Auditable transactions'),
        text: t('Kritik hareketler kim tarafından ne zaman yapıldı kayıt altına alınır.', 'Critical actions record who did what and when.'),
      },
      {
        title: t('Entegre operasyon', 'Integrated operations'),
        text: t('ERP ve İK verisi portal ekranlarına yansıtılabilir.', 'ERP and HR data can surface in portal screens.'),
      },
      {
        title: t('Ölçeklenebilir kullanıcı tabanı', 'Scalable user base'),
        text: t('Yeni departman ve şube eklemek mimariyi bozmaz.', 'Adding departments or branches does not break the architecture.'),
      },
    ],
    process: [
      {
        title: t('Kullanıcı araştırması', 'User research'),
        text: t('Çalışan görevlerini ve mevcut araçları inceleriz.', 'We study employee tasks and current tools.'),
      },
      {
        title: t('Bilgi mimarisi', 'Information architecture'),
        text: t('Menü, rol ve self-servis yapısını tasarlarız.', 'We design menu, role, and self-service structure.'),
      },
      {
        title: t('Kimlik entegrasyonu', 'Identity integration'),
        text: t('SSO veya kurumsal dizin bağlantısını kurarız.', 'We set up SSO or corporate directory connection.'),
      },
      {
        title: t('Modül geliştirme', 'Module development'),
        text: t('Talep, belge ve duyuru modüllerini teslim ederiz.', 'We deliver request, document, and announcement modules.'),
      },
      {
        title: t('Güvenlik testi', 'Security testing'),
        text: t('Yetki, oturum ve veri sızıntısı senaryolarını doğrularız.', 'We validate permission, session, and data leakage scenarios.'),
      },
      {
        title: t('Kurumsal devreye alma', 'Enterprise rollout'),
        text: t('Pilot birimden tüm kuruma eğitimli geçiş yaparız.', 'We roll out from a pilot unit to the whole organization with training.'),
      },
    ],
    ctaTitle: t('Kurumsal web uygulamanızı tasarlayalım', 'Design your enterprise web application'),
    ctaText: t(
      'İntranet, talep veya self-servis ihtiyaçlarınızı paylaşın; güvenli portal mimarisi önerelim.',
      'Share your intranet, request, or self-service needs—we will propose a secure portal architecture.',
    ),
  },
  'mobil-uygulama-gelistirme': {
    visual: 'mobile',
    trust: [
      { title: t('Saha ve müşteri uygulamaları', 'Field and customer apps') },
      { title: t('Offline senaryo desteği', 'Offline scenario support') },
      { title: t('Backend panel entegrasyonu', 'Backend panel integration') },
      { title: t('Mağaza inceleme yönetimi', 'Store review management') },
    ],
    overviewSteps: [
      { title: t('Kullanıcı segmenti analizi', 'User segment analysis') },
      { title: t('Mobil akış tasarımı', 'Mobile flow design') },
      { title: t('API ve senkronizasyon', 'API and synchronization') },
      { title: t('Cihaz test matrisi', 'Device test matrix') },
      { title: t('Mağaza yayını', 'Store release') },
    ],
    architecture: {
      layers: [
        { title: t('Mobil istemci', 'Mobile client') },
        { title: t('Yerel önbellek', 'Local cache') },
        { title: t('Senkronizasyon', 'Synchronization') },
        { title: t('Backend API', 'Backend API') },
        { title: t('Yönetim paneli', 'Admin panel') },
      ],
      sides: [
        { title: t('CRM', 'CRM') },
        { title: t('ERP', 'ERP') },
        { title: t('Push servisleri', 'Push services') },
        { title: t('Harita API', 'Maps API') },
        { title: t('Analitik', 'Analytics') },
      ],
    },
    why: [
      {
        title: t('Saha verisi anında', 'Field data in real time'),
        text: t('Teknisyen ve saha ekipleri veriyi kaynağında girer.', 'Technicians and field teams capture data at the source.'),
      },
      {
        title: t('Müşteri self-servisi', 'Customer self-service'),
        text: t('Sipariş, talep ve bildirimler mobilde tamamlanır.', 'Orders, requests, and notifications are handled on mobile.'),
      },
      {
        title: t('Bağlantı kopukluğu toleransı', 'Connectivity resilience'),
        text: t('Uygun senaryolarda offline çalışma desteklenir.', 'Offline use is supported where the scenario allows.'),
      },
      {
        title: t('Kurumsal entegrasyon', 'Enterprise integration'),
        text: t('Mobil uygulama mevcut web ve ERP verisiyle konuşur.', 'The mobile app talks to existing web and ERP data.'),
      },
      {
        title: t('Yönetilebilir içerik', 'Manageable content'),
        text: t('Panel üzerinden bildirim ve içerik güncellenir.', 'Notifications and content are updated through an admin panel.'),
      },
    ],
    outcomes: [
      {
        title: t('Her yerden operasyon', 'Operations anywhere'),
        text: t('Kritik işlemler ofis dışında da yürütülür.', 'Critical tasks run outside the office.'),
      },
      {
        title: t('Hızlı müşteri yanıtı', 'Faster customer response'),
        text: t('Push bildirimler zamanında bilgilendirme sağlar.', 'Push notifications deliver timely updates.'),
      },
      {
        title: t('Doğru saha kaydı', 'Accurate field records'),
        text: t('Fotoğraf, konum ve form verisi merkeze aktarılır.', 'Photos, location, and form data sync to headquarters.'),
      },
      {
        title: t('Entegre müşteri deneyimi', 'Integrated customer experience'),
        text: t('Web ve mobil aynı hesap ve veriyi paylaşır.', 'Web and mobile share the same account and data.'),
      },
      {
        title: t('Mağaza hazır ürün', 'Store-ready product'),
        text: t('App Store ve Google Play gereksinimleri karşılanır.', 'App Store and Google Play requirements are met.'),
      },
      {
        title: t('Sürdürülebilir güncelleme', 'Sustainable updates'),
        text: t('Yeni sürümler operasyon ihtiyaçlarına göre planlanır.', 'New releases are planned around operational needs.'),
      },
    ],
    process: [
      {
        title: t('Kullanım senaryoları', 'Use cases'),
        text: t('Saha, müşteri veya ekip akışlarını önceliklendiririz.', 'We prioritize field, customer, or team flows.'),
      },
      {
        title: t('Mobil UX tasarımı', 'Mobile UX design'),
        text: t('Parmak erişimi ve tek elle kullanımı optimize ederiz.', 'We optimize thumb reach and one-handed use.'),
      },
      {
        title: t('API geliştirme', 'API development'),
        text: t('Mobil istemcinin ihtiyaç duyduğu uç noktaları açarız.', 'We expose endpoints the mobile client needs.'),
      },
      {
        title: t('Uygulama geliştirme', 'App development'),
        text: t('iOS ve Android için iteratif build üretiriz.', 'We produce iterative builds for iOS and Android.'),
      },
      {
        title: t('Saha pilotu', 'Field pilot'),
        text: t('Gerçek kullanıcılarla saha testi yaparız.', 'We run field tests with real users.'),
      },
      {
        title: t('Yayın ve bakım', 'Release and maintenance'),
        text: t('Mağazaya alır, çökme ve performansı izleriz.', 'We publish to stores and monitor crashes and performance.'),
      },
    ],
    ctaTitle: t('Mobil uygulama geliştirme projenize başlayalım', 'Start your mobile app development project'),
    ctaText: t(
      'Saha, müşteri veya ekip uygulaması hedefinizi paylaşın; uçtan uca mobil plan çıkaralım.',
      'Share your field, customer, or team app goal—we will outline an end-to-end mobile plan.',
    ),
  },
  'api-sistem-entegrasyonlari': {
    visual: 'api',
    trust: [
      { title: t('REST API tasarımı', 'REST API design') },
      { title: t('Webhook olay akışları', 'Webhook event flows') },
      { title: t('Veri senkronizasyonu', 'Data synchronization') },
      { title: t('Üçüncü taraf bağlantılar', 'Third-party connections') },
    ],
    overviewSteps: [
      { title: t('Sistem envanteri', 'System inventory') },
      { title: t('Veri eşleme kuralları', 'Data mapping rules') },
      { title: t('REST ve webhook tasarımı', 'REST and webhook design') },
      { title: t('Hata ve yeniden deneme', 'Error handling and retries') },
      { title: t('Canlı izleme', 'Live monitoring') },
    ],
    architecture: {
      layers: [
        { title: t('Entegrasyon hub', 'Integration hub') },
        { title: t('REST API katmanı', 'REST API layer') },
        { title: t('Webhook dinleyicileri', 'Webhook listeners') },
        { title: t('Dönüşüm ve eşleme', 'Transformation and mapping') },
        { title: t('Kuyruk ve retry', 'Queue and retry') },
      ],
      sides: [
        { title: t('ERP', 'ERP') },
        { title: t('CRM', 'CRM') },
        { title: t('Ödeme sağlayıcı', 'Payment provider') },
        { title: t('Kargo API', 'Shipping API') },
        { title: t('Muhasebe', 'Accounting') },
        { title: t('Pazaryeri', 'Marketplace') },
      ],
    },
    why: [
      {
        title: t('Tekrarlayan girişi bitirme', 'End repetitive entry'),
        text: t('Aynı verinin birden fazla sisteme elle girilmesini önleriz.', 'We stop entering the same data manually in multiple systems.'),
      },
      {
        title: t('REST standartları', 'REST standards'),
        text: t('Okunabilir, versiyonlanabilir API sözleşmeleri tasarlarız.', 'We design readable, versioned API contracts.'),
      },
      {
        title: t('Webhook ile anlık sync', 'Real-time sync via webhooks'),
        text: t('Olay tabanlı akışlar gecikmeyi azaltır.', 'Event-driven flows reduce delay.'),
      },
      {
        title: t('Üçüncü taraf esnekliği', 'Third-party flexibility'),
        text: t('Yeni sağlayıcı eklemek hub mimarisiyle kolaylaşır.', 'Adding new providers is easier with a hub architecture.'),
      },
      {
        title: t('Hata görünürlüğü', 'Error visibility'),
        text: t('Başarısız sync işlemleri log ve uyarı ile izlenir.', 'Failed sync jobs are tracked with logs and alerts.'),
      },
    ],
    outcomes: [
      {
        title: t('Tutarlı veri', 'Consistent data'),
        text: t('Sistemler arasında güncel müşteri, ürün ve sipariş bilgisi akar.', 'Current customer, product, and order data flows between systems.'),
      },
      {
        title: t('Otomatik iş akışı', 'Automated workflow'),
        text: t('Ödeme onayı veya stok değişimi sonraki adımı tetikler.', 'Payment confirmation or stock change triggers the next step.'),
      },
      {
        title: t('Daha hızlı operasyon', 'Faster operations'),
        text: t('Manuel aktarım bekleyen süreçler kısalır.', 'Processes waiting on manual transfer shorten.'),
      },
      {
        title: t('Güvenilir entegrasyon', 'Reliable integration'),
        text: t('Retry ve kuyruk mekanizmaları geçici hataları tolere eder.', 'Retry and queue mechanisms tolerate transient failures.'),
      },
      {
        title: t('Genişletilebilir mimari', 'Extensible architecture'),
        text: t('Yeni REST uç noktası veya webhook eklemek düzenli kalır.', 'Adding new REST endpoints or webhooks stays orderly.'),
      },
      {
        title: t('Denetlenebilir sync', 'Auditable sync'),
        text: t('Her aktarım kaydı hangi verinin ne zaman gittiğini gösterir.', 'Each transfer log shows what data moved and when.'),
      },
    ],
    process: [
      {
        title: t('Sistem haritası', 'System map'),
        text: t('Kaynak, hedef ve veri alanlarını listeleriz.', 'We list sources, targets, and data fields.'),
      },
      {
        title: t('Eşleme dokümanı', 'Mapping document'),
        text: t('Alan dönüşümleri ve iş kurallarını yazılı hale getiririz.', 'We document field transforms and business rules.'),
      },
      {
        title: t('API geliştirme', 'API development'),
        text: t('REST uç noktalarını ve kimlik doğrulamayı kurarız.', 'We build REST endpoints and authentication.'),
      },
      {
        title: t('Webhook kurulumu', 'Webhook setup'),
        text: t('Olay dinleyicileri ve imza doğrulamasını yapılandırırız.', 'We configure event listeners and signature verification.'),
      },
      {
        title: t('Test senaryoları', 'Test scenarios'),
        text: t('Uçtan uca sync ve hata durumlarını doğrularız.', 'We validate end-to-end sync and failure cases.'),
      },
      {
        title: t('Prod izleme', 'Production monitoring'),
        text: t('Canlı ortamda metrik, log ve uyarı panellerini açarız.', 'We enable metrics, logs, and alert dashboards in production.'),
      },
    ],
    ctaTitle: t('Sistemlerinizi API ile birbirine bağlayalım', 'Connect your systems with APIs'),
    ctaText: t(
      'Entegre etmek istediğiniz uygulamaları paylaşın; REST, webhook ve sync planı hazırlayalım.',
      'Share the apps you want to connect—we will prepare a REST, webhook, and sync plan.',
    ),
  },
  'is-surecleri-otomasyonu': {
    visual: 'automation',
    trust: [
      { title: t('Onay zinciri otomasyonu', 'Approval chain automation') },
      { title: t('Görev atama kuralları', 'Task assignment rules') },
      { title: t('Olay tetiklemeli bildirim', 'Event-triggered notifications') },
      { title: t('İstisna yönetimi', 'Exception handling') },
    ],
    overviewSteps: [
      { title: t('Süreç madenciliği', 'Process mining') },
      { title: t('Kural ve koşul tanımı', 'Rule and condition definition') },
      { title: t('Otomasyon akış tasarımı', 'Automation flow design') },
      { title: t('Sistem bağlantıları', 'System connections') },
      { title: t('Pilot ve ölçüm', 'Pilot and measurement') },
    ],
    architecture: {
      layers: [
        { title: t('Süreç motoru', 'Process engine') },
        { title: t('Kural katmanı', 'Rules layer') },
        { title: t('Görev ve onay', 'Tasks and approvals') },
        { title: t('Bildirim servisi', 'Notification service') },
        { title: t('Entegrasyon adaptörleri', 'Integration adapters') },
      ],
      sides: [
        { title: t('E-posta', 'Email') },
        { title: t('ERP', 'ERP') },
        { title: t('CRM', 'CRM') },
        { title: t('Dosya depolama', 'File storage') },
        { title: t('İmza servisi', 'E-signature service') },
      ],
    },
    why: [
      {
        title: t('Tekrarlayan iş yükünü azaltma', 'Reduce repetitive workload'),
        text: t('Manuel adımlar kural tabanlı akışlara taşınır.', 'Manual steps move into rule-based flows.'),
      },
      {
        title: t('Standart süreç', 'Standard process'),
        text: t('Her talep aynı onay ve bildirim sırasını izler.', 'Every request follows the same approval and notification sequence.'),
      },
      {
        title: t('Hızlı dönüş', 'Faster turnaround'),
        text: t('Otomatik atama ve hatırlatma gecikmeleri kısaltır.', 'Automatic assignment and reminders cut delays.'),
      },
      {
        title: t('İnsan kontrolü korunur', 'Human control preserved'),
        text: t('Riskli adımlarda onay insanda kalabilir.', 'Risky steps can remain with human approval.'),
      },
      {
        title: t('Ölçülebilir performans', 'Measurable performance'),
        text: t('Süreç süreleri ve darboğazlar raporlanır.', 'Process durations and bottlenecks are reported.'),
      },
    ],
    outcomes: [
      {
        title: t('Daha az manuel hata', 'Fewer manual errors'),
        text: t('Veri aktarımı ve atama kurallara bağlanır.', 'Data transfer and assignment follow rules.'),
      },
      {
        title: t('Şeffaf onay hattı', 'Transparent approval line'),
        text: t('Kimde beklediği her an görünür.', 'You always see who holds a pending step.'),
      },
      {
        title: t('Zamanında bildirim', 'Timely notification'),
        text: t('E-posta veya uygulama içi uyarılar gecikmeyi azaltır.', 'Email or in-app alerts reduce lag.'),
      },
      {
        title: t('Entegre otomasyon', 'Integrated automation'),
        text: t('ERP ve CRM olayları süreci otomatik ilerletir.', 'ERP and CRM events advance the process automatically.'),
      },
      {
        title: t('Denetim izi', 'Audit trail'),
        text: t('Her adım zaman damgasıyla kaydedilir.', 'Every step is recorded with a timestamp.'),
      },
      {
        title: t('Sürekli iyileştirme', 'Continuous improvement'),
        text: t('Süreç metrikleri optimizasyon fırsatlarını gösterir.', 'Process metrics reveal optimization opportunities.'),
      },
    ],
    process: [
      {
        title: t('Süreç görüşmeleri', 'Process interviews'),
        text: t('Mevcut adımları, istisnaları ve sorumluları çıkarırız.', 'We map current steps, exceptions, and owners.'),
      },
      {
        title: t('Otomasyon adayı seçimi', 'Automation candidate selection'),
        text: t('En yüksek değerli tekrarlayan akışları önceliklendiririz.', 'We prioritize high-value repetitive flows.'),
      },
      {
        title: t('Akış modelleme', 'Flow modeling'),
        text: t('Koşul, dallanma ve onay noktalarını tasarlarız.', 'We design conditions, branches, and approval points.'),
      },
      {
        title: t('Entegrasyon geliştirme', 'Integration development'),
        text: t('Gerekli sistem bağlantılarını kurarız.', 'We establish required system connections.'),
      },
      {
        title: t('Pilot çalıştırma', 'Pilot run'),
        text: t('Seçili ekip ile canlı test yaparız.', 'We live-test with a selected team.'),
      },
      {
        title: t('Yaygınlaştırma', 'Rollout'),
        text: t('Metrikleri izleyerek tüm birime açarız.', 'We open to the full organization while tracking metrics.'),
      },
    ],
    ctaTitle: t('İş süreçlerinizi otomatikleştirelim', 'Automate your business processes'),
    ctaText: t(
      'Tekrarlayan onay ve veri aktarım süreçlerinizi anlatalım; otomasyon yol haritası çıkaralım.',
      'Describe your repetitive approval and data transfer processes—we will draft an automation roadmap.',
    ),
  },
  'b2b-b2c-platform-gelistirme': {
    visual: 'platform',
    trust: [
      { title: t('Çok segmentli kullanıcı modeli', 'Multi-segment user model') },
      { title: t('Özel fiyat ve katalog', 'Custom pricing and catalog') },
      { title: t('Komisyon ve ödeme kuralları', 'Commission and payment rules') },
      { title: t('Ölçeklenebilir platform mimarisi', 'Scalable platform architecture') },
    ],
    overviewSteps: [
      { title: t('Ekosistem ve rol analizi', 'Ecosystem and role analysis') },
      { title: t('Platform veri modeli', 'Platform data model') },
      { title: t('B2B ve B2C deneyim ayrımı', 'B2B and B2C experience split') },
      { title: t('Ödeme ve komisyon motoru', 'Payment and commission engine') },
      { title: t('Beta lansman', 'Beta launch') },
    ],
    architecture: {
      layers: [
        { title: t('Kullanıcı segmentleri', 'User segments') },
        { title: t('Katalog ve fiyat', 'Catalog and pricing') },
        { title: t('Sipariş ve talep', 'Orders and requests') },
        { title: t('Komisyon hesaplama', 'Commission calculation') },
        { title: t('Platform yönetimi', 'Platform administration') },
      ],
      sides: [
        { title: t('Ödeme sağlayıcı', 'Payment provider') },
        { title: t('ERP', 'ERP') },
        { title: t('Lojistik', 'Logistics') },
        { title: t('CRM', 'CRM') },
        { title: t('E-fatura', 'E-invoice') },
      ],
    },
    why: [
      {
        title: t('Çok taraflı iş modeli', 'Multi-sided business model'),
        text: t('Tedarikçi, bayi ve son kullanıcıyı tek platformda buluşturursunuz.', 'You bring suppliers, dealers, and end users onto one platform.'),
      },
      {
        title: t('Segment bazlı deneyim', 'Segment-based experience'),
        text: t('B2B kayıt, fiyat ve onay kuralları B2C’den ayrıştırılır.', 'B2B registration, pricing, and approval rules differ from B2C.'),
      },
      {
        title: t('Komisyon şeffaflığı', 'Commission transparency'),
        text: t('Platform ve iş ortağı payları otomatik hesaplanır.', 'Platform and partner shares are calculated automatically.'),
      },
      {
        title: t('Operasyon merkezi', 'Operations hub'),
        text: t('Tüm işlemler tek yönetim panelinden izlenir.', 'All transactions are monitored from one admin console.'),
      },
      {
        title: t('Büyümeye hazır altyapı', 'Growth-ready infrastructure'),
        text: t('Yeni kullanıcı segmentleri mimariyi yeniden yazmadan eklenir.', 'New user segments are added without rewriting the architecture.'),
      },
    ],
    outcomes: [
      {
        title: t('Dijital ekosistem', 'Digital ecosystem'),
        text: t('İş ortakları ve müşteriler ortak işlem dilinde buluşur.', 'Partners and customers meet on shared transaction rails.'),
      },
      {
        title: t('Standart süreç', 'Standardized process'),
        text: t('Sipariş ve talep akışları platform genelinde tutarlıdır.', 'Order and request flows stay consistent across the platform.'),
      },
      {
        title: t('Gelir modeli desteği', 'Revenue model support'),
        text: t('Komisyon, abonelik veya işlem bazlı gelir kuralları uygulanır.', 'Commission, subscription, or transaction-based revenue rules apply.'),
      },
      {
        title: t('Entegre operasyon', 'Integrated operations'),
        text: t('ERP ve lojistik verisi platforma bağlanabilir.', 'ERP and logistics data can connect to the platform.'),
      },
      {
        title: t('Ölçeklenebilir kullanıcı tabanı', 'Scalable user base'),
        text: t('Artan trafik ve işlem hacmine göre büyür.', 'It scales with rising traffic and transaction volume.'),
      },
      {
        title: t('Veri odaklı yönetim', 'Data-driven management'),
        text: t('Segment ve kanal performansı raporlanır.', 'Segment and channel performance is reported.'),
      },
    ],
    process: [
      {
        title: t('Platform vizyonu', 'Platform vision'),
        text: t('Katılımcı tipleri ve gelir modelini netleştiririz.', 'We clarify participant types and the revenue model.'),
      },
      {
        title: t('Mimari tasarım', 'Architecture design'),
        text: t('Veri modeli, güvenlik ve ölçekleme hedeflerini belirleriz.', 'We set data model, security, and scaling targets.'),
      },
      {
        title: t('MVP geliştirme', 'MVP development'),
        text: t('İlk segment ve temel işlem akışını yayına alırız.', 'We launch the first segment and core transaction flow.'),
      },
      {
        title: t('Ödeme entegrasyonu', 'Payment integration'),
        text: t('Tahsilat ve komisyon dağıtımını yapılandırırız.', 'We configure collection and commission distribution.'),
      },
      {
        title: t('Beta test', 'Beta testing'),
        text: t('Seçili iş ortaklarıyla gerçek senaryoları doğrularız.', 'We validate real scenarios with selected partners.'),
      },
      {
        title: t('Genişletme', 'Expansion'),
        text: t('Yeni segment ve entegrasyonları kademeli ekleriz.', 'We add new segments and integrations in phases.'),
      },
    ],
    ctaTitle: t('B2B veya B2C platformunuzu kuralım', 'Build your B2B or B2C platform'),
    ctaText: t(
      'Ekosistem modelinizi paylaşın; ölçeklenebilir platform mimarisi ve lansman planı sunalım.',
      'Share your ecosystem model—we will propose a scalable platform architecture and launch plan.',
    ),
  },
  'saas-yazilim-gelistirme': {
    visual: 'saas',
    trust: [
      { title: t('Multi-tenant mimari', 'Multi-tenant architecture') },
      { title: t('Abonelik ve paket yönetimi', 'Subscription and plan management') },
      { title: t('Tenant bazlı veri ayrımı', 'Tenant-level data isolation') },
      { title: t('Kullanım limitleri', 'Usage limits') },
    ],
    overviewSteps: [
      { title: t('Ürün ve paket modeli', 'Product and plan model') },
      { title: t('Tenant mimarisi', 'Tenant architecture') },
      { title: t('Ödeme ve abonelik akışı', 'Payment and subscription flow') },
      { title: t('Rol ve kota yönetimi', 'Role and quota management') },
      { title: t('Ürün lansmanı', 'Product launch') },
    ],
    architecture: {
      layers: [
        { title: t('Tenant yönetimi', 'Tenant management') },
        { title: t('Abonelik motoru', 'Subscription engine') },
        { title: t('Uygulama modülleri', 'Application modules') },
        { title: t('Kimlik ve roller', 'Identity and roles') },
        { title: t('Kullanım ölçümü', 'Usage metering') },
      ],
      sides: [
        { title: t('Stripe / ödeme', 'Stripe / payments') },
        { title: t('E-posta', 'Email') },
        { title: t('Analitik', 'Analytics') },
        { title: t('Webhook API', 'Webhook API') },
        { title: t('Destek aracı', 'Support tool') },
      ],
    },
    why: [
      {
        title: t('Tek ürün çok müşteri', 'One product, many customers'),
        text: t('Aynı altyapıyla birden fazla kuruma hizmet verirsiniz.', 'You serve multiple organizations from one codebase.'),
      },
      {
        title: t('Güvenli tenant ayrımı', 'Secure tenant isolation'),
        text: t('Her müşterinin verisi ve ayarları birbirinden izole kalır.', 'Each customer’s data and settings stay isolated.'),
      },
      {
        title: t('Abonelik otomasyonu', 'Subscription automation'),
        text: t('Plan, yenileme ve iptal akışları otomatik yönetilir.', 'Plan, renewal, and cancellation flows run automatically.'),
      },
      {
        title: t('Paket esnekliği', 'Plan flexibility'),
        text: t('Kullanım limitleri ve özellikler pakete göre açılır.', 'Usage limits and features unlock by plan.'),
      },
      {
        title: t('Ölçeklenebilir gelir', 'Scalable revenue'),
        text: t('Yeni tenant eklemek operasyonel yükü orantılı artırır.', 'Adding tenants increases operational load proportionally—not exponentially.'),
      },
    ],
    outcomes: [
      {
        title: t('Abonelik tabanlı ürün', 'Subscription-based product'),
        text: t('Tekrarlayan gelir modelini destekleyen yazılım sunarsınız.', 'You offer software that supports recurring revenue.'),
      },
      {
        title: t('Merkezi yönetim paneli', 'Central admin console'),
        text: t('Tenant, paket ve kullanım tek ekrandan yönetilir.', 'Tenants, plans, and usage are managed from one screen.'),
      },
      {
        title: t('Güvenli ödeme', 'Secure billing'),
        text: t('Tahsilat durumu uygulama erişimiyle senkronize olur.', 'Billing status stays in sync with application access.'),
      },
      {
        title: t('Ekip bazlı kullanım', 'Team-based usage'),
        text: t('Tenant içinde rol ve davet akışları çalışır.', 'Roles and invite flows work within each tenant.'),
      },
      {
        title: t('Kullanım görünürlüğü', 'Usage visibility'),
        text: t('Kota ve limit aşımları izlenebilir.', 'Quota and limit overages are trackable.'),
      },
      {
        title: t('Ürün büyümesi', 'Product growth'),
        text: t('Yeni modül ve paketler mevcut tenant’lara sunulabilir.', 'New modules and plans can be offered to existing tenants.'),
      },
    ],
    process: [
      {
        title: t('Ürün stratejisi', 'Product strategy'),
        text: t('Hedef segment, paket ve fiyatlandırmayı tanımlarız.', 'We define target segment, plans, and pricing.'),
      },
      {
        title: t('Tenant mimarisi', 'Tenant architecture'),
        text: t('Veri ayrımı ve güvenlik modelini tasarlarız.', 'We design data isolation and security model.'),
      },
      {
        title: t('Çekirdek geliştirme', 'Core development'),
        text: t('Uygulama modüllerini iteratif teslim ederiz.', 'We deliver application modules iteratively.'),
      },
      {
        title: t('Abonelik entegrasyonu', 'Subscription integration'),
        text: t('Ödeme sağlayıcı ve faturalama akışını kurarız.', 'We set up payment provider and billing flow.'),
      },
      {
        title: t('Beta tenant', 'Beta tenants'),
        text: t('Erken müşterilerle gerçek kullanım testi yaparız.', 'We run real usage tests with early customers.'),
      },
      {
        title: t('Genel lansman', 'Public launch'),
        text: t('Onboarding, destek ve izleme süreçlerini açarız.', 'We enable onboarding, support, and monitoring processes.'),
      },
    ],
    ctaTitle: t('SaaS ürününüzü birlikte geliştirelim', 'Build your SaaS product together'),
    ctaText: t(
      'Abonelik modelinizi ve tenant ihtiyaçlarınızı paylaşın; multi-tenant ürün planı oluşturalım.',
      'Share your subscription model and tenant needs—we will create a multi-tenant product plan.',
    ),
  },
  'dashboard-raporlama-sistemleri': {
    visual: 'dashboard',
    trust: [
      { title: t('Rol bazlı KPI panelleri', 'Role-based KPI dashboards') },
      { title: t('Çok kaynaklı veri birleştirme', 'Multi-source data blending') },
      { title: t('Filtre ve segment analizi', 'Filter and segment analysis') },
      { title: t('Planlı rapor dışa aktarım', 'Scheduled report export') },
    ],
    overviewSteps: [
      { title: t('KPI tanım atölyesi', 'KPI definition workshop') },
      { title: t('Veri kaynağı envanteri', 'Data source inventory') },
      { title: t('Dashboard wireframe', 'Dashboard wireframe') },
      { title: t('ETL ve entegrasyon', 'ETL and integration') },
      { title: t('Kullanıcı eğitimi', 'User training') },
    ],
    architecture: {
      layers: [
        { title: t('Veri toplama', 'Data ingestion') },
        { title: t('Dönüşüm ve KPI', 'Transformation and KPIs') },
        { title: t('Dashboard sunumu', 'Dashboard presentation') },
        { title: t('Rol bazlı filtre', 'Role-based filtering') },
        { title: t('Rapor dışa aktarım', 'Report export') },
      ],
      sides: [
        { title: t('ERP', 'ERP') },
        { title: t('CRM', 'CRM') },
        { title: t('E-ticaret', 'E-commerce') },
        { title: t('Google Sheets', 'Google Sheets') },
        { title: t('Veri ambarı', 'Data warehouse') },
      ],
    },
    why: [
      {
        title: t('Tek KPI tanımı', 'Single KPI definition'),
        text: t('Departmanlar aynı metriği farklı Excel dosyalarında tartışmaz.', 'Departments stop debating the same metric across different spreadsheets.'),
      },
      {
        title: t('Karar hızı', 'Decision speed'),
        text: t('Yöneticiler güncel göstergelere anında erişir.', 'Managers access current indicators instantly.'),
      },
      {
        title: t('Rol uyumu', 'Role alignment'),
        text: t('Her kullanıcı yalnızca yetkili olduğu veriyi görür.', 'Each user sees only data they are authorized to view.'),
      },
      {
        title: t('Manuel rapor yükünü azaltma', 'Less manual reporting'),
        text: t('Planlı dışa aktarımlar tekrarlayan hazırlığı otomatikleştirir.', 'Scheduled exports automate repetitive preparation.'),
      },
      {
        title: t('Erken uyarı', 'Early warning'),
        text: t('Trend ve eşik sapmaları görünür hale gelir.', 'Trend and threshold deviations become visible.'),
      },
    ],
    outcomes: [
      {
        title: t('Canlı yönetim paneli', 'Live management panel'),
        text: t('Operasyon ve satış KPI’ları tek ekranda toplanır.', 'Operations and sales KPIs gather on one screen.'),
      },
      {
        title: t('Tutarlı raporlama', 'Consistent reporting'),
        text: t('Aynı hesaplama mantığı tüm raporlarda kullanılır.', 'The same calculation logic is used across reports.'),
      },
      {
        title: t('Segment analizi', 'Segment analysis'),
        text: t('Şube, ekip ve dönem kırılımları karşılaştırılır.', 'Branch, team, and period breakdowns are compared.'),
      },
      {
        title: t('Zaman kazancı', 'Time savings'),
        text: t('Haftalık rapor hazırlığı saatlerden dakikalara iner.', 'Weekly report prep drops from hours to minutes.'),
      },
      {
        title: t('Veri güvenilirliği', 'Data reliability'),
        text: t('Kaynak sistemlerden otomatik beslenme hata riskini düşürür.', 'Automatic feeds from source systems reduce error risk.'),
      },
      {
        title: t('Eyleme dönük içgörü', 'Actionable insight'),
        text: t('Grafikler yalnızca geçmişi değil sonraki adımı destekler.', 'Charts support the next action—not just history.'),
      },
    ],
    process: [
      {
        title: t('KPI atölyesi', 'KPI workshop'),
        text: t('Yönetim ve operasyon ekipleriyle göstergeleri tanımlarız.', 'We define indicators with management and operations teams.'),
      },
      {
        title: t('Veri kaynakları', 'Data sources'),
        text: t('ERP, CRM ve diğer sistemlerin alanlarını eşleriz.', 'We map fields from ERP, CRM, and other systems.'),
      },
      {
        title: t('Dashboard tasarımı', 'Dashboard design'),
        text: t('Kart, grafik ve tablo düzenini onaylatırız.', 'We get approval on card, chart, and table layout.'),
      },
      {
        title: t('Entegrasyon geliştirme', 'Integration development'),
        text: t('Veri pipeline’ını kurar ve test ederiz.', 'We build and test the data pipeline.'),
      },
      {
        title: t('Rol testi', 'Role testing'),
        text: t('Her rolün gördüğü veriyi doğrularız.', 'We verify what each role can see.'),
      },
      {
        title: t('Devreye alma', 'Rollout'),
        text: t('Eğitim ve planlı rapor takvimini teslim ederiz.', 'We deliver training and a scheduled report calendar.'),
      },
    ],
    ctaTitle: t('Dashboard ve raporlama sisteminizi kuralım', 'Build your dashboard and reporting system'),
    ctaText: t(
      'Takip etmek istediğiniz KPI’ları ve veri kaynaklarınızı paylaşın; yönetim paneli planı çıkaralım.',
      'Share the KPIs and data sources you need—we will draft a management dashboard plan.',
    ),
  },
  'musteri-bayi-portali': {
    visual: 'portal',
    trust: [
      { title: t('Self-servis sipariş', 'Self-service ordering') },
      { title: t('Bayi bazlı fiyatlandırma', 'Dealer-specific pricing') },
      { title: t('Belge ve fatura erişimi', 'Document and invoice access') },
      { title: t('ERP senkronizasyonu', 'ERP synchronization') },
    ],
    overviewSteps: [
      { title: t('Portal kullanıcı segmentleri', 'Portal user segments') },
      { title: t('Fiyat ve katalog kuralları', 'Pricing and catalog rules') },
      { title: t('Sipariş ve talep akışı', 'Order and request flow') },
      { title: t('ERP entegrasyonu', 'ERP integration') },
      { title: t('Portal lansmanı', 'Portal launch') },
    ],
    architecture: {
      layers: [
        { title: t('Portal arayüzü', 'Portal interface') },
        { title: t('Hesap ve rol yönetimi', 'Account and role management') },
        { title: t('Fiyat motoru', 'Pricing engine') },
        { title: t('Sipariş servisi', 'Order service') },
        { title: t('Belge deposu', 'Document repository') },
      ],
      sides: [
        { title: t('ERP', 'ERP') },
        { title: t('CRM', 'CRM') },
        { title: t('E-fatura', 'E-invoice') },
        { title: t('Lojistik', 'Logistics') },
        { title: t('E-posta bildirim', 'Email notifications') },
      ],
    },
    why: [
      {
        title: t('7/24 self-servis', '24/7 self-service'),
        text: t('Müşteri ve bayiler mesai dışında da işlem yapabilir.', 'Customers and dealers can transact outside business hours.'),
      },
      {
        title: t('Özel fiyat görünürlüğü', 'Custom price visibility'),
        text: t('Her firma yalnızca kendi sözleşme fiyatlarını görür.', 'Each company sees only its contracted prices.'),
      },
      {
        title: t('Operasyon yükünü azaltma', 'Lower operational load'),
        text: t('Telefon ve e-posta ile sipariş trafiği düşer.', 'Order traffic by phone and email decreases.'),
      },
      {
        title: t('Tutarlı veri', 'Consistent data'),
        text: t('Portal siparişleri ERP ile senkron kalır.', 'Portal orders stay synchronized with ERP.'),
      },
      {
        title: t('Belge merkezi', 'Document hub'),
        text: t('Fatura, sözleşme ve katalog tek yerden indirilir.', 'Invoices, contracts, and catalogs download from one place.'),
      },
    ],
    outcomes: [
      {
        title: t('Hızlı sipariş', 'Faster ordering'),
        text: t('Bayi ve müşteriler sepetten onaylı sipariş oluşturur.', 'Dealers and customers create approved orders from the cart.'),
      },
      {
        title: t('Şeffaf durum takibi', 'Transparent status tracking'),
        text: t('Sipariş ve talep durumu portalda görünür.', 'Order and request status is visible in the portal.'),
      },
      {
        title: t('Doğru fiyat', 'Accurate pricing'),
        text: t('İskonto ve limit kuralları otomatik uygulanır.', 'Discount and limit rules apply automatically.'),
      },
      {
        title: t('Azalan destek yükü', 'Reduced support burden'),
        text: t('Sık sorulan belge ve durum talepleri self-servise taşınır.', 'Common document and status requests move to self-service.'),
      },
      {
        title: t('Entegre müşteri kaydı', 'Integrated customer record'),
        text: t('CRM geçmişi portal işlemleriyle zenginleşir.', 'CRM history enriches with portal transactions.'),
      },
      {
        title: t('Ölçeklenebilir bayi ağı', 'Scalable dealer network'),
        text: t('Yeni bayi eklemek standart onboarding ile yapılır.', 'New dealers are onboarded through a standard flow.'),
      },
    ],
    process: [
      {
        title: t('Segment tanımı', 'Segment definition'),
        text: t('Müşteri, bayi ve alt kullanıcı rollerini belirleriz.', 'We define customer, dealer, and sub-user roles.'),
      },
      {
        title: t('Katalog ve fiyat', 'Catalog and pricing'),
        text: t('Görünür ürün ve fiyat kurallarını yapılandırırız.', 'We configure visible products and pricing rules.'),
      },
      {
        title: t('Portal geliştirme', 'Portal development'),
        text: t('Sipariş, talep ve belge ekranlarını kodlarız.', 'We code order, request, and document screens.'),
      },
      {
        title: t('ERP bağlantısı', 'ERP connection'),
        text: t('Stok, fiyat ve sipariş senkronunu kurarız.', 'We set up inventory, pricing, and order sync.'),
      },
      {
        title: t('Pilot bayi', 'Pilot dealer'),
        text: t('Seçili kullanıcılarla canlı test yaparız.', 'We live-test with selected users.'),
      },
      {
        title: t('Genel açılış', 'General opening'),
        text: t('Eğitim materyali ve destek hattı ile yayına alırız.', 'We launch with training materials and a support channel.'),
      },
    ],
    ctaTitle: t('Müşteri ve bayi portalınızı geliştirelim', 'Develop your customer and dealer portal'),
    ctaText: t(
      'Self-servis sipariş, fiyat ve belge ihtiyaçlarınızı paylaşın; ERP entegre portal tasarlayalım.',
      'Share your self-service order, pricing, and document needs—we will design an ERP-integrated portal.',
    ),
  },
  'stok-siparis-yonetim-sistemleri': {
    visual: 'inventory',
    trust: [
      { title: t('Çoklu depo yönetimi', 'Multi-warehouse management') },
      { title: t('Rezervasyon ve sayım', 'Reservation and counting') },
      { title: t('Siparişten sevke iz', 'Order-to-ship traceability') },
      { title: t('Kanal stok senkronu', 'Channel stock sync') },
    ],
    overviewSteps: [
      { title: t('Depo ve hareket analizi', 'Warehouse and movement analysis') },
      { title: t('Stok kod yapısı', 'Stock coding structure') },
      { title: t('Sipariş akış tasarımı', 'Order flow design') },
      { title: t('Sayım ve iade modülleri', 'Count and return modules') },
      { title: t('Entegrasyon ve eğitim', 'Integration and training') },
    ],
    architecture: {
      layers: [
        { title: t('Stok master', 'Stock master') },
        { title: t('Depo hareketleri', 'Warehouse movements') },
        { title: t('Rezervasyon', 'Reservation') },
        { title: t('Sipariş ve sevk', 'Order and shipment') },
        { title: t('Sayım ve iade', 'Count and returns') },
      ],
      sides: [
        { title: t('E-ticaret', 'E-commerce') },
        { title: t('ERP', 'ERP') },
        { title: t('Kargo', 'Shipping') },
        { title: t('Barkod okuyucu', 'Barcode scanner') },
        { title: t('Pazaryeri', 'Marketplace') },
      ],
    },
    why: [
      {
        title: t('Stok doğruluğu', 'Inventory accuracy'),
        text: t('Her giriş, çıkış ve transfer kayıt altına alınır.', 'Every receipt, issue, and transfer is recorded.'),
      },
      {
        title: t('Rezervasyon disiplini', 'Reservation discipline'),
        text: t('Satılabilir adet sipariş anında ayrılır.', 'Sellable quantity is reserved at order time.'),
      },
      {
        title: t('Çok depo görünürlüğü', 'Multi-warehouse visibility'),
        text: t('Lokasyon bazlı stok merkezden izlenir.', 'Location-based stock is monitored centrally.'),
      },
      {
        title: t('Sevk takibi', 'Shipment tracking'),
        text: t('Toplama, paketleme ve sevk adımları durum olarak görünür.', 'Pick, pack, and ship steps appear as status.'),
      },
      {
        title: t('Kanal uyumu', 'Channel alignment'),
        text: t('Web ve pazaryeri stokları merkezi kayıtla eşleşir.', 'Web and marketplace stock match the central record.'),
      },
    ],
    outcomes: [
      {
        title: t('Güvenilir stok verisi', 'Reliable inventory data'),
        text: t('Operasyon ve satış aynı güncel adetleri kullanır.', 'Operations and sales use the same current quantities.'),
      },
      {
        title: t('Azalan stok hatası', 'Fewer stock errors'),
        text: t('Sayım ve düzeltme süreçleri standartlaşır.', 'Count and adjustment processes standardize.'),
      },
      {
        title: t('Hızlı sipariş karşılama', 'Faster order fulfillment'),
        text: t('Rezervasyon ve toplama listeleri otomatik oluşur.', 'Reservation and pick lists generate automatically.'),
      },
      {
        title: t('İade yönetimi', 'Returns management'),
        text: t('Müşteri ve tedarikçi iade akışları izlenebilir.', 'Customer and supplier return flows are traceable.'),
      },
      {
        title: t('Kritik seviye uyarıları', 'Critical level alerts'),
        text: t('Minimum stok altına düşünce tedarik tetiklenir.', 'Replenishment triggers when stock falls below minimum.'),
      },
      {
        title: t('Raporlanabilir depo', 'Reportable warehouse'),
        text: t('Hareket, sayım ve sevk metrikleri raporlanır.', 'Movement, count, and shipment metrics are reported.'),
      },
    ],
    process: [
      {
        title: t('Operasyon analizi', 'Operations analysis'),
        text: t('Depo yapısı, hareket tipleri ve kanalları haritalarız.', 'We map warehouse structure, movement types, and channels.'),
      },
      {
        title: t('Veri modeli', 'Data model'),
        text: t('Ürün, depo, lot ve hareket şemasını tasarlarız.', 'We design product, warehouse, lot, and movement schema.'),
      },
      {
        title: t('Modül geliştirme', 'Module development'),
        text: t('Stok, sipariş ve sayım modüllerini teslim ederiz.', 'We deliver inventory, order, and count modules.'),
      },
      {
        title: t('Kanal entegrasyonu', 'Channel integration'),
        text: t('E-ticaret ve pazaryeri stok akışını bağlarız.', 'We connect e-commerce and marketplace stock flows.'),
      },
      {
        title: t('Depo pilotu', 'Warehouse pilot'),
        text: t('Seçili depoda gerçek hareketlerle test ederiz.', 'We test with real movements in a selected warehouse.'),
      },
      {
        title: t('Kurumsal devreye alma', 'Enterprise rollout'),
        text: t('Tüm depo ve kanallara eğitimli geçiş yaparız.', 'We roll out to all warehouses and channels with training.'),
      },
    ],
    ctaTitle: t('Stok ve sipariş sisteminizi kuralım', 'Build your inventory and order system'),
    ctaText: t(
      'Depo, kanal ve sipariş akışınızı paylaşın; uçtan uca stok yönetimi planı oluşturalım.',
      'Share your warehouse, channel, and order flow—we will create an end-to-end inventory management plan.',
    ),
  },
  'yapay-zeka-destekli-yazilim': {
    visual: 'ai',
    trust: [
      { title: t('LLM entegrasyonu', 'LLM integration') },
      { title: t('Doküman sınıflandırma', 'Document classification') },
      { title: t('İnsan onaylı çıktılar', 'Human-in-the-loop outputs') },
      { title: t('Veri güvenliği değerlendirmesi', 'Data security assessment') },
    ],
    overviewSteps: [
      { title: t('Kullanım senaryosu seçimi', 'Use case selection') },
      { title: t('Veri ve erişim analizi', 'Data and access analysis') },
      { title: t('LLM ve sınıflandırma tasarımı', 'LLM and classification design') },
      { title: t('Pilot ve kalite ölçümü', 'Pilot and quality measurement') },
      { title: t('Kontrollü devreye alma', 'Controlled rollout') },
    ],
    architecture: {
      layers: [
        { title: t('Uygulama arayüzü', 'Application interface') },
        { title: t('LLM orkestrasyon', 'LLM orchestration') },
        { title: t('Doküman işleme', 'Document processing') },
        { title: t('Sınıflandırma servisi', 'Classification service') },
        { title: t('İnsan onay kuyruğu', 'Human review queue') },
      ],
      sides: [
        { title: t('Kurum dokümanları', 'Corporate documents') },
        { title: t('CRM / destek', 'CRM / support') },
        { title: t('Arama indeksi', 'Search index') },
        { title: t('Denetim logları', 'Audit logs') },
      ],
    },
    why: [
      {
        title: t('Doğru problem seçimi', 'Right problem selection'),
        text: t('LLM’i tekrarlayan içerik işlerine odaklarız; her soruna AI dayatmayız.', 'We apply LLMs to repetitive content work—not every problem needs AI.'),
      },
      {
        title: t('Doküman verimliliği', 'Document efficiency'),
        text: t('Uzun belgelerden yapılandırılmış bilgi çıkarılır.', 'Structured information is extracted from long documents.'),
      },
      {
        title: t('Sınıflandırma desteği', 'Classification support'),
        text: t('Talepler konu ve önceliğe göre yönlendirilir; nihai karar insanda kalabilir.', 'Requests route by topic and priority; final decisions can stay with people.'),
      },
      {
        title: t('Sorumlu kullanım', 'Responsible use'),
        text: t('Doğrulanamayan başarı veya sıralama garantisi iddiasında bulunmayız.', 'We do not claim unverifiable success or ranking guarantees.'),
      },
      {
        title: t('Erişim kontrolü', 'Access control'),
        text: t('Hassas veri sınıflandırması ve yetkilendirme proje öncesinde değerlendirilir.', 'Sensitive data classification and permissions are assessed before the project.'),
      },
    ],
    outcomes: [
      {
        title: t('Hızlı bilgi erişimi', 'Faster information access'),
        text: t('Kurum dokümanlarında anlama dayalı arama süresini kısaltır.', 'Semantic search across corporate documents saves time.'),
      },
      {
        title: t('Desteklenen sınıflandırma', 'Assisted classification'),
        text: t('Gelen talepler ön sınıflandırma ile doğru ekibe yönlendirilir.', 'Incoming requests pre-classify toward the right team.'),
      },
      {
        title: t('Doküman özetleri', 'Document summaries'),
        text: t('Uzun sözleşme ve raporlar çalışma özeti olarak sunulur.', 'Long contracts and reports appear as working summaries.'),
      },
      {
        title: t('İnsan kontrolü', 'Human oversight'),
        text: t('Kritik çıktılar onay kuyruğundan geçebilir.', 'Critical outputs can pass through a review queue.'),
      },
      {
        title: t('Ölçülebilir kalite', 'Measurable quality'),
        text: t('Doğruluk ve kapsama metrikleri pilot aşamada izlenir.', 'Accuracy and coverage metrics are tracked during pilot.'),
      },
      {
        title: t('Sürece entegre AI', 'Process-integrated AI'),
        text: t('Sınıflandırma ve özet sonuçları iş akışına aktarılır.', 'Classification and summary results feed into workflows.'),
      },
    ],
    process: [
      {
        title: t('Senaryo değerlendirme', 'Scenario assessment'),
        text: t('LLM, sınıflandırma ve doküman ihtiyaçlarını birlikte önceliklendiririz.', 'We prioritize LLM, classification, and document needs together.'),
      },
      {
        title: t('Veri hazırlığı', 'Data preparation'),
        text: t('Eğitim ve referans doküman setlerini düzenleriz.', 'We organize training and reference document sets.'),
      },
      {
        title: t('Prototip geliştirme', 'Prototype development'),
        text: t('Sınırlı kapsamlı pilot akışı kodlarız.', 'We code a limited-scope pilot flow.'),
      },
      {
        title: t('Kalite ölçümü', 'Quality measurement'),
        text: t('Doğruluk, halüsinasyon ve gecikme metriklerini ölçeriz.', 'We measure accuracy, hallucination risk, and latency.'),
      },
      {
        title: t('İnsan onay tasarımı', 'Human review design'),
        text: t('Riskli çıktılar için onay adımlarını tanımlarız.', 'We define approval steps for risky outputs.'),
      },
      {
        title: t('Kontrollü yayılım', 'Controlled expansion'),
        text: t('Başarılı pilot sonrası kapsamı kademeli genişletiriz.', 'After a successful pilot, we expand scope in phases.'),
      },
    ],
    ctaTitle: t('Yapay zekayı iş süreçlerinize uyarlayalım', 'Apply AI to your business processes'),
    ctaText: t(
      'Doküman, sınıflandırma veya bilgi asistanı ihtiyacınızı paylaşın; sorumlu bir LLM planı sunalım.',
      'Share your document, classification, or knowledge assistant need—we will propose a responsible LLM plan.',
    ),
  },
  'yazilim-modernizasyonu': {
    visual: 'modernize',
    trust: [
      { title: t('Teknik borç analizi', 'Technical debt analysis') },
      { title: t('Kademeli geçiş planı', 'Phased migration plan') },
      { title: t('Test otomasyonu', 'Test automation') },
      { title: t('İş sürekliliği odaklı', 'Business continuity focused') },
    ],
    overviewSteps: [
      { title: t('Mevcut sistem denetimi', 'Current system audit') },
      { title: t('Modernizasyon stratejisi', 'Modernization strategy') },
      { title: t('Arayüz ve API yenileme', 'Interface and API renewal') },
      { title: t('Veri geçişi', 'Data migration') },
      { title: t('Paralel çalışma ve kesme', 'Parallel run and cutover') },
    ],
    architecture: {
      layers: [
        { title: t('Legacy uygulama', 'Legacy application') },
        { title: t('Modern arayüz', 'Modern interface') },
        { title: t('Servis katmanı', 'Service layer') },
        { title: t('Veri geçiş köprüsü', 'Data migration bridge') },
        { title: t('CI/CD ve izleme', 'CI/CD and monitoring') },
      ],
      sides: [
        { title: t('Eski veritabanı', 'Legacy database') },
        { title: t('Kimlik sistemi', 'Identity system') },
        { title: t('Harici API', 'External API') },
        { title: t('Dosya arşivi', 'File archive') },
        { title: t('Raporlama', 'Reporting') },
      ],
    },
    why: [
      {
        title: t('Bakım maliyetini düşürme', 'Lower maintenance cost'),
        text: t('Eski teknoloji ve dağınık kod geliştirmeyi yavaşlatır; hedefli modernizasyon hız kazandırır.', 'Legacy tech and scattered code slow delivery—targeted modernization restores speed.'),
      },
      {
        title: t('Güvenlik güncelliği', 'Security freshness'),
        text: t('Eski bağımlılıklar ve zayıf noktalar tespit edilip giderilir.', 'Outdated dependencies and weak spots are found and addressed.'),
      },
      {
        title: t('Kademeli risk', 'Phased risk'),
        text: t('Big bang yerine modül modül geçiş iş sürekliliğini korur.', 'Module-by-module migration preserves continuity versus a big bang.'),
      },
      {
        title: t('Modern kullanıcı deneyimi', 'Modern user experience'),
        text: t('Arayüz yenilenirken iş kuralları korunabilir.', 'Interfaces refresh while business rules can remain intact.'),
      },
      {
        title: t('Entegrasyon hazırlığı', 'Integration readiness'),
        text: t('API ve servis katmanı yeni bağlantılara zemin hazırlar.', 'API and service layers prepare the ground for new connections.'),
      },
    ],
    outcomes: [
      {
        title: t('Daha hızlı geliştirme', 'Faster development'),
        text: t('Modern kod tabanı yeni özellik teslimatını kısaltır.', 'A modern codebase shortens feature delivery.'),
      },
      {
        title: t('Güncel güvenlik', 'Up-to-date security'),
        text: t('Yama, şifreleme ve erişim pratikleri güncellenir.', 'Patching, encryption, and access practices are updated.'),
      },
      {
        title: t('İyileşen performans', 'Improved performance'),
        text: t('Sorgu, önbellek ve arayüz optimizasyonu yanıt süresini düşürür.', 'Query, cache, and UI optimization reduce response time.'),
      },
      {
        title: t('Güvenli veri geçişi', 'Safe data migration'),
        text: t('Şema dönüşümü doğrulama adımlarıyla yapılır.', 'Schema transformation runs with validation steps.'),
      },
      {
        title: t('Sürdürülebilir deployment', 'Sustainable deployment'),
        text: t('CI/CD ve test otomasyonu regresyon riskini azaltır.', 'CI/CD and test automation reduce regression risk.'),
      },
      {
        title: t('Korunan iş değeri', 'Preserved business value'),
        text: t('Mevcut veri ve süreç bilgisi yeni mimariye taşınır.', 'Existing data and process knowledge move to the new architecture.'),
      },
    ],
    process: [
      {
        title: t('Teknik denetim', 'Technical audit'),
        text: t('Kod, veritabanı, güvenlik ve performansı inceleriz.', 'We review code, database, security, and performance.'),
      },
      {
        title: t('Strateji seçimi', 'Strategy selection'),
        text: t('Yenileme, modülerleştirme veya yeniden yazma seçeneklerini karşılaştırırız.', 'We compare refactor, modularization, and rewrite options.'),
      },
      {
        title: t('Faz planı', 'Phase plan'),
        text: t('İş önceliğine göre geçiş fazlarını tanımlarız.', 'We define migration phases by business priority.'),
      },
      {
        title: t('Modern geliştirme', 'Modern development'),
        text: t('Seçilen modülleri yeni mimaride iteratif teslim ederiz.', 'We iteratively deliver chosen modules on the new architecture.'),
      },
      {
        title: t('Veri geçişi', 'Data migration'),
        text: t('Deneme aktarımı ve doğrulama ile canlı geçişi yaparız.', 'We cut over with trial migration and validation.'),
      },
      {
        title: t('Eski sistem kapatma', 'Legacy decommission'),
        text: t('Paralel çalışma sonrası kontrollü kapatma tamamlanır.', 'Controlled shutdown completes after parallel operation.'),
      },
    ],
    ctaTitle: t('Yazılım modernizasyon yolculuğunuza başlayalım', 'Start your software modernization journey'),
    ctaText: t(
      'Mevcut uygulamanızın durumunu paylaşın; iş sürekliliğini koruyan modernizasyon planı hazırlayalım.',
      'Share the state of your current application—we will prepare a modernization plan that protects business continuity.',
    ),
  },
}

export function getServicePageExtras(trSlug: string): ServicePageExtras {
  return SERVICE_PAGE_EXTRAS[trSlug] ?? SERVICE_PAGE_EXTRAS[DEFAULT_SLUG]
}
