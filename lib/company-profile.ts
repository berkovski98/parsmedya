/**
 * Company facts that only the owner can confirm. Nothing here may be guessed.
 *
 * A `null` value renders as a clearly marked "[DOLDURULACAK: …]" placeholder on the pages that
 * need it. While placeholders remain, the legal and reference pages stay `noindex`, out of the
 * sitemaps and unlinked from the footer and forms (see LEGAL_PAGES_PUBLISHED / REFERENCES_PUBLISHED).
 */
export const COMPANY_PROFILE = {
  /** Ticari unvan, e.g. "… Bilişim Hizmetleri Ltd. Şti." */
  legalName: null as string | null,
  /** Açık adres (sokak, no, ilçe/il) exactly as registered and as on Google Business Profile. */
  streetAddress: null as string | null,
  postalCode: null as string | null,
  mersisNo: null as string | null,
  taxOffice: null as string | null,
  taxNumber: null as string | null,
  /** Where data subjects send KVKK applications (e-posta, KEP or posta adresi). */
  kvkkApplicationChannel: null as string | null,
  /** Name/location of hosting and database providers as stated in the processing agreements. */
  dataProcessors: null as string | null,
  /** Retention periods per data category, as decided with legal counsel. */
  retentionPeriods: null as string | null,
  /** Legal bases (KVKK md. 5/6) per processing purpose, as decided with legal counsel. */
  legalBases: null as string | null,
  /** Whether data is transferred abroad (KVKK md. 9) and on which basis. */
  foreignTransfer: null as string | null,
}

/** Flip to true only after every legal text has been completed and reviewed by counsel. */
export const LEGAL_PAGES_PUBLISHED: boolean = false

export type TeamMember = { name: string; role: string; linkedin?: string; bio?: string }
/** Real team members only (name, role, optional LinkedIn). Empty list = the section is hidden. */
export const TEAM_MEMBERS: TeamMember[] = []

type Localized<T> = { tr: T; en: T }

export type CaseStudy = {
  slug: string
  /** Sector shown instead of the client name. */
  sector: Localized<string>
  title: Localized<string>
  problem: Localized<string>
  solution: Localized<string>
  /** What was delivered. Facts about the build only — no invented metrics. */
  delivered: Localized<string[]>
  technologies: string[]
  /** Client name and public site; only for studies the owner cleared for naming. */
  client?: { name: string; url?: string }
  /** The client is not named and nothing identifying is published. */
  anonymized: boolean
  /** Written permission from the client to publish their name and results. */
  clientApproved: boolean
}

