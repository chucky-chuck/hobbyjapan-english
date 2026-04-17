import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

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
    images: [{ url: '/hobby-japan-logo.png', alt: 'Hobby Japan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HOBBY JAPAN English Publications',
    description: 'Official English publications from Hobby Japan — Gunpla, model kits, and hobby guides.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
