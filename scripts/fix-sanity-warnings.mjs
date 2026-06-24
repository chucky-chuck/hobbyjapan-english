/**
 * Fix Sanity Studio warnings:
 * - Add _key (and _type) to amazonLinks array items
 *
 * Usage:
 *   node scripts/fix-sanity-warnings.mjs
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local')
  process.exit(1)
}

function amazonLinksWithKeys(links) {
  if (!links?.length) return links
  return links.map((link) => ({
    _type: 'amazonLink',
    _key: link._key || `amazon-${String(link.region).toLowerCase()}`,
    region: link.region,
    url: link.url,
  }))
}

async function fixSanityWarnings() {
  const books = await client.fetch(`*[_type == "book"] { _id, title, amazonLinks }`)
  let fixed = 0

  for (const book of books) {
    if (!book.amazonLinks?.length) continue

    const needsKeys = book.amazonLinks.some((link) => !link._key)
    if (!needsKeys) continue

    const amazonLinks = amazonLinksWithKeys(book.amazonLinks)

    await client.patch(book._id).set({ amazonLinks }).commit()
    fixed += 1
    console.log(`Fixed keys: ${book.title}`)
  }

  console.log(`\nDone. Fixed ${fixed}/${books.length} books.`)
}

fixSanityWarnings().catch((err) => {
  console.error('Fix failed:', err.message)
  process.exit(1)
})
