import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { useGetPublicCatalog } from "@workspace/api-client-react";
import { BRAND_LOGOS, BrandMark } from "@/components/home/partner-brands";
import { EditorialLink, Kicker, Reveal, RevealGroup, Section, SolidLink, SPRING } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { CERTIFICATIONS, REFERENCES } from "@/lib/about-content";
import {
  AUDIENCES,
  EXCLUSIVITY_POINTS,
  MILESTONES,
  NEW_ABOUT_HERO,
  PRINCIPLES,
  VISIT_STEPS,
  type Audience,
} from "@/lib/new-about-content";
import { SHOWROOMS, showroomHref } from "@/lib/showrooms";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

const EASE = [0.16, 1, 0.3, 1] as const;
const rise = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: SPRING } };

/** Blum first: the client named it the brand ATC wants to be measured by. */
const BRAND_ORDER = ["blum", "barazza", "hafele", "hawa", "salice", "dnd", "kessebohmer", "fgv", "emuca", "grass", "vibo"];
/** Held back until ATC confirms it: the research lists Hettich as a brand ATC does not carry. */
const UNCONFIRMED_BRANDS = new Set(["hettich"]);

/**
 * /new-about: the About page restructured around the research. It proves credibility before it
 * asks for anything (core value 02), gives each audience its own way in, and keeps the history as
 * a footnote rather than the headline.
 */
export default function NewAbout() {
  const { data: catalog } = useGetPublicCatalog();
  const brands = (catalog?.brands ?? [])
    .filter((brand) => BRAND_LOGOS[brand.slug] && !UNCONFIRMED_BRANDS.has(brand.slug))
    .sort((a, b) => (BRAND_ORDER.indexOf(a.slug) + 1 || 99) - (BRAND_ORDER.indexOf(b.slug) + 1 || 99));

  return (
    <MainLayout immersiveHeader>
      <Hero />
      <Visit />
      <Audiences />
      <Exclusive brands={brands} />
      <History />
      <Installed />
      <Principles />
      <OnRecord />
      <Closing />
    </MainLayout>
  );
}

