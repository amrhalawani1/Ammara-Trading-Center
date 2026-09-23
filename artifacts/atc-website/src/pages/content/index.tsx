import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrandsTab } from "./brands-tab";
import { ProductsTab } from "./products-tab";
import { ImportTab } from "./import-tab";

export default function ContentWorkspace() {
  return (
    <MainLayout>
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Internal Area
          </span>
          <h1 className="text-3xl md:text-4xl font-display mb-2">Content Workspace</h1>
          <p className="text-muted-foreground font-light max-w-2xl">
            Manage catalogue content, brands, systems, and bulk imports.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="brands" className="w-full">
          <TabsList className="mb-8 rounded-none border border-border bg-background p-0 inline-flex h-10 items-center justify-center">
            <TabsTrigger 
              value="brands" 
              className="rounded-none h-full px-6 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-accent data-[state=active]:text-foreground"
            >
              Brands
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="rounded-none h-full px-6 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-accent data-[state=active]:text-foreground"
            >
              Systems
            </TabsTrigger>
            <TabsTrigger 
              value="import"
              className="rounded-none h-full px-6 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-accent data-[state=active]:text-foreground"
            >
              Import Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="brands">
            <BrandsTab />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="import">
            <ImportTab />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
