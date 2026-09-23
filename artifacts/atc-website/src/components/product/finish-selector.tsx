import { motion, useReducedMotion } from "framer-motion";
import { finishCode, finishTone, isLightTone } from "@/lib/finishes";
import { cn } from "@/lib/utils";

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
