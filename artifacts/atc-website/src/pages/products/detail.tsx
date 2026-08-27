import { Link, useParams } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { BRANDS, PRODUCTS } from "@/data/catalog";
import NotFound from "@/pages/not-found";

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const product = PRODUCTS.find(p => p.slug === slug);
  const brand = product ? BRANDS.find(b => b.slug === product.brandSlug) : null;

  if (!product || !brand) {
    return <NotFound />;
  }

  return (
    <MainLayout>
      <div className="bg-background border-b border-border">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex gap-2 overflow-x-auto whitespace-nowrap">
          <Link href="/catalog" className="hover:text-foreground transition-colors" data-testid="link-bc-catalog">Catalog</Link>
          <span>/</span>
          <Link href={`/brands/${brand.slug}`} className="hover:text-foreground transition-colors" data-testid={`link-bc-brand-${brand.slug}`}>{brand.name}</Link>
          <span>/</span>
          <span className="text-foreground" data-testid="text-bc-current">{product.name}</span>
        </div>
      </div>

      <section className="py-12 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Product Image */}
            <div className="aspect-square bg-accent/20 border border-border p-8 md:p-16 flex items-center justify-center relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                data-testid={`img-product-${product.slug}`}
              />
              <div className="absolute top-6 left-6 bg-background px-3 py-1 border border-border">
                <span className="font-serif text-sm">{brand.name}</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4" data-testid="text-category">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="space-y-8 border-t border-border pt-8 mb-12">
                <div>
                  <h3 className="font-serif text-xl mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="border-b border-border/50 pb-2">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{spec.label}</span>
                        <span className="text-sm font-medium text-foreground">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl mb-4">Available Finishes</h3>
                  <div className="flex flex-wrap gap-4">
                    {product.finishes.map((finish, i) => (
                      <div key={i} className="px-4 py-2 border border-border text-sm text-foreground bg-accent/10">
                        {finish}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="default" size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold" data-testid="button-inquire">
                  <Link href="/contact">Inquire for Trade</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold border-border hover:bg-accent hover:text-foreground" data-testid="button-back-catalog">
                  <Link href="/catalog">Back to Catalog</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}
