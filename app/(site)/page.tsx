import type { Metadata } from 'next'
import { getAllBooks, getIncomingBooks } from '@/sanity/queries'
import { CatalogView } from '@/components/CatalogView'

export const metadata: Metadata = {
  title: 'HOBBY JAPAN English Publications',
  description: 'Browse the full catalog of English Gunpla and model kit books from Hobby Japan.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'HOBBY JAPAN English Publications',
    description: 'Browse the full catalog of English Gunpla and model kit books from Hobby Japan.',
    type: 'website',
  },
}

export const revalidate = 60

export default async function HomePage() {
  const [books, incomingBooks] = await Promise.all([getAllBooks(), getIncomingBooks()])
  return <CatalogView books={books} activeSeries={null} incomingBooks={incomingBooks} />
}
