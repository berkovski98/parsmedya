alter table if exists public.page_views
  add column if not exists locale text not null default 'tr',
  add column if not exists event_type text not null default 'page_view';

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  visitor_id text not null,
  session_id text not null,
  referrer text,
  user_agent text,
  locale text not null default 'tr',
  event_type text not null default 'page_view',
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);
create index if not exists page_views_visitor_id_idx on public.page_views (visitor_id);
create index if not exists page_views_locale_idx on public.page_views (locale);

update public.page_views
set locale = case when path = '/en' or path like '/en/%' then 'en' else 'tr' end
where locale is null or locale = '';

alter table public.page_views enable row level security;

revoke all on public.page_views from anon, authenticated;
grant select on public.page_views to authenticated;

drop policy if exists "Admins can read analytics" on public.page_views;
create policy "Admins can read analytics" on public.page_views
for select to authenticated using (public.is_admin());

drop policy if exists "Public cannot read analytics" on public.page_views;

create or replace function public.istanbul_day_start(moment timestamptz default now())
returns timestamptz
language sql
stable
as $$
  select date_trunc('day', timezone('Europe/Istanbul', moment)) at time zone 'Europe/Istanbul';
$$;

drop function if exists public.record_page_view(text, text, text, text, text);
drop function if exists public.record_page_view(text, text, text, text, text, text);

create or replace function public.record_page_view(
  view_path text,
  view_visitor_id text,
  view_session_id text,
  view_referrer text default null,
  view_user_agent text default null,
  view_locale text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_path text;
  resolved_locale text;
begin
  normalized_path := split_part(split_part(coalesce(view_path, ''), '#', 1), '?', 1);
  if right(normalized_path, 1) = '/' and length(normalized_path) > 1 then
    normalized_path := left(normalized_path, length(normalized_path) - 1);
  end if;

  resolved_locale := case
    when view_locale in ('tr', 'en') then view_locale
    when normalized_path = '/en' or normalized_path like '/en/%' then 'en'
    else 'tr'
  end;

  if normalized_path is null or length(normalized_path) < 1 or length(normalized_path) > 500
    or normalized_path !~ '^/'
    or normalized_path ~ '^/(admin|api|_next|sitemaps)(/|$)'
    or normalized_path in ('/sitemap.xml', '/sitemap-en.xml', '/sitemap-tr.xml', '/robots.txt', '/favicon.ico', '/icon.svg')
    or length(view_visitor_id) < 8 or length(view_visitor_id) > 100
    or length(view_session_id) < 8 or length(view_session_id) > 100
    or coalesce(length(view_referrer), 0) > 1000
    or coalesce(length(view_user_agent), 0) > 500 then
    raise exception 'invalid analytics payload';
  end if;

  insert into public.page_views(path, visitor_id, session_id, referrer, user_agent, locale, event_type)
  values (
    normalized_path,
    view_visitor_id,
    view_session_id,
    nullif(split_part(coalesce(view_referrer, ''), '?', 1), ''),
    nullif(view_user_agent, ''),
    resolved_locale,
    'page_view'
  );

  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.record_page_view(text, text, text, text, text, text) from public;
grant execute on function public.record_page_view(text, text, text, text, text, text) to anon, authenticated;

create or replace function public.get_analytics_summary()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select jsonb_build_object(
    'today_views', count(*) filter (where created_at >= public.istanbul_day_start()),
    'seven_day_views', count(*) filter (where created_at >= now() - interval '7 days'),
    'thirty_day_views', count(*) filter (where created_at >= now() - interval '30 days'),
    'total_views', count(*),
    'today_visitors', count(distinct visitor_id) filter (where created_at >= public.istanbul_day_start()),
    'thirty_day_visitors', count(distinct visitor_id) filter (where created_at >= now() - interval '30 days'),
    'total_visitors', count(distinct visitor_id),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'views', views, 'visitors', visitors) order by views desc)
      from (
        select path, count(*) views, count(distinct visitor_id) visitors
        from public.page_views
        group by path
        order by views desc
        limit 10
      ) pages
    ), '[]'::jsonb)
  ) into result from public.page_views;
  return result;
end;
$$;

revoke all on function public.get_analytics_summary() from public;
grant execute on function public.get_analytics_summary() to authenticated;

create or replace function public.get_analytics_details()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare result jsonb;
declare day_start timestamp;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  day_start := date_trunc('day', timezone('Europe/Istanbul', now()));
  select jsonb_build_object(
    'seven_day_views', (select count(*) from public.page_views where created_at >= now() - interval '7 days'),
    'thirty_day_views', (select count(*) from public.page_views where created_at >= now() - interval '30 days'),
    'seven_day_visitors', (select count(distinct visitor_id) from public.page_views where created_at >= now() - interval '7 days'),
    'thirty_day_visitors', (select count(distinct visitor_id) from public.page_views where created_at >= now() - interval '30 days'),
    'tr_views', (select count(*) from public.page_views where created_at >= now() - interval '30 days' and locale = 'tr'),
    'tr_visitors', (select count(distinct visitor_id) from public.page_views where created_at >= now() - interval '30 days' and locale = 'tr'),
    'en_views', (select count(*) from public.page_views where created_at >= now() - interval '30 days' and locale = 'en'),
    'en_visitors', (select count(distinct visitor_id) from public.page_views where created_at >= now() - interval '30 days' and locale = 'en'),
    'tracking_started_at', (select min(created_at) from public.page_views),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('date', to_char(day, 'YYYY-MM-DD'), 'views', views, 'visitors', visitors) order by day)
      from (
        select days.day, count(p.id) views, count(distinct p.visitor_id) visitors
        from generate_series(day_start - interval '29 days', day_start, interval '1 day') days(day)
        left join public.page_views p
          on timezone('Europe/Istanbul', p.created_at) >= days.day
         and timezone('Europe/Istanbul', p.created_at) < days.day + interval '1 day'
        group by days.day
        order by days.day
      ) stats
    ), '[]'::jsonb),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'views', views, 'visitors', visitors) order by views desc)
      from (
        select path, count(*) views, count(distinct visitor_id) visitors
        from public.page_views
        where created_at >= now() - interval '30 days'
        group by path
        order by views desc
        limit 15
      ) pages
    ), '[]'::jsonb),
    'traffic_sources', coalesce((
      select jsonb_agg(jsonb_build_object('source', source, 'views', views, 'visitors', visitors) order by views desc)
      from (
        select
          case
            when referrer is null or referrer = '' then 'Direct'
            when referrer ~* 'google\.' then 'Google'
            when referrer ~* 'bing\.' then 'Bing'
            else 'Diğer yönlendirmeler'
          end as source,
          count(*) views,
          count(distinct visitor_id) visitors
        from public.page_views
        where created_at >= now() - interval '30 days'
        group by 1
        order by views desc
      ) sources
    ), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

revoke all on function public.get_analytics_details() from public;
grant execute on function public.get_analytics_details() to authenticated;

notify pgrst, 'reload schema';
