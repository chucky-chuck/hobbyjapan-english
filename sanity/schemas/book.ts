import { defineField, defineType } from 'sanity'

export const bookSchema = defineType({
  name: 'book',
  title: 'Book',
  type: 'document',
  fields: [
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
      description: 'Click Generate after entering the title.',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Release Date',
      type: 'date',
    }),
    defineField({
      name: 'isIncoming',
      title: 'Incoming Publication',
      type: 'boolean',
      initialValue: false,
      description:
        'Show as an incoming title before release. Also set automatically when Release Date is in the future.',
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
      name: 'cover',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'amazonUrl',
      title: 'Amazon URL (US)',
      type: 'url',
      description: 'Legacy US link — kept in sync with the US entry in Amazon Links',
    }),
    defineField({
      name: 'amazonLinks',
      title: 'Amazon Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'amazonLink',
          fields: [
            defineField({
              name: 'region',
              title: 'Region',
              type: 'string',
              options: {
                list: [
                  { title: 'United States', value: 'US' },
                  { title: 'United Kingdom', value: 'UK' },
                  { title: 'Canada', value: 'CA' },
                  { title: 'Germany', value: 'DE' },
                  { title: 'France', value: 'FR' },
                  { title: 'Italy', value: 'IT' },
                  { title: 'Spain', value: 'ES' },
                  { title: 'Netherlands', value: 'NL' },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'region', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'pdf',
      title: 'PDF Preview',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'order',
      title: 'Legacy Order',
      type: 'number',
      hidden: true,
      readOnly: true,
      description: 'Legacy sort index from migration. Books are sorted by release date; this field is kept for older data only.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'series' },
  },
})
