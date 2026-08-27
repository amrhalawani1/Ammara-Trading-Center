import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { BRANDS } from "@/data/catalog";

export default function BrandsDirectory() {
  return (
    <MainLayout>
      <section className="bg-background py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-[1.1]">
              The world's leading<br /> hardware, curated for Jordan.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              We exclusively represent manufacturers who share our obsession with longevity, precise engineering, and flawless functionality. Explore our partner brands.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog CTA */}
      <section className="bg-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-serif mb-2">Explore the Full Collection</h2>
            <p className="text-muted-foreground text-sm font-light">Browse systems by specification, solution, and manufacturer.</p>
          </div>
          <Link href="/catalog" className="inline-flex items-center justify-center whitespace-nowrap bg-primary text-primary-foreground h-10 px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors" data-testid="link-full-catalog">
            Open Catalog &rarr;
          </Link>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BRANDS.map((brand) => (
              <Link 
                key={brand.slug} 
                href={`/brands/${brand.slug}`} 
                className="group block border border-border bg-background hover:border-primary/40 transition-colors"
                data-testid={`card-brand-${brand.slug}`}
              >
                <div className="aspect-[4/3] bg-muted relative overflow-hidden border-b border-border">
                  <img 
                    src={brand.coverImage} 
                    alt={brand.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    data-testid={`img-brand-${brand.slug}`}
                  />
                  <div className="absolute top-4 left-4 bg-background/90 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground">
                    {brand.origin}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl mb-2 group-hover:text-primary transition-colors">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{brand.description}</p>
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground">View Brand &rarr;</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
