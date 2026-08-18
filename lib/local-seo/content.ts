import { getServicePageExtras } from '@/lib/service-page-copy'
import {
  getRelatedCities,
  getSiblingDistricts,
  type TurkeyCity,
  type TurkeyDistrict,
  type TurkeyRegion,
} from '@/lib/locations/turkey'
import { getRelatedLocalServices, type LocalServiceRecord } from '@/lib/services/service-registry'
import type { LocalSeoFaq, LocalSeoOverride } from '@/lib/local-seo/types'

export type LocalBreadcrumb = {
  name: string
  href: string
}

export type LocalServicePageModel = {
  kind: 'city-service' | 'district-service'
  canonicalPath: string
  indexable: boolean
  title: string
  description: string
  h1: string
  eyebrow: string
  heroDescription: string
  serviceSummary: string
  locationIntro: string
  solutionAreas: { title: string; description: string }[]
  capabilities: { title: string; description: string }[]
  features: { title: string; description: string }[]
  technologies: string[]
  process: { title: string; description: string }[]
  useCases: { title: string; description: string }[]
  sectorNotes: { title: string; description: string }[]
  why: { title: string; text: string }[]
  faqs: LocalSeoFaq[]
  breadcrumbs: LocalBreadcrumb[]
  districts: { name: string; href: string }[]
  otherDistricts: { name: string; href: string }[]
  allDistrictsHref: string
  relatedServices: { title: string; href: string; description: string }[]
  relatedLocations: { name: string; href: string }[]
  ctaTitle: string
  ctaText: string
  city: TurkeyCity
  district: TurkeyDistrict | null
  service: LocalServiceRecord
  areaServed: string[]
}

const REGION_BUSINESS: Record<TurkeyRegion, string> = {
  Marmara: 'ticaret, lojistik, üretim ve hizmet odaklı işletmeler',
  Ege: 'üretim, ticaret, turizm ve hizmet işletmeleri',
  Akdeniz: 'ticaret, tarım, turizm ve hizmet işletmeleri',
  'İç Anadolu': 'kamu, ticaret, üretim ve hizmet işletmeleri',
  Karadeniz: 'üretim, ticaret ve bölgesel hizmet işletmeleri',
  'Doğu Anadolu': 'kamu, ticaret ve yerel hizmet işletmeleri',
  'Güneydoğu Anadolu': 'ticaret, üretim ve bölgesel hizmet işletmeleri',
}

function hash(value: string) {
  let result = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

function pick<T>(items: readonly T[], seed: string, salt = 0) {
  return items[(hash(`${seed}:${salt}`) + salt) % items.length]
}

function clipMeta(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length >= 140 && normalized.length <= 160) return normalized
  if (normalized.length > 160) {
    const sliced = normalized.slice(0, 159)
    const cut = Math.max(sliced.lastIndexOf(' '), 120)
    return `${sliced.slice(0, cut).replace(/[,:;.-]+$/, '')}.`
  }
  const filler = ' Pars Medya ile kapsamı birlikte netleştirin.'
  const padded = `${normalized}${filler}`
  if (padded.length <= 160) return padded
  return `${normalized} Pars Medya ile planlayın.`
}

function lastVowel(name: string) {
  const vowels = name.toLocaleLowerCase('tr-TR').match(/[aeıioöuü]/g)
  return vowels?.[vowels.length - 1] || 'e'
}

function locativeSuffix(name: string) {
  return 'aıou'.includes(lastVowel(name)) ? 'da' : 'de'
}

function possessive(name: string) {
  return `${name}'${locativeSuffix(name)}`
}

function locative(name: string) {
  return `${name}'${locativeSuffix(name)}ki`
}

function featureNouns(service: LocalServiceRecord) {
  return service.source.features.slice(0, 3).map((feature) => feature.title.toLocaleLowerCase('tr-TR'))
}

function locationLabel(city: TurkeyCity, district: TurkeyDistrict | null) {
  return district ? district.name : city.name
}

function businessScope(city: TurkeyCity, district: TurkeyDistrict | null) {
  const region = REGION_BUSINESS[city.region]
  const metro = city.metropolitan ? 'büyükşehir ölçeğindeki operasyonlar ve' : 'yerel operasyonlar ve'
  const coast = city.coastal ? ' kıyı ve iç hat işletmeleri dahil' : ''
  if (district) {
    return `${locative(district.name)} ${metro} ${city.name} genelindeki ${region}${coast}`
  }
  return `${possessive(city.name)} ${metro} ${region}${coast}`
}

