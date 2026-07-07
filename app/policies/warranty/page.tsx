import type { Metadata } from "next";
import { PolicyContent } from "@/components/PolicyContent";

export const metadata: Metadata = { title: "Warranty" };

export default function WarrantyPolicyPage() {
  return (
    <PolicyContent
      title="Warranty"
      updated="7 July 2026"
      sections={[
        {
          heading: "12-month hardware warranty",
          body: [
            "Every White Box iPhone includes a 12-month warranty from the date of delivery, covering manufacturing and hardware faults such as battery, screen, camera or button failures that occur under normal use.",
          ],
        },
        {
          heading: "What's covered",
          body: [
            "Faults present at the time of sale or that develop through normal use during the warranty period are repaired or the device is replaced, at our discretion, free of charge.",
          ],
        },
        {
          heading: "What's not covered",
          body: [
            "Accidental damage (drops, cracked screens, liquid damage), unauthorised repairs, and normal battery degradation below the disclosed battery health are not covered.",
          ],
        },
        {
          heading: "Making a claim",
          body: [
            "Contact us with your order number and a description of the fault. We'll guide you through sending the device back for assessment.",
          ],
        },
      ]}
    />
  );
}
