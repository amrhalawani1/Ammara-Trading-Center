# Product page - design direction

Redesign of `/products/:slug`, built on a structural and visual read of four partner-brand product pages. DND is the primary reference.

## What each reference does

| Reference | Structure | Visual |
|---|---|---|
| DND (palm) | Lowercase product name, "new" badge, designer credit, editorial statement headline, finishes as **code + name** (ONT Natural brass...) that swap an identically-angled render, "Drawings and technical info" and "Catalogue sheet", numbered gallery, designer bio, "Products in the same family", "Do you want more information? Contact us / Download". | White stage, black type, generous air, one product angle repeated per finish. |
| Blum (CLIP top BLUMOTION) | Tagline hero, sub-navigation tabs (Overview / Product range / Manufacturing & assembly / Downloads & videos), six image + benefit-headline blocks, horizontal "Applications" gallery, "This might also interest you". | Minimal, product-first, grey accents, no hard CTA. |
| Häfele (base pull-out) | Item number front and centre with **copy** ("Article copied"), variant selector (version, width), "Product details" key-value table with metric + imperial, "Manuals and Videos" (instructions, CAD), "Data sheet download", "Send e-mail inquiry", "Compare", "Share", "Frequently purchased with". Prices shown. | Dense, catalogue-like, white. |
| Barazza (Icon Glass) | Product code + variant, product render beside an ambient lifestyle photo, icon-driven feature blocks, structured "Descrizione" spec list, variant thumbnails, PDF downloads, related accessories, "Request information / Points of sale". | Light, monochrome icon system, colour only in imagery. |

## What we borrowed, and how it maps to ATC

- **Stage + dossier hero** (DND proportions). Cut-out renders sit on the cream-mid stage with multiply blending so white manufacturer backgrounds disappear. Sticky dossier on the right: category, name, brand · country · designer, editorial statement (first sentence of the description), reference row with copy (Häfele), finish swatches, one CTA.
- **In-page anchor nav with scroll-spy** (Blum/Häfele): Overview · Finishes · Technical data · Documents · Related.
- **At-a-glance facts** (Barazza/Blum): first four specs with a monochrome icon each.
- **Finishes as code + name** (DND): codes derived from the finish name, swatch tones derived from finish keywords; the expanded tile grid mirrors DND's finish list.
- **Technical data table + copy specification** (Häfele): the whole sheet copies to the clipboard for order notes.
- **Documents** (all four): technical drawing, data sheet, CAD/BIM - requested via WhatsApp rather than downloaded, so the manufacturer's current revision is always what's sent.
- **Showroom band** on a dark ground: the imagery direction (dark behind photography) applied where lifestyle photography lives, not behind white-background renders.
- **Related rail** (DND "same family"): snap-scrolling, one-handed on a phone.
- **Closing contact block** (DND) + mobile sticky WhatsApp bar.

## Deliberately not borrowed

- Prices, "add to cart", compare lists (Häfele) - Phase 1 is not transactional.
- Hosted file downloads - we do not host manufacturer PDFs yet.
- Newsletter capture, configurator, virtual tour.

## Needs Ahmad's decision before launch

1. WhatsApp business number - `company.whatsapp` in `src/lib/content.ts` is a placeholder.
2. Rights to DND product photography currently used as placeholders.
3. Reference codes - generated as `ATC-XXX-0000` when no SKU exists; confirm whether ATC has its own item numbering.
4. All page copy (statements, showroom band, documents note) is draft voice, written to the Confident / Premium / Warm rules.

## Round two: closer to DND

The page now follows DND's own running order, with each DND-specific section rendering only when a product carries the data for it (new optional `editorial` field on products: statement, awards, chapters, designer, gallery).

1. **Hero** - the object first, enormous, straight on the canvas with no stage box; the name lowercase and light, low-left; designer as a quiet line. Breadcrumb sits *under* the hero, lowercase, as on DND.
2. **Statement + story chapters** - "A sophisticated balance." then alternating text/large-image chapters; an awards line under the paragraph.
3. **Key facts** - one thin-ruled row, no boxes.
4. **Finishes** - render on the left; on the right the lowercase name, designer, a mono `design:` line, and finishes as a vertical **CODE + name** list that swaps the render. Under it: "Drawings and technical info" and "Catalogue sheet".
5. **Configure** - ATC's answer to DND's configurator: finish, quantity, project type, expected timing, notes, with a live preview of the WhatsApp message. Never a price.
6. **Numbered gallery** - "01 02 03" plus the words Previous / Next.
7. **Designer** - name large, short bio, "Discover more".
8. Technical data, showroom band, documents, "Products in the same family", and "Do you want more information?" close the page.

Data note: `lib/db/migrations/meta` has no snapshot for the initial migration, so `drizzle-kit generate` produces a full-schema file; `0001` was trimmed by hand to the single `ALTER TABLE`. Worth restoring the `0000` snapshot before the next schema change.
