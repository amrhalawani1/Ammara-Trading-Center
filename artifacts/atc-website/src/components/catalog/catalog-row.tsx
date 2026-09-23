import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { MediaImage } from "@/components/media-image";
import { FinishSwatches } from "@/components/catalog/finish-swatches";
import { designerOf } from "@/lib/catalog-filters";
import { isNew, primaryImage, productType, variantSummary } from "@/lib/product-media";
import { cn } from "@/lib/utils";

interface CatalogRowProps {
  product: Product;
  index?: number;
  compared: boolean;
  compareFull: boolean;
  onToggleCompare: (slug: string) => void;
}

export const ROW_GRID = "grid grid-cols-[3rem_minmax(0,1fr)_2.5rem] items-center gap-4 md:grid-cols-[3.5rem_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_6.5rem]";

/** Index view: one product per line, the way a specifier reads a price list. */
export const CatalogRow = memo(function CatalogRow({ product, index = 0, compared, compareFull, onToggleCompare }: CatalogRowProps) {
  const reduceMotion = useReducedMotion();
  const primary = primaryImage(product);
  const type = productType(product);
  const designer = designerOf(product);
  const disabled = compareFull && !compared;

  return (
    <motion.li
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 24, delay: reduceMotion ? 0 : Math.min(index, 12) * 0.02 }}
      className={cn("group relative list-none border-t border-border transition-colors hover:bg-tile/60", compared && "bg-primary/[0.06]")}
    >
      <Link href={`/products/${product.slug}`} className={cn(ROW_GRID, "px-2 py-3")} data-testid={`row-product-${product.slug}`}>
        <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden bg-tile md:h-14 md:w-14">
          {primary ? (
            <MediaImage src={primary} alt="" width={160} height={160} sizes="56px" className="h-full w-full object-contain p-1.5 mix-blend-multiply" />
          ) : (
            <span className="font-display text-lg font-medium leading-none text-tile-foreground/50">{product.name.slice(0, 1).toUpperCase()}</span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-display text-lg font-medium leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary md:text-xl">
            {product.name}
            {isNew(product) && <span className="ml-2 align-middle bg-primary px-1.5 py-0.5 font-sans text-[10px] font-semibold text-primary-foreground">New</span>}
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground md:hidden">{[product.brandName, type].filter(Boolean).join(", ")}</span>
          <span className="mt-0.5 hidden text-xs text-muted-foreground md:block">{product.brandName}</span>
        </span>
        <span className="hidden truncate text-sm text-foreground md:block">{type ?? product.category}</span>
        <span className="hidden items-center gap-2 md:flex">
          <FinishSwatches finishes={product.finishes} max={5} />
          <span className="text-xs text-muted-foreground">{variantSummary(product)}</span>
        </span>
        <span className="hidden truncate text-sm text-muted-foreground md:block">{designer ?? ""}</span>
        <span aria-hidden />
      </Link>

      <button
        type="button"
        onClick={() => onToggleCompare(product.slug)}
        disabled={disabled}
        aria-pressed={compared}
        aria-label={compared ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
        title={disabled ? "You can compare up to 4 products" : compared ? "Comparing" : "Compare"}
        className={cn(
          "absolute right-2 top-1/2 inline-flex h-9 -translate-y-1/2 items-center justify-center gap-1.5 px-2 text-xs font-medium transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 md:px-3",
          compared ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-foreground hover:text-background",
        )}
        data-testid={`button-compare-${product.slug}`}
      >
        {compared ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
        <span className="hidden md:inline">{compared ? "Comparing" : "Compare"}</span>
      </button>
    </motion.li>
  );
});
