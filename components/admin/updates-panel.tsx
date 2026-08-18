'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cancelDeployDialog, confirmDeployDialog, openDeployDialog, type DeployDialog } from '@/lib/system-update/intent'
import { displayProgress } from '@/lib/system-update/progress-steps'
import { deploymentPanelState } from '@/lib/system-update/tracking'
import { DeploymentProgressPanel } from '@/components/admin/deployment-progress'

type CheckData = {
  currentCommit: string
  latestCommit: string
  updateAvailable: boolean
  latestMessage: string
  latestDate: string
  latestAuthor: string
  currentVersion: string
  currentBuild?: string
  candidateVersion?: string
  candidateTitle?: string
  installedReleasedAt?: string
  githubReadAvailable: boolean
  githubDeployConfigured: boolean
  githubConfigured: boolean
  githubError: string | null
}

type StatusData = {
  status: 'queued' | 'in_progress' | 'completed'
  conclusion: 'success' | 'failure' | 'cancelled' | null
  phase: 'idle' | 'queued' | 'preparing' | 'dependencies' | 'tests' | 'build' | 'deploy' | 'restart' | 'health' | 'success' | 'failed'
  phaseLabel: string
  progress: number
  overallProgress?: number
  stepProgress?: number
  stepLabel?: string
  stepDetail?: string
  completedSubsteps?: number
  totalSubsteps?: number
  substeps?: { label: string; state: 'complete' | 'active' | 'pending' | 'failed' }[]
  runId: number | null
  commit: string
  startedAt: string | null
  updatedAt: string | null
  completedAt: string | null
  url: string | null
  version: string
  build: string
  currentCommit: string
  previousCommit: string
  nodeVersion: string
  errorMessage: string | null
  githubReadAvailable: boolean
  githubDeployConfigured: boolean
  githubConfigured: boolean
  isTrackedDeployment: boolean
  previousRunId: number | null
  requestedAt: string | null
  targetCommit: string | null
  installingVersion?: string | null
  installingCommit?: string | null
  lastSuccessfulDeployment?: {
    version: string
    build: string
    commit: string
    runId: number | null
    deployedAt: string | null
  }
}

type TrackState = {
  previousRunId: number
  requestedAt: string
  targetCommit: string
  trackedRunId: number | null
}

type InstallData = {
  status: string
  commit: string
  previousRunId: number
  requestedAt: string
  targetCommit: string
  phaseLabel?: string
  progress?: number
  runId?: number | null
}

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } }

const STORAGE_KEY = 'parsmedya.deploy-track'

function isActiveStatus(status?: StatusData | null) {
  return status?.status === 'queued' || status?.status === 'in_progress'
}

function readStoredTrack(): TrackState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as TrackState
    if (!parsed?.requestedAt || typeof parsed.previousRunId !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

function writeStoredTrack(track: TrackState | null) {
  try {
    if (!track) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, JSON.stringify(track))
  } catch {
    // Ignore private-mode storage failures.
  }
}

function initialTrack(status: StatusData | null): TrackState | null {
  if (status?.isTrackedDeployment && isActiveStatus(status)) {
    return {
      previousRunId: status.previousRunId ?? 0,
      requestedAt: status.requestedAt || status.startedAt || new Date().toISOString(),
      targetCommit: status.targetCommit || status.commit || '',
      trackedRunId: status.runId,
    }
  }
  return null
}

