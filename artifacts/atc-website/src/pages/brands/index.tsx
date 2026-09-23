import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useGetPublicCatalog, type Brand } from "@workspace/api-client-react";
import { BrandMark } from "@/components/home/partner-brands";
import { Reveal, SolidLink } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { Skeleton } from "@/components/ui/skeleton";
import { apiErrorMessage } from "@/lib/api-error";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring", stiffness: 140, damping: 22 } as const;

/** Tile shape by position: the lead runs 2x2, every fourth after it runs wide, the rest are square. */
const tileSpan = (index: number) => (index === 0 ? "sm:col-span-2 sm:row-span-2" : index % 4 === 3 ? "sm:col-span-2" : "");

function BrandTile({ brand, index, count }: { brand: Brand; index: number; count: number }) {
  const reduce = useReducedMotion();
  const lead = index === 0;
  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
      transition={{ ...SPRING, delay: reduce ? 0 : Math.min(index, 8) * 0.04 }}
      className={cn("list-none", tileSpan(index))}
    >
      <Link href={`/brands/${brand.slug}`} className="group flex h-full flex-col bg-card" data-testid={`card-brand-${brand.slug}`}>
        <div className={cn("relative overflow-hidden bg-background", lead ? "aspect-[4/3] sm:aspect-auto sm:flex-1 sm:min-h-[420px]" : "aspect-[4/3]")}>
          <MediaImage
            src={brand.coverImage}
            alt={`${brand.name} hardware`}
            fallbackSrc="/images/brand-hinge.webp"
            width={lead ? 1400 : 800}
            height={lead ? 1050 : 600}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
          <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" aria-hidden />
        </div>
        <div className={cn("flex items-end justify-between gap-6", lead ? "p-7 md:p-8" : "p-6")}>
          <div className="min-w-0">
            <BrandMark slug={brand.slug} name={brand.name} className={cn(lead ? "h-10 md:h-12" : "h-8 md:h-9", "bg-foreground transition-colors group-hover:bg-primary")} />
            <p className="mt-3 text-sm text-muted-foreground">
              {brand.country}
              {count > 0 ? `, ${count} in the catalogue` : `, ${brand.category}`}
            </p>
          </div>
          <ArrowUpRight className="h-5 w-5 shrink-0 -translate-x-1 translate-y-1 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" strokeWidth={1.75} />
        </div>
      </Link>
    </motion.li>
  );
}

/**
 * Partner directory. A split hero, a country filter, and the houses in a dense asymmetric grid:
 * the lead brand runs large, every fourth tile runs wide. Logos sit under the photograph as marks,
 * never over it. One contact action, in the closing band.
 */
export default function BrandsDirectory() {
  const { data: catalog, isLoading, error } = useGetPublicCatalog();
  const [country, setCountry] = useState<string | null>(null);

  const brands = useMemo(
    () => [...(catalog?.brands ?? [])].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name)),
    [catalog?.brands],
  );
  const productCounts = useMemo(() => {
    const map = new Map<string, number>();
    (catalog?.products ?? []).forEach((p) => map.set(p.brandSlug, (map.get(p.brandSlug) ?? 0) + 1));
    return map;
  }, [catalog?.products]);
  const countries = useMemo(() => {
    const map = new Map<string, number>();
    brands.forEach((b) => b.country && map.set(b.country, (map.get(b.country) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [brands]);
  const shown = country ? brands.filter((b) => b.country === country) : brands;

  const askHref = whatsappUrl("Hello ATC, I am looking for a manufacturer you do not list on the site. Can you source it?");

  return (
    <MainLayout>
      {/* Hero */}
      <section className="px-6 pb-16 pt-10 md:px-12 md:pb-24 md:pt-16">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <Reveal className="lg:col-span-7">
            <h1 className="max-w-[14ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl lg:text-8xl">
              {brands.length > 0 ? `${brands.length} houses.` : "The houses."} One standard.
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-muted-foreground">
              European manufacturers whose fittings are still working after twenty years, represented and stocked in Amman.
            </p>
            <SolidLink href="/catalog" className="mt-10">Browse the catalogue</SolidLink>
          </Reveal>
          <Reveal className="hidden lg:col-span-5 lg:block">
            <div className="overflow-hidden bg-card">
              <MediaImage src="/images/showroom-wide.webp" alt="Partner hardware on display in the Al-Bayader showroom" width={1200} height={900} className="aspect-[4/3] w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Directory */}
      <section className="px-6 pb-24 md:px-12 md:pb-32">
        <div className="mx-auto max-w-[1440px]">
          {countries.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-8" role="group" aria-label="Filter by country">
              {[{ name: null as string | null, label: "All countries", count: brands.length }, ...countries.map(([name, count]) => ({ name, label: name, count }))].map((item) => {
                const active = item.name === country;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setCountry(item.name)}
                    aria-pressed={active}
                    className={cn("inline-flex h-11 items-center gap-2 border px-4 text-sm transition active:scale-[0.98]", active ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:border-foreground")}
                    data-testid={`filter-country-${(item.name ?? "all").toLowerCase()}`}
                  >
                    {item.label}
                    <span className={cn("font-mono text-[10px] tabular-nums", active ? "text-background/60" : "text-muted-foreground")}>{item.count}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-10">
            {isLoading ? (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <li key={i} className={cn("list-none", tileSpan(i))}>
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />
                    <Skeleton className="mt-3 h-8 w-32 rounded-none" />
                  </li>
                ))}
              </ul>
            ) : error ? (
              <div className="border border-border px-6 py-20 text-center">
                <p className="font-display text-2xl">{apiErrorMessage(error, "The brand directory could not be loaded.")}</p>
                <p className="mt-3 text-sm text-muted-foreground">Refresh the page, or message us and we will send the list.</p>
              </div>
            ) : shown.length === 0 ? (
              <div className="border border-border px-6 py-20 text-center">
                <p className="font-display text-2xl">No houses from there yet.</p>
                <button type="button" onClick={() => setCountry(null)} className="mt-4 text-sm underline underline-offset-4">Show all countries</button>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:[grid-auto-flow:dense] lg:grid-cols-4" aria-label="Partner brands">
                <AnimatePresence mode="popLayout">
                  {shown.map((brand, index) => (
                    <BrandTile key={brand.slug} brand={brand} index={index} count={productCounts.get(brand.slug) ?? 0} />
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="dark bg-background px-6 py-20 text-foreground md:px-12 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <h2 className="max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Specifying a house we do not list? We source from the full European market.</h2>
          </Reveal>
          <Reveal className="lg:col-span-4 lg:justify-self-end">
            <a href={askHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-foreground hover:text-background active:translate-y-px" data-testid="link-brands-whatsapp">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
            </a>
          </Reveal>
        </div>
      </section>
    </MainLayout>
  );
}
