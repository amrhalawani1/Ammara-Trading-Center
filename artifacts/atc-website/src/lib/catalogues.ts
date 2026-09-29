/**
 * Manufacturer catalogues, brochures and technical booklets ATC hands out at the counter.
 *
 * `browse` points at the manufacturer's own catalogue page; `download` is the PDF once ATC
 * uploads it to /public/catalogues (or links the manufacturer's file). Cards without either
 * still render, with "Request a copy" as the only action, so a title can be listed before its
 * file is in place without inventing a link.
 */
export interface Catalogue {
  id: string;
  brandSlug: string;
  brandName: string;
  title: string;
  /** What the booklet covers, one line. */
  line: string;
  /** Edition or year printed on the cover, where known. */
  edition?: string;
  kind: "catalogue" | "brochure" | "technical" | "finishes";
  cover: string;
  /** Page-by-page catalogue viewer published by the manufacturer. */
  viewer?: string;
  browse?: string;
  /** PDF that downloads when the visitor presses Download. */
  download?: string;
  /** Languages the printed edition is available in. */
  languages?: string[];
}

export const CATALOGUE_KINDS: { id: Catalogue["kind"]; label: string }[] = [
  { id: "catalogue", label: "Catalogues" },
  { id: "brochure", label: "Brochures" },
  { id: "technical", label: "Technical" },
  { id: "finishes", label: "Finishes" },
];

