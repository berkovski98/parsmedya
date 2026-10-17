import Link from 'next/link'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { services } from '@/lib/services'
import { englishServices } from '@/lib/services-en'
import type { Locale } from '@/lib/i18n'
import { stagger } from '@/lib/motion'

type GuideSection = { serviceKey: string; title: string; paragraphs: string[]; points?: string[]; anchor: string }

const categoryLabels = {
  tr: ['Web ve Yazılım', 'Özel Yazılım', 'Müşteri Yönetimi', 'Kurumsal Yönetim', 'Otomasyon', 'Bulut Ürünleri', 'Dijital Platformlar', 'Dijital Ticaret', 'Mobil Ürünler', 'Sistem Entegrasyonu', 'Veri ve Raporlama', 'Yapay Zeka', 'Kurumsal Web', 'Dijital Büyüme', 'Modernizasyon'],
  en: ['Web & Software', 'Custom Software', 'Customer Management', 'Enterprise Management', 'Automation', 'Cloud Products', 'Digital Platforms', 'Digital Commerce', 'Mobile Products', 'System Integration', 'Data & Reporting', 'Artificial Intelligence', 'Corporate Web', 'Digital Growth', 'Modernization'],
} as const

const editorialHighlights = {
  tr: {
    'web-yazilim-gelistirme': 'Web sitesi değil, işletmenizin çalışan dijital altyapısı.',
    'ozel-yazilim-gelistirme': 'Teknolojiyi süreçlerinize uyduruyoruz; süreçlerinizi hazır yazılıma uydurmuyoruz.',
    'crm-yazilim-cozumleri': 'Her müşterinin geçmişi, her satış fırsatının durumu tek ekranda.',
    'erp-yazilim-cozumleri': 'Dağınık operasyonları tek bir dijital sistem altında birleştirin.',
  },
  en: {
    'web-yazilim-gelistirme': 'Not another website, but a digital operating layer for your business.',
    'ozel-yazilim-gelistirme': 'We adapt technology to your processes—not your processes to generic software.',
    'crm-yazilim-cozumleri': 'Every customer history and every sales opportunity, visible in one place.',
    'erp-yazilim-cozumleri': 'Bring fragmented operations together under one digital system.',
  },
} as const

