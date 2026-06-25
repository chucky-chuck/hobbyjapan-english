import { getAllBooks, getIncomingBooks } from '@/sanity/queries'
import { formatReleaseDate } from '@/lib/dates'
import { SERIES_DESCRIPTIONS, seriesPath } from '@/lib/series'
import { getSiteUrl } from '@/lib/site'

export const revalidate = 3600

const siteUrl = getSiteUrl()

export async function GET() {
  const [books, incomingBooks] = await Promise.all([getAllBooks(), getIncomingBooks()])

  const bySeriesMap = new Map<string, typeof books>()
  for (const book of books) {
    if (!bySeriesMap.has(book.series)) bySeriesMap.set(book.series, [])
    bySeriesMap.get(book.series)!.push(book)
  }

  const incomingSection =
    incomingBooks.length > 0
      ? `## [Incoming Publications](${siteUrl}/incoming)\n\nUpcoming English releases before they go on sale.\n\n${incomingBooks
          .map((b) => {
            const date = b.releaseDate ? formatReleaseDate(b.releaseDate) : 'Release date TBA'
            return `- [${b.title}](${siteUrl}/books/${b.slug.current}) (${b.series}, ${date})`
          })
          .join('\n')}`
      : ''

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
- [Incoming publications](${siteUrl}/incoming)
- [Sitemap](${siteUrl}/sitemap.xml)

${incomingSection ? `${incomingSection}\n\n` : ''}${seriesSections.join('\n\n')}
`

  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
