import { ProductCard } from "@/components/shared/product-card";
import { productType } from "@/lib/product-media";

interface RelatedProduct {
  slug: string;
  name: string;
  category?: string | null;
  description?: string | null;
  image?: string | null;
  brandName?: string;
  details?: { brandCategoryPath?: string[] } | null;
}

/** DND's "products in the same family": a snap-scrolling row so it works one-handed on a phone and as a rail on desktop. */
export function RelatedProducts({ title, products }: { title: string; products: RelatedProduct[] }) {
  if (products.length === 0) return null;
  return (
    <div>
      <h2 className="font-display text-3xl font-light tracking-[-0.02em] md:text-4xl">{title}</h2>
      <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:gap-6 md:px-0 [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <li key={product.slug} className="flex w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[30%] lg:w-[23%]">
            <ProductCard
              product={{ ...product, type: productType(product as Parameters<typeof productType>[0]) }}
              badge={product.brandName}
              aspect="square"
              imageWidth={600}
              imageHeight={600}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
