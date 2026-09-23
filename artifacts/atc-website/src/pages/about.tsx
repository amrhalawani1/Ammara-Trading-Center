import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutGroup, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useGetPublicCatalog } from "@workspace/api-client-react";
import { CredibilityStrip, type Stat } from "@/components/home/credibility-strip";
import { BRAND_LOGOS, BrandMark } from "@/components/home/partner-brands";
import { EditorialLink, Reveal, RevealGroup, Section, SolidLink, SPRING } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { CHAPTERS, REFERENCES, STORY_HERO, type Chapter } from "@/lib/about-content";
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
    { value: new Date().getFullYear() - company.established, label: `Years in Amman, since ${company.established}` },
    { value: 3, label: "Generations of the Amara family" },
    { value: brands.length || 11, label: "European manufacturers represented in Jordan" },
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

      {/* Epilogue: the story in numbers, then the one thing to do about it. */}
      <CredibilityStrip stats={stats} />
      <Section className="py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Use it before you specify it.</p>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Both showrooms are open Saturday to Thursday. No appointment; a consultant is on the floor.</p>
          </Reveal>
          <Reveal className="md:col-span-4 md:justify-self-end" delay={0.1}>
            <SolidLink href="/showroom">Plan a visit</SolidLink>
          </Reveal>
        </div>
      </Section>
    </MainLayout>
  );
}

/** Opening: the title of the story over a photograph that eases away as the reader begins. */
function Prologue() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);
  const enter = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } });

  return (
    <section ref={ref} className="dark relative grid min-h-[100dvh] overflow-hidden bg-background text-foreground lg:grid-cols-12" data-testid="section-about-prologue">
      <motion.div style={{ opacity: fade }} className="relative z-10 flex flex-col justify-end px-6 pb-16 pt-32 md:px-12 md:pb-24 lg:col-span-7 lg:pt-40">
        <motion.p {...enter(0)} className="text-xs font-medium text-foreground/60">
          {STORY_HERO.kicker}
        </motion.p>
        <motion.h1 {...enter(0.1)} className="mt-6 max-w-[18ch] font-display text-[clamp(2.75rem,5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.05em]">
          {STORY_HERO.headline}
        </motion.h1>
        <motion.p {...enter(0.2)} className="mt-8 max-w-md text-lg leading-8 text-foreground/70">
          {STORY_HERO.intro}
        </motion.p>
      </motion.div>
      <div className="relative min-h-[46dvh] lg:col-span-5 lg:min-h-0">
        <motion.div style={{ scale }} className="absolute inset-0 origin-center will-change-transform">
          <MediaImage src="/images/trade-planning.webp" alt="An ATC consultant and an architect reviewing a specification" width={1400} height={1750} lazy={false} fetchPriority="high" sizes="(min-width: 1024px) 42vw, 100vw" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent lg:bg-gradient-to-r lg:from-background lg:via-background/20 lg:to-transparent" aria-hidden />
      </div>
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
