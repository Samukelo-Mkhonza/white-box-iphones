import { Breadcrumbs } from "@/components/Breadcrumbs";

export function PolicyContent({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Policies", href: "/policies" }, { label: title }]}
      />
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: {updated}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-2 text-lg font-semibold">{section.heading}</h2>
            {section.body.map((paragraph, i) => (
              <p key={i} className="mb-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
