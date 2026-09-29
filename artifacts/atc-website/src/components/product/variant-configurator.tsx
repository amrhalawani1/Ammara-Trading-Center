import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, MessageCircle } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { PROJECT_TYPES, TIMINGS } from "@/lib/inquiry-options";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export interface ConfiguratorVariant {
  code: string;
  label: string;
  kind: "finish" | "size" | "model" | "colour";
  articleNumber?: string | null;
  attributes?: Record<string, string>;
  image?: string | null;
}

const KIND_HEADING: Record<ConfiguratorVariant["kind"], string> = {
  finish: "Finishes",
  size: "Sizes",
  model: "Models",
  colour: "Light colour",
};

const COLLAPSED = 8;

interface VariantConfiguratorProps {
  productName: string;
  brandName: string;
  reference: string;
  designer?: string | null;
  designLine?: string | null;
  variants: ConfiguratorVariant[];
  selected: number;
  onSelect: (index: number) => void;
  images: string[];
  activeImage: number;
  onImageChange: (index: number) => void;
  documentsHref: string;
  /** The "add to project shortlist" control, rendered under the configure button. */
  shortlist?: ReactNode;
}


const fieldClass =
  "h-11 w-full border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary";

/**
 * DND's finishes block: the render on the left, and on the right the name
 * (lowercase), designer, a "design:" line, then finishes as a vertical list of
 * CODE + name. "Configure" opens ATC's version of DND's configurator: a short
 * specification that lands in WhatsApp, never a price.
 */
