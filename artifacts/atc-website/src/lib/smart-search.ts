import type { Brand, Product } from "@workspace/api-client-react";
import { CATALOGUES } from "@/lib/catalogues";
import { designerOf } from "@/lib/catalog-filters";
import { primaryImage } from "@/lib/product-media";
import { PROJECTS } from "@/lib/projects";
import { ROOMS } from "@/lib/selector";
import { SHOWROOMS, showroomHref } from "@/lib/showrooms";
import { SOLUTIONS } from "@/lib/solutions";

export type SearchKind = "product" | "brand" | "solution" | "problem" | "project" | "showroom" | "catalogue" | "page";

export interface SearchHit {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  image?: string | null;
  score: number;
}

export interface SearchGroups {
  problems: SearchHit[];
  solutions: SearchHit[];
  products: SearchHit[];
  brands: SearchHit[];
  projects: SearchHit[];
  showrooms: SearchHit[];
  catalogues: SearchHit[];
  pages: SearchHit[];
}

const GROUP_LIMIT: Record<keyof SearchGroups, number> = {
  problems: 3,
  solutions: 3,
  products: 6,
  brands: 3,
  projects: 2,
  showrooms: 2,
  catalogues: 2,
  pages: 3,
};

const PAGES: { title: string; subtitle: string; href: string; terms: string }[] = [
  { title: "Products", subtitle: "Browse by what the hardware does", href: "/catalog", terms: "catalogue catalog products fittings hardware" },
  { title: "Brands", subtitle: "The manufacturers ATC represents", href: "/brands", terms: "brands manufacturers partners houses" },
  { title: "Showrooms", subtitle: "Al-Bayader and Al-Wehdat", href: "/showroom", terms: "showroom visit floor amman al-bayader al-wehdat" },
  { title: "Projects", subtitle: "Where our hardware is installed", href: "/projects", terms: "projects references hotels hospitality" },
  { title: "Catalogues", subtitle: "Manufacturer catalogues and PDFs", href: "/catalogues", terms: "catalogues brochures pdf download booklet" },
  { title: "Resources", subtitle: "Data sheets and guides", href: "/resources", terms: "resources documents datasheet drawings cad bim" },
  { title: "Shortlists", subtitle: "Products you have saved", href: "/lists", terms: "shortlist list saved specification" },
  { title: "About", subtitle: "Three generations in Amman", href: "/about", terms: "about story family amara 1977" },
  { title: "Contact", subtitle: "Write, call or come in", href: "/contact", terms: "contact email phone enquiry" },
];

/** Everyday words that should land on a solution even when the visitor does not know the catalogue name. */
const SOLUTION_ALIASES: Record<string, string[]> = {
  "door-window-handles": ["lever", "levers", "door handle", "window handle", "knob", "rose"],
  "cabinet-handles": ["pull", "pulls", "cabinet handle", "wardrobe handle", "knob"],
  hinges: ["hinge", "soft close hinge", "concealed hinge", "cup hinge"],
  "drawer-systems": ["drawer", "drawers", "runner", "runners", "slide", "box system", "soft close drawer", "slam", "sag"],
  "lift-systems": ["lift", "flap", "wall cabinet", "overhead", "lift-up"],
  "opening-closing": ["soft close", "push to open", "handleless", "closer", "latch", "lock", "door stop"],
  "sliding-folding": ["sliding", "pocket door", "folding", "wardrobe door", "running gear"],
  "kitchen-storage": ["larder", "pull-out", "corner", "pantry", "carousel", "organiser"],
  lighting: ["led", "cabinet light", "sensor light"],
  "sinks-taps": ["sink", "tap", "mixer", "basin"],
  "cooking-appliances": ["hob", "hobs", "oven", "appliance"],
};

interface Entry {
  kind: SearchKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image?: string | null;
  /** Primary text, scored first. */
  primary: string;
  /** Secondary text, scored lower. */
  secondary: string;
}

const blob = (...parts: Array<string | null | undefined>) => parts.filter(Boolean).join(" ").toLowerCase();

