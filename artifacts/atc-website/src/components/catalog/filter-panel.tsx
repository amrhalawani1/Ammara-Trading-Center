import { useId, useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { FacetKey, FacetOption } from "@/lib/catalog-filters";
import { isLightTone } from "@/lib/finishes";
import { cn } from "@/lib/utils";

export interface FilterGroup {
  key: FacetKey;
  title: string;
  /** Label of the "everything" row, e.g. "All brands". */
  allLabel: string;
  options: FacetOption[];
  selected: string[];
}

interface FilterPanelProps {
  groups: FilterGroup[];
  onToggle: (key: FacetKey, value: string) => void;
  onClearGroup: (key: FacetKey) => void;
  onClearAll: () => void;
  hasFilters: boolean;
}

const checkboxClass =
  "h-[18px] w-[18px] rounded-none border-foreground/35 shadow-none data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background [&_svg]:h-3 [&_svg]:w-3";

/** Options shown before "Show all". */
const COLLAPSED_OPTIONS = 6;
/** From this many options a group gets its own search field. */
const SEARCH_FROM = 10;
/** From this many options a group reads alphabetically instead of by count. */
const ALPHABETICAL_FROM = 12;
/** Groups open on first paint when nothing inside them is selected. */
const OPEN_BY_DEFAULT = 2;

/**
 * Sidebar facets, built for a catalogue that keeps growing. Each group collapses and the first
 * two start open; a group with a selection is always open. Long groups sort alphabetically, get a
 * search field, pin what is selected to the top and scroll inside a fixed height once expanded,
 * so the column never becomes a wall of checkboxes.
 */
export function FilterPanel({ groups, onToggle, onClearGroup, onClearAll, hasFilters }: FilterPanelProps) {
  const visible = groups.filter((group) => group.options.length > 0);
  return (
    <div>
      {visible.map((group, index) => (
        <FilterSection key={group.key} group={group} defaultOpen={index < OPEN_BY_DEFAULT} onToggle={onToggle} onClearGroup={onClearGroup} />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        disabled={!hasFilters}
        className="mt-6 h-11 w-full border border-border text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-foreground disabled:cursor-not-allowed disabled:opacity-40"
        data-testid="button-clear-all-filters"
      >
        Clear all
      </button>
    </div>
  );
}

function FilterSection({ group, defaultOpen, onToggle, onClearGroup }: { group: FilterGroup; defaultOpen: boolean; onToggle: FilterPanelProps["onToggle"]; onClearGroup: FilterPanelProps["onClearGroup"] }) {
  const [openState, setOpen] = useState<boolean | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const panelId = useId();
  const allId = useId();
  const searchId = useId();

  // A selection keeps its group open until the reader closes it themselves.
  const open = openState ?? (defaultOpen || group.selected.length > 0);
  const large = group.options.length >= SEARCH_FROM;
  const term = query.trim().toLowerCase();

  const ordered = useMemo(() => {
    const list = group.key !== "finish" && group.options.length >= ALPHABETICAL_FROM ? [...group.options].sort((a, b) => a.label.localeCompare(b.label)) : group.options;
    const selected = list.filter((option) => group.selected.includes(option.value));
    const rest = list.filter((option) => !group.selected.includes(option.value));
    return [...selected, ...rest];
  }, [group.key, group.options, group.selected]);

  const matching = term ? ordered.filter((option) => option.label.toLowerCase().includes(term)) : ordered;
  const expanded = showAll || Boolean(term);
  const shown = expanded ? matching : matching.slice(0, Math.max(COLLAPSED_OPTIONS, group.selected.length));
  const hidden = matching.length - shown.length;

  return (
    <section className="border-t border-dashed border-border py-5 first:border-t-0 first:pt-0" data-testid={`facet-${group.key}`} data-open={open}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
          data-testid={`button-toggle-facet-${group.key}`}
        >
          <span className="flex items-baseline gap-2 text-base font-medium text-foreground">
            {group.title}
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{group.selected.length > 0 ? <span className="text-primary">{group.selected.length} of {group.options.length}</span> : group.options.length}</span>
          </span>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} strokeWidth={1.75} />
        </button>
      </div>

      {open && (
        <div id={panelId} className="mt-4">
          {large && (
            <label htmlFor={searchId} className="relative mb-3 block">
              <span className="sr-only">Find in {group.title.toLowerCase()}</span>
              <Search className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} aria-hidden />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Find in ${group.title.toLowerCase()}`}
                autoComplete="off"
                className="h-9 w-full border-b border-border bg-transparent pl-6 pr-7 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground [&::-webkit-search-cancel-button]:hidden"
                data-testid={`input-facet-search-${group.key}`}
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Clear">
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              )}
            </label>
          )}

          <ul className={cn("space-y-0.5", expanded && matching.length > COLLAPSED_OPTIONS * 2 && "max-h-72 overflow-y-auto pr-2 [scrollbar-width:thin]")} role="group" aria-label={group.title}>
            {!term && (
              <li>
                <label htmlFor={allId} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-foreground">
                  <Checkbox id={allId} checked={group.selected.length === 0} onCheckedChange={() => onClearGroup(group.key)} className={checkboxClass} />
                  {group.allLabel}
                </label>
              </li>
            )}
            {shown.map((option) => (
              <FilterOption key={option.value} groupKey={group.key} option={option} checked={group.selected.includes(option.value)} onToggle={onToggle} />
            ))}
            {term && matching.length === 0 && <li className="py-2 text-sm text-muted-foreground">Nothing matches "{query.trim()}" here.</li>}
          </ul>

          <div className="mt-2 flex items-center justify-between gap-3 text-xs">
            {!term && matching.length > shown.length && !showAll ? (
              <button type="button" onClick={() => setShowAll(true)} className="text-foreground underline-offset-4 transition hover:text-primary hover:underline" data-testid={`button-show-all-${group.key}`}>
                Show all {group.options.length}
              </button>
            ) : !term && showAll && group.options.length > COLLAPSED_OPTIONS ? (
              <button type="button" onClick={() => setShowAll(false)} className="text-foreground underline-offset-4 transition hover:text-primary hover:underline">
                Show fewer
              </button>
            ) : (
              <span />
            )}
            {group.selected.length > 0 && (
              <button type="button" onClick={() => onClearGroup(group.key)} className="text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline" data-testid={`button-clear-facet-${group.key}`}>
                Clear
              </button>
            )}
            {hidden > 0 && !showAll && !term && <span className="sr-only">{hidden} more</span>}
          </div>
        </div>
      )}
    </section>
  );
}

function FilterOption({ groupKey, option, checked, onToggle }: { groupKey: FacetKey; option: FacetOption; checked: boolean; onToggle: FilterPanelProps["onToggle"] }) {
  const id = useId();
  const empty = option.count === 0 && !checked;
  return (
    <li>
      <label htmlFor={id} className={cn("flex cursor-pointer items-center gap-3 py-1.5 text-sm", empty ? "text-muted-foreground/60" : "text-foreground")}>
        <Checkbox
          id={id}
          checked={checked}
          disabled={empty}
          onCheckedChange={() => onToggle(groupKey, option.value)}
          className={checkboxClass}
          data-testid={`checkbox-${groupKey}-${option.value.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        />
        {option.tone && (
          <span className={cn("h-3.5 w-3.5 shrink-0 rounded-full", isLightTone(option.tone) && "ring-1 ring-inset ring-foreground/20")} style={{ backgroundColor: option.tone }} aria-hidden />
        )}
        <span className="min-w-0 flex-1 truncate">{option.label}</span>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{option.count}</span>
      </label>
    </li>
  );
}
