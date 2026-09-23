import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { MediaImage } from "@/components/media-image";
import { JOURNAL } from "@/lib/home-content";
import { cn } from "@/lib/utils";
import { Reveal, Section, SolidLink } from "./primitives";

const JOURNAL_IMAGES = ["/images/resources-docs.webp", "/images/brand-hinge.webp", "/images/dnd-ellipse.webp", "/images/brand-sliding.webp"] as const;

/** Guides as oversized rows; hovering one brings its image up in the pinned frame beside the list. */
export function JournalSection() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const image = JOURNAL_IMAGES[active] ?? JOURNAL_IMAGES[0];

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-6xl">Guides written by the people who install it.</h2>
          <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden bg-card lg:block">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div key={image} initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0">
                <MediaImage src={image} alt="" width={800} height={1000} className="h-full w-full object-cover opacity-85" />
              </motion.div>
            </AnimatePresence>
          </div>
          <SolidLink href="/resources" tone="light" className="mt-10">All guides</SolidLink>
        </Reveal>

        <ol className="lg:col-span-8" aria-label="Journal entries">
          {JOURNAL.map((entry, index) => (
            <Reveal as="li" key={entry.title}>
              <Link
                href={entry.href}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={cn("group flex items-start justify-between gap-6 border-t border-border py-8 transition-colors last:border-b md:py-10", index === active ? "text-foreground" : "text-foreground/60 hover:text-foreground")}
                data-testid={`link-home-journal-${index + 1}`}
              >
                <span className="min-w-0">
                  <span className="text-xs text-muted-foreground">{entry.category}, {entry.readTime} read</span>
                  <span className="mt-3 block font-display text-3xl font-medium leading-[0.95] tracking-[-0.04em] md:text-5xl">{entry.title}</span>
                  <span className="mt-4 block max-w-xl text-base leading-7 text-muted-foreground">{entry.summary}</span>
                </span>
                <span className={cn("mt-2 flex h-12 w-12 shrink-0 items-center justify-center transition-colors", index === active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                </span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