const trSections: GuideSection[] = [
  { serviceKey: 'web-yazilim-gelistirme', title: 'Web Yazılım Geliştirme', anchor: 'Web Yazılım Geliştirme hizmetimizi inceleyin', paragraphs: ['Web yazılım; tarayıcı üzerinden çalışan, kullanıcıların yalnızca bilgi okumak yerine veri girdiği, görev tamamladığı ve iş süreçlerini yönettiği uygulamaları ifade eder. Klasik bir web sitesi kurumsal anlatım ve iletişim için hazırlanırken web uygulaması; kullanıcı hesabı, veritabanı, rol ve yetki sistemi, iş kuralları ve entegrasyonlarla aktif bir çalışma ortamı oluşturur. Yönetim panelleri, müşteri portalları, rezervasyon ve operasyon uygulamaları bu yapının yaygın örnekleridir.', 'İşletmeye özel web tabanlı sistemlerde süreçleri, kullanıcı rollerini, raporlama ihtiyaçlarını ve mevcut veri kaynaklarını birlikte analiz ederiz. Responsive arayüzler masaüstü, tablet ve telefonda tutarlı çalışırken dashboard ekranları doğru kişiye doğru veriyi gösterir. API bağlantıları ve veritabanı entegrasyonları bilgi akışını merkezileştirir. Performans, erişim kontrolü, doğrulama, izlenebilirlik ve ölçeklenebilir mimari ise uygulamanın kullanıcı ve işlem hacmi büyüdüğünde güvenilir kalmasını sağlar.'] },
  { serviceKey: 'ozel-yazilim-gelistirme', title: 'İşletmenize Özel Yazılım Geliştirme', anchor: 'Özel yazılım geliştirme yaklaşımımızı inceleyin', paragraphs: ['Hazır paket yazılımlar hızlı başlangıç ve standart süreçler için uygun olabilir; ancak işletme kendine özgü onaylar, fiyatlandırma kuralları, departmanlar arası akışlar veya entegrasyonlar kullanıyorsa ekipler çoğu zaman yazılıma uyum sağlamak zorunda kalır. Özel yazılım geliştirme, çözümü mevcut iş akışına göre şekillendirir. İhtiyaç analiziyle roller, veri, istisnalar ve başarı ölçütleri belirlenir; ardından yalnız gerekli modüller planlanır.', 'KOBİ’ler dağınık tabloları ve manuel takibi merkezi bir operasyon sistemine taşıyabilir. Orta ölçekli işletmeler satış, sipariş, servis ve raporlamayı birleştirebilir; kurumsal yapılar ise çok departmanlı süreçleri ayrıntılı yetkilendirme ve denetim kayıtlarıyla yönetebilir. Modüler ve ölçeklenebilir mimari yeni süreçlerin eklenmesini kolaylaştırır. Bakım, güvenlik güncellemeleri ve ölçülebilir geliştirme planı sayesinde yazılım tek seferlik proje değil, işletmeyle gelişen sürdürülebilir bir ürün olur.'] },
  { serviceKey: 'crm-yazilim-cozumleri', title: 'CRM Yazılım Çözümleri ile Müşteri Süreçlerinizi Yönetin', anchor: 'CRM Yazılım Çözümlerimizi keşfedin', paragraphs: ['CRM yazılımı; müşteri ve şirket kayıtlarını, potansiyel müşterileri, lead kaynaklarını, görüşme geçmişini ve satış pipeline’ını tek merkezde toplar. Satış ekibi fırsatların hangi aşamada olduğunu, bir sonraki görevi, teklif durumunu ve hatırlatmaları görebilir. Segmentasyon, dashboard ve raporlama ekranları yöneticilerin ekip performansını, dönüşüm oranlarını ve kaybedilen fırsat nedenlerini takip etmesine yardımcı olur.', 'Hazır bir CRM sistemi yaygın satış modellerini hızlıca karşılayabilir. Şirkete özel CRM geliştirme ise farklı teklif onayları, bayi yapısı, özel müşteri sınıfları, satış sonrası süreçler ve kurumun kullandığı diğer sistemlerle uyum gerektiğinde avantaj sağlar. E-posta ve API entegrasyonları iletişim geçmişini zenginleştirir; otomasyonlar görev, bildirim ve takip adımlarını standartlaştırır. Amaç daha fazla alan üretmek değil, ekiplerin güncel ve güvenilir müşteri verisiyle tutarlı çalışmasını sağlamaktır.'] },
  { serviceKey: 'erp-yazilim-cozumleri', title: 'ERP Yazılım Çözümleri ile İşletmenizi Tek Merkezden Yönetin', anchor: 'ERP çözümlerimiz hakkında detaylı bilgi alın', paragraphs: ['ERP yazılımı; satış, satın alma, stok, depo, sipariş, cari, finans, personel, üretim ve operasyon verilerini ortak bir sistemde ilişkilendirir. Departmanlar aynı kaynağı kullandığında tekrar veri girişi azalır, stok ve sipariş hareketleri izlenebilir, yönetim dashboard’ları güncel göstergeler sunar. Özel ERP geliştirme, standart bir paketin karşılamadığı iş kurallarını, saha akışlarını ve mevcut muhasebe veya üretim sistemlerini kontrollü biçimde bir araya getirir.', 'CRM müşteri ilişkileri ve satış fırsatlarına odaklanırken ERP işletmenin kaynak ve operasyon akışını daha geniş kapsamda yönetir. İki sistem birbirinin alternatifi olmak zorunda değildir; doğru entegrasyonla satış fırsatı siparişe, sipariş stok ve finans hareketlerine dönüşebilir. Böylece ekipler kopuk kayıtlar yerine uçtan uca izlenebilir bir süreç üzerinden çalışır.'] },
  { serviceKey: 'is-surecleri-otomasyonu', title: 'İş Süreçleri Otomasyonu ve Operasyon Yönetimi', anchor: 'İş süreçleri otomasyonu seçeneklerini görün', paragraphs: ['Tekrar eden görev oluşturma, teklif hazırlama, çok aşamalı onay, bildirim, belge üretme, raporlama ve sistemler arası veri aktarımı yazılımla kontrollü biçimde otomatikleştirilebilir. Personel, müşteri ve sipariş iş akışlarında hangi adımın kim tarafından, hangi koşulla tamamlanacağı açıkça tanımlanır.', 'Otomasyonun amacı insan kararını tamamen kaldırmak değil, gereksiz tekrarları azaltıp kritik kararları görünür hale getirmektir. Standart iş akışları operasyon maliyetini ve hata oranını düşürür; zaman damgaları, sorumlular ve denetim kayıtları izlenebilirliği artırır. İstisnalar ayrıca yönetildiğinde ekipler rutin takip yerine müşteri ve iş değeri üreten çalışmalara odaklanabilir.'] },
  { serviceKey: 'saas-yazilim-gelistirme', title: 'SaaS Yazılım ve Bulut Tabanlı Platform Geliştirme', anchor: 'SaaS geliştirme hizmetimizin kapsamını inceleyin', paragraphs: ['SaaS, kullanıcıların yazılıma internet üzerinden abonelik veya paket modeliyle eriştiği ürün yaklaşımıdır. Multi-tenant mimari farklı müşterilerin verisini güvenli biçimde ayırırken ortak altyapının yönetilebilir kalmasını sağlar. Üyelik, paket, kullanım limiti, ödeme entegrasyonu, rol ve yetki, dashboard ve bildirimler ürün modelinin temel parçalarıdır.', 'Yeni bir dijital ürün geliştiren girişimler pazarı ölçülebilir bir MVP ile test edebilir; mevcut şirketler kendi uzmanlıklarını müşterilerine sunulan bir platforma dönüştürebilir. Bulut mimarisi, API tasarımı, izleme ve ölçeklenebilir veri modeli başlangıçtan planlandığında ürün yeni kullanıcılar ve özelliklerle daha güvenli büyür.'] },
  { serviceKey: 'b2b-b2c-platform-gelistirme', title: 'B2B ve B2C Dijital Platform Çözümleri', anchor: 'B2B ve B2C platform çözümlerini keşfedin', paragraphs: ['B2B platformlar bayi veya kurumsal müşterilere özel fiyat, teklif, cari, stok, sipariş ve yetkilendirme deneyimleri sunar. B2C platformlarda ise son kullanıcı üyeliği, ürün veya hizmet satın alma, ödeme, kampanya, müşteri hesabı ve sipariş takibi öne çıkar.', 'B2B’de karar ve fiyatlandırma kuralları daha karmaşık, kullanıcı rolleri daha ayrıntılı olabilir; B2C’de hızlı ve anlaşılır satın alma deneyimi kritik önem taşır. Her iki modelde de merkezi yönetim paneli, güvenli ödeme, ERP/CRM bağlantıları ve ölçeklenebilir altyapı operasyonla dijital kanalın uyumlu çalışmasını sağlar.'] },
  { serviceKey: 'e-ticaret-yazilimi', title: 'E-Ticaret Yazılımı ve Online Satış Sistemleri', anchor: 'E-ticaret yazılımı yaklaşımımızı inceleyin', paragraphs: ['E-ticaret yazılımı; ürün, kategori, varyant, stok, sepet, ödeme, sipariş, kargo, kampanya, kupon ve müşteri hesabını aynı satış akışında birleştirir. Yönetim paneli günlük operasyonu kolaylaştırırken ERP, CRM ve pazaryeri entegrasyonları farklı kanallardaki bilgilerin tutarlı kalmasına yardımcı olur. Teknik SEO, performans ve mobil uyumluluk hem keşfedilebilirlik hem dönüşüm için birlikte ele alınır.', 'Hazır paketler standart kataloglar ve hızlı başlangıç için maliyet avantajı sağlayabilir. Özel e-ticaret yazılımı; karmaşık fiyatlandırma, B2B kuralları, özel ürün konfigürasyonu veya yoğun entegrasyon gerektiğinde daha fazla esneklik sunar. Doğru seçim bütçeye, satış modeline, büyüme hedeflerine ve operasyonun gerçek karmaşıklığına göre yapılmalıdır.'] },
  { serviceKey: 'mobil-uygulama-gelistirme', title: 'iOS ve Android Mobil Uygulama Geliştirme', anchor: 'Mobil uygulama geliştirme hizmetimizi görün', paragraphs: ['Başarılı mobil uygulama, ekran tasarımından önce ürün stratejisi ve kullanıcı ihtiyacıyla başlar. UI/UX akışları; hesap oluşturma, güvenli oturum, push notification, ödeme, konum servisleri ve günlük kullanım senaryolarına göre tasarlanır. Backend ve API katmanı veriyi güvenli biçimde yönetirken yönetim paneli içerik ve operasyon kontrolü sağlar.', 'Mevcut web yazılımıyla entegrasyon, kullanıcıların farklı kanallarda tutarlı deneyim yaşamasına yardımcı olur. Gerçek cihaz testleri, performans ve hata izleme sonrasında App Store ve Google Play gereksinimleri yönetilir. Yayın sonrası güncelleme planı, işletim sistemi değişiklikleri ve kullanıcı geri bildirimi ürünün sürdürülebilirliğini korur.'] },
  { serviceKey: 'api-sistem-entegrasyonlari', title: 'API ve Sistem Entegrasyonları', anchor: 'API ve sistem entegrasyonu seçeneklerini inceleyin', paragraphs: ['REST API ve güvenli entegrasyon katmanları; ERP, CRM, muhasebe, ödeme kuruluşu, kargo, SMS, e-posta, harita ve diğer üçüncü taraf servisler arasında veri akışı sağlar. Böylece ekiplerin bilgiyi bir sistemden indirip diğerine elle taşıması yerine işlemler belirlenen kurallarla otomatik yürür.', 'Sağlıklı entegrasyon yalnız bağlantı kurmak değildir. Kimlik doğrulama, veri eşleme, hata yönetimi, tekrar deneme, loglama ve senkronizasyon sıklığı açıkça planlanmalıdır. Kontrollü entegrasyon sipariş, stok, müşteri ve finans verisinin tutarlılığını artırırken olası kesintilerin operasyon üzerindeki etkisini sınırlar.'] },
  { serviceKey: 'dashboard-raporlama-sistemleri', title: 'Dashboard ve Yönetim Raporlama Sistemleri', anchor: 'Dashboard ve raporlama çözümlerini keşfedin', paragraphs: ['Dashboard sistemleri satış, operasyon, müşteri ve finans verisini KPI’lar, grafikler, tablolar ve filtrelerle karar verilebilir bilgiye dönüştürür. Gerçek zamanlı veya düzenli güncellenen göstergeler yöneticilerin eğilimleri, hedef sapmalarını ve müdahale gerektiren alanları erken görmesini sağlar.', 'Her role aynı ekranı sunmak yerine yönetici, ekip ve operasyon ihtiyaçlarına göre raporlar tasarlanır. Veri kaynaklarının tanımı, hesaplama kuralları ve tarih aralıkları açık olduğunda raporlama güvenilir bir karar destek sistemine dönüşür; yalnızca görsel bir grafik koleksiyonu olarak kalmaz.'] },
  { serviceKey: 'yapay-zeka-destekli-yazilim', title: 'Yapay Zeka Destekli Yazılım Çözümleri', anchor: 'Yapay zeka destekli yazılım kullanım alanlarını görün', paragraphs: ['Yapay zeka; doküman analizi, veri ve müşteri talebi sınıflandırma, içerik işleme, rapor özetleme, kontrollü chatbot veya asistanlar, görüntü analizi ve yeterli veri olduğunda tahminleme gibi belirli iş problemlerinde yararlı olabilir. Mevcut yazılıma API üzerinden eklenen AI katmanı kullanıcıya öneri sunabilir veya yoğun bilgi içinde doğru içeriği bulmayı kolaylaştırabilir.', 'AI her probleme uygun değildir. Veri kalitesi, hata maliyeti, gizlilik, insan denetimi ve ölçülebilir fayda değerlendirilmeden otomasyon kararı verilmemelidir. Bu nedenle önce iş ihtiyacını ve geleneksel kurallarla çözülebilecek alanları inceler, yapay zekayı yalnız anlamlı bir avantaj sağladığında kontrollü biçimde uygularız.'] },
  { serviceKey: 'web-sitesi-gelistirme', title: 'Kurumsal Web Sitesi Tasarımı ve Geliştirme', anchor: 'Kurumsal web sitesi geliştirme hizmetimizi inceleyin', paragraphs: ['Kurumsal web sitesi markanın kimliğini, uzmanlığını ve teklifini ziyaretçiye açık biçimde aktaran temel dijital kanaldır. Bilgi mimarisi, kullanıcı deneyimi, responsive tasarım ve dönüşüm odaklı CTA’lar ziyaretçinin aradığı içeriğe kolayca ulaşmasını sağlar. İçerik yönetimi, güvenli iletişim formları ve çok dilli yapı ekiplerin farklı pazarlara tutarlı biçimde ulaşmasına yardımcı olur.', 'Hız, Core Web Vitals, erişilebilirlik ve teknik SEO altyapısı tasarım kadar önemlidir. Optimize edilmiş görseller, doğru başlık hiyerarşisi, metadata, analytics ve güvenli yayın süreci sitenin sürdürülebilir performansını destekler. Amaç yalnız estetik bir vitrin değil, ölçülebilir iş hedeflerine hizmet eden güvenilir bir kurumsal deneyimdir.'] },
  { serviceKey: 'seo-dijital-pazarlama', title: 'SEO ve Dijital Pazarlama Çözümleri', anchor: 'SEO ve dijital pazarlama hizmetimizi keşfedin', paragraphs: ['SEO; teknik altyapı, site mimarisi, içerik kalitesi ve kullanıcı deneyiminin birlikte geliştirilmesini gerektirir. Tarama ve indeksleme, internal linking, schema, sitemap, performans ve Search Console verileri teknik görünürlüğün temelini oluşturur. İçerik stratejisi ise kullanıcıların gerçek sorularına özgün ve anlaşılır yanıtlar üretir.', 'Organik görünürlük zaman, tutarlılık ve ölçüm gerektirir; belirli bir sıra garantisi vermek doğru değildir. Dönüşüm takibi, nitelikli trafik ve kullanıcı davranışı birlikte değerlendirildiğinde SEO ve dijital pazarlama yatırımı yalnız ziyaret sayısına değil, iş sonucuna göre iyileştirilebilir.'] },
  { serviceKey: 'yazilim-modernizasyonu', title: 'Mevcut Yazılımların Modernizasyonu', anchor: 'Yazılım modernizasyonu yaklaşımımızı inceleyin', paragraphs: ['Eski bir yazılımı tamamen değiştirmek her zaman gerekli veya güvenli değildir. Teknik analizle modern frontend, yeni backend servisleri, API mimarisi, veritabanı optimizasyonu ve responsive arayüz ihtiyaçları önceliklendirilir. Kritik iş kuralları ve veri korunarak aşamalı geçiş planı hazırlanır.', 'Modernizasyon; performans, güvenlik, entegrasyon yeteneği ve bakım kolaylığını geliştirirken iş sürekliliğini korumalıdır. Otomatik testler, izleme ve kontrollü veri taşıma sayesinde risk azaltılır; yeni modüllerin eklenebileceği daha sürdürülebilir bir teknik temel oluşturulur.'] },
]

