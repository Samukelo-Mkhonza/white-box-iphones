"use client";

import { useEffect, useRef } from "react";

export function PayfastRedirectForm({
  actionUrl,
  fields,
}: {
  actionUrl: string;
  fields: [string, string][];
}) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => formRef.current?.submit(), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <form ref={formRef} method="post" action={actionUrl}>
      {fields.map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
      <button
        type="submit"
        className="rounded-full bg-foreground px-8 py-3 text-sm font-medium text-background hover:opacity-80"
      >
        Continue to PayFast
      </button>
    </form>
  );
}
