import { ArrowUpRight } from "lucide-react";
import { Link, useParams } from "wouter";
import type { Product } from "@workspace/api-client-react";
import { useGetPublicBrand } from "@workspace/api-client-react";
import { CatalogueCard } from "@/components/catalogues/catalogue-card";
import { MainLayout } from "@/components/layout/main-layout";
import { MediaImage } from "@/components/media-image";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CATALOGUES } from "@/lib/catalogues";
import { designerOf } from "@/lib/catalog-filters";
import { designerPath } from "@/lib/designers";
import { DND_DESIGNERS } from "@/lib/dnd-designers";
import { primaryImage, productType } from "@/lib/product-media";
import NotFound from "@/pages/not-found";

interface BrandDesigner {
  name: string;
  bio: string;
  url: string | null;
  image: string | null;
  count: number;
}

/** Designers credited on this brand's products, with one piece of their work for the portrait circle. */
function designersOf(products: Product[]): BrandDesigner[] {
  const map = new Map<string, BrandDesigner>();
  for (const product of products) {
    const credited = product.editorial?.designer;
    const name = credited?.name ?? designerOf(product);
    if (!name) continue;
    const current = map.get(name);
    const image = primaryImage(product);
    if (current) {
      current.count += 1;
      if (!current.bio && credited?.bio) current.bio = credited.bio;
      if (!current.url && credited?.url) current.url = credited.url;
      if (!current.image && image) current.image = image;
    } else {
      map.set(name, { name, bio: credited?.bio ?? "", url: credited?.url ?? null, image, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

const designerId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function BrandDetail() {
  const params = useParams();
  const slug = params.brandSlug || "";
  const { data: brand, isLoading, error } = useGetPublicBrand(slug);

  if (isLoading) {
    return (
      <MainLayout>
        <section className="border-b border-border px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto grid max-w-[1440px] items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-5 md:col-start-2">
              <Skeleton className="mb-6 h-4 w-40 rounded-none" />
              <Skeleton className="mb-6 h-20 w-full rounded-none" />
              <Skeleton className="h-24 w-full rounded-none" />
            </div>
            <Skeleton className="aspect-square rounded-none md:col-span-5" />
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error || !brand) return <NotFound />;

  const products = brand.products ?? [];
  const shownProducts = products.slice(0, 8);
  const designers =
    brand.slug === "dnd"
      ? DND_DESIGNERS.map((designer) => ({
          id: designer.slug,
          name: designer.name,
          bio: designer.bio,
          image: designer.image,
          href: `/brands/${brand.slug}/designers/${designer.slug}`,
        }))
      : designersOf(products).map((designer) => ({
          id: designerId(designer.name),
          name: designer.name,
          bio: designer.bio,
          image: designer.image,
          href: designerPath(brand.slug, designer.name),
        }));
  const catalogues = CATALOGUES.filter((item) => item.brandSlug === brand.slug);

  return (
    <MainLayout>
      <section className="border-b border-border px-6 py-16 md:px-12 md:py-24" data-testid="section-brand-hero">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-5 md:col-start-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Partner brand · {brand.origin} · Exclusive in Jordan
            </p>
            <h1 className="mt-4 font-display text-5xl font-medium tracking-[-0.045em] md:text-7xl">{brand.name}</h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">{brand.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/catalog?brand=${brand.slug}`} className="group inline-flex h-12 items-center gap-3 bg-primary px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-[background-color,color,transform] duration-200 hover:bg-foreground hover:text-background active:translate-y-px" data-testid="button-catalog">
                Browse products
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center border border-foreground px-6 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-background"
                data-testid="button-inquiry"
              >
                Enquire
              </Link>
            </div>
          </div>
          <div className="relative aspect-square md:col-span-5">
            <MediaImage src={brand.coverImage} alt={brand.name} fallbackSrc="/images/showroom-lounge.webp" width={900} height={900} lazy={false} fetchPriority="high" className="h-full w-full border border-border object-cover" />
          </div>
        </div>
      </section>

      {designers.length > 0 && (
        <section className="border-b border-border px-6 py-20 md:px-12 md:py-28" data-testid="section-brand-designers">
          <div className="mx-auto max-w-[1440px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Designers</p>
            <h2 className="mt-3 max-w-[16ch] font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">Who draws the range.</h2>
            <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 xl:grid-cols-3" aria-label="Designers">
              {designers.map((designer) => (
                <li key={designer.id} className="group grid grid-cols-[5.75rem_minmax(0,1fr)] items-start gap-5" data-testid={`designer-${designer.id}`}>
                  <div className="aspect-square overflow-hidden rounded-full bg-neutral-200">
                    {designer.image ? (
                      <MediaImage src={designer.image} alt="" width={240} height={240} className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] motion-reduce:transition-none" />
                    ) : (
                      <span className="flex h-full items-center justify-center font-display text-2xl text-muted-foreground transition-colors duration-300 group-hover:text-foreground">{designer.name.slice(0, 1)}</span>
                    )}
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3 className="font-display text-xl font-medium leading-tight tracking-[-0.03em] transition-colors duration-300 group-hover:text-primary md:text-2xl">{designer.name}</h3>
                    {designer.bio && <p className="mt-2 text-sm leading-6 text-muted-foreground">{designer.bio}</p>}
                    <Link href={designer.href} className="mt-3 inline-flex text-sm font-semibold tracking-[-0.01em] transition-colors duration-300 group-hover:text-primary">
                      / discover more
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {catalogues.length > 0 && (
        <section className="border-b border-border bg-muted/40 px-6 py-20 md:px-12 md:py-28" data-testid="section-brand-catalogues">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Catalogues</p>
                <h2 className="mt-3 font-display text-4xl font-medium leading-[0.95] tracking-[-0.04em] md:text-6xl">The shelf for {brand.name}.</h2>
              </div>
              <Link href="/catalogues" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground">
                All catalogues
              </Link>
            </div>
            <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-6" aria-label={`${brand.name} catalogues`}>
              {catalogues.map((item) => (
                <li key={item.id} data-testid={`brand-catalogue-${item.id}`}>
                  <CatalogueCard item={item} compact showBrandLink={false} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section className="px-6 py-20 md:px-12 md:py-28" data-testid="section-brand-products">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-4xl font-medium tracking-[-0.04em] md:text-5xl">Featured products</h2>
              <Link href={`/catalog?brand=${brand.slug}`} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:text-foreground" data-testid="link-view-all">
                View all {products.length} {brand.name} products
              </Link>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {shownProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={{ ...product, type: productType(product) }}
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
