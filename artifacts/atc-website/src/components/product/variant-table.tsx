import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { ConfiguratorVariant } from "./variant-configurator";
import { cn } from "@/lib/utils";

/** Häfele's item table: every orderable variant with its item number, copyable in one tap. */
export function VariantTable({ variants, selected, onSelect }: { variants: ConfiguratorVariant[]; selected: number; onSelect: (index: number) => void }) {
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const withNumbers = variants.some((v) => v.articleNumber);
  if (variants.length < 2 || !withNumbers) return null;
  const attributeKeys = [...new Set(variants.flatMap((v) => Object.keys(v.attributes ?? {})).filter((k) => k !== "group"))].slice(0, 2);
  const heading = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-t border-border text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th scope="col" className="py-3 pr-4 font-normal">Item no.</th>
            <th scope="col" className="py-3 pr-4 font-normal">Variant</th>
            {attributeKeys.map((key) => <th key={key} scope="col" className="py-3 pr-4 font-normal">{heading(key)}</th>)}
            <th scope="col" className="w-10 py-3"><span className="sr-only">Copy</span></th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant, index) => (
            <tr key={`${variant.code}-${index}`} className={cn("border-b border-border transition-colors", index === selected ? "bg-accent" : "hover:bg-accent/60")}>
              <td className="py-3 pr-4 font-mono text-xs tracking-[0.08em] text-foreground">{variant.articleNumber ?? "-"}</td>
              <td className="py-3 pr-4">
                <button type="button" onClick={() => onSelect(index)} className="text-left text-foreground transition hover:text-primary">{variant.label}</button>
              </td>
              {attributeKeys.map((key) => <td key={key} className="py-3 pr-4 text-muted-foreground tabular-nums">{variant.attributes?.[key] ?? "-"}</td>)}
              <td className="py-3 text-right">
                {variant.articleNumber && (
                  <button
                    type="button"
                    onClick={async () => { try { await navigator.clipboard.writeText(variant.articleNumber!); setCopied(variant.articleNumber!); } catch { /* unavailable */ } }}
                    className="p-1 text-muted-foreground transition hover:text-foreground"
                    aria-label={`Copy item number ${variant.articleNumber}`}
                  >
                    {copied === variant.articleNumber ? <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
