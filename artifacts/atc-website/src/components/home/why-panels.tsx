import { useRef, type CSSProperties } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { MediaImage } from "@/components/media-image";

/**
 * Full-bleed panel stack cloned from Mara's homepage panels list.
 * The stage sticks under the header. Each panel but the last wipes off on a diagonal
 * (right edge from 100% to 0%, left edge from 125% to -20%) while its photograph
 * eases from 1.1 to 1 and the next photograph eases from 1 to 1.1. Scroll progress
 * across the section drives the wipes in sequence, with no easing.
 */

interface Panel {
  id: string;
  lines: [string, string];
  body: string;
  background: string;
  backgroundAlt: string;
  backgroundPosition: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
}

const PANELS: Panel[] = [
  {
    id: "problem",
    lines: ["Bring the", "problem."],
    body: "A door that slams, a drawer that sticks, a finish that will not match. The order starts there.",
    background: "/images/why/typo-bg.jpg",
    backgroundAlt: "Close view of a bent-wood seat and its steel frame",
    backgroundPosition: "center",
    image: "/images/why/typo-main.jpg",
    imageAlt: "Two workshop chairs on a dark floor",
    imagePosition: "center",
  },
  {
    id: "agent",
    lines: ["One place", "answers."],
    body: "Each brand we carry has one agent in Jordan. The item number and the warranty come back to this counter.",
    background: "/images/why/libro-bg.jpg",
    backgroundAlt: "Close view of a folding table top",
    backgroundPosition: "center",
    image: "/images/why/libro-main.jpg",
    imageAlt: "Folding tables on castors, one open and one standing",
    imagePosition: "center",
  },
  {
    id: "working",
    lines: ["Try it", "working."],
    body: "Both showrooms are built, not staged. Open the drawer, load it, then take the item number.",
    background: "/images/why/follow-bg.jpg",
    backgroundAlt: "The edge of a height-adjustable table",
    backgroundPosition: "center",
    image: "/images/why/follow-main.jpg",
    imageAlt: "A group of height-adjustable tables and a chair",
    imagePosition: "center",
  },
];