/**
 * Real Pars Medya projects, published without client names (owner decision, 2026-10-17).
 * Add a client name or measured results only with the client's written approval.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'swiss-sales-partners',
    sector: { tr: 'İsviçre · B2B satış ve eğitim', en: 'Switzerland · B2B sales & training' },
    title: { tr: 'Swiss Sales Partners için beş dilli kurumsal site ve saha CRM’i', en: 'Five-language website and field CRM for Swiss Sales Partners' },
    problem: {
      tr: 'İsviçre pazarında hizmet veren şirketin tanıtımını, eğitim kataloğunu ve broşürlerini beş dilde tek yerden yönetmesi; saha satış ekibinin müşteri ve fırsatlarını takip edebilmesi gerekiyordu.',
      en: 'The company needed to run its website, training catalogue and brochures in five languages from one place, and give its field sales team a way to track customers and opportunities.',
    },
    solution: {
      tr: 'Fransızca, Almanca, İtalyanca, İngilizce ve Türkçe kurumsal site; yönetim panelinden güncellenen eğitim kataloğu ve PDF broşür yönetimi; rol bazlı yetkilendirme ve saha CRM’i; İsviçre’nin 26 kantonunu kapsayan yerel SEO yapısı kurduk.',
      en: 'We built a French, German, Italian, English and Turkish website; a training catalogue and PDF brochure management run from the admin panel; role-based access and a field CRM; and a local SEO structure covering Switzerland’s 26 cantons.',
    },
    delivered: {
      tr: ['FR, DE, IT, EN ve TR dillerinde kurumsal site', 'Eğitim kataloğu ve PDF broşür yönetimi', 'Rol bazlı yönetim paneli ve saha CRM’i', '26 kantonu kapsayan yerel SEO sayfaları'],
      en: ['Corporate website in FR, DE, IT, EN and TR', 'Training catalogue and PDF brochure management', 'Role-based admin panel and field CRM', 'Local SEO pages covering all 26 cantons'],
    },
    technologies: ['React', 'TypeScript', 'TanStack Start', 'Supabase', 'Tailwind CSS'],
    client: { name: 'Swiss Sales Partners', url: 'https://swisssales-partners.ch' },
    anonymized: false,
    // The owner listed this client as a named reference on 2026-10-17.
    clientApproved: true,
  },
  {
    slug: 'konteyner-edi-platformu',
    sector: { tr: 'Konteyner deposu ve lojistik', en: 'Container depot & logistics' },
    title: { tr: 'Konteyner deposu için EDI platformu ve saha uygulaması', en: 'EDI platform and field app for a container depot' },
    problem: {
      tr: 'Depo, armatörlerle bakım-onarım tahmini, saha hareketi ve rezervasyon bilgilerini karşılıklı EDIFACT mesajlarıyla paylaşmak zorundaydı; saha ekibinin ölçüm ve fotoğrafları ise ayrı yerlerde tutuluyordu.',
      en: 'The depot had to exchange repair estimates, gate movements and booking data with shipping lines through bilateral EDIFACT messages, while field measurements and photos were kept elsewhere.',
    },
    solution: {
      tr: 'EDIFACT ayrıştırıcı ve üretici çekirdeği, mesaj bazlı kurallar, hasar/onarım kodu doğrulaması, SFTP iletimi ve arka planda çalışan işleme kuyruğuyla bir EDI platformu kurduk. Yanında, reefer sıcaklık ölçümü, not ve fotoğraf kaydı için ayrı bir saha uygulaması geliştirdik.',
      en: 'We built an EDI platform with an EDIFACT parser/serializer core, message-specific rules, damage/repair code validation, SFTP delivery and a background processing queue, plus a separate field app for reefer temperature readings, notes and photos.',
    },
    delivered: {
      tr: ['CODECO, DESTIM, APERAK, COPARN ve IFTMBC mesaj akışları', 'CEDEX hasar/onarım kodu doğrulaması', 'SFTP ile otomatik alma-gönderme ve tekrar deneme', 'Reefer sıcaklık ve fotoğraf kaydı yapan saha uygulaması'],
      en: ['CODECO, DESTIM, APERAK, COPARN and IFTMBC message flows', 'CEDEX damage/repair code validation', 'Automated SFTP pickup and delivery with retries', 'Field app for reefer temperatures and photos'],
    },
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Supabase', 'EDIFACT', 'SFTP'],
    anonymized: true,
    clientApproved: false,
  },
  {
    slug: 'teknik-servis-yonetimi',
    sector: { tr: 'Teknik servis ve perakende', en: 'Repair services & retail' },
    title: { tr: 'Teknik servis, satış ve stok yönetim paneli', en: 'Repair service, sales and inventory management suite' },
    problem: {
      tr: 'Servis kayıtları, kasa satışları, stok, cari hesaplar ve personel bilgileri farklı araçlarda tutuluyordu.',
      en: 'Repair tickets, point-of-sale, inventory, customer accounts and staff records lived in separate tools.',
    },
    solution: {
      tr: 'Servis kabulünden POS satışına, stoktan cariye ve personele kadar tek panelde çalışan bir yönetim yazılımı ve markanın tanıtım sitesini geliştirdik. Yetkiler sunucu tarafında rol bazlı yönetiliyor; özel dosyalar imzalı bağlantılarla indiriliyor.',
      en: 'We built one management suite covering repair intake, point-of-sale, inventory, customer accounts and staff, plus the brand’s public website. Permissions are enforced server-side by role and private files are served through signed links.',
    },
    delivered: {
      tr: ['Teknik servis kayıt ve takip akışı', 'POS satış, stok ve cari yönetimi', 'Rol bazlı yetki matrisi', 'Markanın tanıtım web sitesi'],
      en: ['Repair intake and tracking', 'Point-of-sale, inventory and customer accounts', 'Role-based permission matrix', 'Public brand website'],
    },
    technologies: ['React', 'TypeScript', 'Node.js', 'MySQL', 'Tailwind CSS'],
    anonymized: true,
    clientApproved: false,
  },
  {
    slug: 'e-ticaret-vitrini',
    sector: { tr: 'E-ticaret', en: 'E-commerce' },
    title: { tr: 'Online ödeme entegre e-ticaret vitrini', en: 'E-commerce storefront with online payments' },
    problem: {
      tr: 'Marka, ürünlerini kendi sitesinden satabileceği, ödeme ve sipariş süreçleri güvenli çalışan bir vitrine ihtiyaç duyuyordu.',
      en: 'The brand needed its own storefront with secure payment and order flows.',
    },
    solution: {
      tr: 'Üyelik, ürün ve sipariş yönetimini Supabase üzerinde kurduk; ödeme bildirimlerini sunucu tarafındaki fonksiyonlarla işleyen PayTR entegrasyonu ve zamanlanmış görevler ekledik. Ödeme anahtarları yalnızca sunucuda tutuluyor.',
      en: 'We set up accounts, products and orders on Supabase, added a PayTR integration whose callbacks are handled by server-side functions, and scheduled jobs. Payment secrets stay on the server only.',
    },
    delivered: {
      tr: ['Ürün, üyelik ve sipariş akışları', 'PayTR ödeme entegrasyonu', 'Sunucu tarafı ödeme bildirimleri ve zamanlanmış görevler'],
      en: ['Product, account and order flows', 'PayTR payment integration', 'Server-side payment callbacks and scheduled jobs'],
    },
    technologies: ['React', 'Vite', 'Supabase', 'PostgreSQL', 'PayTR'],
    anonymized: true,
    clientApproved: false,
  },
  {
    slug: 'hukuk-burosu-is-yazilimi',
    sector: { tr: 'Hukuk ve profesyonel hizmetler', en: 'Legal & professional services' },
    title: { tr: 'Hukuk bürosu için iş takip yazılımı ve sanal asistan', en: 'Practice management software and virtual assistant for a law firm' },
    problem: {
      tr: 'Büronun dosya, görev, kişi/kurum rehberi ve müvekkil iletişimi dağınık araçlarla yürütülüyordu.',
      en: 'The firm ran its matters, tasks, contact directory and client communication across scattered tools.',
    },
    solution: {
      tr: 'Ekibe özel, iki adımlı doğrulamalı bir iş yazılımı geliştirdik: dosya ve görev takibi, kişi/kurum rehberi, arka plan işleri ve yedekleme. Müvekkil portalı modülü ayrı bir anahtarla açılıp kapatılabiliyor.',
      en: 'We built a dedicated practice system with two-factor sign-in: matter and task tracking, a contact directory, background jobs and backups. A client portal module can be switched on separately.',
    },
    delivered: {
      tr: ['Dosya ve görev takibi', 'İki adımlı doğrulamalı giriş', 'Kişi ve kurum rehberi', 'Yedekleme ve arka plan işleri'],
      en: ['Matter and task tracking', 'Two-factor sign-in', 'Contact and organisation directory', 'Backups and background jobs'],
    },
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'MariaDB'],
    anonymized: true,
    clientApproved: false,
  },
]

/** Published: the page lists real projects without client names (see CASE_STUDIES). */
export const REFERENCES_PUBLISHED: boolean = true

/** A case study may be shown when it is anonymized or the client approved publication. */
export const isPublishableCaseStudy = (study: CaseStudy) => study.anonymized || study.clientApproved

export const PLACEHOLDER_PREFIX = 'DOLDURULACAK'

/** Every owner-input item, listed for the hand-over report and the admin. */
export function missingCompanyFacts() {
  const missing: string[] = Object.entries(COMPANY_PROFILE)
    .filter(([, value]) => value === null)
    .map(([key]) => key)
  if (!TEAM_MEMBERS.length) missing.push('TEAM_MEMBERS')
  if (!CASE_STUDIES.some((item) => item.clientApproved)) missing.push('CASE_STUDIES (client-approved, named)')
  return missing
}
