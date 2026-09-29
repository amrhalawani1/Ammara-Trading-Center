import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { MediaImage } from "@/components/media-image";
import { ShortlistPicker } from "@/components/catalog/shortlist-picker";
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

function SaveToShortlist({ product, image }: { product: Product; image: string | null }) {
  return (
    <ShortlistPicker
      item={{
        key: product.slug,
        slug: product.slug,
        name: product.name,
        brandName: product.brandName,
        reference: product.sku?.trim() || product.slug,
        variant: null,
        image,
      }}
      className="left-3 top-3"
      testId={`button-shortlist-${product.slug}`}
    />
  );
}

/**
 * Catalogue tile. The object sits on a steel panel with the name beneath. A product that has no
 * photograph yet keeps the same frame and shows a placeholder in it.
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
          <div className={cn("relative overflow-hidden bg-tile", wide ? "aspect-[4/5] sm:aspect-[8/5]" : "aspect-[4/5]", compared && "ring-2 ring-inset ring-primary")}>
            {primary ? (
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
            ) : (
              <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-medium text-tile-foreground/50">Photo on request</span>
            )}
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
            {isNew(product) && <span className="absolute left-3 top-14 bg-primary px-2 py-1 text-[11px] font-semibold text-primary-foreground">New</span>}
            <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" aria-hidden />
          </div>

          <div className="pt-4">
            <p className="text-xs text-muted-foreground">{product.brandName}</p>
            <h3 className="mt-1 font-display text-xl font-medium leading-none tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary md:text-2xl">{product.name}</h3>
            {(meta || designer) && <p className="mt-2 text-sm text-muted-foreground">{[meta, designer].filter(Boolean).join(". ")}</p>}
          </div>
        </Link>

        <SaveToShortlist product={product} image={primary} />

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
              ? "bg-primary text-primary-foreground"
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
