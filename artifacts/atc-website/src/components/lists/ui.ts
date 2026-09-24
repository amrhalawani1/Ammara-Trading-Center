import { cn } from "@/lib/utils";

/** Small uppercase label above a heading or a value. */
export const eyebrow = "text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

const variants = {
  primary: "h-11 bg-primary px-5 text-primary-foreground hover:bg-primary/90",
  outline: "h-11 border border-border bg-background px-5 text-foreground hover:border-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "h-11 bg-destructive px-3 text-xs text-destructive-foreground hover:bg-destructive/90",
} as const;

/** Buttons and button-like links used across the shortlist screens. */
export const btn = (variant: keyof typeof variants, className?: string) => cn(base, variants[variant], className);

/** Text inputs in the shortlist forms. */
export const field =
  "flex h-11 w-full border border-border bg-card px-3 py-2 text-base text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm";
