import { useMemo } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { useGetPublicCatalog, type Brand } from "@workspace/api-client-react";
import { BRAND_LOGOS, BrandMark } from "@/components/home/partner-brands";
import { EditorialLink, Reveal, SolidLink, SPRING } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { Skeleton } from "@/components/ui/skeleton";
import { apiErrorMessage } from "@/lib/api-error";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const HEADER_OFFSET = 76;

/** Lead runs 2×2. Every fourth tile after it runs wide. The rest stay in the field. */
function tileSpan(index: number) {
  if (index === 0) return "sm:col-span-2 sm:row-span-2";
  if (index % 4 === 3) return "sm:col-span-2";
  return "";
}

function labelFor(brand: Brand, count: number) {
  return [brand.name, brand.country, brand.category, count > 0 ? `${count} ${count === 1 ? "product" : "products"} in the catalogue` : null].filter(Boolean).join(", ");
}

function markClass(slug: string, kind: "wall" | "tile" | "lead") {
  const logo = Boolean(BRAND_LOGOS[slug]);
  if (kind === "wall") {
    return logo
      ? "h-7 w-full max-w-[8rem] bg-foreground/85 transition-colors duration-300 group-hover:bg-primary group-focus-visible:bg-primary md:h-8"
      : "text-xl text-foreground/85 transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary md:text-2xl";
  }
  if (kind === "lead") {
    return logo
      ? "h-10 w-full max-w-[13rem] bg-foreground transition-colors duration-300 group-hover:bg-primary group-focus-visible:bg-primary md:h-12"
      : "text-3xl text-foreground transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary md:text-4xl";
  }
  return logo
    ? "h-8 w-full max-w-[10rem] bg-foreground transition-colors duration-300 group-hover:bg-primary group-focus-visible:bg-primary md:h-9"
    : "text-2xl text-foreground transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary md:text-3xl";
}

/** Photograph first, name directly under it. The lead fills two rows; every fourth tile runs wide. */
function BrandTile({ brand, index, count }: { brand: Brand; index: number; count: number }) {
  const reduce = useReducedMotion();
  const lead = index === 0;
  const wide = !lead && index % 4 === 3;
  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
      transition={{ ...SPRING, delay: reduce ? 0 : Math.min(index, 8) * 0.04 }}
      className={cn("list-none h-full", tileSpan(index))}
    >
      <Link
        href={`/brands/${brand.slug}`}
        aria-label={labelFor(brand, count)}
        className="group flex h-full flex-col overflow-hidden bg-background outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        data-testid={`card-brand-${brand.slug}`}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            lead && "aspect-[4/3] sm:aspect-auto sm:min-h-[24rem] sm:flex-1",
            wide && "aspect-[16/9] sm:flex-1",
            !lead && !wide && "aspect-[4/3] sm:flex-1",
          )}
        >
          <MediaImage
            src={brand.coverImage}
            alt={`${brand.name} hardware`}
            fallbackSrc="/images/showroom-hinges.webp"
            width={lead ? 1400 : wide ? 1200 : 800}
            height={lead ? 1050 : 600}
            sizes={lead || wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-focus-visible:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none" aria-hidden />
        </div>
        <div className={cn("flex items-end justify-between gap-4 bg-background", lead ? "p-6 md:p-7" : "p-4 md:p-5")}>
          <div className="min-w-0">
            <BrandMark slug={brand.slug} name={brand.name} className={markClass(brand.slug, lead ? "lead" : "tile")} />
            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              {brand.country}
              {brand.category ? <span className="text-foreground"> · {brand.category}</span> : null}
            </p>
            <p className={cn("mt-1 min-h-[1.125rem] font-mono text-[11px] tabular-nums text-muted-foreground", count === 0 && "invisible")} aria-hidden={count === 0}>
              {count > 0 ? `${count} ${count === 1 ? "product" : "products"} in the catalogue` : "0"}
            </p>
          </div>
          <ArrowUpRight className="mb-0.5 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" strokeWidth={1.75} />
        </div>
      </Link>
    </motion.li>
  );
}

/**
 * Partner directory. The hero names the houses; the directory is a field of their photographs,
 * the lead running large and every fourth tile running wide.
 */
