import { formatZAR } from "@/lib/format";

const CHART_HEIGHT = 140;

export function RevenueBarChart({ data }: { data: { label: string; totalCents: number }[] }) {
  const max = Math.max(...data.map((d) => d.totalCents), 1);

  return (
    <div className="flex items-end gap-3" style={{ height: CHART_HEIGHT }}>
      {data.map((d, i) => {
        const barHeight = d.totalCents > 0 ? Math.max((d.totalCents / max) * CHART_HEIGHT, 4) : 2;
        return (
          <div
            key={i}
            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          >
            <div
              className="w-full rounded-t-md bg-zinc-800 dark:bg-zinc-200"
              style={{ height: barHeight }}
              title={`${d.label}: ${formatZAR(d.totalCents)}`}
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
