import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdfkit reads font files relative to __dirname at runtime; bundling it
  // rewrites that path and breaks font loading, so run it un-bundled.
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
