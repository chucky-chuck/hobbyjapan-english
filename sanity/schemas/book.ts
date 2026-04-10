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
      name: 'releaseDate',
      title: 'Release Date',
      type: 'string',
      description: 'Format: YYYY/M/D',
    }),
    defineField({
      name: 'coverUrl',
      title: 'Cover Image URL',
      type: 'url',
      description: 'External URL (Wix CDN or similar)',
    }),
    defineField({
      name: 'amazonUrl',
      title: 'Amazon URL',
      type: 'url',
    }),
    defineField({
      name: 'pdfUrl',
      title: 'PDF Preview URL',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first (0 = featured/hero)',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'series' },
  },
})
