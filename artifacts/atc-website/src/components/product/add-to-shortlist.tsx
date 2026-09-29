import { useEffect, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { btn } from "@/components/lists/ui";
import { useShortlists } from "@/hooks/use-shortlists";
import { track } from "@/lib/analytics";
import { noteGuestSave } from "@/lib/guest-save";
import type { NewItem } from "@/lib/shortlists";

const ADDED_MS = 1800;

/**
 * Saves the product, in the finish or size currently chosen, to one of the visitor's project
 * shortlists. The dropdown remembers the last list used; adding the same item again raises its
 * quantity rather than adding a second line. The button reads "Saved" for a moment afterwards.
 */
export function AddToShortlist({ item, trailing }: { item: NewItem; trailing?: ReactNode }) {
  const { lists, activeListId, setActiveList, addItem } = useShortlists();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), ADDED_MS);
    return () => window.clearTimeout(timer);
  }, [added]);

  const add = () => {
    addItem(activeListId, item);
    noteGuestSave();
    track("add_to_quote", { item_id: item.slug, item_variant: item.variant ?? undefined });
    setAdded(true);
  };

  return (
    <div className="space-y-2" data-testid="add-to-shortlist">
      <label className="sr-only" htmlFor="shortlist-target">Quote list</label>
      <select
        id="shortlist-target"
        value={activeListId}
        onChange={(event) => setActiveList(event.target.value)}
        className="h-11 w-full border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        data-testid="select-shortlist"
      >
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={add} className={btn("primary", "w-full")} aria-live="polite" data-testid="button-add-to-shortlist">
          {added ? <Check /> : null}
          {added ? "Added" : "Add to quote"}
        </button>
        {trailing}
      </div>
    </div>
  );
}
