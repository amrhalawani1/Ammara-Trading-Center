import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "wouter";
import { useGetPublicBrand } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { productsByDesigner, resolveDesigner } from "@/lib/designers";
import { primaryImage, productType } from "@/lib/product-media";
import NotFound from "@/pages/not-found";

export default function BrandDesigner() {
  const params = useParams<{ brandSlug: string; designerSlug: string }>();
  const brandSlug = params.brandSlug || "";
  const designerSlug = params.designerSlug || "";
  const { data: brand, isLoading, error } = useGetPublicBrand(brandSlug);

  const products = brand?.products ?? [];
  const designer = brand ? resolveDesigner(brand.slug, designerSlug, products) : null;
  const pieces = designer ? productsByDesigner(products, designer.name) : [];

  useEffect(() => {
    if (designer) window.scrollTo({ top: 0, behavior: "auto" });
  }, [designer?.slug]);

  if (isLoading) {
    return (
      <MainLayout>
        <section className="border-b border-border px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1440px] items-center gap-12 md:grid-cols-12">
            <Skeleton className="aspect-square rounded-full md:col-span-4 md:col-start-2" />
            <div className="md:col-span-6">
              <Skeleton className="mb-6 h-4 w-32 rounded-none" />
              <Skeleton className="mb-6 h-16 w-full rounded-none" />
              <Skeleton className="h-28 w-full rounded-none" />
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error || !brand || !designer) return <NotFound />;

  return (
    <MainLayout>
      <article>
        <header className="border-b border-border px-6 py-16 md:px-12 md:py-24" data-testid="section-designer-hero">
          <div className="mx-auto max-w-[1440px]">
            <Link
              href={`/brands/${brand.slug}`}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
              data-testid="link-back-brand"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} /> {brand.name}
            </Link>
            <div className="mt-12 grid items-center gap-10 md:grid-cols-12 md:gap-16">
              <div className="mx-auto aspect-square w-56 overflow-hidden rounded-full bg-neutral-200 md:col-span-4 md:mx-0 md:w-full md:max-w-[22rem]">
                {designer.image ? (
                  <MediaImage src={designer.image} alt="" width={640} height={640} lazy={false} fetchPriority="high" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center font-display text-6xl text-muted-foreground">{designer.name.slice(0, 1)}</span>
                )}
              </div>
              <div className="md:col-span-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Designer · {brand.name}</p>
                <h1 className="mt-3 font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl" data-testid="text-designer-name">
                  {designer.name}
                </h1>
                <div className="mt-6 max-w-xl space-y-4 text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
                  {(designer.story.length > 0 ? designer.story : designer.bio ? [designer.bio] : []).map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
                {designer.sourceUrl && (
                  <a href={designer.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold tracking-[-0.01em] transition-colors hover:text-primary">
                    Manufacturer profile <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="px-6 py-20 md:px-12 md:py-28" data-testid="section-designer-products">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Catalogue</p>
            <h2 className="mt-3 font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Design by {designer.name}.</h2>
            {pieces.length > 0 ? (
              <>
                <p className="mt-4 text-sm text-muted-foreground">
                  {pieces.length} {pieces.length === 1 ? "piece" : "pieces"} in the Amara catalogue
                </p>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {pieces.map((product) => (
                    <ProductCard
                      key={product.slug}
                      product={{ ...product, image: primaryImage(product), type: productType(product) }}
                      aspect="square"
                      imageWidth={600}
                      imageHeight={600}
                    />
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-6 max-w-md text-sm leading-7 text-muted-foreground" data-testid="text-designer-empty">
                Pieces by {designer.name} are still being added to the Amara catalogue. Ask the showroom to specify one.
              </p>
            )}
          </div>
        </section>
      </article>
    </MainLayout>
  );
}
