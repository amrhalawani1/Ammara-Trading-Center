import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export default function Showroom() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-foreground text-background py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/attached_assets/generated_images/showroom-wide.jpg" 
            alt="ATC Showroom"
            className="w-full h-full object-cover object-center opacity-30 grayscale-[20%]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-foreground/80 mix-blend-multiply" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-primary mb-6">Our Showrooms</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-8 leading-[1.1]">
              A quiet space for<br /> serious decisions.
            </h1>
            <p className="text-background/80 text-lg md:text-xl leading-relaxed font-light">
              We do not believe in high-pressure sales. Our showrooms in Al-Bayader and Al-Wehdat are designed as working studios where homeowners and architects can interact with hardware, test systems, and consult with our specialists in peace.
            </p>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            
            <div className="space-y-6">
              <div className="aspect-[4/3] bg-muted mb-8 relative border border-border">
                <img 
            src="/images/showroom-detail.jpg"
                  alt="Showroom Detail"
                  className="w-full h-full object-cover grayscale-[10%]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary block">Flagship</span>
              <h2 className="text-3xl font-serif">Al-Bayader</h2>
              <address className="not-italic text-muted-foreground leading-relaxed text-sm">
                Industrial Area, 8th Circle<br />
                Amman, Jordan
              </address>
              <div className="pt-4 space-y-2 text-sm">
                <p><span className="font-medium text-foreground w-20 inline-block">Phone:</span> +962 6 581 0000</p>
                <p><span className="font-medium text-foreground w-20 inline-block">Hours:</span> Sat - Thu, 9AM - 6PM</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="aspect-[4/3] bg-muted mb-8 relative border border-border flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <p className="text-sm">Al-Wehdat Location Image</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary block">Trade & Retail</span>
              <h2 className="text-3xl font-serif">Al-Wehdat</h2>
              <address className="not-italic text-muted-foreground leading-relaxed text-sm">
                Building Materials St.<br />
                Amman, Jordan
              </address>
              <div className="pt-4 space-y-2 text-sm">
                <p><span className="font-medium text-foreground w-20 inline-block">Phone:</span> +962 6 477 0000</p>
                <p><span className="font-medium text-foreground w-20 inline-block">Hours:</span> Sat - Thu, 8AM - 5PM</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy & CTA */}
      <section className="py-24 md:py-32 bg-accent/20 border-t border-border text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif">Experience the difference.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Whether you are selecting a single handle or specifying a complete kitchen system, our consultants are ready to walk you through the options, explain the engineering, and help you find exactly what you need.
            </p>
            <div className="pt-8">
              <Button asChild size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold px-12">
                <Link href="/contact">Book a Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}
