import { CONTACT_EMAIL } from '@/lib/contact-info'
import type { Locale } from '@/lib/i18n'

/**
 * Legal page drafts (Ö13). Technical statements describe what this codebase actually does
 * (contact form fields, the first-party analytics IDs in browser storage, WhatsApp links).
 * Everything that is a legal decision or a company fact is a placeholder token:
 *   {{fact:<COMPANY_PROFILE key>|Label}} → the value once filled in, otherwise a marked placeholder
 *   {{todo|Label}}                        → always a marked placeholder for counsel/owner text
 * The pages stay noindex and unlinked until LEGAL_PAGES_PUBLISHED is switched on.
 */
export type LegalSection = { heading: string; paragraphs?: string[]; items?: string[] }
export type LegalPageKey = 'kvkk' | 'privacy' | 'cookies' | 'terms'
export type LegalPage = {
  key: LegalPageKey
  locale: Locale
  path: string
  /** Counterpart in the other language, for hreflang and the language switch. */
  alternatePath: string | null
  title: string
  metaTitle: string
  description: string
  intro: string
  sections: LegalSection[]
}

const DRAFT_NOTICE = {
  tr: 'Bu metin taslaktır. İşaretli alanlar işletme ve hukuk danışmanı tarafından doldurulup onaylanmadan yayına alınmamalıdır.',
  en: 'This text is a draft. Marked fields must be completed and approved by the business and its legal counsel before publication.',
}

export const legalDraftNotice = (locale: Locale) => DRAFT_NOTICE[locale]

const KVKK_RIGHTS_TR = [
  'Kişisel verilerinizin işlenip işlenmediğini öğrenme,',
  'İşlenmişse buna ilişkin bilgi talep etme,',
  'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,',
  'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,',
  'Eksik veya yanlış işlenmişse düzeltilmesini isteme,',
  'KVKK md. 7’de öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
  'Düzeltme, silme ve yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,',
  'İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,',
  'Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.',
]

const COLLECTED_TR = [
  'İletişim formu: ad soyad, e-posta adresi, telefon, şirket, konu ve mesaj içeriği.',
  'Site kullanım istatistiği: ziyaret edilen sayfa yolu, yönlendiren adres, tarayıcı bilgisi (user agent), sayfa dili ve tarayıcınızda oluşturulan rastgele ziyaretçi/oturum kimlikleri.',
  'Telefon, e-posta veya WhatsApp üzerinden bizimle paylaştığınız bilgiler.',
]

const COLLECTED_EN = [
  'Contact form: name, email address, phone, company, subject and message.',
  'Site usage statistics: visited page path, referring address, browser information (user agent), page language and random visitor/session IDs created in your browser.',
  'Information you share with us by phone, email or WhatsApp.',
]

