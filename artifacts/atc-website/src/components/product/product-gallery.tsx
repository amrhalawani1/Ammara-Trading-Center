import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { MediaImage } from "@/components/media-image";
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

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft" && count > 1) previous();
      if (event.key === "ArrowRight" && count > 1) next();
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [lightbox, count, previous, next]);

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

      {createPortal(
      <AnimatePresence>
        {lightbox && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4 md:p-12"
            role="dialog"
            aria-modal="true"
            aria-label={`${alt}, enlarged`}
            onClick={() => setLightbox(false)}
          >
            <motion.div
              initial={reduceMotion ? undefined : { scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? undefined : { scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="relative flex h-full w-full max-w-6xl items-center justify-center bg-background"
              onClick={(event) => event.stopPropagation()}
            >
              <MediaImage src={current} alt={alt} width={1600} height={1200} lazy={false} sizes="90vw" className="max-h-full max-w-full object-contain p-6 md:p-12" />
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition hover:bg-accent"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
              {count > 1 && (
                <>
                  <button type="button" onClick={previous} className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-foreground/60 hover:text-foreground" aria-label="Previous image">
                    <ChevronLeft className="h-8 w-8" strokeWidth={1.25} />
                  </button>
                  <button type="button" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-foreground/60 hover:text-foreground" aria-label="Next image">
                    <ChevronRight className="h-8 w-8" strokeWidth={1.25} />
                  </button>
                </>
              )}
              <span className="absolute bottom-4 left-5 font-mono text-xs tabular-nums tracking-[0.2em] text-muted-foreground">
                {pad(activeIndex + 1)} / {pad(count)}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </div>
  );
}
