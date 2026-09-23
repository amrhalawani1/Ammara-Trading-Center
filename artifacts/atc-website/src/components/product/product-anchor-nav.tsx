import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnchorItem {
  id: string;
  label: string;
}

/** Sticky in-page navigation with scroll-spy (the Blum / Häfele "Overview · Technical data · Downloads" pattern). */
export function ProductAnchorNav({ items, className }: { items: AnchorItem[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className={cn(
        "sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:top-20",
        className,
      )}
    >
      <div className="container mx-auto px-4">
        <ul className="-mb-px flex gap-8 overflow-x-auto whitespace-nowrap text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id} className="relative">
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn("block py-4 transition-colors hover:text-foreground", isActive ? "text-foreground" : "text-muted-foreground")}
                  data-testid={`anchor-${item.id}`}
                >
                  {item.label}
                </a>
                {isActive && (
                  <motion.span
                    layoutId="anchor-underline"
                    className="absolute inset-x-0 bottom-0 h-px bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
