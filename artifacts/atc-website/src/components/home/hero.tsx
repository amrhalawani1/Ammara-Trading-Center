import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { MediaImage } from "@/components/media-image";
import { company } from "@/lib/content";
import { Kicker, SPRING } from "./primitives";

const HEADLINE = "Quiet authority in hardware.";
const EASE = [0.16, 1, 0.3, 1] as const;

/** Pulls toward the pointer while hovered and springs back when it leaves. Motion values only. */
function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} style={{ x, y }} onPointerMove={move} onPointerLeave={reset} className="inline-block">
      {children}
    </motion.div>
  );
}

/**
 * Full-viewport hero. Three layers of motion: the photograph drifts slowly on its own and
 * shifts against the pointer; the copy shifts the other way; scrolling away parallaxes the image
 * and fades the headline. All driven by motion values, all static under reduced motion.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Pointer position normalised to -1..1 across the section.
  const pointerX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20, mass: 0.6 });
  const pointerY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20, mass: 0.6 });
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const imageX = useTransform(pointerX, [-1, 1], ["1.5%", "-1.5%"]);
  const imageParallaxY = useTransform(pointerY, [-1, 1], ["1.5%", "-1.5%"]);
  const imageScrollY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageY = useTransform([imageParallaxY, imageScrollY], ([p, s]) => `calc(${p} + ${s})`);

  const copyX = useTransform(pointerX, [-1, 1], [-14, 14]);
  const copyPointerY = useTransform(pointerY, [-1, 1], [-8, 8]);
  const copyScrollY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const copyY = useTransform([copyPointerY, copyScrollY], ([p, s]) => (p as number) + (s as number));
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const words = HEADLINE.split(" ");

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="dark relative flex min-h-[100dvh] w-full items-end overflow-hidden bg-background px-6 pb-14 pt-24 text-foreground md:px-12 md:pb-20"
      data-testid="section-hero"
    >
      {/* Photograph: pointer shift + scroll parallax on the outer layer, a slow drift on the inner one. */}
      <motion.div style={reduce ? undefined : { x: imageX, y: imageY }} className="absolute -inset-[4%] will-change-transform" data-testid="hero-image-layer">
        <motion.div
          className="h-full w-full"
          animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 28, ease: "easeInOut", repeat: Infinity }}
        >
          <MediaImage
            src="/images/hero-kitchen.webp"
            alt="Close detail of premium kitchen hardware against warm timber"
            width={1920}
            height={1080}
            lazy={false}
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />

      <motion.div style={reduce ? undefined : { x: copyX, y: copyY, opacity: copyOpacity }} className="relative mx-auto w-full max-w-[1440px] will-change-transform" data-testid="hero-copy-layer">
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.1 }}>
          <Kicker light>Amman, since {company.established}</Kicker>
        </motion.div>

        <h1 className="mt-8 max-w-[14ch] font-display text-[clamp(3.5rem,10vw,10rem)] font-medium leading-[0.86] tracking-[-0.055em] text-foreground" aria-label={HEADLINE}>
          {words.map((word, index) => (
            <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.08em] align-top" aria-hidden>
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.25 + index * 0.09 }}
              >
                {word}
                {index < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.7 }}
          className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md text-lg leading-8 text-foreground/80">Kitchen systems, furniture fittings and the small mechanisms that make a room feel resolved.</p>
          <Magnetic>
            <Link
              href="/catalog"
              className="group inline-flex h-14 items-center gap-3 bg-primary px-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors duration-200 hover:bg-foreground hover:text-background active:scale-[0.98]"
              data-testid="link-hero-catalog"
            >
              Explore the collection
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
