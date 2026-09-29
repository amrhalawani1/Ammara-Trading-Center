import { company } from "@/lib/content";
import type { Shortlist, ShortlistItem } from "@/lib/shortlists";
import { whatsappUrl } from "@/lib/whatsapp";

/** Drop a variant label that only repeats the item number, and keep the finish. */
function finishLabel(item: ShortlistItem): string | null {
  if (!item.variant) return null;
  if (item.reference && item.variant === item.reference) return null;
  const prefix = item.reference ? `${item.reference} - ` : "";
  if (prefix && item.variant.startsWith(prefix)) return item.variant.slice(prefix.length);
  return item.variant;
}

/**
 * One product on a single line. WhatsApp's share preview drops line breaks, so each
 * bullet has to stay readable as its own phrase: brand, name, item number, finish, quantity.
 */
function itemBlock(item: ShortlistItem): string {
  const title = item.brandName && item.brandName !== item.name ? `${item.brandName} — ${item.name}` : item.name;
  const detail = [item.reference ? `Item no. ${item.reference}` : null, finishLabel(item), `Qty ${item.quantity}`].filter(Boolean);
  return `• ${title} — ${detail.join(" — ")}`;
}

/** One bulleted line per product. */
export function shortlistLines(list: Shortlist): string[] {
  return list.items.map(itemBlock);
}

/** The text a visitor sends on WhatsApp or by email. */
export function shortlistText(list: Shortlist): string {
  return [
    "Hello ATC,",
    "",
    "Please quote for this shortlist.",
    "",
    `Project: ${list.name}`,
    "",
    shortlistLines(list).join("\n\n"),
  ].join("\n");
}

/** What is stored server-side as the enquiry message: the list, then the visitor's notes. */
export function enquiryMessage(list: Shortlist, notes: string): string {
  const trimmed = notes.trim();
  return [`Project: ${list.name}`, "", shortlistLines(list).join("\n\n"), ...(trimmed ? ["", `Notes: ${trimmed}`] : [])].join("\n");
}

export const shortlistWhatsappUrl = (list: Shortlist): string => whatsappUrl(shortlistText(list));

/** Desktop mail clients cut mailto URLs at a few kilobytes; a list of a few dozen lines fits. */
export function shortlistMailto(list: Shortlist): string {
  const subject = encodeURIComponent(`Quote request: ${list.name}`);
  const body = encodeURIComponent(shortlistText(list).replace(/\n/g, "\r\n"));
  return `mailto:${company.email}?subject=${subject}&body=${body}`;
}
