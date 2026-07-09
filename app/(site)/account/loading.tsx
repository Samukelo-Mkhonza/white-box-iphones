export default function AccountLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-8 h-7 w-52 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-2 h-4 w-72 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <div className="h-14 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-56 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
        <div className="h-28 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
      </div>
    </div>
  );
}
