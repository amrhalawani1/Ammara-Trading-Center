import { motion, useReducedMotion } from "framer-motion";
import { finishCode, finishTone, isLightTone } from "@/lib/finishes";
import { cn } from "@/lib/utils";

/** Manufacturer finish codes stay as written. Longer article numbers become initials. */
export function finishMark(code: string, label: string): string {
  return /^[A-Z]{2,5}([+-][A-Z0-9]{2,4})*$/.test(code) ? code : finishCode(label);
}

export interface FinishChoice {
  code: string;
  label: string;
  index: number;
}

/** DND finish list: a 45px material disc with the finish code centred under it, four across. */
export function FinishCodes({ items, selected, marked = selected, onSelect, label, className }: { items: FinishChoice[]; selected: number; marked?: number; onSelect: (index: number) => void; label: string; className?: string }) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("flex max-w-[400px] flex-wrap", className)} role="radiogroup" aria-label={label}>
      {items.map((item) => {
        const active = item.index === marked;
        const toneName = item.label.includes("+") ? item.label.split("+").slice(1).join(" ") : item.label;
        const tone = finishTone(toneName, item.index);
        return (
          <li key={`${item.code}-${item.index}`} className="mb-[15px] flex w-1/4 justify-center">
            <label className="w-full cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring" title={item.label}>
              <input
                type="radio"
                name="product-variant"
                className="sr-only"
                checked={active}
                onChange={() => onSelect(item.index)}
                aria-label={`${finishMark(item.code, item.label)}, ${item.label}`}
              />
              <span
                className={cn(
                  "mx-auto block h-[45px] w-[45px] rounded-full",
                  isLightTone(tone) && "ring-1 ring-inset ring-black/15",
                  active && "outline outline-1 outline-offset-[3px] outline-foreground",
                )}
                style={{ backgroundColor: tone }}
                aria-hidden
              />
              <span className="mt-[5px] block text-center text-[0.65rem] font-light leading-[1.3] text-foreground">{finishMark(item.code, item.label)}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

interface FinishSelectorProps {
  finishes: string[];
  selected: number;
  onSelect: (index: number) => void;
  /** Compact = swatch row for the hero; expanded = DND-style tile grid. */
  variant?: "compact" | "expanded";
  className?: string;
}

export function FinishSelector({ finishes, selected, onSelect, variant = "compact", className }: FinishSelectorProps) {
  const reduceMotion = useReducedMotion();
  if (finishes.length === 0) return null;

  if (variant === "expanded") {
    return (
      <div className={cn("grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5", className)} role="radiogroup" aria-label="Finish">
        {finishes.map((finish, index) => {
          const tone = finishTone(finish, index);
          const active = index === selected;
          return (
            <motion.button
              key={finish}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(index)}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              className={cn(
                "group relative flex flex-col items-start gap-6 bg-background p-6 text-left transition-colors hover:bg-accent",
                active && "bg-accent",
              )}
              data-testid={`tile-finish-${index}`}
            >
              <span
                className={cn("block h-16 w-16 rounded-full", isLightTone(tone) && "ring-1 ring-inset ring-foreground/15")}
                style={{ backgroundColor: tone }}
                aria-hidden
              />
              <span className="space-y-1">
                <span className="block font-mono text-[11px] tracking-[0.18em] text-muted-foreground">{finishCode(finish)}</span>
                <span className={cn("block text-sm text-foreground", active && "font-medium")}>{finish}</span>
              </span>
              {active && (
                <motion.span
                  layoutId="finish-tile-marker"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Finish">
        {finishes.map((finish, index) => {
          const tone = finishTone(finish, index);
          const active = index === selected;
          return (
            <motion.button
              key={finish}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={finish}
              title={finish}
              onClick={() => onSelect(index)}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className="relative flex h-11 w-11 items-center justify-center"
              data-testid={`button-finish-${index}`}
            >
              {active && (
                <motion.span
                  layoutId="finish-ring"
                  className="absolute inset-0 rounded-full border border-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={cn("block h-7 w-7 rounded-full", isLightTone(tone) && "ring-1 ring-inset ring-foreground/15")}
                style={{ backgroundColor: tone }}
              />
            </motion.button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-foreground" aria-live="polite">
        <span className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground">{finishCode(finishes[selected] ?? "")}</span>
        <span className="mx-2 text-border">/</span>
        {finishes[selected]}
      </p>
    </div>
  );
}
