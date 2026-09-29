import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Award, Check, ChevronDown, Copy, FileText, MessageCircle, Sparkles } from "lucide-react";
import { Link, useLocation, useParams, useSearch } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { useGetPublicCatalog, useGetPublicProduct } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/pages/not-found";
import { AddToShortlist } from "@/components/product/add-to-shortlist";
import { DesignerBlock } from "@/components/product/designer-block";
import { EditorialChapters } from "@/components/product/editorial-chapters";
import { FeatureList } from "@/components/product/feature-list";
import { ProductAnchorNav, type AnchorItem } from "@/components/product/product-anchor-nav";
import { ProductFacts } from "@/components/product/product-facts";
import { ProductGallery } from "@/components/product/product-gallery";
import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { RelatedProducts } from "@/components/product/related-products";
import { SpecTable } from "@/components/product/spec-table";
import { StickyInquiryBar } from "@/components/product/sticky-inquiry-bar";
import { ShowroomMap } from "@/components/showroom/showroom-map";
import { useShortlists } from "@/hooks/use-shortlists";
import { useToast } from "@/hooks/use-toast";
import { track } from "@/lib/analytics";
import { designerOf } from "@/lib/catalog-filters";
import { designerPath, sameDesigner } from "@/lib/designers";
import { assetUrl } from "@/lib/env";
import { FinishCodes, type FinishChoice } from "@/components/product/finish-selector";
import { noteGuestSave } from "@/lib/guest-save";
import { primaryImage, productType, variantImage } from "@/lib/product-media";
import { SHOWROOMS } from "@/lib/showrooms";
import { solutionByName } from "@/lib/solutions";
import { productInquiryMessage, whatsappUrl, type ProductReference } from "@/lib/whatsapp";
import type { ConfiguratorVariant } from "@/components/product/variant-configurator";

const RECENT_KEY = "atc-recent-products";
const KIND_LABEL: Record<ConfiguratorVariant["kind"], string> = {
  finish: "Finish",
  size: "Size",
  model: "Model",
  colour: "Colour",
};

