import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllBooks, type Book } from '@/sanity/queries'
import { seriesColor } from '@/lib/series'
import { formatReleaseDate, isComingSoon } from '@/lib/dates'

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

const ALL_SERIES = ['ALL', 'GUNDAM FORWARD', 'HJ MECHANICS', 'TECHNIQUE GUIDE', 'MODELER GUIDE', 'SCALE MODEL', "BEGINNER'S GUIDE", 'GUNDAM WEAPONS']

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ series?: string }>
}) {
  const { series: activeSeries } = await searchParams
  const books = await getAllBooks()
  const isAll = !activeSeries || activeSeries === 'ALL'
  const catalog = isAll ? books : books.filter((b) => b.series === activeSeries)
  const featured = catalog[0] ?? null
  const gridBooks = catalog.slice(1)

  return (
    <>
      {featured && <HeroSection book={featured} />}

      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-bar-scroll">
            {ALL_SERIES.map((s) => {
              const isActive = s === 'ALL' ? !activeSeries || activeSeries === 'ALL' : activeSeries === s
              const color = s === 'ALL' ? '#c8a84b' : seriesColor(s)
              return (
                <Link
                  key={s}
                  href={s === 'ALL' ? '/' : `/?series=${encodeURIComponent(s)}`}
                  style={{
                    fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em',
                    padding: '4px 12px', borderRadius: 2, whiteSpace: 'nowrap',
                    border: `1px solid ${isActive ? color : s === 'ALL' ? 'var(--border)' : color}`,
                    color: isActive ? color : s === 'ALL' ? 'var(--text-muted)' : color,
                    background: isActive ? `${color}1a` : 'transparent',
                    opacity: isActive || s === 'ALL' ? 1 : 0.85,
                  }}
                >
                  {s}
                </Link>
              )
            })}
          </div>
          <div className="filter-bar-fade" aria-hidden="true" />
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '40px auto 60px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 24, textTransform: 'uppercase' }}>
          {activeSeries && activeSeries !== 'ALL' ? activeSeries : 'All Publications'}
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 24,
        }}>
          {gridBooks.map((book) => <BookCard key={book._id} book={book} />)}
        </div>
        {gridBooks.length === 0 && !featured && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
            No publications found in this series.
          </p>
        )}
      </div>
    </>
  )
}

function ReleaseDateLine({ releaseDate }: { releaseDate: string }) {
  const comingSoon = isComingSoon(releaseDate)
  return (
    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
      {comingSoon ? (
        <>Coming soon: <strong style={{ color: 'var(--accent-light)' }}>{formatReleaseDate(releaseDate)}</strong></>
      ) : (
        <>On sale: <strong style={{ color: 'var(--accent)' }}>{formatReleaseDate(releaseDate)}</strong></>
      )}
    </p>
  )
}

function HeroSection({ book }: { book: Book }) {
  const slug = book.slug.current
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0d0d0d 0%, #1e1510 100%)',
      borderBottom: '1px solid var(--border)', padding: '48px 24px',
    }}>
      <div className="hero-grid" style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center',
      }}>
        <div>
          {book.isNew && (
            <span style={{
              display: 'inline-block', background: 'var(--red)', color: '#fff',
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
              padding: '3px 10px', borderRadius: 2, marginBottom: 12, textTransform: 'uppercase',
            }}>New</span>
          )}
          <div style={{ fontSize: '0.8rem', color: seriesColor(book.series), fontWeight: 600, letterSpacing: '0.05em', marginBottom: 6 }}>
            {book.series}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 8, color: '#fff' }}>
            {book.title}
          </h2>
          {book.subtitle && (
            <p style={{ fontSize: '1rem', color: 'var(--accent-light)', fontStyle: 'italic', marginBottom: 14 }}>
              {book.subtitle}
            </p>
          )}
          {book.description && (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 600, marginBottom: 16 }}>
              {book.description.length > 200
                ? `${book.description.substring(0, 200)}…`
                : book.description}
            </p>
          )}
          {book.releaseDate && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              {isComingSoon(book.releaseDate) ? (
                <>Coming soon: <strong style={{ color: 'var(--accent-light)' }}>{formatReleaseDate(book.releaseDate)}</strong></>
              ) : (
                <>On sale: <strong style={{ color: 'var(--accent)' }}>{formatReleaseDate(book.releaseDate)}</strong></>
              )}
            </p>
          )}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href={`/books/${slug}`} style={{
              display: 'inline-block', background: 'var(--accent)', color: '#111',
              fontWeight: 700, fontSize: '0.85rem', padding: '10px 22px', borderRadius: 3,
            }}>
              View Details
            </Link>
            {book.amazonUrl && (
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'var(--amazon)', color: '#111', fontWeight: 700,
                fontSize: '0.85rem', padding: '10px 18px', borderRadius: 3,
              }}>
                Buy on Amazon
              </a>
            )}
          </div>
        </div>
        {book.cover?.asset?.url && (
          <Image
            src={book.cover.asset.url}
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
  const accentColor = seriesColor(book.series)
  return (
    <Link href={`/books/${slug}`} className="book-card-link">
      <div className="book-card">
        {book.cover?.asset?.url ? (
          <div style={{ position: 'relative', aspectRatio: '5/7', overflow: 'hidden' }}>
            <Image
              src={book.cover.asset.url}
              alt={book.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 50vw, 220px"
            />
            {book.isNew && (
              <span style={{
                position: 'absolute', top: 8, left: 8, background: 'var(--red)',
                color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 2,
              }}>NEW</span>
            )}
          </div>
        ) : (
          <div style={{ aspectRatio: '5/7', background: 'var(--surface2)' }} />
        )}
        <div style={{ padding: '12px 14px' }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
            color: accentColor, display: 'block', marginBottom: 4,
          }}>
            {book.series}
          </span>
          <p style={{
            fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)',
            lineHeight: 1.35, display: '-webkit-box',
            WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {book.title}
          </p>
          {book.releaseDate && <ReleaseDateLine releaseDate={book.releaseDate} />}
        </div>
      </div>
    </Link>
  )
}
