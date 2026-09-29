import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { referenceLine, type ProductReference } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Spec } from "./product-facts";

interface SpecTableProps {
  productName: string;
  brandName: string;
  reference?: ProductReference | null;
  specs: (Spec & { group?: string | null })[];
}

const GROUP_ORDER = ["Dimensions", "Performance", "Material", "Electrical", "Installation", "Other"];

/** "General" and "Other" both display as General, so they must collapse into one group. */
const groupKey = (group: string | null | undefined) => (!group || group === "General" ? "Other" : group);

/** A short measurement reads as a figure. A sentence stays body type. */
function isFigure(value: string) {
  return value.length <= 48 && value.split(/\s+/).length <= 8;
}

/** A graphite cut-sheet. The figure leads, the label sits under it, and groups run down the side. */
export function SpecTable({ productName, brandName, reference, specs }: SpecTableProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const sheet = [`${productName} - ${brandName}`, reference ? referenceLine(reference) : null, ...specs.map((spec) => `${spec.label}: ${spec.value}`)]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(sheet);
      setCopied(true);
    } catch {
      /* clipboard unavailable - the table itself remains selectable */
    }
  };

  if (specs.length === 0) {
    return <p className="text-sm leading-7 text-muted-foreground">Technical data for this product is available on request. Ask on WhatsApp and a consultant will send the manufacturer's current sheet.</p>;
  }

  const grouped = specs.some((spec) => spec.group);
  const groups = grouped
    ? GROUP_ORDER.concat([...new Set(specs.map((spec) => groupKey(spec.group)))].filter((g) => !GROUP_ORDER.includes(g)))
        .map((group) => ({ group, rows: specs.filter((spec) => groupKey(spec.group) === group) }))
        .filter((g) => g.rows.length > 0)
    : [{ group: null as string | null, rows: specs }];

  return (
    <div>
      <div className={grouped ? "divide-y divide-foreground/12 border-y border-foreground/12" : undefined}>
        {groups.map(({ group, rows }) => (
          <div key={group ?? "all"} className={group ? "grid gap-6 py-8 lg:grid-cols-[12rem_1fr] lg:items-start lg:gap-12 lg:py-10" : undefined}>
            {group && (
              <h3 className="flex items-center gap-3 font-display text-lg font-medium tracking-[-0.03em]">
                <span className="h-px w-6 shrink-0 bg-primary" aria-hidden />
                {group === "Other" ? "General" : group}
              </h3>
            )}
            <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map((spec) => (
                <div key={spec.label} className="flex flex-col-reverse gap-2">
                  <dt className="text-xs text-muted-foreground">{spec.label}</dt>
                  <dd className={cn("text-balance text-foreground tabular-nums", isFigure(spec.value) ? "font-display text-[1.65rem] font-medium leading-tight tracking-[-0.03em]" : "text-base font-medium leading-6")}>
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={copy}
        className="mt-8 inline-flex h-11 items-center gap-2 border border-foreground/25 px-4 text-sm font-medium text-foreground transition hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:translate-y-px"
        data-testid="button-copy-spec"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span key="done" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2 text-primary">
              <Check className="h-3.5 w-3.5" strokeWidth={2} /> Specification copied
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="inline-flex items-center gap-2">
              <Copy className="h-3.5 w-3.5" strokeWidth={1.5} /> Copy specification
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
