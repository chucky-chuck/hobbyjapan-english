import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

import { getSiteUrl } from '@/lib/site'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'HOBBY JAPAN English Publications',
    template: '%s | HOBBY JAPAN',
  },
  description: 'Official English publications from Hobby Japan — Gunpla, model kits, and hobby guides.',
  openGraph: {
    type: 'website',
    siteName: 'HOBBY JAPAN English Publications',
    title: 'HOBBY JAPAN English Publications',
    description: 'Official English publications from Hobby Japan — Gunpla, model kits, and hobby guides.',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'Hobby Japan English Publications' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HOBBY JAPAN English Publications',
    description: 'Official English publications from Hobby Japan — Gunpla, model kits, and hobby guides.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hobby Japan',
  url: siteUrl,
  logo: `${siteUrl}/hobby-japan-logo.png`,
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HOBBY JAPAN English Publications',
  url: siteUrl,
  description: 'Official English publications from Hobby Japan — Gunpla, model kits, and hobby guides.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
