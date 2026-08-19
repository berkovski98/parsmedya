import { getCitiesForRegion, TURKEY_REGION_ORDER, type TurkeyCity, type TurkeyDistrict, type TurkeyRegion } from '@/lib/locations/turkey'
import { localRegionPath } from '@/lib/local-seo/resolve'
import type { LocalSeoFaq } from '@/lib/local-seo/types'
import { getLocalService, getLocalServices } from '@/lib/services/service-registry'
import { clipMeta, locative, pick, pickMany, possessive } from '@/lib/local-seo/text-utils'

export type HubContentCard = {
  title: string
  description: string
  href?: string
}

export type HubProcessStep = {
  title: string
  description: string
}

export type HubServiceCard = {
  title: string
  description: string
  href: string
  slug: string
}

export type HubRegionCard = {
  name: string
  description: string
  cityCount: number
  href: string
}

export type HubLocationCard = {
  name: string
  description: string
  href: string
  cta: string
}

export type HubSections = {
  overviewTitle: string
  overviewParagraphs: string[]
  serviceCards: HubServiceCard[]
  processTitle: string
  processSteps: HubProcessStep[]
  solutionTitle?: string
  solutionCards?: HubContentCard[]
  useCaseTitle?: string
  useCases?: HubContentCard[]
  sectorTitle?: string
  sectors?: HubContentCard[]
  digitalizationTitle?: string
  digitalizationAreas?: HubContentCard[]
  audienceTitle?: string
  audienceCards?: HubContentCard[]
  whyTitle: string
  whyCards: HubContentCard[]
  regionCards?: HubRegionCard[]
  locationCards?: HubLocationCard[]
  popularServices?: HubServiceCard[]
  popularServicesTitle?: string
  locationSectionTitle?: string
}

const NATIONAL_SERVICE_SLUGS = [
  'ozel-yazilim-gelistirme',
  'crm-yazilim-cozumleri',
  'erp-yazilim-cozumleri',
  'kurumsal-web-uygulamalari',
  'e-ticaret-yazilimi',
  'mobil-uygulama-gelistirme',
  'api-sistem-entegrasyonlari',
  'yapay-zeka-destekli-yazilim',
] as const

const REGION_PROFILE: Record<TurkeyRegion, { focus: string; economy: string; projects: string }> = {
  Marmara: {
    focus: 'ticaret, lojistik, üretim ve kurumsal hizmet',
    economy: 'Türkiye’nin en yoğun sanayi ve ihracat hatlarına yakın operasyonlar',
    projects: 'bayi ağları, üretim takibi, B2B sipariş platformları ve kurumsal portallar',
  },
  Ege: {
    focus: 'üretim, tarım, turizm ve ihracat odaklı işletmeler',
    economy: 'liman, turizm ve tarım tedarik zincirlerinin kesiştiği iş modelleri',
    projects: 'stok–sipariş yönetimi, rezervasyon sistemleri ve saha satış uygulamaları',
  },
  Akdeniz: {
    focus: 'turizm, tarım, perakende ve bölgesel ticaret',
    economy: 'mevsimsel talep dalgalanmalarını yöneten operasyonlar',
    projects: 'e-ticaret, kanal yönetimi, müşteri portalları ve raporlama panelleri',
  },
  'İç Anadolu': {
    focus: 'kamu, üretim, lojistik ve hizmet sektörü',
    economy: 'merkezi konum avantajıyla dağıtım ve tedarik ağları',
    projects: 'ERP modülleri, stok merkezleri, saha ekipleri ve otomasyon projeleri',
  },
  Karadeniz: {
    focus: 'üretim, tarım, balıkçılık ve bölgesel hizmet',
    economy: 'coğrafi dağınıklığı telafi eden dijital süreç ihtiyaçları',
    projects: 'saha takibi, tedarik zinciri, bayi yönetimi ve mobil saha uygulamaları',
  },
  'Doğu Anadolu': {
    focus: 'kamu, ticaret, lojistik ve yerel hizmet',
    economy: 'uzun mesafe koordinasyon gerektiren operasyonlar',
    projects: 'merkez–şube veri senkronizasyonu, stok yönetimi ve raporlama sistemleri',
  },
  'Güneydoğu Anadolu': {
    focus: 'tarım, ticaret, üretim ve bölgesel hizmet',
    economy: 'tedarik, dağıtım ve çok noktalı satış modelleri',
    projects: 'bayi portalları, sipariş otomasyonu, CRM ve entegrasyon projeleri',
  },
}

