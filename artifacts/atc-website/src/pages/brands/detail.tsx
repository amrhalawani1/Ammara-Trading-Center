import { Link, useParams } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { BRANDS, PRODUCTS } from "@/data/catalog";
import NotFound from "@/pages/not-found";

export default function BrandDetail() {
  const params = useParams();
  const slug = params.brandSlug || "";
  const brand = BRANDS.find(b => b.slug === slug);
  const brandProducts = PRODUCTS.filter(p => p.brandSlug === slug);

  if (!brand) {
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
            <h1 className="text-5xl md:text-6xl font-serif mb-6">{brand.name}</h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light mb-8">
              {brand.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold" data-testid="button-catalog">
                <Link href={`/catalog?brand=${brand.slug}`}>Browse {brand.name} Catalog</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold border-border hover:bg-accent hover:text-foreground" data-testid="button-inquiry">
                <Link href="/contact">Trade Inquiry</Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-5 relative aspect-square">
            <img 
              src={brand.coverImage} 
              alt={brand.name}
              className="w-full h-full object-cover border border-border"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              data-testid={`img-brand-cover-${brand.slug}`}
            />
          </div>
        </div>
      </section>

      {/* Brand Products */}
      {brandProducts.length > 0 && (
        <section className="py-24 bg-accent/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-12">
              <h2 className="text-3xl font-serif">Featured Systems</h2>
              <Link href={`/catalog?brand=${brand.slug}`} className="text-sm font-bold uppercase tracking-widest text-primary hover:text-foreground transition-colors" data-testid="link-view-all">
                View All {brand.name} Products &rarr;
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {brandProducts.map((product) => (
                <Link 
                  key={product.slug} 
                  href={`/products/${product.slug}`} 
                  className="group block bg-background border border-border hover:border-primary/40 transition-colors"
                  data-testid={`card-product-${product.slug}`}
                >
                  <div className="aspect-square bg-muted relative border-b border-border overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">View Spec &rarr;</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">{product.category}</span>
                    <h3 className="font-serif text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
}
