import { Link } from "wouter";
import { MediaImage } from "@/components/media-image";
import { cn } from "@/lib/utils";

interface ProductCardProduct {
  slug: string;
  name: string;
  category?: string | null;
  /** What the piece is ("Window handle"), which is what separates same-named family members. */
  type?: string | null;
  description?: string | null;
  image?: string | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
  /** Small badge shown over the image, top-left (e.g. the brand name). Omit to hide. */
  badge?: string | null;
  /** Show the product description below the title (catalog-grid style). */
  showDescription?: boolean;
  aspect?: "square" | "4/3";
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
}

/**
 * Shared card for a product in a grid — used by the catalog grid and a
 * brand's featured-products grid, which previously duplicated this markup
 * with only cosmetic differences (aspect ratio, badge, description).
 */
export function ProductCard({
  product,
  badge,
  showDescription = false,
  aspect = "square",
  imageWidth = 600,
  imageHeight = 600,
  className,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn("group flex h-full w-full flex-col bg-background border border-border transition-colors hover:border-primary/40", className)}
      data-testid={`card-product-${product.slug}`}
    >
      <div
        className={cn(
          "relative overflow-hidden border-b border-border bg-muted",
          aspect === "square" ? "aspect-square" : "flex aspect-[4/3] items-center justify-center p-4",
        )}
      >
        <MediaImage
          src={product.image}
          alt={product.name}
          fallbackSrc="/images/product-handle.webp"
          width={imageWidth}
          height={imageHeight}
          className="h-full w-full object-cover grayscale-[20%] transition-all duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
        />
        {badge ? (
          <div className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-foreground">
            {badge}
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 flex w-full justify-end bg-gradient-to-t from-background to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">View details</span>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col", showDescription ? "p-5" : "p-4")}>
        <span
          className={cn(
            "block font-bold uppercase tracking-widest text-muted-foreground",
            showDescription ? "mb-2 text-[9px]" : "mb-1 text-[10px]",
          )}
        >
          {product.type ?? product.category}
        </span>
        <h3
          className={cn(
            "font-display text-lg leading-tight transition-colors group-hover:text-primary",
            !showDescription && "line-clamp-2 min-h-[2lh]",
          )}
        >
          {product.name}
        </h3>
        {showDescription ? (
          <p
            className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground"
            data-testid={`text-product-summary-${product.slug}`}
          >
            {product.description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
