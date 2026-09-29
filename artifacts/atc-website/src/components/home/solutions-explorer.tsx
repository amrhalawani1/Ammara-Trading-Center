import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { MediaImage } from "@/components/media-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SOLUTION_IMAGES } from "@/lib/home-content";
import { SOLUTIONS } from "@/lib/solutions";
import { cn } from "@/lib/utils";
import { Reveal, Section, SolidLink } from "./primitives";

interface SolutionsExplorerProps {
  counts: Map<string, number>;
  isLoading: boolean;
}

const countLabel = (count: number, isLoading: boolean) => (isLoading ? "" : count > 0 ? `${count} ${count === 1 ? "product" : "products"}` : "On request");

/**
 * Solutions as one screen: hovering a category swaps the photograph and the copy.
 * Scrolling moves on to the next section. Phones and reduced motion get a horizontal snap gallery.
 */
export function SolutionsExplorer({ counts, isLoading }: SolutionsExplorerProps) {
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  return (
    <div className="dark bg-background text-foreground">
      {wide && !reduce ? <HoverSolutions counts={counts} isLoading={isLoading} /> : <SolutionGallery counts={counts} isLoading={isLoading} />}
    </div>
  );
}

function HoverSolutions({ counts, isLoading }: SolutionsExplorerProps) {
  const [active, setActive] = useState(0);

  const solution = SOLUTIONS[active]!;
  const visual = SOLUTION_IMAGES[solution.slug] ?? SOLUTION_IMAGES["kitchen-storage"]!;
  const count = counts.get(solution.name) ?? 0;

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-background">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div key={solution.slug} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
            <MediaImage src={visual.image} alt={visual.alt} width={1920} height={1080} className="h-full w-full object-cover opacity-60" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/10" />

        <div className="relative mx-auto grid h-full max-w-[1440px] grid-cols-12 items-center gap-8 px-12">
          <ol className="col-span-5" aria-label="Solutions">
            {SOLUTIONS.map((item, index) => {
              const isActive = index === active;
              const cnt = counts.get(item.name) ?? 0;
              return (
                <li key={item.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn("flex w-full items-baseline justify-between gap-6 py-1.5 text-left font-display font-medium tracking-[-0.03em] transition-[color,font-size] duration-300", isActive ? "text-2xl text-foreground xl:text-3xl" : "text-lg text-foreground/35 hover:text-foreground/70")}
                    data-testid={`button-home-solution-${item.slug}`}
                  >
                    {item.name}
                    <span className={cn("shrink-0 font-sans text-xs tabular-nums transition-opacity", isActive ? "text-primary opacity-100" : "opacity-0")}>{countLabel(cnt, isLoading)}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="col-span-6 col-start-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={solution.slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                <p className="font-display text-6xl font-medium leading-[0.92] tracking-[-0.05em] xl:text-7xl">{solution.name}</p>
                <p className="mt-6 max-w-md text-lg leading-8 text-foreground/80">{solution.line}</p>
                <SolidLink href={`/catalog?solution=${solution.slug}`} className="mt-10">
                  {count > 0 ? `View ${count} ${count === 1 ? "product" : "products"}` : "Ask about this range"}
                </SolidLink>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
  );
}

/** Phone and reduced-motion layout: image tiles in a horizontal snap gallery. */
function SolutionGallery({ counts, isLoading }: SolutionsExplorerProps) {
  return (
    <Section className="overflow-hidden">
      <Reveal>
        <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Organised by what the hardware does.</h2>
      </Reveal>
      <ul className="-mx-6 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:-mx-12 md:px-12 [&::-webkit-scrollbar]:hidden" aria-label="Solutions">
        {SOLUTIONS.map((item) => {
          const visual = SOLUTION_IMAGES[item.slug] ?? SOLUTION_IMAGES["kitchen-storage"]!;
          const count = counts.get(item.name) ?? 0;
          return (
            <li key={item.slug} className="w-[78vw] shrink-0 snap-start sm:w-[52vw] md:w-[40vw]">
              <Link href={`/catalog?solution=${item.slug}`} className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-background p-6" data-testid={`link-home-solution-${item.slug}`}>
                <MediaImage src={visual.image} alt={visual.alt} width={800} height={1000} className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="relative">
                  <p className="font-display text-3xl font-medium leading-none tracking-[-0.04em]">{item.name}</p>
                  <p className="mt-3 flex items-center gap-2 text-sm text-primary">
                    {countLabel(count, isLoading)} <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
