import { useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { MediaImage } from "@/components/media-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PILLARS } from "@/lib/home-content";
import { cn } from "@/lib/utils";
import { Reveal, Section, SolidLink } from "./primitives";

const STATEMENT =
  "We represent European manufacturers of door, window and furniture hardware, hold their stock in Jordan, and put people who have installed the systems in front of the people specifying them.";

/** One word whose opacity follows scroll progress through its own slice of the paragraph. */
function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const opacity = useTransform(progress, [start, start + 1.2 / total], [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

/** The statement reads itself in as you scroll: words brighten in sequence as the paragraph passes through the viewport. */
function ScrollStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = STATEMENT.split(" ");
  if (reduce) return <p className="max-w-3xl text-xl leading-9 text-foreground md:text-2xl md:leading-[1.45]">{STATEMENT}</p>;
  return (
    <p ref={ref} className="max-w-3xl font-display text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-foreground md:text-[2.1rem] md:leading-[1.25]" aria-label={STATEMENT}>
      {words.map((word, index) => (
        <Word key={`${word}-${index}`} word={word} index={index} total={words.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;

/** Panels unmask from the bottom in sequence as the row scrolls into view. */
const rowVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } } };
const panelVariants: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", y: 40 },
  show: { clipPath: "inset(0% 0 0 0)", y: 0, transition: { duration: 1, ease: EASE } },
};
const captionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.45 } },
};

/** The photograph drifts upward as the row passes through the viewport, a touch slower than the page. */
function ParallaxImage({ src, alt, progress, active }: { src: string; alt: string; progress: MotionValue<number>; active: boolean }) {
  const y = useTransform(progress, [0, 1], ["-6%", "6%"]);
  return (
    <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
      <MediaImage
        src={src}
        alt={alt}
        width={1200}
        height={1200}
        className={cn("h-full w-full object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", active ? "scale-100 opacity-85" : "scale-105 opacity-55 group-hover:opacity-70")}
      />
    </motion.div>
  );
}

/**
 * What is Amara Trading Center: an oversized headline, a statement that brightens word by word
 * as it is scrolled through, then the three pillars as an accordion of photographs. The active
 * panel takes most of the row and reveals its text; the others compress to their titles.
 */
export function WhatIsAtc() {
  const [active, setActive] = useState(0);
  const canHover = useMediaQuery("(hover: hover)");
  const stacked = !useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();
  const rowRef = useRef<HTMLUListElement>(null);
  const { scrollYProgress: rowProgress } = useScroll({ target: rowRef, offset: ["start end", "end start"] });

  // On wide screens the row pins and scrolling walks the active panel through the three pillars.
  const pinned = !stacked && !reduce;
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pinProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  // The entrance is keyed to a sentinel just above the row crossing 85% of the viewport, so it
  // plays as the row arrives instead of waiting for the sticky pin to engage.
  const entranceRef = useRef<HTMLDivElement>(null);
  const entered = useInView(entranceRef, { once: true, margin: "0px 0px -15% 0px" });
  useMotionValueEvent(pinProgress, "change", (value) => {
    if (!pinned) return;
    const next = Math.min(PILLARS.length - 1, Math.max(0, Math.floor(value * PILLARS.length)));
    if (next !== active) setActive(next);
  });

  const row = (
    <motion.ul
      ref={rowRef}
      variants={reduce ? undefined : rowVariants}
      initial={reduce ? undefined : "hidden"}
      animate={reduce ? undefined : entered ? "show" : "hidden"}
      className={cn("flex gap-3", stacked ? "mt-14 flex-col" : "h-[min(600px,calc(100dvh-10rem))] flex-row")}
      aria-label="What we do"
    >
      {PILLARS.map((pillar, index) => {
        const isActive = stacked || index === active;
        return (
          <motion.li
            key={pillar.index}
            variants={reduce ? undefined : panelVariants}
            className={cn("min-w-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", stacked ? "min-h-[420px]" : isActive ? "grow-[2.6]" : "grow")}
            style={stacked ? undefined : { flexBasis: 0 }}
          >
            <Link
              href="/about"
              onMouseEnter={() => canHover && setActive(index)}
              onFocus={() => setActive(index)}
              onClick={(event) => {
                if (!stacked && !isActive) {
                  event.preventDefault();
                  setActive(index);
                }
              }}
              aria-expanded={isActive}
              className="dark group relative flex h-full flex-col justify-end overflow-hidden bg-background text-foreground"
              data-testid={`tile-pillar-${pillar.index}`}
            >
              {reduce ? (
                <MediaImage src={pillar.image} alt={pillar.alt} width={1200} height={1200} className={cn("absolute inset-0 h-full w-full object-cover", isActive ? "opacity-85" : "opacity-55")} />
              ) : (
                <ParallaxImage src={pillar.image} alt={pillar.alt} progress={rowProgress} active={isActive} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
              <motion.div variants={reduce ? undefined : captionVariants} className="relative p-6 md:p-8">
                <p className={cn("font-display font-medium leading-[0.95] tracking-[-0.04em] transition-[font-size] duration-500", isActive ? "text-4xl md:text-5xl" : "text-2xl")}>{pillar.title}</p>
                <div
                  className={cn("grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                  aria-hidden={!isActive}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-md pt-4 text-base leading-7 text-foreground/85">{pillar.body}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      Learn more <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </div>
                </div>
              </motion.div>
              <span className={cn("absolute inset-x-0 bottom-0 h-1 origin-left bg-primary transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", isActive ? "scale-x-100" : "scale-x-0")} aria-hidden />
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );

  return (
    <Section>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <Reveal className="lg:col-span-6">
          <h2 className="max-w-[14ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl lg:text-8xl">
            The biggest hardware showroom in Amman since 1977.
          </h2>
        </Reveal>
        <div className="lg:col-span-6">
          <ScrollStatement />
        </div>
      </div>

      <div ref={entranceRef} aria-hidden className="h-px w-full" />
      {pinned ? (
        <div ref={pinRef} className="relative mt-14 md:mt-20" style={{ height: "calc(min(600px, 100dvh - 10rem) + 140vh)" }}>
          <div className="sticky top-20">{row}</div>
        </div>
      ) : (
        row
      )}

      <Reveal className="mt-10">
        <SolidLink href="/about">Our story</SolidLink>
      </Reveal>
    </Section>
  );
}
