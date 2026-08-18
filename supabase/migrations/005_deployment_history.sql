create table if not exists public.deployment_history (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  build text,
  commit_sha text,
  status text not null check (status in ('started', 'success', 'failed', 'rolled_back')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  admin_user_id uuid references public.admin_users(user_id) on delete set null,
  error_message text,
  backup_id text
);

create index if not exists deployment_history_started_at_idx
  on public.deployment_history (started_at desc);

alter table public.deployment_history enable row level security;

revoke all on table public.deployment_history from anon, public;
grant select, insert, update on table public.deployment_history to authenticated;

drop policy if exists "Admins can read deployment history" on public.deployment_history;
create policy "Admins can read deployment history" on public.deployment_history
for select to authenticated using (public.is_admin());

drop policy if exists "Admins can insert deployment history" on public.deployment_history;
create policy "Admins can insert deployment history" on public.deployment_history
for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can update deployment history" on public.deployment_history;
create policy "Admins can update deployment history" on public.deployment_history
for update to authenticated using (public.is_admin()) with check (public.is_admin());
