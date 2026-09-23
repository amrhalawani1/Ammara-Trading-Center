import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { MediaImage } from "@/components/media-image";

interface ProductHeroProps {
  name: string;
  brandName: string;
  brandSlug: string;
  /** What the piece is ("Door lever"), shown above the name: family names repeat across types. */
  type?: string | null;
  designer?: string | null;
  badge?: string | null;
  image?: string | null;
  finish?: string | null;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const rise = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110, damping: 20 } } };

/**
 * DND's hero: the object first, enormous, straight on the canvas (no stage box);
 * the name lowercase and light, sitting low-left; designer credit as a quiet line.
 */
export function ProductHero({ name, brandName, brandSlug, type, designer, badge, image, finish }: ProductHeroProps) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="overflow-hidden">
      <div className="container mx-auto grid gap-6 px-4 pb-10 pt-4 lg:min-h-[74dvh] lg:grid-cols-12 lg:gap-10 lg:pb-16 lg:pt-8">
        <div className="relative order-1 lg:order-2 lg:col-span-7 lg:col-start-6">
          <div className="relative aspect-[4/3] bg-tile lg:absolute lg:inset-0 lg:aspect-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={image ?? "none"}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {image ? (
                  <MediaImage
                    src={image}
                    alt={`${name}${finish ? ` in ${finish}` : ""}`}
                    fallbackSrc="/images/product-handle.webp"
                    width={1600}
                    height={1200}
                    lazy={false}
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                ) : (
                  // No licensed photography for this product yet; the name is already set large
                  // alongside, so the panel stays quiet rather than repeating it.
                  <span className="flex flex-col items-center gap-4 text-center">
                    <span className="h-14 w-14 rounded-full border border-foreground/15" aria-hidden />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/70">Image on request</span>
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          className="order-2 flex flex-col justify-end lg:order-1 lg:col-span-5 lg:row-start-1"
          variants={reduceMotion ? undefined : container}
          initial="hidden"
          animate="show"
        >
          {badge && (
            <motion.span variants={rise} className="mb-5 inline-flex w-fit border border-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              {badge}
            </motion.span>
          )}
          {type && (
            <motion.p variants={rise} className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground" data-testid="text-product-type">
              {type}
            </motion.p>
          )}
          <motion.h1
            variants={rise}
            className="font-display text-6xl font-light lowercase leading-[0.9] tracking-[-0.04em] text-foreground md:text-8xl"
            data-testid="text-product-title"
          >
            {name}
          </motion.h1>
          <motion.p variants={rise} className="mt-6 text-sm text-foreground">
            <Link href={`/brands/${brandSlug}`} className="font-medium transition-colors hover:text-primary">{brandName}</Link>
            {designer && <span className="text-muted-foreground"> · {designer}</span>}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
