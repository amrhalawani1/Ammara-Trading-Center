import { company } from "@/lib/content";
import type { Shortlist } from "@/lib/shortlists";
import { whatsappUrl } from "@/lib/whatsapp";

/** "1. DND, Ginkgo, item no. GK11-F7, F7 - Satin chrome, qty 12" */
export function shortlistLines(list: Shortlist): string[] {
  return list.items.map((item, index) => {
    const parts = [item.brandName, item.name];
    if (item.reference) parts.push(`item no. ${item.reference}`);
    if (item.variant) parts.push(item.variant);
    parts.push(`qty ${item.quantity}`);
    return `${index + 1}. ${parts.join(", ")}`;
  });
}

/** The text a visitor sends on WhatsApp or by email. */
export function shortlistText(list: Shortlist): string {
  return [`Hello ATC, please quote the following project shortlist.`, ``, `Project: ${list.name}`, ...shortlistLines(list)].join("\n");
}

/** What is stored server-side as the enquiry message: the list, then the visitor's notes. */
export function enquiryMessage(list: Shortlist, notes: string): string {
  const trimmed = notes.trim();
  return [`Project shortlist: ${list.name}`, ...shortlistLines(list), ...(trimmed ? [``, `Notes: ${trimmed}`] : [])].join("\n");
}

export const shortlistWhatsappUrl = (list: Shortlist): string => whatsappUrl(shortlistText(list));

/** Desktop mail clients cut mailto URLs at a few kilobytes; a list of a few dozen lines fits. */
export function shortlistMailto(list: Shortlist): string {
  const subject = encodeURIComponent(`Project shortlist: ${list.name}`);
  const body = encodeURIComponent(shortlistText(list).replace(/\n/g, "\r\n"));
  return `mailto:${company.email}?subject=${subject}&body=${body}`;
}
