export type DeployDialog = 'install' | 'rollback' | null

export function isExplicitConfirmation(value: unknown) {
  return value === true
}

export function openDeployDialog(kind: Exclude<DeployDialog, null>) {
  return { dialog: kind, dispatch: false as const, progress: false as const }
}

export function cancelDeployDialog() {
  return { dialog: null, dispatch: false as const, progress: false as const }
}

export function confirmDeployDialog(dialog: DeployDialog) {
  if (!dialog) return { dialog: null, dispatch: false as const, progress: false as const }
  return { dialog: null, dispatch: true as const, progress: true as const }
}

export function countDispatches(events: Array<'open-install' | 'open-rollback' | 'cancel' | 'confirm'>) {
  let dialog: DeployDialog = null
  let dispatched = 0
  let progress = false
  for (const event of events) {
    if (event === 'open-install') {
      ({ dialog } = openDeployDialog('install'))
    } else if (event === 'open-rollback') {
      ({ dialog } = openDeployDialog('rollback'))
    } else if (event === 'cancel') {
      const next = cancelDeployDialog()
      dialog = next.dialog
    } else if (event === 'confirm') {
      const next = confirmDeployDialog(dialog)
      dialog = next.dialog
      if (next.dispatch) dispatched += 1
      if (next.progress) progress = true
    }
  }
  return { dispatched, progress, dialog }
}
