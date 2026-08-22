import { hasSupabaseConfig } from '../supabase/config'
import { createClient } from '../supabase/server'
import { sameCommit } from './config'

export type DeploymentActionType = 'install' | 'rollback'

export interface HistoryRecord {
  id?: string
  version: string
  build: string
  commit_sha: string
  workflow_run_id?: string | null
  status: 'started' | 'queued' | 'in_progress' | 'success' | 'failed' | 'rolled_back'
  action_type?: DeploymentActionType
  admin_user_id?: string | null
  error_message?: string | null
}

export interface HistoryStore {
  start(record: HistoryRecord): Promise<string | null>
  finish(id: string | null, patch: Partial<HistoryRecord>): Promise<void>
  latest(): Promise<{ completed_at: string | null; status: string | null; commit_sha?: string | null } | null>
  latestSuccessful(): Promise<{ commit_sha: string | null; version?: string | null; build?: string | null; completed_at?: string | null } | null>
  hasSuccessfulCommit(sha: string): Promise<boolean>
  hasSuccessfulInstall(sha: string): Promise<boolean>
}

export const supabaseHistory: HistoryStore = {
  async start(record) {
    if (!hasSupabaseConfig()) return null
    try {
      const supabase = await createClient()
      const actionType: DeploymentActionType = record.action_type || 'install'

      // Normal install: do not insert another success/queued row for the same commit.
      if (actionType === 'install' && record.commit_sha) {
        const { data: existing } = await supabase
          .from('deployment_history')
          .select('id,status,action_type')
          .eq('commit_sha', record.commit_sha)
          .in('status', ['queued', 'in_progress', 'started', 'success'])
          .limit(20)

        const duplicate = (existing || []).find((row) => {
          const rowAction = (row.action_type as string | null) || 'install'
          if (rowAction !== 'install') return false
          if (row.status === 'success') return true
          return row.status === 'queued' || row.status === 'in_progress' || row.status === 'started'
        })
        if (duplicate?.id) return duplicate.id
      }

      const { data } = await supabase.from('deployment_history').insert({
        version: record.version,
        build: record.build,
        commit_sha: record.commit_sha,
        workflow_run_id: record.workflow_run_id || null,
        status: record.status,
        action_type: actionType,
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
        action_type: patch.action_type,
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
        .select('commit_sha,version,build,completed_at')
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
  async hasSuccessfulInstall(sha) {
    if (!sha || !hasSupabaseConfig()) return false
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('deployment_history')
        .select('id,commit_sha,action_type')
        .eq('status', 'success')
        .eq('commit_sha', sha)
        .limit(20)
      return (data || []).some((row) => {
        const action = (row.action_type as string | null) || 'install'
        return action === 'install' && sameCommit(String(row.commit_sha || ''), sha)
      })
    } catch {
      return false
    }
  },
}
