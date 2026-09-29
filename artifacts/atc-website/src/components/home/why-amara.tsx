import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  { title: "Finishes matched across handle, hinge and lock", body: "One tone through the whole door schedule, checked against physical samples in daylight.", image: "/images/showroom-handles.webp", alt: "Door handles in a range of finishes on one wall" },
  { title: "Item numbers checked against the current sheet", body: "Always the current sheet. What we quote is what the manufacturer ships today.", image: "/images/showroom-dnd.webp", alt: "Handles labelled on display boards" },
  { title: "Stock held in Amman, not promised from a port", body: "Stock on the ground, so a project does not wait on a container.", image: "/images/showroom-blum.webp", alt: "Kitchen systems built and stocked on the showroom floor" },
  { title: "A consultant who has installed the system", body: "At the mock-up before the joinery is cut, and back on site years later.", image: "/images/kitchen-corner.webp", alt: "Corner drawers installed and pulled out for use" },
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
    <div
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
    </div>
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
              <li key={detail.title} className="h-full w-[min(76vw,1080px)] flex-none">
                <DetailPanel detail={detail} index={index} active={index === active} className="h-full md:grid-cols-12" />
              </li>
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

const SERVICE_MS = 4500;

/** One service in the index: the number, the title, and the body once the row is open. */
function ServiceRow({ index, title, body, open, stacked, onOpen }: { index: number; title: string; body: string; open: boolean; stacked: boolean; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const image = SERVICE_IMAGES[index] ?? SERVICE_IMAGES[0];
  return (
    <li className="relative border-t border-border" data-testid={`service-row-${index}`} data-open={open}>
      {open && <motion.span layoutId="service-marker" className="absolute -left-px top-0 h-full w-0.5 bg-primary" transition={{ type: "spring", stiffness: 300, damping: 32 }} aria-hidden />}
      <button
        type="button"
        onClick={onOpen}
        onPointerEnter={() => !stacked && onOpen()}
        onFocus={onOpen}
        aria-expanded={open}
        className="block w-full py-6 pl-5 text-left outline-none focus-visible:bg-background md:py-7 md:pl-6"
      >
        <span className={cn("font-display text-2xl font-medium leading-[1.02] tracking-[-0.03em] transition-colors md:text-3xl", open ? "text-foreground" : "text-foreground/60")}>{title}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-7">
              <div className="pl-5 md:pl-6">
                <p className="max-w-md text-base leading-7 text-muted-foreground">{body}</p>
                {stacked && (
                  <div className="mt-5 aspect-[16/10] overflow-hidden bg-background">
                    <MediaImage src={image.src} alt={image.alt} width={900} height={563} sizes="100vw" className="h-full w-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/**
 * For architects: a numbered index of the four services on the left, one photograph on the
 * right that changes with the open row. The index steps on its own, waits under the pointer,
 * and on phones each row carries its own picture instead of the sticky one.
 */
function ForArchitects() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const stacked = !useMediaQuery("(min-width: 1024px)");
  const image = SERVICE_IMAGES[active] ?? SERVICE_IMAGES[0];

  useEffect(() => {
    if (reduce || paused || !inView) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % ARCHITECT_SERVICES.length), SERVICE_MS);
    return () => window.clearInterval(timer);
  }, [reduce, paused, inView]);

  return (
    <Section tone="panel">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <h2 className="max-w-[16ch] font-display text-[clamp(2.5rem,4.6vw,4.5rem)] font-medium leading-[0.94] tracking-[-0.04em]">For architects, fabricators and procurement teams.</h2>
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9">
          <p className="max-w-sm text-base leading-7 text-muted-foreground">
            Send a door schedule, a joinery package or a project brief. We return item nos., finishes and drawings, sit at the mock-up with you, and quote against the full schedule.
          </p>
          <SolidLink href="/contact" className="mt-7">Send a trade enquiry</SolidLink>
        </Reveal>
      </div>

      <div
        ref={ref}
        className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-8"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <Reveal className="lg:col-span-6">
          <LayoutGroup id="architect-services">
            <ol className="border-b border-border" aria-label="Services for architects" data-testid="service-index">
              {ARCHITECT_SERVICES.map((service, index) => (
                <ServiceRow key={service.title} index={index} title={service.title} body={service.body} open={index === active} stacked={stacked} onOpen={() => setActive(index)} />
              ))}
            </ol>
          </LayoutGroup>
        </Reveal>

        {!stacked && (
          <div
            className="sticky z-10 self-start lg:col-span-5 lg:col-start-8"
            style={{ top: "calc(var(--nav-offset, 76px) + 1rem)" }}
          >
            <figure>
              <div className="relative aspect-[4/5] max-h-[calc(100dvh-8rem)] overflow-hidden bg-background">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={image.src}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <MediaImage src={image.src} alt={image.alt} width={900} height={1125} sizes="(min-width: 1024px) 40vw, 100vw" className="h-full w-full object-cover object-top" />
                  </motion.div>
                </AnimatePresence>
              </div>
              <figcaption className="mt-4 flex items-center justify-between font-mono text-xs tracking-[0.12em] text-muted-foreground" data-testid="text-service-caption">
                <span>{ARCHITECT_SERVICES[active]?.title}</span>
                <span className="tabular-nums"><span className="text-foreground">{String(active + 1).padStart(2, "0")}</span> / {String(ARCHITECT_SERVICES.length).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          </div>
        )}
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
