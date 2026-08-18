import { hasSupabaseConfig } from '../supabase/config'
import { createClient } from '../supabase/server'

export interface HistoryRecord {
  id?: string
  version: string
  build: string
  commit_sha: string
  workflow_run_id?: string | null
  status: 'started' | 'queued' | 'in_progress' | 'success' | 'failed' | 'rolled_back'
  admin_user_id?: string | null
  error_message?: string | null
}

export interface HistoryStore {
  start(record: HistoryRecord): Promise<string | null>
  finish(id: string | null, patch: Partial<HistoryRecord>): Promise<void>
  latest(): Promise<{ completed_at: string | null; status: string | null; commit_sha?: string | null } | null>
  latestSuccessful(): Promise<{ commit_sha: string | null } | null>
  hasSuccessfulCommit(sha: string): Promise<boolean>
}

export const supabaseHistory: HistoryStore = {
  async start(record) {
    if (!hasSupabaseConfig()) return null
    try {
      const supabase = await createClient()
      const { data } = await supabase.from('deployment_history').insert({
        version: record.version,
        build: record.build,
        commit_sha: record.commit_sha,
        workflow_run_id: record.workflow_run_id || null,
        status: record.status,
        admin_user_id: record.admin_user_id || null,
      }).select('id').maybeSingle()
      return data?.id || null
    } catch {
      return null
    }
  },
  async finish(id, patch) {
    if (!id || !hasSupabaseConfig()) return
    try {
      const supabase = await createClient()
      await supabase.from('deployment_history').update({
        status: patch.status,
        completed_at: new Date().toISOString(),
        error_message: patch.error_message || null,
        build: patch.build,
        commit_sha: patch.commit_sha,
        workflow_run_id: patch.workflow_run_id,
      }).eq('id', id)
    } catch {
      // History must not leak internals or fail the HTTP contract.
    }
  },
  async latest() {
    if (!hasSupabaseConfig()) return null
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('deployment_history')
        .select('completed_at,status,commit_sha')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      return data
    } catch {
      return null
    }
  },
  async latestSuccessful() {
    if (!hasSupabaseConfig()) return null
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('deployment_history')
        .select('commit_sha')
        .eq('status', 'success')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      return data
    } catch {
      return null
    }
  },
  async hasSuccessfulCommit(sha) {
    if (!sha || !hasSupabaseConfig()) return false
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('deployment_history')
        .select('commit_sha')
        .eq('status', 'success')
        .eq('commit_sha', sha)
        .limit(1)
        .maybeSingle()
      return Boolean(data?.commit_sha)
    } catch {
      return false
    }
  },
}
