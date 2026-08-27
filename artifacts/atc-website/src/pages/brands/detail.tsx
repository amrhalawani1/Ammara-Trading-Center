import { Link, useParams } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

// Mock data fetcher
function getBrandData(slug: string) {
  // In reality this maps to the Sanity CMS -> MySQL migration strategy
  return {
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    origin: "Germany",
    description: "Since 1888, they have been setting the global standard for furniture fittings. Known for engineering precision and extreme durability testing, their hinge systems and drawer runners are the hidden force behind the world's finest cabinetry.",
    coverImage: "/images/brand-hinge.jpg",
    products: [
      { name: "Sensys Concealed Hinge", slug: "sensys-hinge", category: "Hinges" },
      { name: "AvanTech YOU Drawer", slug: "avantech-drawer", category: "Runners" },
      { name: "TopLine XL Sliding", slug: "topline-xl", category: "Sliding Systems" },
      { name: "Quadro V6 Runner", slug: "quadro-v6", category: "Runners" },
    ]
  };
}

export default function BrandDetail() {
  const params = useParams();
  const slug = params.brandSlug || "brand";
  const brand = getBrandData(slug);

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
            <div className="flex gap-4">
              <Button asChild size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold">
                <Link href="/contact">Request Brand Catalog</Link>
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
            />
          </div>
        </div>
      </section>

      {/* Brand Products */}
      <section className="py-24 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-serif">Featured Systems</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {brand.products.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group block bg-background border border-border hover:border-primary/40 transition-colors">
                <div className="aspect-square bg-muted relative border-b border-border overflow-hidden">
                  <img 
                    src="/images/product-handle.jpg" 
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
                  <h3 className="font-serif text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
