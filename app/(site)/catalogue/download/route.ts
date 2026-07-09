import PDFDocument from "pdfkit";
import { getAllProductsWithRelations, formatStorage, conditionLabel } from "@/lib/products";
import { formatZAR } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getAllProductsWithRelations();

  const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  const done = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  doc.fontSize(22).text("White Box iPhones", { align: "left" });
  doc.fontSize(11).fillColor("#666").text("Full product catalogue — prices in South African Rand (ZAR)");
  doc.moveDown(1.5);

  const seriesGroups = new Map<string, typeof products>();
  for (const product of products) {
    const group = seriesGroups.get(product.series) ?? [];
    group.push(product);
    seriesGroups.set(product.series, group);
  }

  for (const [series, items] of seriesGroups) {
    doc.fillColor("#000").fontSize(16).text(series, { underline: true });
    doc.moveDown(0.5);

    for (const product of items) {
      const variants = product.colourways.flatMap((c) => c.variants);
      const prices = variants.map((v) => v.priceCents);
      const storageOptions = [...new Set(variants.map((v) => v.storageGb))].sort((a, b) => a - b);
      const conditions = [...new Set(variants.map((v) => v.condition))];

      doc.fontSize(13).fillColor("#000").text(product.name, { continued: false });
      doc
        .fontSize(10)
        .fillColor("#444")
        .text(`Colours: ${product.colourways.map((c) => c.name).join(", ")}`)
        .text(`Storage: ${storageOptions.map(formatStorage).join(", ")}`)
        .text(`Condition tiers: ${conditions.map(conditionLabel).join(", ")}`)
        .text(`Price range: ${formatZAR(Math.min(...prices))} - ${formatZAR(Math.max(...prices))}`);
      doc.moveDown(0.8);
    }
    doc.moveDown(0.5);
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
