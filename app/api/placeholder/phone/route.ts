import { NextRequest } from "next/server";

// Renders a simple SVG phone silhouette tinted to the requested colour, used
// as a stand-in for real product photography (see ?url= override path in
// seed data comments). Swap ProductImage.url to a real photo path later --
// no schema change needed.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const color = sanitizeHex(searchParams.get("color") ?? "d4d4d8");
  const label = (searchParams.get("label") ?? "White Box").slice(0, 40);
  const view = searchParams.get("view") === "back" ? "back" : "front";

  const isLight = hexLuminance(color) > 0.6;
  const strokeColor = isLight ? "#3f3f46" : "#e4e4e7";
  const textColor = isLight ? "#27272a" : "#fafafa";

  const cameraBump =
    view === "back"
      ? `<rect x="84" y="32" width="44" height="44" rx="14" fill="${strokeColor}" opacity="0.25" />
         <circle cx="100" cy="48" r="7" fill="${strokeColor}" opacity="0.5" />
         <circle cx="118" cy="48" r="7" fill="${strokeColor}" opacity="0.5" />
         <circle cx="100" cy="66" r="7" fill="${strokeColor}" opacity="0.5" />`
      : `<rect x="95" y="32" width="50" height="8" rx="4" fill="${strokeColor}" opacity="0.6" />
         <circle cx="87" cy="36" r="4" fill="${strokeColor}" opacity="0.6" />`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 240 240">
    <rect width="240" height="240" fill="${color}" />
    <rect x="70" y="16" width="100" height="208" rx="22" fill="${color}" stroke="${strokeColor}" stroke-width="3" />
    <rect x="82" y="24" width="76" height="192" rx="14" fill="${color}" opacity="0.15" />
    ${cameraBump}
    <text x="120" y="234" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="${textColor}" opacity="0.85">${escapeXml(label)} &#183; ${view}</text>
  </svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

function sanitizeHex(value: string): string {
  const hex = value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
  return `#${hex.padEnd(6, "d")}`;
}

function hexLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
