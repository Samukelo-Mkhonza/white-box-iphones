export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 py-12">
      <div className="h-4 w-64 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 w-16 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
            ))}
          </div>
        </div>
        <div>
          <div className="h-8 w-64 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-3 h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-6 h-9 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-8 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <div className="h-12 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-12 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
