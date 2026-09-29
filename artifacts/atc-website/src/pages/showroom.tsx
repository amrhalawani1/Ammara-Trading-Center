import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { Link } from "wouter";
import { Reveal } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { useOpenStatus } from "@/hooks/use-open-status";
import { mapsHref } from "@/lib/maps";
import { SHOWROOMS, showroomHref, type ShowroomEntry } from "@/lib/showrooms";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

const BOOK_HREF = whatsappUrl("Hello ATC, I would like to book a visit to a showroom. I am working on: ");
const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** The photograph that shows what each showroom is for, not the first file in its gallery. */
const CARD_PHOTO: Record<string, number> = { "al-bayader": 6, "al-wehdat": 0 };

/** Showrooms: the two locations, and how to book a visit. */
export default function Showroom() {
  return (
    <MainLayout immersiveHeader>
      <Header />
      <Locations />
      <Book />
    </MainLayout>
  );
}

/** Full-screen hero: the Al-Bayader lounge, with the headline and booking set on a dark wash. */
function Header() {
  return (
    <section className="dark relative flex min-h-[100dvh] flex-col justify-end overflow-hidden bg-background text-foreground" data-testid="section-showroom-hero">
      <MediaImage
        src="/images/showroom-lounge.webp"
        alt="The Al-Bayader showroom lounge, with kitchens installed beyond the seating"
        width={1920}
        height={1080}
        lazy={false}
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover object-[center_60%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/45 to-background/25" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" aria-hidden />
      <div className="relative mx-auto grid w-full max-w-[1440px] gap-8 px-6 pb-14 pt-36 md:grid-cols-12 md:items-end md:px-12 md:pb-20">
        <div className="md:col-span-7">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/80"><span className="h-px w-8 bg-primary" aria-hidden />Two showrooms in Amman</p>
          <h1 className="mt-4 text-balance font-display text-6xl font-medium leading-[0.92] tracking-[-0.05em] md:text-8xl">Come and use it.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-foreground/85 md:text-lg md:leading-8">
            Every system is installed and working. A consultant gives you time to look, then is there when you want help.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:col-span-5 md:justify-end">
          <a
            href={BOOK_HREF}
            target="_blank"
            rel="noreferrer"
            className={cn("inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] hover:bg-white hover:text-neutral-950 active:translate-y-px", focusRing)}
            data-testid="link-showroom-book-top"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Book a visit
          </a>
        </div>
      </div>
    </section>
  );
}

/** The two showrooms side by side, equal weight, every detail on a plain ground. */
function Locations() {
  return (
    <section id="locations" className="scroll-mt-28 px-6 pt-16 md:px-12 md:pt-24" data-testid="showroom-stage">
      <ul className="mx-auto grid max-w-[1440px] gap-x-6 gap-y-14 md:grid-cols-2" aria-label="Showrooms">
        {SHOWROOMS.map((showroom, index) => (
          <li key={showroom.slug} className="h-full" data-testid={`floor-${showroom.slug}`}>
            <Reveal className="h-full" delay={index * 0.08}>
              <LocationCard showroom={showroom} priority={false} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LocationCard({ showroom, priority }: { showroom: ShowroomEntry; priority: boolean }) {
  const status = useOpenStatus(showroom.hours);
  const photo = showroom.gallery[CARD_PHOTO[showroom.slug] ?? 0] ?? showroom.gallery[0]!;
  const [days, time] = showroom.hours.split(",").map((part) => part.trim());

  return (
    <article id={`showroom-${showroom.slug}`} className="flex h-full scroll-mt-28 flex-col">
      <Link href={showroomHref(showroom.slug)} className={cn("group relative block aspect-[4/3] overflow-hidden bg-card", focusRing)} aria-label={`${showroom.name} showroom`} data-testid={`link-showroom-story-${showroom.slug}`}>
        <MediaImage
          src={photo.src}
          alt={photo.alt}
          width={1200}
          height={900}
          lazy={!priority}
          fetchPriority={priority ? "high" : "auto"}
          sizes="(min-width: 768px) 48vw, 100vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
        />
        {status && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground" data-testid={`status-showroom-${showroom.slug}`}>
            <span className={cn("h-2 w-2 rounded-full", status.open ? "bg-emerald-500" : "bg-muted-foreground/50")} aria-hidden />
            {status.label}
          </span>
        )}
      </Link>

      <div className="mt-6 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-4xl font-medium leading-none tracking-[-0.04em] md:text-5xl">{showroom.name}</h2>
        <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{showroom.role}</p>
      </div>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{showroom.summary}</p>

      <dl className="mb-8 mt-6 grid gap-x-8 gap-y-4 border-t border-border pt-6 text-sm leading-6 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Address</dt>
          <dd className="mt-1">{showroom.addressLines.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Hours</dt>
          <dd className="mt-1">
            {days}
            <br />
            {time}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Phone</dt>
          <dd className="mt-1 tabular-nums">{showroom.phone}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-5">
        <Link href={showroomHref(showroom.slug)} className={cn("inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-foreground", focusRing)} data-testid={`link-view-${showroom.slug}`}>
          View showroom <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </Link>
        <a href={mapsHref(showroom.name, showroom.addressLines)} target="_blank" rel="noreferrer" className={cn("inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary", focusRing)} data-testid={`link-directions-${showroom.slug}`}>
          Get directions <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </a>
        <a href={`tel:${showroom.phone.replace(/\s+/g, "")}`} className={cn("inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-primary", focusRing)} data-testid={`link-call-${showroom.slug}`}>
          <Phone className="h-3.5 w-3.5" strokeWidth={2} /> Call
        </a>
      </div>
    </article>
  );
}

function Book() {
  return (
    <section className="px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 bg-card px-6 py-12 md:flex-row md:items-end md:justify-between md:px-12 md:py-14">
        <div>
          <h2 className="font-display text-3xl font-medium leading-tight tracking-[-0.03em] md:text-4xl">Tell us you are coming.</h2>
          <p className="mt-3 max-w-md text-base leading-7 text-muted-foreground">Say what you are working on. We will have the right showroom ready, and a consultant free when you arrive.</p>
        </div>
        <a
          href={BOOK_HREF}
          target="_blank"
          rel="noreferrer"
          className={cn("inline-flex h-12 shrink-0 items-center gap-3 self-start bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:translate-y-px md:self-auto", focusRing)}
          data-testid="link-showroom-whatsapp"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Book a visit
        </a>
      </div>
    </section>
  );
}
