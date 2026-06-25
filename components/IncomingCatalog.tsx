import Link from 'next/link'
import { type Book } from '@/sanity/queries'
import { IncomingBookCard } from '@/components/IncomingBookCard'

type IncomingCatalogProps = {
  books: Book[]
}

export function IncomingCatalog({ books }: IncomingCatalogProps) {
  if (books.length === 0) {
    return (
      <div className="incoming-page-empty">
        <p>No incoming publications at the moment.</p>
        <Link href="/" className="incoming-page-back-link">
          Browse all publications
        </Link>
      </div>
    )
  }

  return (
    <div className="incoming-grid">
      {books.map((book) => (
        <IncomingBookCard key={book._id} book={book} />
      ))}
    </div>
  )
}
