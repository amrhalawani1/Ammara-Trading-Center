# ATC Phase 1 IA & Content Requirements

> **Partly superseded.** Product, catalogue, and brand behaviour — including price, downloads, and the quote list — are defined in [specs/product-page.md](specs/product-page.md). Where this file disagrees, that spec wins. A public price or “Price on request” is allowed. A file with a real URL downloads directly. A cart is allowed only when `sellOnline` is true. Checkout and payment stay out of scope. Quote and WhatsApp stay the primary actions.

This is the content reference for the first informative website release. The
site is a showroom and inquiry experience, not an e-commerce catalogue.

## Home

- Establish ATC as a Jordan-based premium kitchen systems, furniture fittings,
  and hardware distributor operating since 1977.
- Trust bar: established 1977, approximately 30 exclusive brands, showrooms in
  Al-Bayader and Al-Wehdat.
- Give visitors two clear journeys: a contact inquiry for architects, fabricators,
  and procurement; showroom visit for homeowners.
- Introduce the tactile showroom experience and route to showroom details.

## Brands & Products

- Provide the partner brand directory and future-ready brand detail template.
- Brand pages should show the manufacturer, country, category, description, and
  related products without inventing certifications or project references.
- Product pages should prioritize clear product identity, material/finish,
  technical information, and a contact path.
- Centralized Catalogue: Browse products across four represented brands (Hettich, Salice, Kesseböhmer, Vibo) using exact product types (Hinges & Opening Systems, Drawer Runners & Slides, Sliding Door Systems, Kitchen Storage & Ergonomics, Wardrobe & Wire Storage). Supports filtering and clear empty states, while preserving inquiry-safe boundaries.

## Showroom

- Present the Al-Bayader and Al-Wehdat locations.
- Explain the showroom philosophy: quality is understood through weight,
  motion, and finish.
- Use one low-pressure “Book a Visit” action.

## Resources

- Provide the UI shell for brand guides, product care, and specification tips.
- Unreleased resources must be labeled clearly rather than filled with invented
  documents or claims.

## Project shortlists (`/lists`)

- Device-local lists of product references, one per project. Created and renamed on the page; the default list is "New project shortlist". An optional trade account syncs those lists across devices; Save never requires login.
- Product pages carry "Add to quote". The same finish or size added twice raises the quantity instead of adding a line. See the product page spec for the quote list.
- Each list can be sent as an enquiry to ATC (project details form, reference `ATC-YYMMDD-XXXX`), on WhatsApp, or by email. Empty lists cannot be sent.

## About Us

- Tell the ATC story from its 1977 founding and growth in Jordan.
- Include sourced vision, mission, values, brand partnerships, private-label
  ATC, and the quiet-authority narrative.

## Contact

- Include showroom addresses and available public phone details from the
  supplied company profile.
- Provide a general inquiry form.
- WhatsApp as a formal channel and Arabic/RTL remain open scope; show a clear
  placeholder instead of fabricating implementation.

## Content boundaries

- Never add checkout or payment. A cart control is allowed only when `sellOnline` is true, as defined in the product page spec.
- Optional trade accounts are allowed. They must never be required for inquiry, Save, or showroom booking.
- Never invent client names, project references, certifications, or product
  availability.
- Use the website palette and typography system: cream, dark brown, restrained
  red, Cormorant Garamond, and DM Sans.