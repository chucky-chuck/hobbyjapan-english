import type { Metadata } from 'next'
import Link from 'next/link'
import { getIncomingBooks } from '@/sanity/queries'
import { IncomingCatalog } from '@/components/IncomingCatalog'
import { getSiteUrl } from '@/lib/site'

export const revalidate = 60

const PAGE_TITLE = 'Incoming Publications'
const PAGE_DESCRIPTION =
  'Upcoming English Gunpla and model kit books from Hobby Japan — release dates and previews before they go on sale.'

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: '/incoming' },
  openGraph: {
    title: `${PAGE_TITLE} | HOBBY JAPAN English Publications`,
    description: PAGE_DESCRIPTION,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PAGE_TITLE} | HOBBY JAPAN English Publications`,
    description: PAGE_DESCRIPTION,
  },
}

export default async function IncomingPage() {
  const incomingBooks = await getIncomingBooks()
  const siteUrl = getSiteUrl()

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Incoming Hobby Japan English Publications',
    description: PAGE_DESCRIPTION,
    url: `${siteUrl}/incoming`,
    numberOfItems: incomingBooks.length,
    itemListElement: incomingBooks.map((book, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: book.title,
      url: `${siteUrl}/books/${book.slug.current}`,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="incoming-page">
        <div className="incoming-page-inner">
          <nav className="incoming-page-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">›</span>
            <span>{PAGE_TITLE}</span>
          </nav>
          <header className="incoming-page-header">
            <h1 className="incoming-page-title">{PAGE_TITLE}</h1>
            <p className="incoming-page-description">{PAGE_DESCRIPTION}</p>
          </header>
          <IncomingCatalog books={incomingBooks} />
        </div>
      </div>
    </>
  )
}
