import { finishTone, isLightTone } from "@/lib/finishes";
import { cn } from "@/lib/utils";

/** The finishes a product ships in, as a row of tones. Overflow collapses to "+N". */
export function FinishSwatches({ finishes, max = 6, size = "sm", className }: { finishes: string[]; max?: number; size?: "sm" | "md"; className?: string }) {
  if (finishes.length === 0) return null;
  const shown = finishes.slice(0, max);
  const rest = finishes.length - shown.length;
  const dot = size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} aria-label={`Finishes: ${finishes.join(", ")}`}>
      {shown.map((name, i) => {
        const tone = finishTone(name, i);
        return <span key={`${name}-${i}`} className={cn("shrink-0 rounded-full", dot, isLightTone(tone) && "ring-1 ring-inset ring-black/15")} style={{ backgroundColor: tone }} title={name} aria-hidden />;
      })}
      {rest > 0 && <span className="font-mono text-[10px] tabular-nums opacity-70">+{rest}</span>}
    </span>
  );
}
