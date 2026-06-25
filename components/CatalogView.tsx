import { type Book } from '@/sanity/queries'
import { CatalogInteractive } from '@/components/CatalogInteractive'

type CatalogViewProps = {
  books: Book[]
  activeSeries: string | null
  incomingBooks?: Book[]
}

export function CatalogView({ books, activeSeries, incomingBooks = [] }: CatalogViewProps) {
  return (
    <CatalogInteractive
      books={books}
      activeSeries={activeSeries}
      incomingBooks={incomingBooks}
    />
  )
}
