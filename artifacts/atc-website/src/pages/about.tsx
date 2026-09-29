import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutGroup, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useGetPublicCatalog } from "@workspace/api-client-react";
import { CredibilityStrip, type Stat } from "@/components/home/credibility-strip";
import { BRAND_LOGOS, BrandMark } from "@/components/home/partner-brands";
import { EditorialLink, Reveal, RevealGroup, Section, SolidLink, SPRING } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { CERTIFICATIONS, CHAPTERS, REFERENCES, STORY_HERO, type Chapter } from "@/lib/about-content";
import { company } from "@/lib/content";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Blum first: the client named it the brand ATC wants to be measured by. */
const BRAND_ORDER = ["blum", "barazza", "hafele", "hettich", "salice", "dnd", "kessebohmer", "fgv", "emuca"];

export default function About() {
  const { data: catalog } = useGetPublicCatalog();
  const brands = catalog?.brands ?? [];
  const logoBrands = brands
    .filter((brand) => BRAND_LOGOS[brand.slug])
    .sort((a, b) => (BRAND_ORDER.indexOf(a.slug) + 1 || 99) - (BRAND_ORDER.indexOf(b.slug) + 1 || 99));

  const stats: Stat[] = [
    { value: company.established, label: "Founded in Amman" },
    { value: 3, label: "Generations of the Amara family" },
    { value: company.partnerBrands, suffix: "+", label: "European brands, represented exclusively in Jordan" },
    { value: company.showrooms.length, label: "Showrooms, Al-Bayader and Al-Wehdat" },
  ];

  const visuals: Record<number, ReactNode> = {
    1: <BrandMarks brands={logoBrands} />,
    3: <References />,
  };

  return (
    <MainLayout immersiveHeader>
      <Prologue />
      <Story visuals={visuals} />
      <Certifications />

      {/* Epilogue: the story in numbers, then the one thing to do about it. */}
      <CredibilityStrip stats={stats} />
      <Section className="py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Try it before you choose it.</p>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Both showrooms are open Saturday to Thursday. Walk in, or book a visit.</p>
          </Reveal>
          <Reveal className="md:col-span-4 md:justify-self-end" delay={0.1}>
            <SolidLink href="/showroom">Book a showroom visit</SolidLink>
          </Reveal>
        </div>
      </Section>
    </MainLayout>
  );
}

/** Opening: the title of the story over a full-bleed photograph that drifts as the reader begins. */
function Prologue() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0]);
  const enter = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } });

  return (
    <section ref={ref} className="dark relative flex min-h-[88dvh] flex-col justify-end overflow-hidden bg-background text-foreground" data-testid="section-about-prologue">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <MediaImage src="/images/building-facade.webp" alt="The Amara Trading Center building, with the name set into the stone facade" width={1920} height={1080} lazy={false} fetchPriority="high" sizes="100vw" className="h-[118%] w-full object-cover object-[68%_center]" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" aria-hidden />
      <motion.div style={{ opacity: fade }} className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-44 md:px-12 md:pb-24">
        <motion.p {...enter(0)} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          {STORY_HERO.kicker}
        </motion.p>
        <motion.h1 {...enter(0.1)} className="mt-5 max-w-[16ch] font-display text-[clamp(2.75rem,6vw,6.25rem)] font-medium leading-[0.9] tracking-[-0.05em]">
          {STORY_HERO.headline}
        </motion.h1>
        <motion.p {...enter(0.25)} className="mt-8 max-w-md text-lg leading-8 text-foreground/75">
          {STORY_HERO.intro}
        </motion.p>
      </motion.div>
    </section>
  );
}

/**
 * The reader: a sticky index on the left whose line draws as the chapters pass, and the chapters
 * themselves on the right, each with the visual its content calls for. On phones the index
 * collapses to a running label above the chapters.
 */
