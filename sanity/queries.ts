import { client } from './client'

export type Book = {
  _id: string
  slug: { current: string }
  series: string
  title: string
  subtitle?: string
  isNew?: boolean
  pinned?: boolean
  releaseDate?: string
  cover?: { asset: { url: string } }
  amazonUrl?: string
  pdf?: { asset: { url: string } }
  description?: string
  order?: number // legacy field — still in data, used as tiebreaker for undated books
}

const BOOK_FIELDS = `
  _id,
  slug,
  series,
  title,
  subtitle,
  isNew,
  pinned,
  releaseDate,
  cover { asset->{ url } },
  amazonUrl,
  pdf { asset->{ url } },
  description,
  order
`

// Pinned first → books with a date sorted newest first → undated books by legacy order field
const SORT = `order(coalesce(pinned, false) desc, releaseDate desc, order asc, _createdAt desc)`

export async function getAllBooks(): Promise<Book[]> {
  return client.fetch(`*[_type == "book"] | ${SORT} { ${BOOK_FIELDS} }`)
}

export async function getBook(slug: string): Promise<Book | null> {
  return client.fetch(
    `*[_type == "book" && slug.current == $slug][0] { ${BOOK_FIELDS} }`,
    { slug }
  )
}

export async function getAdjacentBooks(
  releaseDate: string | undefined,
  order: number | undefined
): Promise<{ prev: Book | null; next: Book | null }> {
  if (releaseDate) {
    const [prev, next] = await Promise.all([
      client.fetch<Book | null>(
        `*[_type == "book" && releaseDate > $releaseDate] | order(releaseDate asc)[0] { ${BOOK_FIELDS} }`,
        { releaseDate }
      ),
      client.fetch<Book | null>(
        `*[_type == "book" && releaseDate < $releaseDate] | order(releaseDate desc)[0] { ${BOOK_FIELDS} }`,
        { releaseDate }
      ),
    ])
    return { prev, next }
  }
  // Fallback: use legacy order field
  const o = order ?? 0
  const [prev, next] = await Promise.all([
    client.fetch<Book | null>(
      `*[_type == "book" && order < $o] | order(order desc)[0] { ${BOOK_FIELDS} }`,
      { o }
    ),
    client.fetch<Book | null>(
      `*[_type == "book" && order > $o] | order(order asc)[0] { ${BOOK_FIELDS} }`,
      { o }
    ),
  ])
  return { prev, next }
}
