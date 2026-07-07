import type { Metadata } from "next";
import Link from "next/link";
import { getCustomersForAdmin } from "@/lib/admin";
import { formatZAR } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Customers" };

export default async function AdminCustomersPage() {
  const customers = await getCustomersForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Customers</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Orders</th>
              <th className="p-3">Total spent</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                <td className="p-3 font-medium">
                  <Link href={`/admin/customers/${customer.id}`} className="hover:underline">
                    {customer.name}
                  </Link>
                </td>
                <td className="p-3 text-zinc-500 dark:text-zinc-400">{customer.email}</td>
                <td className="p-3">{customer.orderCount}</td>
                <td className="p-3">{formatZAR(customer.totalSpentCents)}</td>
                <td className="p-3 text-zinc-500 dark:text-zinc-400">
                  {customer.createdAt.toLocaleDateString("en-ZA")}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-zinc-500 dark:text-zinc-400">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
