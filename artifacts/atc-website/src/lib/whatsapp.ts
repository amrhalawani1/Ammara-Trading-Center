import { company } from "@/lib/content";

/** Deep link into WhatsApp with a prefilled message. Works on mobile (app) and desktop (web). */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${company.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

type ProductContext = {
  name: string;
  brandName: string;
  reference?: string | null;
  finish?: string | null;
};

/** Prefilled inquiry so a fabricator on site can send it in one tap. Never mentions price. */
export function productInquiryMessage(product: ProductContext, intent: "availability" | "documents" = "availability"): string {
  const lines = [
    intent === "documents"
      ? `Hello ATC, could you send the technical documents for the ${product.name} (${product.brandName})?`
      : `Hello ATC, I would like to ask about the ${product.name} by ${product.brandName}.`,
  ];
  if (product.finish) lines.push(`Finish: ${product.finish}`);
  if (product.reference) lines.push(`Ref: ${product.reference}`);
  return lines.join("\n");
}