const CSS = `
.why-panels {
  --cols: 26;
  --rows: 18;
  position: relative;
  width: 100%;
  padding: 0;
  background: #1e1d20;
  color: #e9e7e2;
  font-family: var(--font-sans);
}
@media (min-width: 48em) {
  .why-panels { --cols: 32; }
}
.why-panels__stage {
  position: sticky;
  top: 76px;
  height: calc(100svh - 76px);
  display: grid;
  grid-template: "panel" 100% / 100%;
  overflow: hidden;
}
.why-panels__title {
  position: absolute;
  z-index: 30;
  top: calc(100 / var(--rows) * 0.55 * 1svh);
  left: calc(100 / var(--cols) * 1.15 * 1vw);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  max-width: calc(100 / var(--cols) * 9 * 1vw);
  margin: 0;
  padding: 0;
  background: none;
  border: 0;
  box-shadow: none;
  color: #f2f4f7;
  pointer-events: none;
}
.why-panels__title-kicker {
  color: #cc1f1f;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 400;
  letter-spacing: 0.18em;
  line-height: 1;
  text-transform: uppercase;
}
.why-panels__title-name {
  color: #f2f4f7;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.15rem, 1.65vw, 1.75rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}
.why-panels > .why-panels__title {
  position: relative;
  top: auto;
  margin: 1.25rem 0 0.75rem calc(100 / var(--cols) * 1.15 * 1vw);
}
.why-panels__item {
  position: relative;
  grid-area: panel;
  display: grid;
  grid-template: "items" 100% / 100%;
}
.why-panels__item > * { grid-area: items; place-self: center; }
.why-panels__bg {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.why-panels__bg img { object-position: var(--bg-pos, center); }
.why-panels__shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(16, 17, 20, 0) 0%, rgba(16, 17, 20, 0) 22%, rgba(16, 17, 20, 0.55) 38%, rgba(16, 17, 20, 0.2) 62%, rgba(16, 17, 20, 0) 100%),
    linear-gradient(90deg, rgba(16, 17, 20, 0.28) 0%, rgba(16, 17, 20, 0) 40%);
  pointer-events: none;
}
.why-panels__main {
  z-index: 1;
  overflow: hidden;
  width: calc(100 / var(--cols) * 10 * 1vw);
  height: calc(100 / var(--rows) * 13.5 * 1svh);
}
.why-panels__main img { object-fit: cover; object-position: var(--img-pos, center); }
.why-panels__item > .why-panels__copy {
  z-index: 2;
  place-self: center start;
  width: calc(100 / var(--cols) * 9 * 1vw);
  margin-left: calc(100 / var(--cols) * 1.15 * 1vw);
  color: #f2f4f7;
}
.why-panels__index {
  display: block;
  margin: 0 0 0.85rem;
  color: #cc1f1f;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.16em;
  line-height: 1;
}
.why-panels__headline {
  margin: 0;
  color: #f2f4f7;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(2.35rem, 4.4vw, 4.6rem);
  line-height: 0.9;
  letter-spacing: -0.045em;
}
.why-panels__line { display: block; }
.why-panels__body {
  margin: 1.15rem 0 0;
  max-width: 28ch;
  color: rgba(242, 244, 247, 0.78);
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: 0.9375rem;
  line-height: 1.45;
  letter-spacing: 0;
}
@media (max-width: 47.99em) {
  .why-panels__main {
    width: calc(100 / var(--cols) * 11.5 * 1vw);
    height: calc(100 / var(--rows) * 5.3 * 1svh);
    margin-right: calc(100 / var(--cols) * 1vw);
    justify-self: end;
  }
  .why-panels__shade {
    background:
      linear-gradient(180deg, rgba(16, 17, 20, 0) 46%, rgba(16, 17, 20, 0.72) 78%, rgba(16, 17, 20, 0.88) 100%),
      rgba(30, 29, 32, 0.2);
  }
  .why-panels__title {
    top: calc(100 / var(--rows) * 0.4 * 1svh);
    left: calc(100 / var(--cols) * 1 * 1vw);
    max-width: min(18rem, calc(100% - (100 / var(--cols) * 2 * 1vw)));
  }
  .why-panels__title-name { font-size: 1.35rem; }
  .why-panels__item > .why-panels__copy {
    place-self: end stretch;
    width: auto;
    margin: 0;
    padding: 0 calc(100 / var(--cols) * 1 * 1vw) max(1.25rem, calc(100 / var(--rows) * 0.9 * 1svh));
  }
  .why-panels__headline { font-size: clamp(2.6rem, 12vw, 3.5rem); }
  .why-panels__body { max-width: 32ch; font-size: 1rem; }
}
@media (min-width: 48em) and (max-width: 63.99em) and (orientation: portrait) {
  .why-panels__main {
    width: calc(100 / var(--cols) * 20 * 1vw);
    height: calc(100 / var(--rows) * 12 * 1svh);
    margin-right: 0;
    justify-self: center;
  }
  .why-panels__item > .why-panels__copy {
    width: calc((100vw - (100 / var(--cols) * 20 * 1vw)) / 2 - 2.4vw);
  }
  .why-panels__headline { font-size: clamp(1.6rem, 3.3vw, 2.15rem); }
  .why-panels__body { font-size: 0.8125rem; }
}
@media (prefers-reduced-motion: reduce) {
  .why-panels__stage { position: relative; top: auto; }
}
`;

function wipe(progress: number, index: number, count: number) {
  return Math.min(1, Math.max(0, progress * (count - 1) - index));
}

