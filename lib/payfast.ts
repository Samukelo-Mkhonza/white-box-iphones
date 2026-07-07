import crypto from "node:crypto";

function isSandbox(): boolean {
  return process.env.PAYFAST_SANDBOX !== "false";
}

export function getPayfastUrls() {
  const host = isSandbox() ? "sandbox.payfast.co.za" : "www.payfast.co.za";
  return {
    processUrl: `https://${host}/eng/process`,
    validateUrl: `https://${host}/eng/query/validate`,
  };
}

function payfastEncode(value: string): string {
  return encodeURIComponent(value).replace(/%20/g, "+");
}

// PayFast requires the fields hashed in the exact order they were added
// (not alphabetical), passphrase appended last if one is configured.
export function buildSignature(fields: [string, string][], passphrase?: string): string {
  let paramString = fields
    .filter(([, value]) => value !== "" && value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${payfastEncode(String(value))}`)
    .join("&");

  if (passphrase) {
    paramString += `&passphrase=${payfastEncode(passphrase)}`;
  }

  return crypto.createHash("md5").update(paramString).digest("hex");
}

export type PayfastOrderInput = {
  orderNumber: string;
  amountCents: number;
  itemName: string;
  nameFirst: string;
  nameLast: string;
  email: string;
};

export function buildPaymentFields(order: PayfastOrderInput): [string, string][] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const merchantId = process.env.PAYFAST_MERCHANT_ID ?? "";
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY ?? "";
  const passphrase = process.env.PAYFAST_PASSPHRASE || undefined;

  const fields: [string, string][] = [
    ["merchant_id", merchantId],
    ["merchant_key", merchantKey],
    ["return_url", `${siteUrl}/checkout/success?order=${order.orderNumber}`],
    ["cancel_url", `${siteUrl}/checkout/cancelled?order=${order.orderNumber}`],
    ["notify_url", `${siteUrl}/api/payfast/notify`],
    ["name_first", order.nameFirst],
    ["name_last", order.nameLast],
    ["email_address", order.email],
    ["m_payment_id", order.orderNumber],
    ["amount", (order.amountCents / 100).toFixed(2)],
    ["item_name", order.itemName],
  ];

  const signature = buildSignature(fields, passphrase);
  return [...fields, ["signature", signature]];
}

export function verifyNotifySignature(payload: Record<string, string>): boolean {
  const passphrase = process.env.PAYFAST_PASSPHRASE || undefined;
  const { signature, ...rest } = payload;
  const fields = Object.entries(rest) as [string, string][];
  return buildSignature(fields, passphrase) === signature;
}
