-- Idempotent seed: 5 Turkish SEO blog posts for Pars Medya
-- Safe to re-run: upserts by (locale, slug). Does NOT delete existing posts.
-- Run in Supabase SQL Editor.

insert into public.blog_posts
  (title, slug, excerpt, content, image_url, category, author, seo_title, seo_description, status, published_at, locale)
values
  (
    'İstanbul Yazılım Şirketleri: Doğru Yazılım Firması Nasıl Seçilir? [2026 Rehberi]',
    'istanbul-yazilim-sirketleri',
    'İstanbul''da yazılım firması seçerken hangi kriterlere bakmalısınız? Teknoloji değerlendirmesi, portföy okuma, kaynak kod sahipliği, güvenlik, entegrasyon ve bakım koşullarını adım adım ele alan 2026 rehberi.',
    $c_istanbul_yazilim_sirketleri$
İstanbul, Türkiye'nin yazılım geliştirme kapasitesinin önemli bölümünü barındıran şehir. Maslak, Ataşehir, Kozyatağı ve Kadıköy hattında kurumsal yazılım ekipleri, ürün şirketleri, dijital ajanslar ve bağımsız geliştiriciler yan yana çalışıyor. Bu yoğunluk ilk bakışta avantaj gibi görünür; ancak karar verici için yeni bir sorun üretir. Birbirine çok benzeyen hizmet sayfaları ve aynı teknoloji isimlerini sıralayan teklifler arasından, projeyi gerçekten taşıyabilecek ekibi ayırt etmek gerekir.

Bu rehber, 2026 yılında İstanbul'da yazılım firması seçerken kullanabileceğiniz somut kriterleri sıralıyor. Amaç bir firma listesi sunmak değil; teklif karşılaştırırken, teknik görüşme yaparken ve sözleşme imzalarken nelere bakmanız gerektiğini netleştirmek. Yazının sonunda karar öncesinde işaretleyebileceğiniz bir kontrol listesi ve sık sorulan sorular bölümü yer alıyor.

## İstanbul Yazılım Pazarında Neyle Karşılaşıyorsunuz

İstanbul'da yazılım hizmeti veren yapılar tek bir kategoriye sığmaz. Teklif toplarken karşınıza çıkan firmaların hangi segmentte olduğunu bilmek, aldığınız fiyatların neden birbirinden bu kadar farklı olduğunu da açıklar.

- Bağımsız geliştiriciler: Tek kişilik kapasite, düşük maliyet, sınırlı süreklilik.
- Küçük geliştirme stüdyoları: 3-10 kişilik ekipler, esnek çalışma, belirli teknolojilerde derinlik.
- Dijital ajanslar: Tasarım ve pazarlama ağırlıklı, yazılım tarafı çoğunlukla web odaklı.
- Kurumsal yazılım şirketleri: Analiz, geliştirme, test ve bakım süreçlerini ayrı rollerle yürüten ekipler.
- Ürün şirketleri: Kendi lisanslı ürününü satan, özelleştirmeyi ürün sınırları içinde yapan yapılar.

Aynı iş için bağımsız bir geliştiriciden aldığınız teklifle kurumsal bir ekipten aldığınız teklif arasında birkaç kat fark olabilir. Bu farkın kaynağı çoğu zaman kod yazma hızı değil; analiz derinliği, test kapsamı, dokümantasyon ve teslim sonrası sorumluluktur.

## Firma Aramadan Önce İhtiyacınızı Netleştirin

Yazılım projelerinin bütçe aşımıyla sonuçlanmasının en yaygın nedeni kötü kod değil, belirsiz kapsamdır. Firma görüşmelerine başlamadan önce ihtiyacınızı yazıya dökmek, hem daha karşılaştırılabilir teklifler almanızı hem de görüşmelerde teknik ekibin yetkinliğini test etmenizi sağlar.

### Süreçlerinizi envanterleyin

Hangi işin hangi araçla yapıldığını tek tek listeleyin. Çoğu şirkette bu liste beklenenden uzun çıkar: teklif hazırlama Excel'de, sipariş takibi mesajlaşma uygulamasında, muhasebe ayrı bir programda, stok başka bir yerde tutulur. Bu dağınıklığı görünür kılmadan doğru kapsam belgesi oluşturmak mümkün değildir.

- Süreç adı ve sorumlu birim
- Kullanılan araç ve veri formatı
- Aylık işlem hacmi
- Manuel adımlar ve tekrar eden veri girişleri
- Hata yapıldığında ortaya çıkan maliyet

### Önceliklendirme yapın

Listenizi ilk sürümde çözülmesi zorunlu olanlar ve sonraki aşamaya bırakılabilecekler diye ikiye ayırın. İlk sürüm kapsamı ne kadar netse, teklifler arasındaki fark da o kadar anlamlı olur. Her isteğin aynı anda karşılanmasını beklemek projeyi hem uzatır hem de test edilebilirliğini düşürür.

## Freelancer, Ajans ve Yazılım Şirketi Karşılaştırması

Üç yapı da belirli koşullarda doğru tercih olabilir. Belirleyici olan, projenin karmaşıklığı ve öngörülen yaşam süresidir.

| Kriter | Bağımsız geliştirici | Dijital ajans | Yazılım şirketi |
| --- | --- | --- | --- |
| Başlangıç maliyeti | Düşük | Orta | Orta-yüksek |
| Analiz derinliği | Sınırlı | Değişken | Yapılandırılmış |
| Süreklilik riski | Yüksek | Orta | Düşük |
| Karmaşık entegrasyon | Zor | Kısmen | Uygun |
| Bakım ve destek | Belirsiz | Sözleşmeye bağlı | Hizmet seviyesiyle tanımlı |
| Uygun proje tipi | Küçük araçlar, prototip | Kurumsal site, kampanya | CRM, ERP, portal, entegrasyon |

Küçük ve sınırlı kapsamlı bir işte bağımsız geliştirici mantıklı olabilir. Ancak birden fazla sistemle konuşan, çok kullanıcılı ve yıllarca yaşayacak bir uygulamada tek kişiye bağımlılık ciddi bir risktir. Geliştiricinin ulaşılamadığı bir hafta, sipariş akışının durduğu bir hafta anlamına gelebilir.

## Hazır Paket Yazılım mı Özel Yazılım mı

Firma seçiminden önce cevaplanması gereken soru budur. Standart bir muhasebe veya e-posta ihtiyacı için sıfırdan yazılım geliştirmek gereksiz maliyet üretir. Buna karşılık iş modeliniz sektör ortalamasından farklıysa, paket yazılımı zorlamak yerine [özel yazılım geliştirme](/hizmetler/ozel-yazilim-gelistirme) yaklaşımı daha sürdürülebilir olur.

- Paket yazılım uygundur: süreçler standart, kullanıcı sayısı öngörülebilir, özelleştirme ihtiyacı sınırlı.
- Özel yazılım uygundur: süreçler rekabet avantajı taşıyor, çok sistemli entegrasyon var, paket yazılımın kısıtları iş akışını bozuyor.

Karar sürecinde iki yaklaşımın farklarını ayrıntılı karşılaştırmak isterseniz [özel yazılım nedir](/blog/ozel-yazilim-nedir) yazısı kapsam, maliyet ve süre başlıklarını ayrı ayrı ele alıyor.

## Teknoloji Yığınını Nasıl Değerlendirirsiniz

Teklifte yer alan teknoloji isimleri tek başına bir şey söylemez. Önemli olan, seçilen teknolojinin işin gereksinimine ve ekibin gerçek deneyimine uygun olması. Görüşmede şu soruyu sorun: bu teknolojiyi neden seçtiniz ve alternatifini neden elediniz. Cevap gerekçe içermiyorsa seçim büyük olasılıkla ekibin alışkanlığına göre yapılmıştır.

- Uzun vadeli destek: Kullanılan çatının aktif sürüm desteği devam ediyor mu.
- İşe alım havuzu: Bu teknolojiyle çalışan geliştirici bulmak İstanbul'da ne kadar kolay.
- Barındırma maliyeti: Sunucu ve lisans giderleri yıllık bütçeye nasıl yansıyacak.
- Veri katmanı: Veritabanı seçimi işlem hacminize uygun mu, yedekleme planı nasıl kurulmuş.
- Arayüz performansı: Kullanıcı sayısı arttığında yanıt süresi nasıl davranıyor.

Web tarafında çalışacak bir proje planlıyorsanız [web yazılım geliştirme](/hizmetler/web-yazilim-gelistirme) hizmetinin kapsamı ile kurumsal tanıtım odaklı [web sitesi geliştirme](/hizmetler/web-sitesi-gelistirme) çalışmasının farkını baştan netleştirin. İkisi farklı planlama, farklı test yükü ve farklı bütçe gerektirir; ayrımın teknik detayları için [web yazılım nedir](/blog/web-yazilim-nedir) yazısına bakabilirsiniz.

## Portföy ve Referansları Doğru Okumak

Portföydeki ekran görüntüleri projenin en iyi görünen kısmıdır. Değerlendirmeyi görselden çok kapsam ve süreklilik üzerinden yapmak daha doğru sonuç verir.

### Portföyde bakılacaklar

- Sizin sektörünüze veya iş karmaşıklığınıza benzer bir çalışma var mı
- Proje kaç yıldır kullanımda ve halen aktif mi
- Kaç kullanıcıya ve hangi işlem hacmine hizmet ediyor
- Hangi dış sistemlerle entegre çalışıyor
- Firma o projede hangi rolü üstlendi: baştan sona geliştirme mi, devralınan bir işin bakımı mı

### Referans görüşmesinde sorulacak sorular

- Proje planlanan tarihte teslim edildi mi, sapma varsa nedeni ne oldu
- Kapsam dışı talepler nasıl fiyatlandırıldı
- Canlıya geçişte kritik bir sorun yaşandı mı, ne kadar sürede çözüldü
- Destek taleplerine ortalama yanıt süresi ne kadar
- Aynı firmayla yeni bir proje yapar mıydınız

Referans listesi paylaşmayan bir firma için bu tek başına eleme sebebi olmayabilir; gizlilik sözleşmeleri gerçek bir kısıt yaratır. Ancak hiçbir müşterisinin görüşmeye açık olmaması dikkat edilmesi gereken bir durumdur.

## Kaynak Kodu Sahipliği ve Sözleşme Maddeleri

Sözleşmelerde en sık atlanan konu, kaynak kodun kime ait olduğudur. Bedelini ödediğiniz yazılımın kodu size teslim edilmiyorsa, ileride firma değiştirmek istediğinizde sıfırdan başlamak zorunda kalırsınız.

- Kaynak kod sahipliği ve devir zamanı açıkça yazılmalı
- Üçüncü taraf lisansları ve yıllık bedelleri listelenmeli
- Kod deposuna erişim proje boyunca müşteride de bulunmalı
- Teslim paketi tanımlanmalı: kod, veritabanı şeması, kurulum dokümanı, ortam değişkenleri listesi
- Kabul kriterleri ve test senaryoları sözleşme ekine bağlanmalı
- Kapsam değişikliği prosedürü ve birim fiyat belirlenmeli
- Gizlilik, veri işleme ve fesih halinde veri iadesi maddeleri bulunmalı

## Geliştirme Disiplini: Git, Kod İnceleme, Test ve Staging

Bir firmanın teknik olgunluğunu anlamanın en pratik yolu günlük çalışma düzenini sormaktır. Sorular teknik görünse de cevapları yönetici için okunabilir sinyaller taşır.

- Sürüm kontrolü: Kod Git üzerinde mi tutuluyor, dallanma stratejisi nedir
- Kod inceleme: Değişiklikler ikinci bir geliştirici tarafından inceleniyor mu
- Otomatik test: Kritik iş kurallarında test yazılıyor mu, kapsam ne düzeyde
- Ortam ayrımı: Geliştirme, test ve canlı ortamlar birbirinden ayrı mı
- Staging: Canlıya çıkmadan önce sizin onayınıza açılan bir test ortamı var mı
- Yayın süreci: Dağıtım elle mi yapılıyor, otomatik boru hattı kurulu mu
- Geri alma: Hatalı bir sürüm ne kadar sürede geri alınabiliyor
- İzleme: Hata kayıtları toplanıyor mu, kim takip ediyor

Canlı ortama doğrudan müdahale eden, yedek almadan güncelleme yapan ve kodu tek bir bilgisayarda tutan bir çalışma düzeni ilk aylarda sorun çıkarmayabilir. Uzun vadede ise maliyetli kesintilere ve geri dönülemeyen veri kayıplarına yol açar.

## Güvenlik ve KVKK Uyumu

Müşteri verisi işleyen her uygulama için güvenlik sonradan eklenecek bir özellik değil, tasarımın parçasıdır. Görüşmelerde şu başlıkların nasıl ele alındığını sorun.

- Kimlik doğrulama ve rol bazlı yetkilendirme yapısı
- Şifrelerin saklanma yöntemi ve oturum yönetimi
- Aktarım ve depolama şifrelemesi
- Yetkisiz erişim denemelerinin kaydı ve işlem günlükleri
- Kişisel verinin nerede tutulduğu, saklama ve silme süreleri
- Yedekleme sıklığı ve geri yükleme testinin en son ne zaman yapıldığı
- Bağımlılıkların güvenlik güncellemelerini kimin takip ettiği

KVKK kapsamında veri işleyen konumundaki yazılım firmasıyla veri işleme sözleşmesi imzalanması gerekir. Aydınlatma metni, açık rıza akışı ve silme talebi süreçlerinin yazılımda teknik karşılığı olup olmadığını da kontrol edin. Bu maddelerin sözleşmede bulunması, denetim durumunda sorumluluk sınırlarını da netleştirir.

## API ve Sistem Entegrasyonları

Kurumsal yazılım projelerinin çoğu tek başına çalışmaz. Muhasebe programı, e-fatura sağlayıcısı, kargo firmaları, banka sanal pos, pazar yerleri ve varsa mevcut kaynak planlama sistemiyle veri alışverişi yapması beklenir. Bu nedenle [API ve sistem entegrasyonları](/hizmetler/api-sistem-entegrasyonlari) konusundaki deneyim, teklif değerlendirmede belirleyici olur.

- Hangi sistemlerle daha önce entegrasyon yapıldığı
- Hata durumunda tekrar deneme ve kuyruk yönetiminin nasıl kurgulandığı
- Eşzamanlı mı yoksa toplu aktarım mı kullanıldığı
- Entegrasyon kesintisinde kullanıcının nasıl bilgilendirildiği
- Sağlayıcı API sürümü değiştiğinde bakım sorumluluğunun kimde olduğu

Satış kanalı olarak çevrim içi mağaza da planlıyorsanız [e-ticaret çözümleri](/hizmetler/e-ticaret-cozumleri) tarafındaki stok ve sipariş senkronizasyonunu ilk kapsam belgesine dahil etmek, sonradan çıkacak sürprizleri azaltır. Müşteri tarafındaki süreçleri de yönetecekseniz [CRM yazılım çözümleri](/hizmetler/crm-yazilim-cozumleri) ile veri paylaşımının nasıl kurulacağını aynı belgede tanımlayın.

## Teslim Sonrası Bakım, Destek ve Devir

Yazılım teslimle bitmez. Sunucu güncellemeleri, kütüphane sürümleri, mevzuat değişiklikleri ve yeni kullanıcı talepleri sürekli bakım gerektirir. Bakım anlaşması olmayan projelerin birkaç yıl içinde kullanılamaz hale gelmesi sık görülen bir durumdur.

| Başlık | Sözleşmede aranacak tanım |
| --- | --- |
| Yanıt süresi | Kritik, yüksek ve normal hatalar için ayrı süre |
| Çözüm hedefi | Her öncelik seviyesi için üst sınır |
| Kapsam | Hata giderme ile yeni geliştirmenin ayrımı |
| Çalışma saatleri | Mesai içi ve mesai dışı destek koşulları |
| Adam-gün kotası | Aylık bedele dahil geliştirme süresi |
| Devir | Sözleşme sonunda kod, veri ve dokümantasyon teslimi |

Bakım sözleşmesinde en çok tartışma yaratan konu, bir talebin hata mı yoksa yeni geliştirme mi olduğudur. Bu ayrımın tanımını baştan yazmak, sonraki aylarda karşılıklı beklenti farkını büyük ölçüde ortadan kaldırır.

## Maliyet ve Fiyatlandırma Modelleri

| Model | Nasıl çalışır | Uygun olduğu durum | Dikkat edilecek nokta |
| --- | --- | --- | --- |
| Sabit fiyat | Kapsam ve bedel baştan belirlenir | Kapsamı net, sınırlı projeler | Kapsam dışı her talep ek maliyet |
| Adam-gün | Harcanan efor faturalanır | Kapsamı gelişen projeler | Üst bütçe sınırı ve haftalık raporlama gerekir |
| Aşamalı teslim | Her aşama ayrı fiyatlanır | Uzun soluklu kurumsal projeler | Aşama kabul kriterleri yazılı olmalı |
| Bakım aboneliği | Aylık sabit bedel | Canlıya alınmış sistemler | Dahil olan adam-gün kotası tanımlı olmalı |

Tekliflerde yalnızca geliştirme bedelini karşılaştırmak yanıltıcıdır. Toplam sahip olma maliyetini hesaplarken sunucu ve barındırma, lisans, üçüncü taraf servis ücretleri, bakım anlaşması ve kullanıcı eğitimi kalemlerini birlikte değerlendirin. Belirgin şekilde düşük bir teklif genellikle analiz, test veya dokümantasyondan kısılarak oluşur; bu kalemler projeden çıkmaz, maliyeti yalnızca sonraya ötelenir.

## İstanbul'da Konum Ne Kadar Önemli

Uzaktan çalışma yaygınlaştıktan sonra fiziksel yakınlık eski önemini kaybetti; yine de bazı proje tiplerinde aynı şehirde olmak somut fayda sağlar. Üretim, lojistik veya perakende gibi sahada gözlem gerektiren işlerde analiz aşamasında yerinde geçirilen bir gün, uzaktan yapılan beş toplantıdan daha fazla bilgi üretir.

- Saha gözlemi gerektiren süreç analizleri
- Depo, üretim hattı veya şube kurulumları
- Yüz yüze yapılması gereken kullanıcı eğitimleri
- Aynı saat diliminde çalışma ve kısa sürede toplantı yapabilme imkanı

Buna karşılık konum teknik yetkinliğin yerine geçmez. Ofisi yakın olan bir firmayı, entegrasyon deneyimi belirgin şekilde daha güçlü bir ekibe tercih etmek, kısa vadeli bir kolaylık için uzun vadeli bir risk almak anlamına gelir.

## Firma Seçiminde Uyarı Sinyalleri

- Detaylı analiz yapmadan aynı gün net fiyat veren yaklaşım
- Kapsam belgesi olmadan sözleşme imzalanmasını isteyen süreç
- Kaynak kod sahipliği sorulduğunda net cevap alınamaması
- Her talebe kısıtsız olur denmesi, hiçbir teknik sınırın belirtilmemesi
- Test ve staging ortamının bulunmadığının söylenmesi
- Proje sorumlusunun sık sık değişmesi
- Yazılı iletişim yerine her şeyin sözlü mutabakatla yürütülmesi

## Karar Öncesi Kontrol Listesi

- İlk sürüm kapsamı yazılı ve iki taraf tarafından onaylı
- Teslim tarihleri aşamalara bölünmüş
- Kaynak kod sahipliği ve devir koşulu sözleşmede tanımlı
- Test ve kabul kriterleri sözleşme ekinde
- Bakım ve destek koşulları yanıt süreleriyle belirtilmiş
- Entegrasyon listesi ve sorumluluk sınırları net
- Veri işleme ve gizlilik maddeleri tamamlanmış
- Proje iletişim kanalı ve haftalık raporlama düzeni belirli
- Kapsam değişikliği için birim fiyat ve onay süreci yazılı

## Sık Sorulan Sorular

### İstanbul'da yazılım firması seçerken fiyat mı deneyim mi öncelikli olmalı?

Tek başına ikisi de yeterli değil. Doğru yaklaşım, önce teknik yetkinlik ve süreç disiplini üzerinden kısa liste oluşturmak, ardından bu listedeki firmaları fiyat ve teslim planı açısından karşılaştırmaktır. En düşük teklifi baştan seçmek, analiz ve test kalemlerinden kısılan projelerde sonradan daha yüksek toplam maliyet üretir.

### Yazılımın kaynak kodu kime ait olur?

Bu tamamen sözleşmeye bağlıdır. Özel geliştirilen bir yazılımda kaynak kodun müşteriye devredilmesi yaygın uygulamadır; ancak firmanın kendi ürün altyapısını kullandığı durumlarda yalnızca kullanım hakkı verilebilir. Sözleşme imzalanmadan önce sahiplik, devir zamanı ve üçüncü taraf lisanslarının kapsamı yazılı hale getirilmelidir.

### Bir yazılım projesi ne kadar sürer?

Süre kapsamla doğrudan ilişkilidir. Sınırlı kapsamlı bir iç uygulama 6-10 hafta içinde kullanılabilir hale gelebilirken, çok modüllü ve entegrasyonlu bir kurumsal sistem 6-12 aya yayılabilir. Gerçekçi planlama için projeyi aşamalara bölmek ve ilk aşamada dar bir kapsamı canlıya almak daha sağlıklı sonuç verir.

### Yazılım firmasının İstanbul'da olması şart mı?

Şart değil. Uzaktan çalışma araçlarıyla farklı şehirlerdeki ekiplerle verimli proje yürütmek mümkün. Ancak saha gözlemi, depo veya üretim kurulumu ve yüz yüze kullanıcı eğitimi gerektiren projelerde aynı şehirde olmak zaman kazandırır ve analiz kalitesini artırır.

### Mevcut yazılımımızı başka bir firmaya devretmek mümkün mü?

Kaynak koda, veritabanı erişimine ve dokümantasyona sahipseniz mümkündür. Devir sürecinde yeni ekibin kodu incelemesi ve sistemi öğrenmesi için bir uyum dönemi planlanmalıdır. Dokümantasyonun eksik olduğu projelerde bu süre uzar; bu nedenle devam eden projelerde de teslim paketinin tam olmasını talep etmek önemlidir.

### CRM veya ERP ihtiyacımız varsa nereden başlamalıyız?

Önce hangi süreçlerin hangi sistemde yürüdüğünü ve veri akışının nerede koptuğunu belgeleyin. Ardından ihtiyacın müşteri ilişkileri tarafında mı yoksa kaynak planlaması tarafında mı yoğunlaştığına karar verin. [CRM yazılımı nedir](/blog/crm-yazilimi-nedir) ve [ERP yazılımı nedir](/blog/erp-yazilimi-nedir) yazıları bu ayrımı örneklerle açıklıyor.

## Sonuç

İstanbul'da yazılım firması seçimi, teknoloji listesi karşılaştırmaktan çok bir çalışma disiplini değerlendirmesidir. Kapsamı yazılı hale getiren, kaynak kod sahipliğini netleştiren, test ve staging ortamı kullanan, entegrasyon deneyimini örnekle gösterebilen ve teslim sonrası bakım koşullarını tanımlayan ekipler uzun vadede daha öngörülebilir sonuç üretir.

Projenizin kapsamını netleştirmek, mevcut sistemlerinizi değerlendirmek veya kurumsal yazılım ihtiyacınız için yol haritası oluşturmak isterseniz [iletişim](/iletisim) sayfasından bize ulaşabilirsiniz. İhtiyacınızı birlikte inceleyip uygun kapsam ve aşamalandırma önerisini paylaşırız.
$c_istanbul_yazilim_sirketleri$,
    '/parsmedya-hero.png',
    'Yazılım',
    'Pars Medya Ekibi',
    'İstanbul Yazılım Şirketleri | Firma Seçim Rehberi 2026',
    'İstanbul''da yazılım şirketi seçerken bakılacak kriterler: teknoloji değerlendirmesi, kaynak kod sahipliği, test ortamı, entegrasyon ve bakım koşulları.',
    'published',
    '2026-08-20T09:00:00Z',
    'tr'
  )
