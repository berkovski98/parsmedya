create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  image_url text not null default '',
  category text not null,
  author text not null,
  seo_title text,
  seo_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts (category);

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.admin_users where user_id = check_user_id); $$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership" on public.admin_users
for select to authenticated using (user_id = auth.uid());

drop policy if exists "Public can read published posts" on public.blog_posts;
create policy "Public can read published posts" on public.blog_posts
for select to anon, authenticated using (status = 'published' or public.is_admin());
drop policy if exists "Admins can insert posts" on public.blog_posts;
create policy "Admins can insert posts" on public.blog_posts
for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins can update posts" on public.blog_posts;
create policy "Admins can update posts" on public.blog_posts
for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can delete posts" on public.blog_posts;
create policy "Admins can delete posts" on public.blog_posts
for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images', 'blog-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = excluded.public,
file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view blog images" on storage.objects;
create policy "Public can view blog images" on storage.objects for select to public
using (bucket_id = 'blog-images');
drop policy if exists "Admins can upload blog images" on storage.objects;
create policy "Admins can upload blog images" on storage.objects for insert to authenticated
with check (bucket_id = 'blog-images' and public.is_admin());
drop policy if exists "Admins can update blog images" on storage.objects;
create policy "Admins can update blog images" on storage.objects for update to authenticated
using (bucket_id = 'blog-images' and public.is_admin());
drop policy if exists "Admins can delete blog images" on storage.objects;
create policy "Admins can delete blog images" on storage.objects for delete to authenticated
using (bucket_id = 'blog-images' and public.is_admin());

insert into public.blog_posts
  (title, slug, excerpt, content, image_url, category, author, seo_title, seo_description, status, published_at)
