import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export const SPRING = { type: "spring", stiffness: 100, damping: 20 } as const;

export function Kicker({ children, light = false, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em]", light ? "text-foreground/60" : "text-primary", className)}>
      <span className="h-px w-8 bg-primary" aria-hidden />
      {children}
    </div>
  );
}

export function EditorialLink({ href, children, light = false, className, external = false }: { href: string; children: ReactNode; light?: boolean; className?: string; external?: boolean }) {
  const classes = cn(
    "group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors",
    light ? "text-foreground hover:text-primary" : "text-primary hover:text-foreground",
    className,
  );
  const inner = (
    <>
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.75} />
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>{inner}</a>
  ) : (
    <Link href={href} className={classes}>{inner}</Link>
  );
}

/** Solid call to action. Pushes down on press so the click feels physical. */
export function SolidLink({ href, children, className, tone = "primary" }: { href: string; children: ReactNode; className?: string; tone?: "primary" | "dark" | "light" }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex h-12 items-center gap-3 px-6 text-[11px] font-semibold uppercase tracking-[0.18em] transition-[background-color,color,transform] duration-200 active:translate-y-px active:scale-[0.98]",
        tone === "primary" && "bg-primary text-primary-foreground hover:bg-foreground hover:text-background",
        tone === "dark" && "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
        tone === "light" && "bg-background text-foreground hover:bg-foreground hover:text-background",
        className,
      )}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
    </Link>
  );
}

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/**
 * Reveals its children once when scrolled into view. Wrap a list in `group` and its items in
 * `Reveal` for a staggered waterfall; both must sit in the same client tree, which they do here.
 */
type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "p" | "figure" | "article";
  delay?: number;
  /** Forwarded to the element: aria-label, id, data-testid and so on. */
  [attr: `aria-${string}` | `data-${string}`]: string | undefined;
  id?: string;
};

export function Reveal({ children, className, as = "div", delay = 0, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      {...rest}
      className={className}
      variants={reduce ? undefined : riseVariants}
      initial={reduce ? undefined : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={delay ? { ...SPRING, delay } : undefined}
    >
      {children}
    </Tag>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  [attr: `aria-${string}` | `data-${string}`]: string | undefined;
  id?: string;
};

export function RevealGroup({ children, className, as = "div", ...rest }: RevealGroupProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag {...rest} className={className} variants={reduce ? undefined : groupVariants} initial={reduce ? undefined : "hidden"} whileInView={reduce ? undefined : "show"} viewport={{ once: true, margin: "0px 0px -80px 0px" }}>
      {children}
    </Tag>
  );
}

/** Section wrapper: consistent gutters and the 1440px measure used across the site. */
export function Section({ children, className, id, tone = "page", dark = false }: { children: ReactNode; className?: string; id?: string; tone?: "page" | "panel" | "red"; /** Inverts this section to the graphite ground. */ dark?: boolean }) {
  return (
    <section
      id={id}
      className={cn(
        "px-6 py-24 md:px-12 md:py-32",
        dark && "dark bg-background text-foreground",
        tone === "panel" && "bg-card",
        tone === "red" && "bg-primary text-primary-foreground",
        className,
      )}
    >
      <div className="mx-auto max-w-[1440px]">{children}</div>
    </section>
  );
}
