import { memo, useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Reveal, RevealGroup } from "./primitives";

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

/** Counts up once when scrolled into view. Isolated so the animation never re-renders the band. */
const Counter = memo(function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
});

/** A full-bleed red band with four numbers set large enough to be read from across the room. */
export function CredibilityStrip({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-primary px-6 py-14 text-primary-foreground md:px-12 md:py-20">
      <RevealGroup as="ul" className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {stats.map((stat) => (
          <Reveal as="li" key={stat.label}>
            <p className="font-display text-6xl font-medium leading-none tracking-[-0.05em] md:text-8xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-4 max-w-[12rem] text-sm font-medium leading-5 text-primary-foreground/80">{stat.label}</p>
          </Reveal>
        ))}
      </RevealGroup>
    </section>
  );
}