const REGION_BLURBS: Record<TurkeyRegion, string> = {
  Marmara: 'Sanayi, lojistik ve kurumsal hizmet yoğunluğu yüksek; çok lokasyonlu yazılım ihtiyacı belirgindir.',
  Ege: 'Üretim, tarım ve turizm işletmeleri dijital süreçleri farklı kanallardan yönetmek ister.',
  Akdeniz: 'Turizm ve perakende dönemsel yoğunluk yaşar; ölçeklenebilir altyapı kritiktir.',
  'İç Anadolu': 'Merkezi konum sayesinde dağıtım ve tedarik operasyonları dijitalleşmeye uygundur.',
  Karadeniz: 'Dağınık coğrafyada saha ekipleri ve merkez ofis aynı sistemde buluşmalıdır.',
  'Doğu Anadolu': 'Uzun mesafe koordinasyonu ve merkezi raporlama ihtiyacı öne çıkar.',
  'Güneydoğu Anadolu': 'Ticaret ve üretim hatlarında sipariş–stok–bayi süreçleri dijitalleşir.',
}

const WHY_NATIONAL: HubContentCard[] = [
  { title: 'Tek ekipten uçtan uca çözüm', description: 'Analiz, tasarım, geliştirme, test ve canlıya alma aynı ekip içinde yürütülür; sorumluluk parçalanmaz.' },
  { title: 'Ölçeklenebilir altyapı', description: 'Modüler mimari sayesinde kullanıcı, şube ve iş hacmi arttıkça sistem performansını korur.' },
  { title: 'Güvenli yazılım', description: 'Yetkilendirme, veri izolasyonu ve güncelleme disiplini proje başından planlanır.' },
  { title: 'API entegrasyon kabiliyeti', description: 'Muhasebe, ERP, ödeme, kargo ve üçüncü taraf servislerle konuşabilen entegrasyon katmanı kurulur.' },
  { title: 'Sürekli geliştirme', description: 'Canlıya alma sonrası bakım, iyileştirme ve yeni modül ekleme süreçleri şeffaf yönetilir.' },
  { title: 'Şehir bağımsız destek', description: 'Türkiye genelinde aynı proje yönetim modeliyle uzaktan veya hibrit koordinasyon sağlanır.' },
]

const PROCESS_NATIONAL: HubProcessStep[] = [
  { title: 'İhtiyaç Analizi', description: 'Mevcut süreçler, kullanıcı rolleri, entegrasyon noktaları ve öncelikler birlikte haritalanır.' },
  { title: 'Teknik Planlama', description: 'Mimari, veri modeli, modül kapsamı ve teslimat fazları net bir yol haritasına dönüştürülür.' },
  { title: 'Tasarım', description: 'Kullanıcı akışları, arayüz ve deneyim tasarımı iş hedefleriyle uyumlu şekilde oluşturulur.' },
  { title: 'Geliştirme', description: 'Agile sprintlerle modüller geliştirilir; ara demo ve geri bildirim döngüleri korunur.' },
  { title: 'Test', description: 'Fonksiyonel, entegrasyon ve performans testleri gerçek senaryolara yakın verilerle yapılır.' },
  { title: 'Canlıya Alma ve Destek', description: 'Yayın, eğitim ve izleme adımları tamamlanır; bakım planı devreye alınır.' },
]

const SOLUTION_CARDS = [
  { title: 'Kurumsal Yazılım', description: 'İş süreçlerinize özel modüller, yetki yapısı ve raporlama katmanları.' },
  { title: 'ERP Sistemleri', description: 'Stok, satın alma, üretim ve finans verilerini tek merkezde toplayan yapılar.' },
  { title: 'CRM Çözümleri', description: 'Müşteri, teklif ve satış hunisi yönetimi; saha ve merkez ekipleri için ortak panel.' },
  { title: 'E-Ticaret', description: 'Ödeme, kargo ve pazaryeri entegrasyonlarıyla uçtan uca satış altyapısı.' },
  { title: 'API Entegrasyonları', description: 'Muhasebe, lojistik, SMS, e-posta ve harici servislerle güvenli veri akışı.' },
  { title: 'Web Platformları', description: 'Kurumsal siteler, müşteri portalları ve yönetim panelleri.' },
  { title: 'Mobil Uygulamalar', description: 'Saha ekipleri, bayiler ve son kullanıcılar için iOS ve Android uygulamaları.' },
  { title: 'Dijital Pazarlama', description: 'SEO, içerik ve dönüşüm odaklı büyüme altyapısı.' },
]

