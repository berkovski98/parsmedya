import {
  DEPLOYMENT_STEPS,
  deploymentStepTone,
  nextStepProgress,
  stepToneVisual,
  type PhaseSubstep,
} from '@/lib/system-update/progress-steps'

export type DeploymentProgressPanelProps = {
  overallProgress: number
  stepProgress: number
  stepLabel: string
  stepDetail: string
  substeps: PhaseSubstep[]
  failed: boolean
  succeeded: boolean
  errorMessage?: string | null
  url?: string | null
}

export function DeploymentProgressPanel({
  overallProgress,
  stepProgress,
  stepLabel,
  stepDetail,
  substeps,
  failed,
  succeeded,
  errorMessage,
  url,
}: DeploymentProgressPanelProps) {
  const progress = Math.max(0, Math.min(overallProgress, 100))
  const inner = Math.max(0, Math.min(stepProgress, 100))
  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-6">
      <div className="flex max-w-2xl items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold">
          {failed ? 'Güncelleme başarısız' : succeeded ? 'Güncelleme tamamlandı' : 'Güncelleme kuruluyor'}
        </h2>
        <span className={`text-lg font-bold tabular-nums ${failed ? 'text-destructive' : succeeded ? 'text-green-700' : 'text-accent'}`}>
          {progress}%
        </span>
      </div>
      <div className="mt-4 h-3 max-w-2xl overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all ${failed ? 'bg-destructive' : succeeded ? 'bg-green-600' : 'bg-accent'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 max-w-2xl text-sm font-medium">
        {failed ? `İşlem %${progress} aşamasında durdu.` : succeeded ? '✓ Güncelleme başarıyla tamamlandı' : stepLabel}
      </p>
      {failed && errorMessage && (
        <p className="mt-2 max-w-2xl text-sm text-destructive">{errorMessage}</p>
      )}
      <ol className="mt-6 w-full max-w-2xl space-y-2">
        {DEPLOYMENT_STEPS.map((step, index) => {
          const tone = deploymentStepTone({
            progress,
            stepProgress: step.progress,
            nextProgress: nextStepProgress(index),
            failed,
            succeeded,
          })
          const visual = stepToneVisual(tone)
          const percentClass = tone === 'active' ? `${visual.className} font-bold` : visual.className
          const showSub = tone === 'active' && !succeeded && (Boolean(stepDetail) || inner > 0 || substeps.length > 0)
          return (
            <li key={step.key} className="w-full">
              <div className={`flex w-full items-center justify-between gap-4 text-sm ${visual.className}`}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="w-4 shrink-0 text-center">{visual.mark}</span>
                  <span>{step.label}</span>
                </span>
                <span className={`w-12 shrink-0 text-right tabular-nums ${percentClass}`}>{step.progress}%</span>
              </div>
              {showSub && (
                <div className="mt-2 ml-7 space-y-2">
                  {stepDetail && (
                    <p className="text-xs text-muted-foreground">{stepDetail}</p>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${failed ? 'bg-destructive' : 'bg-accent'}`}
                        style={{ width: `${inner}%` }}
                      />
                    </div>
                    <span className={`w-10 shrink-0 text-right text-xs tabular-nums ${percentClass}`}>{inner}%</span>
                  </div>
                  {substeps.length > 0 && (
                    <ul className="space-y-1 text-xs">
                      {substeps.map((item) => (
                        <li key={item.label} className={substepClass(item.state)}>
                          {substepMark(item.state)} {item.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
      {url && (
        <p className="mt-4 text-sm">
          <a href={url} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
            GitHub Actions kaydı
          </a>
        </p>
      )}
    </section>
  )
}

function substepMark(state: PhaseSubstep['state']) {
  if (state === 'complete') return '✓'
  if (state === 'failed') return '✕'
  if (state === 'active') return '→'
  return '○'
}

function substepClass(state: PhaseSubstep['state']) {
  if (state === 'complete') return 'text-green-700'
  if (state === 'failed') return 'text-destructive'
  if (state === 'active') return 'font-bold text-accent'
  return 'text-muted-foreground'
}
