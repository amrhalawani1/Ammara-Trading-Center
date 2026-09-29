import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  alt: string;
  activeIndex: number;
  onChange: (index: number) => void;
  badge?: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Product stage: cut-out renders sit on the cream-mid stage with multiply blending
 * (white backgrounds disappear, the way DND presents each finish on an identical
 * angle). Crossfades between images, numbered counter, thumbnails, and a lightbox.
 */
export function ProductGallery({ images, alt, activeIndex, onChange, badge, className }: ProductGalleryProps) {
  const reduceMotion = useReducedMotion();
  const [lightbox, setLightbox] = useState(false);
  const count = images.length;
  const current = images[activeIndex] ?? images[0];

  const previous = useCallback(() => onChange((activeIndex - 1 + count) % count), [activeIndex, count, onChange]);
  const next = useCallback(() => onChange((activeIndex + 1) % count), [activeIndex, count, onChange]);

  const fade = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0, scale: 0.985 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.01 } };

  return (
    <div className={className}>
      <div className="group relative aspect-square overflow-hidden bg-tile lg:aspect-[4/3]" data-testid="product-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current ?? "empty"}
            {...fade}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center p-8 md:p-14"
          >
            {current ? (
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="h-full w-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`View ${alt} full screen`}
                data-testid="button-stage-image"
              >
              <MediaImage
                src={current}
                alt={alt}
                fallbackSrc="/images/product-handle.webp"
                width={1200}
                height={900}
                lazy={false}
                fetchPriority="high"
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="h-full w-full object-contain mix-blend-multiply"
              />
              </button>
            ) : (
              <span className="font-display text-3xl font-light text-muted-foreground/60">{alt}</span>
            )}
          </motion.div>
        </AnimatePresence>

        {badge && (
          <span className="absolute left-5 top-5 border border-border bg-background px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">
            {badge}
          </span>
        )}

        <div className="absolute bottom-5 left-5 font-mono text-xs tabular-nums tracking-[0.2em] text-muted-foreground" aria-live="polite">
          {pad(activeIndex + 1)} <span className="text-muted-foreground/50">/</span> {pad(count || 1)}
        </div>

        {current && (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition hover:bg-accent active:scale-[0.96]"
            aria-label="View larger image"
            data-testid="button-zoom"
          >
            <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={previous}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-foreground/50 transition hover:text-foreground md:left-5"
              aria-label="Previous image"
              data-testid="button-gallery-previous"
            >
              <ChevronLeft className="h-7 w-7" strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-foreground/50 transition hover:text-foreground md:right-5"
              aria-label="Next image"
              data-testid="button-gallery-next"
            >
              <ChevronRight className="h-7 w-7" strokeWidth={1.25} />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <ul className="mt-3 grid grid-cols-6 gap-3" aria-label="Product images">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => onChange(index)}
                className={cn(
                  "block aspect-square w-full overflow-hidden bg-tile p-2 transition",
                  index === activeIndex ? "ring-1 ring-foreground" : "opacity-70 hover:opacity-100",
                )}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
              >
                <MediaImage src={image} alt="" width={200} height={200} sizes="120px" className="h-full w-full object-contain mix-blend-multiply" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <PhotoLightbox
        photos={images.map((src) => ({ src, alt }))}
        index={lightbox && current ? activeIndex : null}
        onChange={onChange}
        onClose={() => setLightbox(false)}
        label={alt}
        surface="light"
      />
    </div>
  );
}
