import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import type { Spec } from "./product-facts";

interface SpecTableProps {
  productName: string;
  brandName: string;
  reference?: string | null;
  specs: (Spec & { group?: string | null })[];
}

const GROUP_ORDER = ["Dimensions", "Performance", "Material", "Electrical", "Installation", "Other"];

/** "General" and "Other" both display as General, so they must collapse into one group. */
const groupKey = (group: string | null | undefined) => (!group || group === "General" ? "Other" : group);

/** Häfele-style dense technical table. "Copy specification" lifts the whole sheet to the clipboard for a fabricator's order notes. */
export function SpecTable({ productName, brandName, reference, specs }: SpecTableProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const sheet = [`${productName} - ${brandName}`, reference ? `Ref: ${reference}` : null, ...specs.map((spec) => `${spec.label}: ${spec.value}`)]
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
    return <p className="text-sm leading-7 text-muted-foreground">Technical details for this system are shared on request.</p>;
  }

  return (
    <div>
      {(() => {
        const grouped = specs.some((spec) => spec.group);
        const groups = grouped
          ? GROUP_ORDER.concat([...new Set(specs.map((spec) => groupKey(spec.group)))].filter((g) => !GROUP_ORDER.includes(g)))
              .map((group) => ({ group, rows: specs.filter((spec) => groupKey(spec.group) === group) }))
              .filter((g) => g.rows.length > 0)
          : [{ group: null as string | null, rows: specs }];
        return groups.map(({ group, rows }) => (
          <div key={group ?? "all"} className={group ? "mb-8 last:mb-0" : undefined}>
            {group && <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{group === "Other" ? "General" : group}</p>}
            <table className="w-full border-t border-border text-sm">
              <tbody>
                {rows.map((spec) => (
                  <tr key={spec.label} className="border-b border-border">
                    <th scope="row" className="w-2/5 py-3.5 pr-4 text-left align-top font-normal text-muted-foreground">
                      {spec.label}
                    </th>
                    <td className="py-3.5 text-foreground tabular-nums">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ));
      })()}
      <button
        type="button"
        onClick={copy}
        className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-foreground transition hover:text-primary active:translate-y-px"
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
