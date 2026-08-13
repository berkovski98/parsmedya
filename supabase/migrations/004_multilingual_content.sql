alter table public.blog_posts add column if not exists locale text not null default 'tr' check (locale in ('tr', 'en'));
alter table public.blog_posts add column if not exists translation_group_id uuid;
alter table public.blog_posts drop constraint if exists blog_posts_slug_key;
create unique index if not exists blog_posts_locale_slug_idx on public.blog_posts (locale, slug);
create index if not exists blog_posts_locale_status_published_idx on public.blog_posts (locale, status, published_at desc);
create index if not exists blog_posts_translation_group_idx on public.blog_posts (translation_group_id) where translation_group_id is not null;

alter table public.contact_messages add column if not exists locale text not null default 'tr' check (locale in ('tr', 'en'));
create index if not exists contact_messages_locale_created_idx on public.contact_messages (locale, created_at desc);

drop function if exists public.submit_contact_message(text, text, text, text, text, text);
create function public.submit_contact_message(contact_name text, contact_email text, contact_phone text default null, contact_company text default null, contact_subject text default null, contact_message text default null, contact_locale text default 'tr')
returns uuid language plpgsql security definer set search_path = public as $$
declare inserted_id uuid;
begin
  if char_length(trim(coalesce(contact_name, ''))) not between 1 and 120 or char_length(trim(coalesce(contact_email, ''))) not between 3 and 254 or char_length(trim(coalesce(contact_message, ''))) not between 1 and 5000 or contact_email !~* '^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$' or char_length(coalesce(contact_phone, '')) > 40 or char_length(coalesce(contact_company, '')) > 150 or char_length(coalesce(contact_subject, '')) > 200 or contact_locale not in ('tr', 'en') then raise exception 'Invalid contact submission'; end if;
  insert into public.contact_messages (name, email, phone, company, subject, message, locale) values (trim(contact_name), lower(trim(contact_email)), nullif(trim(contact_phone), ''), nullif(trim(contact_company), ''), nullif(trim(contact_subject), ''), trim(contact_message), contact_locale) returning id into inserted_id;
  return inserted_id;
end; $$;
revoke all on function public.submit_contact_message(text, text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text, text, text, text) to anon, authenticated;
