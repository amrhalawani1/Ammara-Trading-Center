// Merges the extracted Dnd facts (./data/dnd-raw.json) with ATC's authored copy (./dnd-copy.ts)
// and regenerates artifacts/api-server/src/lib/catalog-extracted.ts.
// Existing entries for other brands are preserved; entries whose slug is produced here are replaced.
// Run: pnpm --filter @workspace/scripts exec tsx src/dnd-merge.ts
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { COPY, DESIGNERS } from "./dnd-copy.js";
import type { RawProduct } from "./dnd-extract.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const RAW = resolve(HERE, "../data/dnd-raw.json");
const TARGET = resolve(HERE, "../../artifacts/api-server/src/lib/catalog-extracted.ts");

const HEADER = `// Generated from the partner-brand product extraction (DND, Blum, Häfele, Barazza).
// Facts (names, codes, item numbers, specs, finishes) are recorded as published by each brand.
// Summaries are written for ATC, not copied. Images are placeholders pending usage rights.
// Regenerate rather than hand-edit: pnpm --filter @workspace/scripts exec tsx src/dnd-merge.ts
import type { SeedProduct } from "./catalog-seed";

export const extractedProducts: SeedProduct[] = `;

/**
 * What the piece actually is. A Dnd family (ginkgo, timeless, crisalide) runs across doors,
 * windows, sliding doors and furniture, so the name alone does not identify a product -
 * every entry carries its type, taken from the Dnd catalogue section it sits in.
 */
const TYPE_BY_SECTION: Record<string, string> = {
  "maniglie-per-porte": "Door lever",
  "maniglie-per-finestre": "Window handle",
  "maniglie-per-porte-scorrevoli": "Sliding door flush pull",
  "maniglioni-porte": "Entrance pull handle",
  "maniglioni-per-alzante-scorrevole": "Lift-and-slide pull handle",
  "pomoli-per-porte": "Door knob",
  "pomolini-e-accessori-per-mobili": "Furniture knob",
  fermaporta: "Door stop",
  "sistemi-di-chiusura": "Locking system",
  chiavi: "Key",
  appendini: "Hanger",
};

/** Dnd finish codes carry their base metal: O = brass, A = aluminium, PVD = coating. */
function materialFrom(raw: RawProduct): string | null {
  const labels = raw.finishes.map((f) => f.label.toLowerCase());
  if (labels.some((l) => l.includes("brass"))) return "Brass";
  if (labels.some((l) => l.includes("aluminium"))) return "Aluminium";
  return null;
}

function cleanAwards(raw: RawProduct): string[] {
  return [
    ...new Set(
      raw.awards
        .map((a) => /((?:[A-Z][A-Za-z]+ )*Design Awards? (?:19|20)\d{2})/.exec(a)?.[1] ?? null)
        .map((a) => a?.replace(/^(?:Winner|Winners)\s+/i, "") ?? null)
        .filter((a): a is string => Boolean(a)),
    ),
  ];
}

