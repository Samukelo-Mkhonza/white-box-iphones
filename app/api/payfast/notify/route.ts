import { prisma } from "@/lib/prisma";
import { verifyNotifySignature, getPayfastUrls } from "@/lib/payfast";
import { sendMail } from "@/lib/mailer";
import { formatZAR } from "@/lib/format";

// PayFast calls this server-to-server once a payment completes. The
// return_url the shopper's browser hits is not trustworthy on its own --
// this ITN handler is the only place we actually confirm and record payment.
export async function POST(request: Request) {
  const bodyText = await request.text();
  const params = new URLSearchParams(bodyText);
  const payload: Record<string, string> = {};
  for (const [key, value] of params) payload[key] = value;

  if (!verifyNotifySignature(payload)) {
    return new Response("invalid signature", { status: 400 });
  }

  const { validateUrl } = getPayfastUrls();
  const validateRes = await fetch(validateUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: bodyText,
  });
  const validateText = (await validateRes.text()).trim();
  if (validateText !== "VALID") {
    return new Response("could not validate with payfast", { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: payload.m_payment_id },
    include: { items: true },
  });
  if (!order) {
    return new Response("order not found", { status: 404 });
  }

  const amountCents = Math.round(parseFloat(payload.amount_gross || "0") * 100);
  if (amountCents !== order.totalCents) {
    return new Response("amount mismatch", { status: 400 });
  }

  if (payload.payment_status === "COMPLETE" && order.status !== "PAID") {
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stockQty: { decrement: item.quantity } },
        });
      }
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          payfastPaymentId: payload.pf_payment_id ?? null,
        },
      });
    });

    await sendMail({
      to: order.guestEmail ?? "",
      subject: `Order confirmed - ${order.orderNumber}`,
      body: `Thanks for your order! We've received payment of ${formatZAR(order.totalCents)} for order ${order.orderNumber}. We'll email you a tracking number once it ships.`,
    });
  }

  return new Response("ok", { status: 200 });
}
