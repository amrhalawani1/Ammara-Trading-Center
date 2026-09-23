import type { Product } from "@workspace/api-client-react";
import { FINISH_FAMILY_ORDER, finishFamily, finishFamilyTone } from "@/lib/finishes";
import { productType, variantSummary } from "@/lib/product-media";

/** Sidebar facets. Values combine with OR inside a facet and AND across facets. */
export type FacetKey = "brand" | "type" | "finish" | "designer";

export const FACET_KEYS: FacetKey[] = ["brand", "type", "finish", "designer"];

export const SORTS = [
  { key: "featured", label: "Featured" },
  { key: "name-asc", label: "Name A to Z" },
  { key: "name-desc", label: "Name Z to A" },
  { key: "finishes", label: "Most finishes" },
] as const;

export type SortKey = (typeof SORTS)[number]["key"];

export interface CatalogFilters extends Record<FacetKey, string[]> {
  solution: string | null;
  query: string;
  sort: SortKey;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  tone?: string;
}

export const EMPTY_FILTERS: CatalogFilters = { solution: null, query: "", sort: "featured", brand: [], type: [], finish: [], designer: [] };

export function designerOf(product: Product): string | null {
  return product.editorial?.designer?.name ?? product.specs?.find((spec) => /^designer$/i.test(spec.label))?.value ?? null;
}

function facetValues(product: Product, key: FacetKey): string[] {
  switch (key) {
    case "brand":
      return [product.brandSlug];
    case "type": {
      const type = productType(product);
      return type ? [type] : [];
    }
    case "finish":
      return [...new Set((product.finishes ?? []).map((name) => finishFamily(name)?.label).filter((label): label is string => Boolean(label)))];
    case "designer": {
      const designer = designerOf(product);
      return designer ? [designer] : [];
    }
  }
}

/** Name, brand, type, collection, designer and every item number and finish code are searchable. */
function searchText(product: Product): string {
  const d = product.details;
  return [
    product.name,
    product.brandName,
    product.category,
    product.sku,
    d?.collection,
    designerOf(product),
    ...(d?.brandCategoryPath ?? []),
    ...(d?.variants ?? []).flatMap((v) => [v.label, v.code, v.articleNumber]),
    ...(d?.applications ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Whether a product passes the filters. `except` leaves one dimension out, which is how each
 * facet counts what selecting one of its options would return given everything else chosen.
 */
export function matches(product: Product, filters: CatalogFilters, solutionName: string | null, except?: FacetKey | "solution"): boolean {
  if (except !== "solution" && solutionName && product.category !== solutionName) return false;
  const terms = filters.query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length > 0) {
    const text = searchText(product);
    if (!terms.every((term) => text.includes(term))) return false;
  }
  return FACET_KEYS.every((key) => {
    if (key === except || filters[key].length === 0) return true;
    const values = facetValues(product, key);
    return filters[key].some((selected) => values.includes(selected));
  });
}

export function facetOptions(
  products: Product[],
  filters: CatalogFilters,
  solutionName: string | null,
  key: FacetKey,
  labelFor: (value: string) => string = (value) => value,
): FacetOption[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    for (const value of facetValues(product, key)) counts.set(value, counts.get(value) ?? 0);
  }
  for (const product of products) {
    if (!matches(product, filters, solutionName, key)) continue;
    for (const value of facetValues(product, key)) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  // Options that match nothing under the current filters are hidden, unless already selected.
  const options = [...counts.entries()]
    .filter(([value, count]) => count > 0 || filters[key].includes(value))
    .map(([value, count]) => ({
      value,
      label: labelFor(value),
      count,
      ...(key === "finish" ? { tone: finishFamilyTone(value) } : {}),
    }));

  if (key === "finish") {
    return options.sort((a, b) => FINISH_FAMILY_ORDER.indexOf(a.value) - FINISH_FAMILY_ORDER.indexOf(b.value));
  }
  return options.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

const variantCount = (product: Product) => Number(variantSummary(product)?.match(/^\d+/)?.[0] ?? 0);

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return list.sort((a, b) => b.name.localeCompare(a.name));
    case "finishes":
      return list.sort((a, b) => variantCount(b) - variantCount(a) || a.name.localeCompare(b.name));
    default:
      // Featured first, otherwise the order the catalogue API returns.
      return list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
}

const listParam = (params: URLSearchParams, name: string) =>
  params.getAll(name).flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean);

export function readFilters(search: string): CatalogFilters {
  const params = new URLSearchParams(search);
  const sort = params.get("sort");
  return {
    solution: params.get("solution"),
    query: params.get("q") ?? "",
    sort: SORTS.some((option) => option.key === sort) ? (sort as SortKey) : "featured",
    brand: listParam(params, "brand"),
    type: listParam(params, "type"),
    finish: listParam(params, "finish"),
    designer: listParam(params, "designer"),
  };
}

export function writeFilters(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.solution) params.set("solution", filters.solution);
  if (filters.query.trim()) params.set("q", filters.query.trim());
  for (const key of FACET_KEYS) if (filters[key].length) params.set(key, filters[key].join(","));
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  const search = params.toString();
  return search ? `?${search}` : "";
}

export const activeFacetCount = (filters: CatalogFilters) => FACET_KEYS.reduce((sum, key) => sum + filters[key].length, 0);