function uniqueHero(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null, seed: string) {
  const nouns = featureNouns(service)
  const frames = district
    ? [
        `${district.name} ve ${city.name} genelindeki işletmeler için ${service.title.toLocaleLowerCase('tr-TR')} kapsamında ${nouns[0] || 'iş süreçleri'}, ${nouns[1] || 'entegrasyon'} ve ${nouns[2] || 'raporlama'} ihtiyaçlarını aynı mimaride ele alıyoruz.`,
        `${locative(district.name)} ekiplerin günlük işlerini sadeleştiren, ${city.name} ölçeğinde büyüyebilen ${service.title.toLocaleLowerCase('tr-TR')} çözümleri geliştiriyoruz.`,
        `${district.name} merkezli işletmeler için ${service.shortDescription.replace(/\.$/, '')}; kapsam ${city.name} genelindeki şube ve ekipleri de kapsayacak şekilde planlanır.`,
      ]
    : [
        `${possessive(city.name)} işletmeler için ölçeklenebilir, güvenli ve iş süreçlerine uyarlanmış ${service.title.toLocaleLowerCase('tr-TR')} çözümleri geliştiriyoruz.`,
        `${city.name} özelinde ${nouns[0] || 'süreç yönetimi'}, ${nouns[1] || 'entegrasyon'} ve ${nouns[2] || 'raporlama'} ihtiyaçlarını ${service.title.toLocaleLowerCase('tr-TR')} kapsamında uçtan uca kurguluyoruz.`,
        `${city.region} bölgesindeki ${REGION_BUSINESS[city.region]} için ${service.title.toLocaleLowerCase('tr-TR')} projelerini analiz, mimari ve canlıya alma adımlarıyla yürütüyoruz.`,
      ]
  return pick(frames, seed, 1)
}

function uniqueSummary(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null, seed: string) {
  const extras = getServicePageExtras(service.slug)
  const outcome = extras.outcomes[hash(seed) % extras.outcomes.length]
  const place = locationLabel(city, district)
  const frames = [
    `${service.description} ${possessive(place)} teslimatta ${outcome.title.tr.toLocaleLowerCase('tr-TR')} hedefini merkeze alırız.`,
    `${service.title}, ${businessScope(city, district)} için mevcut araçlarla konuşabilen ve bakım maliyeti öngörülebilir bir ürün olarak kurgulanır.`,
    `${locative(place)} ekiplerin gerçek görev akışlarından yola çıkarak ${service.title.toLocaleLowerCase('tr-TR')} kapsamını modül, yetki ve veri modeli düzeyinde netleştiririz.`,
  ]
  return pick(frames, seed, 2)
}

function uniqueLocationIntro(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null, seed: string) {
  const districtCount = city.districts.length
  if (district) {
    const frames = [
      `${district.name}, ${city.name} ili içinde ${service.title.toLocaleLowerCase('tr-TR')} ihtiyacı olan işletmeler için yerel bir operasyon noktasıdır. Çözümleri ilçe sınırına hapsetmeyiz; ${city.name} genelindeki ekipler, müşteriler ve tedarik süreçleri aynı sistemde yönetilebilir.`,
      `${locative(district.name)} şirketler genelde ${city.name} içindeki diğer ilçelerle de çalışır. Bu nedenle ${service.title.toLocaleLowerCase('tr-TR')} projelerinde yetki, şube ve lokasyon kırılımını baştan planlarız.`,
      `${district.name} için kurulan ${service.title.toLocaleLowerCase('tr-TR')} altyapısı, ${city.name} ilindeki ${districtCount} ilçeden gelen talep, stok veya müşteri verisini tek yerde toplamaya uygun tasarlanır.`,
    ]
    return pick(frames, seed, 3)
  }
  const frames = [
    `${city.name}, ${city.region} bölgesinde ${districtCount} ilçeye yayılan işletme operasyonları için ${service.title.toLocaleLowerCase('tr-TR')} projelerinde çok lokasyonlu kullanım senaryolarını baştan hesaba katarız.`,
    `${possessive(city.name)} teslim ettiğimiz ${service.title.toLocaleLowerCase('tr-TR')} sistemleri, ilçe ekiplerinin ayrı çalışması yerine ortak veri, ortak yetki modeli ve ortak raporlama ile yönetilmesini hedefler.`,
    `${city.name} ölçeğinde ${service.title.toLocaleLowerCase('tr-TR')} ihtiyacı çoğu zaman tek bir ofisle sınırlı kalmaz. Analizde şube, saha ve merkez kullanıcılarını ayırır; gereksiz yere şişirilmemiş bir kapsam çıkarırız.`,
  ]
  return pick(frames, seed, 3)
}

