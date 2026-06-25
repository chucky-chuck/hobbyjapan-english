'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { type Book } from '@/sanity/queries'
import { ALL_SERIES, seriesColor, seriesPath } from '@/lib/series'
import { formatReleaseDate, isIncoming, pickFeaturedBook } from '@/lib/dates'
import { primaryAmazonUrl, resolveAmazonLinks } from '@/lib/amazon'
import { TrackOutboundLink } from '@/components/TrackOutboundLink'
import { AmazonBuyLinks } from '@/components/AmazonBuyLinks'
import { IncomingSection } from '@/components/IncomingSection'
import { IncomingBadge } from '@/components/IncomingBadge'

type CatalogInteractiveProps = {
  books: Book[]
  activeSeries: string | null
  incomingBooks?: Book[]
}

function matchesQuery(book: Book, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [book.title, book.subtitle, book.series, book.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export function CatalogInteractive({ books, activeSeries, incomingBooks = [] }: CatalogInteractiveProps) {
  const [query, setQuery] = useState('')
  const isAll = !activeSeries
  const catalog = useMemo(
    () => (isAll ? books : books.filter((b) => b.series === activeSeries)),
    [books, isAll, activeSeries],
  )
  const isSearching = query.trim().length > 0

  const { featured, gridBooks } = useMemo(() => {
    if (isSearching) {
      const filtered = catalog.filter((b) => matchesQuery(b, query))
      return { featured: null, gridBooks: filtered }
    }
    const featuredBook = pickFeaturedBook(catalog)
    const rest = featuredBook
      ? catalog.filter((b) => b._id !== featuredBook._id)
      : catalog
    return { featured: featuredBook, gridBooks: rest }
  }, [catalog, isSearching, query])

  const showIncomingSection = isAll && !isSearching && incomingBooks.length > 0

  return (
    <>
      {featured && <HeroSection book={featured} />}
      {showIncomingSection && <IncomingSection books={incomingBooks} />}

      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-bar-scroll">
            {(['ALL', ...ALL_SERIES] as const).map((s) => {
              const isActive = s === 'ALL' ? isAll : activeSeries === s
              const color = s === 'ALL' ? '#c8a84b' : seriesColor(s)
              return (
                <Link
                  key={s}
                  href={s === 'ALL' ? '/' : seriesPath(s)}
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
        <div className="catalog-toolbar">
          <h2 style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>
            {isSearching ? 'Search Results' : (activeSeries ?? 'All Publications')}
          </h2>
          <label className="catalog-search">
            <span className="sr-only">Search publications</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or series…"
              className="catalog-search-input"
            />
          </label>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 24,
        }}>
          {gridBooks.map((book) => <BookCard key={book._id} book={book} />)}
        </div>
        {gridBooks.length === 0 && !featured && (
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
            {isSearching ? 'No publications match your search.' : 'No publications found in this series.'}
          </p>
        )}
      </div>
    </>
  )
}

function ReleaseDateLine({ book }: { book: Book }) {
  if (isIncoming(book)) {
    return (
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
        {book.releaseDate ? (
          <>Coming soon: <strong style={{ color: 'var(--accent-light)' }}>{formatReleaseDate(book.releaseDate)}</strong></>
        ) : (
          <>Release date <strong style={{ color: 'var(--accent-light)' }}>TBA</strong></>
        )}
      </p>
    )
  }
  if (!book.releaseDate) return null
  return (
    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
      On sale: <strong style={{ color: 'var(--accent)' }}>{formatReleaseDate(book.releaseDate)}</strong>
    </p>
  )
}

function HeroSection({ book }: { book: Book }) {
  const slug = book.slug.current
  const incoming = isIncoming(book)
  const amazonLinks = resolveAmazonLinks(book.amazonLinks, book.amazonUrl)
  const amazonUrl = primaryAmazonUrl(book.amazonLinks, book.amazonUrl)
  const showAmazon = !incoming && (amazonLinks.length > 0 || amazonUrl)
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
          {incoming ? (
            <div style={{ marginBottom: 12 }}>
              <IncomingBadge />
            </div>
          ) : book.isNew ? (
            <span style={{
              display: 'inline-block', background: 'var(--red)', color: '#fff',
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
              padding: '3px 10px', borderRadius: 2, marginBottom: 12, textTransform: 'uppercase',
            }}>New</span>
          ) : null}
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
          {(incoming || book.releaseDate) && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              {incoming ? (
                book.releaseDate ? (
                  <>Coming soon: <strong style={{ color: 'var(--accent-light)' }}>{formatReleaseDate(book.releaseDate)}</strong></>
                ) : (
                  <>Release date <strong style={{ color: 'var(--accent-light)' }}>TBA</strong></>
                )
              ) : (
                <>On sale: <strong style={{ color: 'var(--accent)' }}>{formatReleaseDate(book.releaseDate!)}</strong></>
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
            {showAmazon && (amazonLinks.length > 1 ? (
              <AmazonBuyLinks
                links={amazonLinks}
                slug={slug}
                series={book.series}
                location="hero"
              />
            ) : amazonUrl ? (
              <TrackOutboundLink
                href={amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                event="Amazon Click"
                eventData={{ slug, series: book.series, location: 'hero' }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'var(--amazon)', color: '#111', fontWeight: 700,
                  fontSize: '0.85rem', padding: '10px 18px', borderRadius: 3,
                }}
              >
                Buy on Amazon
              </TrackOutboundLink>
            ) : null)}
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
  const incoming = isIncoming(book)
  const accentColor = seriesColor(book.series)
  return (
    <Link href={`/books/${slug}`} className={`book-card-link${incoming ? ' book-card-link--incoming' : ''}`}>
      <div className={`book-card${incoming ? ' book-card--incoming' : ''}`}>
        {book.cover?.asset?.url ? (
          <div style={{ position: 'relative', aspectRatio: '5/7', overflow: 'hidden' }}>
            <Image
              src={book.cover.asset.url}
              alt={book.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 50vw, 220px"
            />
            {incoming ? (
              <span style={{ position: 'absolute', top: 8, left: 8 }}>
                <IncomingBadge compact />
              </span>
            ) : book.isNew ? (
              <span style={{
                position: 'absolute', top: 8, left: 8, background: 'var(--red)',
                color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 2,
              }}>NEW</span>
            ) : null}
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
          <ReleaseDateLine book={book} />
        </div>
      </div>
    </Link>
  )
}