export function VariantConfigurator(props: VariantConfiguratorProps) {
  const { productName, brandName, reference, designer, designLine, variants, selected, onSelect, images, activeImage, onImageChange, documentsHref, shortlist } = props;
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const [quantity, setQuantity] = useState("");
  const [projectType, setProjectType] = useState<(typeof PROJECT_TYPES)[number]>("Residential");
  const [timing, setTiming] = useState<(typeof TIMINGS)[number]>("1 to 3 months");
  const [notes, setNotes] = useState("");

  const variant = variants[selected] ?? null;
  const kind = variant?.kind ?? variants[0]?.kind ?? "finish";
  const articleNumber = variant?.articleNumber ?? null;
  const visible = showAll ? variants : variants.slice(0, COLLAPSED);

  /**
   * Some ranges publish the same finishes twice, once per mounting option - Dnd lists eight
   * finishes on the standard rose and the same eight on the concealed Unico rose. Without the
   * grouping the list reads as sixteen finishes with every name duplicated.
   */
  const sections = useMemo(() => {
    const out: { group: string | null; items: ConfiguratorVariant[] }[] = [];
    for (const item of visible) {
      const group = item.attributes?.group ?? null;
      const last = out[out.length - 1];
      if (last && last.group === group) last.items.push(item);
      else out.push({ group, items: [item] });
    }
    return out;
  }, [visible]);
  const showGroups = new Set(variants.map((v) => v.attributes?.group ?? "")).size > 1;
  const message = useMemo(() => {
    const lines = [
      `Hello ATC, I would like to enquire about the ${productName} by ${brandName}.`,
      articleNumber ? `Item no. ${articleNumber}` : `ATC ref. ${reference}`,
      variant ? `${KIND_HEADING[variant.kind].replace(/s$/, "")}: ${variant.code} - ${variant.label}` : null,
      quantity.trim() ? `Quantity: ${quantity.trim()}` : null,
      `Project: ${projectType}`,
      `Timing: ${timing}`,
      notes.trim() ? `Notes: ${notes.trim()}` : null,
    ];
    return lines.filter(Boolean).join("\n");
  }, [productName, brandName, reference, articleNumber, variant, quantity, projectType, timing, notes]);

  const quantityInvalid = quantity.trim() !== "" && !/^\d+$/.test(quantity.trim());

  return (
    <div>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <ProductGallery images={images} alt={`${productName}${variant ? `, ${variant.label}` : ""}`} activeIndex={activeImage} onChange={onImageChange} />
        </div>

        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:col-start-9 lg:max-h-[calc(100dvh-8.5rem)] lg:self-start lg:overflow-y-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{brandName}</p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-[0.95] tracking-[-0.03em] md:text-5xl">{productName}</h1>
          {designer && <p className="mt-3 text-sm text-muted-foreground">{designer}</p>}
          {designLine && (
            <p className="mt-6 font-mono text-[11px] tracking-[0.18em] text-muted-foreground">
              design: <span className="text-foreground">{designLine}</span>
            </p>
          )}

          {variants.length > 0 && (
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">
                {KIND_HEADING[kind]} <span className="font-mono tabular-nums">{variants.length}</span>
              </p>
              {sections.map((section, sectionIndex) => (
                <div key={`${section.group ?? "all"}-${sectionIndex}`}>
                  {showGroups && section.group && (
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{section.group}</p>
                  )}
              <ul className="mt-3 divide-y divide-border border-y border-border" role="radiogroup" aria-label={[KIND_HEADING[kind], section.group].filter(Boolean).join(" - ")}>
                {section.items.map((item) => {
                  const index = variants.indexOf(item);
                  const active = index === selected;
                  const attrs = Object.entries(item.attributes ?? {}).filter(([key]) => key !== "group").map(([, value]) => value);
                  return (
                    <li key={`${item.code}-${index}`}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onSelect(index)}
                        className={cn("group relative flex w-full items-baseline gap-4 py-3 pl-3 text-left transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
                        data-testid={`row-variant-${index}`}
                      >
                        <span className="w-16 shrink-0 font-mono text-[11px] tracking-[0.12em]">{item.code}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm">{item.label}</span>
                          {attrs.length > 0 && <span className="mt-0.5 block text-[11px] text-muted-foreground">{attrs.join(" · ")}</span>}
                        </span>
                        {item.image && <span className="h-1.5 w-1.5 shrink-0 self-center rounded-full bg-foreground/30" title="Image available" aria-hidden />}
                        {active && <motion.span layoutId="variant-row-marker" className="absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-primary" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
                </div>
              ))}
              {variants.length > COLLAPSED && (
                <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-3 text-xs text-foreground transition hover:text-primary">
                  {showAll ? "Show fewer" : `Show all ${variants.length}`}
                </button>
              )}
              {articleNumber && (
                <p className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  Item no.
                  <span className="font-mono tracking-[0.1em] text-foreground" data-testid="text-article-number">{articleNumber}</span>
                  <button
                    type="button"
                    onClick={async () => { try { await navigator.clipboard.writeText(articleNumber); setCopied(true); } catch { /* unavailable */ } }}
                    className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-foreground"
                    aria-label="Copy item number"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
                  </button>
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 text-xs">
            <a href="#technical" className="inline-flex items-center gap-1.5 text-foreground transition hover:text-primary">
              Drawings and technical info <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
            <a href={documentsHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-foreground transition hover:text-primary">
              Catalogue sheet <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="configurator"
            className={cn(
              "mt-8 inline-flex h-12 w-full items-center justify-center border px-6 text-xs font-semibold uppercase tracking-[0.14em] transition active:scale-[0.98] sm:w-auto",
              open ? "border-foreground bg-foreground text-background" : "border-foreground text-foreground hover:bg-foreground hover:text-background",
            )}
            data-testid="button-configure"
          >
            {open ? "Close" : `Enquire about ${productName}`}
          </button>
          {shortlist}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="configurator"
            key="configurator"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 24 }}
            className="overflow-hidden"
          >
            <form
              className="mt-12 grid gap-10 border-t border-border pt-10 lg:grid-cols-12 lg:gap-14"
              onSubmit={(event) => {
                event.preventDefault();
                if (!quantityInvalid) window.open(whatsappUrl(message), "_blank", "noreferrer");
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cfg-variant" className="text-xs text-muted-foreground">{KIND_HEADING[kind].replace(/s$/, "")}</label>
                  <select id="cfg-variant" value={selected} onChange={(event) => onSelect(Number(event.target.value))} className={fieldClass} disabled={variants.length === 0}>
                    {variants.length === 0 && <option>Standard</option>}
                    {variants.map((item, index) => (
                      <option key={`${item.code}-${index}`} value={index}>{item.code} - {item.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="cfg-quantity" className="text-xs text-muted-foreground">Quantity</label>
                  <input id="cfg-quantity" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="e.g. 48" className={cn(fieldClass, quantityInvalid && "border-primary")} aria-invalid={quantityInvalid} aria-describedby="cfg-quantity-help" />
                  <p id="cfg-quantity-help" className={cn("text-xs", quantityInvalid ? "text-primary" : "text-muted-foreground")}>
                    {quantityInvalid ? "Whole numbers only." : "Pieces, sets, or doors. Leave blank if you are still counting."}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="cfg-project" className="text-xs text-muted-foreground">Project type</label>
                  <select id="cfg-project" value={projectType} onChange={(event) => setProjectType(event.target.value as (typeof PROJECT_TYPES)[number])} className={fieldClass}>
                    {PROJECT_TYPES.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="cfg-timing" className="text-xs text-muted-foreground">When do you need it?</label>
                  <select id="cfg-timing" value={timing} onChange={(event) => setTiming(event.target.value as (typeof TIMINGS)[number])} className={fieldClass}>
                    {TIMINGS.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="cfg-notes" className="text-xs text-muted-foreground">Notes</label>
                  <textarea id="cfg-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Door thickness, rose type, matching accessories..." className={cn(fieldClass, "h-auto py-2.5")} />
                </div>
              </div>

              <div className="lg:col-span-5">
                <p className="text-xs text-muted-foreground">Your message</p>
                <pre className="mt-2 whitespace-pre-wrap border border-border bg-accent p-4 font-mono text-[12px] leading-6 text-foreground" data-testid="text-configurator-preview">{message}</pre>
                <button
                  type="submit"
                  disabled={quantityInvalid}
                  className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2.5 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  data-testid="button-send-configuration"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Send on WhatsApp
                </button>
                <p className="mt-3 text-xs leading-5 text-muted-foreground">Opens WhatsApp with this message ready to send. A consultant replies with availability for your project.</p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