function productPrimary(product: Product): string {
  return blob(product.name, product.sku, product.details?.collection);
}

function productSecondary(product: Product): string {
  const details = product.details;
  return blob(
    product.brandName,
    product.category,
    product.family,
    designerOf(product),
    details?.summary,
    ...(details?.brandCategoryPath ?? []),
    ...(details?.variants ?? []).flatMap((variant) => [variant.label, variant.code, variant.articleNumber]),
    ...(details?.applications ?? []),
    ...(product.finishes ?? []),
  );
}

function buildEntries(products: Product[], brands: Brand[]): Entry[] {
  const entries: Entry[] = [];

  for (const product of products) {
    entries.push({
      kind: "product",
      id: `product:${product.slug}`,
      title: product.name,
      subtitle: [product.brandName, product.sku, product.category].filter(Boolean).join(" · "),
      href: `/products/${product.slug}`,
      image: primaryImage(product),
      primary: productPrimary(product),
      secondary: productSecondary(product),
    });
  }

  for (const brand of brands) {
    entries.push({
      kind: "brand",
      id: `brand:${brand.slug}`,
      title: brand.name,
      subtitle: [brand.country, brand.category].filter(Boolean).join(" · ") || "Partner manufacturer",
      href: `/brands/${brand.slug}`,
      image: brand.coverImage,
      primary: blob(brand.name, brand.slug),
      secondary: blob(brand.country, brand.origin, brand.category, brand.summary, brand.description),
    });
  }

  for (const solution of SOLUTIONS) {
    entries.push({
      kind: "solution",
      id: `solution:${solution.slug}`,
      title: solution.name,
      subtitle: solution.line,
      href: `/catalog?solution=${solution.slug}`,
      primary: blob(solution.name, solution.slug, ...(SOLUTION_ALIASES[solution.slug] ?? [])),
      secondary: blob(solution.line),
    });
  }

  for (const room of ROOMS) {
    for (const problem of room.problems) {
      entries.push({
        kind: "problem",
        id: `problem:${problem.id}`,
        title: problem.label,
        subtitle: `${room.label} · ${SOLUTIONS.find((s) => s.slug === problem.solution)?.name ?? "Catalogue"}`,
        href: `/catalog?solution=${problem.solution}`,
        primary: blob(problem.label, room.label),
        secondary: blob(problem.solution, room.hint),
      });
    }
  }

  for (const project of PROJECTS) {
    entries.push({
      kind: "project",
      id: `project:${project.slug}`,
      title: project.title,
      subtitle: `${project.sector} · ${project.location}`,
      href: `/projects/${project.slug}`,
      image: project.cover,
      primary: blob(project.title, project.location, project.sector, project.clientCleared ? project.client : undefined),
      secondary: blob(project.scope, ...project.story, ...project.brands, ...project.systems),
    });
  }

  for (const showroom of SHOWROOMS) {
    entries.push({
      kind: "showroom",
      id: `showroom:${showroom.slug}`,
      title: showroom.name,
      subtitle: showroom.summary,
      href: showroomHref(showroom.slug),
      image: showroom.gallery[0]?.src,
      primary: blob(showroom.name, showroom.role, showroom.slug),
      secondary: blob(showroom.summary, showroom.headline, ...showroom.story, showroom.addressLines.join(" ")),
    });
  }

  for (const catalogue of CATALOGUES) {
    entries.push({
      kind: "catalogue",
      id: `catalogue:${catalogue.id}`,
      title: catalogue.title,
      subtitle: `${catalogue.brandName} · ${catalogue.line}`,
      href: "/catalogues",
      image: catalogue.cover,
      primary: blob(catalogue.title, catalogue.brandName, catalogue.edition),
      secondary: blob(catalogue.line, catalogue.kind),
    });
  }

  for (const page of PAGES) {
    entries.push({
      kind: "page",
      id: `page:${page.href}`,
      title: page.title,
      subtitle: page.subtitle,
      href: page.href,
      primary: blob(page.title),
      secondary: blob(page.subtitle, page.terms),
    });
  }

  return entries;
}