const enSections: GuideSection[] = trSections.map((section, index) => ({ serviceKey: section.serviceKey, ...[
  ['Web Software Development','Web software turns business processes into secure browser-based applications rather than static pages. Management panels, customer portals, operational tools and dashboards combine databases, permissions and APIs so users can complete real work from any device. Responsive interfaces, validation, performance and scalable architecture are planned together, allowing the platform to grow without losing reliability.','Explore our web software development service'],
  ['Custom Software Development for Your Business','Packaged products are useful for standard workflows, but custom software fits the organization’s actual roles, approvals, reports and integrations. Discovery identifies needs and exceptions before modular development begins. SMEs can replace spreadsheets, growing businesses can connect departments, and enterprise teams can govern complex operations through permissions, automation and maintainable architecture.','Review our custom software development approach'],
  ['CRM Software Solutions for Connected Customer Operations','A CRM system centralizes customer records, leads, pipeline stages, proposals, interaction history, tasks and reminders. Segmentation, dashboards and reporting help sales teams act consistently. A custom CRM becomes valuable when pricing, approvals, dealer structures or integrations do not fit a generic product, while email and API connections keep information current.','Discover our CRM software solutions'],
  ['ERP Software Solutions for Centralized Operations','ERP connects inventory, purchasing, sales, orders, warehouses, finance, personnel and production through shared data. Management dashboards improve visibility across departments. CRM focuses on customer relationships and opportunities; ERP coordinates wider resources and operations. Integrated together, they can turn a sales opportunity into a traceable order and financial process.','Learn more about our ERP solutions'],
  ['Business Process Automation and Operations Management','Automation can create tasks, route approvals, generate documents, send notifications and transfer data between systems. It reduces repetitive work without removing necessary human judgment. Clear rules, exceptions and audit trails lower operational cost and error rates while making ownership and progress easier to follow.','Explore business process automation'],
  ['SaaS and Cloud Platform Development','SaaS products deliver software through subscriptions or plans. Multi-tenant architecture, user management, billing, roles, usage limits, dashboards, APIs and cloud infrastructure must work as one product system. Startups can validate a focused MVP while established businesses can turn expertise into a scalable digital service.','Review our SaaS development capabilities'],
  ['B2B and B2C Digital Platform Solutions','B2B platforms support dealer pricing, quotations, credit, inventory, orders and detailed permissions. B2C platforms prioritize membership, purchasing, payments, campaigns and order tracking. Although their commercial rules differ, both require secure administration, reliable integrations and an experience designed for their users.','Discover B2B and B2C platform development'],
  ['E-Commerce Software and Online Sales Systems','E-commerce software connects products, variants, stock, basket, payment, orders, shipping, promotions and customer accounts. ERP, CRM and marketplace integrations keep operations aligned. Packaged platforms suit standard and rapid launches; custom commerce is better when pricing, configuration or integration rules are genuinely complex.','Explore our e-commerce development service'],
  ['iOS and Android Mobile App Development','Mobile products begin with strategy and user journeys, then combine UI/UX, accounts, push notifications, payments, location services, APIs and backend systems. Management tools support operations while integration with existing web software keeps data consistent. Device testing, store release and continuous maintenance protect the product after launch.','See our mobile app development service'],
  ['API and System Integrations','REST APIs connect ERP, CRM, accounting, payments, shipping, SMS, email, maps and other third-party services. They replace manual data transfer with controlled synchronization. Authentication, mapping, retries, logs and error handling are essential so a temporary service failure does not become an operational data problem.','Review our API and integration services'],
  ['Dashboard and Management Reporting Systems','Dashboards transform sales, operational, customer and financial data into KPIs, charts, filters and role-specific management views. Clear definitions and reliable sources matter more than decorative graphs. Designed well, reporting highlights trends, exceptions and decisions that require attention.','Discover dashboard and reporting solutions'],
  ['AI-Powered Software Solutions','Practical AI applications include document analysis, classification, support assistants, summarization, content processing and carefully evaluated prediction. AI is not the right solution for every problem; data quality, privacy, error cost and human oversight must be assessed first. We apply it only where it creates measurable value.','Explore responsible AI software applications'],
  ['Corporate Website Design and Development','A corporate website should express brand identity through clear architecture, responsive design and accessible content. Fast loading, Core Web Vitals, technical SEO, secure forms, multilingual publishing, analytics and purposeful calls to action turn it into a dependable business channel rather than a static brochure.','Review our corporate website development service'],
  ['SEO and Digital Marketing Solutions','Technical SEO covers crawlability, architecture, internal links, structured data, sitemaps, performance and Search Console insights. Content strategy answers real audience needs while conversion tracking connects visibility with outcomes. Sustainable organic growth requires evidence and iteration; responsible work never promises a guaranteed ranking.','Explore our SEO and digital marketing service'],
  ['Modernizing Existing Software','Modernization improves legacy systems through a renewed frontend, service-based backend, APIs, database optimization and responsive interfaces. A phased plan protects critical rules, data and continuity. Testing, monitoring and controlled migration reduce risk while creating a more secure, maintainable foundation for future development.','Review our software modernization approach'],
][index].reduce((result, value, valueIndex) => valueIndex === 0 ? { ...result, title: value } : valueIndex === 1 ? { ...result, paragraphs: [value] } : { ...result, anchor: value }, {} as Partial<GuideSection>) })) as GuideSection[]

