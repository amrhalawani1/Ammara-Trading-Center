import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { Reveal, RevealGroup, Section } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { useAmmanTime, useOpenStatus } from "@/hooks/use-open-status";
import { company } from "@/lib/content";
import { SOLUTION_IMAGES } from "@/lib/home-content";
import { mapsHref } from "@/lib/maps";
import { SOLUTIONS } from "@/lib/solutions";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

const EASE = [0.16, 1, 0.3, 1] as const;
const SHOWROOM_IMAGES = ["/images/showroom-wide.webp", "/images/showroom-detail.webp"] as const;

/** Systems installed on the floor, in the order a visitor walks past them. */
const FLOOR = ["door-window-handles", "cabinet-handles", "hinges", "drawer-systems", "sliding-folding", "kitchen-storage"] as const;

const NOTES = [
  { title: "No appointment.", body: "Walk in during opening hours. A consultant is on the floor at both showrooms and will leave you alone until you want them." },
  { title: "Bring the drawings.", body: "A door schedule or a joinery package is enough. We return item numbers, finishes and the drawings for each system you choose." },
  { title: "Open Saturday to Thursday.", body: "Both showrooms close on Friday. Al-Bayader keeps later hours; Al-Wehdat opens earlier for the trade." },
] as const;

export default function Showroom() {
  const askHref = whatsappUrl("Hello ATC, I would like to visit a showroom. Which one should I come to?");

  return (
    <MainLayout immersiveHeader>
      <Hero />

      {/* Locations: two panels, the flagship wider, each with its live status. */}
      <Section className="pb-12 md:pb-16">
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Where to find us.</h2>
          <AmmanClock />
        </Reveal>
        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-12">
          {company.showrooms.map((showroom, index) => (
            <LocationPanel key={showroom.name} index={index} className={index === 0 ? "lg:col-span-7" : "lg:col-span-5"} />
          ))}
        </div>
        {company.contactUnconfirmed && <p className="mt-6 max-w-xl text-xs leading-5 text-muted-foreground">{company.contactNote}</p>}
      </Section>

      {/* On the floor: a scroll-snap row of the systems that can be operated before specifying. */}
      <Section dark className="overflow-hidden">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">On the floor.</h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Every system is installed and wired. Open it, load it, close it, then take the item number to the catalogue.</p>
        </Reveal>
        <RevealGroup as="ul" className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:-mx-12 md:mt-16 md:px-12 [&::-webkit-scrollbar]:hidden" aria-label="Systems on the showroom floor">
          {FLOOR.map((slug) => {
            const solution = SOLUTIONS.find((s) => s.slug === slug)!;
            const media = SOLUTION_IMAGES[slug]!;
            return (
              <motion.li key={slug} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } }} className="w-[74vw] shrink-0 snap-start sm:w-[340px] lg:w-[380px]">
                <Link href={`/catalog?solution=${slug}`} className="group block" data-testid={`link-floor-${slug}`}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-card">
                    <MediaImage src={media.image} alt={media.alt} width={900} height={1125} sizes="(min-width: 1024px) 380px, (min-width: 640px) 340px, 74vw" className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]" />
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" aria-hidden />
                  </div>
                  <p className="mt-5 flex items-baseline justify-between gap-4 font-display text-2xl font-medium leading-none tracking-[-0.03em] transition-colors group-hover:text-primary">
                    {solution.name}
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" strokeWidth={1.75} />
                  </p>
                  <p className="mt-2 max-w-[32ch] text-sm leading-6 text-muted-foreground">{solution.line}</p>
                </Link>
              </motion.li>
            );
          })}
        </RevealGroup>
      </Section>

      {/* Before you come: three plain notes. */}
      <Section tone="panel">
        <Reveal>
          <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Before you come.</h2>
        </Reveal>
        <RevealGroup as="ul" className="mt-12 md:mt-16">
          {NOTES.map((note) => (
            <motion.li key={note.title} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } } }} className="grid gap-4 border-t border-border py-8 md:grid-cols-12 md:py-10">
              <h3 className="font-display text-3xl font-medium leading-none tracking-[-0.03em] md:col-span-5 md:text-4xl">{note.title}</h3>
              <p className="max-w-md text-base leading-7 text-muted-foreground md:col-span-7">{note.body}</p>
            </motion.li>
          ))}
        </RevealGroup>
      </Section>

      {/* Close: one question, one channel. */}
      <Section dark className="py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Not sure which floor? Tell us what you are working on.</p>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">We will point you to the showroom that has your system installed and make sure a consultant is free when you arrive.</p>
          </Reveal>
          <Reveal className="md:col-span-4 md:justify-self-end" delay={0.1}>
            <a href={askHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:translate-y-px" data-testid="link-showroom-whatsapp">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Message on WhatsApp
            </a>
          </Reveal>
        </div>
      </Section>
    </MainLayout>
  );
}

