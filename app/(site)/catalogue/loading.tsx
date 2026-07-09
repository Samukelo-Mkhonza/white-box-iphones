export default function CatalogueLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 py-12">
      <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <div className="h-8 w-56 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-3 h-4 w-80 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-11 w-40 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
      <div className="mt-12 h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-4 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="h-20 w-20 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-56 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
