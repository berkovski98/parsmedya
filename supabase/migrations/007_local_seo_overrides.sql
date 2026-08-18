create table if not exists public.local_seo_overrides (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'tr' check (locale in ('tr', 'en')),
  city_slug text not null,
  district_slug text not null default '',
  service_slug text not null,
  seo_title text,
  meta_description text,
  hero_title text,
  hero_description text,
  content_json jsonb,
  faq_json jsonb,
  is_indexable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, city_slug, district_slug, service_slug)
);

create index if not exists local_seo_overrides_city_idx
  on public.local_seo_overrides (city_slug, service_slug);

drop trigger if exists set_local_seo_overrides_updated_at on public.local_seo_overrides;
create trigger set_local_seo_overrides_updated_at before update on public.local_seo_overrides
for each row execute function public.set_updated_at();

alter table public.local_seo_overrides enable row level security;

drop policy if exists "Public can read indexable local seo overrides" on public.local_seo_overrides;
create policy "Public can read local seo overrides" on public.local_seo_overrides
for select to anon, authenticated using (true);

drop policy if exists "Admins can insert local seo overrides" on public.local_seo_overrides;
create policy "Admins can insert local seo overrides" on public.local_seo_overrides
for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update local seo overrides" on public.local_seo_overrides;
create policy "Admins can update local seo overrides" on public.local_seo_overrides
for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete local seo overrides" on public.local_seo_overrides;
create policy "Admins can delete local seo overrides" on public.local_seo_overrides
for delete to authenticated using (public.is_admin());
