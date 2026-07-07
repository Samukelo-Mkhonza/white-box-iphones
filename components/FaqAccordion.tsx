"use client";

import { useState } from "react";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium">{item.question}</span>
              <span className="shrink-0 text-zinc-400">{open ? "−" : "+"}</span>
            </button>
            {open && (
              <p className="px-5 pb-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
