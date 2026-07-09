import type { Metadata } from "next";
import { PolicyContent } from "@/components/PolicyContent";

export const metadata: Metadata = { title: "Returns Policy" };

export default function ReturnsPolicyPage() {
  return (
    <PolicyContent
      title="Returns Policy"
      updated="7 July 2026"
      sections={[
        {
          heading: "14-day return window",
          body: [
            "If you change your mind, you can return your device within 14 days of delivery for a full refund, provided it's in the same condition it was sent in.",
          ],
        },
        {
          heading: "Not as described",
          body: [
            "If your device doesn't match its listing (wrong colour, storage, or condition tier), contact us within 7 days and we'll arrange a free replacement or refund.",
          ],
        },
        {
          heading: "How to start a return",
          body: [
            "Contact us with your order number and reason for return. We'll send you a return shipping label and process your refund once the device is received and inspected.",
          ],
        },
        {
          heading: "What's excluded",
          body: [
            "Devices with damage caused after delivery (drops, liquid damage, unauthorised repairs) are not eligible for a return, but may still be covered under warranty for original faults.",
          ],
        },
      ]}
    />
  );
}