function Story({ visuals }: { visuals: Record<number, ReactNode> }) {
  const [active, setActive] = useState(0);
  const articleRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start center", "end center"] });
  const drawn = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });

  return (
    <section className="px-6 py-20 md:px-12 md:py-28" data-testid="section-about-story">
      <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12 lg:gap-8">
        <aside className="lg:col-span-3" aria-label="Chapters">
          <div className="sticky top-28 hidden lg:block">
            <div className="relative pl-8">
              <span className="absolute left-0 top-0 h-full w-px bg-border" aria-hidden />
              <motion.span style={{ scaleY: reduce ? 1 : drawn }} className="absolute left-0 top-0 h-full w-px origin-top bg-primary" aria-hidden />
              <LayoutGroup id="about-chapters">
                <ol className="space-y-5">
                  {CHAPTERS.map((chapter, index) => {
                    const on = index === active;
                    return (
                      <li key={chapter.label} className="relative">
                        {on && <motion.span layoutId="chapter-marker" className="absolute -left-8 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-primary" transition={SPRING} aria-hidden />}
                        <button
                          type="button"
                          onClick={() => document.getElementById(`chapter-${index}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })}
                          aria-current={on ? "true" : undefined}
                          className={cn("text-left font-display text-2xl font-medium leading-none tracking-[-0.03em] transition-colors", on ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground")}
                          data-testid={`chapter-link-${index}`}
                        >
                          {chapter.label}
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </LayoutGroup>
            </div>
          </div>
        </aside>

        <div ref={articleRef} className="lg:col-span-9">
          {CHAPTERS.map((chapter, index) => (
            <ChapterBlock key={chapter.label} chapter={chapter} index={index} onEnter={setActive} visual={visuals[index]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ChapterBlock({ chapter, index, onEnter, visual }: { chapter: Chapter; index: number; onEnter: (index: number) => void; visual?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const centred = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (centred) onEnter(index);
  }, [centred, index, onEnter]);

  const media = chapter.image;
  return (
    <article ref={ref} id={`chapter-${index}`} className={cn("scroll-mt-28 border-t border-border py-16 md:py-24", index === 0 && "border-t-0 pt-0 md:pt-0")} data-testid={`chapter-${index}`}>
      <Reveal>
        <p className="font-mono text-sm text-primary lg:hidden">{chapter.label}</p>
        <h2 className="mt-3 max-w-[22ch] font-display text-4xl font-medium leading-[0.95] tracking-[-0.045em] md:text-6xl lg:mt-0">{chapter.title}</h2>
      </Reveal>

      <div className={cn("mt-10 grid gap-10 md:mt-14", chapter.visual === "photo" && "md:grid-cols-12 md:items-start")}>
        <RevealGroup className={cn("space-y-6", chapter.visual === "photo" ? "md:col-span-6" : "max-w-2xl")}>
          {chapter.body.map((paragraph) => (
            <motion.p key={paragraph} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: SPRING } }} className="text-lg leading-8 text-muted-foreground">
              {paragraph}
            </motion.p>
          ))}
        </RevealGroup>

        {chapter.visual === "photo" && media && (
          <Reveal className="relative aspect-[4/5] overflow-hidden bg-card md:col-span-5 md:col-start-8" delay={0.1}>
            <MediaImage src={media.src} alt={media.alt} width={1000} height={1250} sizes="(min-width: 768px) 30vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
          </Reveal>
        )}
        {chapter.visual === "wide" && media && (
          <Reveal className="relative aspect-[16/9] overflow-hidden bg-card md:aspect-[21/9]" delay={0.1}>
            <MediaImage src={media.src} alt={media.alt} width={1600} height={686} sizes="(min-width: 1024px) 70vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
          </Reveal>
        )}
        {visual}
      </div>
    </article>
  );
}

/** Chapter two's visual: the manufacturers as marks only, linking on to the brand pages. */
function BrandMarks({ brands }: { brands: Array<{ slug: string; name: string }> }) {
  if (brands.length === 0) return null;
  return (
    <div>
      <RevealGroup as="ul" className="flex flex-wrap items-center gap-x-12 gap-y-8 md:gap-x-16" aria-label="Manufacturers represented">
        {brands.map((brand) => (
          <motion.li key={brand.slug} variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: SPRING } }} className="w-28 md:w-36">
            <BrandMark slug={brand.slug} name={brand.name} className="h-8 bg-foreground md:h-10" />
          </motion.li>
        ))}
      </RevealGroup>
      <Reveal className="mt-10">
        <EditorialLink href="/brands">All brands</EditorialLink>
      </Reveal>
    </div>
  );
}

/**
 * Certifications on record: the standards behind the stock and the programmes ATC runs. Only
 * published entries render; placeholders wait in the data until ATC confirms them.
 */
function Certifications() {
  const published = CERTIFICATIONS.filter((item) => item.published);
  if (published.length === 0) return null;
  const atc = published.filter((item) => item.holder === "ATC").length;
  const partners = published.length - atc;

  return (
    <Section dark id="certifications">
      <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Certifications</p>
          <h2 className="mt-4 max-w-[16ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">On record.</h2>
        </div>
        <p className="max-w-sm text-base leading-7 text-muted-foreground lg:col-span-4 lg:col-start-9">
          The standards the factories are held to and the programmes ATC runs itself. Nothing is listed here that cannot be produced on paper at the counter.
        </p>
      </Reveal>

      <Reveal className="mt-12 md:mt-16">
        <figure>
          <div className="relative aspect-[16/9] overflow-hidden md:aspect-[2.4/1]">
            <MediaImage
              src="/images/showroom-certificate.webp"
              alt="A framed Häfele certificate naming Amara Trading Center in Amman as an authorised distributor"
              width={1600}
              height={900}
              sizes="(min-width: 1440px) 1200px, 100vw"
              className="absolute inset-0 h-full w-full object-cover object-[22%_center]"
            />
          </div>
          <figcaption className="mt-3 text-xs text-foreground/55">Häfele authorisation, Naples, 1 April 2016. It hangs in the showroom corridor.</figcaption>
        </figure>
      </Reveal>

      <RevealGroup as="ul" className="mt-12 grid border-l border-t border-white/10 md:mt-16 md:grid-cols-2" aria-label="Certifications on record">
        {published.map((item) => (
          <motion.li
            key={`${item.holder}-${item.mark}-${item.title}`}
            variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: SPRING } }}
            className="flex min-h-[260px] flex-col justify-between border-b border-r border-white/10 p-6 md:p-8"
            data-testid={`certification-${item.mark.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-display text-3xl font-medium leading-none tracking-[-0.04em] md:text-4xl">{item.mark}</p>
              <p className={cn("shrink-0 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]", item.holder === "ATC" ? "bg-primary text-primary-foreground" : "border border-white/20 text-foreground/70")}>
                {item.holder === "ATC" ? "Held by ATC" : "Partner factories"}
              </p>
            </div>
            <div className="mt-8">
              <h3 className="text-base font-medium leading-6">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{item.scope}</p>
              {(item.issuer || item.year || item.document) && (
                <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/60">
                  {item.issuer && <span>{item.issuer}</span>}
                  {item.year && <span className="font-mono tabular-nums">{item.year}</span>}
                  {item.document && (
                    <a href={item.document} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4 hover:text-foreground">
                      View certificate
                    </a>
                  )}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </RevealGroup>

      <Reveal className="mt-8 flex flex-wrap items-baseline justify-between gap-4 text-xs text-foreground/50">
        <p>
          {partners} held by the manufacturers ATC represents, {atc} held by ATC.
        </p>
        <p>Certificates are available on request at either showroom.</p>
      </Reveal>
    </Section>
  );
}

/** Chapter four's visual: the two references, names held back until cleared. */
function References() {
  return (
    <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2" aria-label="References">
      {REFERENCES.map((reference, index) => (
        <motion.li
          key={reference.sector}
          variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: SPRING } }}
          className={cn("flex min-h-[280px] flex-col justify-between p-8 md:min-h-[360px]", index === 0 ? "bg-primary text-primary-foreground" : "dark bg-background text-foreground")}
          data-testid={`reference-${reference.sector.toLowerCase()}`}
          data-cleared={reference.cleared}
        >
          <p className={cn("text-xs", index === 0 ? "text-primary-foreground/70" : "text-muted-foreground")}>{reference.sector}</p>
          <div>
            <h3 className="font-display text-3xl font-medium leading-[0.95] tracking-[-0.04em] md:text-4xl">{reference.cleared ? reference.name : reference.unclearedName}</h3>
            <p className={cn("mt-4 max-w-md text-base leading-7", index === 0 ? "text-primary-foreground/80" : "text-muted-foreground")}>{reference.body}</p>
          </div>
        </motion.li>
      ))}
    </RevealGroup>
  );
}
