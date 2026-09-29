import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { MediaImage } from "@/components/media-image";
import { useMediaQuery } from "@/hooks/use-media-query";
import { isNew, primaryImage, productType, variantSummary } from "@/lib/product-media";
import { cn } from "@/lib/utils";
import { Section, SolidLink } from "./primitives";

interface CatalogueRailProps {
  products: Product[];
  isLoading: boolean;
}

const pickFeatured = (products: Product[]) =>
  [...products].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(Boolean(primaryImage(b))) - Number(Boolean(primaryImage(a)))).slice(0, 10);

/** Tile width. The viewport term keeps a large card inside the pinned rail; the cap is for tall screens. */
const tileWidth = "w-[min(84vw,520px)] lg:w-[clamp(260px,min(36vw,calc((100dvh-16rem)*0.62)),560px)]";

/**
 * The catalogue as a horizontal pan: on wide screens the section pins and vertical scrolling
 * slides a track of product tiles sideways. Phones and reduced motion get a native swipe rail.
 */
export function CatalogueRail({ products, isLoading }: CatalogueRailProps) {
  const pinned = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const featured = pickFeatured(products);
  return pinned && !reduce ? <PannedRail products={featured} isLoading={isLoading} /> : <SwipeRail products={featured} isLoading={isLoading} />;
}

function Tile({ product, index }: { product: Product; index: number }) {
  const image = primaryImage(product);
  const meta = [productType(product), variantSummary(product)].filter(Boolean).join(", ");
  return (
    <Link href={`/products/${product.slug}`} className={cn("group block shrink-0 snap-start", tileWidth)} data-testid={`card-home-product-${product.slug}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-tile">
        {image ? (
          <MediaImage src={image} alt={product.name} width={900} height={1125} sizes="(min-width: 1024px) 36vw, 84vw" className="absolute inset-0 h-full w-full object-contain p-8 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-tile-foreground/50">Photo on request</span>
        )}
        {isNew(product) && <span className="absolute left-4 top-4 bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">New</span>}
        <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" aria-hidden />
      </div>
      <div className="pt-5">
        <p className="text-xs text-foreground">{product.brandName}</p>
        <h3 className="mt-1 font-display text-2xl font-medium leading-none tracking-[-0.03em] transition-colors group-hover:text-primary md:text-3xl">{product.name}</h3>
        {meta && <p className="mt-2 text-sm text-foreground">{meta}</p>}
      </div>
      <span className="sr-only">{index + 1}</span>
    </Link>
  );
}

function Heading({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className={cn("font-display font-medium leading-[0.92] tracking-[-0.05em]", compact ? "text-5xl xl:text-6xl [@media(max-height:760px)]:text-4xl" : "text-5xl md:text-7xl")}>
          Every product, <span className="text-muted-foreground">fully documented.</span>
        </h2>
        <p className={cn("max-w-lg text-muted-foreground", compact ? "mt-3 text-sm leading-6 [@media(max-height:860px)]:hidden" : "mt-6 text-lg leading-8")}>
          Every product carries its item numbers, finishes and the manufacturer's drawings, so what you see here is what you can order. Compare up to 4 side by side.
        </p>
      </div>
      <SolidLink href="/catalog" className="shrink-0">View all products</SolidLink>
    </div>
  );
}

function PannedRail({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 96));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [products.length]);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <div ref={wrap} style={{ height: `calc(100vh + ${distance}px)` }} className="relative my-24 md:my-32">
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden pb-8 pt-20 [@media(max-height:760px)]:justify-start [@media(max-height:760px)]:pt-16">
        <div className="mx-auto w-full max-w-[1440px] px-12">
          <Heading compact />
        </div>
        <motion.div ref={track} style={{ x }} className="mt-8 flex w-max gap-8 pl-12 will-change-transform [@media(max-height:760px)]:mt-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className={cn("aspect-[4/5] animate-pulse bg-muted", tileWidth)} />)
            : products.map((product, index) => <Tile key={product.slug} product={product} index={index} />)}
          <Link href="/catalog" className={cn("group flex aspect-[4/5] flex-col items-center justify-center gap-4 self-start bg-card text-center transition-colors hover:bg-primary hover:text-primary-foreground", tileWidth)} data-testid="link-home-catalogue-all">
            <span className="font-display text-3xl font-medium tracking-[-0.03em]">All products</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">View all products</span>
          </Link>
        </motion.div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-foreground/10" aria-hidden>
          <motion.div style={{ scaleX: scrollYProgress }} className="h-full w-full origin-left bg-primary" />
        </div>
      </div>
    </div>
  );
}

function SwipeRail({ products, isLoading }: { products: Product[]; isLoading: boolean }) {
  return (
    <Section className={cn("overflow-hidden")}>
      <Heading />
      <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] md:-mx-12 md:px-12 [&::-webkit-scrollbar]:hidden">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[4/5] w-[78vw] shrink-0 animate-pulse bg-muted" />)
          : products.map((product, index) => <Tile key={product.slug} product={product} index={index} />)}
      </div>
    </Section>
  );
}