const USE_CASES = [
  { title: 'Bayi yönetimi', description: 'Bayi başvurusu, stok görünürlüğü, sipariş onayı ve performans raporları.' },
  { title: 'Sipariş sistemleri', description: 'Tekliften sevkiyata kadar sipariş yaşam döngüsünün dijital takibi.' },
  { title: 'Üretim takibi', description: 'İş emri, hammadde ve kalite kontrol adımlarının anlık izlenmesi.' },
  { title: 'Müşteri portalları', description: 'Sipariş geçmişi, fatura, destek talebi ve self-servis işlemler.' },
  { title: 'B2B / B2C platformlar', description: 'Farklı fiyat listeleri, rol bazlı katalog ve ödeme akışları.' },
  { title: 'Dashboard ve raporlama', description: 'Yönetim panelleri, KPI takibi ve dışa aktarılabilir raporlar.' },
  { title: 'Süreç otomasyonu', description: 'Onay akışları, bildirimler ve tekrarlayan işlerin otomatikleştirilmesi.' },
]

const SECTORS = [
  { title: 'Perakende', description: 'Stok, kasa entegrasyonu ve çok kanallı satış yönetimi.' },
  { title: 'Hizmet', description: 'Randevu, teklif ve müşteri ilişkileri yönetimi.' },
  { title: 'Turizm', description: 'Rezervasyon, kanal yönetimi ve misafir deneyimi uygulamaları.' },
  { title: 'E-Ticaret', description: 'Pazaryeri, kargo ve ödeme altyapısı entegrasyonları.' },
  { title: 'Lojistik', description: 'Sevkiyat takibi, depo yönetimi ve saha operasyonları.' },
  { title: 'Üretim', description: 'İş emri, kalite ve tedarik zinciri dijitalleştirmesi.' },
  { title: 'Danışmanlık', description: 'Proje, teklif ve müşteri portföyü yönetimi.' },
  { title: 'Gayrimenkul', description: 'Portföy, randevu ve müşteri iletişim sistemleri.' },
]

const DIGITALIZATION = [
  { title: 'Müşteri yönetimi', description: 'Tekilleştirilmiş müşteri kaydı, geçmiş etkileşimler ve segmentasyon.' },
  { title: 'Stok takibi', description: 'Depo, şube ve saha stoklarının anlık senkronizasyonu.' },
  { title: 'Teklif süreçleri', description: 'Şablon tabanlı teklif, onay ve revizyon akışları.' },
  { title: 'Sipariş yönetimi', description: 'Kanaldan bağımsız sipariş toplama ve durum bildirimleri.' },
  { title: 'Rezervasyon', description: 'Takvim, kapasite ve ödeme entegrasyonlu rezervasyon modülleri.' },
  { title: 'Raporlama', description: 'Yönetim panelleri ve dışa aktarılabilir analiz çıktıları.' },
  { title: 'Otomasyon', description: 'Tekrarlayan görevler, bildirimler ve onay zincirleri.' },
  { title: 'Ödeme entegrasyonu', description: 'Sanal POS, havale takibi ve taksit senaryoları.' },
]

const AUDIENCE = [
  { title: 'KOBİ ve büyüyen işletmeler', description: 'Excel ve dağınık araçlardan kurumsal sisteme geçiş planlayan ekipler.' },
  { title: 'Çok şubeli yapılar', description: 'Merkez ve saha ekiplerinin aynı veri setinde çalışması gereken operasyonlar.' },
  { title: 'Üretim ve lojistik firmaları', description: 'Stok, sipariş ve sevkiyat süreçlerini dijitalleştirmek isteyen işletmeler.' },
  { title: 'Hizmet ve danışmanlık şirketleri', description: 'Teklif, proje ve müşteri takibini tek panelde toplamak isteyen ekipler.' },
  { title: 'E-ticaret markaları', description: 'Ölçeklenebilir mağaza, entegrasyon ve büyüme altyapısı arayan işletmeler.' },
]

const DISTRICT_POPULAR_SLUGS = [
  'web-yazilim-gelistirme',
  'ozel-yazilim-gelistirme',
  'crm-yazilim-cozumleri',
  'erp-yazilim-cozumleri',
  'e-ticaret-yazilimi',
  'seo-dijital-pazarlama',
] as const

function serviceCard(slug: string, hrefPrefix: string): HubServiceCard | null {
  const service = getLocalService(slug)
  if (!service) return null
  return {
    slug: service.slug,
    title: service.title,
    description: service.shortDescription,
    href: `${hrefPrefix}/${service.slug}`,
  }
}

