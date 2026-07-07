import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const perks = [
  {
    title: "Fully certified",
    body: "Every device is tested across 60+ checkpoints before it ships. Battery health 80% or better, guaranteed.",
  },
  {
    title: "12-month warranty",
    body: "Something goes wrong? We repair or replace it, no questions asked, for a full year.",
  },
  {
    title: "Why white box?",
    body: "Same iPhone, minus the retail packaging and markup. You save up to 40% off retail price.",
  },
];

export default async function Home() {
  const featured = await getFeaturedProducts(4);

  return (
    <div className="bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-20 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Certified &middot; Warrantied &middot; Delivered
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl">
          The iPhone you want, without the price you dread.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
          White-box iPhones are brand-quality devices sold without retail
          packaging &mdash; fully tested, fully guaranteed, up to 40% less.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-foreground px-8 py-3 font-medium text-background transition-opacity hover:opacity-80"
        >
          Browse phones
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">In stock now</h2>
          <Link href="/shop" className="text-sm text-zinc-500 hover:text-foreground dark:text-zinc-400">
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">Why buy from us</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title}>
              <h3 className="mb-2 font-semibold">{perk.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{perk.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
