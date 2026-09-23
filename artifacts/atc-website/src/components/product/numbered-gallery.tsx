import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

/** DND's numbered carousel: one large image, "01 02 03" to jump, "Previous / Next" as words, not arrows. */
export function NumberedGallery({ images, alt }: { images: string[]; alt: string }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = images.length;
  if (count < 2) return null;
  const go = (next: number) => setIndex((next + count) % count);

  return (
    <div
      className="outline-none"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} gallery`}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(index - 1);
        if (event.key === "ArrowRight") go(index + 1);
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-accent">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={images[index]}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <MediaImage src={images[index]!} alt={`${alt}, image ${index + 1}`} width={1600} height={1000} sizes="(min-width: 1024px) 80vw, 100vw" className="h-full w-full object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <ol className="flex gap-5 font-mono text-xs tracking-[0.18em]" aria-label="Go to image">
          {images.map((image, i) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-current={i === index ? "true" : undefined}
                className={cn("relative py-1 transition-colors", i === index ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {pad(i + 1)}
                {i === index && <motion.span layoutId="gallery-number" className="absolute inset-x-0 bottom-0 h-px bg-primary" />}
              </button>
            </li>
          ))}
        </ol>
        <div className="flex gap-6 text-xs">
          <button type="button" onClick={() => go(index - 1)} className="text-muted-foreground transition-colors hover:text-foreground">Previous</button>
          <button type="button" onClick={() => go(index + 1)} className="text-foreground transition-colors hover:text-primary">Next</button>
        </div>
      </div>
    </div>
  );
}
