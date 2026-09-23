import { motion, useReducedMotion } from "framer-motion";
import { MediaImage } from "@/components/media-image";
import { cn } from "@/lib/utils";

export interface Chapter {
  title: string;
  body: string;
  image?: string | null;
}

interface EditorialChaptersProps {
  statement: string;
  body?: string;
  awards?: string[];
  chapters?: Chapter[];
}

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90, damping: 22 } },
};

/**
 * DND's storytelling: a short statement headline ("A sophisticated balance."),
 * one paragraph, an awards line, then chapters that alternate text and a large image.
 */
export function EditorialChapters({ statement, body, awards = [], chapters = [] }: EditorialChaptersProps) {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? {}
    : { variants: reveal, initial: "hidden" as const, whileInView: "show" as const, viewport: { once: true, margin: "-10% 0px" } };

  return (
    <div className="space-y-20 md:space-y-32">
      <motion.div {...motionProps} className="grid gap-8 lg:grid-cols-12 lg:gap-14">
        <h2 className="font-display text-4xl font-light leading-[1.02] tracking-[-0.03em] md:text-6xl lg:col-span-6" data-testid="text-statement">
          {statement}
        </h2>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
          {body && <p className="text-base leading-8 text-foreground/85">{body}</p>}
          {awards.length > 0 && (
            <ul className="mt-8 space-y-2 border-l border-primary pl-5" aria-label="Awards">
              {awards.map((award) => (
                <li key={award} className="text-xs tracking-wide text-muted-foreground">{award}</li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>

      {chapters.map((chapter, index) => {
        const flip = index % 2 === 1;
        return (
          <motion.article key={chapter.title} {...motionProps} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            {chapter.image && (
              <div className={cn("overflow-hidden bg-accent lg:col-span-7", flip ? "lg:col-start-6 lg:row-start-1" : "lg:col-start-1")}>
                <div className="aspect-[16/11]">
                  <MediaImage src={chapter.image} alt={chapter.title} width={1400} height={960} sizes="(min-width: 1024px) 58vw, 100vw" className="h-full w-full object-cover" />
                </div>
              </div>
            )}
            <div className={cn("lg:col-span-4", chapter.image ? (flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-9") : "lg:col-span-6 lg:col-start-4")}>
              <h3 className="font-display text-3xl font-light leading-[1.05] tracking-[-0.02em] md:text-4xl">{chapter.title}</h3>
              <p className="mt-5 text-sm leading-7 text-foreground/80 md:text-base md:leading-8">{chapter.body}</p>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