export default function BrandsDirectory() {
  const { data: catalog, isLoading, error } = useGetPublicCatalog();
  const search = useSearch();
  const [location, setLocation] = useLocation();
  const reduce = useReducedMotion();
  const country = new URLSearchParams(search).get("country");

  const brands = useMemo(
    () => [...(catalog?.brands ?? [])].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name)),
    [catalog?.brands],
  );
  const productCounts = useMemo(() => {
    const map = new Map<string, number>();
    (catalog?.products ?? []).forEach((product) => map.set(product.brandSlug, (map.get(product.brandSlug) ?? 0) + 1));
    return map;
  }, [catalog?.products]);
  const countries = useMemo(() => {
    const map = new Map<string, number>();
    brands.forEach((brand) => brand.country && map.set(brand.country, (map.get(brand.country) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [brands]);
  const featured = brands.filter((brand) => brand.isFeatured);
  const wall = featured.length > 0 ? featured : brands.slice(0, 6);
  const shown = country ? brands.filter((brand) => brand.country === country) : brands;

  const askHref = whatsappUrl("Hello ATC, I am looking for a manufacturer you do not list on the site. Can you source it?");

  function selectCountry(next: string | null) {
    const params = new URLSearchParams(search);
    if (next) params.set("country", next);
    else params.delete("country");
    const qs = params.toString();
    const path = location.split("?")[0] || "/brands";
    setLocation(qs ? `${path}?${qs}` : path, { replace: true });
    const directory = document.getElementById("brand-directory");
    if (directory && directory.getBoundingClientRect().top < HEADER_OFFSET) {
      directory.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }

  return (
    <MainLayout>
      <section className="dark border-b border-white/10 bg-background px-6 pb-14 pt-12 text-foreground md:px-12 md:pb-20 md:pt-20" data-testid="section-brands-hero">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Partner brands</p>
              <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(2.75rem,5.5vw,5.25rem)] font-medium leading-[0.94] tracking-[-0.045em]">
                The brands behind every hinge, runner and handle we supply.
              </h1>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="max-w-sm text-base leading-7 text-foreground/70">
                {brands.length > 0 ? `${brands.length} European brands` : "European brands"}, each represented exclusively in Jordan and chosen for how its products hold up after years of daily use. One agent, stocked and supported from Amman.
              </p>
              <SolidLink href="/catalog" className="mt-7">Browse products</SolidLink>
            </div>
          </Reveal>

          {wall.length > 0 && (
            <Reveal className="mt-12 md:mt-16">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/45">{featured.length > 0 ? "Featured houses" : "Partner houses"}</p>
                <a href="#brand-directory" className="text-sm text-foreground/60 underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                  All {brands.length} houses
                </a>
              </div>
              <ul className={cn("grid grid-cols-2 border-l border-t border-white/10 sm:grid-cols-3", wall.length % 6 === 0 ? "lg:grid-cols-6" : "lg:grid-cols-4")} aria-label="Featured partner brands">
                {wall.map((brand) => (
                  <li key={brand.slug} className="border-b border-r border-white/10">
                    <Link href={`/brands/${brand.slug}`} className="group flex h-24 items-center justify-center px-4 transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:px-6 md:h-28" data-testid={`link-brand-mark-${brand.slug}`}>
                      <BrandMark slug={brand.slug} name={brand.name} className={markClass(brand.slug, "wall")} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </section>

      <section id="brand-directory" className="scroll-mt-[76px] px-6 pb-24 pt-8 md:px-12 md:pb-32 md:pt-10" data-testid="section-brands-directory">
        <div className="mx-auto max-w-[1440px]">
          {countries.length > 1 && (
            <nav aria-label="Filter by country" className="sticky top-[76px] z-30 border-b border-border bg-background">
              <div className="flex items-center gap-4">
                <div className="-mx-6 min-w-0 flex-1 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
                  <LayoutGroup id="brand-countries">
                    <ul className="flex w-max gap-x-6">
                      {[{ name: null as string | null, label: "All countries", count: brands.length }, ...countries.map(([name, count]) => ({ name, label: name, count }))].map((item) => {
                        const active = item.name === country;
                        return (
                          <li key={item.label} className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() => selectCountry(item.name)}
                              aria-pressed={active}
                              className={cn(
                                "flex h-12 items-center gap-2 whitespace-nowrap text-sm transition-colors outline-none focus-visible:text-primary",
                                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                              )}
                              data-testid={`filter-country-${(item.name ?? "all").toLowerCase()}`}
                            >
                              {item.label}
                              <span className="font-mono text-[11px] tabular-nums opacity-70">{item.count}</span>
                            </button>
                            {active && <motion.span layoutId="brand-country-indicator" className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" transition={{ ...SPRING, duration: reduce ? 0 : undefined }} aria-hidden />}
                          </li>
                        );
                      })}
                    </ul>
                  </LayoutGroup>
                </div>
                <p className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground" aria-live="polite" data-testid="text-brands-showing">
                  {shown.length} {shown.length === 1 ? "house" : "houses"}
                </p>
              </div>
            </nav>
          )}

          <div className="mt-8">
            {isLoading ? (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:[grid-auto-flow:dense] lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <li key={index} className={cn("list-none", tileSpan(index))}>
                    <Skeleton className={cn("w-full rounded-none", index === 0 ? "aspect-[4/3] sm:min-h-[32rem]" : index % 4 === 3 ? "aspect-[16/9]" : "aspect-[4/3]")} />
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
                <p className="font-display text-2xl">{country ? `No houses from ${country}.` : "No partner brands are listed yet."}</p>
                {country && (
                  <button type="button" onClick={() => selectCountry(null)} className="mt-4 text-sm underline underline-offset-4 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                    Show all countries
                  </button>
                )}
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

      <section className="dark bg-background px-6 py-20 text-foreground md:px-12 md:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Not on this list</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Looking for a brand we do not list? Ask, and we will tell you whether we can supply it.</h2>
          </Reveal>
          <Reveal className="flex flex-col items-start gap-5 lg:col-span-4 lg:items-end">
            <a href={askHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:translate-y-px" data-testid="link-brands-whatsapp">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
            </a>
            <EditorialLink href="/contact" light>Send an enquiry</EditorialLink>
          </Reveal>
        </div>
      </section>
    </MainLayout>
  );
}
