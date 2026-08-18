export const DEPLOYMENT_STEPS = [
  { key: 'queued', label: 'Sıraya alındı', progress: 0 },
  { key: 'preparing', label: 'Hazırlanıyor', progress: 5 },
  { key: 'dependencies', label: 'Bağımlılıklar hazırlanıyor', progress: 15 },
  { key: 'tests', label: 'Testler çalıştırılıyor', progress: 30 },
  { key: 'build', label: 'Build alınıyor', progress: 50 },
  { key: 'deploy', label: 'Sunucuya aktarılıyor', progress: 75 },
  { key: 'restart', label: 'Restart ediliyor', progress: 85 },
  { key: 'health', label: 'Health check', progress: 95 },
  { key: 'completed', label: 'Tamamlandı', progress: 100 },
] as const

export type DeploymentStep = (typeof DEPLOYMENT_STEPS)[number]
export type DeploymentStepTone = 'complete' | 'active' | 'pending' | 'failed'

export const DEPLOYMENT_PROGRESS = Object.fromEntries(
  DEPLOYMENT_STEPS.map((step) => [step.key, step.progress]),
) as Record<DeploymentStep['key'], number>

export function nextStepProgress(index: number) {
  return DEPLOYMENT_STEPS[index + 1]?.progress ?? 101
}

export function displayProgress(progress: number, succeeded: boolean) {
  if (succeeded || progress >= 100) return DEPLOYMENT_PROGRESS.completed
  for (let index = DEPLOYMENT_STEPS.length - 1; index >= 0; index -= 1) {
    if (progress >= DEPLOYMENT_STEPS[index].progress) return DEPLOYMENT_STEPS[index].progress
  }
  return DEPLOYMENT_PROGRESS.queued
}

export function deploymentStepTone({
  progress,
  stepProgress,
  nextProgress,
  failed,
  succeeded,
}: {
  progress: number
  stepProgress: number
  nextProgress: number
  failed: boolean
  succeeded: boolean
}): DeploymentStepTone {
  if (succeeded) return 'complete'
  const current = (progress >= stepProgress && progress < nextProgress)
    || (progress === 0 && stepProgress === 0)
  if (failed && current) return 'failed'
  if (current) return 'active'
  if (progress > stepProgress) return 'complete'
  return 'pending'
}

export function stepToneVisual(tone: DeploymentStepTone) {
  if (tone === 'complete') {
    return { mark: '✓', className: 'text-green-700' }
  }
  if (tone === 'failed') {
    return { mark: '✕', className: 'text-destructive' }
  }
  if (tone === 'active') {
    return { mark: '→', className: 'font-semibold text-accent' }
  }
  return { mark: '○', className: 'text-muted-foreground' }
}
