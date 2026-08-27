import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

function TrustItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-l border-border pl-4 md:pl-6 first:border-0 first:pl-0">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <span className="font-serif text-lg md:text-xl text-foreground">{value}</span>
    </div>
  );
}

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-16 md:pt-0 overflow-hidden">
        {/* Background Image - will fade in when loaded */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-kitchen.jpg" 
            alt="Premium kitchen hardware detail"
            className="w-full h-full object-cover object-center opacity-40 grayscale-[20%]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-background/60" />
        </div>

        <div className="container relative z-10 mx-auto px-4 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 lg:col-span-6 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-4">
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Since 1977</span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight text-foreground">
                Quiet authority <br />
                <span className="text-muted-foreground italic">in hardware.</span>
              </h1>
            </div>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed font-light">
              We provide architects, fabricators, and homeowners with premium kitchen systems and furniture fittings that speak for themselves.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold w-full sm:w-auto">
                <Link href="/trade">Trade Inquiry</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-none tracking-widest uppercase text-xs font-bold w-full sm:w-auto border-foreground/20 hover:border-foreground hover:bg-transparent">
                <Link href="/showroom">Book a Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-border/60 bg-background relative z-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-8 md:gap-16 justify-between md:justify-start">
            <TrustItem label="Established" value="1977" />
            <TrustItem label="Exclusive Brands" value="~30" />
            <TrustItem label="Showrooms" value="Al-Bayader & Al-Wehdat" />
          </div>
        </div>
      </section>

      {/* Dual Journey Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Dedicated to your process</h2>
            <p className="text-muted-foreground text-sm md:text-base">Whether you are scaling a commercial development or perfecting a single kitchen, our showrooms and teams are structured to support how you work.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Trade Journey */}
            <Link href="/trade" className="group block relative overflow-hidden bg-accent/20 border border-border p-8 md:p-12 hover:border-primary/30 transition-colors">
              <div className="mb-8 overflow-hidden aspect-[4/3] bg-muted relative">
                 <img 
                  src="/attached_assets/generated_images/trade-workshop.jpg" 
                  alt="Fabricator workshop"
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">B2B</span>
                <h3 className="text-2xl font-serif">Architects & Fabricators</h3>
                <p className="text-muted-foreground text-sm leading-relaxed pb-4">
                  Access specification sheets, technical training, and direct procurement channels designed for speed and accountability.
                </p>
                <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                  Enter Trade Portal <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
                </div>
              </div>
            </Link>

            {/* Retail Journey */}
            <Link href="/showroom" className="group block relative overflow-hidden bg-accent/20 border border-border p-8 md:p-12 hover:border-primary/30 transition-colors">
              <div className="mb-8 overflow-hidden aspect-[4/3] bg-muted relative">
                <img 
                  src="/images/showroom-wide.jpg" 
                  alt="ATC Showroom"
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">B2C</span>
                <h3 className="text-2xl font-serif">Homeowners</h3>
                <p className="text-muted-foreground text-sm leading-relaxed pb-4">
                  Experience the tactile difference of premium hardware. Let our consultants guide you through material choices and system capabilities.
                </p>
                <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                  Plan a Visit <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Showroom Teaser (Dark Contrast Section) */}
      <section className="bg-foreground text-background py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5 md:col-start-2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-serif leading-tight">
                See it.<br/>
                <span className="text-primary italic">Feel it.</span>
              </h2>
              <p className="text-background/70 font-light leading-relaxed">
                A catalog can only tell you dimensions. True quality is understood through weight, motion, and finish. Visit our showrooms in Al-Bayader or Al-Wehdat to explore curated displays of the world's leading hardware systems.
              </p>
              <div className="pt-4">
                <Button asChild variant="outline" size="lg" className="rounded-none border-background/30 text-background hover:bg-background hover:text-foreground tracking-widest uppercase text-xs font-bold">
                  <Link href="/showroom">Showroom Details</Link>
                </Button>
              </div>
            </div>
            <div className="md:col-span-5 relative">
              <div className="aspect-[3/4] border border-background/20 relative">
                <div className="absolute inset-4 border border-background/10"></div>
                <img 
                  src="/attached_assets/generated_images/showroom-wide.jpg" 
                  alt="ATC Showroom detail"
                  className="w-full h-full object-cover opacity-80 object-right"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
