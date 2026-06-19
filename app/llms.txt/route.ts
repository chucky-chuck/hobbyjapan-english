import { getAllBooks } from '@/sanity/queries'
import { SERIES_DESCRIPTIONS, seriesPath } from '@/lib/series'

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export async function GET() {
  const books = await getAllBooks()

  const bySeriesMap = new Map<string, typeof books>()
  for (const book of books) {
    if (!bySeriesMap.has(book.series)) bySeriesMap.set(book.series, [])
    bySeriesMap.get(book.series)!.push(book)
  }

  const seriesSections = [...bySeriesMap.entries()].map(([series, seriesBooks]) => {
    const desc = SERIES_DESCRIPTIONS[series] ?? ''
    const bookLines = seriesBooks.map((b) => {
      const line = `- [${b.title}](${siteUrl}/books/${b.slug.current})`
      return b.description ? `${line}: ${b.description.split('\n')[0].substring(0, 120)}` : line
    })
    const seriesUrl = `${siteUrl}${seriesPath(series)}`
    return `## [${series}](${seriesUrl})\n${desc ? `${desc}\n\n` : ''}${bookLines.join('\n')}`
  })

  const text = `# Hobby Japan English Publications

> Official English-language book catalogue from Hobby Japan — covering Gunpla, scale model kits, and hobby guides.

Hobby Japan is a Japanese publisher specializing in model kits, Gunpla, and hobby guides. This site is the official catalogue of their English-language publications, covering ${books.length} titles across ${bySeriesMap.size} series.

## Key URLs

- [Full catalogue](${siteUrl}/)
- [Sitemap](${siteUrl}/sitemap.xml)

${seriesSections.join('\n\n')}
`

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
