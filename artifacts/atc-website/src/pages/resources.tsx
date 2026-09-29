import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download, FileText, MessageCircle, Search, X } from "lucide-react";
import { Link } from "wouter";
import { useGetPublicCatalog, type Product } from "@workspace/api-client-react";
import { EditorialLink, Reveal, RevealGroup, Section, SPRING } from "@/components/home/primitives";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { Skeleton } from "@/components/ui/skeleton";
import { apiErrorMessage } from "@/lib/api-error";
import { JOURNAL } from "@/lib/home-content";
import { productType } from "@/lib/product-media";
import { cn } from "@/lib/utils";
import { documentDownloadUrl } from "@/lib/document-files";
import { whatsappUrl } from "@/lib/whatsapp";

const GUIDE_IMAGES = ["/images/kitchen-corner.webp", "/images/showroom-hinges.webp", "/images/showroom-handles.webp", "/images/kitchen-pullout.webp"] as const;

interface DocumentRow {
  product: Product;
  type: string | null;
  documents: Array<{ label: string; fileType: string }>;
}

interface BrandGroup {
  name: string;
  slug: string;
  rows: DocumentRow[];
  count: number;
}

/** Every product with manufacturer documents, grouped by brand, most documents first. */
function groupDocuments(products: Product[]): BrandGroup[] {
  const groups = new Map<string, BrandGroup>();
  for (const product of products) {
    const documents = product.details?.downloads ?? [];
    if (documents.length === 0) continue;
    const group = groups.get(product.brandSlug) ?? { name: product.brandName, slug: product.brandSlug, rows: [], count: 0 };
    group.rows.push({ product, type: productType(product), documents });
    group.count += documents.length;
    groups.set(product.brandSlug, group);
  }
  return [...groups.values()]
    .map((group) => ({ ...group, rows: group.rows.sort((a, b) => a.product.name.localeCompare(b.product.name)) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default function Resources() {
  const { data: catalog, isLoading, error } = useGetPublicCatalog();
  const products = useMemo(() => catalog?.products ?? [], [catalog?.products]);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const groups = useMemo(() => groupDocuments(products), [products]);
  const totalDocuments = groups.reduce((sum, group) => sum + group.count, 0);
  const totalProducts = groups.reduce((sum, group) => sum + group.rows.length, 0);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visible = groups
    .filter((group) => !brand || group.slug === brand)
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) => {
        if (terms.length === 0) return true;
        const text = [row.product.name, row.product.brandName, row.type, ...row.documents.map((d) => d.label)].filter(Boolean).join(" ").toLowerCase();
        return terms.every((term) => text.includes(term));
      }),
    }))
    .filter((group) => group.rows.length > 0);
  const visibleDocuments = visible.reduce((sum, group) => sum + group.rows.reduce((s, row) => s + row.documents.length, 0), 0);

  const cadHref = whatsappUrl("Hello ATC, could you send CAD or BIM files for a product I am specifying? I will send the item number.");

  return (
    <MainLayout>
      {/* Header: what this page holds, beside the desk where the documents get checked. */}
      <section className="px-6 pb-14 pt-14 md:px-12 md:pb-20 md:pt-20" data-testid="section-resources-header">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="font-display text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.9] tracking-[-0.055em]">
              Documents and guides.
            </motion.h1>
            <motion.p initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} className="mt-8 max-w-lg text-lg leading-8 text-muted-foreground">
              Data sheets, drawings and CAD files for every product on the site, sent on request by a consultant.
            </motion.p>
            <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="mt-8">
              <EditorialLink href="/catalogues">Manufacturer catalogues and brochures</EditorialLink>
            </motion.div>
          </div>
          <motion.div initial={reduce ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }} className="relative aspect-[4/5] overflow-hidden bg-card sm:aspect-[5/4] lg:col-span-5">
            <MediaImage src="/images/showroom-certificate.webp" alt="A framed Häfele certificate in the showroom corridor" width={1200} height={1500} lazy={false} fetchPriority="high" sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 h-full w-full object-cover object-[20%_center]" />
          </motion.div>
        </div>
      </section>

      {/* The index: every manufacturer document in the catalogue, by brand, requested in one tap. */}
      <section className="border-t border-border px-6 py-16 md:px-12 md:py-24" data-testid="section-document-index">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className="font-display text-4xl font-medium leading-[0.95] tracking-[-0.045em] md:text-6xl">Manufacturer documents.</h2>
            {!isLoading && !error && (
              <p className="text-sm text-muted-foreground" data-testid="text-document-total">
                <span className="font-mono text-base tabular-nums text-foreground">{totalDocuments}</span> documents across <span className="font-mono text-base tabular-nums text-foreground">{totalProducts}</span> products
              </p>
            )}
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-center">
            <label className="relative block lg:col-span-5">
              <span className="sr-only">Search documents</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Product, brand or document"
                autoComplete="off"
                className="h-12 w-full border border-border bg-background pl-11 pr-11 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary [&::-webkit-search-cancel-button]:hidden"
                data-testid="input-document-search"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              )}
            </label>
            {groups.length > 1 && (
              <nav aria-label="Brands" className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] md:mx-0 md:px-0 lg:col-span-7 lg:justify-self-end [&::-webkit-scrollbar]:hidden">
                <LayoutGroup id="document-brands">
                  <ul className="flex gap-6">
                    {[{ slug: null as string | null, name: "All brands", count: totalDocuments }, ...groups.map((g) => ({ slug: g.slug as string | null, name: g.name, count: g.count }))].map((tab) => {
                      const active = tab.slug === brand;
                      return (
                        <li key={tab.name} className="relative shrink-0">
                          <button type="button" onClick={() => setBrand(tab.slug)} aria-pressed={active} className={cn("flex h-12 items-baseline gap-2 whitespace-nowrap text-sm transition-colors", active ? "text-foreground" : "text-muted-foreground hover:text-foreground")} data-testid={`filter-doc-brand-${tab.slug ?? "all"}`}>
                            {tab.name}
                            <span className="font-mono text-[11px] tabular-nums opacity-70">{tab.count}</span>
                          </button>
                          {active && <motion.span layoutId="doc-brand-indicator" className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" transition={SPRING} aria-hidden />}
                        </li>
                      );
                    })}
                  </ul>
                </LayoutGroup>
              </nav>
            )}
          </div>

          <div className="mt-10">
            {isLoading ? (
              <ul className="border-t border-border">
                {Array.from({ length: 6 }).map((_, i) => (
                    <li key={i} className="grid gap-4 border-b border-border py-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_9.5rem]">
                    <Skeleton className="h-5 w-2/3 rounded-none" />
                    <Skeleton className="h-5 w-1/2 rounded-none" />
                    <Skeleton className="h-5 w-20 rounded-none md:justify-self-end" />
                  </li>
                ))}
              </ul>
            ) : error ? (
              <div className="border border-border px-6 py-16 text-center">
                <p className="font-display text-2xl text-foreground">{apiErrorMessage(error, "The document index could not be loaded.")}</p>
                <p className="mt-3 text-sm text-muted-foreground">Refresh the page, or message us with the item number and we will send the sheet.</p>
              </div>
            ) : visible.length === 0 ? (
              <div className="grid gap-8 border border-border px-6 py-14 md:grid-cols-12 md:px-10">
                <div className="md:col-span-7">
                  <p className="font-display text-3xl font-medium leading-[0.98] tracking-[-0.03em] md:text-4xl">Not indexed yet.</p>
                  <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">This index covers the products on the site. For anything else in a brand's range, send the item no. and we will find the sheet.</p>
                </div>
                <div className="flex flex-col items-start gap-4 md:col-span-5 md:justify-end">
                  <a href={whatsappUrl(`Hello ATC, could you send the technical documents for "${query.trim()}"?`)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2.5 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-foreground hover:text-background active:scale-[0.98]">
                    <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Ask on WhatsApp
                  </a>
                  <button type="button" onClick={() => { setQuery(""); setBrand(null); }} className="text-xs text-foreground underline-offset-4 hover:underline">
                    Clear search
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-14" data-testid="document-index">
                <p className="sr-only" aria-live="polite">{visibleDocuments} documents shown</p>
                {visible.map((group) => (
                  <RevealGroup key={group.slug} as="div" data-testid={`doc-group-${group.slug}`}>
                    <div className="flex items-baseline justify-between gap-6 border-b border-foreground pb-3">
                      <Link href={`/brands/${group.slug}`} className="font-display text-2xl font-medium tracking-[-0.03em] transition-colors hover:text-primary md:text-3xl">{group.name}</Link>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">{group.rows.reduce((s, r) => s + r.documents.length, 0)}</span>
                    </div>
                    <ul>
                      <AnimatePresence initial={false}>
                        {group.rows.map((row) => {
                          const file = documentDownloadUrl(row.product.details?.sourceUrl);
                          return (
                          <motion.li
                            key={row.product.slug}
                            layout={!reduce}
                            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: SPRING } }}
                            exit={reduce ? undefined : { opacity: 0 }}
                            className="group grid gap-3 border-b border-border py-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_9.5rem] md:items-center md:gap-6"
                            data-testid={`doc-row-${row.product.slug}`}
                          >
                            <Link href={`/products/${row.product.slug}`} className="min-w-0">
                              <span className="block truncate font-display text-lg font-medium leading-tight tracking-[-0.02em] text-foreground transition-colors group-hover:text-primary md:text-xl">{row.product.name}</span>
                              {row.type && <span className="mt-0.5 block text-xs text-muted-foreground">{row.type}</span>}
                            </Link>
                            <ul className="flex flex-wrap gap-2" aria-label={`Documents for ${row.product.name}`}>
                              {row.documents.map((document, i) => (
                                <li key={`${document.label}-${i}`} className="inline-flex h-8 items-center gap-1.5 border border-border px-2.5 text-xs text-foreground">
                                  <FileText className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} aria-hidden />
                                  {document.label}
                                  <span className="font-mono text-[10px] text-muted-foreground">{document.fileType}</span>
                                </li>
                              ))}
                            </ul>
                            {file && (
                              <a
                                href={file}
                                download
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-9 w-fit items-center gap-1.5 bg-foreground px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-background transition-colors hover:bg-primary md:justify-self-end"
                                data-testid={`link-download-${row.product.slug}`}
                              >
                                <Download className="h-3.5 w-3.5" strokeWidth={2} />
                                Download
                              </a>
                            )}
                          </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ul>
                  </RevealGroup>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Guides: written by the consultants, published when finished. Until then a consultant answers the question directly. */}
      <Section tone="panel">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-4xl font-medium leading-[0.95] tracking-[-0.045em] md:text-6xl">Guides in preparation.</h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">Four guides from the consultants who install these systems. Each is published here when it is finished. The question does not have to wait.</p>
        </Reveal>
        <RevealGroup as="ul" className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2" aria-label="Guides in preparation">
          {JOURNAL.map((entry, index) => (
            <motion.li key={entry.title} variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: SPRING } }} className={cn("flex bg-background", index % 3 === 0 ? "flex-col" : "flex-col md:flex-row-reverse")} data-testid={`guide-${index}`}>
              <div className={cn("relative overflow-hidden bg-card", index % 3 === 0 ? "aspect-[16/9]" : "aspect-[16/9] md:aspect-auto md:w-2/5")}>
                <MediaImage src={GUIDE_IMAGES[index] ?? GUIDE_IMAGES[0]} alt="" width={900} height={506} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-8 p-6 md:p-8">
                <div>
                  <p className="text-xs text-muted-foreground">{entry.category}</p>
                  <h3 className="mt-2 font-display text-2xl font-medium leading-[1.02] tracking-[-0.03em] md:text-3xl">{entry.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{entry.summary}</p>
                </div>
                <a href={whatsappUrl(`Hello ATC, I have a question about ${entry.title.toLowerCase()}.`)} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-foreground" data-testid={`link-guide-ask-${index}`}>
                  Ask a consultant <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
                </a>
              </div>
            </motion.li>
          ))}
        </RevealGroup>
      </Section>

      {/* CAD and BIM: the files come from the manufacturer, requested per item. */}
      <Section dark className="py-20 md:py-28">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8">
            <p className="max-w-3xl font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">CAD and BIM files come from the manufacturer, with the current revision.</p>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">Send the item number and we request the file on your behalf. Most arrive the same working day.</p>
          </Reveal>
          <Reveal className="md:col-span-4 md:justify-self-end" delay={0.1}>
            <a href={cadHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:translate-y-px" data-testid="link-request-cad">
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Request CAD or BIM files
            </a>
          </Reveal>
        </div>
        <Reveal className="mt-12" delay={0.15}>
          <EditorialLink href="/catalog" light>Find the item no. in Products</EditorialLink>
        </Reveal>
      </Section>
    </MainLayout>
  );
}
