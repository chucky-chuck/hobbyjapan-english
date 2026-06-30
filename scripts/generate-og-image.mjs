/**
 * Generates app/opengraph-image.png (1200×630) for Open Graph / social previews.
 *
 * Usage: npm run generate:og
 */

import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const WIDTH = 1200
const HEIGHT = 630
const LOGO_WIDTH = 280
const ACCENT = '#c8a84b'
const TAGS = ['Gunpla', 'Model Kits', 'Technique Guides']

const logoPath = join(root, 'public', 'hobby-japan-logo.png')
const outputPath = join(root, 'app', 'opengraph-image.png')

const logoBuffer = readFileSync(logoPath)
const logoMeta = await sharp(logoBuffer).metadata()
const logoHeight = Math.round(LOGO_WIDTH * (logoMeta.height / logoMeta.width))

const logoY = 100
const logoTitleGap = 56
const titleY = logoY + logoHeight + logoTitleGap
const subtitleY = titleY + 52
const tagsY = subtitleY + 44

function tagPills(tags, centerX, y) {
  const gap = 20
  const fontSize = 18
  const padX = 16
  const padY = 6
  const pillHeight = fontSize + padY * 2

  const widths = tags.map((tag) => tag.length * 10.5 + padX * 2)
  const totalWidth = widths.reduce((sum, w) => sum + w, 0) + gap * (tags.length - 1)
  let x = centerX - totalWidth / 2

  return tags
    .map((tag, i) => {
      const w = widths[i]
      const cx = x + w / 2
      const textY = y + padY + fontSize - 2
      const pill = `
        <rect x="${x}" y="${y}" width="${w}" height="${pillHeight}" rx="4" fill="none" stroke="#3a3a3a" stroke-width="1"/>
        <text x="${cx}" y="${textY}" font-family="Segoe UI, Arial, sans-serif" font-size="${fontSize}" fill="#999999" text-anchor="middle">${tag}</text>`
      x += w + gap
      return pill
    })
    .join('\n')
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0d0d"/>
      <stop offset="60%" stop-color="#1e1510"/>
      <stop offset="100%" stop-color="#0d0d0d"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="8" fill="${ACCENT}"/>
  <rect y="${HEIGHT - 8}" width="${WIDTH}" height="8" fill="${ACCENT}"/>
  <text x="${WIDTH / 2}" y="${titleY}"
    font-family="Segoe UI, Arial, sans-serif"
    font-size="56" font-weight="800" fill="#ffffff"
    text-anchor="middle" letter-spacing="2">English Publications</text>
  <text x="${WIDTH / 2}" y="${subtitleY}"
    font-family="Segoe UI, Arial, sans-serif"
    font-size="22" fill="#adadad"
    text-anchor="middle">Official English publications from Hobby Japan</text>
  ${tagPills(TAGS, WIDTH / 2, tagsY)}
</svg>`

const logoX = Math.round((WIDTH - LOGO_WIDTH) / 2)
const resizedLogo = await sharp(logoBuffer).resize(LOGO_WIDTH, logoHeight).png().toBuffer()

await sharp(Buffer.from(svg))
  .composite([{ input: resizedLogo, top: logoY, left: logoX }])
  .png()
  .toFile(outputPath)

console.log(`✓  Wrote ${outputPath} (${WIDTH}×${HEIGHT})`)
