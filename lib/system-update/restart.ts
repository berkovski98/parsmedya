import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

export async function requestPassengerRestart(appRoot: string) {
  const tmp = path.join(appRoot, 'tmp')
  await mkdir(tmp, { recursive: true })
  await writeFile(/* turbopackIgnore: true */ path.join(/* turbopackIgnore: true */ tmp, 'restart.txt'), `${Date.now()}\n`)
}
