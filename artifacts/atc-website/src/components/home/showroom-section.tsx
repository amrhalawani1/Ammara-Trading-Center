import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useOpenStatus } from "@/hooks/use-open-status";
import { company } from "@/lib/content";
import { mapsHref } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { Reveal, Section, SolidLink } from "./primitives";

const SHOWROOM_IMAGES = ["/images/showroom-wide.webp", "/images/showroom-detail.webp"] as const;

function ShowroomRow({ index, active, stacked, onActivate }: { index: number; active: boolean; stacked: boolean; onActivate: () => void }) {
  const showroom = company.showrooms[index]!;
  const status = useOpenStatus(showroom.hours);
  const expanded = active || stacked;

  return (
    <li className="border-t border-border last:border-b">
      <div
        role={stacked ? undefined : "button"}
        tabIndex={stacked ? undefined : 0}
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onActivate}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onActivate();
          }
        }}
        aria-expanded={stacked ? undefined : expanded}
        className={cn("group cursor-default py-7 transition-colors md:py-9", expanded ? "text-foreground" : "text-foreground/45 hover:text-foreground")}
        data-testid={`row-showroom-${showroom.name.toLowerCase()}`}
      >
        <div className="flex items-baseline justify-between gap-6">
          <p className="text-xs text-muted-foreground">{showroom.role}</p>
          {status && (
            <p className={cn("flex shrink-0 items-center gap-2 text-xs", status.open ? "text-foreground" : "text-muted-foreground")} aria-live="polite">
              <span className={cn("h-2 w-2 rounded-full", status.open ? "bg-emerald-500" : "bg-border")} aria-hidden />
              {status.label}
            </p>
          )}
        </div>
        <p className="mt-3 whitespace-nowrap font-display text-4xl font-medium leading-none tracking-[-0.04em] md:text-5xl xl:text-6xl">{showroom.name}</p>
        <div className={cn("grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <dl className="grid gap-x-8 gap-y-5 pt-7 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Address</dt>
                <dd className="mt-1 text-base leading-6">{showroom.addressLines.map((line) => <span key={line} className="block">{line}</span>)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Hours</dt>
                <dd className="mt-1 text-base leading-6">{showroom.hours}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Phone</dt>
                <dd className="mt-1 text-base leading-6 tabular-nums">
                  <a href={`tel:${showroom.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-primary">{showroom.phone}</a>
                </dd>
              </div>
            </dl>
            <a
              href={mapsHref(showroom.name, showroom.addressLines)}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-foreground"
            >
              Directions <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Showrooms as an index: the headline leads, the two locations are large rows that expand on
 * hover with address, hours, phone and a live open-or-closed status in Amman time, and the
 * photograph beside them swaps with the active row.
 */
export function ShowroomSection() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const stacked = !useMediaQuery("(min-width: 1024px)");
  const image = SHOWROOM_IMAGES[active] ?? SHOWROOM_IMAGES[0];
  const name = company.showrooms[active]?.name ?? "";

  return (
    <Section className="pb-20 md:pb-24">
      <Reveal className="max-w-3xl">
        <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Open the drawer. Feel the close.</h2>
        <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Two working showrooms in Amman where every system on the floor can be operated. No appointment needed; a consultant is always on hand.</p>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-card lg:aspect-auto lg:h-full lg:min-h-[560px]">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={image}
                initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <MediaImage src={image} alt={`${name} showroom`} width={1600} height={1200} className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <motion.span key={name} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute left-5 top-5 bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm">
              {name}
            </motion.span>
          </div>
        </Reveal>

        <div className="flex flex-col lg:col-span-5">
          <ul className="lg:mt-2" aria-label="Showrooms">
            {company.showrooms.map((showroom, index) => (
              <ShowroomRow key={showroom.name} index={index} active={index === active} stacked={stacked} onActivate={() => setActive(index)} />
            ))}
          </ul>
          <div className="mt-10">
            <SolidLink href="/showroom">Plan a visit</SolidLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