function sectorNotes(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null) {
  const place = locative(locationLabel(city, district))
  const extras = getServicePageExtras(service.slug)
  return extras.outcomes.slice(0, 4).map((outcome) => ({
    title: outcome.title.tr,
    description: `${place} işletmeler için ${outcome.text.tr}`,
  }))
}

function locationFaqs(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null): LocalSeoFaq[] {
  const place = locationLabel(city, district)
  const serviceFaqs = service.source.faqs.slice(0, 3).map((item) => ({
    question: item.question,
    answer: item.answer,
  }))
  const local: LocalSeoFaq[] = [
    {
      question: `${place} için ${service.title.toLocaleLowerCase('tr-TR')} sürecini nasıl yürütüyorsunuz?`,
      answer: `${place} konumundaki ekiplerle keşif, kapsam ve teslimat adımlarını çevrimiçi veya ihtiyaca göre yüz yüze koordinasyonla ilerletiriz. İlçe bazında şube adresi yayınlamayız; proje ${city.name} ve Türkiye genelindeki işletmelerle aynı yöntemle yönetilir.`,
    },
    {
      question: `${place} dışında da aynı sistemi kullanabilir miyiz?`,
      answer: `Evet. ${service.title} çözümlerini ${district ? `${district.name} ve ${city.name}` : city.name} ile sınırlamayız. Yetki, şube ve lokasyon kırılımları analiz sırasında belirlenir.`,
    },
  ]
  return [...serviceFaqs, ...local]
}

function relatedLocationLinks(city: TurkeyCity, district: TurkeyDistrict | null, service: LocalServiceRecord) {
  if (district) {
    return getSiblingDistricts(city, district.slug, 8).map((item) => ({
      name: item.name,
      href: `/${city.slug}/${item.slug}/${service.slug}`,
    }))
  }
  return getRelatedCities(city, 6).map((item) => ({
    name: item.name,
    href: `/${item.slug}/${service.slug}`,
  }))
}

function fitMeta(service: LocalServiceRecord, city: TurkeyCity, district: TurkeyDistrict | null, seed: string) {
  const nouns = featureNouns(service)
  const place = locationLabel(city, district)
  const cityHint = district ? ` ${city.name} genelindeki` : ''
  const frames = [
    `${place} ${service.title.toLocaleLowerCase('tr-TR')} hizmetleriyle${cityHint} işletmeler için ${nouns[0] || 'yazılım'}, ${nouns[1] || 'otomasyon'} ve ${nouns[2] || 'entegrasyon'} çözümleri geliştirin.`,
    `${place} ${service.title.toLocaleLowerCase('tr-TR')} ile ${nouns[0] || 'iş süreçleri'} ve ${nouns[1] || 'raporlama'} ihtiyaçlarınızı Pars Medya ekibiyle planlayın.`,
    `${locative(place)} ekipler için ${service.title.toLocaleLowerCase('tr-TR')}: ${nouns.slice(0, 2).join(', ') || service.shortDescription}. Pars Medya ile projenizi konuşun.`,
  ]
  return clipMeta(pick(frames, seed, 4))
}

