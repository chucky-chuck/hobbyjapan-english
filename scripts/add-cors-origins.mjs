/**
 * Add Sanity CORS origins required for embedded Studio.
 *
 * Usage:
 *   node scripts/add-cors-origins.mjs
 *
 * Requires SANITY_API_TOKEN with project write access in .env.local
 */

import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = process.env.SANITY_API_TOKEN

const ORIGINS = [
  { origin: 'https://english.hobbyjapan.co.jp', allowCredentials: true },
  { origin: 'https://hobbyjapan-english.vercel.app', allowCredentials: true },
  { origin: 'http://localhost:3000', allowCredentials: true },
  { origin: 'http://localhost:3001', allowCredentials: true },
]

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local')
  process.exit(1)
}

async function listCors() {
  const res = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`List CORS failed (${res.status}): ${await res.text()}`)
  return res.json()
}

async function addCors(origin, allowCredentials) {
  const res = await fetch(`https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ origin, allowCredentials }),
  })
  if (!res.ok) throw new Error(`Add CORS failed for ${origin} (${res.status}): ${await res.text()}`)
  return res.json()
}

async function main() {
  const existing = await listCors()
  const known = new Set(existing.map((entry) => entry.origin))

  for (const { origin, allowCredentials } of ORIGINS) {
    if (known.has(origin)) {
      console.log(`Already allowed: ${origin}`)
      continue
    }
    await addCors(origin, allowCredentials)
    console.log(`Added: ${origin}`)
  }

  console.log('\nDone. Reload Studio and try creating a book again.')
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
