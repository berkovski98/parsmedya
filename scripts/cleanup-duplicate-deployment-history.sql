-- =============================================================================
-- MANUAL CLEANUP (DO NOT auto-run) — duplicate 1.1.9 successful installs
-- =============================================================================
-- Purpose: identify duplicate successful install rows for the same commit_sha
-- (or same version with different timestamps) without deleting anything yet.
--
-- Run these SELECTs first in Supabase SQL Editor. Review results. Only then
-- decide whether to keep the earliest success and mark later duplicates.
-- =============================================================================

-- 1) Successful installs grouped by commit (true duplicate candidate)
select
  commit_sha,
  count(*) as row_count,
  array_agg(id order by started_at) as ids,
  array_agg(version order by started_at) as versions,
  array_agg(started_at order by started_at) as started_ats,
  array_agg(coalesce(action_type, 'install') order by started_at) as action_types
from public.deployment_history
where status = 'success'
  and coalesce(action_type, 'install') = 'install'
  and commit_sha is not null
  and commit_sha <> ''
group by commit_sha
having count(*) > 1
order by max(started_at) desc;

-- 2) Version 1.1.9 successes (the reported duplicate pair)
select
  id,
  version,
  build,
  commit_sha,
  coalesce(action_type, 'install') as action_type,
  status,
  started_at,
  completed_at,
  workflow_run_id
from public.deployment_history
where version = '1.1.9'
  and status = 'success'
order by started_at asc;

-- 3) OPTIONAL cleanup (ONLY after reviewing #1 and #2):
-- Keep the earliest successful install per commit; soft-mark later duplicates
-- as failed with an explicit note. Prefer this over DELETE.
--
-- begin;
-- with ranked as (
--   select
--     id,
--     row_number() over (
--       partition by commit_sha
--       order by started_at asc, completed_at asc nulls last
--     ) as rn
--   from public.deployment_history
--   where status = 'success'
--     and coalesce(action_type, 'install') = 'install'
--     and commit_sha is not null
--     and commit_sha <> ''
-- )
-- update public.deployment_history d
-- set
--   status = 'failed',
--   error_message = coalesce(d.error_message, '') ||
--     case when coalesce(d.error_message, '') = '' then '' else ' | ' end ||
--     'Duplicate install suppressed (same commit already succeeded).',
--   completed_at = coalesce(d.completed_at, now())
-- from ranked r
-- where d.id = r.id
--   and r.rn > 1;
-- -- Review the UPDATE count, then:
-- -- commit;
-- -- or: rollback;
