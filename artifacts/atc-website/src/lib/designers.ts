import type { Product } from "@workspace/api-client-react";
import { designerOf } from "@/lib/catalog-filters";
import { DND_DESIGNERS, type DndDesigner } from "@/lib/dnd-designers";

/** Fold accents, dashes, and "&" so "Gabriele & Oscar Buratti" matches the DND slug. */
export function designerSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalise(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sameDesigner(a: string, b: string): boolean {
  return normalise(a) === normalise(b);
}

export function designerPath(brandSlug: string, name: string): string {
  const official = brandSlug === "dnd" ? DND_DESIGNERS.find((designer) => sameDesigner(designer.name, name)) : undefined;
  return `/brands/${brandSlug}/designers/${official?.slug ?? designerSlug(name)}`;
}

export interface DesignerProfile {
  name: string;
  slug: string;
  bio: string;
  story: string[];
  image: string | null;
  sourceUrl: string | null;
}

/** Official DND profile when the slug is theirs; otherwise a designer credited on this brand's products. */
export function resolveDesigner(brandSlug: string, slug: string, products: Product[]): DesignerProfile | null {
  const official: DndDesigner | undefined = brandSlug === "dnd" ? DND_DESIGNERS.find((designer) => designer.slug === slug) : undefined;
  if (official) {
    return {
      name: official.name,
      slug: official.slug,
      bio: official.bio,
      story: official.story,
      image: official.image,
      sourceUrl: official.url,
    };
  }

  const credited = products.find((product) => {
    const name = designerOf(product);
    return name ? designerSlug(name) === slug : false;
  });
  const name = credited ? designerOf(credited) : null;
  if (!credited || !name) return null;
  const editorial = credited.editorial?.designer;
  const bio = editorial && sameDesigner(editorial.name, name) ? editorial.bio : "";
  return {
    name,
    slug,
    bio,
    story: bio ? [bio] : [],
    image: null,
    sourceUrl: editorial && sameDesigner(editorial.name, name) ? editorial.url ?? null : null,
  };
}

export function productsByDesigner(products: Product[], name: string): Product[] {
  return products.filter((product) => {
    const credited = designerOf(product);
    return credited ? sameDesigner(credited, name) : false;
  });
}
