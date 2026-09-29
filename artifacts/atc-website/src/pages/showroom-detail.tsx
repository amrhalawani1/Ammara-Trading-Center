import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { Link, useParams } from "wouter";
import { Reveal, RevealGroup, Section, SPRING } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { useOpenStatus } from "@/hooks/use-open-status";
import { ShowroomMap } from "@/components/showroom/showroom-map";
import { mapsHref } from "@/lib/maps";
import { findShowroom, SHOWROOMS, showroomHref, type ShowroomEntry } from "@/lib/showrooms";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import NotFound from "@/pages/not-found";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ShowroomDetail() {
  const params = useParams<{ slug: string }>();
  const showroom = findShowroom(params.slug);

  useEffect(() => {
    if (showroom) window.scrollTo({ top: 0, behavior: "auto" });
  }, [showroom?.slug]);

  if (!showroom) return <NotFound />;

  const other = SHOWROOMS.filter((item) => item.slug !== showroom.slug);
  const askHref = whatsappUrl(`Hello ATC, I would like to book a visit to the ${showroom.name} showroom. I am working on: `);

  return (
    <MainLayout immersiveHeader>
      <Hero showroom={showroom} />

      {/* The story, with the facts and visiting details pinned beside it. */}
      <Section className="pb-12 md:pb-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">The story</p>
            <h2 className="mt-4 max-w-[18ch] font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">{showroom.headline}</h2>
            <div className="mt-8 max-w-2xl space-y-6 text-base leading-8 text-foreground/80 md:text-lg">
              {showroom.story.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-border pt-8 sm:grid-cols-4">
              {showroom.facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-xs text-muted-foreground">{fact.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-medium leading-none tracking-[-0.03em] md:text-3xl">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.1}>
            <VisitPanel showroom={showroom} />
          </Reveal>
        </div>
      </Section>

      {/* Gallery: a masonry-style grid, every frame opens the lightbox. */}
      <Section dark>
        <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">Inside {showroom.name}.</h2>
          <p className="font-mono text-sm tabular-nums text-muted-foreground">{String(showroom.gallery.length).padStart(2, "0")} photographs</p>
        </Reveal>
        <Gallery showroom={showroom} />
      </Section>

      {/* The other showroom, and the one question. */}
      <Section dark className="py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Want a consultant waiting when you arrive?</p>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Tell us what you are working on and when you plan to come to {showroom.name}. We will have the drawings table clear.</p>
            <a href={askHref} target="_blank" rel="noreferrer" className="mt-8 inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:translate-y-px" data-testid="link-showroom-whatsapp">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Book on WhatsApp
            </a>
          </Reveal>
          {other.map((item) => (
            <Reveal key={item.slug} className="lg:col-span-4 lg:col-start-9" delay={0.1}>
              <Link href={showroomHref(item.slug)} className="group block border-t border-white/10 pt-6" data-testid={`link-showroom-${item.slug}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Our other showroom</p>
                <p className="mt-3 flex items-baseline justify-between gap-4 font-display text-3xl font-medium leading-none tracking-[-0.03em] transition-colors group-hover:text-primary">
                  {item.name}
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </MainLayout>
  );
}

function Hero({ showroom }: { showroom: ShowroomEntry }) {
  const reduce = useReducedMotion();
  const cover = showroom.gallery[0]!;
  const enter = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } });

  return (
    <section className="dark relative flex min-h-[78dvh] flex-col justify-end overflow-hidden bg-background text-foreground" data-testid="section-showroom-detail-hero">
      <MediaImage src={cover.src} alt={cover.alt} width={1920} height={1080} lazy={false} fetchPriority="high" sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" aria-hidden />
      <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-14 pt-40 md:px-12 md:pb-20">
        <motion.div {...enter(0)}>
          <Link href="/showroom" className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:text-primary" data-testid="link-back-showrooms">
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} /> All showrooms
          </Link>
        </motion.div>
        <motion.p {...enter(0.1)} className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{showroom.role}</motion.p>
        <motion.h1 {...enter(0.15)} className="mt-3 font-display text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.05em]">{showroom.name}</motion.h1>
        <motion.p {...enter(0.3)} className="mt-6 max-w-lg text-lg leading-8 text-foreground/75">{showroom.summary}</motion.p>
      </div>
    </section>
  );
}

function VisitPanel({ showroom }: { showroom: ShowroomEntry }) {
  const status = useOpenStatus(showroom.hours);
  const [days, times] = showroom.hours.split(",").map((part) => part.trim());

  return (
    <aside className="bg-card p-6 md:p-8 lg:sticky" style={{ top: "calc(var(--nav-offset, 76px) + 1.5rem)" }} data-testid={`panel-visit-${showroom.slug}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Visit</p>
        {status && (
          <p className={cn("flex items-center gap-2 text-xs", status.open ? "text-foreground" : "text-muted-foreground")} aria-live="polite" data-testid={`status-showroom-${showroom.slug}`}>
            <span className={cn("h-2 w-2 rounded-full", status.open ? "bg-emerald-500" : "bg-border")} aria-hidden />
            {status.label}
          </p>
        )}
      </div>
      <dl className="mt-6 grid gap-6">
        <div>
          <dt className="text-xs text-muted-foreground">Address</dt>
          <dd className="mt-1 text-base leading-6">{showroom.addressLines.map((line) => <span key={line} className="block">{line}</span>)}</dd>
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
      <ShowroomMap name={showroom.name} addressLines={showroom.addressLines} compact className="mt-8 aspect-[16/10] max-h-[220px] w-full" />
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={mapsHref(showroom.name, showroom.addressLines)} target="_blank" rel="noreferrer" className="group inline-flex h-11 items-center gap-2 bg-foreground px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition-[background-color,color,transform] hover:bg-primary hover:text-primary-foreground active:translate-y-px" data-testid={`link-directions-${showroom.slug}`}>
          Get directions <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
        </a>
        <a href={`tel:${showroom.phone.replace(/\s+/g, "")}`} className="inline-flex h-11 items-center gap-2 border border-foreground/25 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground active:translate-y-px" data-testid={`link-call-${showroom.slug}`}>
          <Phone className="h-3.5 w-3.5" strokeWidth={2} /> Call
        </a>
      </div>
    </aside>
  );
}

/** Photo grid with a lightbox. The first frame runs wide; the rest alternate. */
function Gallery({ showroom }: { showroom: ShowroomEntry }) {
  const [open, setOpen] = useState<number | null>(null);
  const gallery = showroom.gallery;

  return (
    <>
      <RevealGroup as="ul" className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:grid-cols-3 md:gap-4" aria-label={`${showroom.name} gallery`}>
        {gallery.map((item, index) => (
          <motion.li key={item.src + index} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: SPRING } }} className={cn(index === 0 && "col-span-2 row-span-2")}>
            <button type="button" onClick={() => setOpen(index)} className="group relative block h-full w-full overflow-hidden bg-card text-left" aria-label={`Open photograph ${index + 1}: ${item.caption}`} data-testid={`button-gallery-open-${index}`}>
              <div className={cn("relative", index === 0 ? "aspect-[4/3] md:h-full" : "aspect-[4/3]")}>
                <MediaImage src={item.src} alt={item.alt} width={1200} height={900} sizes={index === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 50vw"} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]" />
              </div>
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="text-sm leading-6">{item.caption}</span>
                <span className="font-mono text-xs tabular-nums text-white/80">{String(index + 1).padStart(2, "0")}</span>
              </span>
            </button>
          </motion.li>
        ))}
      </RevealGroup>

      <PhotoLightbox photos={gallery} index={open} onChange={setOpen} onClose={() => setOpen(null)} label={showroom.name} />
    </>
  );
}