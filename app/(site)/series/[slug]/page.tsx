import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllBooks } from '@/sanity/queries'
import { CatalogView } from '@/components/CatalogView'
import {
  ALL_SERIES,
  SERIES_DESCRIPTIONS,
  seriesFromSlug,
  seriesPath,
  seriesSlug,
} from '@/lib/series'

export const revalidate = 60

export async function generateStaticParams() {
  return ALL_SERIES.map((series) => ({ slug: seriesSlug(series) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const series = seriesFromSlug(slug)
  if (!series) return {}

  const description =
    SERIES_DESCRIPTIONS[series] ??
    `Browse ${series} English publications from Hobby Japan.`

  return {
    title: series,
    description,
    alternates: { canonical: seriesPath(series) },
    openGraph: {
      title: `${series} | HOBBY JAPAN English Publications`,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${series} | HOBBY JAPAN English Publications`,
      description,
    },
  }
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const series = seriesFromSlug(slug)
  if (!series) notFound()

  const books = await getAllBooks()
  return <CatalogView books={books} activeSeries={series} />
}
