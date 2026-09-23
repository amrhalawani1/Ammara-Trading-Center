import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A horizontal row that can hold more than the viewport shows. The edges fade into the ground
 * and a pair of arrows appears on the side that has more, so a long list of solutions reads as
 * scrollable rather than cut off. The scrollbar itself stays hidden.
 */
export function ScrollStrip({ children, className, step = 0.7 }: { children: ReactNode; className?: string; /** Fraction of the visible width one arrow press moves. */ step?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(el);
    // The row is as wide as its container, so only its content changing (tabs arriving after
    // the catalogue loads) moves the far edge; watch the subtree for that.
    const mutation = new MutationObserver(update);
    mutation.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      el.removeEventListener("scroll", update);
      resize.disconnect();
      mutation.disconnect();
    };
  }, []);

  const nudge = (direction: -1 | 1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * step, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div ref={ref} className="overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" data-testid="scroll-strip">
        {children}
      </div>
      <span aria-hidden className={cn("pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent transition-opacity duration-300", edges.left ? "opacity-100" : "opacity-0")} />
      <span aria-hidden className={cn("pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent transition-opacity duration-300", edges.right ? "opacity-100" : "opacity-0")} />
      <button
        type="button"
        onClick={() => nudge(-1)}
        tabIndex={edges.left ? 0 : -1}
        aria-label="Scroll left"
        className={cn("absolute left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-foreground/20 bg-background text-foreground transition hover:border-foreground md:flex", edges.left ? "opacity-100" : "pointer-events-none opacity-0")}
        data-testid="button-strip-left"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={() => nudge(1)}
        tabIndex={edges.right ? 0 : -1}
        aria-label="Scroll right"
        className={cn("absolute right-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center border border-foreground/20 bg-background text-foreground transition hover:border-foreground md:flex", edges.right ? "opacity-100" : "pointer-events-none opacity-0")}
        data-testid="button-strip-right"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}