export const CATALOGUES: Catalogue[] = [
  // DND Martinelli — viewers and PDFs published on their catalogues page.
  { id: "dnd-catalogue-26-27", brandSlug: "dnd", brandName: "DND", title: "Catalogue Dnd 26–27", line: "The full range of door, window and furniture handles for the current two years.", edition: "2026–27", kind: "catalogue", cover: "/images/catalogues/dnd-catalogue-26-27.jpg", viewer: "https://view.dndhandles.it/catalogue/", download: "https://view.publitas.com/78088/1416429/pdfs/7f4a1f94-f537-445a-bc32-d644e394efcd.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520handles%2520catalogo%252026-27.pdf", languages: ["EN", "IT", "FR", "DE", "ES"] },
  { id: "dnd-palm-pencil", brandSlug: "dnd", brandName: "DND", title: "Palm and Pencil", line: "Two lever families: one shaped to the hand, one drawn as a single line.", kind: "brochure", cover: "/images/catalogues/dnd-palm-pencil.jpg", viewer: "https://view.dndhandles.it/palm-pencil/", download: "https://view.publitas.com/78088/2681662/pdfs/a8e0c5b9-4469-4c37-9886-74b894454835.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520Handles%2520%2520-%2520Dnd%2520-%2520Palm%2520-%2520Pencil.pdf" },
  { id: "dnd-blend-ellipse", brandSlug: "dnd", brandName: "DND", title: "Blend AG, Ellipse and Ellipse Brilliant", line: "Levers with antibacterial and polished finishes for hospitality and healthcare.", kind: "brochure", cover: "/images/catalogues/dnd-blend-ellipse.jpg", viewer: "https://view.dndhandles.it/blend-ag-ellipse-ellipse-brilliant/", download: "https://view.publitas.com/78088/2428541/pdfs/1a8e0904-6567-4200-b979-d4f98f754ecf.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520-%2520Blend%2520AG%2520-%2520Ellipse%2520-%2520Ellipse%2520brilliant.pdf" },
  { id: "dnd-kind-of-spot", brandSlug: "dnd", brandName: "DND", title: "Kind of and Spot", line: "The Kind of and Spot handle families.", kind: "brochure", cover: "/images/catalogues/dnd-kind-of-spot.jpg", viewer: "https://view.dndhandles.it/kind-of-spot/", download: "https://view.publitas.com/78088/2428542/pdfs/be641181-9fdc-4d43-bcda-8b5eff27d743.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520-%2520Kind%2520of%2520-%2520Spot.pdf" },
  { id: "dnd-total-look", brandSlug: "dnd", brandName: "DND", title: "Dnd Total Look", line: "Handles, hinges, locks and accessories matched in one finish across a whole project.", kind: "brochure", cover: "/images/catalogues/dnd-total-look.jpg", viewer: "https://view.dndhandles.it/total-look/", download: "https://view.publitas.com/78088/2124139/pdfs/b4b5c92f-b51d-45e4-aa4d-b9bd1261ff45.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520total%2520look.pdf" },
  { id: "dnd-opening-projects", brandSlug: "dnd", brandName: "DND", title: "Opening Your Projects", line: "A project brochure for specifying DND handles.", kind: "brochure", cover: "/images/catalogues/dnd-opening-projects.jpg", viewer: "https://view.dndhandles.it/opening-your-projects/", download: "https://view.publitas.com/78088/1878392/pdfs/46679050-93e7-466a-95f4-c94d7e2360cd.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520Opening%2520your%2520projects.pdf" },
  { id: "dnd-click-close", brandSlug: "dnd", brandName: "DND", title: "Click & Close", line: "Magnetic latching for interior doors: quiet, no strike plate to adjust.", kind: "brochure", cover: "/images/catalogues/dnd-click-close.jpg", viewer: "https://view.dndhandles.it/click-and-close/", download: "https://view.publitas.com/78088/2040829/pdfs/2d728bf5-59be-4681-8a54-c69168707c3d.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Brochure%2520Click%2520%2526%2520Close%2520%257C%2520Dnd%2520handles.pdf" },
  { id: "dnd-vertical", brandSlug: "dnd", brandName: "DND", title: "Vertical", line: "Full-height pull handles and the locking system that goes with them.", kind: "brochure", cover: "/images/catalogues/dnd-vertical.jpg", viewer: "https://view.dndhandles.it/vertical/", download: "https://view.publitas.com/78088/1591169/pdfs/2e07593a-0a0b-4436-81d0-6aa0266753c4.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Vertical%2520-%2520Dnd%2520handles.pdf" },
  { id: "dnd-pocket-26-27", brandSlug: "dnd", brandName: "DND", title: "Catalogue Pocket 26–27", line: "The same range, pocket-sized for site visits.", edition: "2026–27", kind: "catalogue", cover: "/images/catalogues/dnd-pocket-26-27.jpg", viewer: "https://view.dndhandles.it/pocket/", download: "https://view.publitas.com/78088/1441496/pdfs/8d5eeab0-11e4-4437-a0dd-faa6b33b2d88.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520Handles%2520Pocket%252026-27.pdf" },
  { id: "dnd-forte", brandSlug: "dnd", brandName: "DND", title: "Forte PVD", line: "The PVD finish range: how it is applied, what it resists and how it ages.", kind: "finishes", cover: "/images/catalogues/dnd-forte.jpg", viewer: "https://view.dndhandles.it/dnd-pvd-forte/", download: "https://view.publitas.com/78088/1135451/pdfs/60c41772-5141-4548-932b-6a6124289cbc.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520-%2520PVD%2520Forte%25C2%25AE.pdf" },
  { id: "dnd-technical-drawings", brandSlug: "dnd", brandName: "DND", title: "Technical Drawings", line: "Dimensioned drawings for every lever, rose and pull handle in the range.", kind: "technical", cover: "/images/catalogues/dnd-technical-drawings.jpg", viewer: "https://view.dndhandles.it/technical-drawings/", download: "https://view.publitas.com/78088/1988461/pdfs/782076df-5349-4cd5-b36a-00c4eb32ed8e.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520technical%2520drawings.pdf" },
  { id: "dnd-pull-handles", brandSlug: "dnd", brandName: "DND", title: "Pull Handles", line: "Bar, tubular and custom-length pulls for entrances and glass doors.", kind: "brochure", cover: "/images/catalogues/dnd-pull-handles.jpg", viewer: "https://view.dndhandles.it/pull-handles/", download: "https://view.dndhandles.it/78088/1703786/pdfs/7a53197f-64de-42b2-996b-bb3a5415d431.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520pull%2520handles.pdf" },
  { id: "dnd-crisalide-dune", brandSlug: "dnd", brandName: "DND", title: "Crisalide and Dune", line: "The Crisalide and Dune collections.", kind: "brochure", cover: "/images/catalogues/dnd-crisalide-dune.jpg", viewer: "https://view.dndhandles.it/crisalide-dune/", download: "https://view.publitas.com/78088/1630631/pdfs/480a12ec-c0de-4c3a-bd82-e547ad05d016.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Crisalide%2520-%2520Dune%2520%257C%2520Dnd%2520handles.pdf" },
  { id: "dnd-unico", brandSlug: "dnd", brandName: "DND", title: "Unico System", line: "The Unico door locking system.", kind: "brochure", cover: "/images/catalogues/dnd-unico.jpg", viewer: "https://view.dndhandles.it/unico-system/", download: "https://view.publitas.com/78088/1598540/pdfs/32bf377f-1a74-4e5b-a14c-88ea7c4001e5.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Brochure%2520sistema%2520Unico%2520-%2520dndhandles.pdf" },
  { id: "dnd-inblack", brandSlug: "dnd", brandName: "DND", title: "InBlack", line: "The InBlack finish brochure.", kind: "finishes", cover: "/images/catalogues/dnd-inblack.jpg", viewer: "https://view.dndhandles.it/inblack/", download: "https://view.publitas.com/78088/1588423/pdfs/6eb2d0c1-42a4-40b6-8acc-d784e7f6517f.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520handles%2520-%2520Brochure%2520inblack.pdf" },
  { id: "dnd-timeless", brandSlug: "dnd", brandName: "DND", title: "Timeless", line: "The Timeless collection.", kind: "brochure", cover: "/images/catalogues/dnd-timeless.jpg", viewer: "https://view.dndhandles.it/timeless/", download: "https://view.publitas.com/78088/1478163/pdfs/32dac7d2-653f-4bd1-8c6e-21a034acd471.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Brochure%2520Timeless%2520%257C%2520Dnd%2520handles.pdf" },
  { id: "dnd-luce", brandSlug: "dnd", brandName: "DND", title: "Luce", line: "The Luce collection.", kind: "brochure", cover: "/images/catalogues/dnd-luce.jpg", viewer: "https://view.dndhandles.it/luce/", download: "https://view.publitas.com/78088/1431560/pdfs/952cfa03-cfc6-4d85-a59d-c2c37cf33c49.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Brochure%2520Luce%2520%257C%2520Dnd%2520handles.pdf" },
  { id: "dnd-poggimariani", brandSlug: "dnd", brandName: "DND", title: "Poggimariani", line: "The Poggimariani collection.", kind: "brochure", cover: "/images/catalogues/dnd-poggimariani.jpg", viewer: "https://view.dndhandles.it/poggimariani/", download: "https://view.publitas.com/78088/1308987/pdfs/80e65c56-d7d1-489d-854e-eadd94325c6a.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520Poggimariani%2520catalogue.pdf" },
  { id: "dnd-infinito", brandSlug: "dnd", brandName: "DND", title: "(IN)finito", line: "A collection designed with Alfonso Femia.", kind: "brochure", cover: "/images/catalogues/dnd-infinito.jpg", viewer: "https://view.dndhandles.it/infinito-alfonso-femia-af-design/", download: "https://view.publitas.com/78088/1274886/pdfs/c3242429-9cea-4541-89f6-e067e84785eb.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27%2528IN%2529finito%2520-%2520Alfonso%2520Femia%2520af%252Adesign.pdf" },
  { id: "dnd-due", brandSlug: "dnd", brandName: "DND", title: "DUE", line: "A collection designed with Stefano Boeri Architetti.", kind: "brochure", cover: "/images/catalogues/dnd-due.jpg", viewer: "https://view.dndhandles.it/due-stefano-boeri-architetti/", download: "https://view.publitas.com/78088/1274885/pdfs/beefc385-d09d-4189-b0a5-9f246dd631f2.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27DUE%2520-%2520Stefano%2520Boeri%2520Architetti.pdf" },
  { id: "dnd-handling-architecture", brandSlug: "dnd", brandName: "DND", title: "Handling Architecture", line: "DND's brochure for architectural hardware.", kind: "brochure", cover: "/images/catalogues/dnd-handling-architecture.png", viewer: "https://view.dndhandles.it/dnd-architettura-per-le-mani/", download: "https://view.publitas.com/78088/1120637/pdfs/8ed41f64-2671-49d4-af6d-3a31550a8b33.pdf?response-content-disposition=attachment%3B+filename%2A%3DUTF-8%27%27Dnd%2520Handles%2520%2520-%2520Dnd%2520architettura%2520per%2520le%2520mani.pdf" },


  // Blum
  { id: "blum-catalogue", brandSlug: "blum", brandName: "Blum", title: "Blum Catalogue", line: "Lift, hinge, box and runner systems with the fitting instructions for each.", kind: "catalogue", cover: "/images/showroom-blum.webp", browse: "https://www.blum.com/" },
  { id: "blum-planning", brandSlug: "blum", brandName: "Blum", title: "Planning and Assembly", line: "Cabinet planning dimensions, drilling patterns and assembly sequences.", kind: "technical", cover: "/images/lift-mechanism.webp", browse: "https://www.blum.com/" },

  // Hettich
  { id: "hettich-technical", brandSlug: "hettich", brandName: "Hettich", title: "Technik & Anwendung", line: "The Hettich technical catalogue: drawer, hinge, sliding and folding systems.", kind: "catalogue", cover: "/images/showroom-hinges.webp", browse: "https://www.hettich.com/" },
  { id: "hettich-avantech", brandSlug: "hettich", brandName: "Hettich", title: "AvanTech YOU", line: "The drawer platform: heights, colours and the lighting option.", kind: "brochure", cover: "/images/drawer-organizer.webp", browse: "https://www.hettich.com/" },

  // Häfele
  { id: "hafele-complete", brandSlug: "hafele", brandName: "Häfele", title: "The Complete Häfele", line: "Furniture fittings, architectural hardware and lighting in one reference.", kind: "catalogue", cover: "/images/showroom-certificate.webp", browse: "https://www.hafele.com/" },

  // Salice
  { id: "salice-catalogue", brandSlug: "salice", brandName: "Salice", title: "Salice General Catalogue", line: "Concealed hinges, lift systems and drawer runners with adjustment ranges.", kind: "catalogue", cover: "/images/lift-cabinet.webp", browse: "https://www.salice.com/" },

  // Kesseböhmer
  { id: "kessebohmer-storage", brandSlug: "kessebohmer", brandName: "Kesseböhmer", title: "Kitchen Storage Systems", line: "Corner, larder and base-unit pull-outs with load ratings and cabinet widths.", kind: "catalogue", cover: "/images/kitchen-corner.webp", browse: "https://www.kesseboehmer.com/" },

  // Barazza
  { id: "barazza-catalogue", brandSlug: "barazza", brandName: "Barazza", title: "Barazza Catalogue", line: "Stainless steel sinks, hobs and built-in appliances.", kind: "catalogue", cover: "/images/drawer-cutlery.webp", browse: "https://www.barazzasrl.it/" },

  // Hawa
  { id: "hawa-sliding", brandSlug: "hawa", brandName: "Hawa", title: "Hawa Sliding Solutions", line: "Running gear for wardrobe, room and folding doors, by weight and door type.", kind: "catalogue", cover: "/images/kitchen-pullout.webp", browse: "https://www.hawa.com/" },
];

export const catalogueBrands = () => {
  const seen = new Map<string, { slug: string; name: string; count: number }>();
  for (const item of CATALOGUES) {
    const entry = seen.get(item.brandSlug) ?? { slug: item.brandSlug, name: item.brandName, count: 0 };
    entry.count += 1;
    seen.set(item.brandSlug, entry);
  }
  return [...seen.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

export function findCatalogue(id: string | undefined) {
  return CATALOGUES.find((item) => item.id === id);
}

/** The same PDF, without the attachment header, so a browser can show it inline. */
export function cataloguePdfSrc(download: string) {
  return download.split("?")[0] ?? download;
}
