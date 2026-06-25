import Link from 'next/link'
import { type Book } from '@/sanity/queries'
import { isIncoming } from '@/lib/dates'
import { IncomingBookCard } from '@/components/IncomingBookCard'

type IncomingSectionProps = {
  books: Book[]
}

export function IncomingSection({ books }: IncomingSectionProps) {
  const incoming = books.filter((b) => isIncoming(b))
  if (incoming.length === 0) return null

  return (
    <section className="incoming-section" aria-labelledby="incoming-heading">
      <div className="incoming-section-inner">
        <div className="incoming-section-header">
          <div>
            <h2 id="incoming-heading" className="incoming-section-title">
              Incoming Publications
            </h2>
            <p className="incoming-section-subtitle">
              Upcoming English releases from Hobby Japan
            </p>
          </div>
          <Link href="/incoming" className="incoming-section-view-all">
            View all incoming →
          </Link>
        </div>
        <div className="incoming-scroll">
          {incoming.map((book) => (
            <IncomingBookCard key={book._id} book={book} />
          ))}
        </div>
      </div>
    </section>
  )
}
