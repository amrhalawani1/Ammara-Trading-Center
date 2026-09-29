import { useState } from "react";
import { ProductGallery } from "./product-gallery";
import { MediaImage } from "@/components/media-image";
import { cn } from "@/lib/utils";

const DEFAULT_CAPTION = "Dimensions in mm unless stated. Confirm against the manufacturer's current drawing before cutting.";

/** Dimension and mounting drawings. A single sheet sits on the tile; several use the gallery. */
export function TechnicalDrawings({ images, productName, caption = DEFAULT_CAPTION }: { images: string[]; productName: string; caption?: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) return null;
  if (images.length === 1) {
    return (
      <figure className="border border-border bg-tile p-4 md:p-8">
        <MediaImage src={images[0]!} alt={`${productName} technical drawing`} width={766} height={1024} sizes="(min-width: 1024px) 40vw, 100vw" className="mx-auto h-auto w-full max-w-3xl object-contain" />
        <figcaption className="mt-3 text-xs text-muted-foreground">{caption}</figcaption>
      </figure>
    );
  }
  return (
    <div className={cn("[&_[data-testid=product-stage]]:bg-tile")}>
      <ProductGallery images={images} alt={`${productName} technical drawing`} activeIndex={active} onChange={setActive} />
      <p className="mt-3 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}
