import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, MessageCircle, X } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { MediaImage } from "@/components/media-image";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { designerOf } from "@/lib/catalog-filters";
import { finishTone, isLightTone } from "@/lib/finishes";
import { primaryImage, productType } from "@/lib/product-media";
import { downloadComparisonPdf } from "@/lib/compare-pdf";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export const COMPARE_LIMIT = 4;
const STORAGE_KEY = "atc-compare";

function readStored(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, COMPARE_LIMIT) : [];
  } catch {
    return [];
  }
}

/** Selected slugs, kept for the browser session so a comparison survives visiting a product. */
export function useCompare() {
  const [slugs, setSlugs] = useState<string[]>(readStored);
  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      /* storage unavailable: the comparison simply lasts for this page view */
    }
  }, [slugs]);

  const toggle = (slug: string) =>
    setSlugs((current) => (current.includes(slug) ? current.filter((s) => s !== slug) : current.length >= COMPARE_LIMIT ? current : [...current, slug]));
  const remove = (slug: string) => setSlugs((current) => current.filter((s) => s !== slug));
  const clear = () => setSlugs([]);
  return { slugs, toggle, remove, clear };
}

function compareStatus(count: number) {
  const room = COMPARE_LIMIT - count;
  if (count < 2) return "Add one more to compare";
  if (room === 0) return "Ready to compare";
  return `Ready to compare · add up to ${room} more`;
}

