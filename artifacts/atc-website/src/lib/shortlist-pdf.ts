import { company } from "@/lib/content";
import { assetUrl } from "@/lib/env";
import { savedItemHref, type Shortlist, type ShortlistItem } from "@/lib/shortlists";

const RED: [number, number, number] = [204, 30, 30];
const INK: [number, number, number] = [21, 22, 25];
const MUTED: [number, number, number] = [107, 111, 122];
const RULE: [number, number, number] = [213, 215, 221];
const TILE: [number, number, number] = [233, 234, 238];

const SUBSTITUTIONS: Array<[RegExp, string]> = [
  [/[\u2013\u2014\u2212]/g, "-"],
  [/\u00d7/g, "x"],
  [/[\u2018\u2019]/g, "'"],
  [/[\u201c\u201d]/g, '"'],
];

function clean(value: string | null | undefined): string {
  if (!value) return "";
  return SUBSTITUTIONS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value.normalize("NFC"));
}

function itemHref(item: ShortlistItem): string {
  return new URL(assetUrl(savedItemHref(item)), window.location.origin).href;
}

async function loadPhoto(src: string | null): Promise<string | null> {
  if (!src) return null;
  try {
    const local = src.startsWith("/images/") && src.endsWith(".webp") ? `${src.slice(0, -".webp".length)}-960.webp` : src;
    const image = new Image();
    image.decoding = "async";
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(src));
    });
    image.src = src.startsWith("http") ? src : assetUrl(local);
    await loaded;
    const cap = 480;
    const scale = Math.min(1, cap / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = `rgb(${TILE.join(",")})`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } catch {
    return null;
  }
}

function fileName(name: string): string {
  const slug = clean(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "shortlist";
  return `atc-${slug}.pdf`;
}

/** A4 shortlist. Each product row has a button that opens that product on the site. */
export async function downloadShortlistPdf(list: Shortlist): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const photos = await Promise.all(list.items.map((item) => loadPhoto(item.image)));
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

  const drawHeader = () => {
    doc.setFont("helvetica", "bold").setFontSize(11).setTextColor(...RED).text("AMARA TRADING CENTER", margin, 14);
    doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(...MUTED).text(date, pageWidth - margin, 14, { align: "right" });
    doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(...INK).text(clean(list.name), margin, 24);
    doc.setDrawColor(...RED).setLineWidth(0.6).line(margin, 28, pageWidth - margin, 28);
  };

  const drawFooter = (page: number, pages: number) => {
    const y = pageHeight - 10;
    doc.setDrawColor(...RULE).setLineWidth(0.2).line(margin, y - 4, pageWidth - margin, y - 4);
    doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...MUTED);
    doc.text(`${company.name}  ·  ${company.email}`, margin, y);
    doc.text(`${page} / ${pages}`, pageWidth - margin, y, { align: "right" });
  };

  drawHeader();
  let y = 36;
  const rowHeight = 32;

  list.items.forEach((item, index) => {
    if (y + rowHeight > pageHeight - 18) {
      doc.addPage();
      drawHeader();
      y = 36;
    }
    drawItem(doc, item, photos[index] ?? null, margin, y, pageWidth - margin * 2);
    y += rowHeight + 4;
  });

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    drawFooter(page, pages);
  }

  doc.save(fileName(list.name));
}

function drawItem(
  doc: import("jspdf").jsPDF,
  item: ShortlistItem,
  photo: string | null,
  x: number,
  y: number,
  width: number,
) {
  const photoSize = 28;
  doc.setFillColor(...TILE).rect(x, y, photoSize, photoSize, "F");
  if (photo) doc.addImage(photo, "JPEG", x + 2, y + 2, photoSize - 4, photoSize - 4);

  const textX = x + photoSize + 5;
  const buttonWidth = 36;
  const buttonHeight = 8;
  const textWidth = width - photoSize - buttonWidth - 12;
  doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(...INK);
  const name = (doc.splitTextToSize(clean(item.name), textWidth) as string[])[0] ?? clean(item.name);
  doc.text(name, textX, y + 6);
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED).text(clean(item.brandName), textX, y + 12);
  const detail = [item.variant ? clean(item.variant) : null, `Item no. ${clean(item.reference) || "on request"}`, `Qty ${item.quantity}`].filter(Boolean).join("   ·   ");
  doc.setFont("courier", "normal").setFontSize(8).text(detail, textX, y + 18);

  const buttonX = x + width - buttonWidth;
  const buttonY = y + photoSize - buttonHeight;
  doc.setFillColor(...RED).rect(buttonX, buttonY, buttonWidth, buttonHeight, "F");
  doc.setFont("helvetica", "bold").setFontSize(8).setTextColor(255, 255, 255);
  doc.text(item.kind === "brand" ? "View brand" : "View product", buttonX + buttonWidth / 2, buttonY + 5.3, { align: "center" });
  doc.link(buttonX, buttonY, buttonWidth, buttonHeight, { url: itemHref(item) });
}