const copy = {
  tr: {
    eyebrow: 'Dijital Dönüşüm ve Yazılım Çözümleri',
    title: 'İşletmenize Özel Web, Yazılım ve Dijital Çözümler',
    intro: ['Pars Medya yalnızca kurumsal web sitesi hazırlayan bir ajans değildir. İşletmenin hedeflerini, kullanıcılarını, verisini ve günlük operasyonlarını analiz ederek tasarım, yazılım geliştirme ve ölçülebilir dijital büyüme süreçlerini bütüncül biçimde ele alırız. Web yazılım, özel yazılım geliştirme, CRM ve ERP yazılımı, SaaS, mobil uygulama, e-ticaret ve API entegrasyonu aynı iş hedefi çevresinde planlanır.', 'İş süreçleri otomasyonu ve yapay zekayı yalnız açık bir operasyonel fayda sağladığı yerde kullanırız. Performans, güvenlik, sürdürülebilir bakım ve kullanıcı deneyimi her teknik kararın parçasıdır. SEO ve dijital pazarlama ise geliştirilen dijital ürünün doğru kitleye ulaşmasını ve görünürlüğün ölçülebilir aksiyona dönüşmesini destekler.'],
    more: 'Kapsam ve kazanımlar',
    deliver: 'Neler Sunuyoruz?',
    value: 'İşletmenize Ne Kazandırır?',
  },
  en: {
    eyebrow: 'Digital Transformation & Software Solutions',
    title: 'Web, Software and Digital Solutions Built for Your Business',
    intro: ['Pars Medya is more than a team that builds corporate websites. We examine business goals, users, data and daily operations before connecting product design, software engineering and measurable digital growth. This integrated approach covers web software, custom development, CRM and ERP platforms, SaaS products, mobile applications, e-commerce and API integrations.', 'We use process automation and responsible AI where they create a clear operational advantage, while performance, security, maintainability and user experience guide every technical decision. SEO and digital marketing help the resulting product reach the right audience and turn attention into measurable action.'],
    more: 'Scope and benefits',
    deliver: 'What We Deliver',
    value: 'Value for Your Business',
  },
} as const

