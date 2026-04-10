import Link from 'next/link'
import Image from 'next/image'
import { getAllBooks, type Book } from '@/sanity/queries'

const SERIES_COLORS: Record<string, string> = {
  'GUNDAM FORWARD': '#c8a84b',
  'HJ MECHANICS': '#4a90d9',
  'TECHNIQUE GUIDE': '#27ae60',
  'MODELER GUIDE': '#8e44ad',
  'SCALE MODEL': '#e67e22',
  "BEGINNER'S GUIDE": '#16a085',
  'GUNDAM WEAPONS': '#c0392b',
}

export const revalidate = 60

export default async function HomePage() {
  const books = await getAllBooks()
  const featured = books[0] ?? null
  const rest = books.slice(1)

  return (
    <>
      {featured && <HeroSection book={featured} />}

      {/* Filter bar */}
      <div style={{ background: '#1a1a1a', borderBottom: '1px solid #3a3a3a', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 0' }}>
          {['ALL', 'GUNDAM FORWARD', 'HJ MECHANICS', 'TECHNIQUE GUIDE', 'MODELER GUIDE', 'SCALE MODEL'].map((s) => (
            <span key={s} style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
              padding: '4px 12px', borderRadius: 2, border: '1px solid #3a3a3a',
              color: '#999', whiteSpace: 'nowrap', cursor: 'default',
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1100, margin: '40px auto 60px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: '#999', marginBottom: 24, textTransform: 'uppercase' }}>
          All Publications
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 24,
        }}>
          {rest.map((book) => <BookCard key={book._id} book={book} />)}
        </div>
      </div>
    </>
  )
}

function HeroSection({ book }: { book: Book }) {
  const slug = book.slug.current
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0d0d0d 0%, #1e1510 100%)',
      borderBottom: '1px solid #3a3a3a', padding: '48px 24px',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center',
      }}>
        <div>
          {book.isNew && (
            <span style={{
              display: 'inline-block', background: '#c0392b', color: '#fff',
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
              padding: '3px 10px', borderRadius: 2, marginBottom: 12, textTransform: 'uppercase',
            }}>New</span>
          )}
          <div style={{ fontSize: '0.8rem', color: '#c8a84b', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 6 }}>
            {book.series}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 8, color: '#fff' }}>
            {book.title}
          </h2>
          {book.subtitle && (
            <p style={{ fontSize: '1rem', color: '#e8c96b', fontStyle: 'italic', marginBottom: 14 }}>
              {book.subtitle}
            </p>
          )}
          {book.description && (
            <p style={{ fontSize: '0.9rem', color: '#999', maxWidth: 600, marginBottom: 16 }}>
              {book.description.substring(0, 200)}…
            </p>
          )}
          {book.releaseDate && (
            <p style={{ fontSize: '0.78rem', color: '#999', marginBottom: 16 }}>
              On sale: <strong style={{ color: '#c8a84b' }}>{book.releaseDate}</strong>
            </p>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/books/${slug}`} style={{
              display: 'inline-block', background: '#c8a84b', color: '#111',
              fontWeight: 700, fontSize: '0.85rem', padding: '10px 22px', borderRadius: 3,
            }}>
              View Details
            </Link>
            {book.amazonUrl && (
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: '#ff9900', color: '#111', fontWeight: 700,
                fontSize: '0.85rem', padding: '10px 18px', borderRadius: 3,
              }}>
                Buy on Amazon
              </a>
            )}
          </div>
        </div>
        {book.coverUrl && (
          <Image
            src={book.coverUrl}
            alt={book.title}
            width={200}
            height={260}
            style={{ borderRadius: 6, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', objectFit: 'cover' }}
            priority
          />
        )}
      </div>
    </div>
  )
}

function BookCard({ book }: { book: Book }) {
  const slug = book.slug.current
  const accentColor = SERIES_COLORS[book.series] ?? '#c8a84b'
  return (
    <Link href={`/books/${slug}`} style={{ display: 'block' }}>
      <div style={{
        background: '#242424', borderRadius: 6, overflow: 'hidden',
        border: '1px solid #3a3a3a', transition: 'border-color 0.2s',
        height: '100%',
      }}>
        {book.coverUrl ? (
          <div style={{ position: 'relative', aspectRatio: '5/7', overflow: 'hidden' }}>
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 50vw, 220px"
            />
            {book.isNew && (
              <span style={{
                position: 'absolute', top: 8, left: 8, background: '#c0392b',
                color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 2,
              }}>NEW</span>
            )}
          </div>
        ) : (
          <div style={{ aspectRatio: '5/7', background: '#2e2e2e' }} />
        )}
        <div style={{ padding: '12px 14px' }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
            color: accentColor, display: 'block', marginBottom: 4,
          }}>
            {book.series}
          </span>
          <p style={{
            fontSize: '0.82rem', fontWeight: 700, color: '#e8e8e8',
            lineHeight: 1.35, display: '-webkit-box',
            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {book.title}
          </p>
        </div>
      </div>
    </Link>
  )
}
