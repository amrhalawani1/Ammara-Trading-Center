import { Link, useParams } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export default function ProductDetail() {
  const params = useParams();
  const slug = params.slug || "product";

  // Mock product data
  const product = {
    name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    brand: "Hettich",
    brandSlug: "hettich",
    category: "Hinges & Opening Systems",
    description: "An integrated soft-close hinge system that provides silent, effortless door closing. Designed to perform flawlessly under extreme temperature variations and heavy load conditions. The slim profile maintains the aesthetic purity of the cabinetry interior.",
    image: "/images/product-handle.jpg",
    specs: [
      { label: "Opening Angle", value: "110°" },
      { label: "Cup Depth", value: "12.8 mm" },
      { label: "Door Thickness", value: "15 - 24 mm" },
      { label: "Durability", value: "80,000 cycles tested" }
    ],
    finishes: ["Obsidian Black", "Nickel Plated"]
  };

  return (
    <MainLayout>
      <div className="bg-background border-b border-border">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex gap-2">
          <Link href="/brands" className="hover:text-foreground transition-colors">Brands</Link>
          <span>/</span>
          <Link href={`/brands/${product.brandSlug}`} className="hover:text-foreground transition-colors">{product.brand}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
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
              />
              <div className="absolute top-6 left-6 bg-background px-3 py-1 border border-border">
                <span className="font-serif text-sm">{product.brand}</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">{product.name}</h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="space-y-8 border-t border-border pt-8 mb-12">
                <div>
                  <h3 className="font-serif text-xl mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
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
                  <div className="flex gap-4">
                    {product.finishes.map((finish, i) => (
                      <div key={i} className="px-4 py-2 border border-border text-sm text-foreground bg-accent/10">
                        {finish}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold">
                  <a href="#">Download Spec Sheet &darr;</a>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold border-border hover:bg-accent hover:text-foreground">
                  <Link href="/contact">Inquire for Trade</Link>
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </MainLayout>
  );
}