/** Full-bleed photograph that parallaxes away as the page starts; the headline sits on the lower left. */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);
  const enter = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } });

  return (
    <section ref={ref} className="dark relative flex min-h-[88dvh] flex-col justify-end overflow-hidden bg-background text-foreground" data-testid="section-showroom-hero">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <MediaImage src="/images/showroom-wide.webp" alt="The Al-Bayader showroom floor with installed kitchen and door systems" width={1920} height={1080} lazy={false} fetchPriority="high" sizes="100vw" className="h-[118%] w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/25" aria-hidden />
      <motion.div style={{ opacity: fade }} className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-44 md:px-12 md:pb-24">
        <motion.h1 {...enter(0.1)} className="max-w-[20ch] font-display text-[clamp(2.75rem,6vw,6.25rem)] font-medium leading-[0.9] tracking-[-0.05em]">
          Two floors in Amman where everything opens.
        </motion.h1>
        <motion.p {...enter(0.25)} className="mt-8 max-w-md text-lg leading-8 text-foreground/75">
          Every hinge, runner and lever on the floor is installed and can be operated. Walk in, no appointment.
        </motion.p>
      </motion.div>
    </section>
  );
}

function AmmanClock() {
  const time = useAmmanTime();
  return (
    <p className="text-sm text-muted-foreground" data-testid="text-amman-time">
      <span className="font-mono text-base tabular-nums text-foreground">{time}</span> in Amman
    </p>
  );
}

/** One showroom: photograph, live status, name, the details a visitor needs and two ways to act on them. */
function LocationPanel({ index, className }: { index: number; className?: string }) {
  const showroom = company.showrooms[index]!;
  const status = useOpenStatus(showroom.hours);
  const [days, times] = showroom.hours.split(",").map((part) => part.trim());
  const reduce = useReducedMotion();

  return (
    <Reveal as="article" delay={index * 0.08} className={cn("flex flex-col bg-card", className)} data-testid={`panel-showroom-${showroom.name.toLowerCase()}`}>
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[380px] lg:flex-1">
        <MediaImage src={SHOWROOM_IMAGES[index] ?? SHOWROOM_IMAGES[0]} alt={`${showroom.name} showroom`} width={1400} height={1050} sizes="(min-width: 1024px) 60vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-xs text-muted-foreground">{showroom.role}</p>
          {status && (
            <p className={cn("flex items-center gap-2 text-xs", status.open ? "text-foreground" : "text-muted-foreground")} aria-live="polite" data-testid={`status-showroom-${showroom.name.toLowerCase()}`}>
              <span className="relative flex h-2 w-2" aria-hidden>
                {status.open && !reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />}
                <span className={cn("relative inline-flex h-2 w-2 rounded-full", status.open ? "bg-emerald-500" : "bg-border")} />
              </span>
              {status.label}
            </p>
          )}
        </div>
        <h3 className="mt-3 font-display text-4xl font-medium leading-none tracking-[-0.04em] md:text-5xl">{showroom.name}</h3>
        <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <dt className="text-xs text-muted-foreground">Address</dt>
            <dd className="mt-1 text-base leading-6">
              {showroom.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Hours</dt>
            <dd className="mt-1 text-base leading-6">
              <span className="block">{days}</span>
              <span className="block">{times}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Phone</dt>
            <dd className="mt-1 text-base leading-6 tabular-nums">{showroom.phone}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={mapsHref(showroom.name, showroom.addressLines)} target="_blank" rel="noreferrer" className="group inline-flex h-11 items-center gap-2 bg-foreground px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition-[background-color,color,transform] hover:bg-primary hover:text-primary-foreground active:translate-y-px" data-testid={`link-directions-${showroom.name.toLowerCase()}`}>
            Directions <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
          </a>
          <a href={`tel:${showroom.phone.replace(/\s+/g, "")}`} className="inline-flex h-11 items-center gap-2 border border-foreground/25 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground active:translate-y-px" data-testid={`link-call-${showroom.name.toLowerCase()}`}>
            <Phone className="h-3.5 w-3.5" strokeWidth={2} /> Call
          </a>
        </div>
      </div>
    </Reveal>
  );
}