function normaliseName(value: string) {
  return value.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function rememberProduct(slug: string) {
  try {
    const current = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as unknown;
    const slugs = Array.isArray(current) ? current.filter((item): item is string => typeof item === "string") : [];
    localStorage.setItem(RECENT_KEY, JSON.stringify([slug, ...slugs.filter((item) => item !== slug)].slice(0, 8)));
  } catch {
    /* private mode */
  }
}

function recentSlugs(except: string): string[] {
  try {
    const current = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as unknown;
    const slugs = Array.isArray(current) ? current.filter((item): item is string => typeof item === "string") : [];
    return slugs.filter((item) => item !== except).slice(0, 6);
  } catch {
    return [];
  }
}

/** Centimetres, when the value actually states a length. */
function parseCm(value: string): number | null {
  const mm = value.match(/(\d+(?:\.\d+)?)\s*mm\b/i);
  if (mm) return Number(mm[1]) / 10;
  const cm = value.match(/(\d+(?:\.\d+)?)\s*cm\b/i);
  if (cm) return Number(cm[1]);
  return null;
}

function collectionKey(product: Pick<Product, "details" | "family">) {
  return (product.details?.collection ?? product.family ?? "").trim().toLowerCase();
}

function Fold({ id, title, children, dark = false }: { id: string; title: string; children: ReactNode; dark?: boolean }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const keepOpen = () => {
      if (media.matches && detailsRef.current) detailsRef.current.open = true;
    };
    keepOpen();
    media.addEventListener("change", keepOpen);
    return () => media.removeEventListener("change", keepOpen);
  }, []);
  return (
    <section id={id} className={`scroll-mt-28 border-t border-border lg:scroll-mt-32${dark ? " dark bg-background text-foreground" : ""}`}>
      <details
        ref={detailsRef}
        open
        className="group"
        onToggle={(event) => {
          const el = event.currentTarget;
          if (window.matchMedia("(min-width: 1024px)").matches && !el.open) el.open = true;
        }}
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-medium lg:hidden [&::-webkit-details-marker]:hidden">
          {title}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="container mx-auto px-4 pb-12 pt-2 lg:py-16">{children}</div>
      </details>
    </section>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const search = useSearch();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { activeListId, addItem } = useShortlists();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [copied, setCopied] = useState(false);
  const [quoted, setQuoted] = useState(false);
  const [cabinetCm, setCabinetCm] = useState("");
  const [drawingOpen, setDrawingOpen] = useState(false);

  const { data: product, isLoading: isProductLoading, error: productError } = useGetPublicProduct(slug);
  const { data: catalog, isLoading: isCatalogLoading } = useGetPublicCatalog();
  const brand = catalog?.brands.find((item) => item.slug === product?.brandSlug);

  const galleryImages = useMemo(() => {
    const media = (product?.details?.media ?? []).map((item) => item.src);
    const legacy = [product?.image, ...(product?.images ?? [])];
    return Array.from(new Set([...media, ...legacy].filter((image): image is string => Boolean(image))));
  }, [product?.details?.media, product?.image, product?.images]);

  const variants: ConfiguratorVariant[] = useMemo(() => {
    if (!product) return [];
    if (product.details?.variants?.length) return product.details.variants;
    return (product.finishes ?? []).map((name) => ({
      code: name,
      label: name,
      kind: "finish" as const,
      articleNumber: null,
      attributes: {},
      image: null,
    }));
  }, [product]);

  useEffect(() => {
    setActiveImage(0);
    setCabinetCm("");
    setQuoted(false);
    setDrawingOpen(false);
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    const code = new URLSearchParams(search).get("v");
    const index = code ? variants.findIndex((item) => item.code === code) : 0;
    const next = index >= 0 ? index : 0;
    setSelectedVariant(next);
    const image = variantImage(product, variants[next]);
    const at = image ? galleryImages.indexOf(image) : -1;
    if (at >= 0) setActiveImage(at);
  }, [product, search, variants, galleryImages]);

  useEffect(() => {
    if (!slug) return;
    rememberProduct(slug);
    track("view_item", { item_id: slug });
  }, [slug]);

  useEffect(() => {
    if (!product || !brand) return;
    const previous = document.title;
    document.title = `${product.name} · ${brand.name} · Amara Trading Center`;
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = `${window.location.origin}${assetUrl(`/products/${product.slug}`)}`;
    document.head.appendChild(link);
    return () => {
      document.title = previous;
      link.remove();
    };
  }, [product, brand]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!quoted) return;
    const timer = window.setTimeout(() => setQuoted(false), 1800);
    return () => window.clearTimeout(timer);
  }, [quoted]);

  const selectVariant = useCallback(
    (index: number) => {
      const code = variants[index]?.code;
      const params = new URLSearchParams(search);
      if (code) params.set("v", code);
      else params.delete("v");
      const qs = params.toString();
      const path = location.split("?")[0] ?? location;
      setLocation(qs ? `${path}?${qs}` : path, { replace: true });
      if (code) track("select_variant", { item_id: slug, item_variant: code });
    },
    [variants, search, location, setLocation, slug],
  );

  const viewed = useMemo(() => {
    if (!catalog || !product) return [];
    return recentSlugs(product.slug)
      .map((item) => catalog.products.find((candidate) => candidate.slug === item))
      .filter((item): item is Product => Boolean(item));
  }, [catalog, product]);

  if (isProductLoading || isCatalogLoading) {
    return (
      <MainLayout>
        <section className="container mx-auto grid gap-8 px-4 pb-10 pt-6 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="flex flex-col gap-4 pt-6">
            <Skeleton className="h-4 w-24 rounded-none" />
            <Skeleton className="h-12 w-4/5 rounded-none" />
            <Skeleton className="h-4 w-40 rounded-none" />
            <Skeleton className="mt-6 h-11 w-full rounded-none" />
          </div>
        </section>
      </MainLayout>
    );
  }

  if (productError || !product || !brand) return <NotFound />;

  const editorial = product.editorial ?? null;
  const details = product.details ?? null;
  const variant = variants[selectedVariant] ?? null;
  const catalogueVariant = Boolean(details?.variants?.length);
  const modelCode = variant?.articleNumber || product.sku || (catalogueVariant ? variant?.code : null) || null;
  const productReference: ProductReference | null = modelCode
    ? { value: modelCode, kind: modelCode === product.sku && !variant?.articleNumber ? "atc" : "item" }
    : null;
  const specs = product.specs ?? [];
  const technicalSpecs = [
    ...specs,
    ...(product.material ? [{ label: "Material", value: product.material, group: "Material" as string | null }] : []),
    ...(product.dimensions ? [{ label: "Dimensions", value: product.dimensions, group: "Dimensions" as string | null }] : []),
  ].filter((spec, index, all) => all.findIndex((other) => other.label === spec.label) === index);
  const installSpecs = technicalSpecs.filter((spec) => spec.group === "Installation" || /cut-?\s*out|base cabinet|door thickness|drilling/i.test(spec.label));
  const fitSpec = installSpecs.find((spec) => parseCm(spec.value) != null) ?? installSpecs.find((spec) => /cut-?\s*out|width|base|thickness|drilling|cabinet/i.test(spec.label)) ?? null;
  const fitCm = fitSpec ? parseCm(fitSpec.value) : null;
  const features = details?.features ?? [];
  const documents = details?.downloads?.length
    ? details.downloads.map((item) => ({ label: item.label, note: item.fileType }))
    : [
        { label: "Technical drawing", note: "2D, PDF" },
        { label: "Product data sheet", note: "PDF" },
        { label: "CAD / BIM files", note: "DWG, STEP" },
      ];
  const badges = details?.badges ?? [];
  const showNew = badges.some((badge) => /new/i.test(badge));
  const showAward = badges.some((badge) => /award|winner|premio/i.test(badge));
  const onDisplay = badges.some((badge) => /showroom|on display/i.test(badge));
  const solution = solutionByName(product.category);
  const identity = [product.dimensions, product.material, productType(product)].filter((item): item is string => Boolean(item));
  const designerName = designerOf(product);
  const designerBio = editorial?.designer && designerName && sameDesigner(editorial.designer.name, designerName) ? editorial.designer.bio : "";
  const pageUrl = `${window.location.origin}${assetUrl(`/products/${product.slug}`)}${variant ? `?v=${encodeURIComponent(variant.code)}` : ""}`;
  const canonical = `${window.location.origin}${assetUrl(`/products/${product.slug}`)}`;
  const inquiryHref = whatsappUrl(
    productInquiryMessage({
      name: product.name,
      brandName: brand.name,
      reference: productReference,
      finish: variant?.kind === "finish" || variant?.kind === "colour" ? variant.label : null,
      variantCode: variant?.code ?? null,
      pageUrl,
    }),
  );
  const documentsHref = (doc: string) =>
    whatsappUrl(
      `${productInquiryMessage({ name: product.name, brandName: brand.name, reference: productReference, variantCode: variant?.code ?? null, pageUrl }, "documents")}\nDocument: ${doc}`,
    );

  const quoteItem = {
    key: variant ? `${product.slug}::${variant.code}` : product.slug,
    slug: product.slug,
    name: product.name,
    brandName: brand.name,
    reference: modelCode ?? product.name,
    variant: variant ? `${variant.code} - ${variant.label}` : null,
    image: variant?.image ?? primaryImage(product),
  };

  const siblings = (catalog?.products ?? []).filter(
    (item) => item.slug !== product.slug && item.brandSlug === product.brandSlug && collectionKey(item) !== "" && collectionKey(item) === collectionKey(product),
  );
  const siblingSlugs = new Set(siblings.map((item) => item.slug));
  const others = (catalog?.products ?? []).filter((item) => item.slug !== product.slug);
  const named = new Set((details?.related ?? []).map(normaliseName));
  const completes = others.filter((item) => named.has(normaliseName(item.name)) && !siblingSlugs.has(item.slug)).slice(0, 6);
  const sameCategory = others.filter((item) => !siblingSlugs.has(item.slug) && !completes.includes(item) && item.category === product.category).slice(0, 6);
  const look = completes.length > 0 ? completes : sameCategory;

  const cabinet = Number(cabinetCm);
  const fitResult = fitCm != null && cabinetCm.trim() !== "" && Number.isFinite(cabinet)
    ? cabinet + 0.05 >= fitCm
      ? "fits"
      : "tight"
    : null;

  const copyCode = async () => {
    if (!modelCode) return;
    try {
      await navigator.clipboard.writeText(modelCode);
      setCopied(true);
      toast({ title: "Code copied" });
    } catch {
      toast({ title: "Could not copy the code" });
    }
  };

  const addQuote = () => {
    addItem(activeListId, quoteItem);
    noteGuestSave();
    track("add_to_quote", { item_id: product.slug, item_variant: variant?.code });
    setQuoted(true);
  };

  const checkFit = () => {
    if (fitResult) track("fit_check", { item_id: product.slug, result: fitResult });
  };

  const groups = variants.reduce<{ kind: ConfiguratorVariant["kind"]; items: { variant: ConfiguratorVariant; index: number }[] }[]>((acc, item, index) => {
    const last = acc[acc.length - 1];
    if (last && last.kind === item.kind) last.items.push({ variant: item, index });
    else acc.push({ kind: item.kind, items: [{ variant: item, index }] });
    return acc;
  }, []);

  const anchors: AnchorItem[] = [
    { id: "overview", label: "Overview" },
    { id: "specifications", label: "Specifications" },
    { id: "drawing", label: "Drawing" },
    ...(installSpecs.length > 0 || product.installationNotes ? [{ id: "installation", label: "Installation" }] : []),
    { id: "downloads", label: "Downloads" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        sku: modelCode ?? undefined,
        description: product.description,
        image: galleryImages.map((src) => (src.startsWith("http") ? src : `${window.location.origin}${assetUrl(src)}`)),
        brand: { "@type": "Brand", name: brand.name },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${window.location.origin}${assetUrl("/")}` },
          { "@type": "ListItem", position: 2, name: product.category, item: `${window.location.origin}${assetUrl(solution ? `/catalog?solution=${solution.slug}` : "/catalog")}` },
          { "@type": "ListItem", position: 3, name: product.name, item: canonical },
        ],
      },
    ],
  };

  const flagship = SHOWROOMS[0]!;

  return (
    <MainLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pb-28 lg:pb-0">
        <nav aria-label="Breadcrumb" className="border-b border-border">
          <ol className="container mx-auto flex gap-2 overflow-x-auto whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden>/</li>
            <li>
              <Link href={solution ? `/catalog?solution=${solution.slug}` : "/catalog"} className="hover:text-foreground">{product.category}</Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <section className="container mx-auto grid gap-8 px-4 py-6 lg:grid-cols-12 lg:gap-12 lg:py-10">
          <div className="lg:col-span-7">
            <ProductGallery
              images={galleryImages}
              alt={`${product.name}${variant ? `, ${variant.label}` : ""}`}
              activeIndex={activeImage}
              onChange={setActiveImage}
              badge={showNew ? "New" : undefined}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:col-span-5 lg:max-h-[calc(100dvh-7rem)] lg:self-start lg:overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <Link href={`/brands/${brand.slug}`} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary hover:text-foreground">
                {brand.name}
              </Link>
              <span className="flex items-center gap-2">
                {showAward && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
                    <Award className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden /> Award
                  </span>
                )}
                {onDisplay && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden /> On display
                  </span>
                )}
              </span>
            </div>

            <h1 className="mt-3 font-display text-4xl font-medium leading-[0.95] tracking-[-0.03em] md:text-5xl">{product.name}</h1>
            {modelCode && (
              <p className="mt-4 flex items-center gap-2">
                <span className="font-mono text-sm tracking-[0.12em] text-foreground" data-testid="text-reference">{modelCode}</span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={copied ? "Code copied" : "Copy model code"}
                  data-testid="button-copy-code"
                >
                  {copied ? <Check className="h-4 w-4 text-primary" strokeWidth={2} /> : <Copy className="h-4 w-4" strokeWidth={1.5} />}
                </button>
              </p>
            )}
            {identity.length > 0 && <p className="mt-2 text-sm text-muted-foreground">{identity.join(" · ")}</p>}
            {designerName && (
              <p className="mt-3 text-sm text-muted-foreground">
                Designed by{" "}
                <Link href={designerPath(brand.slug, designerName)} className="text-foreground underline-offset-4 hover:text-primary hover:underline" data-testid="link-designer">
                  {designerName}
                </Link>
              </p>
            )}

            <p className="mt-6 font-display text-3xl font-light tracking-[-0.02em]" data-testid="text-price">Price on request</p>
            {onDisplay && <p className="mt-2 text-sm text-foreground">On display in the showroom</p>}

            {groups.map((group) => {
              const swatch = group.kind === "finish" || group.kind === "colour";
              const choice = ({ variant, index }: (typeof group.items)[number]): FinishChoice => ({ code: variant.code, label: variant.label, index });
              const parents = group.items.filter((item) => item.variant.attributes?.group !== "Inserts");
              const inserts = group.items.filter((item) => item.variant.attributes?.group === "Inserts");
              const current = group.items.find((item) => item.index === selectedVariant);
              const parentCode = current?.variant.code.split(/[+-]/)[0];
              const parentSelected = parents.some((item) => item.index === selectedVariant)
                ? selectedVariant
                : (parents.find((item) => item.variant.code === parentCode)?.index ?? -1);
              const visibleInserts = parentCode ? inserts.filter((item) => item.variant.code.startsWith(`${parentCode}+`) || item.variant.code.startsWith(`${parentCode}-`)) : [];
              return (
                <fieldset key={group.kind} className={swatch ? "mt-10" : "mt-6"}>
                  <legend className={swatch ? "sr-only" : "text-xs font-medium text-muted-foreground"}>{KIND_LABEL[group.kind]}</legend>
                  {swatch ? (
                    <>
                      <FinishCodes items={(parents.length > 0 ? parents : group.items).map(choice)} selected={selectedVariant} marked={parents.length > 0 ? parentSelected : selectedVariant} onSelect={selectVariant} label={KIND_LABEL[group.kind]} />
                      {visibleInserts.length > 0 && <FinishCodes items={visibleInserts.map(choice)} selected={selectedVariant} onSelect={selectVariant} label="Insert" className="mt-5" />}
                    </>
                  ) : (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group.items.map(({ variant: item, index }) => {
                        const active = index === selectedVariant;
                        return (
                          <label
                            key={`${item.code}-${index}`}
                            className={`inline-flex min-h-11 cursor-pointer items-center gap-2 border px-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${active ? "border-foreground" : "border-border"}`}
                          >
                            <input type="radio" name="product-variant" className="sr-only" checked={active} onChange={() => selectVariant(index)} />
                            <span>{item.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </fieldset>
              );
            })}

            {(fitSpec || product.installationNotes) && (
              <a href="#installation" className="mt-6 flex min-h-11 items-center justify-between gap-4 border border-border px-4 py-3 text-sm hover:border-foreground">
                <span>
                  <span className="block text-xs text-muted-foreground">Will it fit?</span>
                  <span className="mt-1 block text-foreground">{fitSpec ? `${fitSpec.label} ${fitSpec.value}` : "Installation notes"}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              </a>
            )}

            <div className="mt-6">
              <AddToShortlist
                item={quoteItem}
                trailing={
                  <a
                    href={inquiryHref}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => track("whatsapp_click", { item_id: product.slug })}
                    className="inline-flex h-11 w-full items-center justify-center gap-2 border border-border px-3 text-sm font-medium text-foreground hover:border-foreground"
                    data-testid="button-whatsapp"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> WhatsApp us
                  </a>
                }
              />
            </div>
          </div>
        </section>

        {technicalSpecs.length > 0 && (
          <div className="container mx-auto px-4">
            <ProductFacts specs={technicalSpecs} />
          </div>
        )}

        <div className="mt-8 hidden lg:block">
          <ProductAnchorNav items={anchors} />
        </div>

        <Fold id="overview" title="Overview">
          {features.length > 0 ? (
            <FeatureList features={features.slice(0, 3)} />
          ) : (
            <EditorialChapters statement={editorial?.statement ?? product.description} body={editorial?.statement ? product.description : undefined} awards={editorial?.awards ?? []} chapters={(editorial?.chapters ?? []).slice(0, 2)} />
          )}
          {brand.summary && <p className="mt-10 max-w-2xl text-sm leading-7 text-muted-foreground">{brand.summary}</p>}
          {(editorial?.awards?.length ?? 0) > 0 && features.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {editorial!.awards!.map((award) => (
                <li key={award} className="border border-border px-3 py-1.5 text-xs">{award}</li>
              ))}
            </ul>
          )}
          {designerName && (
            <div className="mt-12">
              <DesignerBlock name={designerName} bio={designerBio} href={designerPath(brand.slug, designerName)} />
            </div>
          )}
        </Fold>

        <Fold id="specifications" title="Specifications" dark>
          <SpecTable productName={product.name} brandName={brand.name} reference={productReference} specs={technicalSpecs} />
        </Fold>

        <section id="drawing" className="scroll-mt-28 border-t border-border lg:scroll-mt-32" data-testid="product-blueprint">
          <div className="container mx-auto grid items-start gap-10 px-4 py-12 lg:grid-cols-12 lg:gap-16 lg:py-20">
            <div className="lg:sticky lg:top-36 lg:col-span-4">
              <h2 className="font-display text-3xl font-light tracking-[-0.02em] md:text-4xl">Technical drawing</h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
                Placeholder sheet, shown until this product&apos;s own drawing is on file. Dimensions in millimetres.
              </p>
            </div>
            <figure className="lg:col-span-8">
              <button
                type="button"
                onClick={() => setDrawingOpen(true)}
                className="block w-full max-w-[15rem] cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={`View ${product.name} technical drawing full screen`}
                data-testid="button-drawing"
              >
                <MediaImage
                  src="/images/blueprint-placeholder.jpg"
                  alt={`${product.name} technical drawing`}
                  width={766}
                  height={1024}
                  sizes="320px"
                  className="h-auto w-full object-contain"
                />
              </button>
            </figure>
            <PhotoLightbox
              photos={[{ src: "/images/blueprint-placeholder.jpg", alt: `${product.name} technical drawing` }]}
              index={drawingOpen ? 0 : null}
              onChange={() => {}}
              onClose={() => setDrawingOpen(false)}
              label={`${product.name} technical drawing`}
            />
          </div>
        </section>

        {(installSpecs.length > 0 || product.installationNotes) && (
          <Fold id="installation" title="Installation">
            {installSpecs.length > 0 && (
              <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {installSpecs.map((spec) => (
                  <div key={spec.label} className="flex flex-col-reverse gap-2 border-t border-foreground pt-4">
                    <dt className="text-xs text-muted-foreground">{spec.label}</dt>
                    <dd className="font-display text-2xl font-medium leading-tight tracking-[-0.03em] text-foreground">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {product.installationNotes && <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">{product.installationNotes}</p>}
            {fitCm != null && fitSpec && (
              <form
                className="mt-8 max-w-sm"
                onSubmit={(event) => {
                  event.preventDefault();
                  checkFit();
                }}
              >
                <label htmlFor="cabinet-width" className="text-sm text-foreground">Your cabinet width, in cm</label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="cabinet-width"
                    inputMode="decimal"
                    value={cabinetCm}
                    onChange={(event) => setCabinetCm(event.target.value)}
                    className="h-11 w-full border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                  <button type="submit" className="h-11 shrink-0 border border-foreground px-4 text-sm">Check</button>
                </div>
                {fitResult === "fits" && <p className="mt-3 text-sm text-foreground" role="status">This {fitSpec.label.toLowerCase()} fits a {cabinetCm} cm cabinet.</p>}
                {fitResult === "tight" && <p className="mt-3 text-sm text-foreground" role="status">A {cabinetCm} cm cabinet is under the {fitSpec.value} {fitSpec.label.toLowerCase()}. Ask us before you cut.</p>}
              </form>
            )}
            {(details?.videos ?? 0) > 0 && <p className="mt-6 text-sm text-muted-foreground">An installation video is available. Ask on WhatsApp and we will send the current one.</p>}
          </Fold>
        )}

        <Fold id="downloads" title="Downloads">
          <ul className="divide-y divide-border border-y border-border">
            {documents.map((doc) => (
              <li key={doc.label}>
                <a
                  href={documentsHref(doc.label)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("whatsapp_click", { item_id: product.slug, document: doc.label })}
                  className="group flex min-h-11 items-center gap-4 py-4 hover:text-primary"
                  data-testid={`link-document-${doc.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center text-foreground transition-colors group-hover:text-primary" aria-hidden>
                    <FileText className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{doc.label}</span>
                    <span className="block text-xs text-muted-foreground">{doc.note} · Request</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-xl text-xs leading-6 text-muted-foreground">Files are sent by a consultant, so you receive the manufacturer’s current revision. A file with a public URL will download directly.</p>
        </Fold>

        {siblings.length > 0 && (
          <section className="border-t border-border">
            <div className="container mx-auto px-4 py-12 lg:py-16">
              <h2 className="font-display text-3xl font-light tracking-[-0.02em]">Same collection</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[36rem] border-t border-border text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th scope="col" className="py-3 pr-4 font-medium">Model</th>
                      <th scope="col" className="py-3 pr-4 font-medium">Code</th>
                      <th scope="col" className="py-3 pr-4 font-medium">Key spec</th>
                      <th scope="col" className="py-3 font-medium">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siblings.map((item) => {
                      const code = item.sku || item.details?.variants?.find((entry) => entry.articleNumber)?.articleNumber || item.details?.variants?.[0]?.code || "—";
                      const spec = item.dimensions || item.specs.find((entry) => /width|size|cut|dimension/i.test(entry.label))?.value || "—";
                      return (
                        <tr key={item.slug} className="border-b border-border">
                          <td className="py-3 pr-4"><Link href={`/products/${item.slug}`} className="hover:text-primary">{item.name}</Link></td>
                          <td className="py-3 pr-4 font-mono text-xs tracking-[0.08em]">{code}</td>
                          <td className="py-3 pr-4">{spec}</td>
                          <td className="py-3">On request</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {look.length > 0 && (
          <section className="border-t border-border">
            <div className="container mx-auto px-4 py-12 lg:py-16">
              <RelatedProducts title="Completes the look" products={look} />
            </div>
          </section>
        )}

        <section className="border-t border-border">
          <div className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-12 lg:py-16">
            <div className="lg:col-span-5">
              <h2 className="font-display text-3xl font-light tracking-[-0.02em]">See it in person</h2>
              <ul className="mt-6 space-y-4 text-sm">
                {SHOWROOMS.map((room) => (
                  <li key={room.slug}>
                    <Link href={`/showroom/${room.slug}`} className="font-medium hover:text-primary">{room.name}</Link>
                    <p className="text-muted-foreground">{room.hours}</p>
                    <p className="text-muted-foreground">{room.addressLines.join(", ")}</p>
                  </li>
                ))}
              </ul>
              <Link href="/showroom" className="mt-6 inline-flex h-11 items-center gap-2 bg-primary px-5 text-sm font-medium text-primary-foreground">
                Book a visit <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
            <div className="aspect-[4/3] lg:col-span-7">
              <ShowroomMap name={flagship.name} addressLines={flagship.addressLines} label={flagship.name} className="h-full min-h-64" />
            </div>
          </div>
        </section>

        {viewed.length > 0 && (
          <section className="border-t border-border">
            <div className="container mx-auto px-4 py-12 lg:py-16">
              <RelatedProducts title="Recently viewed" products={viewed} />
            </div>
          </section>
        )}
      </div>

      <StickyInquiryBar productName={product.name} finish={variant?.label} href={inquiryHref} quoted={quoted} onQuote={addQuote} />
    </MainLayout>
  );
}
