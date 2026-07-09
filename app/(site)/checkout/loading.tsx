export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-6 py-12">
      <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 h-8 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              <div className="h-5 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="h-9 rounded-md bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-9 rounded-md bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-9 rounded-md bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-9 rounded-md bg-zinc-100 dark:bg-zinc-900" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
          <div className="h-5 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-lg bg-zinc-100 dark:bg-zinc-900" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-6 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
