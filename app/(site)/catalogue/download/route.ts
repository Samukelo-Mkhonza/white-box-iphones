import { readFileSync } from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { getAllProductsWithRelations, formatStorage, conditionLabel } from "@/lib/products";
import { formatZAR } from "@/lib/format";

export const dynamic = "force-dynamic";

const INK = "#09090b"; // zinc-950, matches the site header band
const BODY = "#3f3f46"; // zinc-700
const MUTED = "#71717a"; // zinc-500
const RULE = "#e4e4e7"; // zinc-200

export async function GET() {
  const products = await getAllProductsWithRelations();

  const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  const pageWidth = doc.page.width;
  const contentX = doc.page.margins.left;
  const contentWidth = pageWidth - doc.page.margins.left - doc.page.margins.right;
  const bottomLimit = () => doc.page.height - doc.page.margins.bottom;

  // Header band: the logo art is white-on-transparent (same asset the site
  // header uses on its black bar), so it needs a dark background to be visible.
  const BAND_HEIGHT = 130;
  doc.rect(0, 0, pageWidth, BAND_HEIGHT).fill(INK);
  try {
    const logo = readFileSync(path.join(process.cwd(), "public", "images", "white-box-iphones-logo-full.png"));
    doc.image(logo, contentX, 20, { height: 90 });
  } catch {
    doc.fillColor("#ffffff").fontSize(22).font("Helvetica-Bold").text("White Box iPhones", contentX, 50);
  }
  doc
    .fillColor("#a1a1aa")
    .fontSize(9)
    .font("Helvetica")
    .text("hello@whiteboxiphones.example", contentX, 48, { width: contentWidth, align: "right" })
    .text("Mon-Fri, 9am-5pm SAST", { width: contentWidth, align: "right" })
    .text("whiteboxiphones.example", { width: contentWidth, align: "right" });

  doc.y = BAND_HEIGHT + 28;
  doc.x = contentX;
  doc.fillColor(INK).fontSize(18).font("Helvetica-Bold").text("Full Product Catalogue");
  doc
    .fillColor(MUTED)
    .fontSize(10)
    .font("Helvetica")
    .text(
      `Certified, warrantied white-box iPhones delivered across South Africa. Generated ${new Date().toLocaleDateString(
        "en-ZA",
        { year: "numeric", month: "long", day: "numeric" }
      )}. All prices in South African Rand (ZAR).`
    );
  doc.moveDown(1.5);

  const seriesGroups = new Map<string, typeof products>();
  for (const product of products) {
    const group = seriesGroups.get(product.series) ?? [];
    group.push(product);
    seriesGroups.set(product.series, group);
  }

  for (const [series, items] of seriesGroups) {
    // Keep the section bar with at least one entry beneath it.
    if (doc.y + 110 > bottomLimit()) {
      doc.addPage();
    }

    const barY = doc.y;
    doc.rect(contentX, barY, contentWidth, 24).fill(INK);
    doc
      .fillColor("#ffffff")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(series.toUpperCase(), contentX + 12, barY + 7, { width: contentWidth - 24 });
    doc
      .fillColor("#a1a1aa")
      .fontSize(9)
      .font("Helvetica")
      .text(`${items.length} model${items.length === 1 ? "" : "s"}`, contentX + 12, barY + 8, {
        width: contentWidth - 24,
        align: "right",
      });
    doc.y = barY + 36;
    doc.x = contentX;

    for (const product of items) {
      const variants = product.colourways.flatMap((c) => c.variants);
      const prices = variants.map((v) => v.priceCents);
      const storageOptions = [...new Set(variants.map((v) => v.storageGb))].sort((a, b) => a - b);
      const conditions = [...new Set(variants.map((v) => v.condition))];
      const priceRange =
        Math.min(...prices) === Math.max(...prices)
          ? formatZAR(Math.min(...prices))
          : `${formatZAR(Math.min(...prices))} - ${formatZAR(Math.max(...prices))}`;

      if (doc.y + 66 > bottomLimit()) {
        doc.addPage();
        doc.y = doc.page.margins.top;
      }

      const entryY = doc.y;
      doc.fillColor(INK).fontSize(11.5).font("Helvetica-Bold").text(product.name, contentX, entryY, {
        width: contentWidth - 130,
      });
      doc.fontSize(11).font("Helvetica-Bold").text(priceRange, contentX + contentWidth - 130, entryY + 1, {
        width: 130,
        align: "right",
      });

      doc
        .fillColor(BODY)
        .fontSize(9)
        .font("Helvetica")
        .text(
          `Colours: ${product.colourways.map((c) => c.name).join(", ")}`,
          contentX,
          Math.max(doc.y, entryY + 16),
          { width: contentWidth - 130 }
        )
        .text(`Storage: ${storageOptions.map(formatStorage).join(", ")}`, { width: contentWidth - 130 })
        .fillColor(MUTED)
        .text(`Condition tiers: ${conditions.map(conditionLabel).join(", ")}`, { width: contentWidth - 130 });

      doc.moveDown(0.6);
      const ruleY = doc.y;
      if (ruleY < bottomLimit() - 4 && product !== items[items.length - 1]) {
        doc
          .moveTo(contentX, ruleY)
          .lineTo(contentX + contentWidth, ruleY)
          .lineWidth(0.5)
          .strokeColor(RULE)
          .stroke();
      }
      doc.moveDown(0.6);
      doc.x = contentX;
    }

    doc.moveDown(0.4);
  }

  // Footer on every page. Zero out the bottom margin while writing below it,
  // otherwise pdfkit auto-adds a page for text past the margin line.
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const footerY = doc.page.height - 34;
    doc
      .moveTo(contentX, footerY - 8)
      .lineTo(contentX + contentWidth, footerY - 8)
      .lineWidth(0.5)
      .strokeColor(RULE)
      .stroke();
    doc
      .fillColor(MUTED)
      .fontSize(8)
      .font("Helvetica")
      .text("White Box iPhones - Premium devices. Trusted service.", contentX, footerY, {
        width: contentWidth,
        align: "left",
        lineBreak: false,
      })
      .text(`Page ${i + 1} of ${range.count}`, contentX, footerY, {
        width: contentWidth,
        align: "center",
        lineBreak: false,
      })
      .text("Prices in ZAR, subject to change.", contentX, footerY, {
        width: contentWidth,
        align: "right",
        lineBreak: false,
      });
    doc.page.margins.bottom = savedBottom;
  }

  doc.end();
  const pdfBuffer = await done;

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="white-box-iphones-catalogue.pdf"',
    },
  });
}
