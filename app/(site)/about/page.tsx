import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Us",
  description: "Why White Box iPhones exists and how we certify every device we sell.",
};

const steps = [
  {
    title: "We buy back and trade in",
    body: "Devices are sourced from trade-ins, carrier buybacks and verified bulk suppliers across South Africa.",
  },
  {
    title: "60+ point certification",
    body: "Every iPhone is data-wiped, then tested on screen, battery, cameras, buttons, connectivity and more.",
  },
  {
    title: "Graded honestly",
    body: "We grade condition as Excellent, Very Good or Good, and always disclose battery health up front.",
  },
  {
    title: "Shipped in white box",
    body: "No retail packaging, no retail markup — just the phone, a cable, and our 12-month warranty card.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">About White Box</h1>
      <p className="mt-6 text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
        White Box iPhones was started with one goal: make certified, high-quality iPhones
        affordable for South Africans, without cutting corners on trust. Every device we sell
        is fully tested, honestly graded, and backed by a real warranty.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {steps.map((step) => (
          <div key={step.title}>
            <h2 className="mb-2 font-semibold">{step.title}</h2>
            <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="mb-2 font-semibold">Based in South Africa, for South Africa</h2>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          All prices are in Rand, all warranty claims are handled locally, and every order ships
          with a tracking number so you always know where your phone is.
        </p>
      </div>
    </div>
  );
}
