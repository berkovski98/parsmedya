-- deployment_history: action_type + protect duplicate successful installs of the same commit
alter table public.deployment_history
  add column if not exists action_type text not null default 'install';

alter table public.deployment_history
  drop constraint if exists deployment_history_action_type_check;

alter table public.deployment_history
  add constraint deployment_history_action_type_check
  check (action_type in ('install', 'rollback'));

create index if not exists deployment_history_action_type_idx
  on public.deployment_history (action_type, started_at desc);

-- Unique successful install per commit only when no duplicates currently exist.
-- If duplicates already exist, run scripts/cleanup-duplicate-deployment-history.sql first.
do $$
begin
  if exists (
    select 1
    from public.deployment_history
    where status = 'success'
      and action_type = 'install'
      and commit_sha is not null
      and commit_sha <> ''
    group by commit_sha
    having count(*) > 1
  ) then
    raise notice 'Skipping unique index: duplicate successful installs exist. Clean up first.';
  else
    create unique index if not exists deployment_history_success_install_commit_uidx
      on public.deployment_history (commit_sha)
      where status = 'success'
        and action_type = 'install'
        and commit_sha is not null
        and commit_sha <> '';
  end if;
end $$;
