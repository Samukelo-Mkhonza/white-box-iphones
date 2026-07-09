import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about White Box iPhones.",
};

const FAQ_ITEMS = [
  {
    question: "What does 'white box' mean?",
    answer:
      "White box means the phone ships without original retail packaging or accessories. The device itself is the same quality — you're just not paying for the box, so it costs less.",
  },
  {
    question: "How is battery health measured?",
    answer:
      "We check battery health using Apple's built-in diagnostics before every sale. The percentage shown on each listing is the maximum capacity relative to when the battery was new.",
  },
  {
    question: "What's the difference between Excellent, Very Good and Good condition?",
    answer:
      "Excellent devices show little to no signs of use. Very Good may have light, barely visible wear. Good devices are fully functional with more noticeable cosmetic wear, at the lowest price. All tiers pass the same 60+ point functional test.",
  },
  {
    question: "Do you offer a warranty?",
    answer:
      "Yes — every iPhone comes with a 12-month warranty covering hardware faults. If something goes wrong that isn't accidental damage, we repair or replace it.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are shipped with a tracking number and typically arrive within 2-5 business days anywhere in South Africa.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept secure checkout via PayFast, supporting card, EFT and other local payment options.",
  },
  {
    question: "Can I return my phone?",
    answer:
      "Yes, see our Returns Policy for the full window and conditions. If a device doesn't match its listing, we'll make it right.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        Can&apos;t find your answer here? <a href="/contact" className="underline">Contact us</a> directly.
      </p>
      <div className="mt-8">
        <FaqAccordion items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
