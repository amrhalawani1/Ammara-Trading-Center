/**
 * Sanity-ready Product schema.
 *
 * Keep product identity separate from presentation so a future MySQL import
 * can populate the catalogue without changing the Brand/Product templates.
 */
export const productSchema = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'legacyId', title: 'Legacy ID', type: 'string' },
    { name: 'title', title: 'Product title', type: 'string', validation: 'required' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: 'required' },
    { name: 'brand', title: 'Brand', type: 'reference', to: [{ type: 'brand' }], validation: 'required' },
    { name: 'sku', title: 'SKU', type: 'string' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'family', title: 'Product family', type: 'string' },
    { name: 'description', title: 'Description', type: 'text' },
    { name: 'material', title: 'Material', type: 'string' },
    { name: 'finish', title: 'Finish', type: 'string' },
    { name: 'dimensions', title: 'Dimensions', type: 'string' },
    { name: 'images', title: 'Images', type: 'array', of: [{ type: 'image' }] },
    { name: 'installationNotes', title: 'Installation notes', type: 'text' },
    { name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false },
    { name: 'status', title: 'Content status', type: 'string', options: { list: ['draft', 'published', 'comingSoon'] } },
  ],
};