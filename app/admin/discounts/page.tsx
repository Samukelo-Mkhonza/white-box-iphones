import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatZAR } from "@/lib/format";
import { NewDiscountForm } from "@/components/admin/NewDiscountForm";
import { toggleDiscountCodeAction, deleteDiscountCodeAction } from "@/app/admin/discounts/actions";

export const metadata: Metadata = { title: "Admin · Discount Codes" };

export default async function AdminDiscountsPage() {
  const codes = await prisma.discountCode.findMany({ orderBy: { id: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Discount Codes</h1>

      <div className="mt-6 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
        <NewDiscountForm />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="p-3">Code</th>
              <th className="p-3">Value</th>
              <th className="p-3">Used</th>
              <th className="p-3">Expires</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {codes.map((code) => (
              <tr key={code.id}>
                <td className="p-3 font-mono font-medium">{code.code}</td>
                <td className="p-3">{code.type === "PERCENTAGE" ? `${code.value}%` : formatZAR(code.value)}</td>
                <td className="p-3 text-zinc-500 dark:text-zinc-400">
                  {code.usedCount}
                  {code.usageLimit ? ` / ${code.usageLimit}` : ""}
                </td>
                <td className="p-3 text-zinc-500 dark:text-zinc-400">
                  {code.expiresAt ? code.expiresAt.toLocaleDateString("en-ZA") : "Never"}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      code.active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {code.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-3">
                    <form action={toggleDiscountCodeAction.bind(null, code.id)}>
                      <button type="submit" className="text-xs underline">
                        {code.active ? "Disable" : "Enable"}
                      </button>
                    </form>
                    <form action={deleteDiscountCodeAction.bind(null, code.id)}>
                      <button type="submit" className="text-xs text-red-600 underline dark:text-red-400">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-zinc-500 dark:text-zinc-400">
                  No discount codes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