function fieldScore(haystack: string, term: string): number {
  if (!term || !haystack) return 0;
  if (haystack === term) return 100;
  if (haystack.startsWith(term)) return 72;
  if (haystack.includes(` ${term}`)) return 54;
  if (haystack.includes(term)) return 28;
  return 0;
}

function scoreEntry(entry: Entry, terms: string[]): number {
  let total = 0;
  let matched = 0;
  let primaryHits = 0;
  for (const term of terms) {
    const primary = fieldScore(entry.primary, term);
    const secondary = fieldScore(entry.secondary, term);
    const best = Math.max(primary, secondary * 0.45);
    if (best === 0) continue;
    matched += 1;
    if (primary > 0) primaryHits += 1;
    total += best;
  }
  if (matched === 0) return 0;
  // Conversational queries ("drawers slam") should still surface the fitting, even if
  // only one of the words is in the catalogue name.
  if (matched < terms.length) {
    if (primaryHits === 0 && total < 40) return 0;
    total *= matched / terms.length;
  }
  if (entry.kind === "problem") total += 8;
  if (entry.kind === "solution") total += 6;
  if (entry.kind === "product") total += 4;
  return total;
}

const emptyGroups = (): SearchGroups => ({
  problems: [],
  solutions: [],
  products: [],
  brands: [],
  projects: [],
  showrooms: [],
  catalogues: [],
  pages: [],
});

const KIND_TO_GROUP: Record<SearchKind, keyof SearchGroups> = {
  problem: "problems",
  solution: "solutions",
  product: "products",
  brand: "brands",
  project: "projects",
  showroom: "showrooms",
  catalogue: "catalogues",
  page: "pages",
};

/** Ranked, grouped hits. An empty query returns the suggestions a visitor would start with. */
export function searchCatalog(query: string, products: Product[], brands: Brand[]): { groups: SearchGroups; hits: SearchHit[]; productTotal: number } {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const entries = buildEntries(products, brands);

  if (terms.length === 0) {
    const groups = emptyGroups();
    groups.problems = ROOMS.flatMap((room) =>
      room.problems.slice(0, 1).map((problem) => ({
        id: `problem:${problem.id}`,
        kind: "problem" as const,
        title: problem.label,
        subtitle: `${room.label} · ${SOLUTIONS.find((s) => s.slug === problem.solution)?.name ?? ""}`,
        href: `/catalog?solution=${problem.solution}`,
        score: 0,
      })),
    ).slice(0, 4);
    groups.solutions = SOLUTIONS.slice(0, 6).map((solution) => ({
      id: `solution:${solution.slug}`,
      kind: "solution" as const,
      title: solution.name,
      subtitle: solution.line,
      href: `/catalog?solution=${solution.slug}`,
      score: 0,
    }));
    groups.pages = PAGES.slice(0, 4).map((page) => ({
      id: `page:${page.href}`,
      kind: "page" as const,
      title: page.title,
      subtitle: page.subtitle,
      href: page.href,
      score: 0,
    }));
    return { groups, hits: flattenGroups(groups), productTotal: 0 };
  }

  const scored: SearchHit[] = [];
  for (const entry of entries) {
    const score = scoreEntry(entry, terms);
    if (score === 0) continue;
    scored.push({
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      subtitle: entry.subtitle,
      href: entry.href,
      image: entry.image,
      score,
    });
  }
  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const groups = emptyGroups();
  const productTotal = scored.filter((hit) => hit.kind === "product").length;
  for (const hit of scored) {
    const key = KIND_TO_GROUP[hit.kind];
    if (groups[key].length < GROUP_LIMIT[key]) groups[key].push(hit);
  }

  return { groups, hits: flattenGroups(groups), productTotal };
}

function flattenGroups(groups: SearchGroups): SearchHit[] {
  return [
    ...groups.problems,
    ...groups.solutions,
    ...groups.products,
    ...groups.brands,
    ...groups.projects,
    ...groups.showrooms,
    ...groups.catalogues,
    ...groups.pages,
  ];
}

export const catalogueSearchHref = (query: string) => `/catalog?q=${encodeURIComponent(query.trim())}`;
