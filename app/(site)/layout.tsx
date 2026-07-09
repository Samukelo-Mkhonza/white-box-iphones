import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getCartItemCount } from "@/lib/cart";
import { getCurrentUser } from "@/lib/auth";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cartCount, user] = await Promise.all([getCartItemCount(), getCurrentUser()]);

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader cartCount={cartCount} userName={user?.name ?? null} isAdmin={user?.role === "ADMIN"} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