/**
 * Service guide: every card shows the essentials; the long copy sits in a native <details>,
 * so it stays in the server-rendered HTML (indexable, find-in-page) without client JS.
 */
export function ServicesSeoContent({ locale = 'tr' }: { locale?: Locale }) {
  const english = locale === 'en'
  const t = copy[locale]
  const sections = english ? enSections : trSections
  const source = english ? englishServices : services
  const prefix = english ? '/en/services' : '/hizmetler'
  const categories = english ? categoryLabels.en : categoryLabels.tr
  const highlights = english ? editorialHighlights.en : editorialHighlights.tr

  return <section aria-labelledby="services-guide-heading" className="bg-background">
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
      <header className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-16" data-reveal>
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 id="services-guide-heading" className="text-display mt-5 text-balance text-[2.1rem] text-foreground sm:text-5xl">{t.title}</h2>
        </div>
        <div className="space-y-4 text-pretty leading-7 text-muted-foreground lg:pt-12">{t.intro.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}</div>
      </header>

      <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((item, index) => {
          const service = source.find((candidate) => english ? 'trSlug' in candidate && candidate.trSlug === item.serviceKey : candidate.slug === item.serviceKey)
          if (!service) return null
          const Icon = service.icon
          const highlight = highlights[item.serviceKey as keyof typeof highlights]
          const featureNames = service.features.slice(0, 6).map((feature) => feature.title)
          const benefits = service.benefits?.slice(0, 4) ?? []
          const number = String(index + 1).padStart(2, '0')

          return <article key={item.serviceKey} id={`rehber-${item.serviceKey}`} data-reveal style={stagger(index % 3)} className="flex scroll-mt-28 flex-col rounded-2xl border border-border bg-card p-6 transition-colors duration-500 hover:border-foreground/20 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center gap-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent-strong">
                <span className="tabular-nums">{number}</span><span className="h-px w-6 bg-accent/50" aria-hidden="true" /><span>{categories[index]}</span>
              </p>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-primary"><Icon className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" /></span>
            </div>
            <h3 className="mt-5 text-balance font-display text-xl font-bold tracking-tight text-foreground sm:text-[1.375rem]">{item.title}</h3>
            <p className="mb-5 mt-3 text-pretty text-[0.9375rem] leading-relaxed text-muted-foreground">{service.description}</p>

            <details className="group/details mt-auto border-t border-border pt-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm text-sm font-semibold text-foreground transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                {t.more}<ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-300 group-open/details:rotate-180" aria-hidden="true" />
              </summary>
              <div className="mt-4 space-y-4 text-[0.9375rem] leading-7 text-muted-foreground">
                {item.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)} className="text-pretty">{paragraph}</p>)}
                {highlight && <p className="text-balance font-display text-lg font-bold leading-snug text-foreground">{highlight}</p>}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{t.deliver}</h4>
                  <ul className="mt-3 grid gap-2">{featureNames.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/80"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-strong" aria-hidden="true" />{feature}</li>)}</ul>
                </div>
                {benefits.length > 0 && <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">{t.value}</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">{benefits.map((benefit) => <li key={benefit} className="rounded-full border border-border bg-background px-3 py-1 text-[0.8125rem] text-foreground/80">{benefit}</li>)}</ul>
                </div>}
              </div>
            </details>

            <Link href={`${prefix}/${service.slug}`} className="group mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent-strong transition-colors hover:text-foreground">{item.anchor}<ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>
          </article>
        })}
      </div>
    </div>
  </section>
}
