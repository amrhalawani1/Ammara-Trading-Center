import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, DoorOpen, FileText, Package, type LucideIcon } from "lucide-react";
import { useCreateInquiry } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { apiErrorMessage } from "@/lib/api-error";
import { cn } from "@/lib/utils";
import { Reveal, Section } from "./primitives";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TOPICS: { label: string; icon: LucideIcon }[] = [
  { label: "New systems on the floor", icon: DoorOpen },
  { label: "Fitting guides and drawings", icon: FileText },
  { label: "New stock and discontinued lines", icon: Package },
];

/**
 * Newsletter sign-up. One field, one promise. The subscription is stored as an inquiry of kind
 * "newsletter" so it lands in the same table ATC already reads, with a reference to quote back.
 */
export function Newsletter() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const subscribe = useCreateInquiry();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL.test(trimmed)) {
      setError("Enter an email address, like name@studio.jo.");
      return;
    }
    setError(null);
    subscribe.mutate(
      {
        data: {
          kind: "newsletter",
          name: name.trim() || trimmed.split("@")[0] || "Subscriber",
          email: trimmed,
          message: `Newsletter subscription from the homepage. Topics: ${TOPICS.map((topic) => topic.label).join("; ")}.`,
        },
      },
      {
        onSuccess: (result) => setReference(result.reference ?? null),
        onError: (err) => setError(apiErrorMessage(err, "That did not go through. Try again in a moment.")),
      },
    );
  };

  return (
    <Section id="newsletter" tone="red" className="border-t border-primary-foreground/15">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-16">
        <Reveal className="lg:col-span-6">
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-foreground/75">
            <span className="h-px w-8 bg-primary-foreground/70" aria-hidden />
            Monthly letter
          </p>
          <h2 className="mt-6 max-w-[14ch] font-display text-5xl font-medium leading-[0.92] tracking-[-0.05em] text-primary-foreground md:text-6xl">What arrived on the floor this month.</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-primary-foreground/80">
            One email a month from the showroom: systems newly on display, guides from our consultants, and stock news worth knowing before you order. Unsubscribe with one click.
          </p>
          <ul className="mt-8 max-w-sm border-t border-primary-foreground/25">
            {TOPICS.map((topic) => (
              <li key={topic.label} className="flex items-center gap-3 border-b border-primary-foreground/25 py-3 text-sm text-primary-foreground/90">
                <topic.icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                {topic.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
          <AnimatePresence mode="wait" initial={false}>
            {reference ? (
              <motion.div
                key="done"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                className="border border-primary-foreground/20 bg-background text-foreground"
                role="status"
                data-testid="newsletter-success"
              >
                <div className="flex items-center gap-3 border-b border-border px-6 py-4 md:px-8">
                  <span className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground"><Check className="h-4 w-4" strokeWidth={2.5} /></span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">On the list</p>
                </div>
                <div className="px-6 py-7 md:px-8">
                  <p className="font-display text-3xl font-medium leading-none tracking-[-0.03em]">You are on the list.</p>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    The next letter goes to <span className="font-medium text-foreground">{email.trim()}</span>.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                className="border border-primary-foreground/20 bg-background text-foreground"
                data-testid="newsletter-form"
              >
                <div className="flex items-baseline justify-between gap-4 border-b border-border px-6 py-4 md:px-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Send it here</p>
                  <p className="font-mono text-[11px] tabular-nums text-muted-foreground">Once a month</p>
                </div>
                <div className="grid gap-7 px-6 py-7 md:px-8">
                  <div>
                    <label htmlFor={`${inputId}-name`} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Name <span className="font-normal normal-case tracking-normal">(optional)</span>
                    </label>
                    <Input
                      id={`${inputId}-name`}
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-2"
                      placeholder="Your name"
                      data-testid="newsletter-name"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${inputId}-email`} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Email</label>
                    <Input
                      id={`${inputId}-email`}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError(null);
                      }}
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${inputId}-error` : `${inputId}-note`}
                      className={cn("mt-2", error && "border-primary focus-visible:border-primary")}
                      placeholder="you@studio.jo"
                      data-testid="newsletter-email"
                    />
                    {error && (
                      <p id={`${inputId}-error`} className="mt-3 text-sm font-medium text-primary" role="alert" data-testid="newsletter-error">{error}</p>
                    )}
                  </div>
                </div>
                <div className="px-6 pb-7 md:px-8">
                  <button
                    type="submit"
                    disabled={subscribe.isPending}
                    className="inline-flex h-12 w-full items-center justify-center gap-3 border border-foreground bg-foreground px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-background transition-[background-color,color,transform] hover:bg-background hover:text-foreground active:translate-y-px disabled:cursor-wait disabled:opacity-70"
                    data-testid="newsletter-submit"
                  >
                    {subscribe.isPending ? "Subscribing…" : "Send me the letter"}
                    {!subscribe.isPending && <ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
                  </button>
                </div>
                <p id={`${inputId}-note`} className="border-t border-border px-6 py-4 text-xs leading-5 text-muted-foreground md:px-8">No third parties, no resale of your address. Unsubscribe from any letter.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </Section>
  );
}
