import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { useGetPublicCatalog } from "@workspace/api-client-react";
import { MainLayout } from "@/components/layout/main-layout";

function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] ${
        light ? "text-background/60" : "text-primary"
      }`}
    >
      <span className="h-px w-8 bg-primary" />
      {children}
    </div>
  );
}

function EditorialLink({
  href,
  children,
  light = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
        light ? "text-background hover:text-primary" : "text-primary hover:text-foreground"
      } ${className}`}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
    </Link>
  );
}

export default function Home() {
  const { data: catalog, isLoading } = useGetPublicCatalog();
  const brands = catalog?.brands ?? [];
  const products = catalog?.products ?? [];
  const featuredBrands = brands.slice(0, 4);
  const featuredProducts = products.slice(0, 3);

  return (
    <MainLayout immersiveHeader>
      <div className="overflow-hidden bg-white text-foreground">
        <section className="relative flex min-h-[min(850px,100dvh)] items-end overflow-hidden px-6 pb-12 pt-32 md:px-12 md:pb-16">
          <img
            src="/images/hero-kitchen.jpg"
            alt="Close detail of premium kitchen hardware against warm timber"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale-[28%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1212]/80 via-[#1a1212]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1212]/75 via-transparent to-[#1a1212]/10" />
          <div className="relative z-10 mx-auto grid w-full max-w-[1440px] items-end gap-12 md:grid-cols-12">
            <div className="md:col-span-8 lg:col-span-7">
              <Kicker light>Amman · Jordan · Est. 1977</Kicker>
              <h1 className="mt-7 max-w-3xl font-serif text-[clamp(3.75rem,9vw,8.75rem)] leading-[0.84] tracking-[-0.045em] text-background">
                Quiet authority
                <span className="block pl-[12%] pt-3 italic text-background/75">in hardware.</span>
              </h1>
              <p className="mt-10 max-w-md text-sm leading-7 text-background/80 md:text-base">
                A considered collection of kitchen systems, furniture fittings, and the small mechanisms that make a room feel resolved.
              </p>
            </div>
            <div className="flex items-end justify-between border-t border-background/30 pt-4 text-[10px] uppercase tracking-[0.2em] text-background/65 md:col-span-4 md:block md:border-l md:border-t-0 md:pl-7 md:pt-0">
              <span className="block max-w-[130px] leading-5">Curated for the way spaces are made</span>
              <Link
                href="/catalog"
                className="group mt-8 flex items-center gap-3 text-background transition-colors hover:text-primary"
                data-testid="link-hero-catalog"
              >
                Explore the collection
                <ArrowDownRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
              </Link>
            </div>
          </div>
          <span className="absolute bottom-5 right-6 text-[9px] uppercase tracking-[0.25em] text-background/50 md:right-12">01 / 04</span>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-36">
          <div className="grid gap-14 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <Kicker>The ATC point of view</Kicker>
              <p className="mt-8 max-w-[250px] text-xs leading-6 text-muted-foreground">
                Good hardware disappears into the rhythm of a room. Great hardware gives it rhythm.
              </p>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <h2 className="max-w-3xl font-serif text-4xl leading-[0.98] tracking-[-0.03em] md:text-6xl">
                Materials chosen for their <em className="text-primary">quiet confidence.</em>
              </h2>
              <p className="mt-9 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
                Since 1977, ATC has helped Jordanian makers, architects, and homeowners specify the details that endure. We look closely at finish, movement, proportion, and the feeling a well-made object leaves behind.
              </p>
              <EditorialLink href="/about" className="mt-9">
                Our story
              </EditorialLink>
            </div>
          </div>
        </section>

        <section className="bg-[#f2ebe4] px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
              <div>
                <Kicker>In good company</Kicker>
                <h2 className="mt-5 max-w-xl font-serif text-4xl leading-none md:text-6xl">Partners with a point of view.</h2>
              </div>
              <EditorialLink href="/brands" className="hidden md:inline-flex">
                All partners
              </EditorialLink>
            </div>
            <div className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-7">
                <div className="relative aspect-[1.12] overflow-hidden">
                  <img
                    src="/images/showroom-wide.jpg"
                    alt="ATC showroom with curated hardware displays"
                    className="h-full w-full object-cover grayscale-[30%] transition-transform duration-700 hover:scale-[1.025]"
                  />
                  <span className="absolute bottom-5 left-5 bg-white/90 px-3 py-2 text-[9px] uppercase tracking-[0.2em]">
                    The collection, in context
                  </span>
                </div>
              </div>
              <div className="md:col-span-4 md:col-start-9 md:pb-3">
                <p className="font-serif text-3xl leading-tight md:text-4xl">The right detail is never incidental.</p>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">
                  We represent a considered group of international partners, selected for the integrity of their systems and the depth of their craft.
                </p>
                <div className="mt-8 space-y-4 border-t border-foreground/15 pt-5">
                  {isLoading ? (
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Loading partner collection</p>
                  ) : featuredBrands.length > 0 ? (
                    featuredBrands.map((brand, index) => (
                      <Link
                        key={brand.slug}
                        href={`/brands/${brand.slug}`}
                        className="group flex items-center justify-between border-b border-foreground/15 pb-3 font-serif text-xl transition-colors hover:text-primary"
                        data-testid={`link-home-brand-${brand.slug}`}
                      >
                        <span>
                          <small className="mr-3 font-sans text-[9px] uppercase tracking-[0.2em] text-primary">0{index + 1}</small>
                          {brand.name}
                        </span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </Link>
                    ))
                  ) : (
                    <Link href="/brands" className="text-sm text-muted-foreground hover:text-primary">
                      Explore our partner brands
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <EditorialLink href="/brands" className="mt-10 md:hidden">
              View partners
            </EditorialLink>
          </div>
        </section>

        <section className="bg-white px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-12 md:grid-cols-12 md:items-end">
              <div className="md:col-span-4">
                <Kicker>The collection</Kicker>
                <h2 className="mt-7 max-w-sm font-serif text-5xl leading-[0.92] tracking-[-0.035em] md:text-7xl">Material, movement, context.</h2>
                <p className="mt-7 max-w-xs text-sm leading-6 text-muted-foreground">
                  Browse a curated starting selection of systems and fittings, then speak with our team about the right specification for your project.
                </p>
                <EditorialLink href="/catalog" className="mt-9">
                  Enter the catalog
                </EditorialLink>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:col-span-7 md:col-start-6 lg:grid-cols-3">
                {isLoading ? (
                  [1, 2, 3].map((item) => <div key={item} className="aspect-[0.88] animate-pulse bg-muted" />)
                ) : featuredProducts.length > 0 ? (
                  featuredProducts.map((product, index) => {
                    const brand = brands.find((item) => item.slug === product.brandSlug);
                    return (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className={`group ${index === 1 ? "sm:mt-12 lg:mt-16" : ""}`}
                        data-testid={`card-home-product-${product.slug}`}
                      >
                        <div className="aspect-[0.88] overflow-hidden bg-muted">
                          <img
                            src={product.image || "/images/product-handle.jpg"}
                            alt={product.name}
                            className="h-full w-full object-cover grayscale-[25%] transition-transform duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                          />
                        </div>
                        <div className="border-b border-foreground/20 py-5">
                          <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.16em] text-primary">
                            <span>{brand?.name ?? "ATC collection"}</span>
                            <span>{product.category}</span>
                          </div>
                          <h3 className="mt-4 font-serif text-2xl transition-colors group-hover:text-primary">{product.name}</h3>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
                          <span className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                            View product <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="border-t border-foreground/20 pt-5 text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
                    Our catalog is being prepared. Contact the ATC team for current product guidance.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-foreground px-6 py-24 text-background md:px-12 md:py-32">
          <div className="mx-auto max-w-[1440px]">
            <div className="grid gap-16 md:grid-cols-12 md:gap-8">
              <div className="md:col-span-5">
                <Kicker light>Made for the work</Kicker>
                <h2 className="mt-7 font-serif text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl">
                  A better detail starts with a better conversation.
                </h2>
              </div>
              <div className="md:col-span-5 md:col-start-8 md:pt-12">
                <p className="text-base leading-7 text-background/65">
                  Whether you are working through a specification or imagining one perfect kitchen, our team can help you move from an idea to the right system.
                </p>
                <div className="mt-12 space-y-5 border-t border-background/20 pt-5">
                  <Link
                    href="/trade"
                    className="group flex items-center justify-between border-b border-background/20 pb-5 text-xl transition-colors hover:text-primary"
                    data-testid="link-home-trade"
                  >
                    <span><small className="mr-4 text-[9px] uppercase tracking-[0.2em] text-primary">01</small> Trade inquiries</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/showroom"
                    className="group flex items-center justify-between border-b border-background/20 pb-5 text-xl transition-colors hover:text-primary"
                    data-testid="link-home-showroom"
                  >
                    <span><small className="mr-4 text-[9px] uppercase tracking-[0.2em] text-primary">02</small> Visit the showroom</span>
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-[620px] overflow-hidden px-6 py-24 md:px-12 md:py-32">
          <img
            src="/images/trade-workshop.jpg"
            alt="Craftsperson reviewing a technical drawing in a workshop"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale-[45%]"
          />
          <div className="absolute inset-0 bg-foreground/60" />
          <div className="relative z-10 mx-auto flex min-h-[370px] max-w-[1440px] flex-col justify-between text-background">
            <div className="flex justify-between">
              <Kicker light>For the people who make</Kicker>
              <span className="text-[9px] uppercase tracking-[0.25em] text-background/60">03 / 04</span>
            </div>
            <div className="max-w-2xl">
              <h2 className="font-serif text-5xl leading-[0.92] tracking-[-0.04em] md:text-8xl">For rooms that earn their place.</h2>
              <p className="mt-8 max-w-md text-sm leading-6 text-background/75">
                Technical support, considered recommendations, and a direct line to the details your project depends on.
              </p>
              <EditorialLink href="/trade" light className="mt-8">
                Enter the trade route
              </EditorialLink>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-24 md:px-12 md:py-36">
          <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Kicker>Come closer</Kicker>
              <h2 className="mt-7 font-serif text-5xl leading-none md:text-7xl">Feel the difference.</h2>
            </div>
            <div className="md:col-span-5 md:col-start-7 md:pt-16">
              <p className="text-xl leading-8 text-muted-foreground md:text-2xl">
                Visit us in Al-Bayader or Al-Wehdat. See the finishes in daylight. Open the drawer. Ask a better question.
              </p>
              <EditorialLink href="/showroom" className="mt-10 bg-primary px-6 py-4 text-background hover:bg-primary/90">
                Plan your visit
              </EditorialLink>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}