import type { Metadata } from "next";
import { PolicyContent } from "@/components/PolicyContent";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PolicyContent
      title="Shipping Policy"
      updated="7 July 2026"
      sections={[
        {
          heading: "Delivery areas",
          body: ["We currently ship to all provinces within South Africa via our courier partners."],
        },
        {
          heading: "Delivery times",
          body: [
            "Most orders are delivered within 2-5 business days of dispatch. Estimated delivery windows are shown on every product page.",
          ],
        },
        {
          heading: "Shipping fees",
          body: [
            "A flat shipping fee applies per order, shown at checkout before you pay. There are no hidden delivery costs.",
          ],
        },
        {
          heading: "Tracking your order",
          body: [
            "Once your order ships, you'll receive a tracking number by email that you can use on our Track Order page to follow your delivery in real time.",
          ],
        },
      ]}
    />
  );
}
