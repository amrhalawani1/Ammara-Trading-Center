import { MainLayout } from "@/components/layout/main-layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Resources() {
  return (
    <MainLayout>
      <section className="bg-background py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-[1.1]">
              Knowledge is the strongest material.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              Access specification guides, installation manuals, and product care instructions to ensure your systems perform flawlessly for their entire lifespan.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-accent/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4 lg:col-span-3 space-y-2 border-r border-border pr-4 hidden md:block">
              <h3 className="font-serif text-xl mb-6">Categories</h3>
              <ul className="space-y-4 text-sm">
                <li><button className="text-primary font-medium">All Resources</button></li>
                <li><button className="text-muted-foreground hover:text-foreground transition-colors">Brand Spec Guides</button></li>
                <li><button className="text-muted-foreground hover:text-foreground transition-colors">Installation Manuals</button></li>
                <li><button className="text-muted-foreground hover:text-foreground transition-colors">Product Care</button></li>
              </ul>
            </div>
            
            <div className="md:col-span-8 lg:col-span-9">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Resource Item */}
                <a href="#" className="group block border border-border bg-background p-6 hover:border-primary/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Spec Guide</span>
                  <h4 className="font-serif text-lg mb-2 group-hover:text-primary transition-colors">Kitchen Drawer Systems Planning</h4>
                  <p className="text-sm text-muted-foreground mb-6">Load capacities, clearances, and tolerances for premium runner systems.</p>
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground">Download PDF &darr;</div>
                </a>

                {/* Resource Item */}
                <a href="#" className="group block border border-border bg-background p-6 hover:border-primary/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Installation</span>
                  <h4 className="font-serif text-lg mb-2 group-hover:text-primary transition-colors">Concealed Hinge Adjustment</h4>
                  <p className="text-sm text-muted-foreground mb-6">Step-by-step visual guide to 3-dimensional door adjustment.</p>
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground">Download PDF &darr;</div>
                </a>
                
                {/* Resource Item */}
                <a href="#" className="group block border border-border bg-background p-6 hover:border-primary/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Product Care</span>
                  <h4 className="font-serif text-lg mb-2 group-hover:text-primary transition-colors">Matte Finish Maintenance</h4>
                  <p className="text-sm text-muted-foreground mb-6">How to clean and protect matte black and brass architectural hardware without damaging the coating.</p>
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground">Download PDF &darr;</div>
                </a>

                {/* Resource Item */}
                <a href="#" className="group block border border-border bg-background p-6 hover:border-primary/50 transition-colors">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 block">Spec Guide</span>
                  <h4 className="font-serif text-lg mb-2 group-hover:text-primary transition-colors">Sliding Door Systems</h4>
                  <p className="text-sm text-muted-foreground mb-6">Track profiles, weight limits, and soft-close integration details.</p>
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground">Download PDF &darr;</div>
                </a>
              </div>

              <div className="mt-12 p-8 border border-border bg-foreground text-background text-center">
                <h4 className="font-serif text-xl mb-4">Looking for a specific CAD file?</h4>
                <p className="text-background/70 text-sm mb-6 max-w-md mx-auto">
                  Trade professionals can request direct access to our full library of 3D models and DWG files for immediate integration into plans.
                </p>
                <Button asChild variant="outline" className="border-background/30 text-background hover:bg-background hover:text-foreground rounded-none tracking-widest uppercase text-xs font-bold">
                  <Link href="/contact">Request CAD Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
