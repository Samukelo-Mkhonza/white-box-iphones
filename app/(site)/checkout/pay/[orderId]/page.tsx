import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildPaymentFields, getPayfastUrls } from "@/lib/payfast";
import { formatZAR } from "@/lib/format";
import { PayfastRedirectForm } from "@/components/PayfastRedirectForm";

export default async function PayPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) notFound();
  if (order.status === "PAID") {
    redirect(`/checkout/success?order=${order.orderNumber}`);
  }

  const address = JSON.parse(order.shippingAddress) as {
    nameFirst: string;
    nameLast: string;
    email: string;
  };

  const fields = buildPaymentFields({
    orderNumber: order.orderNumber,
    amountCents: order.totalCents,
    itemName: `White Box order ${order.orderNumber}`,
    nameFirst: address.nameFirst,
    nameLast: address.nameLast,
    email: address.email,
  });
  const { processUrl } = getPayfastUrls();

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Redirecting to secure payment&hellip;</h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        Order {order.orderNumber} &middot; Total {formatZAR(order.totalCents)}
      </p>
      <div className="mt-8 flex justify-center">
        <PayfastRedirectForm actionUrl={processUrl} fields={fields} />
      </div>
    </div>
  );
}
