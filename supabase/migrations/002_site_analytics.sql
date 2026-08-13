create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  visitor_id text not null,
  session_id text not null,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);
create index if not exists page_views_visitor_id_idx on public.page_views (visitor_id);
create index if not exists page_views_session_id_idx on public.page_views (session_id);

alter table public.page_views enable row level security;

revoke all on public.page_views from anon, authenticated;
grant select on public.page_views to authenticated;

drop policy if exists "Admins can read analytics" on public.page_views;
create policy "Admins can read analytics" on public.page_views
for select to authenticated using (public.is_admin());

create or replace function public.record_page_view(
  view_path text,
  view_visitor_id text,
  view_session_id text,
  view_referrer text default null,
  view_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if view_path is null or length(view_path) < 1 or length(view_path) > 500
    or view_path !~ '^/'
    or view_path ~ '^/(admin|api)(/|$)'
    or view_path in ('/sitemap.xml', '/robots.txt', '/favicon.ico', '/icon.svg')
    or length(view_visitor_id) < 8 or length(view_visitor_id) > 100
    or length(view_session_id) < 8 or length(view_session_id) > 100
    or coalesce(length(view_referrer), 0) > 1000
    or coalesce(length(view_user_agent), 0) > 500 then
    raise exception 'invalid analytics payload';
  end if;

  insert into public.page_views(path, visitor_id, session_id, referrer, user_agent)
  values (view_path, view_visitor_id, view_session_id, nullif(view_referrer, ''), nullif(view_user_agent, ''));
end;
$$;

revoke all on function public.record_page_view(text, text, text, text, text) from public;
grant execute on function public.record_page_view(text, text, text, text, text) to anon, authenticated;

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
    'today_views', count(*) filter (where created_at >= date_trunc('day', now())),
    'seven_day_views', count(*) filter (where created_at >= now() - interval '7 days'),
    'thirty_day_views', count(*) filter (where created_at >= now() - interval '30 days'),
    'total_views', count(*),
    'today_visitors', count(distinct visitor_id) filter (where created_at >= date_trunc('day', now())),
    'thirty_day_visitors', count(distinct visitor_id) filter (where created_at >= now() - interval '30 days'),
    'total_visitors', count(distinct visitor_id),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'views', views) order by views desc)
      from (select path, count(*) views from public.page_views group by path order by views desc limit 10) pages
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
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select jsonb_build_object(
    'seven_day_views', (select count(*) from public.page_views where created_at >= now() - interval '7 days'),
    'thirty_day_views', (select count(*) from public.page_views where created_at >= now() - interval '30 days'),
    'seven_day_visitors', (select count(distinct visitor_id) from public.page_views where created_at >= now() - interval '7 days'),
    'thirty_day_visitors', (select count(distinct visitor_id) from public.page_views where created_at >= now() - interval '30 days'),
    'daily', coalesce((
      select jsonb_agg(jsonb_build_object('date', day::date, 'views', views, 'visitors', visitors) order by day)
      from (
        select days.day, count(p.id) views, count(distinct p.visitor_id) visitors
        from generate_series(date_trunc('day', now()) - interval '29 days', date_trunc('day', now()), interval '1 day') days(day)
        left join public.page_views p on p.created_at >= days.day and p.created_at < days.day + interval '1 day'
        group by days.day order by days.day
      ) stats
    ), '[]'::jsonb),
    'top_pages', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'views', views) order by views desc)
      from (select path, count(*) views from public.page_views where created_at >= now() - interval '30 days' group by path order by views desc limit 15) pages
    ), '[]'::jsonb),
    'top_referrers', coalesce((
      select jsonb_agg(jsonb_build_object('referrer', referrer, 'views', views) order by views desc)
      from (select referrer, count(*) views from public.page_views where created_at >= now() - interval '30 days' and referrer is not null and referrer <> '' group by referrer order by views desc limit 10) refs
    ), '[]'::jsonb)
  ) into result;
  return result;
end;
$$;

revoke all on function public.get_analytics_details() from public;
grant execute on function public.get_analytics_details() to authenticated;