/** The thesis first, with the legacy markers set small underneath. No call to action yet. */
function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } });

  return (
    <section className="dark relative flex min-h-[80dvh] flex-col justify-end overflow-hidden bg-background text-foreground" data-testid="section-new-about-hero">
      <MediaImage src="/images/building-facade.webp" alt="The Amara Trading Center building, with the name set into the stone facade" width={1920} height={1080} lazy={false} fetchPriority="high" sizes="100vw" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-44 md:px-12 md:pb-24">
        <motion.div {...enter(0)}>
          <Kicker light>{NEW_ABOUT_HERO.kicker}</Kicker>
        </motion.div>
        <motion.h1 {...enter(0.1)} className="mt-6 max-w-[18ch] font-display text-[clamp(2.75rem,6.5vw,6.5rem)] font-medium leading-[0.9] tracking-[-0.05em] text-balance">
          {NEW_ABOUT_HERO.headline}
        </motion.h1>
        <motion.p {...enter(0.25)} className="mt-8 max-w-xl text-lg leading-8 text-foreground/80">
          {NEW_ABOUT_HERO.intro}
        </motion.p>
        <motion.ul {...enter(0.35)} className="mt-10 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 font-mono text-xs uppercase tracking-[0.16em] text-foreground/60" aria-label="In brief">
          {NEW_ABOUT_HERO.markers.map((marker, index) => (
            <li key={marker} className="flex items-center gap-6">
              {index > 0 && <span className="hidden h-3 w-px bg-foreground/30 sm:block" aria-hidden />}
              {marker}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/** How a visit works: the showroom ritual, as the numbered sequence it is. */
function Visit() {
  return (
    <Section id="how-we-work">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <Kicker>How we work</Kicker>
          <h2 className="mt-5 max-w-[14ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Come with a problem. Leave with the answer.</h2>
          <div className="relative mt-10 aspect-[4/5] overflow-hidden bg-card">
            <MediaImage src="/images/showroom-lounge.webp" alt="The showroom lounge, looking through to the installed kitchens" width={1000} height={1250} sizes="(min-width: 1024px) 36vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </Reveal>
        <RevealGroup as="ol" className="self-end lg:col-span-6 lg:col-start-7">
          {VISIT_STEPS.map((step, index) => (
            <motion.li key={step.title} variants={rise} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-8 last:border-b">
              <span className="font-mono text-sm tabular-nums text-primary">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-2xl font-medium leading-tight tracking-[-0.03em] md:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-lg text-base leading-7 text-muted-foreground">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/** One brand, four ways in: each persona gets its own promise and its own next step. */
function Audiences() {
  return (
    <Section tone="panel" id="who-we-work-with">
      <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Kicker>Who we work with</Kicker>
          <h2 className="mt-5 max-w-[16ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Most of the day is trade. Everyone gets the same consultant.</h2>
        </div>
        <p className="max-w-sm text-base leading-7 text-muted-foreground lg:col-span-4 lg:col-start-9">
          Kitchen makers, joiners, design practices and architects place around four orders in five. Homeowners place the fifth.
        </p>
      </Reveal>
      <RevealGroup as="ul" className="mt-14 grid gap-px bg-border md:grid-cols-2">
        {AUDIENCES.map((audience) => (
          <motion.li key={audience.id} variants={rise} className="flex flex-col justify-between gap-10 bg-card p-8 md:min-h-[320px] md:p-10" data-testid={`audience-${audience.id}`}>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{audience.who}</p>
              <h3 className="mt-4 max-w-[18ch] font-display text-3xl font-medium leading-[1] tracking-[-0.04em] md:text-4xl">{audience.promise}</h3>
              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">{audience.body}</p>
            </div>
            <AudienceLink audience={audience} />
          </motion.li>
        ))}
      </RevealGroup>
    </Section>
  );
}

function AudienceLink({ audience }: { audience: Audience }) {
  const { action } = audience;
  if ("whatsapp" in action) {
    return <EditorialLink href={whatsappUrl(action.whatsapp)} external>{action.label}</EditorialLink>;
  }
  return <EditorialLink href={action.href}>{action.label}</EditorialLink>;
}

/** What exclusivity means for the person ordering, with the brands as marks only. */
function Exclusive({ brands }: { brands: Array<{ slug: string; name: string }> }) {
  return (
    <Section id="exclusive">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <Kicker>The brands</Kicker>
          <h2 className="mt-5 max-w-[12ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">One agent. Every brand.</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            Each manufacturer appointed ATC as its exclusive agent in Jordan. For a client, that means one relationship across the whole order.
          </p>
        </Reveal>
        <RevealGroup as="ul" className="lg:col-span-6 lg:col-start-7">
          {EXCLUSIVITY_POINTS.map((point) => (
            <motion.li key={point.title} variants={rise} className="border-t border-border py-6 last:border-b">
              <h3 className="text-lg font-medium leading-7">{point.title}</h3>
              <p className="mt-1 max-w-md text-base leading-7 text-muted-foreground">{point.body}</p>
            </motion.li>
          ))}
        </RevealGroup>
      </div>
      {brands.length > 0 && (
        <Reveal className="mt-16 border-t border-border pt-12">
          <ul className="flex flex-wrap items-center gap-x-12 gap-y-8 md:gap-x-16" aria-label="Brands represented">
            {brands.map((brand) => (
              <li key={brand.slug} className="w-28 md:w-32">
                <Link href={`/brands/${brand.slug}`} aria-label={brand.name} className="block opacity-80 transition-opacity hover:opacity-100">
                  <BrandMark slug={brand.slug} name={brand.name} className="h-8 bg-foreground md:h-9" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <EditorialLink href="/brands">All brands</EditorialLink>
          </div>
        </Reveal>
      )}
    </Section>
  );
}

/** The history, kept to one quiet band: legacy supports the sale, it is not the story. */
function History() {
  return (
    <Section dark id="since-1977">
      <Reveal>
        <Kicker light>Since 1977</Kicker>
        <h2 className="mt-5 max-w-[16ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Three generations of the same answer.</h2>
      </Reveal>
      <RevealGroup as="ol" className="mt-14 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {MILESTONES.map((milestone) => (
          <motion.li key={milestone.title} variants={rise} className="flex flex-col gap-6 border-b border-r border-white/10 p-6 md:p-8">
            <p className="font-display text-3xl font-medium leading-none tracking-[-0.04em] text-primary md:text-4xl">{milestone.when}</p>
            <div>
              <h3 className="text-base font-medium leading-6">{milestone.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{milestone.body}</p>
            </div>
          </motion.li>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** Where the hardware is installed. Names stay behind clearance, as on /about. */
function Installed() {
  return (
    <Section id="installed">
      <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Kicker>Where it is installed</Kicker>
          <h2 className="mt-5 max-w-[16ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Where hardware is used hardest.</h2>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <EditorialLink href="/projects">All projects</EditorialLink>
        </div>
      </Reveal>
      <RevealGroup as="ul" className="mt-14 grid gap-4 md:grid-cols-2">
        {REFERENCES.map((reference, index) => (
          <motion.li
            key={reference.sector}
            variants={rise}
            className={cn("flex min-h-[260px] flex-col justify-between p-8 md:min-h-[320px]", index === 0 ? "bg-primary text-primary-foreground" : "dark bg-background text-foreground")}
          >
            <p className={cn("text-xs", index === 0 ? "text-primary-foreground/70" : "text-muted-foreground")}>{reference.sector}</p>
            <div>
              <h3 className="font-display text-3xl font-medium leading-[0.95] tracking-[-0.04em] md:text-4xl">{reference.cleared ? reference.name : reference.unclearedName}</h3>
              <p className={cn("mt-4 max-w-md text-base leading-7", index === 0 ? "text-primary-foreground/80" : "text-muted-foreground")}>{reference.body}</p>
            </div>
          </motion.li>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** The business core values, in the reader's terms. */
function Principles() {
  return (
    <Section tone="panel" id="principles">
      <Reveal>
        <Kicker>What we hold to</Kicker>
      </Reveal>
      <RevealGroup as="ul" className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">
        {PRINCIPLES.map((principle) => (
          <motion.li key={principle.title} variants={rise} className="border-t border-border pt-6">
            <h3 className="max-w-[18ch] font-display text-3xl font-medium leading-[1] tracking-[-0.04em] md:text-4xl">{principle.title}</h3>
            <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">{principle.body}</p>
          </motion.li>
        ))}
      </RevealGroup>
    </Section>
  );
}

/** Certifications, compact: only what is published in the data, and nothing ATC cannot produce on paper. */
function OnRecord() {
  const published = CERTIFICATIONS.filter((item) => item.published);
  if (published.length === 0) return null;
  return (
    <Section id="certifications">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-5">
          <Kicker>Certifications</Kicker>
          <h2 className="mt-5 font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">On record.</h2>
          <figure className="mt-10">
            <div className="relative aspect-[4/3] overflow-hidden bg-card">
              <MediaImage src="/images/showroom-certificate.webp" alt="A framed Häfele certificate naming Amara Trading Center in Amman as an authorised distributor" width={1200} height={900} sizes="(min-width: 1024px) 36vw, 100vw" className="absolute inset-0 h-full w-full object-cover object-[22%_center]" />
            </div>
            <figcaption className="mt-3 text-xs text-muted-foreground">Häfele authorisation, Naples, 1 April 2016.</figcaption>
          </figure>
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7">
          <RevealGroup as="ul">
            {published.map((item) => (
              <motion.li key={`${item.holder}-${item.title}`} variants={rise} className="grid gap-3 border-t border-border py-6 last:border-b sm:grid-cols-[9rem_1fr]">
                <p className="font-display text-xl font-medium leading-tight tracking-[-0.03em]">{item.mark}</p>
                <div>
                  <h3 className="text-base font-medium leading-6">
                    {item.title}
                    <span className="ml-3 align-middle text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{item.holder === "ATC" ? "Held by ATC" : "Partner factories"}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.scope}</p>
                </div>
              </motion.li>
            ))}
          </RevealGroup>
          <p className="mt-6 text-sm text-muted-foreground">Certificates are available on request at either showroom.</p>
        </div>
      </div>
    </Section>
  );
}

/** The one thing to do next, for either journey. */
function Closing() {
  return (
    <Section tone="red" className="py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-7">
          <p className="max-w-[14ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Try it before you choose it.</p>
          <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/80">
            Both showrooms are open Saturday to Thursday. Walk in, or book a visit and a consultant will have your systems ready.
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {SHOWROOMS.map((showroom) => (
              <li key={showroom.slug}>
                <Link href={showroomHref(showroom.slug)} className="group inline-flex items-center gap-2 underline-offset-4 hover:underline">
                  {showroom.name}, {showroom.hours}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end" delay={0.1}>
          <SolidLink href="/showroom" tone="light">Book a showroom visit</SolidLink>
          <SolidLink href="/contact" tone="dark">Send a trade enquiry</SolidLink>
        </Reveal>
      </div>
    </Section>
  );
}
