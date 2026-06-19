import { type Book } from '@/sanity/queries'
import { CatalogInteractive } from '@/components/CatalogInteractive'

type CatalogViewProps = {
  books: Book[]
  activeSeries: string | null
}

export function CatalogView({ books, activeSeries }: CatalogViewProps) {
  return <CatalogInteractive books={books} activeSeries={activeSeries} />
}
