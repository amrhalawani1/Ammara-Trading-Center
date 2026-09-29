import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import type { Brand } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, Section, SolidLink } from "./primitives";

/** The one marquee on the page: partner names at poster scale, outlined, sliding forever. */
const Marquee = memo(function Marquee({ names }: { names: string[] }) {
  const reduce = useReducedMotion();
  const items = [...names, ...names];
  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden" aria-hidden>
      <motion.ul
        className="flex w-max items-center whitespace-nowrap"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: Math.max(36, names.length * 4.5), ease: "linear", repeat: Infinity }}
      >
        {items.map((name, i) => (
          <li
            key={`${name}-${i}`}
            className="px-8 font-display text-[clamp(4rem,11vw,10rem)] font-medium leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_hsl(var(--foreground)/0.55)] md:px-12"
          >
            {name}
          </li>
        ))}
      </motion.ul>
    </div>
  );
});

/** Logo files present in public/images/brands, keyed by catalogue slug. Add a file and an entry. */
export const BRAND_LOGOS: Record<string, string> = {
  "barazza": "barazza.svg",
  "blum": "blum.svg",
  "dnd": "dnd.svg",
  "emuca": "emuca.svg",
  "fgv": "fgv.svg",
  "hafele": "hafele.svg",
  "hettich": "hettich.svg",
  "kessebohmer": "kessebohmer.png",
  "salice": "salice.png"
};

/**
 * A brand's logo rendered through a CSS mask in the tile's text colour, so any artwork (black,
 * white or coloured) reads as a single dark mark on the light tile and turns white when the tile
 * fills red. Brands without a file show their name as a wordmark.
 */
export function BrandMark({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const file = BRAND_LOGOS[slug];
  if (!file) {
    return <span className={cn("block font-display text-2xl font-medium leading-none tracking-[-0.03em] transition-colors md:text-3xl", className ?? "group-hover:text-primary-foreground")}>{name}</span>;
  }
  const mask = `url(/images/brands/${file})`;
  return (
    <span
      role="img"
      aria-label={name}
      className={cn("block h-9 w-full max-w-[11rem] transition-colors duration-300 md:h-11", className ?? "bg-foreground group-hover:bg-primary-foreground")}
      style={{ WebkitMaskImage: mask, maskImage: mask, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "left center", maskPosition: "left center" }}
    />
  );
}

interface PartnerBrandsProps {
  brands: Brand[];
  productCounts: Map<string, number>;
  isLoading: boolean;
}

/** Partner brands: the marquee for scale, then a grid of tiles that fill red on hover. */
export function PartnerBrands({ brands, productCounts, isLoading }: PartnerBrandsProps) {
  const ordered = [...brands].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.name.localeCompare(b.name));
  const countries = [...new Set(brands.map((b) => b.country).filter(Boolean))];

  return (
    <Section tone="panel" className="overflow-hidden">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-7xl">
          The brands we represent{countries.length > 0 ? "," : ""}
          {countries.length > 0 && <span className="block text-muted-foreground">from {countries.length} countries.</span>}
        </h2>
        <SolidLink href="/brands" tone="light" className="hidden md:inline-flex">All brands</SolidLink>
      </Reveal>

      <div className="mt-14 md:mt-20">
        {isLoading ? <div className="h-32 animate-pulse bg-muted" /> : <Marquee names={ordered.map((b) => b.name)} />}
      </div>

      <RevealGroup as="ul" className="mt-14 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-3 lg:grid-cols-4" aria-label="Partner brands">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <li key={i} className="aspect-[5/4] animate-pulse bg-muted" />)
          : ordered.map((brand) => {
              const count = productCounts.get(brand.slug) ?? 0;
              return (
                <Reveal as="li" key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="group relative flex aspect-[5/4] flex-col justify-between overflow-hidden bg-background p-5 md:p-6"
                    data-testid={`link-home-brand-${brand.slug}`}
                  >
                    <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" aria-hidden />
                    <span className="relative flex items-start justify-between text-xs text-muted-foreground transition-colors group-hover:text-primary-foreground/80">
                      {brand.country}
                      <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" strokeWidth={1.75} />
                    </span>
                    <span className="relative">
                      <BrandMark slug={brand.slug} name={brand.name} />
                      <span className="mt-2 block text-xs text-muted-foreground transition-colors group-hover:text-primary-foreground/80">
                        {count > 0 ? `${count} ${count === 1 ? "product" : "products"}` : brand.category}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
      </RevealGroup>
      <SolidLink href="/brands" tone="light" className="mt-10 md:hidden">All brands</SolidLink>
    </Section>
  );
}
