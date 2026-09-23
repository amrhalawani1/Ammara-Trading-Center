import type { Product } from "@workspace/api-client-react";
import { company } from "@/lib/content";
import { assetUrl } from "@/lib/env";
import { primaryImage } from "@/lib/product-media";

export interface ComparisonRow {
  label: string;
  values: Array<string | null>;
}

/** Brand palette, in RGB for jsPDF. */
const RED: [number, number, number] = [204, 30, 30];
const INK: [number, number, number] = [21, 22, 25];
const MUTED: [number, number, number] = [107, 111, 122];
const RULE: [number, number, number] = [213, 215, 221];
const TILE: [number, number, number] = [233, 234, 238];
const STRIPE: [number, number, number] = [245, 246, 248];

/**
 * The PDF standard fonts cover WinAnsi only, so the few symbols brands use outside it are
 * rewritten to ASCII rather than rendered as spaced garbage.
 */
const SUBSTITUTIONS: Array<[RegExp, string]> = [
  [/\u2264/g, "<="],
  [/\u2265/g, ">="],
  [/\u2260/g, "!="],
  [/[\u2013\u2014\u2212]/g, "-"],
  [/\u00d7/g, "x"],
  [/\u2026/g, "..."],
  [/[\u2018\u2019\u201a]/g, "'"],
  [/[\u201c\u201d\u201e]/g, '"'],
  [/\u2192/g, "->"],
  [/[\u00a0\u2009\u202f]/g, " "],
];

function clean(value: string | null | undefined): string {
  if (!value) return "";
  return SUBSTITUTIONS.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value.normalize("NFC"));
}

interface LoadedImage {
  data: string;
  width: number;
  height: number;
}

/**
 * Loads a same-origin image through a canvas so jsPDF gets a format it embeds directly. Photographs
 * are re-encoded as JPEG on the tile colour and capped at 640px, which keeps a four-product file
 * under a megabyte; the mark stays PNG so its edges stay crisp.
 */
async function loadImage(src: string, kind: "mark" | "photo"): Promise<LoadedImage | null> {
  try {
    const image = new Image();
    image.decoding = "async";
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Could not load ${src}`));
    });
    image.src = src;
    await loaded;
    const cap = kind === "photo" ? 640 : 1280;
    const scale = Math.min(1, cap / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    if (!context) return null;
    if (kind === "photo") {
      context.fillStyle = `rgb(${TILE.join(",")})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = kind === "photo" ? canvas.toDataURL("image/jpeg", 0.82) : canvas.toDataURL("image/png");
    return { data, width: canvas.width, height: canvas.height };
  } catch {
    return null;
  }
}

/**
 * Builds the comparison as an A4 landscape PDF: the ATC mark and the date in the header, one
 * column per product with its photograph, name, brand and reference, then every detail row.
 * Fonts are the PDF standard set so the file needs no embedded typeface.
 */
