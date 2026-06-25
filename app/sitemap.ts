import type { MetadataRoute } from 'next'
import { getAllBooks, getIncomingBooks } from '@/sanity/queries'
import { ALL_SERIES, seriesPath } from '@/lib/series'
import { getSiteUrl } from '@/lib/site'

export const revalidate = 3600

const siteUrl = getSiteUrl()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, incomingBooks] = await Promise.all([getAllBooks(), getIncomingBooks()])

  const bookEntries: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${siteUrl}/books/${book.slug.current}`,
    lastModified: book.releaseDate ? new Date(book.releaseDate) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const seriesEntries: MetadataRoute.Sitemap = ALL_SERIES.map((series) => ({
    url: `${siteUrl}${seriesPath(series)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  const incomingEntry: MetadataRoute.Sitemap =
    incomingBooks.length > 0
      ? [
          {
            url: `${siteUrl}/incoming`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
          },
        ]
      : []

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...incomingEntry,
    ...seriesEntries,
    ...bookEntries,
  ]
}