function serviceCards(slugs: readonly string[], hrefPrefix: string) {
  return slugs.map((slug) => serviceCard(slug, hrefPrefix)).filter((item): item is HubServiceCard => item !== null)
}

function nationalOverview(): string[] {
  return [
    'Pars Medya; web, mobil, kurumsal yazılım, entegrasyon ve dijital büyüme projelerini Türkiye genelindeki işletmeler için planlar. Şehir bağımsız çalışma modelimiz sayesinde keşif, tasarım ve geliştirme süreçlerini uzaktan proje yönetimi disipliniyle yürütürüz.',
    'Kurumsal yazılım, CRM, ERP, e-ticaret ve API entegrasyonlarında hazır paket dayatmak yerine mevcut süreçlerinize uygun modüler çözümler kurgularız. Analiz aşamasında kullanıcı rolleri, veri akışları ve entegrasyon noktaları netleştirilir; böylece canlıya alma sonrası sürpriz kapsam artışları minimize edilir.',
    'Destek ve geliştirme hizmetlerimiz proje bitiminde sona ermez. Canlı sistemler için bakım, güvenlik güncellemeleri, performans iyileştirmeleri ve yeni modül ekleme ihtiyaçları planlı sprintlerle yönetilir. Türkiye’nin 81 ili ve ilçeleri için yayınladığımız hizmet sayfaları, bölgenize özel iç linklerle doğru hizmete ulaşmanızı sağlar.',
  ]
}

function regionOverview(region: TurkeyRegion): string[] {
  const profile = REGION_PROFILE[region]
  const cities = getCitiesForRegion(region)
  const frames = [
    [
      `${region} bölgesinde ${cities.length} il için yazılım ve dijital çözüm sayfaları sunuyoruz. Bölgedeki ${profile.focus} yapıları için ${profile.projects} gibi projelerde deneyimliyiz.`,
      `${profile.economy} bu coğrafyada dijital altyapının öncelikli olmasını gerektirir. Pars Medya, merkez ofis ve saha ekiplerinin aynı veri setinde çalıştığı modüler sistemler tasarlar.`,
      `Bölge sayfalarımız il ve ilçe bazlı hizmet linklerine açılır; proje koordinasyonu Türkiye genelinde aynı yöntemle yürütülür.`,
    ],
    [
      `${region} illerinde web, özel yazılım, CRM, ERP ve entegrasyon projelerini tek ekip içinde planlıyoruz. ${profile.focus} odaklı işletmeler için kapsam analizi şube, depo ve saha senaryolarını kapsayacak şekilde genişletilir.`,
      `${profile.projects} projelerinde veri modeli ve yetki yapısı baştan netleştirilir. Böylece büyüdükçe sisteme yeni modül eklemek mümkün olur.`,
      `Aşağıdaki il kartlarından şehrinize ve ilçe bazlı hizmet sayfalarına geçebilirsiniz.`,
    ],
  ]
  return pick(frames, region, 0)
}

function cityOverview(city: TurkeyCity): string[] {
  const profile = REGION_PROFILE[city.region]
  const districtCount = city.districts.length
  const seed = city.slug
  const metro = city.metropolitan ? 'büyükşehir ölçeğindeki' : 'yerel'
  const coast = city.coastal ? ' kıyı ve iç hat işletmeleri' : ''
  const frames = [
    [
      `${city.name}, ${city.region} bölgesinde ${districtCount} ilçeye yayılan ${metro} operasyonlar için yazılım ve dijital çözümler geliştirdiğimiz bir hizmet bölgesidir.${coast} Bu sayfa, ${possessive(city.name)} işletmelerinin ihtiyaç duyduğu hizmetlere hızlı erişim sağlar.`,
      `${profile.focus} için ${city.name} genelinde web, özel yazılım, CRM, ERP, e-ticaret ve entegrasyon projelerini analiz, mimari ve canlıya alma adımlarıyla yürütürüz. Hazır paket yerine mevcut süreçlerinize uygun modüler kapsam çıkarırız.`,
      `Aşağıdaki ilçe kartlarından ${city.name} içindeki bölgenize özel hizmet sayfalarına geçebilir; popüler hizmetler bölümünden doğrudan teklif almak istediğiniz çözüme ulaşabilirsiniz.`,
    ],
    [
      `${possessive(city.name)} ekipleri için dijital dönüşüm projelerinde merkez–şube–saha kullanıcılarını aynı mimaride buluşturuyoruz. ${city.region} bölgesindeki ${profile.economy} ${city.name} ölçeğinde de geçerlidir.`,
      `${districtCount} ilçenin tamamı için ayrı hizmet sayfaları yayınlıyoruz. Proje kapsamı tek bir ilçeyle sınırlı kalmaz; ${city.name} genelindeki operasyonlar tek sistemde yönetilebilir.`,
      `Keşif ve teslimatı uzaktan veya ihtiyaca göre yüz yüze koordinasyonla ilerletiriz; ${city.name} için ayrı bir şube adresi yayınlamıyoruz.`,
    ],
  ]
  return pick(frames, seed, 1)
}

