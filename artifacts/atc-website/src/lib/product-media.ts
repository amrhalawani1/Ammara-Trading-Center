import type { Product } from "@workspace/api-client-react";

type Media = NonNullable<NonNullable<Product["details"]>["media"]>[number];
type Variant = NonNullable<NonNullable<Product["details"]>["variants"]>[number];

export const mediaByRole = (product: Pick<Product, "details">, ...roles: Media["role"][]) =>
  (product.details?.media ?? []).filter((m) => roles.includes(m.role));

/** The clean product shot: explicit cutout, else a finish render, else the first image. */
export function primaryImage(product: Pick<Product, "details" | "image" | "images">): string | null {
  return mediaByRole(product, "cutout")[0]?.src ?? mediaByRole(product, "finish")[0]?.src ?? product.image ?? product.images?.[0] ?? null;
}

/** Second image for hover swaps: another finish, then in-use photography. */
export function secondaryImage(product: Pick<Product, "details" | "image" | "images">): string | null {
  const primary = primaryImage(product);
  const candidates = [...mediaByRole(product, "finish"), ...mediaByRole(product, "ambient"), ...mediaByRole(product, "detail")];
  return candidates.find((m) => m.src !== primary)?.src ?? null;
}

/** Image for a variant: the variant's own image, else a media item tagged with its code. */
export function variantImage(product: Pick<Product, "details">, variant: Variant | undefined): string | null {
  if (!variant) return null;
  return variant.image ?? (product.details?.media ?? []).find((m) => m.variantCode && m.variantCode === variant.code)?.src ?? null;
}

const KIND_WORD: Record<Variant["kind"], [string, string]> = {
  finish: ["finish", "finishes"],
  size: ["size", "sizes"],
  model: ["model", "models"],
  colour: ["light colour", "light colours"],
};

/** "5 finishes", "6 sizes" - falls back to the legacy finishes array. */
export function variantSummary(product: Pick<Product, "details" | "finishes">): string | null {
  const variants = product.details?.variants ?? [];
  if (variants.length > 0) {
    const kind = variants[0]!.kind;
    const count = variants.filter((v) => v.kind === kind).length;
    const [one, many] = KIND_WORD[kind];
    return `${count} ${count === 1 ? one : many}`;
  }
  const finishes = product.finishes?.length ?? 0;
  return finishes > 0 ? `${finishes} ${finishes === 1 ? "finish" : "finishes"}` : null;
}

/**
 * What the product is - "Door lever", "Window handle", "Hobs". A brand family runs across
 * doors, windows, sliding doors and furniture under one name, so the type is what tells two
 * products named "ginkgo" apart. Falls back to null when a brand publishes no useful path.
 */
export function productType(product: Pick<Product, "details" | "name" | "category">): string | null {
  const path = product.details?.brandCategoryPath ?? [];
  const type = path[path.length - 1]?.trim();
  if (!type) return null;
  const same = (a: string, b?: string | null) => a.toLowerCase() === (b ?? "").trim().toLowerCase();
  // A type that only repeats the name or the ATC category adds nothing to the card.
  if (same(type, product.name) || same(type, product.category)) return null;
  return type;
}

export const isNew = (product: Pick<Product, "details">) => (product.details?.badges ?? []).some((b) => /new/i.test(b));
