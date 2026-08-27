import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BRANDS, CATEGORIES, PRODUCTS } from "@/data/catalog";
import { Filter, X } from "lucide-react";

export default function Catalog() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Initialize from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const brand = params.get("brand");
    const type = params.get("type");
    if (brand) setSelectedBrands(brand.split(","));
    if (type) setSelectedTypes(type.split(","));
  }, []);

  // Sync state to URL seamlessly
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
    if (selectedTypes.length > 0) params.set("type", selectedTypes.join(","));
    const search = params.toString();
    const newUrl = window.location.pathname + (search ? `?${search}` : "");
    window.history.replaceState({}, "", newUrl);
  }, [selectedBrands, selectedTypes]);

  const toggleBrand = useCallback((slug: string) => {
    setSelectedBrands(prev => 
      prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug]
    );
  }, []);

  const toggleType = useCallback((type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedTypes([]);
  }, []);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brandSlug);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(p.category);
      return matchBrand && matchType;
    });
  }, [selectedBrands, selectedTypes]);

  const activeFilterCount = selectedBrands.length + selectedTypes.length;

  return (
    <MainLayout>
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3"
            data-testid="text-catalog-scope"
          >
            Curated across {BRANDS.length} partner brands
          </span>
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Product Catalog</h1>
          <p className="text-muted-foreground max-w-2xl font-light">
            Explore a curated starting selection of premium hardware and opening systems. Contact our team for brand guidance and project-specific availability.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground">{filteredProducts.length} Results</span>
            <Button 
              variant="outline" 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="rounded-none border-border"
              data-testid="button-toggle-mobile-filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </div>

          {/* Filters Sidebar */}
          <div className={`md:col-span-3 lg:col-span-3 space-y-8 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Filters</h2>
              {activeFilterCount > 0 && (
                <button 
                  onClick={resetFilters}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/70 transition-colors flex items-center"
                  data-testid="button-reset-filters"
                >
                  <X className="w-3 h-3 mr-1" /> Reset
                </button>
              )}
            </div>

            <Separator className="bg-border" />

            {/* Brand Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Partner Brands</h3>
              <div className="space-y-3">
                {BRANDS.map(brand => (
                  <div key={brand.slug} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`brand-${brand.slug}`} 
                      checked={selectedBrands.includes(brand.slug)}
                      onCheckedChange={() => toggleBrand(brand.slug)}
                      data-testid={`filter-brand-${brand.slug}`}
                    />
                    <Label 
                      htmlFor={`brand-${brand.slug}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {brand.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Type Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Product Type</h3>
              <div className="space-y-3">
                {CATEGORIES.map(type => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox 
                      id={`type-${type}`} 
                      checked={selectedTypes.includes(type)}
                      onCheckedChange={() => toggleType(type)}
                      data-testid={`filter-type-${type.replace(/\s+/g, '-').toLowerCase()}`}
                    />
                    <Label 
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="bg-border md:hidden" />
          </div>

          {/* Product Grid */}
          <div className="md:col-span-9 lg:col-span-9">
            <div className="hidden md:flex justify-between items-center mb-6 pb-2 border-b border-border/50">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground" data-testid="text-result-count">
                Showing {filteredProducts.length} Systems
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-accent/5 border border-border flex flex-col items-center justify-center">
                <p className="text-lg font-serif mb-4">No systems match your criteria.</p>
                <p className="text-muted-foreground font-light mb-6 text-sm max-w-sm">
                  Try broadening your filters or explore our full catalog scope.
                </p>
                <Button 
                  onClick={resetFilters} 
                  variant="outline"
                  className="rounded-none border-border"
                  data-testid="button-empty-reset"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                  const brand = BRANDS.find(b => b.slug === product.brandSlug);
                  return (
                    <Link 
                      key={product.slug} 
                      href={`/products/${product.slug}`} 
                      className="group block bg-background border border-border hover:border-primary/40 transition-colors"
                      data-testid={`card-product-${product.slug}`}
                    >
                      <div className="aspect-[4/3] bg-muted relative border-b border-border overflow-hidden flex items-center justify-center p-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          data-testid={`img-product-${product.slug}`}
                        />
                        <div className="absolute top-3 left-3 bg-background/90 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-foreground">
                          {brand?.name}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary">View Spec &rarr;</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">{product.category}</span>
                        <h3 className="font-serif text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                        <p
                          className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2"
                          data-testid={`text-product-summary-${product.slug}`}
                        >
                          {product.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