function districtOverview(city: TurkeyCity, district: TurkeyDistrict): string[] {
  const seed = `${city.slug}:${district.slug}`
  const profile = REGION_PROFILE[city.region]
  const frames = [
    [
      `${district.name}, ${city.name} ili içinde yazılım ve dijital hizmet ihtiyacı olan işletmeler için yerel bir başlangıç noktasıdır. Web, özel yazılım, CRM, ERP ve e-ticaret projelerini ${city.name} genelindeki ekiplerle aynı proje disipliniyle yönetiriz.`,
      `${locative(district.name)} ${profile.focus} yoğunluğu farklı sektörlerden talep doğurabilir. Çözümleri yalnızca ilçe sınırına hapsetmeyiz; merkez, şube ve saha kullanıcıları ortak veri modelinde buluşur.`,
      `Aşağıdaki hizmet kartları ${district.name} için özelleştirilmiş sayfalara gider. Proje sonrası bakım ve geliştirme desteği Türkiye genelinde aynı modelle sürdürülür.`,
    ],
    [
      `${district.name} ve ${city.name} genelindeki işletmeler için dijitalleştirme projelerinde analiz, tasarım ve geliştirme adımlarını tek ekip içinde yürütüyoruz. ${profile.projects} gibi senaryolarda modüler mimari tercih edilir.`,
      `İlçe sayfası, ${district.name} adına yayınlanan hizmet linklerini toplar; fiziksel ofis iddiası taşımaz. Keşif toplantıları çevrimiçi veya ihtiyaca göre yüz yüze planlanır.`,
      `Popüler hizmetler bölümünden ${district.name} için en çok talep edilen çözümlere doğrudan ulaşabilirsiniz.`,
    ],
  ]
  return pick(frames, seed, 2)
}

export function nationalHubSections(): HubSections {
  return {
    overviewTitle: 'Türkiye Genelinde Yazılım ve Dijital Çözümler',
    overviewParagraphs: nationalOverview(),
    serviceCards: serviceCards(NATIONAL_SERVICE_SLUGS, '/hizmetler'),
    processTitle: 'Türkiye\'de Nasıl Çalışıyoruz?',
    processSteps: PROCESS_NATIONAL,
    whyTitle: 'Neden Pars Medya?',
    whyCards: WHY_NATIONAL,
    regionCards: TURKEY_REGION_ORDER.map((region) => ({
      name: region,
      description: REGION_BLURBS[region],
      cityCount: getCitiesForRegion(region).length,
      href: localRegionPath(region),
    })),
  }
}

export function regionHubSections(region: TurkeyRegion): HubSections {
  const cities = getCitiesForRegion(region)
  const seed = region
  return {
    overviewTitle: `${region} Bölgesinde Yazılım ve Dijital Çözümler`,
    overviewParagraphs: regionOverview(region),
    serviceCards: serviceCards(NATIONAL_SERVICE_SLUGS.slice(0, 6), '/hizmetler'),
    processTitle: 'Çalışma Modelimiz',
    processSteps: pickMany(PROCESS_NATIONAL, seed, 5, 0),
    solutionTitle: `${region}'daki İşletmeler İçin Çözümler`,
    solutionCards: pickMany(SOLUTION_CARDS, seed, 8, 10),
    useCaseTitle: `${region} Bölgesinde Hangi Projeleri Geliştiriyoruz?`,
    useCases: pickMany(USE_CASES, seed, 7, 20),
    whyTitle: 'Neden Pars Medya?',
    whyCards: pickMany(WHY_NATIONAL, seed, 4, 30),
    locationCards: cities.map((city) => ({
      name: city.name,
      description: `${city.name} yazılım, web ve dijital çözümler`,
      href: `/${city.slug}`,
      cta: 'İncele',
    })),
    locationSectionTitle: `${region} İlleri`,
  }
}

