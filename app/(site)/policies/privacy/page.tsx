import type { Metadata } from "next";
import { PolicyContent } from "@/components/PolicyContent";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyContent
      title="Privacy Policy"
      updated="7 July 2026"
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, delivery address and order history.",
            "We do not store full card details — payments are processed directly by PayFast, our payment provider.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "We use your information to process orders, provide customer support, send order and shipping updates, and improve our service.",
            "We do not sell your personal information to third parties.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You can request a copy of the personal information we hold about you, ask us to correct it, or request deletion of your account by contacting us.",
          ],
        },
        {
          heading: "Contact",
          body: ["Questions about this policy can be sent to hello@whiteboxiphones.example."],
        },
      ]}
    />
  );
}
