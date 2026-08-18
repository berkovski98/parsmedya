alter table public.deployment_history
  add column if not exists workflow_run_id text;

alter table public.deployment_history
  drop constraint if exists deployment_history_status_check;

alter table public.deployment_history
  add constraint deployment_history_status_check
  check (status in ('started', 'queued', 'in_progress', 'success', 'failed', 'rolled_back'));

create index if not exists deployment_history_workflow_run_id_idx
  on public.deployment_history (workflow_run_id);