export function cityHubSections(city: TurkeyCity): HubSections {
  const prefix = `/${city.slug}`
  const seed = city.slug
  const featured = getLocalServices().filter((s) => s.source.featuredOnHome).slice(0, 6)
  const popularSlugs = featured.length ? featured.map((s) => s.slug) : NATIONAL_SERVICE_SLUGS.slice(0, 6)
  return {
    overviewTitle: `${city.name}'de Yazılım Hizmetleri`,
    overviewParagraphs: cityOverview(city),
    serviceCards: serviceCards(NATIONAL_SERVICE_SLUGS.slice(0, 8), prefix),
    processTitle: 'Nasıl Çalışıyoruz?',
    processSteps: PROCESS_NATIONAL,
    solutionTitle: 'Sunduğumuz Çözümler',
    solutionCards: pickMany(SOLUTION_CARDS, seed, 8, 5),
    audienceTitle: 'Kimler İçin Uygun?',
    audienceCards: pickMany(AUDIENCE, seed, 4, 15),
    useCaseTitle: 'Örnek Kullanım Alanları',
    useCases: pickMany(USE_CASES, seed, 6, 25),
    whyTitle: 'Neden Pars Medya?',
    whyCards: pickMany(WHY_NATIONAL, seed, 4, 35),
    popularServices: serviceCards(popularSlugs, prefix),
    popularServicesTitle: `${city.name} İçin Popüler Hizmetler`,
    locationCards: city.districts.map((district) => ({
      name: district.name,
      description: `${district.name} yazılım, web ve dijital çözümler`,
      href: `/${city.slug}/${district.slug}`,
      cta: 'İncele',
    })),
    locationSectionTitle: `${city.name} İlçeleri`,
  }
}

export function districtHubSections(city: TurkeyCity, district: TurkeyDistrict): HubSections {
  const prefix = `/${city.slug}/${district.slug}`
  const seed = `${city.slug}:${district.slug}`
  return {
    overviewTitle: `${district.name}'te Yazılım ve Dijital Hizmetler`,
    overviewParagraphs: districtOverview(city, district),
    serviceCards: serviceCards(DISTRICT_POPULAR_SLUGS, prefix),
    processTitle: 'Proje Süreci',
    processSteps: PROCESS_NATIONAL,
    solutionTitle: `${district.name}'teki İşletmeler İçin Çözümler`,
    solutionCards: pickMany(SOLUTION_CARDS, seed, 8, 8),
    digitalizationTitle: 'İş Süreçlerini Nasıl Dijitalleştiriyoruz?',
    digitalizationAreas: pickMany(DIGITALIZATION, seed, 8, 18),
    sectorTitle: 'Hangi Sektörlere Uygun?',
    sectors: pickMany(SECTORS, seed, 6, 28),
    whyTitle: 'Neden Pars Medya?',
    whyCards: pickMany(WHY_NATIONAL, seed, 4, 40),
    popularServices: serviceCards(DISTRICT_POPULAR_SLUGS, prefix).map((item) => ({
      ...item,
      title: `${district.name} ${item.title}`,
    })),
    popularServicesTitle: `${district.name} İçin Popüler Hizmetler`,
  }
}

export function nationalHubFaqs(): LocalSeoFaq[] {
  return [
    {
      question: 'Türkiye\'nin her iline hizmet veriyor musunuz?',
      answer: 'Evet. 81 il ve resmi ilçeler için hizmet bölgesi sayfaları yayınlıyoruz. Proje koordinasyonu şehir bağımsız yürütülür; keşif ve teslimat uzaktan veya hibrit modelle planlanır.',
    },
    {
      question: 'Yerinde toplantı gerekiyor mu?',
      answer: 'Zorunlu değildir. Keşif, demo ve proje toplantılarının büyük bölümü çevrimiçi yapılır. Kapsam ve ekip ihtiyacına göre yüz yüze koordinasyon planlanabilir.',
    },
    {
      question: 'Uzaktan proje nasıl yürütülüyor?',
      answer: 'Paylaşılan proje panosu, düzenli sprint demo’ları ve yazılı kapsam onayları ile ilerleriz. Tasarım, geliştirme ve test adımları aynı ekip içinde koordine edilir.',
    },
    {
      question: 'Kurumsal yazılım geliştirme süresi ne kadar?',
      answer: 'Kapsam, entegrasyon sayısı ve kullanıcı rollerine göre değişir. Analiz sonrası fazlı bir yol haritası çıkarır; MVP ve genişletme adımlarını netleştiririz.',
    },
    {
      question: 'Mevcut yazılımlar geliştirilebilir mi?',
      answer: 'Evet. Mevcut web sitesi, panel veya kurumsal yazılımınıza yeni modül ekleme, modernizasyon ve entegrasyon hizmetleri sunuyoruz.',
    },
    {
      question: 'Bakım ve destek veriyor musunuz?',
      answer: 'Canlıya alma sonrası bakım, güvenlik güncellemesi, hata giderme ve yeni özellik geliştirme için sürekli destek planları sunuyoruz.',
    },
    {
      question: 'Her ilçede ofisiniz mi var?',
      answer: 'Hayır. İlçe sayfaları hizmet bölgesi sayfalarıdır; her ilçede fiziksel ofis olduğu anlamına gelmez.',
    },
  ]
}

