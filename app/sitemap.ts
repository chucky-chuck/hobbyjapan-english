import type { MetadataRoute } from 'next'
import { getAllBooks } from '@/sanity/queries'

export const revalidate = 3600

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const books = await getAllBooks()

  const bookEntries: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${siteUrl}/books/${book.slug.current}`,
    lastModified: book.releaseDate ? new Date(book.releaseDate) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...bookEntries,
  ]
}