function build(raw: RawProduct): Record<string, unknown> | null {
  const copy = COPY[raw.handleSlug];
  if (!copy) return null;

  // The mobile finish popup repeats the same swatches under a generic heading.
  const finishes = raw.finishes.filter(
    (f, i, all) => f.group !== "Finishes" || !all.some((o, j) => j !== i && o.code === f.code && o.group !== "Finishes"),
  );
  const uniqueLabels = [...new Set(finishes.map((f) => f.label))];
  const material = copy.material ?? materialFrom(raw);
  const awards = cleanAwards(raw);
  const badges = [...raw.badges, ...(awards.length ? ["Winner"] : [])];
  const designerName = raw.designer && !/technical division/i.test(raw.designer) ? raw.designer : null;
  const designerBio = designerName ? DESIGNERS[designerName] : undefined;

  const type = TYPE_BY_SECTION[raw.sectionSlug] ?? null;

  const specs: { label: string; value: string; group: string | null }[] = [];
  if (type) specs.push({ label: "Type", value: type, group: "Other" });
  if (raw.designer) specs.push({ label: "Designer", value: raw.designer, group: "Other" });
  if (copy.sku) specs.push({ label: "Model", value: copy.sku, group: "Other" });
  if (raw.design) specs.push({ label: "Design", value: raw.design, group: "Other" });
  if (raw.roses.length) specs.push({ label: "Rose", value: raw.roses.join(", "), group: "Installation" });
  else if (raw.unico) specs.push({ label: "Rose", value: "unico", group: "Installation" });
  if (material) specs.push({ label: "Material", value: material, group: "Material" });
  specs.push({ label: "Application", value: copy.applications.join(", "), group: "Installation" });
  if (uniqueLabels.length) {
    const roseGroups = new Set(finishes.map((f) => f.group).filter((g) => g !== "Finishes"));
    specs.push({
      label: "Finishes",
      value: roseGroups.size > 1 ? `${uniqueLabels.length} per rose type` : `${uniqueLabels.length} available`,
      group: "Other",
    });
  }

  const roseOf = (group: string): string | null =>
    group === "Unico rose" ? "unico" : group === "Standard rose" ? "standard" : null;

  return {
    title: copy.title ?? raw.title,
    slug: copy.slug,
    brandSlug: "dnd",
    category: copy.category,
    family: copy.family,
    sku: copy.sku ?? null,
    description: copy.summary,
    specs,
    finishes: uniqueLabels,
    images: [],
    editorial: {
      statement: copy.statement,
      ...(awards.length ? { awards } : {}),
      ...(designerName && designerBio ? { designer: { name: designerName, bio: designerBio, url: null } } : {}),
    },
    details: {
      sourceUrl: raw.sourceUrl,
      collection: copy.family,
      // The last segment is read as the product type across the site, and Dnd's own section
      // name ("Handles for windows") only repeats it, so the ATC type stands alone.
      brandCategoryPath: type
        ? [type]
        : raw.breadcrumb.filter((c) => c !== "Products" && c.toLowerCase() !== raw.title.toLowerCase()),
      badges,
      summary: copy.summary,
      features: copy.features.map((title) => ({ title, body: null, image: null })),
      variants: finishes.map((f) => ({
        code: f.code,
        label: f.label,
        kind: "finish",
        articleNumber: null,
        attributes: { group: f.group, ...(roseOf(f.group) ? { rose: roseOf(f.group) as string } : {}) },
        image: null,
      })),
      applications: copy.applications,
      downloads: raw.downloads.map((label) => ({ label, fileType: "PDF" })),
      media: [],
      related: raw.family.filter((f) => f.toLowerCase() !== raw.title.toLowerCase()),
      videos: raw.videos,
    },
    isFeatured: copy.featured ?? false,
    status: "published",
  };
}

/**
 * Slugs dropped from the catalogue. dnd-ginkgo-pull-handle duplicated the already-imported
 * dnd-ginkgo: Dnd publishes that pull handle under two paths, /maniglioni-porte/ and
 * /door-and-gate-pull-handles/, so it was extracted twice under different slugs.
 */
const RETIRED_SLUGS = new Set(["dnd-ginkgo-pull-handle"]);

/** Dnd's own section names on entries imported earlier, mapped to the vocabulary above. */
const LEGACY_TYPES: Record<string, string> = {
  "Handles for doors": "Door lever",
  "Handles for windows": "Window handle",
  "Door and gate pull handles": "Entrance pull handle",
  "Handles for sliding doors": "Sliding door flush pull",
  "Furniture knobs and accessories": "Furniture knob",
  "Door knobs": "Door knob",
};

/** Brings Dnd entries generated before types existed onto the same vocabulary. */
function normaliseLegacy(product: Record<string, unknown>): Record<string, unknown> {
  if (product.brandSlug !== "dnd") return product;
  const details = product.details as { brandCategoryPath?: string[] } | null;
  const path = details?.brandCategoryPath ?? [];
  const type = LEGACY_TYPES[path[0] ?? ""];
  if (!type) return product;

  const specs = product.specs as { label: string; value: string; group?: string | null }[];
  return {
    ...product,
    specs: specs.some((s) => s.label === "Type") ? specs : [{ label: "Type", value: type, group: "Other" }, ...specs],
    details: { ...details, brandCategoryPath: [type, ...path.slice(1)] },
  };
}

async function main(): Promise<void> {
  const rawFile = JSON.parse(await readFile(RAW, "utf8")) as { results: RawProduct[] };
  const built = rawFile.results.map(build).filter((p): p is Record<string, unknown> => p !== null);
  const newSlugs = new Set(built.map((p) => p.slug as string));

  const { extractedProducts } = (await import(TARGET)) as { extractedProducts: Record<string, unknown>[] };
  const kept = extractedProducts
    .filter((p) => !newSlugs.has(p.slug as string) && !RETIRED_SLUGS.has(p.slug as string))
    .map(normaliseLegacy);

  const all = [...kept, ...built];
  await writeFile(TARGET, `${HEADER}${JSON.stringify(all, null, 2)};\n`);

  const byBrand = all.reduce<Record<string, number>>((acc, p) => {
    const b = p.brandSlug as string;
    acc[b] = (acc[b] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`kept ${kept.length}, generated ${built.length}, total ${all.length}`);
  console.log("by brand:", byBrand);
}

await main();
