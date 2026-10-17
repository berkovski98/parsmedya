// Generates the social share image (public/og/parsmedya-og-1200x630.jpg) and the
// web manifest icons (public/icon-192.png, public/icon-512.png) from existing brand assets.
// Run manually after a logo change: node scripts/generate-brand-assets.mjs
import { mkdir, stat } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// sharp is not a direct dependency; reuse the copy Next.js installs for image optimization.
const requireFromNext = createRequire(createRequire(import.meta.url).resolve('next/package.json'))
const sharp = requireFromNext('sharp')

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const logoPath = path.join(root, 'public', 'parsmedya-logo.png')
const outDir = path.join(root, 'public', 'og')
const outPath = path.join(outDir, 'parsmedya-og-1200x630.jpg')

const WIDTH = 1200
const HEIGHT = 630
const INK = '#101b33'
const ACCENT = '#ff6b2c'

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="85%" cy="0%" r="75%">
      <stop offset="0%" stop-color="#294775" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="${INK}"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <rect x="96" y="452" width="72" height="6" rx="3" fill="${ACCENT}"/>
  <text x="96" y="510" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="#f4f6fb">Web, Yazılım ve Dijital Dönüşüm</text>
  <text x="96" y="560" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#aab4c8">parsmedya.net</text>
</svg>`)

const logo = await sharp(logoPath).resize({ width: 760 }).png().toBuffer()

await mkdir(outDir, { recursive: true })
await sharp(background)
  .composite([{ input: logo, left: 96, top: 150 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(outPath)

const iconSvg = path.join(root, 'app', 'icon.svg')
const outputs = [outPath]
for (const size of [192, 512]) {
  const iconPath = path.join(root, 'public', `icon-${size}.png`)
  await sharp(iconSvg, { density: 1200 }).resize(size, size).png({ compressionLevel: 9 }).toFile(iconPath)
  outputs.push(iconPath)
}

for (const file of outputs) {
  const { size } = await stat(file)
  console.log(`wrote ${path.relative(root, file)} (${size} bytes)`)
}