values
  ('Dijital Pazarlama Nedir? Markalar İçin Neden Önemlidir?', 'dijital-pazarlama-nedir-markalar-icin-neden-onemlidir', 'Dijital pazarlamanın temel kanallarını, ölçülebilir büyümeye katkısını ve markaların doğru stratejiyi nasıl kurabileceğini keşfedin.', E'## Dijital pazarlamanın kapsamı\n\nDijital pazarlama; arama motorları, sosyal medya, içerik ve reklam kanalları aracılığıyla markayı doğru hedef kitleyle buluşturan çalışmaların bütünüdür. Başarılı bir yaklaşım görünür olmanın ötesinde kullanıcı ihtiyacını anlamayı ve tutarlı deneyim sunmayı gerektirir.\n\n## Ölçülebilir ve sürdürülebilir büyüme\n\nGösterim, tıklama, dönüşüm ve müşteri edinme maliyeti gibi metrikler sayesinde bütçe tahmine değil veriye göre yönetilir. Net hedefler, doğru kanal seçimi ve düzenli optimizasyon markanın sürdürülebilir büyüme elde etmesini sağlar.', '/parsmedya-hero.png', 'Dijital Pazarlama', 'Pars Medya Ekibi', 'Dijital Pazarlama Nedir ve Neden Önemlidir? | Pars Medya', 'Dijital pazarlamanın kanallarını, faydalarını ve ölçülebilir büyüme stratejisinin temellerini öğrenin.', 'published', '2026-08-12T09:00:00Z'),
  ('Kurumsal Web Sitesi İşletmelere Ne Kazandırır?', 'kurumsal-web-sitesi-isletmelere-ne-kazandirir', 'Profesyonel bir web sitesinin güven, görünürlük, satış ve operasyonel verimlilik üzerindeki etkilerini değerlendirin.', E'## Dijital dünyadaki kurumsal merkeziniz\n\nKurumsal web sitesi, içerik ve kullanıcı deneyimi üzerinde tam kontrol sağlayan en önemli dijital varlıktır. Hizmetleri, uzmanlığı ve iletişim seçeneklerini anlaşılır biçimde sunarak güven oluşturur.\n\n## Dönüşüm ve uzun vadeli büyüme\n\nHızlı, mobil uyumlu ve SEO temelleri güçlü bir site ziyaretçileri ölçülebilir iş fırsatlarına dönüştürür. Ölçeklenebilir altyapı yeni içeriklerin, entegrasyonların ve hizmetlerin kontrollü biçimde eklenmesini sağlar.', '/parsmedya-hero.png', 'Web Teknolojileri', 'Pars Medya Ekibi', 'Kurumsal Web Sitesinin İşletmelere Faydaları | Pars Medya', 'Profesyonel bir kurumsal web sitesinin güven, SEO ve dönüşüm açısından faydalarını keşfedin.', 'published', '2026-08-08T09:00:00Z'),
  ('SEO Nedir? Google’da Üst Sıralara Çıkmanın Temelleri', 'seo-nedir-googleda-ust-siralara-cikmanin-temelleri', 'Teknik SEO, içerik kalitesi ve otorite çalışmalarının arama görünürlüğünü nasıl geliştirdiğini öğrenin.', E'## SEO neyi amaçlar?\n\nArama motoru optimizasyonu, sitenin ilgili aramalarda görünür olmasını ve doğru kullanıcıları içeriğe taşımasını amaçlar. Teknik erişilebilirlik, yararlı içerik ve güvenilirlik birlikte çalışır.\n\n## Teknik temel ve içerik kalitesi\n\nMobil uyumluluk, hız, başlıklar ve canonical adresler sağlam bir temel oluşturur. Anahtar kelime araştırması kullanıcı niyetini açıklar; içerik ise bu niyete kapsamlı ve anlaşılır yanıt vermelidir.', '/parsmedya-hero.png', 'SEO', 'Pars Medya Ekibi', 'SEO Nedir? Google’da Üst Sıralara Çıkma Rehberi | Pars Medya', 'Teknik SEO, anahtar kelime, içerik ve otorite çalışmalarının temellerini inceleyin.', 'published', '2026-08-04T09:00:00Z'),
  ('Sosyal Medya Yönetiminde Başarılı Olmanın Yolları', 'sosyal-medya-yonetiminde-basarili-olmanin-yollari', 'Marka dili, içerik planı, topluluk yönetimi ve performans ölçümünü bir araya getiren yaklaşımı inceleyin.', E'## Net hedef ve tutarlı marka dili\n\nSosyal medya yönetimi yalnız düzenli paylaşım yapmak değildir. Marka bilinirliği, talep oluşturma veya topluluk geliştirme gibi hedefler netleşmeli; görsel ve sözel dil tüm kanallarda tutarlı kalmalıdır.\n\n## Planlama ve performans\n\nİçerik takvimi üretimi düzenlerken güncel gelişmelere uyum sağlayacak kadar esnek olmalıdır. Erişim yanında kaydetme, paylaşma, site trafiği ve dönüşüm metrikleri de hedeflerle birlikte izlenmelidir.', '/parsmedya-hero.png', 'Sosyal Medya', 'Pars Medya Ekibi', 'Başarılı Sosyal Medya Yönetimi İçin İpuçları | Pars Medya', 'Sosyal medya hedefi, içerik planı, marka dili ve performans ölçümü için temel ipuçları.', 'published', '2026-07-28T09:00:00Z'),
  ('Google Ads ile Doğru Hedef Kitleye Nasıl Ulaşılır?', 'google-ads-ile-dogru-hedef-kitleye-nasil-ulasilir', 'Arama niyeti, kampanya yapısı ve dönüşüm ölçümüyle reklam bütçesini daha verimli kullanmanın yollarını öğrenin.', E'## Arama niyetini doğru okumak\n\nGoogle Ads kullanıcıyı ihtiyacını araştırdığı anda yakalar. Anahtar kelimeler yalnız hacme göre değil, kullanıcının bilgi alma, karşılaştırma veya satın alma niyetine göre seçilmelidir.\n\n## Kampanya ve dönüşüm uyumu\n\nReklam mesajı ile açılış sayfası aynı beklentiyi karşılamalıdır. Form, arama veya satın alma gibi gerçek sonuçlar ölçülerek bütçe güçlü sorgulara yönlendirilir ve kampanyalar düzenli testlerle geliştirilir.', '/parsmedya-hero.png', 'Performans Pazarlama', 'Pars Medya Ekibi', 'Google Ads ile Doğru Hedef Kitleye Ulaşma | Pars Medya', 'Google Ads kampanyalarında hedef kitle, anahtar kelime ve dönüşüm takibini doğru kurun.', 'published', '2026-07-21T09:00:00Z'),
  ('Marka Kimliği Oluştururken Nelere Dikkat Edilmeli?', 'marka-kimligi-olustururken-nelere-dikkat-edilmeli', 'Marka stratejisinden görsel sisteme ve iletişim diline kadar güçlü bir kimlik oluşturmanın adımlarını keşfedin.', E'## Kimlik stratejiyle başlar\n\nMarka kimliği yalnız logo ve renk değildir. Markanın amacı, hedef kitlesi, değerleri ve rakiplerinden ayrıldığı noktalar netleşmeden kalıcı bir görsel sistem kurulamaz.\n\n## Tutarlı ve gelişime açık sistem\n\nLogo, renk, tipografi ve iletişim tonu tüm temas noktalarında ortak prensiplerle kullanılmalıdır. Marka kılavuzu bu tutarlılığı korurken sistemin yeni ihtiyaçlara kontrollü biçimde uyarlanmasını kolaylaştırır.', '/parsmedya-hero.png', 'Marka Yönetimi', 'Pars Medya Ekibi', 'Marka Kimliği Oluşturma Rehberi | Pars Medya', 'Marka stratejisi, logo, renk, tipografi ve iletişim dili için temel noktaları inceleyin.', 'published', '2026-07-14T09:00:00Z')
on conflict (slug) do nothing;
