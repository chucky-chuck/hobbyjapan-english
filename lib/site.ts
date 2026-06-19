export const PRODUCTION_SITE_URL = 'https://english.hobbyjapan.co.jp'

/** Resolved site origin for metadata, sitemap, JSON-LD, and llms.txt. */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