export function regionHubFaqs(region: TurkeyRegion): LocalSeoFaq[] {
  const cities = getCitiesForRegion(region)
  return [
    {
      question: `${region} bölgesinde hangi illere hizmet veriyorsunuz?`,
      answer: `${region} bölgesindeki ${cities.length} ilin tamamı için il ve ilçe bazlı hizmet sayfaları yayınlıyoruz.`,
    },
    {
      question: `${region} dışındaki illerle de çalışıyor musunuz?`,
      answer: 'Evet. Bölge sayfaları hizmet kapsamını gösterir; proje koordinasyonu Türkiye genelinde yürütülür.',
    },
    {
      question: `${region} için yerinde ekip gönderiyor musunuz?`,
      answer: 'Standart model uzaktan proje yönetimidir. Gerekli durumlarda saha koordinasyonu planlanabilir; her ilde kalıcı ofis bulunmaz.',
    },
    {
      question: 'Hangi hizmetler bölge sayfasından erişilebilir?',
      answer: 'Web, özel yazılım, CRM, ERP, e-ticaret, mobil uygulama, entegrasyon ve dijital pazarlama dahil tüm aktif hizmetler il bazlı sayfalara bağlanır.',
    },
    {
      question: 'Bölge bazlı projeler ne kadar sürer?',
      answer: 'Süre proje kapsamına bağlıdır. Analiz sonrası fazlı teslimat planı ve tahmini takvim paylaşılır.',
    },
  ]
}

export function cityHubFaqs(city: TurkeyCity): LocalSeoFaq[] {
  const districtCount = city.districts.length
  return [
    {
      question: `${city.name} içinde hangi ilçelere hizmet veriyorsunuz?`,
      answer: `${city.name} ilindeki ${districtCount} ilçenin tamamı için ilgili hizmet sayfalarını yayınlıyoruz. Proje kapsamı ilçe sınırına kilitlenmez.`,
    },
    {
      question: `${city.name} için ofisiniz var mı?`,
      answer: `${city.name} için ayrı bir şube adresi yayınlamıyoruz. Keşif ve teslimatı uzaktan, gerektiğinde yüz yüze koordinasyonla yürütürüz.`,
    },
    {
      question: `${city.name}'de hangi yazılım hizmetleri sunuluyor?`,
      answer: 'Özel yazılım, CRM, ERP, web platformları, e-ticaret, mobil uygulama, API entegrasyonları ve dijital pazarlama hizmetleri il bazlı sayfalarda listelenir.',
    },
    {
      question: 'Mevcut sistemlerimize entegrasyon yapılır mı?',
      answer: 'Evet. Muhasebe, ERP, ödeme, kargo ve harici API’lerle entegrasyon katmanı proje kapsamına dahil edilebilir.',
    },
    {
      question: 'Proje sonrası destek alabilir miyiz?',
      answer: 'Canlıya alma sonrası bakım, güvenlik ve yeni modül geliştirme için destek planları sunuyoruz.',
    },
    {
      question: 'Teklif süreci nasıl işler?',
      answer: 'Kısa bir keşif görüşmesi sonrası kapsam, fazlar ve tahmini takvim yazılı olarak paylaşılır.',
    },
  ]
}

