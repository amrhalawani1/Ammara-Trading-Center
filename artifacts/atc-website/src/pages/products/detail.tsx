import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight, Check, FileText, MessageCircle, Share2 } from "lucide-react";
import { Link, useParams } from "wouter";
import { useGetPublicCatalog, useGetPublicProduct } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/pages/not-found";
import { ProductHero } from "@/components/product/product-hero";
import { EditorialChapters } from "@/components/product/editorial-chapters";
import { VariantConfigurator, type ConfiguratorVariant } from "@/components/product/variant-configurator";
import { FeatureList } from "@/components/product/feature-list";
import { TechnicalDrawings } from "@/components/product/technical-drawings";
import { VariantTable } from "@/components/product/variant-table";
import { mediaByRole, productType, variantImage } from "@/lib/product-media";
import { finishCode } from "@/lib/finishes";
import { solutionByName } from "@/lib/solutions";
import { NumberedGallery } from "@/components/product/numbered-gallery";
import { DesignerBlock } from "@/components/product/designer-block";
import { ProductAnchorNav, type AnchorItem } from "@/components/product/product-anchor-nav";
import { ProductFacts } from "@/components/product/product-facts";
import { SpecTable } from "@/components/product/spec-table";
import { RelatedProducts } from "@/components/product/related-products";
import { StickyInquiryBar } from "@/components/product/sticky-inquiry-bar";
import { productInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { company } from "@/lib/content";

/** First sentence is the statement fallback when no editorial statement is set; the rest is the paragraph. */
function splitStatement(description: string): { statement: string; body: string } {
  const match = description.match(/^(.+?[.!?])(\s+|$)([\s\S]*)$/);
  if (!match) return { statement: description, body: "" };
  return { statement: match[1]!, body: match[3]!.trim() };
}

const KIND_LABEL: Record<ConfiguratorVariant["kind"], string> = { finish: "Finishes", size: "Sizes", model: "Models", colour: "Light colours" };

/** Match source "related" names (e.g. "anik (Handles for windows)") to products in our catalogue. */
function normaliseName(value: string) {
  return value.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

const DOCUMENTS = [
  { label: "Technical drawing", note: "2D, PDF" },
  { label: "Product data sheet", note: "PDF" },
  { label: "CAD / BIM files", note: "DWG, STEP" },
] as const;

const STATUS_BADGE: Record<string, string | undefined> = { comingSoon: "Coming soon" };

/** Mounts with the hero (after loading), so the observer always has an element to watch. */
function HeroWatcher({ onChange, children }: { onChange: (inView: boolean) => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-64px 0px 0px 0px" });
  useEffect(() => onChange(inView), [inView, onChange]);
  return <div ref={ref}>{children}</div>;
}

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [shared, setShared] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const onHeroInView = useCallback((inView: boolean) => setHeroInView(inView), []);

  const { data: product, isLoading: isProductLoading, error: productError } = useGetPublicProduct(slug);
  const { data: catalog, isLoading: isCatalogLoading } = useGetPublicCatalog();
  const brand = catalog?.brands.find((item) => item.slug === product?.brandSlug);

  const galleryImages = useMemo(() => {
    const media = (product?.details?.media ?? []).filter((m) => m.role !== "technical").map((m) => m.src);
    const legacy = [product?.image, ...(product?.images ?? [])];
    return Array.from(new Set([...media, ...legacy].filter((image): image is string => Boolean(image))));
  }, [product?.details?.media, product?.image, product?.images]);

  const related = useMemo(() => {
    if (!catalog || !product) return [];
    const others = catalog.products.filter((item) => item.slug !== product.slug);
    const named = new Set((product.details?.related ?? []).map(normaliseName));
    const listed = others.filter((item) => named.has(normaliseName(item.name)));
    const family = others.filter((item) => !listed.includes(item) && item.brandSlug === product.brandSlug && (item.details?.collection ?? item.family) === (product.details?.collection ?? product.family));
    const brandMates = others.filter((item) => !listed.includes(item) && !family.includes(item) && item.brandSlug === product.brandSlug);
    const sameCategory = others.filter((item) => item.brandSlug !== product.brandSlug && item.category === product.category);
    const picked = [...listed, ...family, ...sameCategory, ...brandMates].slice(0, 6);
    const title = listed.length + family.length > 0
      ? "Products in the same family"
      : sameCategory.length > 0 && picked[0] && picked[0].category === product.category
        ? `More in ${product.category.toLowerCase()}`
        : `More from ${product.brandName}`;
    return Object.assign(picked, { title });
  }, [catalog, product]) as (NonNullable<typeof catalog>["products"] & { title?: string });

  useEffect(() => {
    setActiveImage(0);
    setSelectedVariant(0);
    setShared(false);
  }, [slug]);

  useEffect(() => {
    if (!shared) return;
    const timer = window.setTimeout(() => setShared(false), 2200);
    return () => window.clearTimeout(timer);
  }, [shared]);

  if (isProductLoading || isCatalogLoading) {
    return (
      <MainLayout>
        <section className="container mx-auto grid gap-8 px-4 pb-10 pt-6 lg:min-h-[74dvh] lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col justify-end gap-5 lg:col-span-5">
            <Skeleton className="h-20 w-5/6 rounded-none" />
            <Skeleton className="h-3 w-48 rounded-none" />
          </div>
          <Skeleton className="aspect-[4/3] w-full rounded-none lg:col-span-7 lg:aspect-auto lg:min-h-[60dvh]" />
        </section>
      </MainLayout>
    );
  }

  if (productError || !product || !brand) {
    return <NotFound />;
  }

  const editorial = product.editorial ?? null;
  const details = product.details ?? null;
  const variants: ConfiguratorVariant[] = details?.variants?.length
    ? details.variants
    : (product.finishes ?? []).map((name) => ({ code: finishCode(name), label: name, kind: "finish" as const, articleNumber: null, attributes: {}, image: null }));
  const variant = variants[selectedVariant] ?? null;
  const activeFinish = variant?.label ?? null;
  const variantKind = variant?.kind ?? variants[0]?.kind ?? "finish";
  const technicalImages = mediaByRole(product, "technical").map((m) => m.src);
  const ambientImage = mediaByRole(product, "ambient")[0]?.src ?? null;
  const features = details?.features ?? [];
  const applications = details?.applications ?? [];
  const heroImage = variantImage(product, variant ?? undefined) ?? galleryImages[activeImage] ?? galleryImages[0] ?? null;
  const documents = details?.downloads?.length ? details.downloads.map((d) => ({ label: d.label, note: d.fileType })) : DOCUMENTS;
  const specs = product.specs ?? [];
  const designerName = editorial?.designer?.name ?? specs.find((spec) => /designer/i.test(spec.label))?.value ?? null;
  const heroType = productType(product);
  // "Type" is a design line for brands that describe a mechanism there (a tap's "Single-lever
  // mixer"), but not when it just repeats the type already shown above the product name.
  const designLine =
    specs.find((spec) => /^(rose type|design|profile|type)$/i.test(spec.label) && spec.value !== heroType)?.value ?? null;
  const fallback = splitStatement(product.description);
  const shortSentence = fallback.statement.length <= 90 ? fallback.statement : null;
  const statement = editorial?.statement ?? shortSentence ?? solutionByName(product.category)?.line ?? fallback.statement;
  const body = editorial?.statement || !shortSentence ? product.description : fallback.body || product.description;
  const reference = variant?.articleNumber ?? product.sku ?? `ATC-${brand.slug.slice(0, 3).toUpperCase()}-${String(product.id).padStart(4, "0")}`;
  const technicalSpecs = [
    ...specs,
    ...(product.material ? [{ label: "Material", value: product.material }] : []),
    ...(product.dimensions ? [{ label: "Dimensions", value: product.dimensions }] : []),
  ].filter((spec, index, all) => all.findIndex((other) => other.label === spec.label) === index);
  const detailGallery = editorial?.gallery?.length ? editorial.gallery : galleryImages;

  const inquiryHref = whatsappUrl(productInquiryMessage({ name: product.name, brandName: brand.name, reference, finish: activeFinish }));
  const documentsHref = (doc: string) =>
    whatsappUrl(`${productInquiryMessage({ name: product.name, brandName: brand.name, reference }, "documents")}\nDocument: ${doc}`);

  const selectVariant = (index: number) => {
    setSelectedVariant(index);
    const image = variantImage(product, variants[index]);
    const at = image ? galleryImages.indexOf(image) : -1;
    if (at >= 0) setActiveImage(at);
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${product.name} - ${brand.name}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
      }
    } catch {
      /* dismissed */
    }
  };

  const anchors: AnchorItem[] = [
    { id: "overview", label: "Overview" },
    ...(features.length > 0 || applications.length > 0 ? [{ id: "features", label: "Features" }] : []),
    { id: "finishes", label: variants.length > 0 ? KIND_LABEL[variantKind] : "Configure" },
    { id: "technical", label: "Technical data" },
    { id: "documents", label: "Documents" },
    ...(related.length > 0 ? [{ id: "related", label: "Related" }] : []),
  ];

  const lifestyleImage = ambientImage ?? (brand.coverImage && !galleryImages.includes(brand.coverImage) ? brand.coverImage : "/images/showroom-detail.webp");
  const sectionClass = "scroll-mt-32 md:scroll-mt-36";

  return (
    <MainLayout>
      <div className="pb-24 lg:pb-0">
        <HeroWatcher onChange={onHeroInView}>
          <ProductHero
            name={product.name}
            brandName={brand.name}
            brandSlug={brand.slug}
            type={heroType}
            designer={designerName}
            badge={STATUS_BADGE[product.status] ?? ((details?.badges ?? []).some((b) => /new/i.test(b)) ? "New" : undefined)}
            image={heroImage}
            finish={activeFinish}
          />
        </HeroWatcher>

        <div className="border-y border-border">
          <nav aria-label="Breadcrumb" className="container mx-auto flex gap-2 overflow-x-auto whitespace-nowrap px-4 py-3 text-xs lowercase text-muted-foreground">
            <Link href="/catalog" className="transition-colors hover:text-foreground" data-testid="link-bc-catalog">products</Link>
            <span aria-hidden>/</span>
            <Link href={`/brands/${brand.slug}`} className="transition-colors hover:text-foreground" data-testid={`link-bc-brand-${brand.slug}`}>{brand.name}</Link>
            <span aria-hidden>/</span>
            <span className="text-foreground" aria-current="page" data-testid="text-bc-current">{product.name}</span>
          </nav>
        </div>

        <ProductAnchorNav items={anchors} />

        {/* Overview: statement, story chapters, key facts */}
        <section id="overview" className={sectionClass}>
          <div className="container mx-auto px-4 py-16 md:py-28">
            <EditorialChapters statement={statement} body={body} awards={editorial?.awards ?? []} chapters={editorial?.chapters ?? []} />
            <div className="mt-16 md:mt-28">
              <ProductFacts specs={specs} />
            </div>
          </div>
        </section>

        {/* Features and applications (Barazza icons, Blum benefits and applications) */}
        {(features.length > 0 || applications.length > 0) && (
          <section id="features" className={`${sectionClass} border-t border-border`}>
            <div className="container mx-auto grid gap-10 px-4 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Features</p>
                <h2 className="mt-5 font-display text-4xl font-light leading-[1.02] tracking-[-0.025em] md:text-5xl">What it does well.</h2>
                {applications.length > 0 && (
                  <div className="mt-8">
                    <p className="text-xs text-muted-foreground">Where it is used</p>
                    <ul className="mt-3 flex flex-wrap gap-2" data-testid="list-applications">
                      {applications.map((item) => (
                        <li key={item} className="border border-border px-3 py-1.5 text-xs text-foreground">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="lg:col-span-8">
                {features.length > 0 ? (
                  <FeatureList features={features} />
                ) : ambientImage ? (
                  <div className="aspect-[16/10] overflow-hidden bg-accent">
                    <MediaImage src={ambientImage} alt={`${product.name} in use`} width={1400} height={875} sizes="(min-width: 1024px) 60vw, 100vw" className="h-full w-full object-cover" />
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        )}

        {/* Variants + configure (DND finishes, Häfele items, Barazza codes) */}
        <section id="finishes" className={`${sectionClass} border-t border-border`}>
          <div className="container mx-auto px-4 py-16 md:py-24">
            <VariantConfigurator
              productName={product.name}
              brandName={brand.name}
              reference={reference}
              designer={designerName}
              designLine={designLine}
              variants={variants}
              selected={selectedVariant}
              onSelect={selectVariant}
              images={galleryImages}
              activeImage={activeImage}
              onImageChange={setActiveImage}
              documentsHref={documentsHref("Catalogue sheet")}
            />
          </div>
        </section>

        {detailGallery.length > 1 && (
          <section className="border-t border-border">
            <div className="container mx-auto px-4 py-16 md:py-24">
              <NumberedGallery images={detailGallery} alt={product.name} />
            </div>
          </section>
        )}

        {editorial?.designer && (
          <section className="border-t border-border">
            <div className="container mx-auto px-4 py-16 md:py-24">
              <DesignerBlock name={editorial.designer.name} bio={editorial.designer.bio} url={editorial.designer.url} />
            </div>
          </section>
        )}

        {/* Technical data (Häfele) */}
        <section id="technical" className={`${sectionClass} border-t border-border bg-accent`}>
          <div className="container mx-auto grid gap-10 px-4 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Technical data</p>
              <h2 className="mt-5 font-display text-4xl font-light leading-[1.02] tracking-[-0.025em] md:text-5xl">The numbers that matter on site.</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
                Copy the sheet straight into your order notes. Anything not listed, our technical team confirms against the manufacturer's current documentation.
              </p>
              <p className="mt-6 text-xs text-muted-foreground">
                Reference <span className="ml-2 font-mono tracking-[0.14em] text-foreground" data-testid="text-reference">{reference}</span>
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <SpecTable productName={product.name} brandName={brand.name} reference={reference} specs={technicalSpecs} />
              {product.installationNotes && <p className="mt-8 border-l border-primary pl-5 text-sm leading-7 text-muted-foreground">{product.installationNotes}</p>}
            </div>
            {variants.some((v) => v.articleNumber) && variants.length > 1 && (
              <div className="lg:col-span-12">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Item numbers</p>
                <VariantTable variants={variants} selected={selectedVariant} onSelect={selectVariant} />
              </div>
            )}
            {technicalImages.length > 0 && (
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Drawings</p>
                <TechnicalDrawings images={technicalImages} productName={product.name} />
              </div>
            )}
          </div>
        </section>

        {/* Showroom band */}
        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto grid items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="aspect-[4/3] overflow-hidden">
                <MediaImage src={lifestyleImage} alt={`${brand.name} systems on display`} width={1200} height={900} sizes="(min-width: 1024px) 58vw, 100vw" className="h-full w-full object-cover grayscale-[25%]" />
              </div>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">In the showroom</p>
              <h2 className="mt-5 font-display text-4xl font-light leading-[1.02] tracking-[-0.025em] md:text-5xl">See it working.</h2>
              <p className="mt-5 text-sm leading-7 text-primary-foreground/70">
                Open the drawer. Feel the close. {brand.name} systems are on the floor at {company.showrooms[0].name} and {company.showrooms[1].name}, with a consultant who has installed them.
              </p>
              <Link href="/showroom" className="mt-8 inline-flex h-12 items-center gap-2 border border-primary-foreground/30 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary-foreground hover:text-primground active:scale-[0.98]" data-testid="button-showroom">
                Plan a showroom visit <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* Documents */}
        <section id="documents" className={`${sectionClass} border-t border-border`}>
          <div className="container mx-auto grid gap-10 px-4 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">Documents</p>
              <h2 className="mt-5 font-display text-4xl font-light leading-[1.02] tracking-[-0.025em] md:text-5xl">Drawings and data sheets.</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">Sent by our technical team so you always receive the manufacturer's current revision, not a cached copy.</p>
            </div>
            <ul className="divide-y divide-border border-y border-border lg:col-span-7 lg:col-start-6">
              {documents.map((doc) => (
                <li key={doc.label}>
                  <a href={documentsHref(doc.label)} target="_blank" rel="noreferrer" className="group flex items-center gap-5 py-5 transition hover:bg-accent md:px-3" data-testid={`link-document-${doc.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                    <FileText className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary" strokeWidth={1.5} />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-foreground">{doc.label}</span>
                      <span className="block text-xs text-muted-foreground">{doc.note}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground group-hover:text-primary">
                      Request <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {related.length > 0 && (
          <section id="related" className={`${sectionClass} border-t border-border`}>
            <div className="container mx-auto px-4 py-16 md:py-24">
              <RelatedProducts title={related.title ?? "Related products"} products={related} />
            </div>
          </section>
        )}

        {/* DND: "Do you want more information?" */}
        <section className="border-t border-border">
          <div className="container mx-auto grid gap-8 px-4 py-16 md:py-24 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <h2 className="font-display text-4xl font-light leading-[1.02] tracking-[-0.03em] md:text-6xl">Do you want more information?</h2>
            </div>
            <div className="flex flex-col items-start gap-6 lg:col-span-5 lg:col-start-8 lg:pt-3">
              <a href={inquiryHref} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2.5 bg-primary px-6 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition hover:bg-primary/90 active:scale-[0.98]" data-testid="button-whatsapp-footer">
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} /> Contact us on WhatsApp
              </a>
              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-xs">
                <li>
                  <a href={documentsHref("Product data sheet")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-foreground transition hover:text-primary">
                    Request the data sheet <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                </li>
                <li>
                  <a href="#technical" className="inline-flex items-center gap-1.5 text-foreground transition hover:text-primary">
                    Technical data <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                </li>
                <li>
                  <button type="button" onClick={share} className="inline-flex items-center gap-1.5 text-foreground transition hover:text-primary" data-testid="button-share">
                    {shared ? <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2} /> : <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} />}
                    {shared ? "Link copied" : "Share"}
                  </button>
                </li>
              </ul>
              <p className="text-xs text-muted-foreground">{company.whatsapp.display} · {company.email}</p>
            </div>
          </div>
        </section>
      </div>

      <StickyInquiryBar visible={!heroInView} productName={product.name} finish={activeFinish} href={inquiryHref} />
    </MainLayout>
  );
}
