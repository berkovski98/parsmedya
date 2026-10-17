import type { Locale } from '@/lib/i18n'

export const EDI_PATHS: Record<Locale, string> = {
  tr: '/hizmetler/edi-entegrasyonu',
  en: '/en/services/edi-integration',
}

type Item = { title: string; description: string }

export type EdiCopy = {
  label: string
  badge: string
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  lead: string
  primaryCta: string
  flow: { partners: string; partnerItems: string[]; hub: string; hubSteps: string[]; systems: string; systemItems: string[]; packets: string[] }
  overviewTitle: string
  overview: string[]
  messagesTitle: string
  messagesLead: string
  messages: { code: string; description: string }[]
  standardsTitle: string
  standards: { title: string; items: string[] }[]
  capabilitiesTitle: string
  capabilities: Item[]
  processTitle: string
  process: Item[]
  sectorsTitle: string
  sectorsLead: string
  sectors: string[]
  faqTitle: string
  faqs: { question: string; answer: string }[]
  spotlight: { eyebrow: string; title: string; text: string; cta: string; points: string[] }
  callout: { title: string; text: string; cta: string }
}

export const EDI_COPY: Record<Locale, EdiCopy> = {
  tr: {
    label: 'EDI Entegrasyonu',
    badge: 'Öne çıkan',
    metaTitle: 'EDI Entegrasyonu | EDIFACT ve Lojistik EDI | Pars Medya',
    metaDescription: 'EDIFACT mesajlarını ERP, depo ve operasyon sistemlerinize bağlayın. Eşleme, doğrulama, SFTP iletimi, onay takibi ve izleme tek platformda.',
    eyebrow: 'EDI Entegrasyonu',
    title: 'İş ortaklarınızla aynı dili konuşan EDI entegrasyonu',
    lead: 'Armatörler, müşteriler ve tedarikçilerle yaptığınız elektronik veri alışverişini; mesaj eşleme, doğrulama, güvenli iletim ve izleme adımlarıyla sistemlerinize otomatik bağlıyoruz.',
    primaryCta: 'EDI projenizi konuşalım',
    flow: {
      partners: 'İş ortakları',
      partnerItems: ['Armatör / gemi hattı', 'Müşteri', 'Tedarikçi'],
      hub: 'Pars Medya EDI',
      hubSteps: ['Al', 'Doğrula', 'Eşle', 'İlet'],
      systems: 'Sistemleriniz',
      systemItems: ['ERP', 'Depo / saha', 'Muhasebe'],
      packets: ['CODECO', 'DESTIM', 'APERAK'],
    },
    overviewTitle: 'EDI nedir, neden önemlidir?',
    overview: [
      'EDI (Electronic Data Interchange), şirketler arasında sipariş, rezervasyon, saha hareketi, onarım tahmini veya fatura gibi iş belgelerinin standart bir formatta, insan müdahalesi olmadan alınıp gönderilmesidir. Lojistikte en yaygın standart UN/EDIFACT’tir.',
      'EDI mesajları iş ortağıyla karşılıklı (bilateral) olarak anlaşılan kurallara göre üretilir. Bu yüzden başarılı bir entegrasyon yalnızca dosya göndermek değil; her segmentin doğru eşlenmesi, kurallara göre doğrulanması, onayların takip edilmesi ve hataların görünür olmasıdır.',
      'Pars Medya olarak EDIFACT ayrıştırıcı (parser) ve üretici (serializer) çekirdeği, mesaj bazlı kurallar, SFTP iletim adaptörleri ve arka planda çalışan işleme kuyruğu içeren bir EDI platformu geliştirdik. Aynı mimariyi işletmenizin iş ortaklarına ve iç sistemlerine uyarlıyoruz.',
    ],
    messagesTitle: 'Çalıştığımız mesaj aileleri',
    messagesLead: 'Konteyner depo ve armatör süreçlerinde kullanılan EDIFACT mesajları üzerinde çalışıyoruz. Her mesaj, iş ortağının mesaj uygulama kılavuzuna (MIG) göre eşlenir.',
    messages: [
      { code: 'CODECO', description: 'Konteyner giriş-çıkış ve saha hareket bildirimleri' },
      { code: 'DESTIM', description: 'Bakım-onarım (M&R) tahmini, onarım onayı ve revizyon akışı' },
      { code: 'COPARN', description: 'Konteyner ön bildirimi ve serbest bırakma talimatları' },
      { code: 'IFTMBC', description: 'Rezervasyon (booking) onayı ve sürüm takibi' },
      { code: 'APERAK', description: 'Teknik ve uygulama seviyesinde onay / ret yanıtları' },
      { code: 'CEDEX', description: 'Hasar ve onarım kodlarının standart veri setiyle doğrulanması' },
    ],
    standardsTitle: 'Formatlar ve iletim kanalları',
    standards: [
      { title: 'Standartlar', items: ['UN/EDIFACT (D96B, D00B, D06B gibi dizin sürümleri)', 'XML ve JSON dönüşümleri', 'CSV / sabit uzunluklu dosyalar'] },
      { title: 'İletim', items: ['SFTP (otomatik alma ve gönderme)', 'REST API ve webhook', 'İş ortağı gerektiriyorsa AS2'] },
      { title: 'Güvence', items: ['Mesaj kuralı ve kod listesi doğrulaması', 'Onay (APERAK) eşleştirmesi', 'Kayıt izi ve hassas veri maskeleme'] },
    ],
    capabilitiesTitle: 'EDI entegrasyonunda neler sunuyoruz?',
    capabilities: [
      { title: 'Mesaj eşleme', description: 'EDIFACT segmentlerini ERP, depo ve operasyon verinizle alan alan eşleriz; iş ortağına özel kuralları kod içinde değil yapılandırmada tutarız.' },
      { title: 'Doğrulama motoru', description: 'Zorunlu alanlar, kod listeleri ve iş kuralları gönderimden önce kontrol edilir; hatalı mesaj iş ortağına ulaşmadan yakalanır.' },
      { title: 'Güvenli iletim', description: 'SFTP ve API kanallarında otomatik alma-gönderme, tekrar deneme ve dosya yaşam döngüsü kaydı.' },
      { title: 'İşleme kuyruğu', description: 'Mesajlar web arayüzünden bağımsız çalışan bir işçi (worker) sürecinde sıraya alınır; yoğunlukta veri kaybolmaz.' },
      { title: 'Onay ve hata takibi', description: 'Gönderilen her mesajın onay durumu izlenir; ret ve hata kayıtları ekibinize anlaşılır uyarılar olarak düşer.' },
      { title: 'İzleme paneli', description: 'Hangi iş ortağına hangi mesajın ne zaman gittiğini, bekleyenleri ve hataları tek ekranda görürsünüz.' },
    ],
    processTitle: 'EDI projesi nasıl ilerler?',
    process: [
      { title: 'İş ortağı ve mesaj analizi', description: 'Hangi iş ortağıyla hangi mesajların, hangi yönde ve sıklıkta değişileceğini netleştiririz.' },
      { title: 'MIG ve eşleme tasarımı', description: 'İş ortağının mesaj uygulama kılavuzuna göre segment ve alan eşlemesini çıkarırız.' },
      { title: 'Geliştirme ve doğrulama', description: 'Ayrıştırma, üretim ve doğrulama kurallarını örnek (golden) mesajlarla test ederek geliştiririz.' },
      { title: 'İş ortağı testleri', description: 'Bağlantı, dosya adlandırma ve onay akışlarını iş ortağıyla birlikte test ortamında doğrularız.' },
      { title: 'Canlıya alma ve izleme', description: 'Kontrollü geçiş sonrası mesaj trafiğini izler, yeni iş ortaklarını aynı altyapıya ekleriz.' },
    ],
    sectorsTitle: 'Kimler için uygun?',
    sectorsLead: 'EDI, iş ortaklarıyla düzenli ve yüksek hacimli belge alışverişi yapan her işletmenin manuel veri girişini azaltır.',
    sectors: ['Konteyner depoları', 'Liman ve terminal operasyonları', 'Lojistik ve taşımacılık', 'Dış ticaret', 'Üretim tedarik zinciri', 'Perakende ve dağıtım'],
    faqTitle: 'EDI entegrasyonu hakkında sık sorulanlar',
    faqs: [
      { question: 'EDI ile API entegrasyonu arasındaki fark nedir?', answer: 'API anlık ve iki sistem arasında tanımlı uç noktalarla çalışır. EDI ise sektörde ortak kabul görmüş mesaj standartlarıyla, çoğunlukla dosya tabanlı ve iş ortağıyla anlaşılmış kurallarla çalışır. Projelerde ikisini birlikte kullanmak yaygındır; EDI mesajını alıp iç sistemlere API ile aktarırız.' },
      { question: 'Mevcut ERP veya depo yazılımımıza bağlanabilir mi?', answer: 'Evet. ERP veya operasyon sisteminizin sunduğu API, veritabanı ya da dosya aktarım yöntemlerini inceler; EDI mesajlarını bu sistemlere güvenli biçimde aktaran bir ara katman kurarız.' },
      { question: 'İş ortağımızın mesaj kılavuzu (MIG) gerekli mi?', answer: 'Evet. EDI mesajları iş ortağıyla karşılıklı anlaşılan kurallara göre üretildiği için, doğru eşleme için iş ortağının mesaj uygulama kılavuzu ve örnek mesajlar gerekir. Bu belgelerin temininde de süreci birlikte yönetiriz.' },
      { question: 'Hatalı veya reddedilen mesajlar nasıl yönetilir?', answer: 'Mesajlar gönderilmeden önce doğrulanır; iş ortağından gelen ret veya hata yanıtları ilgili mesajla eşleştirilir, ekibinize uyarı olarak iletilir ve düzeltme sonrası yeniden gönderilebilir.' },
    ],
    spotlight: {
      eyebrow: 'Öne çıkan uzmanlık',
      title: 'EDI entegrasyonu ile iş ortaklarınızla kesintisiz veri alışverişi',
      text: 'Konteyner depo ve armatör süreçleri için geliştirdiğimiz EDIFACT altyapısıyla mesajları alıyor, doğruluyor, sistemlerinize eşliyor ve güvenle iletiyoruz.',
      cta: 'EDI çözümlerini inceleyin',
      points: ['EDIFACT ayrıştırma ve üretim', 'Kural ve kod listesi doğrulaması', 'SFTP / API ile otomatik iletim', 'Onay ve hata takibi'],
    },
    callout: {
      title: 'EDI ile iş ortaklarınıza bağlanın',
      text: 'Armatör, müşteri ve tedarikçilerinizle EDIFACT mesajlaşması mı gerekiyor? EDI entegrasyonu sayfamızda mesaj ailelerini, iletim kanallarını ve proje sürecini inceleyin.',
      cta: 'EDI Entegrasyonu',
    },
  },
  en: {
    label: 'EDI Integration',
    badge: 'Featured',
    metaTitle: 'EDI Integration | EDIFACT & Logistics EDI | Pars Medya',
    metaDescription: 'Connect EDIFACT messages to your ERP, depot and operations systems with mapping, validation, SFTP delivery, acknowledgement tracking and monitoring.',
    eyebrow: 'EDI Integration',
    title: 'EDI integration that speaks your partners’ language',
    lead: 'We connect the electronic data you exchange with shipping lines, customers and suppliers to your own systems—through message mapping, validation, secure delivery and monitoring.',
    primaryCta: 'Discuss your EDI project',
    flow: {
      partners: 'Trading partners',
      partnerItems: ['Shipping line', 'Customer', 'Supplier'],
      hub: 'Pars Medya EDI',
      hubSteps: ['Receive', 'Validate', 'Map', 'Deliver'],
      systems: 'Your systems',
      systemItems: ['ERP', 'Depot / yard', 'Accounting'],
      packets: ['CODECO', 'DESTIM', 'APERAK'],
    },
    overviewTitle: 'What is EDI and why does it matter?',
    overview: [
      'EDI (Electronic Data Interchange) is the automated exchange of business documents—orders, bookings, gate movements, repair estimates or invoices—between companies in a standard format, without manual re-entry. In logistics, the most common standard is UN/EDIFACT.',
      'EDI messages follow rules agreed bilaterally with each trading partner. A successful integration is therefore more than sending files: every segment must be mapped correctly, validated against the rules, acknowledged and monitored so that errors are visible.',
      'Pars Medya has built an EDI platform with an EDIFACT parser and serializer core, message-specific rules, SFTP transport adapters and a background processing queue. We adapt the same architecture to your trading partners and internal systems.',
    ],
    messagesTitle: 'Message families we work with',
    messagesLead: 'We work with the EDIFACT messages used between container depots and shipping lines. Each message is mapped according to the partner’s message implementation guide (MIG).',
    messages: [
      { code: 'CODECO', description: 'Container gate-in/gate-out and yard movement reports' },
      { code: 'DESTIM', description: 'Maintenance & repair (M&R) estimates, repair orders and revisions' },
      { code: 'COPARN', description: 'Container pre-announcement and release instructions' },
      { code: 'IFTMBC', description: 'Booking confirmations and version tracking' },
      { code: 'APERAK', description: 'Technical and application-level acknowledgements' },
      { code: 'CEDEX', description: 'Damage and repair code validation against the standard dataset' },
    ],
    standardsTitle: 'Formats and delivery channels',
    standards: [
      { title: 'Standards', items: ['UN/EDIFACT (directories such as D96B, D00B, D06B)', 'XML and JSON transformations', 'CSV / fixed-length files'] },
      { title: 'Delivery', items: ['SFTP (automated pickup and delivery)', 'REST API and webhooks', 'AS2 where the partner requires it'] },
      { title: 'Assurance', items: ['Message rule and code list validation', 'Acknowledgement (APERAK) matching', 'Audit trail and sensitive data masking'] },
    ],
    capabilitiesTitle: 'What our EDI integration covers',
    capabilities: [
      { title: 'Message mapping', description: 'EDIFACT segments are mapped field by field to your ERP, depot and operations data, with partner-specific rules kept in configuration rather than code.' },
      { title: 'Validation engine', description: 'Mandatory fields, code lists and business rules are checked before sending, so faulty messages are caught before they reach a partner.' },
      { title: 'Secure delivery', description: 'Automated pickup and delivery over SFTP and APIs, with retries and a file lifecycle log.' },
      { title: 'Processing queue', description: 'Messages are queued in a worker process that runs independently of the web interface, so nothing is lost under load.' },
      { title: 'Acknowledgement tracking', description: 'The acknowledgement status of every message is tracked; rejections and errors reach your team as clear alerts.' },
      { title: 'Monitoring dashboard', description: 'See which message went to which partner and when, what is pending and what failed—on one screen.' },
    ],
    processTitle: 'How an EDI project runs',
    process: [
      { title: 'Partner & message analysis', description: 'We clarify which messages are exchanged with which partners, in which direction and how often.' },
      { title: 'MIG & mapping design', description: 'We derive segment and field mappings from each partner’s message implementation guide.' },
      { title: 'Build & validation', description: 'Parsing, generation and validation rules are developed and tested against golden sample messages.' },
      { title: 'Partner testing', description: 'Connectivity, file naming and acknowledgement flows are verified with the partner in a test environment.' },
      { title: 'Go-live & monitoring', description: 'After a controlled cut-over we monitor traffic and onboard new partners onto the same platform.' },
    ],
    sectorsTitle: 'Who is it for?',
    sectorsLead: 'EDI reduces manual data entry for any business that exchanges documents with partners regularly and at volume.',
    sectors: ['Container depots', 'Port & terminal operations', 'Logistics & transport', 'Foreign trade', 'Manufacturing supply chains', 'Retail & distribution'],
    faqTitle: 'EDI integration FAQ',
    faqs: [
      { question: 'What is the difference between EDI and API integration?', answer: 'APIs work in real time between two systems through defined endpoints. EDI uses industry-wide message standards, usually file-based and governed by rules agreed with each partner. Projects often combine both: we receive the EDI message and pass it to internal systems through APIs.' },
      { question: 'Can it connect to our existing ERP or depot software?', answer: 'Yes. We review the APIs, database access or file transfer options your systems provide and build a secure middle layer that moves EDI data into them.' },
      { question: 'Do we need our partner’s message guide (MIG)?', answer: 'Yes. Because EDI messages follow rules agreed with each partner, accurate mapping needs the partner’s message implementation guide and sample messages. We help you manage that process.' },
      { question: 'How are failed or rejected messages handled?', answer: 'Messages are validated before sending; rejections and error responses from partners are matched to the original message, raised to your team as alerts and can be resent after correction.' },
    ],
    spotlight: {
      eyebrow: 'Featured expertise',
      title: 'EDI integration for seamless data exchange with your partners',
      text: 'With the EDIFACT platform we built for container depot and shipping line workflows, we receive, validate, map and securely deliver your messages.',
      cta: 'Explore EDI solutions',
      points: ['EDIFACT parsing and generation', 'Rule and code list validation', 'Automated SFTP / API delivery', 'Acknowledgement and error tracking'],
    },
    callout: {
      title: 'Connect to your partners with EDI',
      text: 'Need EDIFACT messaging with shipping lines, customers or suppliers? See message families, delivery channels and our project approach on the EDI integration page.',
      cta: 'EDI Integration',
    },
  },
}
