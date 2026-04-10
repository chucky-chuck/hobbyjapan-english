import { client } from './client'

export type Book = {
  _id: string
  slug: { current: string }
  series: string
  title: string
  subtitle?: string
  isNew?: boolean
  releaseDate?: string
  coverUrl?: string
  amazonUrl?: string
  pdfUrl?: string
  description?: string
  order?: number
}

const BOOK_FIELDS = `
  _id,
  slug,
  series,
  title,
  subtitle,
  isNew,
  releaseDate,
  coverUrl,
  amazonUrl,
  pdfUrl,
  description,
  order
`

export async function getAllBooks(): Promise<Book[]> {
  return client.fetch(
    `*[_type == "book"] | order(order asc, _createdAt desc) { ${BOOK_FIELDS} }`
  )
}

export async function getBook(slug: string): Promise<Book | null> {
  return client.fetch(
    `*[_type == "book" && slug.current == $slug][0] { ${BOOK_FIELDS} }`,
    { slug }
  )
}

export async function getAdjacentBooks(
  order: number
): Promise<{ prev: Book | null; next: Book | null }> {
  const [prev, next] = await Promise.all([
    client.fetch<Book | null>(
      `*[_type == "book" && order < $order] | order(order desc)[0] { ${BOOK_FIELDS} }`,
      { order }
    ),
    client.fetch<Book | null>(
      `*[_type == "book" && order > $order] | order(order asc)[0] { ${BOOK_FIELDS} }`,
      { order }
    ),
  ])
  return { prev, next }
}