export function buildLocalServicePage(
  city: TurkeyCity,
  service: LocalServiceRecord,
  district: TurkeyDistrict | null = null,
  override: LocalSeoOverride | null = null,
): LocalServicePageModel {
  const seed = `${city.slug}:${district?.slug || ''}:${service.slug}`
  const extras = getServicePageExtras(service.slug)
  const place = locationLabel(city, district)
  const kind = district ? 'district-service' : 'city-service'
  const canonicalPath = district
    ? `/${city.slug}/${district.slug}/${service.slug}`
    : `/${city.slug}/${service.slug}`
  const defaultH1 = `${place} ${service.title}`
  const breadcrumbs: LocalBreadcrumb[] = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hizmetler', href: '/hizmetler' },
    { name: city.name, href: `/${city.slug}` },
  ]
  if (district) breadcrumbs.push({ name: district.name, href: `/${city.slug}/${district.slug}` })
  breadcrumbs.push({ name: service.title, href: canonicalPath })

  const faqs = override?.faq_json?.length ? override.faq_json : locationFaqs(service, city, district)
  const districtCards = city.districts.map((item) => ({
    name: item.name,
    href: `/${city.slug}/${item.slug}/${service.slug}`,
  }))

  return {
    kind,
    canonicalPath,
    indexable: override?.is_indexable !== false,
    title: override?.seo_title?.trim() || `${defaultH1} | Pars Medya`,
    description: override?.meta_description?.trim() || fitMeta(service, city, district, seed),
    h1: override?.hero_title?.trim() || defaultH1,
    eyebrow: district ? `${city.name.toLocaleUpperCase('tr-TR')} • ${district.name.toLocaleUpperCase('tr-TR')} • ${service.title.toLocaleUpperCase('tr-TR')}` : `${city.name.toLocaleUpperCase('tr-TR')} • ${service.title.toLocaleUpperCase('tr-TR')}`,
    heroDescription: override?.hero_description?.trim() || uniqueHero(service, city, district, seed),
    serviceSummary: override?.content_json?.intro?.trim() || uniqueSummary(service, city, district, seed),
    locationIntro: override?.content_json?.locationIntro?.trim() || uniqueLocationIntro(service, city, district, seed),
    solutionAreas: (service.source.useCases || service.source.features).slice(0, 6).map((item) => ({
      title: item.title,
      description: item.description,
    })),
    capabilities: extras.architecture.layers.map((layer) => ({
      title: layer.title.tr,
      description: `${place} teslimatında ${layer.title.tr.toLocaleLowerCase('tr-TR')} katmanı, ${service.title.toLocaleLowerCase('tr-TR')} kapsamının parçası olarak ele alınır.`,
    })),
    features: service.source.features,
    technologies: service.source.technologies,
    process: extras.process.map((step) => ({
      title: step.title.tr,
      description: step.text.tr,
    })),
    useCases: (service.source.useCases || []).slice(0, 6),
    sectorNotes: sectorNotes(service, city, district),
    why: extras.why.map((item) => ({ title: item.title.tr, text: item.text.tr })),
    faqs,
    breadcrumbs,
    districts: district ? [] : districtCards,
    otherDistricts: district ? getSiblingDistricts(city, district.slug, 10).map((item) => ({
      name: item.name,
      href: `/${city.slug}/${item.slug}/${service.slug}`,
    })) : [],
    allDistrictsHref: `/${city.slug}`,
    relatedServices: getRelatedLocalServices(service.slug, 4).map((item) => ({
      title: `${place} ${item.title}`,
      href: district
        ? `/${city.slug}/${district.slug}/${item.slug}`
        : `/${city.slug}/${item.slug}`,
      description: item.shortDescription,
    })),
    relatedLocations: relatedLocationLinks(city, district, service),
    ctaTitle: 'Projenizi Birlikte Planlayalım',
    ctaText: `${place} özelinde yazılım, web, otomasyon veya dijital büyüme ihtiyacınızı Pars Medya ekibiyle değerlendirin.`,
    city,
    district,
    service,
    areaServed: district ? [district.name, city.name] : [city.name],
  }
}

export type LocalHubModel = {
  kind: 'city-hub' | 'district-hub' | 'national-hub'
  canonicalPath: string
  title: string
  description: string
  h1: string
  intro: string
  breadcrumbs: LocalBreadcrumb[]
  faqs: LocalSeoFaq[]
}

export function buildCityHub(city: TurkeyCity): LocalHubModel {
  const districtCount = city.districts.length
  return {
    kind: 'city-hub',
    canonicalPath: `/${city.slug}`,
    title: `${city.name} Dijital Ajans ve Yazılım Hizmetleri | Pars Medya`,
    description: clipMeta(`${city.name} yazılım, web, CRM, ERP, e-ticaret ve dijital büyüme hizmetleri. ${districtCount} ilçedeki işletmeler için özel çözümleri Pars Medya ile planlayın.`),
    h1: `${city.name} Dijital Ajans ve Yazılım Hizmetleri`,
    intro: `${city.name}, ${city.region} bölgesinde ${districtCount} ilçeye yayılan işletmeler için yazılım ve dijital çözümler geliştirdiğimiz bir hizmet bölgesidir. Hazır paket dayatmadan, mevcut süreçlerinize uygun web, özel yazılım, entegrasyon ve büyüme projeleri kurgularız.`,
    breadcrumbs: [
      { name: 'Ana Sayfa', href: '/' },
      { name: 'Hizmetler', href: '/hizmetler' },
      { name: 'Hizmet Bölgeleri', href: '/hizmet-bolgeleri' },
      { name: city.name, href: `/${city.slug}` },
    ],
    faqs: [
      {
        question: `${city.name} içinde hangi ilçelere hizmet veriyorsunuz?`,
        answer: `${city.name} ilindeki ${districtCount} ilçenin tamamı için ilgili hizmet sayfalarını yayınlıyoruz. Proje kapsamı ilçe sınırına kilitlenmez; ${city.name} genelindeki ekipler aynı sistemde çalışabilir.`,
      },
      {
        question: `${city.name} için ofisiniz var mı?`,
        answer: `${city.name} için ayrı bir şube adresi yayınlamıyoruz. Keşif ve teslimatı uzaktan, gerektiğinde yüz yüze koordinasyonla yürütürüz.`,
      },
    ],
  }
}

