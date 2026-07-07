import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCartItemCount } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "White Box iPhones — Quality iPhones, Unbeatable Prices",
    template: "%s | White Box iPhones",
  },
  description:
    "Certified white-box iPhones with warranty. The same iPhone you love, without the retail markup.",
  openGraph: {
    siteName: "White Box iPhones",
    type: "website",
    locale: "en_ZA",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cartCount, user] = await Promise.all([getCartItemCount(), getCurrentUser()]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <SiteHeader cartCount={cartCount} userName={user?.name ?? null} isAdmin={user?.role === "ADMIN"} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
