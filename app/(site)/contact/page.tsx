import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the White Box iPhones team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        Questions about an order, a warranty claim, or just want to check stock? Send us a
        message and we&apos;ll get back to you within one business day.
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>

      <div className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">
        <p>Email: hello@whiteboxiphones.example</p>
        <p>Hours: Mon&ndash;Fri, 9am&ndash;5pm SAST</p>
      </div>
    </div>
  );
}