export function buildDistrictHub(city: TurkeyCity, district: TurkeyDistrict): LocalHubModel {
  return {
    kind: 'district-hub',
    canonicalPath: `/${city.slug}/${district.slug}`,
    title: `${district.name} Yazılım ve Dijital Çözümler | Pars Medya`,
    description: clipMeta(`${district.name} yazılım ve dijital çözümler: web, özel yazılım, CRM, ERP ve e-ticaret. ${city.name} genelindeki işletmeler için Pars Medya ile projenizi planlayın.`),
    h1: `${district.name} Yazılım ve Dijital Çözümler`,
    intro: `${district.name} ve ${city.name} genelindeki işletmeler için web, özel yazılım, entegrasyon ve dijital büyüme ihtiyaçlarını aynı ekip içinde planlıyoruz. İlçe sayfası, o bölgedeki hizmetlere giden net bir başlangıç noktasıdır.`,
    breadcrumbs: [
      { name: 'Ana Sayfa', href: '/' },
      { name: 'Hizmetler', href: '/hizmetler' },
      { name: city.name, href: `/${city.slug}` },
      { name: district.name, href: `/${city.slug}/${district.slug}` },
    ],
    faqs: [
      {
        question: `${district.name} sayfasından hangi hizmetlere ulaşırım?`,
        answer: `Web yazılım, özel yazılım, CRM, ERP, e-ticaret, entegrasyon ve dijital büyüme dahil tüm aktif hizmetler ${district.name} için ayrı sayfalarda listelenir.`,
      },
      {
        question: `Yalnızca ${district.name} içindeki şirketlerle mi çalışıyorsunuz?`,
        answer: `Hayır. ${district.name} bir hizmet bölgesidir; ${city.name} ve Türkiye genelindeki işletmelerle de aynı süreçle çalışırız.`,
      },
    ],
  }
}

export function buildNationalHub(): LocalHubModel {
  return {
    kind: 'national-hub',
    canonicalPath: '/hizmet-bolgeleri',
    title: 'Türkiye Geneli Yazılım ve Dijital Hizmetler | Pars Medya',
    description: clipMeta('Türkiye geneli yazılım ve dijital hizmetler. 81 il ve tüm ilçeler için web, özel yazılım, CRM, ERP ve dijital büyüme çözümlerini Pars Medya ile planlayın.'),
    h1: 'Türkiye Geneli Yazılım ve Dijital Hizmetler',
    intro: 'Pars Medya; web, özel yazılım, kurumsal sistemler ve dijital büyüme projelerini Türkiye genelindeki işletmeler için planlar. Aşağıdaki illerden kendi bölgenize ve ilgili hizmet sayfalarına ulaşabilirsiniz.',
    breadcrumbs: [
      { name: 'Ana Sayfa', href: '/' },
      { name: 'Hizmetler', href: '/hizmetler' },
      { name: 'Hizmet Bölgeleri', href: '/hizmet-bolgeleri' },
    ],
    faqs: [
      {
        question: 'Hangi illerde hizmet sayfanız var?',
        answer: 'Türkiye’nin 81 ili ve bu illerin resmi ilçeleri için hizmet bölgesi sayfaları yayınlıyoruz. Her il ve ilçe, aktif hizmet listesine bağlanır.',
      },
      {
        question: 'Her ilçede ofisiniz mi var?',
        answer: 'Hayır. İlçe sayfaları hizmet bölgesi sayfalarıdır; her ilçede fiziksel ofis olduğu anlamına gelmez.',
      },
    ],
  }
}
