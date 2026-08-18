export class UpdateError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
  ) {
    super(message)
    this.name = 'UpdateError'
  }
}

export const UPDATE_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  UPDATE_IN_PROGRESS: 'UPDATE_IN_PROGRESS',
  NO_UPDATE: 'NO_UPDATE',
  INVALID_SHA: 'INVALID_SHA',
  COMMIT_NOT_FOUND: 'COMMIT_NOT_FOUND',
  UPDATE_FAILED: 'UPDATE_FAILED',
  GITHUB_UNAVAILABLE: 'GITHUB_UNAVAILABLE',
  GITHUB_DEPLOY_NOT_CONFIGURED: 'GITHUB_DEPLOY_NOT_CONFIGURED',
  CONFIRMATION_REQUIRED: 'CONFIRMATION_REQUIRED',
} as const
