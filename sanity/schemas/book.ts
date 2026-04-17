import { defineField, defineType } from 'sanity'

export const bookSchema = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
      options: {
        list: [
          'GUNDAM FORWARD',
          'HJ MECHANICS',
          'TECHNIQUE GUIDE',
          'MODELER GUIDE',
          'SCALE MODEL',
          "BEGINNER'S GUIDE",
          'GUNDAM WEAPONS',
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'isNew',
      title: 'New Release',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'pinned',
      title: 'Pin to Top',
      type: 'boolean',
      initialValue: false,
      description: 'Show this book at the top of the page, above all others',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    }),
    defineField({
      name: 'cover',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'amazonUrl',
      title: 'Amazon URL',
      type: 'url',
    }),
    defineField({
      name: 'pdf',
      title: 'PDF Preview',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'series' },
  },
})
