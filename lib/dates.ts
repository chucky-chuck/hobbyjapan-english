export type BookReleaseInfo = {
  releaseDate?: string
  isIncoming?: boolean
  pinned?: boolean
}

export function todayIsoDate(): string {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatReleaseDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function isComingSoon(releaseDate: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [year, month, day] = releaseDate.split('-').map(Number)
  const release = new Date(year, month - 1, day)
  return release > today
}

/** Pre-release title: explicit CMS flag or future release date. */
export function isIncoming(book: BookReleaseInfo): boolean {
  if (book.isIncoming === true) return true
  if (book.releaseDate) return isComingSoon(book.releaseDate)
  return false
}

/** Prefer on-sale titles for the hero; pinned always wins. */
export function pickFeaturedBook<T extends BookReleaseInfo>(catalog: T[]): T | null {
  if (catalog.length === 0) return null
  const pinned = catalog.find((b) => b.pinned)
  if (pinned) return pinned
  const onSale = catalog.find((b) => !isIncoming(b))
  return onSale ?? catalog[0]
}
