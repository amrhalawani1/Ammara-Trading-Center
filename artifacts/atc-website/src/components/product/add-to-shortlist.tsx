import { useEffect, useState } from "react";
import { Bookmark, Check } from "lucide-react";
import { btn } from "@/components/lists/ui";
import { useShortlists } from "@/hooks/use-shortlists";
import type { NewItem } from "@/lib/shortlists";

const ADDED_MS = 1800;

/**
 * Saves the product, in the finish or size currently chosen, to one of the visitor's project
 * shortlists. The dropdown remembers the last list used; adding the same item again raises its
 * quantity rather than adding a second line. The button reads "Added" for a moment afterwards.
 */
export function AddToShortlist({ item }: { item: NewItem }) {
  const { lists, activeListId, setActiveList, addItem } = useShortlists();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), ADDED_MS);
    return () => window.clearTimeout(timer);
  }, [added]);

  const add = () => {
    addItem(activeListId, item);
    setAdded(true);
  };

  return (
    <div className="mt-4 flex gap-2" data-testid="add-to-shortlist">
      <label className="sr-only" htmlFor="shortlist-target">Choose project shortlist</label>
      <select
        id="shortlist-target"
        value={activeListId}
        onChange={(event) => setActiveList(event.target.value)}
        className="h-11 min-w-0 flex-1 border border-border bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        data-testid="select-shortlist"
      >
        {lists.map((list) => (
          <option key={list.id} value={list.id}>
            {list.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={add} className={btn("outline", "shrink-0")} aria-live="polite" data-testid="button-add-to-shortlist">
        {added ? <Check /> : <Bookmark />}
        {added ? "Added" : "Add to shortlist"}
      </button>
    </div>
  );
}
