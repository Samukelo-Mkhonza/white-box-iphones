export default function CartLoading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-6 py-12">
      <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 h-8 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="h-20 w-20 shrink-0 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-56 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="h-5 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>
      <div className="mt-8 ml-auto max-w-sm space-y-2">
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-6 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-4 h-12 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
