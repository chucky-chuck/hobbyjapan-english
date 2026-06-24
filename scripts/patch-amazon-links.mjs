/**
 * Import multi-region Amazon links from hj_english_amazon_links.xlsx into Sanity.
 *
 * Usage:
 *   node scripts/patch-amazon-links.mjs [path-to-xlsx]
 *
 * Default xlsx path: D:\Cursor\20260624_02\hj_english_amazon_links.xlsx
 */

import { createClient } from '@sanity/client'
import { config } from 'dotenv'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '../.env.local') })

const DEFAULT_XLSX = 'D:\\Cursor\\20260624_02\\hj_english_amazon_links.xlsx'

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

function extractAsin(url) {
  const match = url?.match(/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})/i)
  return match?.[1]?.toUpperCase() ?? null
}

function readExcelRows(xlsxPath) {
  const scriptPath = resolve(__dirname, 'read_amazon_xlsx.py')
  const output = execFileSync('python', [scriptPath, xlsxPath], { encoding: 'utf-8' })
  return JSON.parse(output)
}

function amazonLinksWithKeys(links) {
  return links.map((link) => ({
    _type: 'amazonLink',
    _key: `amazon-${link.region.toLowerCase()}`,
    region: link.region,
    url: link.url,
  }))
}

async function patchAmazonLinks() {
  const xlsxPath = process.argv[2] || DEFAULT_XLSX
  const rows = readExcelRows(xlsxPath)
  const byAsin = new Map(rows.map((row) => [row.asin, row]))

  const books = await client.fetch(`*[_type == "book"] { _id, title, amazonUrl }`)
  let patched = 0
  const unmatched = []

  for (const book of books) {
    const asin = extractAsin(book.amazonUrl)
    const row = asin ? byAsin.get(asin) : null

    if (!row) {
      unmatched.push({ id: book._id, title: book.title, asin })
      continue
    }

    const usLink = row.amazonLinks.find((link) => link.region === 'US')?.url

    await client
      .patch(book._id)
      .set({
        amazonLinks: amazonLinksWithKeys(row.amazonLinks),
        ...(usLink ? { amazonUrl: usLink } : {}),
      })
      .commit()

    patched += 1
    console.log(`Patched: ${book.title} (${row.hjcode}, ${row.amazonLinks.length} regions)`)
  }

  console.log(`\nDone. Patched ${patched}/${books.length} books.`)

  if (unmatched.length) {
    console.log('\nUnmatched books:')
    for (const book of unmatched) {
      console.log(`  - ${book.title} (${book.id}, ASIN: ${book.asin ?? 'none'})`)
    }
  }

  const unusedRows = rows.filter(
    (row) => !books.some((book) => extractAsin(book.amazonUrl) === row.asin),
  )
  if (unusedRows.length) {
    console.log('\nExcel rows without a matching Sanity book:')
    for (const row of unusedRows) {
      console.log(`  - ${row.hjcode} ${row.title}`)
    }
  }
}

patchAmazonLinks().catch((err) => {
  console.error('Patch failed:', err.message)
  process.exit(1)
})
