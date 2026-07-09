import type { Metadata } from "next";
import { PolicyContent } from "@/components/PolicyContent";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPolicyPage() {
  return (
    <PolicyContent
      title="Terms of Service"
      updated="7 July 2026"
      sections={[
        {
          heading: "Using our site",
          body: [
            "By placing an order with White Box iPhones, you agree to these terms. All prices are listed in South African Rand (ZAR) and include VAT where applicable.",
          ],
        },
        {
          heading: "Orders and payment",
          body: [
            "Orders are confirmed once payment is successfully processed through PayFast. We reserve the right to cancel and refund an order if a listed device becomes unavailable after purchase.",
          ],
        },
        {
          heading: "Product condition grading",
          body: [
            "Devices are graded Excellent, Very Good or Good based on cosmetic condition, with battery health disclosed for every listing. All grades meet the same functional testing standard.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "White Box iPhones' liability is limited to the value of the order. We are not liable for indirect or consequential loss arising from use of a purchased device.",
          ],
        },
        {
          heading: "Changes to these terms",
          body: ["We may update these terms from time to time; the current version always applies to new orders."],
        },
      ]}
    />
  );
}