on conflict (locale, slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  image_url = excluded.image_url,
  category = excluded.category,
  author = excluded.author,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

insert into public.blog_posts
  (title, slug, excerpt, content, image_url, category, author, seo_title, seo_description, status, published_at, locale)
values
  (
    'Özel Yazılım Nedir? İşletmeler İçin Özel Yazılım Geliştirme Rehberi',
    'ozel-yazilim-nedir',
    'Özel yazılım nedir, hazır paket yazılımdan nasıl ayrılır ve hangi işletmelere uygundur? Kullanım alanları, geliştirme aşamaları, ölçeklenebilirlik, güvenlik ve maliyet kalemlerini ele alan kapsamlı rehber.',
    $c_ozel_yazilim_nedir$
Hazır paket yazılımlar geniş bir kitleye standart çözüm sunar. Bu yaklaşım muhasebe, e-posta veya belge yönetimi gibi her şirkette benzer işleyen alanlarda iyi sonuç verir. Ancak iş modeli sektör ortalamasından ayrıldığında farklı bir tablo ortaya çıkar: süreçler yazılımın izin verdiği kalıba sığmaz, ekipler eksik kalan kısmı elle tuttuğu tablolarla tamamlar ve zamanla asıl kayıtlar sistemin dışında birikmeye başlar.

Bu noktada gündeme gelen soru şudur: yazılımı işe mi uydurmalı, işi yazılıma mı. Özel yazılım, bu sorunun ilk seçeneğine verilen yanıttır. Bu rehber özel yazılımın ne olduğunu, hangi durumlarda mantıklı bir yatırım haline geldiğini, geliştirme sürecinin nasıl işlediğini ve maliyetin hangi kalemlerden oluştuğunu ele alıyor.

## Özel Yazılım Nedir

Özel yazılım, belirli bir şirketin süreçleri, veri yapısı ve iş kuralları için sıfırdan tasarlanıp geliştirilen uygulamadır. Hazır paket yazılımlarda olduğu gibi genel bir kullanıcı kitlesi hedeflenmez; kapsam tek bir organizasyonun ihtiyacına göre belirlenir. Arayüz şirketin kendi terminolojisiyle kurulur, iş kuralları mevcut onay akışlarına göre yazılır, raporlar yönetimin fiilen takip ettiği göstergelere göre tasarlanır.

Terim bazen ısmarlama yazılım veya kuruma özel yazılım olarak da kullanılır. Ortak nokta şudur: yazılımın kapsamını bir satıcının ürün yol haritası değil, sizin iş ihtiyacınız belirler. Bu da hem daha fazla esneklik hem de daha fazla planlama sorumluluğu getirir.

## Özel Yazılım ile Hazır Paket Yazılım Arasındaki Farklar

| Kriter | Hazır paket yazılım | Özel yazılım |
| --- | --- | --- |
| Kapsam | Sektör ortalamasına göre sabit | Şirket süreçlerine göre tanımlı |
| Başlangıç maliyeti | Düşük, abonelik ağırlıklı | Yüksek, geliştirme yatırımı |
| Uzun vadeli maliyet | Kullanıcı başına artan lisans | Bakım ve geliştirme bütçesi |
| Özelleştirme | Ürünün izin verdiği ölçüde | Sınırı iş ihtiyacı belirler |
| Entegrasyon | Hazır bağlantılar, kısıtlı esneklik | Gereken her sisteme özel bağlantı |
| Veri sahipliği | Sağlayıcı altyapısında | Kendi altyapınızda tercih edilebilir |
| Devreye alma süresi | Kısa | Analiz ve geliştirme süresi gerektirir |
| Tedarikçi bağımlılığı | Sağlayıcı yol haritasına bağlı | Kaynak koda sahip olarak düşük |

Bu tablo bir tarafın diğerinden üstün olduğunu göstermez. Standart bir ihtiyaç için paket yazılım hızlı ve ekonomik bir yoldur. Ancak süreçler rekabet avantajının parçası haline geldiğinde, paket yazılımın kısıtları doğrudan operasyona yansımaya başlar. Karar verirken sorulması gereken soru şu olur: bu süreç bizi rakiplerden ayırıyor mu, yoksa herkesin aynı şekilde yaptığı bir iş mi.

## Hangi İşletmeler Özel Yazılıma İhtiyaç Duyar

Özel yazılım ihtiyacı genellikle tek bir kararla değil, birikmiş belirtilerle ortaya çıkar. Aşağıdaki durumların birkaçı birlikte görülüyorsa, mevcut araç seti işin gerisinde kalmış olabilir.

- Aynı veriyi birden fazla sisteme elle giren ekipler
- Kritik iş süreçlerini Excel dosyalarının taşıdığı yapılar
- Paket yazılıma her yıl artan özelleştirme bedeli ödeyen şirketler
- Çok kanallı satış yapıp stok senkronizasyonu sorunu yaşayan işletmeler
- Bayi, tedarikçi veya müşteriye portal açması gereken organizasyonlar
- Onay akışları çok adımlı ve şirkete özgü olan yapılar
- Ay sonu raporlarını elle birleştirerek üreten finans ekipleri

Bu belirtilerin ortak sonucu şudur: çalışanların zamanı işin kendisine değil, sistemler arasındaki boşluğu kapatmaya gider. Özel yazılım kararı da esasen bu boşluğun maliyetini hesaplamakla başlar.

## Özel Yazılım Kullanım Alanları

### Müşteri ilişkileri yönetimi

Satış sürecinin adımları, teklif şablonları ve fiyat kuralları her sektörde farklı çalışır. Standart bir uygulama bu farkları genelleştirdiği için satış ekibi kayıtları paralel bir tabloda tutmaya devam eder. Şirkete özel geliştirilen bir çözümde teklif, sipariş ve tahsilat aynı akışta ilerler, satış temsilcisi tek ekrandan çalışır. [CRM yazılım çözümleri](/hizmetler/crm-yazilim-cozumleri) kapsamında hangi modüllerin öne çıktığını inceleyebilir, temel kavramlar için [CRM yazılımı nedir](/blog/crm-yazilimi-nedir) yazısına bakabilirsiniz.

### Kaynak planlaması ve üretim

Üretim, stok, satın alma ve maliyetlendirme süreçlerinde her şirketin kendi hesaplama yöntemi vardır. Reçete yapısı, fire oranları, iş emri kırılımları ve genel gider dağıtımı paket ürünlerin varsayımlarına her zaman uymaz. [ERP yazılım çözümleri](/hizmetler/erp-yazilim-cozumleri) kapsamında geliştirilen özel modüller bu hesapları şirketin gerçekte kullandığı yönteme göre kurar. Konunun temelleri için [ERP yazılımı nedir](/blog/erp-yazilimi-nedir) yazısı iyi bir başlangıç noktası.

### Müşteri, bayi ve tedarikçi portalları

Sipariş girişi, sevkiyat takibi, cari hesap görüntüleme ve belge paylaşımı gibi işler telefon ve e-posta yerine portal üzerinden yürütüldüğünde operasyon yükü belirgin şekilde azalır. Portal projeleri yetkilendirme, çok kullanıcılı yapı ve mevcut sistemle sürekli veri alışverişi gerektirdiği için genellikle özel geliştirme kapsamına girer.

### Süreç otomasyonu

Tekrar eden manuel işler otomasyona en uygun alandır: gelen belgelerin sınıflandırılması, onay zincirlerinin yürütülmesi, periyodik raporların hazırlanıp ilgili kişilere gönderilmesi, eşik değerler aşıldığında uyarı üretilmesi. Bu tür geliştirmeler kapsamı sınırlı olduğu için hızlı devreye alınır ve yatırımın karşılığı kısa sürede ölçülebilir.

### API ve entegrasyon katmanı

Şirket içinde birbirinden habersiz çalışan sistemleri tek bir veri akışında buluşturmak için ara katman geliştirmek gerekir. [API ve sistem entegrasyonları](/hizmetler/api-sistem-entegrasyonlari) çalışmalarında amaç mevcut yazılımları değiştirmek değil, aralarındaki veri kopukluğunu gidermektir. Bu yaklaşım, büyük bir dönüşüm projesine girmeden hızlı iyileşme sağlamak isteyen şirketler için uygundur.

### Web tabanlı iç uygulamalar

Tarayıcı üzerinden çalışan uygulamalar kurulum gerektirmediği için saha ekipleri, şubeler ve dış paydaşlar açısından pratiktir. [Web yazılım geliştirme](/hizmetler/web-yazilim-gelistirme) kapsamındaki bu projelerin kurumsal tanıtım amaçlı [web sitesi geliştirme](/hizmetler/web-sitesi-gelistirme) çalışmalarından farkını [web yazılım nedir](/blog/web-yazilim-nedir) yazısında ayrıntılı bulabilirsiniz. Satış kanalı da planlanıyorsa [e-ticaret çözümleri](/hizmetler/e-ticaret-cozumleri) tarafındaki stok ve sipariş akışını aynı mimari içinde düşünmek gerekir.

## Özel Yazılım Geliştirme Süreci

### 1. Keşif ve süreç analizi

Proje mevcut durumun haritalanmasıyla başlar. Hangi işi kim yapıyor, veri nereden geliyor, hangi adımda tıkanma oluşuyor sorularının cevabı yazıya dökülür. Bu aşamanın çıktısı, üzerinde mutabık kalınan bir ihtiyaç belgesidir. Analize ayrılan süreyi kısaltmak projeyi hızlandırmaz; yalnızca yanlış varsayımların geliştirme aşamasında ortaya çıkmasına yol açar.

### 2. Kapsam ve teknik tasarım

İhtiyaç belgesi, modüllere ve ekranlara bölünmüş bir kapsam tanımına dönüştürülür. Veri modeli, entegrasyon noktaları, yetki yapısı ve teknoloji seçimleri bu aşamada belirlenir. İlk sürümde yer alacaklar ile sonraki aşamaya bırakılacaklar netleşir.

### 3. Arayüz tasarımı ve kullanıcı akışları

Ekran tasarımları geliştirmeye başlamadan önce hazırlanır ve gerçek kullanıcılarla gözden geçirilir. Günde yüzlerce kayıt giren bir kullanıcı için tıklama sayısı, klavye ile ilerleyebilme ve hata mesajlarının anlaşılırlığı, görsel tercihlerden daha önemlidir.

### 4. Geliştirme

Geliştirme, iki ya da üç haftalık döngüler halinde yürütülür. Her döngü sonunda çalışan bir parça teslim edilir ve test ortamında incelemenize açılır. Böylece yön değişikliği gerektiğinde bu, proje sonunda değil süreç içinde fark edilir.

### 5. Test ve kabul

Geliştirici testlerinin yanında kullanıcı kabul testi ayrı bir aşama olarak planlanır. Kabul kriterleri baştan yazılmış senaryolara dayanır. Kritik iş kurallarında otomatik test bulunması, sonraki geliştirmelerin mevcut işleyişi bozma riskini düşürür.

### 6. Veri aktarımı ve devreye alma

Eski sistemlerden gelen verinin temizlenmesi ve aktarılması genellikle küçümsenen bir iştir. Mükerrer kayıtlar, eksik alanlar ve tutarsız kodlamalar aktarım öncesinde düzeltilmelidir. Devreye alma çoğu zaman aşamalı yapılır: önce sınırlı bir kullanıcı grubu, ardından tüm organizasyon.

### 7. Bakım ve sürekli geliştirme

Canlıya geçiş projenin sonu değil, ikinci aşamasının başlangıcıdır. Kullanıcı geri bildirimleri, mevzuat değişiklikleri, kütüphane güncellemeleri ve yeni iş ihtiyaçları düzenli bir bakım planı gerektirir.

## Ölçeklenebilirlik: Yazılımı Büyümeye Hazırlamak

Bugün 20 kullanıcıyla çalışan bir uygulama, üç yıl sonra 200 kullanıcıya ve on kat işlem hacmine hizmet edebilir. Ölçeklenebilirlik bu büyümeyi baştan varsayarak tasarım yapmak anlamına gelir.

- Veri modelinin artan kayıt sayısında performansını koruyacak şekilde tasarlanması
- Sorgu ve indeks planlamasının gerçek veri hacmiyle test edilmesi
- Yoğun işlemlerin kuyruğa alınarak arka planda yürütülmesi
- Raporlamanın işlem yükünden ayrılması
- Yetki yapısının yeni roller eklenebilecek biçimde kurulması
- Modüler yapı sayesinde yeni işlevlerin mevcut kodu bozmadan eklenebilmesi

Aşırı mühendislik de bir risktir. Henüz var olmayan bir ölçek için karmaşık altyapı kurmak, bakım maliyetini gereksiz yükseltir. Doğru yaklaşım, öngörülebilir büyümeye hazırlıklı ama gereğinden karmaşık olmayan bir mimari seçmektir.

## Güvenlik ve Veri Koruma

Özel yazılımda güvenlik, projenin sonunda eklenen bir kontrol listesi değil, tasarım kararlarının parçasıdır.

- Rol bazlı yetkilendirme ve en az yetki ilkesi
- Şifrelerin güvenli saklanması ve oturum sürelerinin yönetimi
- Aktarımda ve depoda şifreleme
- Kritik işlemler için değişiklik günlüğü ve kim ne zaman yaptı kaydı
- Kişisel verinin saklama ve silme sürelerinin tanımlanması
- Düzenli yedekleme ve geri yükleme provası
- Bağımlılıkların güvenlik güncellemelerinin takibi

KVKK kapsamında kişisel veri işleyen uygulamalarda aydınlatma, rıza ve silme talebi süreçlerinin yazılımda teknik karşılığı bulunmalıdır. Bu gereksinimlerin kapsam belgesine baştan yazılması, sonradan yapılacak değişikliklerin maliyetinden kaçınmayı sağlar.

## Özel Yazılım Maliyetleri Nasıl Oluşur

| Kalem | İçeriği | Bütçedeki yeri |
| --- | --- | --- |
| Analiz ve tasarım | Süreç haritası, kapsam belgesi, arayüz tasarımı | Tek seferlik, proje başında |
| Geliştirme | Modüllerin kodlanması ve entegrasyonlar | Toplam bütçenin ana kalemi |
| Test ve kabul | Otomatik test, kullanıcı kabul testleri | Geliştirmeye oranla planlanır |
| Veri aktarımı | Temizleme, dönüştürme, doğrulama | Eski sistemin durumuna göre değişir |
| Altyapı | Sunucu, barındırma, yedekleme | Aylık tekrar eden gider |
| Üçüncü taraf servisler | E-fatura, mesajlaşma, ödeme, harita | Kullanım hacmine bağlı |
| Eğitim | Kullanıcı eğitimi ve dokümantasyon | Devreye alma döneminde |
| Bakım | Hata giderme ve sürekli geliştirme | Yıllık bütçeye yazılmalı |

Maliyeti belirleyen temel etken kapsam genişliği, entegrasyon sayısı ve iş kurallarının karmaşıklığıdır. Aynı görünen iki ekran, arkasındaki hesaplama kuralları nedeniyle çok farklı efor gerektirebilir. Bu nedenle teklif alırken kapsamın ekran ve iş kuralı düzeyinde tanımlanması, karşılaştırmayı anlamlı kılar.

## Özel Yazılım Projelerinde Sık Yapılan Hatalar

- Analiz aşamasını kısaltıp doğrudan geliştirmeye geçmek
- İlk sürüme tüm istekleri sığdırmaya çalışmak
- Gerçek kullanıcıları test sürecine dahil etmemek
- Veri aktarımını proje sonuna bırakmak
- Kaynak kod sahipliğini sözleşmede tanımlamamak
- Bakım bütçesini yıllık plana koymamak
- Eğitim ve dokümantasyonu isteğe bağlı görmek
- Kapsam değişikliklerini yazılı süreç olmadan yürütmek

Bu hataların çoğu teknik değil, yönetsel kaynaklıdır. Projenin başarısı, kod kalitesi kadar kapsamın yönetilme biçimine bağlıdır.

## Yatırımın Karşılığını Ölçmek

Özel yazılım yatırımının etkisini ölçmek için devreye almadan önce başlangıç değerlerini kaydetmek gerekir. Ölçüm yapılmadığında iyileşme hissedilir ama gösterilemez.

- Bir siparişin veya teklifin hazırlanma süresi
- Aynı verinin kaç ayrı yerde girildiği
- Hatalı kayıt oranı ve düzeltme için harcanan süre
- Ay sonu kapanışının tamamlanma süresi
- Müşteri taleplerine ortalama yanıt süresi
- Raporların hazırlanması için gereken manuel işlem

Bu göstergelerin devreye almadan önceki ve altı ay sonraki değerleri karşılaştırıldığında, yatırımın karşılığı somut biçimde görünür hale gelir.

## Sık Sorulan Sorular

### Özel yazılım hazır paket yazılımdan pahalı mı?

Başlangıç maliyeti genellikle daha yüksektir çünkü analiz ve geliştirme eforu peşin ödenir. Buna karşılık paket yazılımlarda kullanıcı başına lisans, artan özelleştirme bedelleri ve zorunlu sürüm geçişleri yıllar içinde birikir. Karşılaştırmayı üç ila beş yıllık toplam sahip olma maliyeti üzerinden yapmak daha doğru bir tablo verir.

### Özel yazılım projesi ne kadar sürer?

Sınırlı kapsamlı bir uygulama veya otomasyon 6-10 hafta içinde kullanıma alınabilir. Çok modüllü, entegrasyonlu kurumsal bir sistemde süre 6-12 aya çıkabilir. Projeyi aşamalara bölmek ve ilk aşamada en çok değer üreten dar bir kapsamı canlıya almak, hem riski hem bekleme süresini azaltır.

### Özel yazılımın kaynak kodu bize mi ait olur?

Sözleşmede öyle tanımlandığı sürece evet. Özel geliştirilen projelerde kaynak kodun, veritabanı şemasının ve teknik dokümantasyonun müşteriye teslimi yaygın uygulamadır. Kullanılan açık kaynak kütüphanelerin lisans koşulları ve varsa ücretli üçüncü taraf bileşenlerin kapsamı da ayrıca belirtilmelidir.

### Mevcut sistemlerimizle entegre çalışır mı?

Hedef sistemin bir arayüzü veya veri aktarım yöntemi varsa entegrasyon kurulabilir. Muhasebe programları, e-fatura sağlayıcıları, kargo firmaları, bankalar ve pazar yerleri için bu genellikle mümkündür. Entegrasyon listesinin kapsam belgesine baştan yazılması, hem eforun doğru hesaplanmasını hem de sorumluluk sınırlarının netleşmesini sağlar.

### Küçük işletmeler için özel yazılım mantıklı mı?

Kapsam doğru daraltılırsa mantıklı olabilir. Küçük bir ekipte de tekrar eden manuel işler ciddi zaman kaybı üretir. Bu durumda tüm süreçleri kapsayan büyük bir sistem yerine, en çok zaman kaybettiren tek bir akışı otomatikleştiren sınırlı bir uygulamayla başlamak daha uygun bir yaklaşımdır.

### Özel yazılım sonrası bakım gerekli mi?

Gereklidir. İşletim sistemi ve kütüphane güncellemeleri, güvenlik yamaları, mevzuat değişiklikleri ve yeni kullanıcı talepleri süreklilik ister. Bakım planı olmayan projeler birkaç yıl içinde güncellenemez hale gelir ve o noktada maliyet, düzenli bakım bütçesinin toplamını aşar.

### Yazılım firmasını nasıl seçmeliyiz?

Teknik yetkinliğin yanında çalışma disiplinine bakın: kapsamın yazılı hale getirilmesi, test ve staging ortamının varlığı, kaynak kod sahipliğinin netliği ve bakım koşullarının tanımlı olması belirleyicidir. Değerlendirme kriterlerinin ayrıntısı için [İstanbul yazılım şirketleri](/blog/istanbul-yazilim-sirketleri) rehberine bakabilirsiniz.

## Sonuç

Özel yazılım, her şirket için otomatik olarak doğru tercih değil. Standart süreçlerde paket çözümler daha hızlı ve ekonomik sonuç verir. Ancak süreçleriniz iş modelinizin ayırt edici parçasıysa, veri birden fazla sistem arasında elle taşınıyorsa ve paket yazılımın kısıtları operasyonu şekillendirmeye başlamışsa, kuruma özel geliştirme daha sürdürülebilir bir yol olur. Kararın sağlıklı olması için kapsamın net, aşamalandırmanın gerçekçi ve bakım planının baştan tanımlı olması gerekir.

Süreçlerinizi değerlendirmek, ihtiyaç kapsamını belirlemek veya [özel yazılım geliştirme](/hizmetler/ozel-yazilim-gelistirme) projeniz için aşamalı bir yol haritası oluşturmak isterseniz [iletişim](/iletisim) sayfasından bize ulaşabilirsiniz. Mevcut sistemlerinizi inceleyip önceliklendirilmiş bir kapsam önerisi paylaşırız.
$c_ozel_yazilim_nedir$,
    '/parsmedya-hero.png',
    'Yazılım',
    'Pars Medya Ekibi',
    'Özel Yazılım Nedir? Geliştirme Rehberi | Pars Medya',
    'Özel yazılım nedir, hazır paket yazılımdan farkı ne? Geliştirme aşamaları, CRM ve ERP kullanım alanları, maliyet kalemleri ve dikkat edilecek noktalar.',
    'published',
    '2026-08-19T09:00:00Z',
    'tr'
  )
on conflict (locale, slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  image_url = excluded.image_url,
  category = excluded.category,
  author = excluded.author,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

insert into public.blog_posts
  (title, slug, excerpt, content, image_url, category, author, seo_title, seo_description, status, published_at, locale)
values
  (
    'CRM Yazılımı Nedir? İşletmenize Özel CRM Sistemi Nasıl Geliştirilir?',
    'crm-yazilimi-nedir',
    'CRM yazılımı müşteri ilişkilerini, satış hunisini ve teklif süreçlerini tek sistemde toplar. Bu rehberde CRM modüllerini, hazır ve özel CRM karşılaştırmasını, entegrasyonları, güvenlik gerekliliklerini ve maliyet kalemlerini ele alıyoruz.',
    $c_crm_yazilimi_nedir$
## CRM Yazılımı Nedir?

CRM (Customer Relationship Management, yani Müşteri İlişkileri Yönetimi) yazılımı, bir işletmenin müşteri ve potansiyel müşteri ilişkilerini tek bir sistemde toplayan, satış süreçlerini kayıt altına alan ve bu kayıtlardan yönetilebilir raporlar üreten uygulamadır. Amacı yalnızca müşteri listesi tutmak değildir; kimin hangi müşteriyle ne zaman görüştüğünü, hangi teklifin hangi aşamada beklediğini ve satış hedeflerine ne kadar yaklaşıldığını görünür kılmaktır.

CRM olan ve olmayan işletme arasındaki fark en net şu soruda ortaya çıkar: Geçen ay konuştuğunuz ama satın almayan potansiyel müşterilerden kaçı bugün tekrar aranmayı bekliyor? CRM kullanmayan işletmelerde bu sorunun cevabı genellikle kimsede yoktur. Bilgi kişisel Excel dosyalarında, e-posta kutularında ve mesajlaşma uygulamalarında dağılmıştır. Satış temsilcisi işten ayrıldığında müşteri geçmişi de onunla birlikte gider.

CRM, bu dağınık bilgiyi kurum hafızasına dönüştürür. Her müşteri kaydının altında görüşme notları, gönderilen teklifler, açık görevler ve ilgili kişiler birikir. Böylece satış yönetimi kişilere değil sürece bağlanır.

## CRM Yazılımı Hangi Sorunları Çözer?

Sahada en sık karşılaştığımız problemler şunlardır:

- Takip edilmeyen potansiyel müşteriler: Gelen talepler kaydedilmediği için önemli bir bölümü hiç geri dönüş almadan kaybedilir.
- Teklif kaosu: Kaç teklif açık, hangileri revize edildi, hangisinin süresi geçti sorularının net bir cevabı yoktur.
- Görünmez satış hunisi: Yönetim, ay sonunda ne kadar ciro bekleyeceğini tahmin edemez.
- Tekrarlanan iş: Aynı müşteriye iki farklı temsilci ulaşır, aynı bilgi ikinci kez sorulur.
- Raporlama yükü: Her hafta manuel Excel raporu hazırlanır, veriler birbirini tutmaz.
- Kurumsal hafıza kaybı: Personel değişiminde müşteri ilişkisi baştan kurulmak zorunda kalır.

CRM bu problemleri kendiliğinden ortadan kaldırmaz; onları ölçülebilir hale getirir. Ölçülebilen süreç yönetilebilir hale gelir.

## Bir CRM Sisteminin Temel Modülleri

### Müşteri ve Firma Kartları

Her müşteri için tek bir kayıt tutulur. Firma bilgileri, vergi bilgileri, adresler, ilgili kişiler ve iletişim kanalları bu kartta toplanır. İyi tasarlanmış bir müşteri kartı geçmiş satışları, açık teklifleri ve son aktiviteyi aynı ekranda gösterir; kullanıcıyı beş farklı sekme arasında dolaştırmaz.

### Potansiyel Müşteri (Lead) Yönetimi

Web sitesi formundan, telefondan, fuardan veya reklamdan gelen her talep bir lead kaydına dönüşür. Kaynak bilgisi tutulduğunda hangi kanalın gerçekten satış getirdiği ölçülebilir hale gelir. Lead atama kuralları, gelen talebin doğru temsilciye otomatik yönlendirilmesini sağlar; böylece ilk yanıt süresi kısalır. İlk yanıt süresi, satış kazanma oranını en çok etkileyen ölçülebilir değişkenlerden biridir.

### Satış Hunisi (Pipeline)

Pipeline, satış sürecinin aşamalarını görselleştirir: ilk temas, ihtiyaç analizi, teklif, pazarlık ve son olarak kazanıldı veya kaybedildi. Her fırsatın tahmini tutarı ve beklenen kapanış tarihi olduğunda yönetim gelecek aylara dair gerçekçi bir tahmin üretebilir. Kaybedilen fırsatlarda sebep kaydı tutulması, fiyat mı, teslim süresi mi, ürün eksiği mi sorusunu veriyle cevaplar.

### Teklif ve Sözleşme Yönetimi

Teklifler CRM içinde hazırlandığında numaralandırma, revizyon takibi ve geçerlilik süresi otomatik yönetilir. Onaylanan teklifin siparişe veya sözleşmeye dönüşmesi tek adıma iner. Şablon tabanlı teklif üretimi hem hataları hem de hazırlık süresini azaltır; fiyat listeleri ve iskonto kuralları sisteme tanımlandığında yanlış fiyat verme riski büyük ölçüde ortadan kalkar.

### Görev, Aktivite ve Hatırlatmalar

CRM'in en çok değer üreten kısmı burasıdır. Her görüşmenin sonunda bir sonraki adım tanımlanır: üç gün sonra ara, teklifi revize et, numune gönder. Sistem bu adımları hatırlattığı sürece takip disiplini kişisel alışkanlığa bağlı kalmaz.

### Raporlama ve Satış Analitiği

Temsilci bazında dönüşüm oranı, ortalama satış süresi, kanal bazında kazanma oranı ve aşamada bekleme süresi gibi metrikler otomatik hesaplanır. Manuel rapor hazırlama işi ortadan kalkar, tartışma verinin doğruluğundan çıkıp kararın kendisine gelir.

## Hazır CRM mi, Özel CRM mi?

Hazır CRM ürünleri hızlı başlangıç sağlar ve düşük başlangıç maliyeti sunar. Ancak süreçleriniz standart dışıysa, yazılımı sürecinize değil sürecinizi yazılıma uydurmak zorunda kalırsınız. Özel CRM geliştirme ise tam tersini yapar: yazılım mevcut iş akışınıza göre kurgulanır.

| Kriter | Hazır CRM | Özel CRM |
| --- | --- | --- |
| Başlangıç süresi | Günler | Haftalar |
| Başlangıç maliyeti | Düşük | Orta - yüksek |
| Uzun vadeli maliyet | Kullanıcı başına aylık, ekip büyüdükçe artar | Tek seferlik geliştirme ve bakım |
| Süreç uyumu | Standart akışlar | Tam uyum |
| Entegrasyon esnekliği | Hazır konektörlerle sınırlı | İhtiyaca göre serbest |
| Veri sahipliği | Sağlayıcı altyapısı | Kendi sunucunuz veya kontrol ettiğiniz bulut |
| Özelleştirme sınırı | Sağlayıcının izin verdiği kadar | Sınır yok |

Karar verirken doğru soru hangisi daha iyi değil, süreçlerim standart mı sorusudur. Standart bir satış akışınız varsa hazır çözüm yeterlidir. Bayi ağı, proje bazlı fiyatlandırma, çok aşamalı onay veya sektöre özgü hesaplama içeren bir modeliniz varsa özel geliştirme daha ekonomik olur. Konunun genel çerçevesini [özel yazılım nedir](/blog/ozel-yazilim-nedir) yazımızda ayrıntılı ele alıyoruz.

## Hangi İşletmeler Özel CRM'e İhtiyaç Duyar?

- Proje bazlı satış yapan firmalar: Her satış farklı kapsam, farklı fiyat ve farklı onay adımı içerir.
- Bayi ve distribütör ağı yönetenler: Bayi hiyerarşisi, bölge kısıtı ve bayiye özel fiyat listesi hazır ürünlerde zorlanır.
- Saha ekibi olan işletmeler: Ziyaret planı, konum kaydı ve çevrimdışı çalışma ihtiyacı özel geliştirme gerektirir.
- Üretim ve ihracat yapan şirketler: Teklif, numune, üretim kapasitesi ve teslim planı birbirine bağlıdır.
- Servis ve bakım hizmeti verenler: Sözleşme yenileme, periyodik bakım ve garanti takibi sürecin merkezindedir.
- Mevcut kurumsal kaynak planlama sistemi olan şirketler: CRM'in bu sistemle gerçek zamanlı konuşması gerekir.

## CRM ile ERP Arasındaki Fark

En yaygın karışıklık burada yaşanır. Kısaca: CRM işletmenin dışa dönük yüzünü, ERP içe dönük yüzünü yönetir.

| Alan | CRM | ERP |
| --- | --- | --- |
| Odak | Müşteri ve satış | Kaynak, stok, finans, üretim |
| Ana kullanıcı | Satış, pazarlama, müşteri hizmetleri | Muhasebe, satın alma, depo, üretim |
| Tipik veri | Lead, fırsat, teklif, aktivite | Stok, sipariş, fatura, maliyet, personel |
| Cevapladığı soru | Hangi müşteriyi nasıl kazanırız? | Kaynaklarımızı nasıl verimli kullanırız? |

Doğru kurulum genellikle ikisinin birlikte çalışmasıdır: CRM'de kazanılan fırsat ERP'de siparişe dönüşür; ERP'deki stok ve teslim bilgisi CRM'de satış temsilcisine görünür hale gelir. ERP tarafını modül modül incelemek isterseniz [ERP yazılımı nedir](/blog/erp-yazilimi-nedir) yazımız konuyu ayrıntılı anlatıyor.

## Entegrasyonlar: CRM'i Değerli Kılan Katman

Tek başına duran bir CRM, veri girişi yükü yaratan bir forma dönüşür. Değer, diğer sistemlerle konuştuğunda ortaya çıkar. Yaygın entegrasyon başlıkları:

- Muhasebe ve ön muhasebe yazılımları: Cari hesap, fatura ve tahsilat bilgisinin CRM'de görünmesi.
- E-posta ve takvim: Görüşmelerin otomatik kaydı, toplantıların senkronizasyonu.
- Web sitesi ve reklam formları: Gelen talebin doğrudan lead olarak sisteme düşmesi.
- Telefon santrali: Gelen aramada müşteri kartının ekranda açılması, arama kayıtlarının saklanması.
- SMS ve mesajlaşma kanalları: Bildirim ve hatırlatmaların müşteriye ulaşması.
- E-ticaret altyapısı: Online siparişlerin ve müşteri geçmişinin CRM'e akması.

Bu bağlantıların tamamı API üzerinden kurulur. Teknik tarafı [API ve sistem entegrasyonları](/hizmetler/api-sistem-entegrasyonlari) hizmet sayfamızda detaylandırıyoruz.

## Özel CRM Geliştirme Süreci

Süreç analizi ilk adımdır. Mevcut satış akışı, roller, onay adımları ve raporlama ihtiyaçları çıkarılır. Bu aşamada yazılım değil iş modeli konuşulur; hangi kararın hangi veriye dayandığı netleşmeden ekran tasarlamak anlamsızdır.

Ardından kapsam ve önceliklendirme gelir. Birinci sürümde neyin olacağı, neyin sonraya kalacağı netleşir. Her şeyi ilk sürüme sıkıştırmak en sık yapılan hatadır.

Veri modeli tasarımında müşteri, fırsat, teklif ve aktivite ilişkileri kurulur. Burada verilen kararlar sistemin gelecekteki esnekliğini belirler; sonradan değiştirilmesi en pahalı katman budur.

Arayüz tasarımında satış temsilcisinin günde onlarca kez göreceği ekranlar önce ele alınır. Kötü tasarlanmış CRM, kullanılmayan CRM'dir.

Geliştirme parça parça yürütülür, her teslimde gerçek kullanıcıdan geri bildirim alınır. Veri aktarımında Excel dosyaları ve eski sistemdeki kayıtlar temizlenerek taşınır; mükerrer kayıt ayıklama bu adımın en zahmetli kısmıdır.

Eğitim ve devreye alma aşamasında kullanıcılar rol bazında eğitilir, ilk hafta destek yoğun tutulur. Son olarak kullanım verisi izlenir; kullanılmayan alanlar kaldırılır, eksik olanlar eklenir.

## Veri Güvenliği ve Yetkilendirme

Müşteri verisi kişisel veridir ve KVKK kapsamındadır. Bu nedenle CRM projelerinde güvenlik sonradan eklenen bir başlık olmamalıdır. Temel gereklilikler:

- Rol bazlı yetkilendirme: Her temsilci yalnızca kendi portföyünü, yönetici tüm bölgeyi görebilir.
- Alan seviyesinde kısıt: Maliyet ve iskonto gibi hassas alanların yalnızca yetkili rollere açılması.
- İşlem günlükleri: Kim hangi kaydı ne zaman değiştirdi bilgisinin tutulması.
- Veri dışa aktarma kontrolü: Toplu indirme yetkisinin sınırlandırılması.
- Şifreleme ve yedekleme: Aktarımda ve saklamada şifreleme, düzenli ve geri dönüşü test edilmiş yedek.
- Saklama süresi: Kişisel verinin ne kadar süre tutulacağının tanımlı olması.

## Mobil Erişim ve Saha Kullanımı

Satış ekibi masada değildir. Bu nedenle CRM'in mobil kullanımı ikinci sınıf bir özellik olarak görülemez. Sahada en çok ihtiyaç duyulan yetenekler müşteri kartına hızlı erişim, ziyaret notu girme, fotoğraf ekleme, konum ile ziyaret doğrulama ve zayıf bağlantıda çevrimdışı kayıt tutup bağlantı geldiğinde senkronize etmedir. Mobil arayüzün masaüstünün küçültülmüş hali değil, saha senaryosuna göre tasarlanmış ayrı bir akış olması gerekir.

## CRM Yazılımı Maliyetleri

Maliyeti belirleyen ana etken kullanıcı sayısı değil süreç karmaşıklığıdır:

- Modül sayısı ve iş kurallarının karmaşıklığı
- Entegrasyon adedi ve karşı sistemlerin API kalitesi
- Yetkilendirme derinliği ve onay akışları
- Mobil uygulama ihtiyacı
- Aktarılacak eski veri miktarı ve kalitesi
- Raporlama ve analitik beklentisi

Hazır çözümlerde maliyet kullanıcı başına aylık abonelik olarak ilerler; ekip büyüdükçe toplam gider doğrusal artar. Özel geliştirmede maliyet başta yoğunlaşır, sonrasında bakım ve iyileştirme kalemine döner. Kullanıcı sayısı belirli bir eşiği aşan ve süreçleri standart dışı olan işletmelerde özel geliştirme genellikle üç yıllık toplam sahip olma maliyetinde avantajlı hale gelir. Doğru karar için mevcut süreçlerin ve beklentilerin yazılı hale getirildiği kısa bir analiz yeterlidir; [CRM yazılım çözümleri](/hizmetler/crm-yazilim-cozumleri) sayfamızda bu analizin nasıl yürütüldüğünü anlatıyoruz. Süreçlerin tümüyle sıfırdan kurgulanması gereken durumlarda [özel yazılım geliştirme](/hizmetler/ozel-yazilim-gelistirme) yaklaşımımız devreye girer.

## CRM Projelerinde Sık Yapılan Hatalar

- Her şeyi ilk sürüme koymak: Kapsam büyüdükçe devreye alma gecikir, ekip motivasyonu düşer.
- Kullanıcıyı sürece dahil etmemek: Sahayı dinlemeden tasarlanan ekranlar kullanılmaz.
- Zorunlu alan enflasyonu: Yirmi zorunlu alan içeren bir form, temsilcinin kaydı hiç açmamasına yol açar.
- Raporu sonraya bırakmak: Hangi raporun isteneceği bilinmezse veri modeli o raporu üretemeyecek şekilde kurulur.
- Entegrasyonu sonraya bırakmak: Muhasebe bağlantısı olmayan CRM ikinci bir veri girişi noktasına dönüşür.
- Eğitimi tek seferlik görmek: Devreye almadan sonraki ilk ay düzenli takip gerektirir.

## Sık Sorulan Sorular

### CRM yazılımı küçük işletmeler için de gerekli mi?

Gereklidir, ancak kapsamı farklıdır. Beş kişilik bir ekipte bile takip edilmeyen talep kaybedilen gelirdir. Küçük işletmeler için doğru yaklaşım sade bir lead ve teklif takibiyle başlayıp ihtiyaç doğdukça büyütmektir.

### Özel CRM geliştirme ne kadar sürer?

Temel modülleri içeren bir ilk sürüm genellikle altı ila on hafta arasında devreye alınabilir. Entegrasyon sayısı ve onay akışlarının karmaşıklığı bu süreyi uzatan en önemli iki faktördür.

### Mevcut Excel verilerimiz aktarılabilir mi?

Aktarılabilir. Kritik nokta veri temizliğidir: mükerrer kayıtlar, eksik iletişim bilgileri ve tutarsız firma isimleri aktarım öncesi düzeltilir. Kirli verinin taşınması yeni sistemin güvenilirliğini ilk günden zedeler.

### CRM ve ERP aynı sistemde olmalı mı?

Tek platformda birleşik çalışmak veri tutarlılığı açısından avantajlıdır. Ancak mevcut ve iyi çalışan bir ERP varsa onu değiştirmek yerine CRM ile entegre etmek daha az riskli ve daha hızlı bir yoldur.

### Ekibimiz CRM kullanmaya direnç gösterirse ne olur?

Direncin ana kaynağı sistemin ek iş yükü olarak görülmesidir. Bunu önlemenin yolu CRM'in temsilciye de fayda sağlamasıdır: otomatik teklif hazırlama, hatırlatmalar ve tekrar eden veri girişinin kaldırılması. Zorunlu alanların sayısı ne kadar azsa benimseme o kadar yüksek olur.

### Verilerimiz kendi sunucumuzda tutulabilir mi?

Tutulabilir. Özel geliştirilen CRM kendi sunucunuzda veya kontrol ettiğiniz bir bulut ortamında barındırılabilir. Bu, veri sahipliği ve KVKK uyumu açısından çoğu kurumun tercih ettiği modeldir.

## Sonuç

CRM yazılımı, satış sürecini kişisel alışkanlıklardan çıkarıp kurumsal bir yapıya bağlayan araçtır. Doğru kurulduğunda cevabı en çok aranan üç soruyu netleştirir: Kaç açık fırsatımız var, hangileri gerçekten kapanacak ve hangi kanal bize gerçekten müşteri getiriyor.

Standart bir satış akışınız varsa hazır bir CRM ile hızlı başlayabilirsiniz. Süreçleriniz kendine özgüyse, birden çok sistemle konuşması gerekiyorsa veya ekibiniz hazır ürünlerin sınırlarına çarpıyorsa özel geliştirme daha sağlıklı bir yatırımdır.

Pars Medya olarak işletmelerin satış süreçlerini analiz ediyor, ihtiyaca göre özel CRM sistemleri geliştiriyor ve mevcut yazılımlarınızla entegre ediyoruz. Süreçlerinizi konuşmak ve size uygun yol haritasını çıkarmak için [iletişim](/iletisim) sayfamızdan bize ulaşabilirsiniz.
$c_crm_yazilimi_nedir$,
    '/parsmedya-hero.png',
    'Kurumsal Yazılım',
    'Pars Medya Ekibi',
    'CRM Yazılımı Nedir? Özel CRM Geliştirme Rehberi',
    'CRM yazılımı nedir, hangi modüllerden oluşur, hazır CRM ile özel CRM arasındaki fark nedir? Özel CRM geliştirme süreci, entegrasyonlar ve maliyetler.',
    'published',
    '2026-08-18T09:00:00Z',
    'tr'
  )
on conflict (locale, slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  image_url = excluded.image_url,
  category = excluded.category,
  author = excluded.author,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

insert into public.blog_posts
  (title, slug, excerpt, content, image_url, category, author, seo_title, seo_description, status, published_at, locale)
values
  (
    'ERP Yazılımı Nedir? ERP Sistemi İşletmeye Ne Kazandırır? [2026 Rehberi]',
    'erp-yazilimi-nedir',
    'ERP yazılımı stok, satın alma, satış, üretim ve finans süreçlerini tek veri tabanında birleştirir. 2026 rehberinde ERP modüllerini, gerçek zamanlı veriyi, e-fatura yaklaşımını, veri göçünü ve maliyet kalemlerini inceliyoruz.',
    $c_erp_yazilimi_nedir$
## ERP Yazılımı Nedir?

ERP (Enterprise Resource Planning, yani Kurumsal Kaynak Planlama) yazılımı, bir işletmenin stok, satın alma, satış, üretim, finans ve insan kaynakları gibi temel süreçlerini tek bir veri tabanı üzerinde birleştiren sistemdir. Tanımın kritik kısmı tek veri tabanı ifadesidir. ERP'yi diğer yazılımlardan ayıran şey modül sayısı değil, bütün modüllerin aynı veriyi paylaşmasıdır.

Bir örnekle netleşir. ERP kullanmayan bir işletmede satış ekibi müşteriye iki yüz adet ürün taahhüt eder; depo o anda yüz yirmi adet olduğunu bilir ama satışa haber vermez; satın alma eksik miktarı üç gün sonra fark eder; muhasebe faturayı yanlış adetle keser. ERP devreye alındığında satış temsilcisi siparişi girdiği anda stok rezerve edilir, eksik miktar satın alma talebine dönüşür ve fatura sipariş verisinden üretilir. Aynı bilgi tek yerde tutulduğu için kimsenin bir başkasını arayıp teyit etmesi gerekmez.

2026 itibarıyla ERP artık yalnızca büyük üretim şirketlerinin gündemi değil. Çok kanallı satış yapan orta ölçekli ticari işletmeler, mağaza ve online stoğunu birlikte yönetmek zorunda kalan markalar ve proje bazlı çalışan hizmet firmaları da aynı bütünleşik yapıya ihtiyaç duyuyor.

## Ada Sistemler Problemi

ERP'nin çözdüğü asıl sorun, birbirinden bağımsız çalışan yazılım adalarıdır. Tipik bir işletmede muhasebe programı, depo için ayrı bir Excel dosyası, üretim için bir çizelge, satış için bir başka liste bulunur. Her biri kendi içinde doğru çalışır ama aralarında köprü yoktur.

Bu yapının maliyeti üç yerde birikir. Birincisi mükerrer veri girişi: aynı sipariş üç ayrı yere elle yazılır. İkincisi tutarsızlık: hangi kaydın doğru olduğu belirsizleşir ve karar toplantıları veri tartışmasına dönüşür. Üçüncüsü gecikme: bilgi bir bölümden diğerine ancak biri hatırlattığında ulaşır.

ERP bu üç maliyeti aynı anda hedefler. Veri bir kez girilir, tek kaynaktan okunur ve değiştiği anda ilgili tüm modüllerde güncel hale gelir.

## ERP Modülleri

### Stok ve Depo Yönetimi

Ürün kartları, depo lokasyonları, giriş ve çıkış hareketleri, sayım ve transferler bu modülde yönetilir. Kritik stok seviyesi tanımlandığında sistem eksik kalemleri kendisi işaretler. Çoklu depo, raf adresleme, seri ve lot takibi ihtiyaç duyulan sektörlerde bu modülün derinliği projenin ana belirleyicisi olur.

### Satın Alma

Talep, teklif toplama, onay, sipariş ve mal kabul adımları sırayla yürür. Tedarikçi performansı, teslim süresi ve fiyat geçmişi kayıt altında olduğunda satın alma kararı sezgiden veriye taşınır. Onay limitleri tanımlandığında belirli tutarın üzerindeki siparişler otomatik olarak üst yöneticiye düşer.

### Satış ve Sipariş Yönetimi

Müşteri siparişi, fiyat listeleri, iskonto kuralları, sevkiyat ve irsaliye süreçleri burada işler. Satış siparişi stok ve üretim ile bağlı olduğu için müşteriye verilen teslim tarihi gerçek kapasiteye dayanır. Satış öncesi süreçleri yönetmek için CRM ile birlikte çalışması önerilir; ayrıntılar için [CRM yazılımı nedir](/blog/crm-yazilimi-nedir) yazımıza bakabilirsiniz.

### Üretim Planlama

Ürün ağacı, iş emri, rota, kapasite ve fiili üretim kaydı bu modülün temelidir. Malzeme ihtiyaç planlaması, eldeki stok ile açık siparişleri karşılaştırarak neyin ne zaman satın alınacağını hesaplar. Fire, duruş ve işçilik kayıtları girildiğinde gerçek birim maliyet tahmini değil ölçülmüş bir değer olur.

### Finans ve Ön Muhasebe

Cari hesaplar, kasa ve banka, çek ve senet, tahsilat ve ödeme planı, masraf merkezleri bu modülde toplanır. Satış ve satın almadan gelen belgeler otomatik muhasebe fişine dönüştüğünde çift kayıt yükü ortadan kalkar. Nakit akış tablosunun günlük güncellenmesi, ERP'nin yönetime en hızlı geri dönen faydalarından biridir.

### İnsan Kaynakları

Personel kartları, izin ve devamsızlık takibi, vardiya planı, puantaj ve bordro hazırlığı bu modülde yürütülür. Üretim yapan işletmelerde puantaj verisinin üretim maliyetine bağlanması önemli bir kazanımdır.

### Raporlama ve Yönetim Paneli

Modüller aynı veriyi paylaştığı için raporlar birden fazla süreci birlikte gösterebilir: ürün grubu bazında brüt kâr, müşteri bazında ortalama tahsilat süresi, depo bazında devir hızı. Yönetim panelinin amacı veri göstermek değil, aksiyon gerektiren istisnaları öne çıkarmaktır.

## Gerçek Zamanlı Veri Neden Kritik?

ERP'nin sağladığı en somut fark verinin tazeliğidir. Gün sonunda güncellenen bir stok bilgisi, gün içinde satış yapan bir ekip için yeterli değildir. Gerçek zamanlı yapıda sipariş girildiği anda stok rezerve edilir, üretim iş emri açıldığında malzeme ayrılır ve tahsilat kaydedildiğinde müşterinin risk limiti güncellenir.

Bunun pratik sonuçları şunlardır:

- Müşteriye verilen teslim tarihleri gerçekleşebilir hale gelir.
- Aynı ürün iki farklı müşteriye ikinci kez satılmaz.
- Risk limitini aşan müşteriye sevkiyat sistem tarafından durdurulabilir.
- Satın alma kararı, tahmini değil güncel ihtiyaca dayanır.
- Yönetim ay sonunu beklemeden kârlılık eğilimini görebilir.

## Yetkilendirme ve Onay Akışları

ERP tüm kurumun verisini bir arada tuttuğu için yetkilendirme tasarımı projenin en hassas başlıklarından biridir. İyi bir kurulumda yetki üç seviyede tanımlanır: modül seviyesinde erişim, kayıt seviyesinde görünürlük ve alan seviyesinde okuma veya yazma hakkı. Depo sorumlusunun maliyet alanını görmemesi ya da şube kullanıcısının yalnızca kendi şubesinin hareketlerine erişmesi bu şekilde sağlanır.

Onay akışları ise sürecin kontrol noktalarıdır. Satın alma talebinin tutara göre farklı yöneticilere gitmesi, belirli iskonto oranının üzerinde satış onayı istenmesi veya stok düzeltmesinin ikinci bir kullanıcı tarafından doğrulanması tipik örneklerdir. Kritik olan, onay adımlarının süreci yavaşlatmayacak kadar az ve riski karşılayacak kadar yeterli olmasıdır.

Her işlemin kullanıcı ve zaman bilgisiyle günlüğe yazılması ayrıca bir gerekliliktir. Bu kayıt hem denetim hem de hata takibi için gereklidir.

## Entegrasyonlar ve e-Fatura Yaklaşımı

ERP, kurumun merkezindeki sistem olduğu için çevresindeki her uygulamayla konuşmak zorundadır. Sık ihtiyaç duyulan entegrasyon başlıkları:

- Banka sistemleri: Hesap hareketlerinin otomatik okunması ve tahsilat eşleştirmesi.
- E-ticaret ve pazar yerleri: Sipariş, stok ve fiyat senkronizasyonu. Bu tarafı [e-ticaret çözümleri](/hizmetler/e-ticaret-cozumleri) sayfamızda ayrıca ele alıyoruz.
- Kargo ve lojistik firmaları: Gönderi oluşturma ve teslim durumu takibi.
- Üretim sahasındaki cihazlar: Terminal, barkod okuyucu ve tartı verisinin sisteme akması.
- CRM ve satış uygulamaları: Fırsattan siparişe geçişin kopmadan ilerlemesi.
- Raporlama ve iş zekası araçları: Veri ambarına düzenli aktarım.

e-Fatura ve e-Arşiv tarafında doğru yaklaşım, ERP'nin belge üretimini ve gönderim sorumluluğunu ayırmasıdır. ERP'nin görevi faturayı doğru veriyle, doğru vergi ve iskonto hesabıyla oluşturmak ve bu belgeyi yetkili entegratöre iletmektir. Gönderim, imzalama ve mevzuat uyumu tarafı entegratör üzerinden yürür; gelen yanıt ve durum bilgisi tekrar ERP'ye yazılır. Bu ayrım, mevzuat değiştiğinde ERP'nin baştan elden geçirilmesini engeller. Entegrasyon katmanının nasıl kurulduğunu [API ve sistem entegrasyonları](/hizmetler/api-sistem-entegrasyonlari) sayfamızda anlatıyoruz.

## Hazır ERP mi, Özel ERP mi?

| Kriter | Hazır ERP | Özel ERP |
| --- | --- | --- |
| Devreye alma süresi | Orta - uzun (kurulum ve uyarlama) | Uzun (modül modül teslim) |
| Süreç uyumu | Sektör şablonlarına yakın | Kendi akışınıza tam uyum |
| Kullanılmayan modül | Sık görülür, lisansı yine ödenir | Yoktur, sadece gerekeni geliştirilir |
| Özelleştirme maliyeti | Yüksek, güncellemeleri riske atabilir | Geliştirmenin doğal parçası |
| Lisans modeli | Kullanıcı veya modül başına yıllık | Tek seferlik geliştirme ve bakım |
| Bağımlılık | Sağlayıcı yol haritasına bağlı | Kendi yol haritanız |
| Uygun olduğu durum | Standart ticari süreçler | Sektöre özgü hesap ve akışlar |

Hazır ERP'nin en yanıltıcı tarafı, uyarlama maliyetinin lisans maliyetinden büyük çıkabilmesidir. Standart dışı her istek geliştirme talebine dönüşür ve bu geliştirmeler sürüm güncellemelerinde yeniden ele alınmak zorunda kalır. Buna karşılık özel ERP'nin riski kapsamın kontrolsüz büyümesidir; bu risk aşamalı teslim ve net önceliklendirme ile yönetilir. Karar çerçevesini [özel yazılım nedir](/blog/ozel-yazilim-nedir) yazımızda ayrıntılandırdık.

## ERP ile CRM Arasındaki Fark

ERP kaynak yönetir, CRM ilişki yönetir. ERP'nin sorusu elimizdeki kaynakla neyi ne zaman üretip teslim edebiliriz, CRM'in sorusu hangi müşteriyi hangi adımla kazanırız şeklindedir. ERP siparişten sonrasına, CRM siparişten öncesine odaklanır.

İki sistem ayrı olabilir ama kopuk olmamalıdır. CRM'de kazanılan fırsatın ERP'de siparişe dönüşmesi, ERP'deki stok ve tahsilat durumunun CRM'de görünmesi tipik bağlantı noktalarıdır. Uygulamada en çok sorun yaratan durum, aynı müşterinin iki sistemde farklı kayıtlarla tutulmasıdır; bu nedenle müşteri kaydının hangi sistemde ana kaynak olduğu projenin başında kararlaştırılmalıdır.

## Veri Göçü: Projenin En Riskli Adımı

ERP projelerinin gecikme sebeplerinin başında veri göçü gelir. Aktarılacak veri genellikle üç gruba ayrılır: ana veriler (ürün, müşteri, tedarikçi, hesap planı), açılış bakiyeleri (stok, cari, banka) ve geçmiş hareketler.

İyi yürütülmüş bir göçün adımları şöyledir:

- Kapsam kararı: Geçmiş hareketlerin tamamı değil, ihtiyaç duyulan dönemi aktarılır. Kalanı arşiv olarak saklanır.
- Temizlik: Mükerrer ürün ve müşteri kayıtları birleştirilir, kullanılmayan kartlar pasife alınır.
- Eşleştirme: Eski kodlar ile yeni kod yapısı arasında dönüşüm tablosu hazırlanır.
- Deneme aktarımı: Test ortamına aktarılır, bakiyeler eski sistemle karşılaştırılır.
- Mutabakat: Stok ve cari toplamları kuruşu kuruşuna tutmadan canlıya geçilmez.
- Kesme anı planı: Hangi tarih ve saatte hangi sistemin geçerli olduğu yazılı olarak duyurulur.

## Eğitim ve Devreye Alma

ERP, kullanıcıların günlük çalışma biçimini değiştirir. Bu nedenle eğitim teknik bir ek iş değil, projenin başarı koşuludur. Etkili yaklaşım rol bazlı eğitimdir: depo görevlisine tüm sistemi değil, kendi ekranlarını ve hata durumunda ne yapacağını anlatmak.

Devreye alma stratejisinde iki yol vardır. Aşamalı geçişte modüller sırayla açılır; risk düşüktür ama geçiş dönemi uzar ve iki sistemin bir süre paralel yürütülmesi gerekir. Tek seferde geçişte tüm modüller aynı tarihte devreye alınır; hızlıdır ama hazırlık kusuru affetmez. Orta ölçekli işletmelerde genellikle finans ve stok ile başlayıp üretim ve insan kaynaklarını sonraya bırakan aşamalı model daha güvenli sonuç verir.

Canlıya geçişten sonraki ilk ay için yoğun destek planlanmalıdır. Kullanıcı bir işlemi yapamadığında eski yönteme dönerse, sistem ilk haftada güvenilirliğini kaybeder.

## ERP Maliyetleri

ERP maliyeti tek bir kalem değildir. Bütçelenmesi gereken başlıklar:

- Analiz ve süreç tasarımı
- Yazılım geliştirme veya lisans
- Uyarlama ve özelleştirme
- Entegrasyonlar ve entegratör hizmetleri
- Veri göçü ve mutabakat
- Eğitim ve devreye alma desteği
- Sunucu veya bulut altyapısı
- Yıllık bakım, güncelleme ve destek

Maliyeti en çok etkileyen faktörler modül sayısı, üretim karmaşıklığı, entegrasyon adedi ve aktarılacak veri kalitesidir. Uygulamada sıkça atlanan kalem iç kaynak maliyetidir: kendi ekibinizin analiz, test ve mutabakat için ayırdığı zaman gerçek bir maliyettir ve projenin başında planlanmalıdır. İhtiyacınıza uygun kapsamı belirlemek için [ERP yazılım çözümleri](/hizmetler/erp-yazilim-cozumleri) sayfamızdaki yaklaşımımızı inceleyebilir, süreçlerinizin tamamen kendinize özgü olduğu durumlarda [özel yazılım geliştirme](/hizmetler/ozel-yazilim-gelistirme) hizmetimizi değerlendirebilirsiniz.

## ERP Projelerinde Sık Yapılan Hatalar

- Süreç iyileştirmeden yazılıma geçmek: Bozuk bir süreci yazılıma taşımak onu daha hızlı bozuk hale getirir.
- Proje sahibi belirlememek: Karar verecek tek bir sorumlu yoksa kapsam sürekli değişir.
- Kullanıcıları geç dahil etmek: Testi ilk kez canlıya geçişte yapan ekip, geçişi başaramaz.
- Kirli veriyi taşımak: Hatalı stok ve cari verisi yeni sisteme güvensizlik olarak yansır.
- Eğitimi bütçeden kısmak: En sık ve en pahalı tasarruf hatasıdır.
- Raporları sonraya bırakmak: Beklenen raporlar bilinmezse veri yapısı onları üretemez.

## Sık Sorulan Sorular

### ERP yazılımı sadece büyük şirketler için mi uygundur?

Hayır. Belirleyici olan çalışan sayısı değil süreç bağımlılığıdır. Stok, üretim ve finans birbirini etkileyen otuz kişilik bir işletme, yüz kişilik bir hizmet firmasından daha çok ERP'ye ihtiyaç duyabilir. Küçük ölçekte doğru yol, tüm modülleri değil kritik iki üç modülü devreye alarak başlamaktır.

### ERP kurulumu ne kadar sürer?

Kapsama göre değişir. Finans ve stok odaklı sınırlı bir kapsam üç ile altı ay arasında devreye alınabilir. Üretim planlama, çok depolu yapı ve çoklu entegrasyon içeren projeler dokuz ayı aşabilir. Süreyi en çok uzatan iki etken veri göçü ve karar gecikmeleridir.

### Mevcut muhasebe programımızı bırakmak zorunda mıyız?

Zorunlu değildir. Muhasebe programı yerinde kalıp ERP ile entegre çalışabilir. Bu yaklaşım geçiş riskini düşürür; karşılığında iki sistem arasında mutabakat disiplini gerektirir. Uzun vadede tek sistemde birleşmek veri tutarlılığı açısından daha sağlıklıdır.

### e-Fatura süreci ERP içinde mi yürür?

ERP faturayı üretir ve yetkili entegratöre iletir; gönderim ile mevzuat uyumu entegratör tarafında yürür. Entegratörden dönen durum bilgisi ERP'ye yazılır. Bu ayrım sayesinde mevzuat değişiklikleri ERP'yi baştan sona etkilemez.

### Hazır ERP alıp özelleştirmek mi, sıfırdan geliştirmek mi daha ekonomik?

Süreçleriniz sektör standardına yakınsa hazır ürün genellikle daha hızlı ve daha ekonomiktir. Buna karşılık standart dışı hesaplama, kendine özgü onay akışı veya sektöre özel takip ihtiyacı arttıkça uyarlama maliyeti hızla yükselir ve belirli bir eşikten sonra özel geliştirme daha öngörülebilir hale gelir.

### ERP verilerimiz bulutta mı yoksa kendi sunucumuzda mı durmalı?

İkisi de mümkündür. Bulut, bakım ve erişilebilirlik yükünü azaltır; kendi sunucunuz veri kontrolü ve mevcut altyapıyla uyum açısından tercih edilir. Karar verirken üretim sahasındaki internet kesintisi riskini ve yedekleme stratejinizi birlikte değerlendirmek gerekir.

## Sonuç

ERP yazılımı, işletmenin farklı bölümlerinde dağınık duran veriyi tek bir doğruluk kaynağına indirger. Bunun karşılığı daha az mükerrer iş, daha gerçekçi teslim taahhütleri, ölçülmüş maliyet ve ay sonunu beklemeden görülebilen bir kârlılık tablosudur.

Ancak ERP tek başına bir çözüm değildir; süreçlerin gözden geçirilmesini, veri disiplinini ve kullanıcıların gerçekten sisteme geçmesini gerektirir. Bu üçünü sağlamayan projelerde en gelişmiş yazılım da beklentiyi karşılamaz.

Pars Medya olarak işletmelerin süreçlerini analiz ediyor, kapsamı aşamalı planlıyor ve ihtiyaca göre özel ERP çözümleri geliştirip mevcut sistemlerinizle entegre ediyoruz. Kendi yapınıza uygun yol haritasını çıkarmak için [iletişim](/iletisim) sayfamızdan bize ulaşabilirsiniz.
$c_erp_yazilimi_nedir$,
    '/parsmedya-hero.png',
    'Kurumsal Yazılım',
    'Pars Medya Ekibi',
    'ERP Yazılımı Nedir? 2026 İşletme Rehberi | Pars Medya',
    'ERP yazılımı nedir, hangi modüllerden oluşur ve işletmeye ne kazandırır? 2026 rehberi: hazır ve özel ERP karşılaştırması, entegrasyonlar, veri göçü, maliyetler.',
    'published',
    '2026-08-17T09:00:00Z',
    'tr'
  )
on conflict (locale, slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  image_url = excluded.image_url,
  category = excluded.category,
  author = excluded.author,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

insert into public.blog_posts
  (title, slug, excerpt, content, image_url, category, author, seo_title, seo_description, status, published_at, locale)
values
  (
    'Web Yazılım Nedir? Kurumsal Web Sitesi ile Özel Web Yazılım Arasındaki Farklar',
    'web-yazilim-nedir',
    'Web yazılım, tarayıcı üzerinden çalışan ve veri işleyen uygulamaları kapsar. Kurumsal web sitesi ile web uygulaması arasındaki farkları, mimari katmanları, güvenlik, performans ve SEO gerekliliklerini ele alıyoruz.',
    $c_web_yazilim_nedir$
## Web Yazılım Nedir?

Web yazılım, kullanıcının tarayıcı üzerinden eriştiği, sunucu tarafında veri işleyen ve iş kuralları yürüten uygulamalara verilen genel addır. Bilgisayara kurulum gerektirmez; güncelleme sunucu tarafında yapıldığı için tüm kullanıcılar aynı anda yeni sürümü kullanır.

Tanımın önemli kısmı veri işleme ve iş kuralı ifadeleridir. Bir sayfanın internette yayında olması onu web yazılımı yapmaz. Kullanıcı giriş yapıyorsa, kayıt oluşturuyorsa, bir hesaplama yürüyorsa, yetkiye göre farklı ekranlar görülüyorsa veya başka bir sistemle veri alışverişi yapılıyorsa artık bir web yazılımından söz ediyoruz.

Bu ayrım pratik açıdan da önemlidir, çünkü iki iş kaleminin planlaması, süresi, test ihtiyacı ve bakım modeli tamamen farklıdır.

## Kurumsal Web Sitesi ile Web Uygulaması Arasındaki Fark

En sık karıştırılan iki başlık bunlardır. Kurumsal web sitesi kurumu anlatır; web uygulaması iş yapar.

| Kriter | Kurumsal Web Sitesi | Web Uygulaması |
| --- | --- | --- |
| Temel amaç | Tanıtım, güven, talep toplama | İş sürecini yürütmek |
| Kullanıcı davranışı | Okur, inceler, form doldurur | Giriş yapar, veri girer, işlem tamamlar |
| İçerik yapısı | Büyük ölçüde sabit sayfalar | Kullanıcıya ve yetkiye göre değişen ekranlar |
| Veri yönetimi | İçerik yönetimi düzeyinde | İlişkisel veri modeli, işlem geçmişi |
| Kritik metrik | Görünürlük, dönüşüm oranı | Doğruluk, hız, kesintisiz çalışma |
| Öncelikli başlık | SEO ve içerik | Güvenlik, yetkilendirme, veri tutarlılığı |
| Bakım modeli | İçerik güncelleme | Sürüm yönetimi, izleme, yedekleme |

Aynı proje içinde ikisinin birlikte bulunması yaygındır: kamuya açık kurumsal site ve arkasında müşterinin giriş yaptığı bir portal. Bu durumda ikisini tek bir yapı gibi değil, farklı gereksinimleri olan iki katman gibi planlamak doğrudur.

## Web Yazılım Türleri

### Kurumsal Web Sitesi

Kurumun dijital yüzüdür. Hizmet sayfaları, referanslar, blog ve iletişim akışını içerir. Başarısı tasarımdan çok bulunabilirlik ve netlikle ölçülür: doğru sorularla arayan kişinin siteyi bulması ve aradığı bilgiye üç tıklamadan önce ulaşması. Ayrıntılar için [kurumsal web sitesi geliştirme](/hizmetler/web-sitesi-gelistirme) sayfamıza bakabilirsiniz.

### Müşteri ve Bayi Portalları

Giriş yapan kullanıcıya kendi verisini gösteren uygulamalardır. Bayi portalında sipariş verme, fiyat listesi görüntüleme, bakiye ve sevkiyat takibi; müşteri portalında fatura görüntüleme, talep açma ve sözleşme takibi tipik işlevlerdir. Bu tür uygulamaların en kritik tarafı yetkilendirmedir: bir bayinin başka bir bayinin verisini görmesi kabul edilemez bir hatadır.

### E-Ticaret Sistemleri

Ürün kataloğu, sepet, ödeme, kargo ve sipariş sonrası süreçleri kapsar. Ödeme ve stok doğruluğu birinci derecede önemlidir; kampanya kuralları, çok kanallı satış ve pazar yeri bağlantıları karmaşıklığı hızla artırır. Bu başlığı [e-ticaret çözümleri](/hizmetler/e-ticaret-cozumleri) sayfamızda ayrıca ele alıyoruz.

### SaaS Uygulamaları

Abonelikle kullanılan, çok müşteriye aynı altyapı üzerinden hizmet veren yazılımlardır. Burada ek olarak kiracı ayrımı, abonelik ve faturalama, kullanım limitleri ve sürüm yönetimi gibi başlıklar devreye girer. Veri izolasyonu tasarımı en başta doğru kurulmalıdır; sonradan düzeltilmesi en pahalı konulardan biridir.

### İç Kullanım Panelleri

Saha ekipleri, üretim, depo veya operasyon birimleri için geliştirilen uygulamalardır. Görsel gösteriden çok hız ve az tıklama önemlidir. Günde yüzlerce kayıt giren bir kullanıcı için klavye ile ilerleyebilen bir form, güzel görünen ama yavaş bir arayüzden çok daha değerlidir.

## Teknik Mimari: Frontend, Backend, Veritabanı

### Frontend

Kullanıcının gördüğü ve etkileşime girdiği katmandır. Modern web yazılımlarında bileşen tabanlı yapılar kullanılır; ekranlar tekrar kullanılabilir parçalardan oluşturulur. Frontend'in sorumluluğu görünüm ve etkileşimdir; iş kuralı burada tutulmaz. Tarayıcıda yapılan doğrulama kullanıcı deneyimi içindir, güvenlik için değildir.

### Backend

İş kurallarının çalıştığı, verinin doğrulandığı ve yetkinin kontrol edildiği katmandır. Kim ne yapabilir, hangi hesap nasıl yürür, hangi işlem hangi koşulda geçerlidir sorularının tek doğru cevap yeri burasıdır. Backend aynı zamanda dış sistemlerle konuşan API katmanını da barındırır; entegrasyon tarafını [API ve sistem entegrasyonları](/hizmetler/api-sistem-entegrasyonlari) sayfamızda anlatıyoruz.

### Veritabanı

Verinin kalıcı olarak saklandığı katmandır. İlişkisel veritabanları, kayıtlar arasında tutarlılık gerektiren iş uygulamalarının doğal seçimidir. Tasarımda dikkat edilmesi gerekenler: doğru veri tipleri, benzersizlik ve bütünlük kısıtları, sık sorgulanan alanlarda indeks ve para gibi hassas değerlerde kayan noktalı sayı kullanmamak. Veri modeli, sonradan değiştirilmesi en zor katman olduğu için projenin en başında zaman ayrılması gereken yerdir.

### Barındırma ve Dağıtım

Yazılımın nerede çalıştığı ve nasıl güncellendiği de mimarinin parçasıdır. Sürüm geçmişinin kod deposunda tutulması, test ortamının canlıdan ayrı olması, otomatik dağıtım ve düzenli yedekleme temel gerekliliklerdir. Geri dönüş planı olmayan bir dağıtım süreci, hatalı sürümde uzun kesintiye yol açar.

## Kimlik Doğrulama ve Yetkilendirme

Bu iki kavram karıştırılır ama farklıdır. Kimlik doğrulama kullanıcının kim olduğunu, yetkilendirme ne yapabileceğini belirler.

Sağlıklı bir kurulumda beklenenler:

- Şifrelerin geri döndürülemez biçimde saklanması
- Oturum sürelerinin tanımlı olması ve çıkışta oturumun gerçekten sonlandırılması
- Yönetici hesapları için iki adımlı doğrulama
- Rol bazlı yetki tanımı ve gerektiğinde kayıt seviyesinde görünürlük kısıtı
- Her yetki kontrolünün sunucu tarafında yapılması
- Başarısız giriş denemelerinin sınırlandırılması

En sık görülen ciddi hata, bir kaydın adresini bilen kullanıcının o kaydı görebilmesidir. Arayüzde bağlantı göstermemek yetki kontrolü değildir; her istek sunucuda ayrı ayrı doğrulanmalıdır.

## Güvenlik

Web yazılımı internete açık olduğu için güvenlik sürekli bir başlıktır. Asgari önlemler:

- Tüm trafiğin şifreli bağlantı üzerinden yürümesi
- Kullanıcıdan gelen her verinin sunucuda doğrulanması
- Veritabanı sorgularında parametreli yapıların kullanılması
- Kullanıcı içeriğinin ekrana basılırken kaçırılması
- Dosya yüklemelerinde tür ve boyut kontrolü, yüklenen dosyaların çalıştırılamaz konumda tutulması
- Bağımlılıkların düzenli güncellenmesi
- Hata mesajlarının teknik ayrıntı sızdırmaması
- Yedeklerin düzenli alınması ve geri dönüşünün test edilmesi
- Kişisel veri işleniyorsa KVKK kapsamında saklama süresi ve erişim kaydı tanımı

## Responsive Tasarım

Responsive tasarım, arayüzün ekran boyutuna göre yeniden düzenlenmesidir. Bugün trafiğin önemli bölümü mobil cihazlardan geldiği için mobil, masaüstünün küçültülmüş hali olarak değil ana senaryo olarak tasarlanır.

Dikkat edilmesi gereken noktalar: dokunmatik hedeflerin parmakla rahat kullanılabilecek büyüklükte olması, tabloların küçük ekranda kart görünümüne dönüşmesi, formların tek kolona inmesi ve yatay kaydırma gerektirmemesidir. Uygulama tarafında ek olarak zayıf bağlantıda ne olacağı düşünülmelidir; yavaş yanıt geldiğinde kullanıcının ne beklediğini bilmesi gerekir.

## Performans

Performans hem kullanıcı deneyimini hem de arama sıralamalarını doğrudan etkiler. Yavaş bir uygulamada kullanıcı işlemi tamamlamadan ayrılır.

En çok fark yaratan başlıklar:

- Görsellerin uygun boyutta ve modern formatlarda sunulması
- Gereksiz kod paketlerinin gönderilmemesi, sayfa bazlı yükleme
- Önbellekleme: hem tarayıcı hem sunucu tarafında
- Veritabanı sorgu optimizasyonu ve indeks kullanımı
- Tekrarlayan sorguların tek sorguda toplanması
- Uzun süren işlemlerin arka plana alınması
- İçeriğin kullanıcıya yakın noktalardan dağıtılması

Performans ölçülmeden iyileştirilemez. Gerçek kullanıcı verisiyle izleme kurulmadan yapılan iyileştirmeler genellikle yanlış yere yapılır.

## SEO: Web Yazılımının Görünürlük Katmanı

SEO yalnızca içerik konusu değildir; teknik yapıyla doğrudan ilgilidir. Kamuya açık sayfalarda beklenenler:

- Her sayfa için benzersiz başlık ve açıklama
- Anlamlı ve kalıcı URL yapısı
- Tek bir H1 ve mantıklı başlık hiyerarşisi
- Sunucu tarafında oluşturulmuş içerik, böylece arama motorları içeriği güvenilir biçimde okuyabilir
- Site haritası ve doğru yönlendirme yönetimi
- Yapılandırılmış veri işaretlemesi
- Sayfa hızı ve mobil uyumluluk
- Anlamlı iç bağlantı yapısı

Giriş gerektiren uygulama ekranları arama motorlarına kapalı olmalıdır; buradaki hedef görünürlük değil güvenliktir. Yerel arama görünürlüğü konusunda ise şehir ve hizmet odaklı sayfaların nasıl kurgulandığını [İstanbul yazılım şirketleri](/blog/istanbul-yazilim-sirketleri) yazımızda ele alıyoruz.

## Hazır CMS mi, Özel Geliştirme mi?

| Kriter | Hazır CMS | Özel Web Yazılım |
| --- | --- | --- |
| Başlangıç süresi | Kısa | Orta - uzun |
| Başlangıç maliyeti | Düşük | Orta - yüksek |
| İçerik yönetimi | Güçlü, hazır arayüz | İhtiyaca göre tasarlanır |
| Karmaşık iş kuralı | Eklenti ile zorlanır | Doğal olarak desteklenir |
| Performans | Eklenti sayısı arttıkça düşer | Kontrol edilebilir |
| Güvenlik yükü | Eklenti ve tema güncellemeleri | Kendi kod tabanınız |
| Uygun olduğu durum | Tanıtım sitesi, blog, basit katalog | Portal, panel, e-ticaret, SaaS |

Pratik yaklaşım şudur: içerik ağırlıklı, iş kuralı hafif projelerde hazır bir içerik yönetim sistemi yeterlidir. Kullanıcı girişi, yetki, hesaplama, entegrasyon ve işlem geçmişi gerektiren her senaryoda özel geliştirme daha sürdürülebilirdir. Karar çerçevesini [özel yazılım nedir](/blog/ozel-yazilim-nedir) yazımızda ayrıntılı anlattık.

## Web Yazılım Geliştirme Süreci

Süreç, kullanıcı ve senaryo tanımı ile başlar. Kim hangi işi hangi sıklıkta yapacak sorusu cevaplanmadan ekran tasarlamak boşa emektir.

Ardından bilgi mimarisi ve akış tasarımı gelir. Ekranlar arasındaki geçişler, kritik formların alanları ve hata durumları önce kabaca çizilir. Bu aşamada yapılan değişiklik ucuz, geliştirme sırasında yapılan aynı değişiklik pahalıdır.

Veri modeli ve API tasarımı bir sonraki adımdır. Hangi verinin nerede tutulduğu ve hangi uç noktanın ne döndüreceği netleşir. Sonrasında arayüz tasarımı ve geliştirme paralel yürütülür; iş parçalara bölünür ve her parça çalışır halde teslim edilir.

Test aşaması işlevsel kontrolle sınırlı kalmamalıdır: yetki testleri, sınır değer testleri, mobil kontrolü ve performans ölçümü de kapsama girer. Devreye alma sonrasında izleme, hata takibi ve yedekleme kurulmadan proje bitmiş sayılmaz. Nasıl çalıştığımızı [web yazılım geliştirme](/hizmetler/web-yazilim-gelistirme) sayfamızda ayrıntılı anlatıyoruz.

## Maliyetler

Web yazılım maliyetini belirleyen unsurlar sayfa sayısı değil, işlevsel derinliktir:

- Kullanıcı rolü sayısı ve yetkilendirme derinliği
- Ekran ve form sayısı, iş kurallarının karmaşıklığı
- Entegrasyon adedi ve karşı sistemlerin API kalitesi
- Ödeme, fatura veya kargo gibi düzenlemeye tabi akışlar
- Tasarımın özgünlük düzeyi
- Beklenen trafik ve buna bağlı altyapı gereksinimi
- Çok dil desteği
- Bakım, izleme ve destek beklentisi

Sık atlanan iki kalem vardır. Birincisi bakımdır: web yazılımı canlıya alındığı gün bitmez, bağımlılık güncellemeleri ve küçük iyileştirmeler süreklidir. İkincisi içeriktir; metin, görsel ve ürün verisi hazırlanmadığı için yayına giremeyen proje sayısı azımsanmayacak kadar çoktur.

## Sık Sorulan Sorular

### Web sitesi mi web uygulaması mı yaptırmam gerekiyor?

Bunun ölçütü basittir: kullanıcıların giriş yapması, veri girmesi veya bir işlemi tamamlaması gerekiyorsa web uygulamasına ihtiyaç vardır. Amaç kurumu anlatmak ve iletişim talebi toplamaksa kurumsal web sitesi yeterlidir. Çoğu kurumda ikisi birlikte kurulur.

### Web yazılım projesi ne kadar sürer?

Kurumsal bir web sitesi genellikle üç ile altı hafta arasında yayına alınır. Giriş yetkisi, yönetim paneli ve entegrasyon içeren bir web uygulaması ise kapsama göre iki ile dört ay arasında değişir. Süreyi en çok uzatan iki etken kapsamın proje ortasında büyümesi ve içerik ile veri hazırlığının gecikmesidir.

### Mevcut sitemi sıfırdan yazdırmadan geliştirebilir miyim?

Çoğu durumda mümkündür. Mevcut yapının teknoloji seçimi güncel ve kod tabanı sürdürülebilir durumdaysa performans, güvenlik ve SEO iyileştirmeleri yapılabilir. Ancak eski ve desteği bitmiş bir altyapıda her ek geliştirme borcu büyütür; bu durumda yeniden yazmak orta vadede daha ekonomik olur.

### Web uygulaması mobil uygulama yerine geçer mi?

Çoğu iş senaryosunda geçer. Tarayıcı üzerinden çalışan, mobil için tasarlanmış bir uygulama tek kod tabanıyla tüm cihazlara ulaşır ve güncellemesi kolaydır. Cihaz donanımına derin erişim, arka planda sürekli çalışma veya gelişmiş çevrimdışı kullanım gerekiyorsa mobil uygulama gerekli hale gelir.

### Web yazılımında SEO ne kadar önemli?

Kamuya açık sayfalar için doğrudan görünürlük demektir ve teknik kararlarla iç içedir. Sunucu tarafında içerik oluşturma, sayfa hızı ve URL yapısı gibi başlıklar projenin başında ele alınmazsa sonradan düzeltilmesi maliyetli olur. Giriş gerektiren uygulama ekranlarında ise SEO değil erişim kontrolü önemlidir.

### Yayına aldıktan sonra hangi bakım kalemleri gerekir?

Bağımlılık ve güvenlik güncellemeleri, yedeklerin düzenli alınması ve geri dönüş testi, hata ve kesinti izlemesi, performans takibi ve kullanıcı geri bildirimine göre küçük iyileştirmeler. Bu kalemler planlanmadığında sistem birkaç yıl içinde güncellenemez hale gelir.

## Sonuç

Web yazılım, tanıtım amaçlı bir kurumsal siteden çok kullanıcılı bir iş uygulamasına kadar geniş bir aralığı kapsar. Bu aralıkta doğru konumu belirlemek projenin en önemli kararıdır: iş kuralı ve kullanıcı yetkisi gerektirmeyen bir ihtiyaç için karmaşık bir uygulama geliştirmek gereksiz maliyet, gerçek bir süreci hazır bir içerik sistemine sığdırmaya çalışmak ise sürdürülemez bir yapı üretir.

Hangi tarafta olursanız olun değişmeyen üç başlık vardır: veri modelinin doğru kurulması, güvenlik ve yetkilendirmenin sunucu tarafında ciddiye alınması, performans ile bakımın baştan planlanması.

Pars Medya olarak kurumsal web siteleri ve özel web yazılımları geliştiriyor, mevcut sistemlerinizle entegre ediyoruz. İhtiyacınızın hangi kapsama girdiğini netleştirmek ve gerçekçi bir yol haritası çıkarmak için [iletişim](/iletisim) sayfamızdan bize ulaşabilirsiniz.
$c_web_yazilim_nedir$,
    '/parsmedya-hero.png',
    'Web Teknolojileri',
    'Pars Medya Ekibi',
    'Web Yazılım Nedir? Web Sitesi vs Web Uygulaması',
    'Web yazılım nedir, kurumsal web sitesi ile web uygulaması arasındaki fark nedir? Frontend, backend, veritabanı, güvenlik, performans ve SEO gereklilikleri.',
    'published',
    '2026-08-16T09:00:00Z',
    'tr'
  )
on conflict (locale, slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  image_url = excluded.image_url,
  category = excluded.category,
  author = excluded.author,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();


select slug, locale, status, char_length(content) as content_len, published_at
from public.blog_posts
where slug in (
  'istanbul-yazilim-sirketleri','ozel-yazilim-nedir','crm-yazilimi-nedir','erp-yazilimi-nedir','web-yazilim-nedir'
)
order by published_at desc;
