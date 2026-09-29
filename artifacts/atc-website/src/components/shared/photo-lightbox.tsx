import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { MediaImage } from "@/components/media-image";
import { cn } from "@/lib/utils";

export type LightboxPhoto = { src: string; alt: string; caption?: string };

/**
 * Full-screen photo viewer. Escape closes, the arrow keys step through, the page stops scrolling
 * while it is open, and focus returns to whatever opened it. `index` null means closed.
 * `surface="light"` suits product cut-outs and drawings shot on white; the default dark suits photographs.
 */
export function PhotoLightbox({
  photos,
  index,
  onChange,
  onClose,
  label,
  surface = "dark",
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
  /** Names the set for screen readers, e.g. "Al-Bayader". */
  label: string;
  surface?: "dark" | "light";
}) {
  const light = surface === "light";
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = photos.length;
  const isOpen = index !== null && count > 0;

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (index === null || count === 0) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((index + 1) % count);
      if (event.key === "ArrowLeft") onChange((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onChange, onClose]);

  const shot = index === null ? null : photos[index];
  const multiple = count > 1;

  // Portalled to <body> so a transformed or sticky ancestor can never trap the fixed overlay.
  return createPortal(
    <AnimatePresence>
      {shot && index !== null && (
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={cn("fixed inset-0 z-[100] flex flex-col text-foreground backdrop-blur-sm", light ? "bg-tile" : "dark bg-background/95")}
          role="dialog"
          aria-modal="true"
          aria-label={`${label} photograph ${index + 1} of ${count}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          data-testid="gallery-lightbox"
        >
          <div className="flex items-center justify-between px-6 py-5 md:px-12">
            <p className="font-mono text-sm tabular-nums text-foreground/70">
              {multiple ? `${String(index + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}` : ""}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className={cn("flex h-10 w-10 items-center justify-center transition hover:bg-primary hover:text-primary-foreground", light ? "border border-border bg-background" : "bg-white/10")}
              aria-label="Close photograph"
              data-testid="button-lightbox-close"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-6 md:px-24" onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={shot.src + index}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none flex h-full w-full items-center justify-center"
              >
                <MediaImage src={shot.src} alt={shot.alt} width={1920} height={1440} sizes="100vw" lazy={false} className={cn("pointer-events-auto max-h-full max-w-full object-contain", light && "mix-blend-multiply")} />
              </motion.div>
            </AnimatePresence>
            {multiple && (
              <>
                <button type="button" onClick={() => onChange((index - 1 + count) % count)} className={cn("absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center transition hover:bg-primary hover:text-primary-foreground md:left-8", light ? "border border-border bg-background" : "bg-white/10")} aria-label="Previous photograph" data-testid="button-lightbox-prev">
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button type="button" onClick={() => onChange((index + 1) % count)} className={cn("absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center transition hover:bg-primary hover:text-primary-foreground md:right-8", light ? "border border-border bg-background" : "bg-white/10")} aria-label="Next photograph" data-testid="button-lightbox-next">
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </>
            )}
          </div>
          <p className={cn("px-6 text-center text-sm leading-6 text-foreground/80 md:px-12", shot.caption ? "min-h-[4.5rem] py-6" : "min-h-[1.5rem]")}>{shot.caption}</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

