"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatZAR } from "@/lib/format";
import { conditionLabel, formatStorage } from "@/lib/products";
import { addToCartAction, buyNowAction } from "@/app/cart/actions";
import { WishlistButton } from "@/components/WishlistButton";
import type { Condition } from "@prisma/client";

type Variant = {
  id: string;
  storageGb: number;
  condition: Condition;
  priceCents: number;
  stockQty: number;
  batteryHealthPct: number;
  sku: string;
};

type ColourwayInput = {
  id: string;
  name: string;
  hexCode: string;
  images: { url: string; altText: string }[];
  variants: Variant[];
};

const CONDITION_ORDER: Condition[] = ["EXCELLENT", "VERY_GOOD", "GOOD"];

export function ProductVariantPicker({
  productId,
  productName,
  colourways,
  minDeliveryDays,
  maxDeliveryDays,
  initialWishlisted,
}: {
  productId: string;
  productName: string;
  colourways: ColourwayInput[];
  minDeliveryDays: number;
  maxDeliveryDays: number;
  initialWishlisted: boolean;
}) {
  const [colourwayId, setColourwayId] = useState(colourways[0]?.id);
  const colourway = colourways.find((c) => c.id === colourwayId) ?? colourways[0];

  const storageOptions = useMemo(
    () => [...new Set(colourway.variants.map((v) => v.storageGb))].sort((a, b) => a - b),
    [colourway]
  );
  const [storageGb, setStorageGb] = useState(storageOptions[0]);

  const conditionsForStorage = useMemo(
    () =>
      CONDITION_ORDER.filter((c) => colourway.variants.some((v) => v.storageGb === storageGb && v.condition === c)),
    [colourway, storageGb]
  );
  const [condition, setCondition] = useState<Condition>(conditionsForStorage[0]);

  const activeStorage = storageOptions.includes(storageGb) ? storageGb : storageOptions[0];
  const activeCondition = conditionsForStorage.includes(condition) ? condition : conditionsForStorage[0];

  const variant = colourway.variants.find(
    (v) => v.storageGb === activeStorage && v.condition === activeCondition
  )!;

  const [imageIndex, setImageIndex] = useState(0);
  const images = colourway.images.length ? colourway.images : [];
  const activeImage = images[Math.min(imageIndex, images.length - 1)];

  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const maxQuantity = Math.min(variant.stockQty, 5) || 1;
  const safeQuantity = Math.min(quantity, maxQuantity);

  function handleAddToCart() {
    setFeedback(null);
    startTransition(async () => {
      await addToCartAction(variant.id, safeQuantity);
      setFeedback("Added to cart.");
      router.refresh();
    });
  }

  function handleBuyNow() {
    setFeedback(null);
    startTransition(async () => {
      await buyNowAction(variant.id, safeQuantity);
    });
  }

  function selectColourway(id: string) {
    setColourwayId(id);
    setImageIndex(0);
    const next = colourways.find((c) => c.id === id)!;
    const nextStorages = [...new Set(next.variants.map((v) => v.storageGb))].sort((a, b) => a - b);
    if (!nextStorages.includes(activeStorage)) {
      setStorageGb(nextStorages[0]);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900">
          {activeImage && (
            <Image
              src={activeImage.url}
              alt={activeImage.altText}
              fill
              unoptimized
              className="object-contain p-10"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setImageIndex(index)}
                className={`h-16 w-16 overflow-hidden rounded-lg border bg-zinc-50 dark:bg-zinc-900 ${
                  index === imageIndex ? "border-foreground" : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                <Image src={image.url} alt={image.altText} width={64} height={64} unoptimized className="object-contain p-2" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{productName}</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          SKU {variant.sku} &middot; {colourway.name}
        </p>

        <p className="mt-4 text-3xl font-bold">{formatZAR(variant.priceCents)}</p>
        <p className={`mt-1 text-sm ${variant.stockQty > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {variant.stockQty > 0 ? `In stock (${variant.stockQty} available)` : "Out of stock"}
        </p>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Colour: {colourway.name}</p>
          <div className="flex flex-wrap gap-2">
            {colourways.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => selectColourway(c.id)}
                title={c.name}
                aria-pressed={c.id === colourway.id}
                className={`h-9 w-9 rounded-full border-2 ${
                  c.id === colourway.id ? "border-foreground" : "border-transparent"
                }`}
                style={{ backgroundColor: c.hexCode }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Storage</p>
          <div className="flex flex-wrap gap-2">
            {storageOptions.map((gb) => (
              <button
                key={gb}
                type="button"
                onClick={() => setStorageGb(gb)}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  gb === activeStorage
                    ? "border-foreground bg-foreground text-background"
                    : "border-zinc-200 dark:border-zinc-700"
                }`}
              >
                {formatStorage(gb)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Condition</p>
          <div className="flex flex-wrap gap-2">
            {conditionsForStorage.map((c) => {
              const conditionVariant = colourway.variants.find(
                (v) => v.storageGb === activeStorage && v.condition === c
              );
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`rounded-lg border px-4 py-2 text-left text-sm ${
                    c === activeCondition
                      ? "border-foreground bg-foreground text-background"
                      : "border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  <span className="block font-medium">{conditionLabel(c)}</span>
                  <span className="block text-xs opacity-80">
                    {conditionVariant?.batteryHealthPct}% battery
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <label htmlFor="quantity" className="text-sm font-medium">
            Qty
          </label>
          <select
            id="quantity"
            value={safeQuantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={variant.stockQty === 0}
            className="rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm dark:border-zinc-700"
          >
            {Array.from({ length: maxQuantity }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isPending || variant.stockQty === 0}
            className="flex-1 rounded-full border border-foreground py-3 text-sm font-medium hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:border-zinc-300 disabled:text-zinc-400 dark:disabled:border-zinc-700 dark:disabled:text-zinc-600"
          >
            {isPending ? "Adding..." : "Add to Cart"}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isPending || variant.stockQty === 0}
            className="flex-1 rounded-full bg-foreground py-3 text-sm font-medium text-background hover:opacity-80 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
          >
            Buy Now
          </button>
        </div>
        {feedback && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{feedback}</p>}

        <div className="mt-4">
          <WishlistButton productId={productId} initialSaved={initialWishlisted} />
        </div>

        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Estimated delivery: {minDeliveryDays}&ndash;{maxDeliveryDays} business days across South Africa.
        </p>
      </div>
    </div>
  );
}