export function districtHubFaqs(city: TurkeyCity, district: TurkeyDistrict): LocalSeoFaq[] {
  return [
    {
      question: `${district.name}'teki işletmelere uzaktan hizmet veriyor musunuz?`,
      answer: `Evet. ${district.name} için yayınlanan hizmet sayfaları uzaktan proje yönetimi modeliyle yürütülür; keşif toplantıları çevrimiçi planlanabilir.`,
    },
    {
      question: 'Özel yazılım geliştirme süreci nasıl ilerliyor?',
      answer: 'İhtiyaç analizi, teknik planlama, tasarım, geliştirme, test ve canlıya alma adımları sprint bazlı ilerler; her fazda demo ve onay alınır.',
    },
    {
      question: 'Mevcut web sitem geliştirilebilir mi?',
      answer: 'Evet. Mevcut sitenize yeni modül, performans iyileştirmesi, entegrasyon veya tasarım güncellemesi eklenebilir.',
    },
    {
      question: 'ERP ve CRM entegrasyonu yapıyor musunuz?',
      answer: 'Evet. CRM, ERP, muhasebe ve üçüncü taraf servislerle API tabanlı entegrasyonlar proje kapsamına dahil edilebilir.',
    },
    {
      question: 'E-ticaret sistemi geliştirilebilir misiniz?',
      answer: 'Ödeme, kargo, stok ve pazaryeri entegrasyonlarını kapsayan e-ticaret altyapıları geliştiriyoruz.',
    },
    {
      question: 'Proje sonrası destek sağlıyor musunuz?',
      answer: 'Canlıya alma sonrası bakım, hata giderme ve yeni özellik geliştirme için destek planları sunuyoruz.',
    },
    {
      question: `Yalnızca ${district.name} içindeki şirketlerle mi çalışıyorsunuz?`,
      answer: `Hayır. ${district.name} bir hizmet bölgesidir; ${city.name} ve Türkiye genelindeki işletmelerle de aynı süreçle çalışırız.`,
    },
  ]
}

export function nationalHubMeta() {
  return {
    title: 'Türkiye Geneli Yazılım ve Dijital Hizmetler | Pars Medya',
    description: clipMeta('Türkiye geneli yazılım ve dijital hizmetler. 81 il için web, özel yazılım, CRM, ERP, e-ticaret ve entegrasyon çözümlerini uzaktan proje yönetimiyle Pars Medya ile planlayın.'),
    h1: 'Türkiye Geneli Yazılım ve Dijital Hizmetler',
    intro: 'Pars Medya; web, özel yazılım, kurumsal sistemler ve dijital büyüme projelerini Türkiye genelindeki işletmeler için planlar. Şehir bağımsız proje yönetimiyle keşiften canlıya almaya kadar tek ekip içinde ilerleriz.',
  }
}

export function regionHubMeta(region: TurkeyRegion) {
  const cities = getCitiesForRegion(region)
  return {
    title: `${region} Yazılım ve Dijital Hizmetler | Pars Medya`,
    description: clipMeta(`${region} bölgesinde ${cities.length} il için web, özel yazılım, CRM, ERP ve dijital büyüme. ${region} illerinden hizmet sayfalarına Pars Medya ile ulaşın.`),
    h1: `${region} Yazılım ve Dijital Hizmetler`,
    intro: `${region} bölgesindeki ${cities.length} il için yazılım ve dijital çözüm sayfaları sunuyoruz. Kurumsal yazılım, web, mobil ve entegrasyon projelerini bölgeye özel içerik ve il linkleriyle planlayın.`,
  }
}

export function cityHubMeta(city: TurkeyCity) {
  const districtCount = city.districts.length
  return {
    title: `${city.name} Yazılım ve Dijital Çözümler | Pars Medya`,
    description: clipMeta(`${city.name} yazılım, web, CRM, ERP, e-ticaret ve dijital büyüme. ${districtCount} ilçedeki işletmeler için özel çözümleri Pars Medya ile planlayın.`),
    h1: `${city.name} Yazılım ve Dijital Çözümler`,
    intro: `${city.name} ve ${districtCount} ilçesindeki işletmeler için web, özel yazılım, entegrasyon ve dijital büyüme projelerini tek ekip içinde planlıyoruz.`,
  }
}

export function districtHubMeta(city: TurkeyCity, district: TurkeyDistrict) {
  return {
    title: `${district.name} Yazılım ve Dijital Çözümler | Pars Medya`,
    description: clipMeta(`${district.name} yazılım ve dijital çözümler: web, özel yazılım, CRM, ERP ve e-ticaret. ${city.name} genelindeki işletmeler için Pars Medya ile projenizi planlayın.`),
    h1: `${district.name} Yazılım ve Dijital Çözümler`,
    intro: `${district.name} ve ${city.name} genelindeki işletmeler için web, özel yazılım, entegrasyon ve dijital büyüme ihtiyaçlarını aynı ekip içinde planlıyoruz.`,
  }
}
