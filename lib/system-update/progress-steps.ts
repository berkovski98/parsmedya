export type JobStepLike = {
  name: string
  status: string
  conclusion: string | null
}

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
export type DeploymentStepKey = DeploymentStep['key']
export type DeploymentStepTone = 'complete' | 'active' | 'pending' | 'failed'
export type SubstepState = DeploymentStepTone

export const DEPLOYMENT_PROGRESS = Object.fromEntries(
  DEPLOYMENT_STEPS.map((step) => [step.key, step.progress]),
) as Record<DeploymentStepKey, number>

export type WorkflowSubstep = {
  phase: Exclude<DeploymentStepKey, 'queued' | 'completed'>
  name: string
  label: string
  test: RegExp
}

export const WORKFLOW_SUBSTEPS: WorkflowSubstep[] = [
  { phase: 'preparing', name: 'Validate deploy SHA', label: 'Deploy SHA doğrulanıyor', test: /validate deploy/i },
  { phase: 'preparing', name: 'Checkout repository', label: 'Depo çekiliyor', test: /checkout repository|^checkout$/i },
  { phase: 'dependencies', name: 'Setup Node.js', label: 'Node.js hazırlanıyor', test: /setup node/i },
  { phase: 'dependencies', name: 'Enable pnpm', label: 'pnpm hazırlanıyor', test: /enable pnpm|corepack/i },
  { phase: 'dependencies', name: 'Install dependencies', label: 'Paketler yükleniyor', test: /install dependenc|frozen-lockfile/i },
  { phase: 'dependencies', name: 'Write version candidate', label: 'Aday sürüm hazırlanıyor', test: /write version/i },
  { phase: 'tests', name: 'Run tests', label: 'Testler çalıştırılıyor', test: /run tests|pnpm test/i },
  { phase: 'tests', name: 'Run lint', label: 'Lint çalıştırılıyor', test: /run lint|pnpm lint/i },
  { phase: 'build', name: 'Production build', label: 'Next.js production build çalışıyor', test: /production build|pnpm build/i },
  { phase: 'build', name: 'Prepare standalone deploy directory', label: 'Standalone paket hazırlanıyor', test: /prepare standalone|prepare-deploy/i },
  { phase: 'deploy', name: 'Upload to staging', label: 'Dosyalar sunucuya aktarılıyor', test: /upload to staging|upload|scp|sftp/i },
  { phase: 'deploy', name: 'Promote files to production', label: 'Dosyalar yerleştiriliyor', test: /promote files|rsync/i },
  { phase: 'restart', name: 'Restart Passenger', label: 'Passenger yeniden başlatılıyor', test: /restart passenger|touch .*restart/i },
  { phase: 'health', name: 'Health check /', label: '/', test: /health check \/$/i },
  { phase: 'health', name: 'Health check /en', label: '/en', test: /health check \/en/i },
  { phase: 'health', name: 'Health check /sitemap.xml', label: '/sitemap.xml', test: /health check \/sitemap\.xml/i },
  { phase: 'health', name: 'Health check /robots.txt', label: '/robots.txt', test: /health check \/robots/i },
  { phase: 'health', name: 'Health check /admin/login', label: '/admin/login', test: /health check \/admin\/login/i },
]

const IGNORED_STEP = /^(set up job|complete job|complete runner|announce job|post )/i

export function isIgnoredJobStep(name: string) {
  return IGNORED_STEP.test(name.trim())
}

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
    return { mark: '→', className: 'font-bold text-accent' }
  }
  return { mark: '○', className: 'text-muted-foreground' }
}

export type PhaseSubstep = {
  label: string
  state: SubstepState
}

export type PhaseMeasurement = {
  phase: DeploymentStepKey
  overallProgress: number
  stepProgress: number
  stepLabel: string
  stepDetail: string
  completedSubsteps: number
  totalSubsteps: number
  substeps: PhaseSubstep[]
}

