/**
 * Sanity-ready Brand schema.
 *
 * The fields intentionally mirror the product data that the Phase 2/3
 * catalogue can import from ATC's existing MySQL system. Keep the portable
 * schema shape here until the Sanity studio is introduced.
 */
export const brandSchema = {
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    { name: 'legacyId', title: 'Legacy ID', type: 'string' },
    { name: 'name', title: 'Name', type: 'string', validation: 'required' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: 'required' },
    { name: 'country', title: 'Country', type: 'string' },
    { name: 'category', title: 'Primary category', type: 'string' },
    { name: 'summary', title: 'Short summary', type: 'text' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'coverImage', title: 'Cover image', type: 'image' },
    { name: 'websiteUrl', title: 'Manufacturer website', type: 'url' },
    { name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false },
    { name: 'status', title: 'Content status', type: 'string', options: { list: ['draft', 'published', 'comingSoon'] } },
  ],
};