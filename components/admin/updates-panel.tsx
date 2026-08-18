'use client'

import { useState } from 'react'

type CheckData = {
  currentVersion: string
  latestVersion: string
  updateAvailable: boolean
  releaseDate: string
  releaseNotes: string
  assetName: string
  assetSize: number
  sha256: string
  requiresMigration: boolean
}

type StatusData = {
  version: string
  build: string
  environment: string
  nodeVersion: string
  lastDeployment: string | null
  lastDeploymentStatus: string | null
  backupCount: number
  backups: { id: string; version: string; createdAt: string }[]
}

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: { code: string; message: string } }

export function UpdatesPanel({
  initialCheck,
  initialStatus,
  initialError = '',
}: {
  initialCheck: CheckData | null
  initialStatus: StatusData | null
  initialError?: string
}) {
  const [check, setCheck] = useState<CheckData | null>(initialCheck)
  const [status, setStatus] = useState<StatusData | null>(initialStatus)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(initialError)
  const [busy, setBusy] = useState(false)

  async function load() {
    const [checkRes, statusRes] = await Promise.all([
      fetch('/api/system/update/check', { cache: 'no-store' }),
      fetch('/api/system/update/status', { cache: 'no-store' }),
    ])
    const checkJson = await checkRes.json() as ApiResponse<CheckData>
    const statusJson = await statusRes.json() as ApiResponse<StatusData>
    if (checkJson.ok) setCheck(checkJson.data)
    else setError(checkJson.error.message)
    if (statusJson.ok) setStatus(statusJson.data)
  }

  async function install() {
    if (!check?.latestVersion) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/system/update/install', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ version: check.latestVersion }),
      })
      const json = await response.json() as ApiResponse<{ version: string }>
      if (!json.ok) setError(json.error.message)
      else setMessage(`Sürüm ${json.data.version} uygulandı.`)
      await load()
    } catch {
      setError('Güncelleme uygulanamadı.')
    } finally {
      setBusy(false)
    }
  }

  async function rollback(backupId: string) {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/system/update/rollback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ backupId }),
      })
      const json = await response.json() as ApiResponse<{ version: string }>
      if (!json.ok) setError(json.error.message)
      else setMessage(`Yedek ${json.data.version} geri yüklendi.`)
      await load()
    } catch {
      setError('Geri alma uygulanamadı.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-bold">Güncellemeler</h1>
      <p className="mt-2 text-muted-foreground">Sunucu tarafı güncelleme API’si üzerinden sürüm, yedek ve geri alma işlemlerini yönetin.</p>
      {error && <p role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {message && <p className="mt-6 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-800">{message}</p>}
      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Mevcut durum</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Sürüm" value={status?.version || check?.currentVersion || '—'} />
            <Row label="Build" value={status?.build || '—'} />
            <Row label="Ortam" value={status?.environment || 'production'} />
            <Row label="Node" value={status?.nodeVersion || '—'} />
            <Row label="Son dağıtım" value={status?.lastDeployment || '—'} />
            <Row label="Son durum" value={status?.lastDeploymentStatus || '—'} />
            <Row label="Yedek sayısı" value={String(status?.backupCount ?? 0)} />
          </dl>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold">Yeni sürüm</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Son sürüm" value={check?.latestVersion || '—'} />
            <Row label="Paket" value={check?.assetName || '—'} />
            <Row label="Tarih" value={check?.releaseDate || '—'} />
            <Row label="Migration" value={check?.requiresMigration ? 'Gerekebilir' : 'Hayır'} />
          </dl>
          {check?.releaseNotes && <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-secondary/60 p-3 text-xs">{check.releaseNotes}</pre>}
          <button
            disabled={busy || !check?.updateAvailable}
            onClick={install}
            className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? 'İşleniyor…' : check?.updateAvailable ? `${check.latestVersion} sürümünü kur` : 'Güncelleme yok'}
          </button>
        </div>
      </section>
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Yedekler</h2>
        <div className="mt-4 divide-y divide-border">
          {(status?.backups || []).map((backup) => (
            <div key={backup.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <div>
                <p className="font-medium">{backup.version}</p>
                <p className="text-xs text-muted-foreground">{backup.id}</p>
              </div>
              <button
                disabled={busy}
                onClick={() => rollback(backup.id)}
                className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50"
              >
                Geri al
              </button>
            </div>
          ))}
          {!status?.backups?.length && <p className="py-4 text-sm text-muted-foreground">Kayıtlı yedek yok.</p>}
        </div>
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
