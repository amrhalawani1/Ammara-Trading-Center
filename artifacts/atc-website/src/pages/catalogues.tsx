import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Search, X } from "lucide-react";
import { CatalogueCard } from "@/components/catalogues/catalogue-card";
import { EditorialLink, Reveal, Section, SPRING } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { CATALOGUE_KINDS, CATALOGUES, catalogueBrands, type Catalogue } from "@/lib/catalogues";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Catalogues() {
  const [brand, setBrand] = useState<string | null>(null);
  const [kind, setKind] = useState<Catalogue["kind"] | null>(null);
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();

  const brands = useMemo(catalogueBrands, []);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = CATALOGUES.filter((item) => {
    if (brand && item.brandSlug !== brand) return false;
    if (kind && item.kind !== kind) return false;
    if (terms.length === 0) return true;
    const text = [item.title, item.brandName, item.line, item.edition, item.kind].filter(Boolean).join(" ").toLowerCase();
    return terms.every((term) => text.includes(term));
  });
  const filtered = Boolean(brand || kind || terms.length);

  const printedHref = whatsappUrl("Hello ATC, could I pick up printed catalogues at the showroom? I am interested in: ");

  return (
    <MainLayout>
      {/* Header: what the shelf holds. */}
      <section className="border-b border-border px-6 pb-12 pt-14 md:px-12 md:pb-16 md:pt-20" data-testid="section-catalogues-header">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Catalogues and downloads
            </motion.p>
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.05 }} className="mt-4 max-w-[14ch] font-display text-[clamp(2.75rem,6vw,6rem)] font-medium leading-[0.92] tracking-[-0.05em]">
              The shelf behind the counter.
            </motion.h1>
          </div>
          <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.15 }} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-sm text-base leading-7 text-muted-foreground">
              Every manufacturer catalogue, brochure and technical booklet we hand out at the showroom, in one place. Browse them online, download the PDF where the manufacturer publishes one, or ask for the printed copy.
            </p>
            <p className="mt-4 font-mono text-sm tabular-nums text-muted-foreground">
              <span className="text-foreground">{CATALOGUES.length}</span> titles from <span className="text-foreground">{brands.length}</span> manufacturers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters: brand tabs, type, search. */}
      <section className="px-6 pt-10 md:px-12 md:pt-14" data-testid="section-catalogues-filters">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <nav aria-label="Manufacturers" className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0 lg:col-span-8 [&::-webkit-scrollbar]:hidden">
              <LayoutGroup id="catalogue-brands">
                <ul className="flex gap-6">
                  {[{ slug: null as string | null, name: "All", count: CATALOGUES.length }, ...brands].map((tab) => {
                    const active = tab.slug === brand;
                    return (
                      <li key={tab.name} className="relative shrink-0">
                        <button type="button" onClick={() => setBrand(tab.slug)} aria-pressed={active} className={cn("flex h-12 items-baseline gap-2 whitespace-nowrap text-sm transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")} data-testid={`filter-catalogue-brand-${tab.slug ?? "all"}`}>
                          {tab.name}
                          <span className="font-mono text-[11px] tabular-nums opacity-70">{tab.count}</span>
                        </button>
                        {active && <motion.span layoutId="catalogue-brand-indicator" className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" transition={SPRING} aria-hidden />}
                      </li>
                    );
                  })}
                </ul>
              </LayoutGroup>
            </nav>
            <label className="relative block lg:col-span-4">
              <span className="sr-only">Search catalogues</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Title, brand or subject"
                autoComplete="off"
                className="h-12 w-full border border-border bg-background pl-11 pr-11 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary [&::-webkit-search-cancel-button]:hidden"
                data-testid="input-catalogue-search"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              )}
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4" role="group" aria-label="Type">
            <button type="button" onClick={() => setKind(null)} aria-pressed={kind === null} className={cn("h-8 px-3 text-xs transition-colors", kind === null ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground")} data-testid="filter-catalogue-kind-all">
              All types
            </button>
            {CATALOGUE_KINDS.map((item) => (
              <button key={item.id} type="button" onClick={() => setKind(kind === item.id ? null : item.id)} aria-pressed={kind === item.id} className={cn("h-8 px-3 text-xs transition-colors", kind === item.id ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground")} data-testid={`filter-catalogue-kind-${item.id}`}>
                {item.label}
              </button>
            ))}
            <p className="ml-auto text-xs text-muted-foreground" aria-live="polite" data-testid="text-catalogue-count">
              {visible.length} {visible.length === 1 ? "title" : "titles"}
            </p>
          </div>
        </div>
      </section>

      {/* The shelf. */}
      <section className="px-6 pb-24 pt-10 md:px-12 md:pb-32 md:pt-12" data-testid="section-catalogues-grid">
        <div className="mx-auto max-w-[1440px]">
          {visible.length === 0 ? (
            <div className="grid gap-8 border border-border px-6 py-14 md:grid-cols-12 md:px-10">
              <div className="md:col-span-7">
                <p className="font-display text-3xl font-medium leading-[0.98] tracking-[-0.03em] md:text-4xl">Not on the shelf yet.</p>
                <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">Manufacturers publish more than we list. Tell us the brand and subject and we will send the booklet or the page you need.</p>
              </div>
              <div className="flex flex-col items-start gap-4 md:col-span-5 md:justify-end">
                <a href={whatsappUrl(`Hello ATC, do you have a catalogue covering "${query.trim()}"?`)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2.5 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-foreground hover:text-background active:scale-[0.98]">
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
                </a>
                {filtered && (
                  <button type="button" onClick={() => { setQuery(""); setBrand(null); setKind(null); }} className="text-xs text-foreground underline-offset-4 hover:underline">
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          ) : (
            <motion.ul layout={!reduce} className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-6" aria-label="Catalogues">
              <AnimatePresence initial={false}>
                {visible.map((item) => (
                  <motion.li
                    key={item.id}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    data-testid={`catalogue-${item.id}`}
                  >
                    <CatalogueCard item={item} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </section>

      {/* Printed copies and the documents index. */}
      <Section dark className="py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Printed copies are on the shelf at both showrooms.</p>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Tell us which titles and we will have them ready at the counter, or bring them to the site if the order is already open.</p>
          </Reveal>
          <Reveal className="md:col-span-4 md:justify-self-end" delay={0.1}>
            <a href={printedHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:translate-y-px" data-testid="link-request-printed">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Reserve printed copies
            </a>
          </Reveal>
        </div>
        <Reveal className="mt-12 flex flex-wrap gap-x-10 gap-y-4" delay={0.15}>
          <EditorialLink href="/resources" light>Per-product data sheets and drawings</EditorialLink>
          <EditorialLink href="/catalog" light>Find the product</EditorialLink>
        </Reveal>
      </Section>
    </MainLayout>
  );
}

