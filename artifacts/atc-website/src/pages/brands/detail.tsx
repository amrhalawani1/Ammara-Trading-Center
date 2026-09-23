import { Link, useParams } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { useGetPublicBrand } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "@/pages/not-found";
import { MediaImage } from "@/components/media-image";
import { ProductCard } from "@/components/shared/product-card";
import { productType } from "@/lib/product-media";

export default function BrandDetail() {
  const params = useParams();
  const slug = params.brandSlug || "";
  
  const { data: brand, isLoading, error } = useGetPublicBrand(slug);
  const brandProducts = brand?.products || [];
  // DND alone runs to 34 products; the section is a taste of the range, with "View all" for the rest.
  const shownProducts = brandProducts.slice(0, 8);

  if (isLoading) {
    return (
      <MainLayout>
        <section className="bg-background py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-4 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 md:col-start-2">
              <Skeleton className="h-4 w-32 mb-6 rounded-none" />
              <Skeleton className="h-16 w-full mb-6 rounded-none" />
              <Skeleton className="h-24 w-full mb-8 rounded-none" />
            </div>
            <div className="md:col-span-5 relative aspect-square">
              <Skeleton className="w-full h-full rounded-none" />
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error || !brand) {
    return <NotFound />;
  }

  return (
    <MainLayout>
      {/* Brand Header */}
      <section className="bg-background py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 md:col-start-2">
            <div className="inline-block px-3 py-1 bg-accent border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">
              Partner Brand &middot; {brand.origin}
            </div>
            <h1 className="text-5xl md:text-6xl font-display mb-6">{brand.name}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light mb-8">
              {brand.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold" data-testid="button-catalog">
                <Link href={`/catalog?brand=${brand.slug}`}>Browse {brand.name} Catalog</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold border-border hover:bg-accent hover:text-foreground" data-testid="button-inquiry">
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-5 relative aspect-square">
            <MediaImage
              src={brand.coverImage}
              alt={brand.name}
              fallbackSrc="/images/brand-sliding.webp"
              width={900}
              height={900}
              lazy={false}
              fetchPriority="high"
              className="w-full h-full object-cover border border-border"
            />
          </div>
        </div>
      </section>

      {/* Brand Products */}
      {brandProducts.length > 0 && (
        <section className="py-24 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
              <h2 className="text-3xl font-display">Featured Systems</h2>
              <Link href={`/catalog?brand=${brand.slug}`} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors" data-testid="link-view-all">
                View all {brandProducts.length} {brand.name} products &rarr;
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shownProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={{ ...product, type: productType(product as Parameters<typeof productType>[0]) }}
                  aspect="square"
                  imageWidth={600}
                  imageHeight={600}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