function clipFor(progress: number, index: number, count: number) {
  if (index >= count - 1) return "none";
  const u = wipe(progress, index, count);
  const right = 100 * (1 - u);
  const left = 125 - 145 * u;
  return `polygon(0% 0%, 100% 0%, 100% ${right}%, 0% ${left}%)`;
}

function scaleFor(progress: number, index: number, count: number) {
  const prev = index === 0 ? 0 : wipe(progress, index - 1, count);
  const own = index === count - 1 ? 0 : wipe(progress, index, count);
  if (index === 0) return 1.1 - 0.1 * own;
  if (index === count - 1) return 1 + 0.1 * prev;
  if (own > 0) return 1.1 - 0.1 * own;
  return 1 + 0.1 * prev;
}

function Frame({
  panel,
  index,
  count,
  progress,
  priority,
  still = false,
}: {
  panel: Panel;
  index: number;
  count: number;
  progress: MotionValue<number>;
  priority?: boolean;
  still?: boolean;
}) {
  const clipPath = useTransform(progress, (value) => (still ? "none" : clipFor(value, index, count)));
  const scale = useTransform(progress, (value) => (still ? 1 : scaleFor(value, index, count)));
  return (
    <motion.article className="why-panels__item" style={{ zIndex: 20 - index, clipPath }} data-testid={`why-panel-${index}`}>
      <div className="why-panels__bg" style={{ "--bg-pos": panel.backgroundPosition } as CSSProperties}>
        <motion.div className="absolute inset-0" style={{ scale }}>
          <MediaImage
            src={panel.background}
            alt={panel.backgroundAlt}
            width={1600}
            height={1067}
            lazy={!priority}
            sizes="100vw"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <span className="why-panels__shade" aria-hidden />
      </div>
      <div className="why-panels__main" style={{ "--img-pos": panel.imagePosition } as CSSProperties}>
        <motion.div className="h-full w-full" style={{ scale }}>
          <MediaImage
            src={panel.image}
            alt={panel.imageAlt}
            width={1200}
            height={1200}
            lazy={!priority}
            sizes="(min-width: 64em) 32vw, 50vw"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
      <div className="why-panels__copy">
        <span className="why-panels__index">{String(index + 1).padStart(2, "0")}</span>
        <h3 className="why-panels__headline">
          {panel.lines.map((line) => (
            <span key={line} className="why-panels__line">{line}</span>
          ))}
        </h3>
        <p className="why-panels__body">{panel.body}</p>
      </div>
    </motion.article>
  );
}

function Pinned() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section ref={ref} className="why-panels" style={{ height: `${PANELS.length * 75}svh` }} aria-labelledby="why-atc-heading" data-testid="why-amara-panels">
      <style>{CSS}</style>
      <div className="why-panels__stage">
        <h2 id="why-atc-heading" className="why-panels__title">
          <span className="why-panels__title-kicker">Why</span>
          <span className="why-panels__title-name">Amara Trading Center</span>
        </h2>
        {PANELS.map((panel, index) => (
          <Frame key={panel.id} panel={panel} index={index} count={PANELS.length} progress={scrollYProgress} priority={index === 0} />
        ))}
      </div>
    </section>
  );
}

function Stacked() {
  const still = useMotionValue(0);
  return (
    <section className="why-panels" aria-labelledby="why-atc-heading" data-testid="why-amara-panels">
      <style>{CSS}</style>
      <h2 id="why-atc-heading" className="why-panels__title">
        <span className="why-panels__title-kicker">Why</span>
        <span className="why-panels__title-name">Amara Trading Center</span>
      </h2>
      {PANELS.map((panel, index) => (
        <div key={panel.id} className="why-panels__stage">
          <Frame panel={panel} index={index} count={PANELS.length} progress={still} still priority={index === 0} />
        </div>
      ))}
    </section>
  );
}

export function WhyAmaraPanels() {
  const reduce = useReducedMotion();
  return reduce ? <Stacked /> : <Pinned />;
}
