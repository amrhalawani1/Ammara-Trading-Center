import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ARCHITECT_SERVICES } from "@/lib/home-content";
import { cn } from "@/lib/utils";
import { EditorialLink, Reveal, Section, SolidLink } from "./primitives";

interface Detail {
  title: string;
  body: string;
  image: string;
  alt: string;
}

const DETAILS: Detail[] = [
  { title: "Finishes matched across handle, hinge and lock", body: "One tone through the whole door schedule, checked against physical samples in daylight.", image: "/images/showroom-detail.webp", alt: "Matched hardware finishes on display" },
  { title: "Item numbers checked against the current sheet", body: "Never a cached copy. What we quote is what the manufacturer ships today.", image: "/images/trade-workshop.webp", alt: "A specification checked against the manufacturer's drawing" },
  { title: "Stock held in Amman, not promised from a port", body: "Deep inventory on the ground, so a programme does not wait on a container.", image: "/images/trade-planning.webp", alt: "Stock planning at the trade desk" },
  { title: "A consultant who has installed the system", body: "At the mock-up before the joinery is cut, and back on site years later.", image: "/images/hero-kitchen.webp", alt: "An installed kitchen with concealed hardware" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/** Headline, statement and the link, shared by the pinned and stacked layouts. */
function StatementHeader({ counter }: { counter?: number }) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
      <h2 className="max-w-[12ch] font-display text-[clamp(2.75rem,5.5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.045em] lg:col-span-7">The detail is the work.</h2>
      <div className="lg:col-span-5 lg:pb-2">
        <p className="max-w-[40ch] text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          A room is judged by its smallest moving part. We choose partners on that basis and stay involved until the last hinge is adjusted.
        </p>
        <div className="mt-6 flex items-center justify-between gap-6">
          <EditorialLink href="/about" light>How we work</EditorialLink>
          {counter !== undefined && (
            <span className="font-mono text-xs tabular-nums tracking-[0.12em] text-muted-foreground" data-testid="text-detail-counter" aria-live="polite">
              <span className="text-foreground">{pad(counter + 1)}</span> / {pad(DETAILS.length)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** One detail: the photograph beside its numbered title and body. Text never sits on the image. */
function DetailPanel({ detail, index, active, className }: { detail: Detail; index: number; active: boolean; className?: string }) {
  return (
    <li
      className={cn("grid gap-5 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]", active ? "opacity-100" : "opacity-40", className)}
      data-testid={`detail-panel-${index}`}
      data-active={active}
    >
      <div className="relative overflow-hidden bg-card aspect-[4/3] md:aspect-auto md:col-span-7 md:h-full md:min-h-[300px]">
        <MediaImage
          src={detail.image}
          alt={detail.alt}
          width={1200}
          height={900}
          sizes="(min-width: 1024px) 44vw, (min-width: 768px) 56vw, 100vw"
          className={cn("absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]", active ? "scale-100" : "scale-[1.06]")}
        />
      </div>
      <div className="flex flex-col justify-between gap-8 md:col-span-5 md:py-1">
        <span className="font-mono text-xs tracking-[0.12em] text-primary" aria-hidden>{pad(index + 1)}</span>
        <div>
          <h3 className="font-display text-3xl font-medium leading-[1] tracking-[-0.035em] md:text-4xl lg:text-[2.6rem]">{detail.title}</h3>
          <p className="mt-4 max-w-[36ch] text-base leading-7 text-muted-foreground">{detail.body}</p>
        </div>
      </div>
    </li>
  );
}

/**
 * Desktop: the section holds the viewport while the four details pass horizontally, one panel
 * per screen of scrolling, so the reader looks closer at each in turn. The vertical run is set to
 * the horizontal distance, which keeps the track moving at the speed of the wheel. A red hairline
 * under the header and a counter show where in the four the reader is.
 */
function PinnedDetails() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - track.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.min(DETAILS.length - 1, Math.max(0, Math.round(value * (DETAILS.length - 1)))));
  });

  return (
    <div ref={wrapperRef} style={{ height: `calc(100dvh + ${distance}px)` }} data-testid="detail-track">
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pb-10 pt-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 md:px-12">
          <StatementHeader counter={active} />
          <div className="relative mt-8 h-px bg-border" aria-hidden>
            <motion.span style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-primary" />
          </div>
        </div>
        <div className="mx-auto mt-8 w-full min-h-0 max-w-[1440px] flex-1 px-6 md:px-12">
          <motion.ol ref={trackRef} style={{ x }} className="flex h-full gap-4 will-change-transform" aria-label="What attention to detail means">
            {DETAILS.map((detail, index) => (
              <DetailPanel key={detail.title} detail={detail} index={index} active={index === active} className="h-full w-[min(76vw,1080px)] flex-none md:grid-cols-12" />
            ))}
          </motion.ol>
        </div>
      </div>
    </div>
  );
}

/** Phones, tablets and reduced motion: the same four details as a plain numbered list. */
function StackedDetails() {
  return (
    <Section className="pb-0 md:pb-0">
      <Reveal>
        <StatementHeader />
      </Reveal>
      <ol className="mt-14 divide-y divide-border border-t border-border md:mt-20" aria-label="What attention to detail means">
        {DETAILS.map((detail, index) => (
          <Reveal key={detail.title} as="li" className="py-8 md:py-10">
            <DetailPanel detail={detail} index={index} active className="md:grid-cols-12 md:gap-8" />
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/**
 * Why Amara. The four things "attention to detail" means, read one at a time: pinned and
 * horizontal on a desktop, stacked everywhere else.
 */
function Statement() {
  const wide = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  return wide && !reduce ? <PinnedDetails /> : <StackedDetails />;
}

/** Photographs for each service, in the order of ARCHITECT_SERVICES. */
const SERVICE_IMAGES = [
  { src: "/images/resources-docs.webp", alt: "Specification documents on the desk" },
  { src: "/images/trade-planning.webp", alt: "A drawing reviewed with an architect" },
  { src: "/images/showroom-detail.webp", alt: "Finish samples on display" },
  { src: "/images/trade-workshop.webp", alt: "A consultant at the workshop bench" },
] as const;

/**
 * One service as a sheet: the photograph grows to full size as it arrives and the whole row dims
 * once it has been read, so the sheet the reader is on is always the brightest.
 */
function ServiceSheet({ index, title, body }: { index: number; title: string; body: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.35], reduce ? [1, 1] : [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.7, 1], reduce ? [1, 1, 1, 1] : [0.35, 1, 1, 0.3]);
  const image = SERVICE_IMAGES[index] ?? SERVICE_IMAGES[0];

  return (
    <motion.li ref={ref} style={{ opacity }} className="grid gap-6 border-t border-border py-10 first:border-t-0 first:pt-0 md:grid-cols-12 md:items-center md:gap-8 md:py-12" data-testid={`service-sheet-${index}`}>
      <motion.div style={{ scale }} className="relative aspect-[16/10] origin-bottom-left overflow-hidden bg-card will-change-transform md:col-span-5">
        <MediaImage src={image.src} alt={image.alt} width={900} height={563} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 40vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
      </motion.div>
      <div className="md:col-span-7">
        <h3 className="font-display text-3xl font-medium leading-[0.98] tracking-[-0.035em] md:text-4xl">{title}</h3>
        <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">{body}</p>
      </div>
    </motion.li>
  );
}

/**
 * For architects: the red panel stays pinned on the left while the four services pass on the
 * right as photographed sheets. One headline, one call to action, and a wide enough measure that
 * the headline never falls past three lines.
 */
function ForArchitects() {
  return (
    <Section tone="panel">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Reveal className="flex flex-col justify-between bg-primary p-8 text-primary-foreground md:p-10 lg:sticky lg:top-32 lg:min-h-[520px]">
            <div>
              <h2 className="max-w-[14ch] font-display text-[clamp(2.5rem,3.6vw,3.75rem)] font-medium leading-[0.94] tracking-[-0.04em]">For architects and the practices that specify.</h2>
              <p className="mt-6 max-w-sm text-base leading-7 text-primary-foreground/85">
                Send a door schedule or a joinery package. We return item numbers, finishes and drawings, and we sit at the mock-up with you.
              </p>
            </div>
            <div className="mt-12">
              <SolidLink href="/contact" tone="light">Contact us</SolidLink>
            </div>
          </Reveal>
        </div>
        <ul className="lg:col-span-7" aria-label="Services for architects">
          {ARCHITECT_SERVICES.map((service, index) => (
            <ServiceSheet key={service.title} index={index} title={service.title} body={service.body} />
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function WhyAmara() {
  return (
    <>
      <div className="dark bg-background text-foreground">
        <Statement />
      </div>
      <ForArchitects />
    </>
  );
}
