import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpDown,
  LayoutGrid,
  MessageCircle,
  Rows3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useGetPublicCatalog } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { CatalogCard, hasPhoto } from "@/components/catalog/catalog-card";
import { CatalogRow, ROW_GRID } from "@/components/catalog/catalog-row";
import {
  CompareDialog,
  CompareTray,
  COMPARE_LIMIT,
  useCompare,
} from "@/components/catalog/compare";
import { CategoryNav } from "@/components/catalog/category-nav";
import { FilterPanel, type FilterGroup } from "@/components/catalog/filter-panel";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { apiErrorMessage } from "@/lib/api-error";
import {
  activeFacetCount,
  EMPTY_FILTERS,
  facetOptions,
  matches,
  readFilters,
  SORTS,
  sortProducts,
  writeFilters,
  type CatalogFilters,
  type FacetKey,
  type SortKey,
} from "@/lib/catalog-filters";
import { SOLUTIONS } from "@/lib/solutions";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const FACET_TITLES: Record<FacetKey, { title: string; allLabel: string; chip: string }> = {
  brand: { title: "Brands", allLabel: "All brands", chip: "Brand" },
  type: { title: "Product type", allLabel: "All types", chip: "Type" },
  finish: { title: "Finish colour", allLabel: "All colours", chip: "Finish" },
  designer: { title: "Designer", allLabel: "All designers", chip: "Designer" },
};

type View = "grid" | "index";
const VIEW_KEY = "atc-catalogue-view";
const SIDEBAR_KEY = "atc-catalogue-filters";
/** Products rendered before "Show more". Keeps a thousand-item catalogue light on first paint. */
const PAGE_SIZE = 24;
const GRID = "grid grid-cols-2 gap-x-4 gap-y-8 md:gap-y-10 xl:gap-x-5";
/** Columns above the phone breakpoints, depending on whether the facet column is open. */
const GRID_COLUMNS = { open: "lg:grid-cols-3 2xl:grid-cols-4", closed: "lg:grid-cols-4" } as const;

const readView = (): View => {
  try {
    return window.localStorage.getItem(VIEW_KEY) === "index" ? "index" : "grid";
  } catch {
    return "grid";
  }
};

const readSidebar = (): boolean => {
  try {
    return window.localStorage.getItem(SIDEBAR_KEY) !== "closed";
  } catch {
    return true;
  }
};

