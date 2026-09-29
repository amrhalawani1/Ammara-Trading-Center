import { company } from "@/lib/content";

/** Deep link into WhatsApp with a prefilled message. Works on mobile (app) and desktop (web). */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${company.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

/**
 * A product's identifying code and where it came from: the manufacturer's article number reads
 * "Item no."; ATC's own code (its SKU, or the generated ATC-XXX-0000) reads "ATC ref.".
 */
export type ProductReference = { value: string; kind: "item" | "atc" };
export const referenceLabel = (reference: ProductReference) => (reference.kind === "item" ? "Item no." : "ATC ref.");
export const referenceLine = (reference: ProductReference) => `${referenceLabel(reference)} ${reference.value}`;

type ProductContext = {
  name: string;
  brandName: string;
  reference?: ProductReference | null;
  finish?: string | null;
  /** Variant code, included so the message names the exact finish or size. */
  variantCode?: string | null;
  /** Page URL, including `?v=` when a variant is selected. */
  pageUrl?: string | null;
};

/** Prefilled inquiry so a fabricator on site can send it in one tap. Never mentions price. */
export function productInquiryMessage(product: ProductContext, intent: "availability" | "documents" = "availability"): string {
  const lines = [
    intent === "documents"
      ? `Hello ATC, could you send the technical documents for the ${product.name} (${product.brandName})?`
      : `Hello ATC, I would like to ask about the ${product.name} by ${product.brandName}.`,
  ];
  if (product.finish) lines.push(`Finish: ${product.finish}`);
  if (product.variantCode) lines.push(`Variant: ${product.variantCode}`);
  if (product.reference) lines.push(referenceLine(product.reference));
  if (product.pageUrl) lines.push(product.pageUrl);
  return lines.join("\n");
}