export function UpdatesPanel({
  initialCheck,
  initialStatus,
  initialError = '',
  githubReadAvailable: initialReadAvailable,
  githubDeployConfigured: initialDeployConfigured,
}: {
  initialCheck: CheckData | null
  initialStatus: StatusData | null
  initialError?: string
  githubReadAvailable: boolean
  githubDeployConfigured: boolean
}) {
  const [check, setCheck] = useState<CheckData | null>(initialCheck)
  const [status, setStatus] = useState<StatusData | null>(initialStatus)
  const [readAvailable, setReadAvailable] = useState(initialReadAvailable)
  const [deployConfigured, setDeployConfigured] = useState(initialDeployConfigured)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(initialError)
  const [checking, setChecking] = useState(false)
  const [installing, setInstalling] = useState(() => Boolean(initialStatus?.isTrackedDeployment && isActiveStatus(initialStatus)))
  const [track, setTrack] = useState<TrackState | null>(() => initialTrack(initialStatus))
  const [outcome, setOutcome] = useState<'success' | 'failure' | 'cancelled' | null>(null)
  const [dialog, setDialog] = useState<DeployDialog>(null)
  const installLock = useRef(false)
  const trackRef = useRef<TrackState | null>(initialTrack(initialStatus))

  const persistTrack = useCallback((next: TrackState | null) => {
    trackRef.current = next
    setTrack(next)
    writeStoredTrack(next)
  }, [])

  const loadCheck = useCallback(async () => {
    const checkRes = await fetch('/api/system/update/check', { cache: 'no-store' })
    const checkJson = await checkRes.json() as ApiResponse<CheckData>
    if (!checkJson.ok) {
      setError(checkJson.error.message)
      return null
    }
    setCheck(checkJson.data)
    setReadAvailable(checkJson.data.githubReadAvailable)
    setDeployConfigured(checkJson.data.githubDeployConfigured)
    if (checkJson.data.githubError) setError(checkJson.data.githubError)
    return checkJson.data
  }, [])

  const loadStatus = useCallback(async () => {
    const current = trackRef.current || readStoredTrack()
    const params = new URLSearchParams()
    if (current?.trackedRunId) params.set('runId', String(current.trackedRunId))
    if (current && current.previousRunId >= 0) params.set('previousRunId', String(current.previousRunId))
    if (current?.requestedAt) params.set('requestedAt', current.requestedAt)
    if (current?.targetCommit) params.set('targetCommit', current.targetCommit)
    const suffix = params.toString() ? `?${params}` : ''
    const statusRes = await fetch(`/api/system/update/status${suffix}`, { cache: 'no-store' })
    const statusJson = await statusRes.json() as ApiResponse<StatusData>
    if (!statusJson.ok) {
      if (statusJson.error.code !== 'GITHUB_DEPLOY_NOT_CONFIGURED') setError(statusJson.error.message)
      return null
    }
    const next = statusJson.data
    setStatus(next)
    setReadAvailable(next.githubReadAvailable)
    setDeployConfigured(next.githubDeployConfigured)

    if (next.isTrackedDeployment && next.runId && current) {
      persistTrack({ ...current, trackedRunId: next.runId })
    } else if (next.isTrackedDeployment && isActiveStatus(next) && next.runId && !current) {
      persistTrack({
        previousRunId: next.previousRunId ?? 0,
        requestedAt: next.requestedAt || next.startedAt || new Date().toISOString(),
        targetCommit: next.targetCommit || next.commit || '',
        trackedRunId: next.runId,
      })
    }

    const trackedRunId = next.runId || current?.trackedRunId || null
    if (next.isTrackedDeployment && next.status === 'completed' && next.runId && next.runId === trackedRunId) {
      const nextOutcome = next.conclusion === 'success' ? 'success' : next.conclusion === 'cancelled' ? 'cancelled' : 'failure'
      setOutcome(nextOutcome)
      setInstalling(false)
      installLock.current = false
      if (nextOutcome === 'success') {
        setMessage('Yeni sürüm aktif.')
        void loadCheck()
      }
    }
    return next
  }, [loadCheck, persistTrack])

  const panel = deploymentPanelState({
    installing,
    isTrackedDeployment: Boolean(status?.isTrackedDeployment || track),
    runId: status?.runId ?? track?.trackedRunId ?? null,
    status: status?.status || 'completed',
    conclusion: status?.conclusion || null,
    progress: status?.progress ?? 0,
    phaseLabel: status?.phaseLabel || '',
    persistedOutcome: outcome,
  })

  const polling = installing || panel.waitingForGithub || (status?.isTrackedDeployment && isActiveStatus(status))
  const statusInFlight = useRef(false)
  useEffect(() => {
    if (!polling) return
    const tick = () => {
      if (statusInFlight.current) return
      statusInFlight.current = true
      void loadStatus().finally(() => { statusInFlight.current = false })
    }
    const timer = window.setInterval(tick, 2000)
    return () => window.clearInterval(timer)
  }, [polling, loadStatus])

  function requestInstall() {
    if (!deployConfigured || installLock.current || panel.installDisabled || !check?.updateAvailable) return
    setError('')
    setDialog(openDeployDialog('install').dialog)
  }

  function requestRollback() {
    if (!deployConfigured || !status?.previousCommit || installLock.current || panel.installDisabled) return
    setError('')
    setDialog(openDeployDialog('rollback').dialog)
  }

  function closeDialog() {
    setDialog(cancelDeployDialog().dialog)
  }

  async function confirmDialog() {
    const next = confirmDeployDialog(dialog)
    if (!next.dispatch || installLock.current) return
    setDialog(next.dialog)
    if (dialog === 'install') await installConfirmed()
    if (dialog === 'rollback') await rollbackConfirmed()
  }

  async function checkUpdates() {
    setChecking(true)
    setError('')
    setMessage('')
    setOutcome(null)
    persistTrack(null)
    try {
      const next = await loadCheck()
      if (next?.latestCommit) {
        setError('')
        setMessage('Güncelleme bilgisi kontrol edildi. Kurulum başlatılmadı.')
      } else {
        setError(next?.githubError || 'Güncelleme bilgisi alınamadı.')
      }
    } catch {
      setError('Güncelleme bilgisi alınamadı.')
    } finally {
      setChecking(false)
    }
  }

  async function installConfirmed() {
    if (!deployConfigured || installLock.current || !check?.updateAvailable) return
    installLock.current = true
    setInstalling(true)
    setOutcome(null)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/system/update/install', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ confirmed: true }),
      })
      const json = await response.json() as ApiResponse<InstallData>
      if (!json.ok) {
        setError(json.error.message)
        setInstalling(false)
        installLock.current = false
        return
      }
      persistTrack({
        previousRunId: json.data.previousRunId,
        requestedAt: json.data.requestedAt,
        targetCommit: json.data.targetCommit,
        trackedRunId: null,
      })
      setStatus((current) => current ? {
        ...current,
        status: 'queued',
        conclusion: null,
        phase: 'preparing',
        phaseLabel: json.data.phaseLabel || 'Kurulum başlatılıyor',
        progress: 0,
        runId: null,
        isTrackedDeployment: true,
        previousRunId: json.data.previousRunId,
        requestedAt: json.data.requestedAt,
        targetCommit: json.data.targetCommit,
      } : current)
      setMessage('Kurulum başlatılıyor...')
      await loadStatus()
    } catch {
      setError('Güncelleme başlatılamadı.')
      setInstalling(false)
      installLock.current = false
    }
  }

  async function rollbackConfirmed() {
    if (!deployConfigured || !status?.previousCommit || installLock.current) return
    installLock.current = true
    setInstalling(true)
    setOutcome(null)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/system/update/rollback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ commitSha: status.previousCommit, confirmed: true }),
      })
      const json = await response.json() as ApiResponse<InstallData>
      if (!json.ok) {
        setError(json.error.message)
        setInstalling(false)
        installLock.current = false
        return
      }
      persistTrack({
        previousRunId: json.data.previousRunId,
        requestedAt: json.data.requestedAt,
        targetCommit: json.data.targetCommit,
        trackedRunId: null,
      })
      setMessage('Kurulum başlatılıyor...')
      await loadStatus()
    } catch {
      setError('Geri alma başlatılamadı.')
      setInstalling(false)
      installLock.current = false
    }
  }

  const failed = panel.outcome === 'failure' || panel.outcome === 'cancelled'
  const succeeded = panel.outcome === 'success'
  const progress = displayProgress(panel.progress, succeeded)

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-bold">Güncellemeler</h1>
      <p className="mt-2 text-muted-foreground">Mevcut sürüm, production’a kurulmuş son başarılı sürümdür. Production kurulumu yalnız “Güncellemeyi Kur” ile başlar.</p>
      {!deployConfigured && (
        <div role="status" className="mt-6 rounded-lg border border-border bg-secondary/60 p-4 text-sm">
          <p className="font-medium">Otomatik kurulum yapılandırılmadı.</p>
          {readAvailable && (
            <p className="mt-2 text-muted-foreground">
              Sürüm kontrolü aktif. Otomatik kurulum bağlantısı yapılandırılmadığı için güncelleme kurulamaz.
            </p>
          )}
          <p className="mt-2 text-muted-foreground">
            Yeni sürümleri kontrol edebilirsiniz. Otomatik kurulum için yetkilendirme gereklidir.
          </p>
        </div>
      )}
      {error && <p role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {message && <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-800">{message}</p>}
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Mevcut Sürüm</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Sürüm" value={status?.version || check?.currentVersion || '—'} />
            <Row label="Build" value={status?.build || check?.currentBuild || '—'} />
            <Row label="Son başarılı kurulum" value={formatDate(status?.lastSuccessfulDeployment?.deployedAt || status?.completedAt || check?.installedReleasedAt)} />
          </dl>
          {succeeded && (
            <p className="mt-4 inline-flex rounded-full border border-green-600/30 bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-800">Yeni sürüm aktif</p>
          )}
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Yeni Güncelleme</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Aday sürüm" value={check?.candidateVersion || (check?.updateAvailable ? 'Yeni güncelleme mevcut' : '—')} />
            <Row label="Durum" value={!check ? '—' : check.updateAvailable ? 'Kurulmayı bekliyor' : check.latestCommit ? 'Sistem güncel' : '—'} />
          </dl>
          {panel.show && (status?.installingVersion || check?.candidateVersion) && (installing || panel.waitingForGithub || isActiveStatus(status)) && (
            <p className="mt-4 text-sm font-medium text-accent">
              Kurulan sürüm: {status?.installingVersion || check?.candidateVersion}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              disabled={checking || installing}
              onClick={() => void checkUpdates()}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {checking ? 'Kontrol ediliyor...' : 'Güncellemeleri Kontrol Et'}
            </button>
            <button
              disabled={!deployConfigured || checking || panel.installDisabled || !check?.updateAvailable}
              onClick={requestInstall}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {installing || panel.waitingForGithub ? 'Kuruluyor...' : 'Güncellemeyi Kur'}
            </button>
          </div>
        </div>
      </section>

      {panel.show && (
        <DeploymentProgressPanel
          overallProgress={progress}
          stepProgress={status?.stepProgress ?? 0}
          stepLabel={panel.phaseLabel || status?.stepLabel || 'Güncelleme kuruluyor'}
          stepDetail={status?.stepDetail || ''}
          substeps={status?.substeps || []}
          failed={failed}
          succeeded={succeeded}
          errorMessage={status?.errorMessage}
          installingVersion={status?.installingVersion || check?.candidateVersion || null}
        />
      )}

      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Önceki sürüme dön</h2>
        <p className="mt-2 text-sm text-muted-foreground">Son başarılı sürüme geri dönülür. Kurulum yine sizin onayınızla başlar.</p>
        <p className="mt-3 text-sm font-medium">{status?.previousCommit ? 'Önceki başarılı sürüm hazır.' : 'Önceki başarılı sürüm yok.'}</p>
        <button
          disabled={!deployConfigured || checking || panel.installDisabled || !status?.previousCommit}
          onClick={requestRollback}
          className="mt-4 rounded-lg border border-border px-4 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          Önceki Sürüme Dön
        </button>
      </section>
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation" onClick={closeDialog}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="deploy-confirm-title"
            className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="deploy-confirm-title" className="font-display text-xl font-bold">
              {dialog === 'rollback' ? 'Önceki sürüme dönülsün mü?' : 'Güncelleme kurulsun mu?'}
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
              {dialog === 'rollback'
                ? 'Önceki başarılı sürüme dönülecek.\nDevam etmek istiyor musunuz?'
                : 'Yeni sürüm production ortamına kurulacak.\nDevam etmek istiyor musunuz?'}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={closeDialog} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium">
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => void confirmDialog()}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                {dialog === 'rollback' ? 'Önceki Sürüme Dön' : 'Güncellemeyi Kur'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium" title={value}>{value}</dd>
    </div>
  )
}
