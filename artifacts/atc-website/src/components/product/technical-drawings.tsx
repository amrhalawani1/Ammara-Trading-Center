import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { MediaImage } from "@/components/media-image";
import { cn } from "@/lib/utils";

/** Dimension and mounting drawings (Häfele, Barazza), shown on white paper, enlargeable. */
export function TechnicalDrawings({ images, productName }: { images: string[]; productName: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <figure className="border border-border bg-tile p-4 md:p-8">
        <MediaImage src={images[0]!} alt={`${productName} technical drawing`} width={1200} height={900} sizes="(min-width: 1024px) 40vw, 100vw" className="h-auto w-full object-contain" />
        <figcaption className="mt-3 text-xs text-muted-foreground">Dimensions in mm unless stated. Confirm against the manufacturer's current drawing before cutting.</figcaption>
      </figure>
    );
  }
  return (
    <div className={cn("[&_[data-testid=product-stage]]:bg-tile")}>
      <ProductGallery images={images} alt={`${productName} technical drawing`} activeIndex={active} onChange={setActive} />
      <p className="mt-3 text-xs text-muted-foreground">Dimensions in mm unless stated. Confirm against the manufacturer's current drawing before cutting.</p>
    </div>
  );
}
