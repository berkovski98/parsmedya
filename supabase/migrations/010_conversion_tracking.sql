-- Conversion tracking: contact clicks, form submissions and traffic source (UTM / referrer).
-- Additive only: no existing table, row or function is changed or removed.

create table if not exists public.site_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  event_type text not null check (event_type in ('session_start', 'whatsapp_click', 'phone_click', 'email_click', 'form_submit')),
  path text not null check (char_length(path) between 1 and 500),
  locale text not null default 'tr' check (locale in ('tr', 'en')),
  visitor_id text not null check (char_length(visitor_id) between 8 and 100),
  session_id text not null check (char_length(session_id) between 8 and 100),
  target text check (target is null or char_length(target) <= 60),
  referrer text check (referrer is null or char_length(referrer) <= 300),
  utm_source text check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium text check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 100)
);

create index if not exists site_events_created_idx on public.site_events (created_at desc);
create index if not exists site_events_type_created_idx on public.site_events (event_type, created_at desc);
create index if not exists site_events_session_idx on public.site_events (session_id);

alter table public.site_events enable row level security;
revoke all on public.site_events from anon, authenticated;
grant select on public.site_events to authenticated;

drop policy if exists "Admins can read site events" on public.site_events;
create policy "Admins can read site events" on public.site_events
for select to authenticated using (public.is_admin());

-- Public callers cannot insert directly; the Next.js API validates first and calls this function.
create or replace function public.record_site_event(
  event_name text,
  event_path text,
  event_visitor_id text,
  event_session_id text,
  event_locale text default 'tr',
  event_target text default null,
  event_referrer text default null,
  event_utm_source text default null,
  event_utm_medium text default null,
  event_utm_campaign text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if event_name not in ('session_start', 'whatsapp_click', 'phone_click', 'email_click', 'form_submit')
    or event_path is null or event_path !~ '^/' or char_length(event_path) > 500
    or event_path ~ '^/(admin|api|_next|sitemaps)(/|$)'
    or char_length(coalesce(event_visitor_id, '')) not between 8 and 100
    or char_length(coalesce(event_session_id, '')) not between 8 and 100
    or coalesce(event_locale, 'tr') not in ('tr', 'en')
    or char_length(coalesce(event_target, '')) > 60
    or char_length(coalesce(event_referrer, '')) > 300
    or char_length(coalesce(event_utm_source, '')) > 100
    or char_length(coalesce(event_utm_medium, '')) > 100
    or char_length(coalesce(event_utm_campaign, '')) > 100 then
    raise exception 'invalid site event';
  end if;

  insert into public.site_events (event_type, path, locale, visitor_id, session_id, target, referrer, utm_source, utm_medium, utm_campaign)
  values (
    event_name,
    event_path,
    coalesce(event_locale, 'tr'),
    event_visitor_id,
    event_session_id,
    nullif(event_target, ''),
    nullif(event_referrer, ''),
    nullif(lower(event_utm_source), ''),
    nullif(lower(event_utm_medium), ''),
    nullif(event_utm_campaign, '')
  );
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.record_site_event(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.record_site_event(text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

-- Where a contact request came from.
alter table public.contact_messages add column if not exists source_path text check (source_path is null or char_length(source_path) <= 500);
alter table public.contact_messages add column if not exists landing_path text check (landing_path is null or char_length(landing_path) <= 500);
alter table public.contact_messages add column if not exists referrer text check (referrer is null or char_length(referrer) <= 300);
alter table public.contact_messages add column if not exists utm_source text check (utm_source is null or char_length(utm_source) <= 100);
alter table public.contact_messages add column if not exists utm_medium text check (utm_medium is null or char_length(utm_medium) <= 100);
alter table public.contact_messages add column if not exists utm_campaign text check (utm_campaign is null or char_length(utm_campaign) <= 100);

create or replace function public.submit_contact_message_v2(
  contact_name text,
  contact_email text,
  contact_phone text default null,
  contact_company text default null,
  contact_subject text default null,
  contact_message text default null,
  contact_locale text default 'tr',
  contact_source_path text default null,
  contact_landing_path text default null,
  contact_referrer text default null,
  contact_utm_source text default null,
  contact_utm_medium text default null,
  contact_utm_campaign text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_id uuid;
begin
  if char_length(coalesce(contact_source_path, '')) > 500
    or char_length(coalesce(contact_landing_path, '')) > 500
    or char_length(coalesce(contact_referrer, '')) > 300
    or char_length(coalesce(contact_utm_source, '')) > 100
    or char_length(coalesce(contact_utm_medium, '')) > 100
    or char_length(coalesce(contact_utm_campaign, '')) > 100 then
    raise exception 'Invalid contact submission';
  end if;

  -- Reuse the existing, validated insert path.
  inserted_id := public.submit_contact_message(contact_name, contact_email, contact_phone, contact_company, contact_subject, contact_message, contact_locale);

  update public.contact_messages set
    source_path = nullif(contact_source_path, ''),
    landing_path = nullif(contact_landing_path, ''),
    referrer = nullif(contact_referrer, ''),
    utm_source = nullif(lower(contact_utm_source), ''),
    utm_medium = nullif(lower(contact_utm_medium), ''),
    utm_campaign = nullif(contact_utm_campaign, '')
  where id = inserted_id;

  return inserted_id;
end;
$$;

revoke all on function public.submit_contact_message_v2(text, text, text, text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_contact_message_v2(text, text, text, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

-- Admin summary: last 30 days of conversions and which sources produced them.
create or replace function public.get_conversion_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  since timestamptz := now() - interval '30 days';
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;

  return jsonb_build_object(
    'events', coalesce((
      select jsonb_object_agg(event_type, total)
      from (select event_type, count(*) total from public.site_events where created_at >= since group by event_type) counts
    ), '{}'::jsonb),
    'contact_messages', (select count(*) from public.contact_messages where created_at >= since),
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object('source', source, 'sessions', sessions, 'conversions', conversions) order by sessions desc)
      from (
        select
          coalesce(s.utm_source, nullif(split_part(regexp_replace(coalesce(s.referrer, ''), '^https?://(www\.)?', ''), '/', 1), ''), 'direct') as source,
          count(distinct s.session_id) as sessions,
          count(distinct c.session_id) as conversions
        from public.site_events s
        left join public.site_events c
          on c.session_id = s.session_id
         and c.event_type in ('whatsapp_click', 'phone_click', 'email_click', 'form_submit')
         and c.created_at >= since
        where s.event_type = 'session_start' and s.created_at >= since
        group by 1
        order by 2 desc
        limit 10
      ) sources
    ), '[]'::jsonb),
    'targets', coalesce((
      select jsonb_agg(jsonb_build_object('event', event_type, 'target', target, 'total', total) order by total desc)
      from (
        select event_type, coalesce(target, '-') target, count(*) total
        from public.site_events
        where created_at >= since and event_type <> 'session_start'
        group by 1, 2
        order by 3 desc
        limit 12
      ) targets
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_conversion_summary() from public;
grant execute on function public.get_conversion_summary() to authenticated;
