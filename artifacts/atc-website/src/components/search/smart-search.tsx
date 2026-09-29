import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Building2, FolderKanban, Layers, Search, Store, Tag, X } from "lucide-react";
import { useLocation } from "wouter";
import { useGetPublicCatalog } from "@workspace/api-client-react";
import { closeSearch, openSearch, useSearchOverlay } from "@/hooks/use-search-overlay";
import { MediaImage } from "@/components/media-image";
import { catalogueSearchHref, searchCatalog, type SearchHit, type SearchKind } from "@/lib/smart-search";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<SearchKind, string> = {
  problem: "Problems we solve",
  solution: "Solutions",
  product: "Products",
  brand: "Brands",
  project: "Projects",
  showroom: "Showrooms",
  catalogue: "Catalogues",
  page: "Pages",
};

const KIND_ICON: Record<SearchKind, typeof Search> = {
  problem: Layers,
  solution: Layers,
  product: Search,
  brand: Tag,
  project: FolderKanban,
  showroom: Store,
  catalogue: BookOpen,
  page: Building2,
};

const GROUP_ORDER: Array<keyof ReturnType<typeof searchCatalog>["groups"]> = [
  "problems",
  "solutions",
  "products",
  "brands",
  "projects",
  "showrooms",
  "catalogues",
  "pages",
];

/**
 * Site-wide search. The visitor can type a product name, an item number, a brand, or the
 * problem they have ("drawers slam"); matches are ranked and grouped, and ⌘K / / opens it
 * from anywhere that is not already a field.
 */
export function SmartSearch() {
  const open = useSearchOverlay();
  const reduce = useReducedMotion();
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const { data: catalog } = useGetPublicCatalog();
  const products = catalog?.products ?? [];
  const brands = catalog?.brands ?? [];

  const { groups, hits, productTotal } = useMemo(() => searchCatalog(query, products, brands), [query, products, brands]);
  const seeAllHref = query.trim() ? catalogueSearchHref(query) : "/catalog";
  const empty = query.trim().length === 0;

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) closeSearch();
        else openSearch();
        return;
      }
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (href: string) => {
    closeSearch();
    navigate(href);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(hits.length, current + 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const href = hits[active]?.href ?? (query.trim() ? seeAllHref : null);
      if (href) go(href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${inputId}-label`}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[80] flex items-start justify-center bg-background/70 px-4 pt-[12vh] backdrop-blur-md md:px-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeSearch();
          }}
          data-testid="smart-search"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full max-w-[720px] max-h-[76vh] flex-col overflow-hidden border border-border bg-background text-foreground shadow-[0_28px_80px_-28px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 md:px-5">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />
              <label id={`${inputId}-label`} htmlFor={inputId} className="sr-only">Search products, brands or a problem</label>
              <input
                ref={inputRef}
                id={inputId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="A product, brand, item no. or problem"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="h-14 min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden"
                data-testid="smart-search-input"
              />
              <kbd className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:block">esc</kbd>
              <button type="button" onClick={closeSearch} className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground" aria-label="Close search" data-testid="smart-search-close">
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto" role="listbox" aria-label="Search results">
              {hits.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="font-display text-2xl font-medium tracking-[-0.03em]">No matches for "{query.trim()}".</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">Try an item no., a brand, or describe the problem, like "drawers slam".</p>
                  <button type="button" onClick={() => go(seeAllHref)} className="mt-6 text-sm text-primary underline-offset-4 hover:underline" data-testid="smart-search-empty-catalogue">
                    Search all products
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  {empty && (
                    <p className="px-5 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Start with a problem, or a solution</p>
                  )}
                  {GROUP_ORDER.map((key) => {
                    const items = groups[key];
                    if (items.length === 0) return null;
                    const kind = items[0]!.kind;
                    return (
                      <section key={key} className="px-2 pb-2">
                        {!empty && <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{KIND_LABEL[kind]}</p>}
                        <ul>
                          {items.map((hit) => {
                            const index = hits.indexOf(hit);
                            return (
                              <li key={hit.id}>
                                <HitRow hit={hit} active={index === active} index={index} onHover={() => setActive(index)} onSelect={() => go(hit.href)} />
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground md:px-5">
              <p className="hidden sm:block">
                <kbd className="font-mono">↑↓</kbd> to move · <kbd className="font-mono">↵</kbd> to open
              </p>
              <button
                type="button"
                onClick={() => go(seeAllHref)}
                className={cn("ml-auto inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary", active === hits.length && "text-primary")}
                data-testid="smart-search-see-all"
              >
                {query.trim()
                  ? productTotal > 0
                    ? `See ${productTotal} ${productTotal === 1 ? "product" : "products"}`
                    : "Search all products"
                  : "Browse products"}
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HitRow({ hit, active, index, onHover, onSelect }: { hit: SearchHit; active: boolean; index: number; onHover: () => void; onSelect: () => void }) {
  const Icon = KIND_ICON[hit.kind];
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      data-index={index}
      onMouseEnter={onHover}
      onClick={onSelect}
      className={cn("flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors", active ? "bg-card" : "hover:bg-card/60")}
      data-testid={`smart-search-hit-${hit.id}`}
    >
      {hit.image ? (
        <span className="relative h-11 w-11 shrink-0 overflow-hidden bg-card">
          <MediaImage src={hit.image} alt="" width={88} height={88} className="h-full w-full object-cover" />
        </span>
      ) : (
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center", active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium leading-5">{hit.title}</span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{hit.subtitle}</span>
      </span>
      {active && <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />}
    </button>
  );
}

