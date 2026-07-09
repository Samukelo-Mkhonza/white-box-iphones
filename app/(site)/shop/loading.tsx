export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 py-12">
      <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 h-8 w-56 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <div className="h-96 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
        <div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-7 w-64 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-900" />
                <div className="space-y-2 p-4">
                  <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-5 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
