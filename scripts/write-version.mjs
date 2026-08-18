import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const candidateFile = path.join(root, 'release-candidate.json')
const outputFile = path.join(root, 'version.candidate.json')

let manifest = {}
try {
  manifest = JSON.parse(await readFile(candidateFile, 'utf8'))
} catch {
  // Candidate manifest is optional; commit SHA still identifies the update.
}

const notes = Array.isArray(manifest.releaseNotes)
  ? manifest.releaseNotes.filter((item) => typeof item === 'string')
  : []

const next = {
  version: typeof manifest.version === 'string' && manifest.version ? manifest.version : '0.0.0',
  commit: process.env.GITHUB_SHA || '',
  releaseTitle: typeof manifest.releaseTitle === 'string' ? manifest.releaseTitle : '',
  releaseNotes: notes,
}

await mkdir(path.dirname(outputFile), { recursive: true })
await writeFile(outputFile, `${JSON.stringify(next, null, 2)}\n`)
console.log(`Wrote version.candidate.json ${next.version} ${next.commit.slice(0, 7)}`)
