import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, MessageCircle, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { MediaImage } from "@/components/media-image";
import { SOLUTION_IMAGES } from "@/lib/home-content";
import { catalogueHref, CONSTRAINTS, ROOMS, type Constraint, type Problem, type Room } from "@/lib/selector";
import { solutionBySlug } from "@/lib/solutions";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";
import { Kicker, Reveal, Section } from "./primitives";

type Step = 0 | 1 | 2 | 3;

const STEP_LABELS = ["Where is it?", "What is wrong?", "What matters most?", "What we would suggest"] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Problem-first selector. Three plain questions, answered by clicking, resolve to one solution
 * area with the counter's explanation and a link into the filtered catalogue. Nobody has to know
 * the word "lift system" to find one.
 */
export function GuidedSelector({ counts }: { counts: Map<string, number> }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [constraint, setConstraint] = useState<Constraint | null>(null);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  const step: Step = done ? 3 : problem ? 2 : room ? 1 : 0;
  const roomOption = useMemo(() => ROOMS.find((item) => item.id === room) ?? null, [room]);
  const solution = problem ? solutionBySlug(problem.solution) : undefined;
  const visual = solution ? SOLUTION_IMAGES[solution.slug] : undefined;
  const count = solution ? counts.get(solution.name) ?? 0 : 0;

  const reset = () => {
    setRoom(null);
    setProblem(null);
    setConstraint(null);
    setDone(false);
  };

  const back = () => {
    if (done) setDone(false);
    else if (problem) setProblem(null);
    else if (room) setRoom(null);
  };

  const pick = (next: Constraint | null) => {
    setConstraint(next);
    setDone(true);
  };

  const askHref = whatsappUrl(
    problem && roomOption
      ? `Hello ATC, ${roomOption.label.toLowerCase()}: ${problem.label.toLowerCase()}${constraint ? `, and ${CONSTRAINTS.find((c) => c.id === constraint)?.label.toLowerCase()}` : ""}. What would you suggest?`
      : "Hello ATC, I have a problem I need hardware for.",
  );

  const variants = reduce
    ? undefined
    : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.35, ease: EASE } };

  return (
    <Section tone="panel" id="selector" className="overflow-hidden">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <Kicker>Start with the problem</Kicker>
          <h2 className="mt-6 max-w-[12ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] md:text-6xl">Tell us what is wrong. We will name the fitting.</h2>
          <p className="mt-6 max-w-sm text-base leading-7 text-muted-foreground">Three questions, no jargon. You get the products that fit, with the advice you would get in the showroom.</p>

          <ol className="mt-10 hidden gap-3 lg:grid" aria-label="Steps">
            {STEP_LABELS.map((label, index) => {
              const state = index < step ? "done" : index === step ? "current" : "todo";
              return (
                <li key={label} className={cn("flex items-center gap-3 text-sm transition-colors", state === "current" ? "text-foreground" : "text-muted-foreground")}>
                  <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center font-mono text-[11px] tabular-nums", state === "current" && "bg-primary text-primary-foreground", state === "done" && "bg-foreground text-background", state === "todo" && "border border-border")}>
                    {index + 1}
                  </span>
                  {label}
                </li>
              );
            })}
          </ol>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={0.1}>
          <div className="min-h-[420px] border border-border bg-background" data-testid="guided-selector" data-step={step}>
            {/* Trail: what has been chosen so far, plus back and reset. */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3 md:px-8">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{String(step + 1).padStart(2, "0")} / 04</span>
                <span className="text-muted-foreground">·</span>
                <span className="font-medium">{STEP_LABELS[step]}</span>
                {roomOption && <Crumb onClick={() => { setProblem(null); setDone(false); setRoom(null); }}>{roomOption.label}</Crumb>}
                {problem && <Crumb onClick={() => { setDone(false); setProblem(null); }}>{problem.label}</Crumb>}
              </div>
              <div className="flex items-center gap-1">
                {step > 0 && (
                  <button type="button" onClick={back} className="inline-flex h-9 items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="button-selector-back">
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} /> Back
                  </button>
                )}
                {step > 0 && (
                  <button type="button" onClick={reset} className="inline-flex h-9 items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground" data-testid="button-selector-reset">
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} /> Start over
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <motion.div key="room" {...variants} className="p-5 md:p-8">
                  <p className="text-base leading-7 text-muted-foreground">Which room is it in?</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {ROOMS.map((item) => (
                      <li key={item.id}>
                        <Choice onClick={() => setRoom(item.id)} testId={`selector-room-${item.id}`}>
                          <span className="font-display text-2xl font-medium leading-none tracking-[-0.03em]">{item.label}</span>
                          <span className="mt-2 block text-sm text-muted-foreground">{item.hint}</span>
                        </Choice>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {step === 1 && roomOption && (
                <motion.div key="problem" {...variants} className="p-5 md:p-8">
                  <p className="text-base leading-7 text-muted-foreground">In the {roomOption.label.toLowerCase()}, what is the problem?</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {roomOption.problems.map((item) => (
                      <li key={item.id}>
                        <Choice onClick={() => setProblem(item)} testId={`selector-problem-${item.id}`}>
                          <span className="text-base font-medium leading-6">{item.label}</span>
                        </Choice>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {step === 2 && problem && (
                <motion.div key="constraint" {...variants} className="p-5 md:p-8">
                  <p className="text-base leading-7 text-muted-foreground">What matters most?</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {CONSTRAINTS.map((item) => (
                      <li key={item.id}>
                        <Choice onClick={() => pick(item.id)} testId={`selector-constraint-${item.id}`}>
                          <span className="text-base font-medium leading-6">{item.label}</span>
                        </Choice>
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => pick(null)} className="mt-5 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground" data-testid="selector-constraint-skip">
                    No preference, show me the options
                  </button>
                </motion.div>
              )}

              {step === 3 && problem && solution && (
                <motion.div key="result" {...variants} className="grid md:grid-cols-12">
                  <div className="relative aspect-[4/3] md:col-span-5 md:aspect-auto md:min-h-[420px]">
                    {visual && <MediaImage src={visual.image} alt={visual.alt} width={900} height={1125} sizes="(min-width: 768px) 30vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />}
                    <span className="absolute left-0 top-0 h-full w-1 bg-primary" aria-hidden />
                  </div>
                  <div className="flex flex-col p-5 md:col-span-7 md:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Our suggestion</p>
                    <h3 className="mt-3 font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-5xl" data-testid="selector-result-name">{solution.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{count > 0 ? `${count} ${count === 1 ? "product" : "products"}` : "Available on request"}</p>
                    <p className="mt-6 max-w-md text-base leading-7 text-foreground/85">{problem.answer}</p>
                    <div className="mt-auto flex flex-wrap gap-3 pt-8">
                      <Link href={catalogueHref(problem, constraint)} className="group inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:translate-y-px" data-testid="selector-result-catalogue">
                        {count > 0 ? `See ${count} ${count === 1 ? "product" : "products"}` : "See products"} <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
                      </Link>
                      <a href={askHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 border border-foreground/25 px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-foreground active:translate-y-px" data-testid="selector-result-whatsapp">
                        <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask a consultant on WhatsApp
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function Choice({ children, onClick, testId }: { children: React.ReactNode; onClick: () => void; testId: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[72px] w-full items-start justify-between gap-4 border border-border p-4 text-left transition-[border-color,background-color] hover:border-foreground hover:bg-card focus-visible:border-primary focus-visible:outline-none active:translate-y-px md:p-5"
      data-testid={testId}
    >
      <span className="block">{children}</span>
      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" strokeWidth={1.75} />
    </button>
  );
}

function Crumb({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-7 items-center bg-card px-2.5 text-xs text-foreground/80 transition-colors hover:text-primary" title="Change this answer">
      {children}
    </button>
  );
}
