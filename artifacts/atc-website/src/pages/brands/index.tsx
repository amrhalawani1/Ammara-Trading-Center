import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { CandidateFeature } from "@/components/shared/candidate-feature";

const MOCK_BRANDS = [
  {
    name: "Hettich",
    slug: "hettich",
    origin: "Germany",
    description: "Global leader in furniture fittings and architectural hardware.",
    image: "/images/brand-hinge.jpg"
  },
  {
    name: "Salice",
    slug: "salice",
    origin: "Italy",
    description: "Pioneers of the concealed hinge and advanced opening systems.",
    image: "/images/brand-sliding.jpg"
  },
  {
    name: "Kesseböhmer",
    slug: "kessebohmer",
    origin: "Germany",
    description: "Intelligent kitchen storage solutions and ergonomic lifters.",
    image: "/images/product-handle.jpg"
  },
  {
    name: "Vibo",
    slug: "vibo",
    origin: "Italy",
    description: "Premium wire storage accessories for wardrobes and kitchens.",
    image: "/images/brand-hinge.jpg"
  }
];

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

      {/* Candidate Feature Shell: Shop by Solution / Search & Filter */}
      <section className="bg-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <CandidateFeature label="Search & Filter by Spec" />
            <CandidateFeature label="Shop by Solution (Kitchen, Wardrobe, Doors)" />
          </div>
        </div>
      </section>

      {/* Brands Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_BRANDS.map((brand) => (
              <Link key={brand.slug} href={`/brands/${brand.slug}`} className="group block border border-border bg-background hover:border-primary/40 transition-colors">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden border-b border-border">
                  <img 
                    src={brand.image} 
                    alt={brand.name}
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
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
