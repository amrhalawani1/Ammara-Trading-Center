import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Link, useParams } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { useGetPublicProduct, useGetPublicBrand, getGetPublicBrandQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/pages/not-found";

const finishSwatches = [
  "bg-[#d9c4a0]",
  "bg-[#494940]",
  "bg-[#e5e2db]",
  "bg-[#b99155]",
  "bg-[#77736d]",
  "bg-[#472c24]",
];

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug || "";
  const [activeImage, setActiveImage] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(0);

  const { data: product, isLoading: isProductLoading, error: productError } = useGetPublicProduct(slug);
  const brandSlug = product?.brandSlug || "";
  const { data: brand, isLoading: isBrandLoading } = useGetPublicBrand(brandSlug, {
    query: {
      enabled: !!brandSlug,
      queryKey: getGetPublicBrandQueryKey(brandSlug),
    },
  });

  const galleryImages = useMemo(
    () => Array.from(new Set([product?.image, ...(product?.images ?? [])].filter((image): image is string => Boolean(image)))),
    [product?.image, product?.images],
  );

  useEffect(() => {
    setActiveImage(0);
    setSelectedFinish(0);
  }, [slug]);

  if (isProductLoading || isBrandLoading) {
    return (
      <MainLayout>
        <section className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-3 w-72 rounded-none" />
          </div>
        </section>
        <section className="bg-background py-10 md:py-16">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
            <div className="space-y-5">
              <Skeleton className="h-14 w-5/6 rounded-none" />
              <Skeleton className="h-6 w-3/4 rounded-none" />
              <Skeleton className="h-3 w-full rounded-none" />
              <Skeleton className="h-3 w-11/12 rounded-none" />
            </div>
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
          </div>
        </section>
      </MainLayout>
    );
  }

  if (productError || !product || !brand) {
    return <NotFound />;
  }

  const hasGalleryControls = galleryImages.length > 1;
  const activeImageUrl = galleryImages[activeImage];
  const activeFinish = product.finishes?.[selectedFinish];

  const showPreviousImage = () => {
    setActiveImage((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };

  const showNextImage = () => {
    setActiveImage((current) => (current + 1) % galleryImages.length);
  };

  return (
    <MainLayout>
      <div className="border-b border-border bg-background">
        <div className="container mx-auto flex gap-2 overflow-x-auto whitespace-nowrap px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/catalog" className="transition-colors hover:text-primary" data-testid="link-bc-catalog">
            Catalog
          </Link>
          <span>/</span>
          <Link href={`/brands/${brand.slug}`} className="transition-colors hover:text-primary" data-testid={`link-bc-brand-${brand.slug}`}>
            {brand.name}
          </Link>
          <span>/</span>
          <span className="text-foreground" data-testid="text-bc-current">{product.name}</span>
        </div>
      </div>

      <section className="overflow-hidden bg-background py-10 md:py-14 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-start gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-28">
              <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary" data-testid="text-category">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl leading-[0.94] tracking-[-0.04em] text-foreground md:text-5xl xl:text-6xl">
                {product.name}
              </h1>
              <p className="mt-4 text-sm font-semibold text-foreground">{brand.name}</p>
              <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">{product.description}</p>

              {product.finishes?.length > 0 && (
                <div className="mt-8 border-t border-border pt-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Available finishes</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {product.finishes.map((finish, index) => (
                      <button
                        key={finish}
                        type="button"
                        onClick={() => setSelectedFinish(index)}
                        className={`group flex w-12 flex-col items-center gap-2 text-[9px] font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground ${
                          selectedFinish === index ? "text-foreground" : ""
                        }`}
                        aria-pressed={selectedFinish === index}
                        aria-label={`Select ${finish} finish`}
                        data-testid={`button-finish-${index}`}
                      >
                        <span className={`block h-8 w-8 rounded-full border border-black/10 shadow-sm ring-offset-2 transition group-hover:ring-1 group-hover:ring-primary ${finishSwatches[index % finishSwatches.length]} ${selectedFinish === index ? "ring-1 ring-primary" : ""}`} />
                        <span className="sr-only">{finish}</span>
                      </button>
                    ))}
                  </div>
                  {activeFinish && <p className="mt-4 text-xs text-foreground">{activeFinish}</p>}
                </div>
              )}

              <div className="mt-8 space-y-3 border-t border-border pt-6 text-xs font-bold">
                <a href="#technical-information" className="flex items-center gap-2 transition-colors hover:text-primary">
                  <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Technical information
                </a>
                <Link href="/contact" className="flex items-center gap-2 transition-colors hover:text-primary">
                  <span className="inline-block h-px w-3 bg-primary" />
                  Request project guidance
                </Link>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-border bg-[#f6f4f1] px-12 py-8 md:px-20 md:py-12">
                {activeImageUrl ? (
                  <img
                    src={activeImageUrl}
                    alt={`${product.name}${activeFinish ? ` in ${activeFinish}` : ""}`}
                    className="h-full w-full object-contain mix-blend-multiply"
                    onError={(event) => {
                      (event.target as HTMLImageElement).style.display = "none";
                    }}
                    data-testid={`img-product-${product.slug}`}
                  />
                ) : (
                  <div className="font-serif text-3xl text-muted-foreground/60">{product.name}</div>
                )}

                {hasGalleryControls && (
                  <>
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-foreground/45 transition hover:text-primary md:left-6"
                      aria-label="Show previous product image"
                      data-testid="button-gallery-previous"
                    >
                      <ChevronLeft className="h-7 w-7" strokeWidth={1.25} />
                    </button>
                    <button
                      type="button"
                      onClick={showNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-foreground/45 transition hover:text-primary md:right-6"
                      aria-label="Show next product image"
                      data-testid="button-gallery-next"
                    >
                      <ChevronRight className="h-7 w-7" strokeWidth={1.25} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2" aria-label={`Image ${activeImage + 1} of ${galleryImages.length}`}>
                  {galleryImages.map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`h-1.5 w-1.5 rounded-full transition ${index === activeImage ? "bg-foreground" : "bg-foreground/30 hover:bg-foreground/60"}`}
                      aria-label={`Show image ${index + 1}`}
                      aria-current={index === activeImage ? "true" : undefined}
                    />
                  ))}
                </div>

                <div className="absolute left-5 top-5 border border-border bg-background/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
                  {brand.name}
                </div>
              </div>

              <div id="technical-information" className="mt-8 grid gap-8 border-t border-border pt-8 md:grid-cols-[minmax(0,1fr)_220px]">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Technical information</p>
                  {product.specs?.length > 0 ? (
                    <dl className="mt-5 grid gap-x-8 sm:grid-cols-2">
                      {product.specs.map((spec) => (
                        <div key={spec.label} className="border-t border-border py-3.5">
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{spec.label}</dt>
                          <dd className="mt-1.5 text-sm text-foreground">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="mt-5 text-sm text-muted-foreground">Contact our team for project-specific technical details.</p>
                  )}
                </div>
                <div className="flex flex-col justify-end gap-3">
                  <Button asChild size="lg" className="h-auto rounded-none bg-primary px-5 py-4 text-xs font-bold uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90" data-testid="button-inquire">
                    <Link href="/contact">Inquire for trade</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-auto rounded-none border-border px-5 py-4 text-xs font-bold uppercase tracking-[0.14em]" data-testid="button-back-catalog">
                    <Link href="/catalog">Back to catalog</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}