function matchSubstep(stepName: string) {
  const exact = WORKFLOW_SUBSTEPS.find((item) => item.name.toLowerCase() === stepName.toLowerCase())
  if (exact) return exact
  return WORKFLOW_SUBSTEPS.find((item) => item.test.test(stepName)) || null
}

function jobState(job?: JobStepLike | null): SubstepState {
  if (!job) return 'pending'
  if (job.conclusion === 'failure' || job.conclusion === 'cancelled') return 'failed'
  if (job.conclusion === 'success') return 'complete'
  if (job.status === 'in_progress') return 'active'
  return 'pending'
}

function findJob(steps: JobStepLike[], def: WorkflowSubstep) {
  return steps.find((step) => step.name === def.name || def.test.test(step.name))
}

export function relevantJobSteps(steps: JobStepLike[]) {
  return steps.filter((step) => step.name && !isIgnoredJobStep(step.name))
}

export function measurePhase(phase: DeploymentStepKey, steps: JobStepLike[]): PhaseMeasurement {
  const step = DEPLOYMENT_STEPS.find((item) => item.key === phase) || DEPLOYMENT_STEPS[0]
  const defs = WORKFLOW_SUBSTEPS.filter((item) => item.phase === phase)
  const hasExact = defs.some((def) => steps.some((job) => job.name === def.name))
  const useDefs = hasExact ? defs : defs.filter((def) => findJob(steps, def))
  const substeps = useDefs.map((def) => ({
    label: def.label,
    state: jobState(findJob(steps, def)),
  }))
  const completedSubsteps = substeps.filter((item) => item.state === 'complete').length
  const totalSubsteps = substeps.length
  const active = substeps.find((item) => item.state === 'active' || item.state === 'failed')
  const stepProgress = totalSubsteps === 0 ? 0 : Math.round((completedSubsteps / totalSubsteps) * 100)
  return {
    phase,
    overallProgress: step.progress,
    stepProgress,
    stepLabel: step.label,
    stepDetail: active?.label || (completedSubsteps > 0 && completedSubsteps < totalSubsteps
      ? useDefs[completedSubsteps]?.label || ''
      : ''),
    completedSubsteps,
    totalSubsteps,
    substeps,
  }
}

export function inferPhaseFromSteps(steps: JobStepLike[]): DeploymentStepKey {
  const relevant = relevantJobSteps(steps)
  const current = [...relevant].reverse().find((step) => step.status === 'in_progress')
    || relevant.find((step) => step.status === 'queued' && step.conclusion == null)
    || [...relevant].reverse().find((step) => step.conclusion === 'failure' || step.conclusion === 'cancelled')
  if (!current) {
    const lastComplete = [...relevant].reverse().find((step) => step.conclusion === 'success')
    const mapped = lastComplete ? matchSubstep(lastComplete.name) : null
    if (!mapped) return 'preparing'
    const index = DEPLOYMENT_STEPS.findIndex((item) => item.key === mapped.phase)
    return DEPLOYMENT_STEPS[Math.min(index + 1, DEPLOYMENT_STEPS.length - 2)]?.key || mapped.phase
  }
  if (/^health check$/i.test(current.name) || /verify production sitemaps/i.test(current.name) || /confirm production version/i.test(current.name)) return 'health'
  if (/promote, restart passenger/i.test(current.name)) return 'restart'
  return matchSubstep(current.name)?.phase || 'preparing'
}

export function emptyPhaseMeasurement(phase: DeploymentStepKey = 'queued'): PhaseMeasurement {
  const step = DEPLOYMENT_STEPS.find((item) => item.key === phase) || DEPLOYMENT_STEPS[0]
  return {
    phase,
    overallProgress: step.progress,
    stepProgress: 0,
    stepLabel: step.label,
    stepDetail: '',
    completedSubsteps: 0,
    totalSubsteps: 0,
    substeps: [],
  }
}