export default function Catalog() {
  const [filters, setFilters] = useState<CatalogFilters>(() => readFilters(window.location.search));
  const [view, setView] = useState<View>(readView);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(readSidebar);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [compareOpen, setCompareOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const compare = useCompare();
  const reduce = useReducedMotion();

  const { data: catalog, isLoading, error } = useGetPublicCatalog();
  const products = useMemo(() => catalog?.products ?? [], [catalog?.products]);

  useEffect(() => {
    window.history.replaceState({}, "", window.location.pathname + writeFilters(filters));
    setLimit(PAGE_SIZE);
  }, [filters]);

  useEffect(() => {
    try {
      window.localStorage.setItem(VIEW_KEY, view);
    } catch {
      /* private mode: the toggle still works for this visit */
    }
  }, [view]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_KEY, sidebarOpen ? "open" : "closed");
    } catch {
      /* private mode: the toggle still works for this visit */
    }
  }, [sidebarOpen]);

  const categoryNameBySlug = useMemo(() => {
    const map = new Map(SOLUTIONS.map((solution) => [solution.slug, solution.name]));
    for (const product of products) {
      if (!product.category || SOLUTIONS.some((solution) => solution.name === product.category)) continue;
      const slug = product.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (slug && !map.has(slug)) map.set(slug, product.category);
    }
    return map;
  }, [products]);
  const solutionName = filters.solution ? (categoryNameBySlug.get(filters.solution) ?? null) : null;

  const brandName = useCallback(
    (slug: string) =>
      catalog?.brands.find((brand) => brand.slug === slug)?.name ??
      products.find((p) => p.brandSlug === slug)?.brandName ??
      slug,
    [catalog?.brands, products],
  );

  const results = useMemo(
    () =>
      sortProducts(
        products.filter((product) => matches(product, filters, solutionName)),
        filters.sort,
      ),
    [products, filters, solutionName],
  );

  const shown = results.slice(0, limit);
  const remaining = results.length - shown.length;

  const groups: FilterGroup[] = useMemo(
    () =>
      (Object.keys(FACET_TITLES) as FacetKey[]).map((key) => ({
        key,
        title: FACET_TITLES[key].title,
        allLabel: FACET_TITLES[key].allLabel,
        options: facetOptions(
          products,
          filters,
          solutionName,
          key,
          key === "brand" ? brandName : undefined,
        ),
        selected: filters[key],
      })),
    [products, filters, solutionName, brandName],
  );

  /** Solution tabs count what each would show with the facets and search applied. */
  const solutionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products
      .filter((p) => matches(p, filters, solutionName, "solution"))
      .forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return counts;
  }, [products, filters, solutionName]);
  const allCount = [...solutionCounts.values()].reduce((sum, n) => sum + n, 0);
  const categories = useMemo(() => {
    const names = new Set(products.map((product) => product.category).filter(Boolean));
    const known = SOLUTIONS.filter((solution) => names.has(solution.name));
    const extra = [...names]
      .filter((name) => !SOLUTIONS.some((solution) => solution.name === name))
      .sort((a, b) => a.localeCompare(b));
    return [
      { slug: null as string | null, name: "Everything", count: allCount },
      ...known.map((solution) => ({
        slug: solution.slug as string | null,
        name: solution.name,
        count: solutionCounts.get(solution.name) ?? 0,
      })),
      ...extra.map((name) => ({
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        name,
        count: solutionCounts.get(name) ?? 0,
      })),
    ];
  }, [products, solutionCounts, allCount]);

  const toggleFacet = (key: FacetKey, value: string) =>
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((v) => v !== value)
        : [...current[key], value],
    }));
  const clearFacet = (key: FacetKey) => setFilters((current) => ({ ...current, [key]: [] }));
  const clearAll = () => setFilters((current) => ({ ...EMPTY_FILTERS, sort: current.sort }));
  const setSolution = (slug: string | null) =>
    setFilters((current) => ({ ...current, solution: slug }));

  const facetCount = activeFacetCount(filters);
  const hasFilters = facetCount > 0 || Boolean(filters.solution) || Boolean(filters.query.trim());
  const chips = (Object.keys(FACET_TITLES) as FacetKey[]).flatMap((key) =>
    filters[key].map((value) => ({
      key,
      value,
      label: key === "brand" ? brandName(value) : value,
    })),
  );

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    searchRef.current?.blur();
    resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const comparedProducts = compare.slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is (typeof products)[number] => Boolean(p));

  useEffect(() => {
    if (compareOpen && comparedProducts.length < 2) setCompareOpen(false);
  }, [compareOpen, comparedProducts.length]);

  const askHref = whatsappUrl(
    filters.query.trim()
      ? `Hello ATC, I am looking for "${filters.query.trim()}". Do you carry it?`
      : `Hello ATC, I am looking for ${solutionName ? solutionName.toLowerCase() : "a product"} that I could not find on the site.`,
  );

  const filterPanel = (
    <>
      <CategoryNav items={categories} activeSlug={filters.solution} onSelect={setSolution} />
      <FilterPanel
        groups={groups}
        onToggle={toggleFacet}
        onClearGroup={clearFacet}
        onClearAll={clearAll}
        hasFilters={facetCount > 0 || Boolean(filters.solution)}
      />
    </>
  );
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { type: "spring" as const, stiffness: 90, damping: 20, delay },
        };

  return (
    <MainLayout>
      {/* The desk: graphite band with the search in display type and the solutions as tabs. */}
      <section className="dark bg-background text-foreground" data-testid="section-catalogue-desk">
        <div className="container mx-auto px-4 pb-6 pt-6 md:pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <motion.h1 {...enter(0)} className="font-display text-3xl font-medium leading-none tracking-[-0.04em] md:text-4xl">
              Products
            </motion.h1>
            <motion.p {...enter(0)} className="font-mono text-sm tabular-nums text-foreground/60" data-testid="text-catalogue-total">
              {isLoading ? "" : products.length}
            </motion.p>
          </div>

          <motion.form
            {...enter(0.06)}
            onSubmit={submitSearch}
            role="search"
            className="relative mt-4"
          >
            <label className="block">
              <span className="sr-only">Search products</span>
              <input
                ref={searchRef}
                type="search"
                value={filters.query}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, query: event.target.value }))
                }
                placeholder="Name, brand, item no. or finish"
                autoComplete="off"
                className="peer h-auto w-full border-0 border-b border-foreground/25 bg-transparent py-3 pr-12 font-display text-2xl font-medium tracking-[-0.03em] text-foreground outline-none transition-colors placeholder:font-normal placeholder:text-foreground/35 focus:border-transparent md:text-3xl [&::-webkit-search-cancel-button]:hidden"
                data-testid="input-catalog-search"
              />
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100"
                aria-hidden
              />
            </label>
            {filters.query ? (
              <button
                type="button"
                onClick={() => setFilters((current) => ({ ...current, query: "" }))}
                className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-foreground/60 transition hover:text-foreground"
                aria-label="Clear search"
                data-testid="button-clear-search"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            ) : (
              <Search
                className="pointer-events-none absolute right-1 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40"
                strokeWidth={1.5}
                aria-hidden
              />
            )}
          </motion.form>
        </div>
      </section>

      {/* Rail: a graphite toolbar under the catalogue header. */}
      <div
        className="dark sticky z-30 border-b border-white/10 bg-background text-foreground transition-[top] duration-300"
        style={{ top: "var(--nav-offset, 76px)" }}
        data-testid="catalogue-rail"
      >
        <div className="container mx-auto flex h-14 items-center gap-3 px-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-expanded={sidebarOpen}
            aria-controls="catalogue-facets"
            className="hidden h-10 items-center gap-2.5 text-sm lg:inline-flex"
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className={cn("h-4 w-4", sidebarOpen ? "text-primary" : "text-foreground/70")} strokeWidth={1.75} aria-hidden />
            <span className="font-medium tracking-[-0.01em]">Filters</span>
            {(facetCount > 0 || filters.solution) && (
              <span className="font-mono text-[11px] tabular-nums text-primary">
                {(facetCount + (filters.solution ? 1 : 0))} active
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-10 items-center gap-2.5 text-sm lg:hidden"
            data-testid="button-open-filters"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
            Filters
            {(facetCount > 0 || filters.solution) && (
              <span className="font-mono text-[11px] tabular-nums text-primary">
                {facetCount + (filters.solution ? 1 : 0)}
              </span>
            )}
          </button>

          <span className="hidden h-4 w-px bg-foreground/15 sm:block" aria-hidden />
          <p className="whitespace-nowrap text-sm text-foreground/70">
            <span className="font-mono tabular-nums text-foreground" aria-live="polite" data-testid="text-result-count">
              {isLoading ? "" : results.length}
            </span>
            <span className="hidden sm:inline"> {results.length === 1 ? "product" : "products"}</span>
          </p>

          <div className="ml-auto flex items-center gap-1">
            <Select
              value={filters.sort}
              onValueChange={(value) => setFilters((current) => ({ ...current, sort: value as SortKey }))}
            >
              <SelectTrigger
                className="h-10 w-auto gap-2 rounded-none border-0 bg-transparent px-2 text-sm text-foreground shadow-none hover:bg-white/10 focus:ring-0"
                aria-label="Sort products"
                data-testid="select-sort"
              >
                <ArrowUpDown className="h-3.5 w-3.5 text-foreground/50" strokeWidth={1.75} />
                <span className="hidden md:inline">
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent align="end" className="rounded-none">
                {SORTS.map((option) => (
                  <SelectItem key={option.key} value={option.key} className="rounded-none">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative flex h-9 items-center" role="group" aria-label="View">
              <LayoutGroup id="catalogue-view">
                {(
                  [
                    { key: "grid", label: "Grid", Icon: LayoutGrid },
                    { key: "index", label: "List", Icon: Rows3 },
                  ] as const
                ).map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setView(key)}
                    aria-pressed={view === key}
                    aria-label={`${label} view`}
                    title={`${label} view`}
                    className={cn(
                      "relative flex h-9 items-center gap-1.5 px-2.5 text-xs transition-colors",
                      view === key ? "text-foreground" : "text-foreground/45 hover:text-foreground",
                    )}
                    data-testid={`button-view-${key}`}
                  >
                    {view === key && (
                      <motion.span
                        layoutId="view-indicator"
                        className="absolute inset-x-2 bottom-1 h-px bg-primary"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        aria-hidden
                      />
                    )}
                    <Icon className="relative h-3.5 w-3.5" strokeWidth={1.75} />
                    <span className="relative hidden sm:inline">{label}</span>
                  </button>
                ))}
              </LayoutGroup>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={resultsRef}
        className={cn(
          "container mx-auto grid scroll-mt-32 gap-10 px-4 pb-28 pt-0 transition-[grid-template-columns,column-gap] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          sidebarOpen
            ? "lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-x-10 xl:gap-x-14"
            : "lg:grid-cols-[0px_minmax(0,1fr)] lg:gap-x-0",
        )}
      >
        {/* Facets: a sticky column under the rail, on the left where a specifier expects them. */}
        <aside
          id="catalogue-facets"
          className={cn(
            "hidden min-w-0 overflow-hidden border-border transition-opacity duration-300 lg:block lg:self-start lg:border-r",
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-label="Filters"
          aria-hidden={!sidebarOpen}
          data-testid="catalogue-sidebar"
          data-open={sidebarOpen}
        >
          <div
            className="sticky w-[280px] max-h-[calc(100dvh-var(--nav-offset,76px)-3.5rem)] overflow-y-auto pb-6 pr-5 pt-3 transition-[top] duration-300 [scrollbar-width:thin]"
            style={{ top: "calc(var(--nav-offset, 76px) + 3.5rem)" }}
          >
            {isLoading ? <SidebarSkeleton /> : filterPanel}
          </div>
        </aside>

        <div className="min-w-0 pt-6 lg:pt-8">
          {/* Active filters */}
          {(chips.length > 0 || filters.query.trim() || solutionName) && (
            <div className="mb-8 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {solutionName && (
                <FilterChip label={solutionName} onRemove={() => setSolution(null)} />
              )}
              {filters.query.trim() && (
                <FilterChip
                  label={`"${filters.query.trim()}"`}
                  onRemove={() => setFilters((current) => ({ ...current, query: "" }))}
                />
              )}
              {chips.map((chip) => (
                <FilterChip
                  key={`${chip.key}-${chip.value}`}
                  label={`${FACET_TITLES[chip.key].chip}: ${chip.label}`}
                  onRemove={() => toggleFacet(chip.key, chip.value)}
                />
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="ml-1 text-xs text-foreground underline-offset-4 transition hover:text-primary hover:underline"
                data-testid="button-reset-filters"
              >
                Clear all
              </button>
            </div>
          )}

          {isLoading ? (
            <ul className={cn(GRID, GRID_COLUMNS[sidebarOpen ? "open" : "closed"])}>
              {Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className={cn(i === 0 && "col-span-2")}>
                  <Skeleton
                    className={cn(
                      "w-full rounded-none",
                      i === 0 ? "aspect-[4/5] sm:aspect-[8/5]" : "aspect-[4/5]",
                    )}
                  />
                  <Skeleton className="mt-4 h-3 w-16 rounded-none" />
                  <Skeleton className="mt-2 h-5 w-2/3 rounded-none" />
                </li>
              ))}
            </ul>
          ) : error ? (
            <div className="border border-border px-6 py-20 text-center">
              <p className="font-display text-2xl text-foreground">
                {apiErrorMessage(error, "Products did not load.")}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Refresh the page. If it keeps happening, ask on WhatsApp and we will send what you need.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="grid gap-8 border border-border px-6 py-14 md:grid-cols-12 md:px-10 md:py-20">
              <div className="md:col-span-7">
                <h2 className="font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-5xl">
                  Not on the site yet.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                  The site shows a selection of what we supply. Send the name or item no. and a
                  consultant will confirm whether we can supply it.
                </p>
              </div>
              <div className="flex flex-col items-start gap-4 md:col-span-5 md:justify-end">
                <a
                  href={askHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-2.5 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98]"
                  data-testid="button-empty-whatsapp"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
                </a>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-xs text-foreground underline-offset-4 hover:underline"
                    data-testid="button-empty-reset"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : view === "grid" ? (
            <ul
              className={cn(GRID, GRID_COLUMNS[sidebarOpen ? "open" : "closed"], "grid-flow-dense")}
              data-testid="catalogue-grid"
            >
              <AnimatePresence mode="popLayout">
                {shown.map((product, i) => (
                  <CatalogCard
                    key={product.slug}
                    product={product}
                    index={i}
                    wide={i % 9 === 0 && hasPhoto(product)}
                    compared={compare.slugs.includes(product.slug)}
                    compareFull={compare.slugs.length >= COMPARE_LIMIT}
                    onToggleCompare={compare.toggle}
                  />
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <div data-testid="catalogue-index">
              <div className={cn(ROW_GRID, "px-2 pb-3 text-xs text-muted-foreground")} aria-hidden>
                <span />
                <span>Product</span>
                <span className="hidden md:block">Type</span>
                <span className="hidden md:block">Finishes</span>
                <span className="hidden md:block">Designer</span>
                <span />
              </div>
              <ul className="border-b border-border">
                <AnimatePresence mode="popLayout">
                  {shown.map((product, i) => (
                    <CatalogRow
                      key={product.slug}
                      product={product}
                      index={i}
                      compared={compare.slugs.includes(product.slug)}
                      compareFull={compare.slugs.length >= COMPARE_LIMIT}
                      onToggleCompare={compare.toggle}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div
              className="mt-14 flex flex-col items-center gap-4"
              data-testid="catalogue-pagination"
            >
              <p
                className="font-mono text-xs tabular-nums text-muted-foreground"
                data-testid="text-shown-count"
              >
                <span className="text-foreground">{shown.length}</span> of {results.length} shown
              </p>
              <span className="relative block h-px w-40 bg-border" aria-hidden>
                <span
                  className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-500"
                  style={{ width: `${(shown.length / results.length) * 100}%` }}
                />
              </span>
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => setLimit((current) => current + PAGE_SIZE)}
                  className="h-12 border border-border px-8 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-foreground active:translate-y-px"
                  data-testid="button-show-more"
                >
                  Show {Math.min(PAGE_SIZE, remaining)} more
                </button>
              )}
            </div>
          )}

          {!isLoading && !error && results.length > 0 && (
            <div className="dark mt-20 grid gap-8 bg-background p-8 text-foreground md:mt-28 md:grid-cols-12 md:items-end md:p-12">
              <div className="md:col-span-8">
                <p className="font-display text-3xl font-medium leading-[0.95] tracking-[-0.04em] md:text-5xl">
                  Not seeing it? We supply from each brand's full range, not only what is shown here.
                </p>
                <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">
                  Send a name, a photo or an item no. and a consultant will confirm.
                </p>
              </div>
              <div className="md:col-span-4 md:justify-self-end">
                <a
                  href={askHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-foreground hover:text-background active:translate-y-px"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Phone filters */}
      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="flex w-[88vw] max-w-sm flex-col gap-0 p-0">
          <div className="border-b border-border px-5 py-5 pr-12">
            <SheetTitle className="font-display text-2xl font-medium tracking-[-0.03em]">
              Filters
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {results.length} products match
            </SheetDescription>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{filterPanel}</div>
          <div className="border-t border-border p-4">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="h-12 w-full bg-foreground text-sm font-medium text-background transition hover:bg-foreground/85"
              data-testid="button-apply-filters"
            >
              Show {results.length} {results.length === 1 ? "product" : "products"}
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <CompareTray
        products={comparedProducts}
        onRemove={compare.remove}
        onClear={compare.clear}
        onOpen={() => setCompareOpen(true)}
      />
      <CompareDialog
        open={compareOpen}
        onOpenChange={setCompareOpen}
        products={comparedProducts}
        onRemove={compare.remove}
      />
      <FloatingWhatsApp href={askHref} raised={comparedProducts.length > 0} />
    </MainLayout>
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-8">
      {[5, 6, 4].map((rows, group) => (
        <div key={group} className="space-y-3">
          <Skeleton className="h-5 w-28 rounded-none" />
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-none" />
          ))}
        </div>
      ))}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-8 items-center gap-1 border border-border bg-background pl-3 pr-1 text-xs text-foreground">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="p-1 text-muted-foreground transition hover:text-foreground"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" strokeWidth={2} />
      </button>
    </span>
  );
}