export async function downloadComparisonPdf(products: Product[], rows: ComparisonRow[]): Promise<void> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const [logo, ...photos] = await Promise.all([
    loadImage(assetUrl("/brand/amara-logo.png"), "mark"),
    ...products.map((product) => {
      const src = primaryImage(product);
      if (!src) return Promise.resolve(null);
      if (src.startsWith("http")) return loadImage(src, "photo");
      // Local catalogue images ship as width variants (`name-960.webp`), never as the bare name.
      const local = src.startsWith("/images/") && src.endsWith(".webp") ? `${src.slice(0, -".webp".length)}-960.webp` : src;
      return loadImage(assetUrl(local), "photo");
    }),
  ]);

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const labelWidth = 42;
  const columnWidth = (contentWidth - labelWidth) / products.length;
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

  // Header: mark on the left, title and date on the right, a red rule beneath.
  let y = margin;
  if (logo) {
    const logoHeight = 11;
    doc.addImage(logo.data, "PNG", margin, y, (logo.width / logo.height) * logoHeight, logoHeight);
  } else {
    doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(...RED).text(company.name.toUpperCase(), margin, y + 8);
  }
  doc.setFont("helvetica", "bold").setFontSize(20).setTextColor(...INK).text("Product comparison", pageWidth - margin, y + 8, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED).text(`Prepared ${date}. ${products.length} products, as published by each brand.`, pageWidth - margin, y + 14, { align: "right" });
  y += 20;
  doc.setDrawColor(...RED).setLineWidth(0.8).line(margin, y, pageWidth - margin, y);
  y += 6;

  // Product header: photograph, name, brand and reference for each column.
  const photoHeight = 34;
  const nameFont = 11;
  let headerBottom = y;
  products.forEach((product, index) => {
    const x = margin + labelWidth + index * columnWidth;
    const inner = columnWidth - 4;
    doc.setFillColor(...TILE).rect(x, y, inner, photoHeight, "F");
    const photo = photos[index];
    if (photo) {
      const pad = 3;
      const boxWidth = inner - pad * 2;
      const boxHeight = photoHeight - pad * 2;
      const scale = Math.min(boxWidth / photo.width, boxHeight / photo.height);
      const drawWidth = photo.width * scale;
      const drawHeight = photo.height * scale;
      doc.addImage(photo.data, "JPEG", x + pad + (boxWidth - drawWidth) / 2, y + pad + (boxHeight - drawHeight) / 2, drawWidth, drawHeight);
    } else {
      doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(...MUTED).text("Image on request", x + inner / 2, y + photoHeight / 2, { align: "center" });
    }
    let textY = y + photoHeight + 6;
    doc.setFont("helvetica", "bold").setFontSize(nameFont).setTextColor(...INK);
    const nameLines = doc.splitTextToSize(clean(product.name), inner) as string[];
    doc.text(nameLines, x, textY);
    textY += nameLines.length * (nameFont * 0.42) + 1.5;
    doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(...MUTED).text(clean(product.brandName), x, textY);
    textY += 4;
    if (product.sku) {
      doc.setFont("courier", "normal").setFontSize(8).setTextColor(...MUTED).text(clean(product.sku), x, textY);
      textY += 4;
    }
    headerBottom = Math.max(headerBottom, textY);
  });

  // Detail rows.
  autoTable(doc, {
    startY: headerBottom + 4,
    margin: { left: margin, right: margin, bottom: 20, top: 26 },
    theme: "grid",
    showHead: false,
    body: rows.map((row) => [clean(row.label), ...row.values.map((value) => clean(value))]),
    styles: { font: "helvetica", fontSize: 8.5, textColor: INK, cellPadding: { top: 2.6, bottom: 2.6, left: 3, right: 3 }, lineColor: RULE, lineWidth: 0.2, valign: "top", overflow: "linebreak" },
    columnStyles: { 0: { cellWidth: labelWidth, textColor: MUTED, fontSize: 8 }, ...Object.fromEntries(products.map((_, i) => [i + 1, { cellWidth: columnWidth }])) },
    alternateRowStyles: { fillColor: STRIPE },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index > 0 && data.cell.raw === "") {
        data.cell.text = ["-"];
        data.cell.styles.textColor = [170, 173, 181];
      }
    },
    didDrawPage: (data) => {
      // Continuation pages repeat the product names so every column stays identifiable.
      if (data.pageNumber > 1) {
        products.forEach((product, index) => {
          const x = margin + labelWidth + index * columnWidth;
          doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(...INK).text(doc.splitTextToSize(clean(product.name), columnWidth - 6)[0] as string, x, margin + 2);
          doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...MUTED).text(clean(product.brandName), x, margin + 6);
        });
        doc.setDrawColor(...RED).setLineWidth(0.5).line(margin, margin + 9, pageWidth - margin, margin + 9);
      }
      const footerY = pageHeight - 12;
      doc.setDrawColor(...RULE).setLineWidth(0.2).line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      const showroom = company.showrooms[0];
      doc.setFont("helvetica", "normal").setFontSize(7.5).setTextColor(...MUTED);
      doc.text(`${company.name}, ${showroom ? `${showroom.addressLines.join(", ")}, ${showroom.phone}, ` : ""}${company.email}`, margin, footerY);
      doc.text("Details as published by each brand. Availability and project terms are confirmed by ATC.", margin, footerY + 4);
      doc.text(`Page ${data.pageNumber}`, pageWidth - margin, footerY, { align: "right" });
    },
  });

  doc.save(`atc-comparison-${new Date().toISOString().slice(0, 10)}.pdf`);
}
