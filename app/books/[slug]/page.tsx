import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllBooks, getBook, getAdjacentBooks } from '@/sanity/queries'

export const revalidate = 60

export async function generateStaticParams() {
  const books = await getAllBooks()
  return books.map((b) => ({ slug: b.slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) return {}
  return {
    title: `${book.title} – HOBBY JAPAN English Publications`,
    description: book.description?.substring(0, 160),
  }
}

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = await getBook(slug)
  if (!book) notFound()

  const { prev, next } = await getAdjacentBooks(book.order ?? 0)

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1100, margin: '20px auto 0', padding: '0 24px', fontSize: '0.78rem', color: '#999' }}>
        <Link href="/" style={{ color: '#c8a84b' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>›</span>
        <span>{book.series}</span>
        <span style={{ margin: '0 8px' }}>›</span>
        <span style={{ color: '#e8e8e8' }}>{book.title.substring(0, 50)}{book.title.length > 50 ? '…' : ''}</span>
      </div>

      {/* Detail layout */}
      <div style={{
        maxWidth: 1100, margin: '32px auto 60px', padding: '0 24px',
        display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48, alignItems: 'start',
      }}>
        {/* Cover + CTAs */}
        <div>
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              width={260}
              height={360}
              style={{ width: '100%', height: 'auto', borderRadius: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', display: 'block' }}
              priority
            />
          ) : (
            <div style={{ aspectRatio: '5/7', background: '#2e2e2e', borderRadius: 6 }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {book.amazonUrl && (
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#ff9900', color: '#111', fontWeight: 700, fontSize: '0.88rem',
                padding: '11px 0', borderRadius: 4,
              }}>
                <svg viewBox="0 0 24 24" width={18} height={18} fill="#111">
                  <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.124.104.17.08.338-.07.505-.966 1.226-2.174 2.173-3.617 2.847-1.45.67-2.957 1.007-4.525 1.007-3.015 0-5.72-.897-8.116-2.695l-.314-.262c-.18-.15-.214-.29-.114-.42l.19-.385zM12.73 4.15c.065.065.065.13 0 .195-.1.074-.196.048-.284-.08C11.62 3.1 10.44 2.44 9.007 2.1c-.23-.055-.33-.14-.305-.264.024-.123.14-.172.35-.15 1.634.19 2.986.88 4.054 2.07l-.38.393zM5.17 4.15c-.066.065-.066.13 0 .195.1.074.196.048.284-.08C6.28 3.1 7.46 2.44 8.893 2.1c.23-.055.33-.14.305-.264-.024-.123-.14-.172-.35-.15-1.634.19-2.986.88-4.054 2.07l.38.393z" />
                </svg>
                Buy on Amazon
              </a>
            )}
            {book.pdfUrl && (
              <a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'transparent', color: '#c8a84b', fontWeight: 600, fontSize: '0.85rem',
                padding: '10px 0', borderRadius: 4, border: '1px solid #c8a84b',
              }}>
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM12 17l-4-4h2.5v-4h3v4H16l-4 4z" />
                </svg>
                Free PDF Preview
              </a>
            )}
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{
            display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
            color: '#c8a84b', border: '1px solid #c8a84b', padding: '3px 10px', borderRadius: 2,
            alignSelf: 'flex-start',
          }}>
            {book.series}
          </span>

          {book.isNew && (
            <span style={{
              display: 'inline-block', background: '#c0392b', color: '#fff',
              fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
              borderRadius: 2, letterSpacing: '0.1em', textTransform: 'uppercase', alignSelf: 'flex-start',
            }}>
              New Release
            </span>
          )}

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.25, color: '#fff' }}>
            {book.title}
          </h1>

          {book.subtitle && (
            <p style={{ fontSize: '1rem', color: '#e8c96b', fontStyle: 'italic' }}>
              {book.subtitle}
            </p>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #3a3a3a' }} />

          {book.releaseDate && (
            <p style={{ fontSize: '0.82rem', color: '#999' }}>
              On sale: <strong style={{ color: '#c8a84b' }}>{book.releaseDate}</strong>
            </p>
          )}

          {book.description && (
            <>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: '#999', textTransform: 'uppercase' }}>
                Description
              </p>
              <p style={{ fontSize: '0.95rem', color: '#e8e8e8', lineHeight: 1.8 }}>
                {book.description}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div style={{
        maxWidth: 1100, margin: '0 auto 60px', padding: '24px 24px 0',
        display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
        borderTop: '1px solid #3a3a3a',
      }}>
        {prev ? (
          <Link href={`/books/${prev.slug.current}`} style={{
            fontSize: '0.8rem', color: '#c8a84b', border: '1px solid #3a3a3a',
            padding: '8px 16px', borderRadius: 3,
          }}>
            ← {prev.title.substring(0, 40)}{prev.title.length > 40 ? '…' : ''}
          </Link>
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#999', border: '1px solid #3a3a3a', padding: '8px 16px', borderRadius: 3 }}>← Previous</span>
        )}
        <Link href="/" style={{ fontSize: '0.8rem', color: '#999', border: '1px solid #3a3a3a', padding: '8px 16px', borderRadius: 3 }}>
          ↑ All Publications
        </Link>
        {next ? (
          <Link href={`/books/${next.slug.current}`} style={{
            fontSize: '0.8rem', color: '#c8a84b', border: '1px solid #3a3a3a',
            padding: '8px 16px', borderRadius: 3,
          }}>
            {next.title.substring(0, 40)}{next.title.length > 40 ? '…' : ''} →
          </Link>
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#999', border: '1px solid #3a3a3a', padding: '8px 16px', borderRadius: 3 }}>Next →</span>
        )}
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 700px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
