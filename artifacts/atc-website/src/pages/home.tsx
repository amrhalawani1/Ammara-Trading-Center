import { useMemo } from "react";
import { useGetPublicCatalog } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";
import { CatalogueRail } from "@/components/home/catalogue-rail";
import { CredibilityStrip, type Stat } from "@/components/home/credibility-strip";
import { GuidedSelector } from "@/components/home/guided-selector";
import { Newsletter } from "@/components/home/newsletter";
import { PartnerBrands } from "@/components/home/partner-brands";
import { Hero } from "@/components/home/hero";
import { ProjectsSection } from "@/components/home/projects-section";
import { ShowroomSection } from "@/components/home/showroom-section";
import { SolutionsExplorer } from "@/components/home/solutions-explorer";
import { WhatIsAtc } from "@/components/home/what-is-atc";
import { WhyAmara } from "@/components/home/why-amara";
import { WhyAmaraPanels } from "@/components/home/why-panels";
import { apiErrorMessage } from "@/lib/api-error";
import { company } from "@/lib/content";

/**
 * Homepage in the order a first visit reads it: statement, what ATC is, why it is this house,
 * the problem, who it represents, what it solves, the catalogue, why it is trusted, where it
 * went, where to see it.
 * The hero is unchanged; everything under it is composed from the sections in components/home.
 */
export default function Home() {
  const { data: catalog, isLoading, error } = useGetPublicCatalog();
  const brands = useMemo(() => catalog?.brands ?? [], [catalog?.brands]);
  const products = useMemo(() => catalog?.products ?? [], [catalog?.products]);

  const productsPerBrand = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.brandSlug, (map.get(p.brandSlug) ?? 0) + 1));
    return map;
  }, [products]);

  const productsPerSolution = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.category, (map.get(p.category) ?? 0) + 1));
    return map;
  }, [products]);

  const stats: Stat[] = [
    { value: company.established, label: `Since ${company.established} · three generations in Amman` },
    { value: company.partnerBrands, suffix: "+", label: "European brands, represented exclusively in Jordan" },
    { value: products.length || 40, suffix: "+", label: "Products with item nos. and drawings" },
    { value: company.showrooms.length, label: "Showrooms, Al-Bayader and Al-Wehdat" },
  ];

  return (
    <MainLayout immersiveHeader>
      <div className="text-foreground">
        <Hero />

        <CredibilityStrip stats={stats} />

        {error && (
          <div className="mx-auto max-w-[1440px] px-6 pt-8 text-sm text-destructive md:px-12">{apiErrorMessage(error, "The catalogue could not be loaded; brand and product sections show what is available.")}</div>
        )}

        <WhatIsAtc />
        <WhyAmaraPanels />
        <GuidedSelector counts={productsPerSolution} />
        <PartnerBrands brands={brands} productCounts={productsPerBrand} isLoading={isLoading} />
        <SolutionsExplorer counts={productsPerSolution} isLoading={isLoading} />
        <CatalogueRail products={products} isLoading={isLoading} />
        <WhyAmara />
        <ProjectsSection />
        <ShowroomSection />
        <Newsletter />
      </div>
    </MainLayout>
  );
}