function TrayActions({ ready, onOpen, onClear, className }: { ready: boolean; onOpen: () => void; onClear: () => void; className?: string }) {
  return (
    <div className={cn("flex shrink-0 items-center gap-2", className)}>
      <button
        type="button"
        onClick={onOpen}
        disabled={!ready}
        className="inline-flex h-10 items-center gap-2 bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
        data-testid="button-open-compare"
      >
        Compare
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex h-10 w-10 items-center justify-center bg-background/10 text-background transition hover:bg-background/20"
        aria-label="Clear comparison"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}

interface CompareTrayProps {
  products: Product[];
  onRemove: (slug: string) => void;
  onClear: () => void;
  onOpen: () => void;
}

export function CompareTray({ products, onRemove, onClear, onOpen }: CompareTrayProps) {
  const reduceMotion = useReducedMotion();
  const ready = products.length >= 2;
  return (
    <AnimatePresence>
      {products.length > 0 && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed inset-x-3 bottom-3 z-40 bg-foreground text-background shadow-[0_18px_40px_-18px_rgba(0,0,0,0.55)] md:inset-x-auto md:bottom-6 md:left-1/2 md:w-[min(1280px,calc(100vw-3rem))] md:-translate-x-1/2"
          role="region"
          aria-label="Product comparison"
          data-testid="compare-tray"
        >
          <div className="flex flex-col gap-2.5 px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 min-w-11 shrink-0 items-center justify-center bg-primary px-2 font-mono text-sm font-bold tabular-nums text-primary-foreground">
                {products.length}/{COMPARE_LIMIT}
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-background md:flex-none">{compareStatus(products.length)}</p>
              <TrayActions ready={ready} onOpen={onOpen} onClear={onClear} className="md:hidden" />
            </div>
            <ul className="flex items-center gap-2 overflow-x-auto md:min-w-0 md:flex-1 md:overflow-hidden">
              {products.map((product) => (
                <li key={product.slug} className="flex w-max max-w-[11rem] shrink-0 items-center gap-2 bg-background/10 px-2 py-1.5 text-sm">
                  <button
                    type="button"
                    onClick={() => onRemove(product.slug)}
                    className="shrink-0 text-base leading-none text-background/80 transition hover:text-background"
                    aria-label={`Remove ${product.name} from comparison`}
                  >
                    ×
                  </button>
                  <span className="min-w-0 truncate font-medium" title={product.name}>{product.name}</span>
                </li>
              ))}
            </ul>
            <TrayActions ready={ready} onOpen={onOpen} onClear={onClear} className="hidden md:flex" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Spec labels shown in fixed rows above the free-form spec rows. */
const FIXED_LABELS = /^(designer|type|finishes)$/i;

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onRemove: (slug: string) => void;
}

export function CompareDialog({ open, onOpenChange, products, onRemove }: CompareDialogProps) {
  const specLabels = [...new Set(products.flatMap((product) => (product.specs ?? []).map((spec) => spec.label)))].filter((label) => !FIXED_LABELS.test(label));
  const specValue = (product: Product, label: string) => product.specs?.find((spec) => spec.label === label)?.value ?? null;

  const rows: { label: string; render: (product: Product) => ReactNode; text: (product: Product) => string | null }[] = [
    { label: "Brand", render: (p) => p.brandName, text: (p) => p.brandName },
    { label: "Type", render: (p) => productType(p) ?? p.category, text: (p) => productType(p) ?? p.category },
    { label: "Solution", render: (p) => p.category, text: (p) => p.category },
    { label: "Designer", render: (p) => designerOf(p), text: (p) => designerOf(p) },
    {
      label: "Finishes",
      text: (p) => ((p.finishes?.length ?? 0) > 0 ? p.finishes!.join("; ") : null),
      render: (p) =>
        (p.finishes?.length ?? 0) > 0 ? (
          <div>
            <p>{p.finishes!.length} available</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.finishes!.slice(0, 10).map((finish, index) => {
                const tone = finishTone(finish, index);
                return <span key={finish} title={finish} className={cn("h-3.5 w-3.5 rounded-full", isLightTone(tone) && "ring-1 ring-inset ring-foreground/20")} style={{ backgroundColor: tone }} />;
              })}
            </div>
          </div>
        ) : null,
    },
    ...specLabels.map((label) => ({ label, render: (p: Product) => specValue(p, label), text: (p: Product) => specValue(p, label) })),
  ];

  const askHref = whatsappUrl(
    [`Hello ATC, I am comparing these products and would like advice on which suits my project:`, ...products.map((p) => `- ${p.name} by ${p.brandName}${productType(p) ? ` (${productType(p)})` : ""}`)].join("\n"),
  );

  const [exporting, setExporting] = useState(false);
  /** The same table as a designed PDF, so the comparison can go into a schedule or a client pack. */
  const download = async () => {
    setExporting(true);
    try {
      await downloadComparisonPdf(products, rows.map((row) => ({ label: row.label, values: products.map((p) => row.text(p)) })));
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-6xl flex-col gap-0 overflow-hidden rounded-none p-0 sm:rounded-none">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border px-5 py-5 pr-12 md:px-8 md:pr-14">
          <div>
            <DialogTitle className="font-display text-3xl font-light tracking-[-0.02em]">Compare products</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">Side by side, as published by each brand. Empty cells mean the brand does not list that detail.</DialogDescription>
          </div>
          <button
            type="button"
            onClick={download}
            disabled={exporting}
            className="inline-flex h-11 items-center gap-2 border border-border px-4 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-foreground active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
            data-testid="button-compare-download"
          >
            <Download className="h-4 w-4" strokeWidth={1.75} /> {exporting ? "Preparing PDF" : "Download PDF"}
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 top-0 z-20 w-40 border-b border-border bg-background p-4 text-left align-bottom md:w-48">
                  <span className="sr-only">Detail</span>
                </th>
                {products.map((product) => {
                  const image = primaryImage(product);
                  return (
                    <th key={product.slug} scope="col" className="sticky top-0 z-10 w-[220px] min-w-[180px] border-b border-l border-border bg-background p-4 text-left align-top font-normal">
                      <div className="relative h-32 bg-tile">
                        {image ? (
                          <MediaImage src={image} alt={product.name} width={400} height={300} className="absolute inset-0 h-full w-full object-contain p-4 mix-blend-multiply" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">Photo on request</span>
                        )}
                        <button type="button" onClick={() => onRemove(product.slug)} className="absolute right-1.5 top-1.5 bg-background/90 p-1 text-muted-foreground transition hover:text-foreground" aria-label={`Remove ${product.name}`}>
                          <X className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>
                      <p className="mt-3 font-display text-xl font-light leading-tight text-foreground">{product.name}</p>
                      <Link href={`/products/${product.slug}`} onClick={() => onOpenChange(false)} className="mt-1 inline-flex items-center gap-1 text-xs text-foreground underline-offset-4 transition hover:text-primary hover:underline">
                        View product <ArrowRight className="h-3 w-3" strokeWidth={2} />
                      </Link>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="even:bg-accent/40">
                  <th scope="row" className="sticky left-0 z-10 border-b border-border bg-background p-4 text-left align-top text-xs font-normal text-muted-foreground">
                    {row.label}
                  </th>
                  {products.map((product) => {
                    const value = row.render(product);
                    return (
                      <td key={product.slug} className="border-b border-l border-border p-4 align-top text-foreground">
                        {value ?? <span className="text-muted-foreground/50">&mdash;</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <p className="text-xs text-muted-foreground">A consultant confirms availability and terms for your project.</p>
          <a href={askHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 bg-primary px-5 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98]" data-testid="button-compare-whatsapp">
            <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
