import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bookmark, Check, Plus } from "lucide-react";
import { Link } from "wouter";
import { useShortlists } from "@/hooks/use-shortlists";
import { noteGuestSave } from "@/lib/guest-save";
import { LIST_NAME_ERRORS } from "@/lib/form-messages";
import { LIST_NAME_MAX, type ListNameError, type NewItem } from "@/lib/shortlists";
import { cn } from "@/lib/utils";

interface ShortlistPickerProps {
  item: NewItem;
  /** Where the trigger sits on the card. */
  className?: string;
  /** Trigger styling when it sits on a dark typographic tile. */
  onDark?: boolean;
  testId: string;
  /** overlay sits on a card; inline sits in a row of actions. */
  variant?: "overlay" | "inline";
}

/**
 * Save to one or more shortlists from a product card. The trigger opens a small
 * panel listing every list with a tick for the ones already holding this product; ticking adds,
 * unticking removes, and a new list can be made in place. Nothing is saved until a list is chosen.
 */
export function ShortlistPicker({ item, className, onDark = false, testId, variant = "overlay" }: ShortlistPickerProps) {
  const { lists, activeListId, setActiveList, addItem, removeItem, createList } = useShortlists();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<ListNameError | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const reduce = useReducedMotion();

  const holders = lists.filter((list) => list.items.some((line) => line.key === item.key));
  const saved = holders.length > 0;

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (creating) nameRef.current?.focus();
  }, [creating]);

  useEffect(() => {
    if (!open) {
      setCreating(false);
      setName("");
      setError(null);
    }
  }, [open]);

  const toggle = (listId: string) => {
    const has = lists.find((list) => list.id === listId)?.items.some((line) => line.key === item.key);
    if (has) removeItem(listId, item.key);
    else {
      addItem(listId, item);
      setActiveList(listId);
      noteGuestSave();
    }
  };

  const submitNew = (event: FormEvent) => {
    event.preventDefault();
    const result = createList(name);
    if (result.error || !result.list) {
      setError(result.error ?? "blank");
      return;
    }
    addItem(result.list.id, item);
    setActiveList(result.list.id);
    setCreating(false);
    setName("");
    setError(null);
  };

  const onNameKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setCreating(false);
    }
  };

  const label = holders.length === 0 ? "Save" : holders.length === 1 ? "Saved" : `Saved to ${holders.length}`;

  const inline = variant === "inline";

  return (
    <div ref={rootRef} className={cn(inline ? "relative z-20" : "absolute z-20", className)} onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={saved ? `${item.name} is on ${holders.length === 1 ? holders[0]!.name : `${holders.length} shortlists`}. Change shortlists` : `Save ${item.name} to a shortlist`}
        className={cn(
          "inline-flex h-9 items-center justify-center gap-1.5 text-xs font-medium transition active:scale-[0.97]",
          inline ? "px-2 md:px-3" : "px-3",
          saved
            ? "bg-primary text-primary-foreground"
            : inline
              ? "text-foreground hover:bg-foreground hover:text-background"
              : onDark
                ? "bg-white/10 text-white hover:bg-white hover:text-black"
                : "bg-background/90 text-foreground backdrop-blur-sm hover:bg-foreground hover:text-background",
          open && !saved && (inline ? "bg-foreground text-background" : onDark ? "bg-white text-black" : "bg-foreground text-background"),
        )}
        data-testid={testId}
      >
        <Bookmark className="h-3.5 w-3.5" strokeWidth={2.5} fill={saved ? "currentColor" : "none"} />
        <span className={inline ? "hidden md:inline" : undefined}>{label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Choose shortlists"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn("absolute top-full mt-2 w-64 border border-border bg-background text-foreground shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]", inline ? "right-0" : "left-0")}
            data-testid={`${testId}-panel`}
          >
            <p className="border-b border-border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Save to</p>
            <ul className="max-h-56 overflow-y-auto py-1" role="group" aria-label="Shortlists">
              {lists.map((list) => {
                const has = list.items.some((line) => line.key === item.key);
                return (
                  <li key={list.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={has}
                      onClick={() => toggle(list.id)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-card"
                      data-testid={`${testId}-list-${list.id}`}
                    >
                      <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center border transition-colors", has ? "border-primary bg-primary text-primary-foreground" : "border-border")} aria-hidden>
                        {has && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{list.name}</span>
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{list.items.length}</span>
                      {list.id === activeListId && <span className="sr-only">(current)</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border p-2">
              {creating ? (
                <form onSubmit={submitNew} className="space-y-2">
                  <label className="sr-only" htmlFor={`${panelId}-name`}>New shortlist name</label>
                  <input
                    ref={nameRef}
                    id={`${panelId}-name`}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={onNameKey}
                    maxLength={LIST_NAME_MAX}
                    placeholder="For example, Jabal Amman kitchen"
                    aria-invalid={Boolean(error)}
                    className={cn("h-9 w-full border bg-card px-2.5 text-sm outline-none focus:border-primary", error ? "border-destructive" : "border-border")}
                    data-testid={`${testId}-new-name`}
                  />
                  {error && <p className="text-xs text-destructive" role="alert">{LIST_NAME_ERRORS[error]}</p>}
                  <div className="flex gap-2">
                    <button type="submit" className="h-8 flex-1 bg-foreground px-3 text-xs font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground" data-testid={`${testId}-new-submit`}>
                      Create and save
                    </button>
                    <button type="button" onClick={() => setCreating(false)} className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <button type="button" onClick={() => setCreating(true)} className="inline-flex h-8 items-center gap-1.5 px-2 text-xs font-medium text-foreground transition-colors hover:text-primary" data-testid={`${testId}-new`}>
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> New shortlist
                  </button>
                  <Link href="/lists" className="px-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    View shortlists
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
