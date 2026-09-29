import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryItem {
  slug: string | null;
  name: string;
  count: number;
}

const SEARCH_FROM = 8;

/**
 * Single-choice category list for the filter column. Long lists search and scroll
 * instead of stretching across the page header.
 */
export function CategoryNav({
  items,
  activeSlug,
  onSelect,
}: {
  items: CategoryItem[];
  activeSlug: string | null;
  onSelect: (slug: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const searchId = useId();
  const term = query.trim().toLowerCase();
  const categories = items.filter((item) => item.slug !== null);
  const everything = items.find((item) => item.slug === null);
  const searchable = categories.length >= SEARCH_FROM;

  const shown = useMemo(() => {
    const list = term ? categories.filter((item) => item.name.toLowerCase().includes(term)) : categories;
    return list;
  }, [categories, term]);

  return (
    <section className="border-b border-border pb-5" data-testid="facet-category" aria-label="Categories">
      <div className="flex items-baseline gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
        Categories
        <span className="font-mono font-normal tracking-normal text-muted-foreground">{categories.length}</span>
      </div>

      {searchable && (
        <label htmlFor={searchId} className="relative mb-1 mt-4 block">
          <span className="sr-only">Find a category</span>
          <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} aria-hidden />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a category"
            autoComplete="off"
            className="h-9 w-full border-b border-border bg-transparent pl-6 pr-7 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary [&::-webkit-search-cancel-button]:hidden"
            data-testid="input-category-search"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </label>
      )}

      <ul
        className={cn("mt-3 space-y-0.5", shown.length > 10 && "max-h-72 overflow-y-auto pr-2 [scrollbar-width:thin]")}
        role="listbox"
        aria-label="Categories"
      >
        {!term && everything && (
          <CategoryRow item={everything} active={activeSlug === null} onSelect={onSelect} />
        )}
        {shown.map((item) => (
          <CategoryRow key={item.slug} item={item} active={item.slug === activeSlug} onSelect={onSelect} />
        ))}
        {term && shown.length === 0 && (
          <li className="py-2 text-sm text-muted-foreground">Nothing matches "{query.trim()}" here.</li>
        )}
      </ul>
    </section>
  );
}

function CategoryRow({
  item,
  active,
  onSelect,
}: {
  item: CategoryItem;
  active: boolean;
  onSelect: (slug: string | null) => void;
}) {
  const disabled = !active && item.count === 0;
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={active}
        disabled={disabled}
        onClick={() => onSelect(item.slug)}
        className={cn(
          "relative flex w-full items-baseline gap-3 py-2 pl-3 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
        data-testid={`filter-solution-${item.slug ?? "all"}`}
      >
        <span className={cn("absolute bottom-1.5 left-0 top-1.5 w-0.5", active ? "bg-primary" : "bg-transparent")} aria-hidden />
        <span className="min-w-0 flex-1 truncate">{item.name}</span>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{item.count}</span>
      </button>
    </li>
  );
}
