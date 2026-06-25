import Link from 'next/link'
import Image from 'next/image'
import { type Book } from '@/sanity/queries'
import { formatReleaseDate } from '@/lib/dates'
import { seriesColor } from '@/lib/series'
import { IncomingBadge } from '@/components/IncomingBadge'

function incomingDateLabel(book: Book): string {
  if (book.releaseDate) {
    return formatReleaseDate(book.releaseDate)
  }
  return 'Release date TBA'
}

type IncomingBookCardProps = {
  book: Book
  className?: string
}

export function IncomingBookCard({ book, className = '' }: IncomingBookCardProps) {
  const slug = book.slug.current
  return (
    <Link href={`/books/${slug}`} className={`incoming-card-link${className ? ` ${className}` : ''}`}>
      <article className="incoming-card">
        {book.cover?.asset?.url ? (
          <div className="incoming-card-cover">
            <Image
              src={book.cover.asset.url}
              alt={book.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="220px"
            />
            <IncomingBadge compact />
          </div>
        ) : (
          <div className="incoming-card-cover incoming-card-cover--empty">
            <IncomingBadge compact />
          </div>
        )}
        <div className="incoming-card-body">
          <span
            className="incoming-card-series"
            style={{ color: seriesColor(book.series) }}
          >
            {book.series}
          </span>
          <p className="incoming-card-title">{book.title}</p>
          <p className="incoming-card-date">{incomingDateLabel(book)}</p>
        </div>
      </article>
    </Link>
  )
}
