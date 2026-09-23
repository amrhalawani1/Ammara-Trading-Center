import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { MediaImage } from "@/components/media-image";
import { FinishSwatches } from "@/components/catalog/finish-swatches";
import { designerOf } from "@/lib/catalog-filters";
import { isNew, primaryImage, productType, secondaryImage, variantSummary } from "@/lib/product-media";
import { cn } from "@/lib/utils";

interface CatalogCardProps {
  product: Product;
  index?: number;
  /** Spans two columns; only used for products with photography. */
  wide?: boolean;
  compared: boolean;
  /** True when the comparison is full and this product is not in it. */
  compareFull: boolean;
  onToggleCompare: (slug: string) => void;
}

export const hasPhoto = (product: Product) => Boolean(primaryImage(product));

/**
 * Catalogue tile. With photography: the object on a steel panel, name beneath. Without it: a
 * graphite panel that carries the name in display type and the finishes as tones, so a product
 * awaiting its photo still reads as a deliberate object rather than a gap in the grid.
 */
export const CatalogCard = memo(function CatalogCard({ product, index = 0, wide = false, compared, compareFull, onToggleCompare }: CatalogCardProps) {
  const reduceMotion = useReducedMotion();
  const primary = primaryImage(product);
  const secondary = secondaryImage(product);
  const secondaryIsPhoto = (product.details?.media ?? []).some((m) => m.src === secondary && (m.role === "ambient" || m.role === "detail"));
  const type = productType(product);
  const meta = [type, variantSummary(product)].filter(Boolean).join(", ");
  const designer = designerOf(product);
  const disabled = compareFull && !compared;
  const typographic = !primary;

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
      transition={{ type: "spring", stiffness: 150, damping: 22, delay: reduceMotion ? 0 : Math.min(index, 9) * 0.03 }}
      className={cn("list-none", wide && "col-span-2")}
    >
      <article className="group relative h-full">
        <Link href={`/products/${product.slug}`} className="block" data-testid={`card-product-${product.slug}`}>
          {typographic ? (
            <div className={cn("dark relative flex aspect-[4/5] flex-col justify-between overflow-hidden bg-background p-5 text-foreground transition-colors duration-500 group-hover:bg-primary md:p-6", compared && "ring-2 ring-inset ring-primary group-hover:ring-primary-foreground/60")}>
              <p className="pr-28 text-xs text-foreground/60 transition-colors group-hover:text-primary-foreground/80">{product.brandName}</p>
              <div>
                <h3 className="font-display text-[clamp(1.6rem,2.4vw,2.4rem)] font-medium leading-[0.95] tracking-[-0.04em] [overflow-wrap:anywhere]">{product.name}</h3>
                {type && <p className="mt-2 text-sm text-foreground/60 transition-colors group-hover:text-primary-foreground/80">{type}</p>}
                <FinishSwatches finishes={product.finishes} size="md" className="mt-4 text-foreground/70" />
              </div>
              {isNew(product) && <span className="absolute left-5 top-5 hidden bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground" aria-hidden />}
            </div>
          ) : (
            <div className={cn("relative overflow-hidden bg-tile", wide ? "aspect-[4/5] sm:aspect-[8/5]" : "aspect-[4/5]", compared && "ring-2 ring-inset ring-primary")}>
              <MediaImage
                src={primary}
                alt={product.name}
                width={wide ? 1600 : 800}
                height={wide ? 1000 : 1000}
                sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
                className={cn(
                  "absolute inset-0 h-full w-full object-contain p-8 mix-blend-multiply transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:p-10",
                  secondary ? "group-hover:opacity-0" : "group-hover:scale-[1.06]",
                )}
              />
              {secondary && (
                <MediaImage
                  src={secondary}
                  alt=""
                  width={800}
                  height={1000}
                  sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
                  className={cn(
                    "absolute inset-0 h-full w-full opacity-0 transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100",
                    secondaryIsPhoto ? "object-cover" : "object-contain p-8 mix-blend-multiply md:p-10",
                  )}
                />
              )}
              {isNew(product) && <span className="absolute left-4 top-4 bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">New</span>}
              <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" aria-hidden />
            </div>
          )}

          {!typographic && (
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">{product.brandName}</p>
              <h3 className="mt-1 font-display text-xl font-medium leading-none tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary md:text-2xl">{product.name}</h3>
              {(meta || designer) && <p className="mt-2 text-sm text-muted-foreground">{[meta, designer].filter(Boolean).join(". ")}</p>}
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={() => onToggleCompare(product.slug)}
          disabled={disabled}
          aria-pressed={compared}
          aria-label={compared ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
          title={disabled ? "You can compare up to 4 products" : compared ? "Comparing" : "Compare"}
          className={cn(
            "absolute right-3 top-3 inline-flex h-9 items-center gap-1.5 px-3 text-xs font-medium transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40",
            compared
              ? "bg-primary text-primary-foreground group-hover:bg-background group-hover:text-foreground"
              : typographic
                ? "bg-white/10 text-white hover:bg-white hover:text-black"
                : "bg-background/90 text-foreground backdrop-blur-sm hover:bg-foreground hover:text-background",
          )}
          data-testid={`button-compare-${product.slug}`}
        >
          {compared ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
          {compared ? "Comparing" : "Compare"}
        </button>
      </article>
    </motion.li>
  );
});