export const LEGAL_PAGES: LegalPage[] = [
  {
    key: 'kvkk',
    locale: 'tr',
    path: '/kvkk-aydinlatma-metni',
    alternatePath: null,
    title: 'KVKK Aydınlatma Metni',
    metaTitle: 'KVKK Aydınlatma Metni | Pars Medya',
    description: 'Pars Medya web sitesi ve iletişim kanalları üzerinden işlenen kişisel verilere ilişkin 6698 sayılı KVKK kapsamındaki aydınlatma metni.',
    intro: '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) md. 10 uyarınca, web sitemiz ve iletişim kanallarımız üzerinden işlenen kişisel verilere ilişkin sizi bilgilendiriyoruz.',
    sections: [
      { heading: 'Veri sorumlusu', paragraphs: ['Veri sorumlusu: {{fact:legalName|Şirket ticari unvanı}}, {{fact:streetAddress|Açık adres}}. MERSİS: {{fact:mersisNo|MERSİS numarası}}.', `Genel iletişim: ${CONTACT_EMAIL}`] },
      { heading: 'İşlenen kişisel veriler', items: COLLECTED_TR },
      { heading: 'İşleme amaçları', items: ['İletişim ve teklif taleplerinize yanıt vermek, proje görüşmelerini yürütmek.', 'Web sitesinin hangi sayfalarının kullanıldığını ölçmek ve siteyi geliştirmek.', '{{todo|Varsa diğer işleme amaçları}}'] },
      { heading: 'Hukuki sebepler', paragraphs: ['{{fact:legalBases|Her amaç için KVKK md. 5 ve 6 kapsamındaki hukuki sebep}}'] },
      { heading: 'Aktarım', paragraphs: ['Veriler, sitenin barındırma ve veritabanı altyapısını sağlayan hizmet sağlayıcılarda saklanır: {{fact:dataProcessors|Hizmet sağlayıcıların adı ve konumu}}.', 'Yurt dışına aktarım: {{fact:foreignTransfer|Yurt dışına aktarım olup olmadığı ve dayanağı (KVKK md. 9)}}'] },
      { heading: 'Saklama süresi', paragraphs: ['{{fact:retentionPeriods|Veri kategorisine göre saklama süreleri}}'] },
      { heading: 'KVKK md. 11 kapsamındaki haklarınız', items: KVKK_RIGHTS_TR },
      { heading: 'Başvuru', paragraphs: ['Haklarınıza ilişkin başvurularınızı {{fact:kvkkApplicationChannel|Başvuru kanalı (e-posta, KEP veya posta adresi)}} üzerinden iletebilirsiniz.'] },
    ],
  },
  {
    key: 'privacy',
    locale: 'tr',
    path: '/gizlilik-politikasi',
    alternatePath: '/en/privacy-policy',
    title: 'Gizlilik Politikası',
    metaTitle: 'Gizlilik Politikası | Pars Medya',
    description: 'Pars Medya web sitesinde hangi bilgilerin toplandığını, nasıl kullanıldığını ve haklarınızı özetleyen gizlilik politikası.',
    intro: 'Bu sayfa, parsmedya.net üzerinde hangi bilgilerin toplandığını ve nasıl kullanıldığını özetler. Ayrıntılı bilgilendirme için KVKK Aydınlatma Metni’ne bakabilirsiniz.',
    sections: [
      { heading: 'Topladığımız bilgiler', items: COLLECTED_TR },
      { heading: 'Bilgileri nasıl kullanıyoruz', items: ['Talebinize yanıt vermek ve teklif hazırlamak.', 'Site kullanımını toplu istatistik olarak izlemek.', 'Bilgileri satmıyor veya reklam amacıyla üçüncü kişilerle paylaşmıyoruz: {{todo|Bu beyanı işletme onaylamalı}}'] },
      { heading: 'Üçüncü taraf bağlantılar', paragraphs: ['WhatsApp butonları WhatsApp’ın (wa.me) kendi sayfasını yeni sekmede açar; bu hizmetin kendi gizlilik koşulları geçerlidir.'] },
      { heading: 'Saklama ve güvenlik', paragraphs: ['{{fact:retentionPeriods|Saklama süreleri}}', '{{todo|Uygulanan teknik ve idari güvenlik tedbirlerinin özeti}}'] },
      { heading: 'İletişim', paragraphs: [`Sorularınız için: ${CONTACT_EMAIL}`, 'Veri sorumlusu: {{fact:legalName|Şirket ticari unvanı}}'] },
    ],
  },
  {
    key: 'cookies',
    locale: 'tr',
    path: '/cerez-politikasi',
    alternatePath: '/en/cookie-policy',
    title: 'Çerez Politikası',
    metaTitle: 'Çerez ve Tarayıcı Depolama Politikası | Pars Medya',
    description: 'Pars Medya web sitesinin çerez ve tarayıcı depolama (localStorage, sessionStorage) kullanımı hakkında bilgilendirme.',
    intro: 'Bu sayfa, sitemizin tarayıcınızda hangi bilgileri sakladığını açıklar.',
    sections: [
      { heading: 'Ziyaretçiler için kullanılanlar', items: ['parsmedya_visitor_id (localStorage): toplu ziyaret istatistiği için rastgele oluşturulan ziyaretçi kimliği.', 'parsmedya_session_id (sessionStorage): aynı oturumdaki sayfa görüntülemelerini gruplamak için rastgele oturum kimliği; tarayıcı sekmesi kapanınca silinir.', 'Son görüntülenen sayfa yolu (sessionStorage): aynı sayfanın iki kez sayılmasını önler.'] },
      { heading: 'Yönetim paneli', paragraphs: ['Yalnızca yönetim paneline giriş yapan kullanıcılar için oturum çerezleri kullanılır.'] },
      { heading: 'Reklam ve üçüncü taraf takip', paragraphs: ['{{todo|Reklam/üçüncü taraf takip aracı kullanılmadığı beyanı işletme tarafından onaylanmalı; yeni bir araç eklenirse bu bölüm güncellenmeli}}'] },
      { heading: 'Tercihlerinizi yönetme', paragraphs: ['Tarayıcınızın ayarlarından site verilerini (çerezler, localStorage ve sessionStorage) silebilir veya engelleyebilirsiniz.'] },
    ],
  },
  {
    key: 'terms',
    locale: 'tr',
    path: '/kullanim-kosullari',
    alternatePath: '/en/terms-of-use',
    title: 'Kullanım Koşulları',
    metaTitle: 'Kullanım Koşulları | Pars Medya',
    description: 'parsmedya.net web sitesinin kullanımına, içeriklerin kullanımına ve sorumluluk sınırlarına ilişkin koşullar; Pars Medya kullanım koşulları.',
    intro: 'Bu koşullar parsmedya.net web sitesinin kullanımına ilişkindir.',
    sections: [
      { heading: 'Site sahibi', paragraphs: ['{{fact:legalName|Şirket ticari unvanı}}, {{fact:streetAddress|Açık adres}}'] },
      { heading: 'İçeriklerin kullanımı', paragraphs: ['{{todo|Telif ve içerik kullanım koşulları (hukuk danışmanı)}}'] },
      { heading: 'Sorumluluk', paragraphs: ['{{todo|Sorumluluk sınırları (hukuk danışmanı)}}'] },
      { heading: 'Uygulanacak hukuk', paragraphs: ['{{todo|Uygulanacak hukuk ve yetkili mahkeme (hukuk danışmanı)}}'] },
    ],
  },
  {
    key: 'privacy',
    locale: 'en',
    path: '/en/privacy-policy',
    alternatePath: '/gizlilik-politikasi',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy | Pars Medya',
    description: 'How the Pars Medya website collects and uses information, and the rights you have under Turkish data protection law (KVKK).',
    intro: 'This page summarizes which information parsmedya.net collects and how it is used.',
    sections: [
      { heading: 'Data controller', paragraphs: ['{{fact:legalName|Registered company name}}, {{fact:streetAddress|Registered address}}.', `General contact: ${CONTACT_EMAIL}`] },
      { heading: 'Information we collect', items: COLLECTED_EN },
      { heading: 'How we use it', items: ['To answer enquiries and prepare proposals.', 'To measure aggregate site usage and improve the website.', '{{todo|Any further purposes}}'] },
      { heading: 'Legal bases', paragraphs: ['{{fact:legalBases|Legal basis per purpose (KVKK Art. 5 and 6)}}'] },
      { heading: 'Processors and transfers', paragraphs: ['{{fact:dataProcessors|Hosting and database providers and their location}}', '{{fact:foreignTransfer|Whether data is transferred abroad and on which basis (KVKK Art. 9)}}'] },
      { heading: 'Retention', paragraphs: ['{{fact:retentionPeriods|Retention period per data category}}'] },
      { heading: 'Your rights', paragraphs: ['Under KVKK Art. 11 you may ask whether your data is processed, request information, correction or deletion, learn the recipients and object to solely automated decisions. Applications: {{fact:kvkkApplicationChannel|Application channel}}.'] },
      { heading: 'Third-party links', paragraphs: ['WhatsApp buttons open WhatsApp (wa.me) in a new tab; WhatsApp’s own privacy terms apply there.'] },
    ],
  },
  {
    key: 'cookies',
    locale: 'en',
    path: '/en/cookie-policy',
    alternatePath: '/cerez-politikasi',
    title: 'Cookie Policy',
    metaTitle: 'Cookie & Browser Storage Policy | Pars Medya',
    description: 'How the Pars Medya website uses cookies and browser storage (localStorage, sessionStorage) and how you can manage them in your browser.',
    intro: 'This page explains what the website stores in your browser.',
    sections: [
      { heading: 'For visitors', items: ['parsmedya_visitor_id (localStorage): a random visitor ID used for aggregate visit statistics.', 'parsmedya_session_id (sessionStorage): a random session ID that groups page views within one visit; removed when the tab is closed.', 'Last viewed path (sessionStorage): prevents counting the same page twice.'] },
      { heading: 'Admin area', paragraphs: ['Session cookies are used only for users who sign in to the admin area.'] },
      { heading: 'Advertising and third-party tracking', paragraphs: ['{{todo|Statement that no advertising/third-party tracking tools are used, to be confirmed by the business}}'] },
      { heading: 'Managing your preferences', paragraphs: ['You can delete or block site data (cookies, localStorage and sessionStorage) in your browser settings.'] },
    ],
  },
  {
    key: 'terms',
    locale: 'en',
    path: '/en/terms-of-use',
    alternatePath: '/kullanim-kosullari',
    title: 'Terms of Use',
    metaTitle: 'Terms of Use | Pars Medya',
    description: 'Terms that apply to the use of the parsmedya.net website, its content and the limits of liability of Pars Medya.',
    intro: 'These terms apply to the use of the parsmedya.net website.',
    sections: [
      { heading: 'Website owner', paragraphs: ['{{fact:legalName|Registered company name}}, {{fact:streetAddress|Registered address}}'] },
      { heading: 'Use of content', paragraphs: ['{{todo|Copyright and content use terms (legal counsel)}}'] },
      { heading: 'Liability', paragraphs: ['{{todo|Limitation of liability (legal counsel)}}'] },
      { heading: 'Governing law', paragraphs: ['{{todo|Governing law and jurisdiction (legal counsel)}}'] },
    ],
  },
]

export const getLegalPage = (path: string) => LEGAL_PAGES.find((page) => page.path === path)

export function legalPagesFor(locale: Locale) {
  return LEGAL_PAGES.filter((page) => page.locale === locale)
}

/** Footer/form link targets per locale (the KVKK notice only exists in Turkish). */
export const LEGAL_LINKS = {
  tr: { kvkk: '/kvkk-aydinlatma-metni', privacy: '/gizlilik-politikasi', cookies: '/cerez-politikasi', terms: '/kullanim-kosullari' },
  en: { kvkk: '/en/privacy-policy', privacy: '/en/privacy-policy', cookies: '/en/cookie-policy', terms: '/en/terms-of-use' },
} as const satisfies Record<Locale, Record<LegalPageKey, string>>

export const REFERENCES_PATHS = { tr: '/referanslar', en: '/en/references' } as const
