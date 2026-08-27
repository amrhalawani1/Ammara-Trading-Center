import { MainLayout } from "@/components/layout/main-layout";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function About() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-foreground text-background py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-6">Our Story</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-[1.1]">
              Decades of precision,<br /> built on trust.
            </h1>
            <p className="text-background/70 text-lg md:text-xl leading-relaxed font-light">
              Since 1977, Amara Trading Center has been a quiet authority in Jordan's hardware sector. We don't just distribute products; we partner with the world's most exacting manufacturers to bring uncompromising quality to local architects, fabricators, and homeowners.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            <div className="space-y-6 border-t border-border pt-8">
              <h2 className="text-2xl font-serif text-primary">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading and most trusted partner in Jordan for architectural hardware and kitchen solutions by consistently providing premium quality and unmatched reliability. We aim to set the standard for functional excellence.
              </p>
            </div>
            
            <div className="space-y-6 border-t border-border pt-8">
              <h2 className="text-2xl font-serif text-primary">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Delivering innovative, durable, and aesthetically superior hardware solutions that empower architects, craftsmen, and homeowners. We stand behind every component we supply with deep technical knowledge and accountable service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The ATC Difference */}
      <section className="py-24 bg-accent/20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Quiet Authority</h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe hardware should not be loud. It should simply work, flawlessly, for decades. Our selection criteria for partner brands is uncompromising: if it cannot withstand the rigors of a commercial kitchen or the scrutiny of a master fabricator, it does not enter our showrooms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-background border border-border">
              <span className="text-4xl font-serif text-primary/20 block mb-4">01</span>
              <h3 className="font-serif text-xl mb-4">Curated Portfolio</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We distribute roughly 30 exclusive brands. Every hinge, runner, and handle is vetted for durability and design intent.
              </p>
            </div>
            <div className="p-8 bg-background border border-border">
              <span className="text-4xl font-serif text-primary/20 block mb-4">02</span>
              <h3 className="font-serif text-xl mb-4">Technical Depth</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our team understands tolerances and load capacities. We provide technical support that prevents installation failures before they happen.
              </p>
            </div>
            <div className="p-8 bg-background border border-border">
              <span className="text-4xl font-serif text-primary/20 block mb-4">03</span>
              <h3 className="font-serif text-xl mb-4">Local Scale</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                With deep inventory across multiple logistics hubs in Amman, we ensure project timelines are met with accountable fulfillment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Partnerships */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-border pb-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-serif mb-4">Partners in Craft</h2>
              <p className="text-muted-foreground">
                We are proud to represent global leaders in furniture fittings and architectural systems.
              </p>
            </div>
          </div>
          
          <ComingSoon label="Curated Catalog Criteria & Partner Brand History" />
        </div>
      </section>
    </MainLayout>
  );
}
