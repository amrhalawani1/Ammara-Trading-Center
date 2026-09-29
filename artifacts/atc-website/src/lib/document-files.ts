/**
 * Manufacturer files for the document index. The catalogue sheet is preferred;
 * the technical sheet is used when the brand does not publish a separate catalogue PDF.
 * Collected from each product page on dndhandles.it.
 */
const FILES: Record<string, string> = {
  "https://www.dndhandles.it/en/products/appendini/crisalide-appendino/": "https://magic.dndhandles.it/dnd-magic-images/catalog/appendino/crisalide.pdf",
  "https://www.dndhandles.it/en/products/chiavi/dnd/": "https://magic.dndhandles.it/dnd-magic-images/catalog/chiavi/dnd.pdf",
  "https://www.dndhandles.it/en/products/door-and-gate-pull-handles/maniglione-ginkgo/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglioni/ginkgo.pdf",
  "https://www.dndhandles.it/en/products/fermaporta/chiocciola/": "https://magic.dndhandles.it/dnd-magic-images/catalog/fermaporta/chiocciola.pdf",
  "https://www.dndhandles.it/en/products/fermaporta/ring/": "https://magic.dndhandles.it/dnd-magic-images/catalog/fermaporta/ring.pdf",
  "https://www.dndhandles.it/en/products/furniture-knobs-and-accessories/dune-knob/": "https://magic.dndhandles.it/dnd-magic-images/catalog/pomolini-e-accessori-per-mobili/dune.pdf",
  "https://www.dndhandles.it/en/products/handles-for-doors/anik-line/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglie-porta/anik-line.pdf",
  "https://www.dndhandles.it/en/products/handles-for-doors/crisalide/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglie-porta/crisalide.pdf",
  "https://www.dndhandles.it/en/products/handles-for-doors/timeless/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglie-porta/timeless.pdf",
  "https://www.dndhandles.it/en/products/handles-for-windows/arete-dk/": "https://magic.dndhandles.it/wp-json/dnd/v1/tech-sheet?id=3853&output=stream&lang=en",
  "https://www.dndhandles.it/en/products/maniglie-per-finestre/ginkgo-dk/": "https://magic.dndhandles.it/wp-json/dnd/v1/tech-sheet?id=3607&output=stream&lang=en",
  "https://www.dndhandles.it/en/products/maniglie-per-finestre/minima-dk/": "https://magic.dndhandles.it/wp-json/dnd/v1/tech-sheet?id=4034&output=stream&lang=en",
  "https://www.dndhandles.it/en/products/maniglie-per-finestre/timeless-dk/": "https://magic.dndhandles.it/wp-json/dnd/v1/tech-sheet?id=13461&output=stream&lang=en",
  "https://www.dndhandles.it/en/products/maniglie-per-porte/lucrezia/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglie-porta/lucrezia.pdf",
  "https://www.dndhandles.it/en/products/maniglie-per-porte/minima/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglie-porta/minima.pdf",
  "https://www.dndhandles.it/en/products/maniglie-per-porte/pencil/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglie-porta/pencil.pdf",
  "https://www.dndhandles.it/en/products/maniglie-per-porte/zeppelin/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglie-porta/zeppelin.pdf",
  "https://www.dndhandles.it/en/products/maniglioni-per-alzante-scorrevole/edra/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglioni-per-alzante-scorrevole/edra.pdf",
  "https://www.dndhandles.it/en/products/maniglioni-per-alzante-scorrevole/slide/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglioni-per-alzante-scorrevole/slide.pdf",
  "https://www.dndhandles.it/en/products/maniglioni-porte/maniglione-pencil/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglioni/pencil.pdf",
  "https://www.dndhandles.it/en/products/maniglioni-porte/maniglione-tube-round/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglioni/tube-round.pdf",
  "https://www.dndhandles.it/en/products/maniglioni-porte/maniglione-zeppelin/": "https://magic.dndhandles.it/dnd-magic-images/catalog/maniglioni/zeppelin.pdf",
  "https://www.dndhandles.it/en/products/pomoli-per-porte/pomoli-olive/": "https://magic.dndhandles.it/dnd-magic-images/catalog/pomoli/olive.pdf",
  "https://www.dndhandles.it/en/products/pomoli-per-porte/pomoli-sfera/": "https://magic.dndhandles.it/dnd-magic-images/catalog/pomoli/sfera.pdf",
  "https://www.dndhandles.it/en/products/pomoli-per-porte/pomolo-timeless/": "https://magic.dndhandles.it/dnd-magic-images/catalog/pomoli/timeless.pdf",
  "https://www.dndhandles.it/en/products/pomolini-e-accessori-per-mobili/crisalide-knob/": "https://magic.dndhandles.it/dnd-magic-images/catalog/pomolini-e-accessori-per-mobili/crisalide.pdf",
  "https://www.dndhandles.it/en/products/pomolini-e-accessori-per-mobili/lucrezia-knob/": "https://magic.dndhandles.it/dnd-magic-images/catalog/pomolini-e-accessori-per-mobili/lucrezia.pdf",
  "https://www.dndhandles.it/en/products/pomolini-e-accessori-per-mobili/timeless-knob/": "https://magic.dndhandles.it/dnd-magic-images/catalog/pomolini-e-accessori-per-mobili/timeless.pdf",
};

export function documentDownloadUrl(sourceUrl: string | null | undefined): string | null {
  if (!sourceUrl) return null;
  const key = sourceUrl.endsWith("/") ? sourceUrl : `${sourceUrl}/`;
  return FILES[key] ?? FILES[sourceUrl] ?? null;
}
