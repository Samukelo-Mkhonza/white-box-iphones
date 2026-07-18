import Image from "next/image";
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

const trustMarkers = [
  "60-Point Tested",
  "12-Month Warranty",
  "Secure PayFast Checkout",
  "Free Nationwide Delivery",
  "7-Day Returns",
];

function CertifiedBadge({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-full bg-zinc-950/85 px-4 py-2 shadow-xl backdrop-blur ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-3.5 w-3.5 fill-none stroke-emerald-400 stroke-2"
      >
        <path
          d="M2.5 8.5l3.5 3.5 7-8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xs font-medium text-white">60-Point Certified</span>
    </div>
  );
}

function RatingBadge({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-white/80 px-4 py-3 shadow-xl backdrop-blur ${className ?? ""}`}
    >
      <p className="text-sm tracking-widest text-amber-500">★★★★★</p>
      <p className="mt-1 text-xs font-semibold text-zinc-950">
        Loved by verified buyers
      </p>
    </div>
  );
}

function BatteryBadge({ className }: { className?: string }) {
  return (
    <div
      className={`w-44 rounded-2xl bg-white/80 px-4 py-3 shadow-xl backdrop-blur ${className ?? ""}`}
    >
      <div className="flex items-baseline justify-between text-xs font-semibold text-zinc-950">
        <span>Battery health</span>
        <span>92%</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-zinc-200">
        <div className="h-full w-[92%] rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}

function HeroCtas({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Link
        href="/shop"
        className="rounded-full bg-zinc-950 px-8 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
      >
        Shop iPhones
      </Link>
      <Link
        href="/about"
        className="rounded-full bg-white/70 px-8 py-3.5 text-sm font-medium text-zinc-950 backdrop-blur transition-colors hover:bg-white"
      >
        How it works
      </Link>
    </div>
  );
}

export default async function Home() {
  const featured = await getFeaturedProducts(4);

  return (
    <div className="bg-background text-foreground">
      {/* Hero — inset holographic panel, large left-aligned headline */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <div className="holo relative overflow-hidden rounded-3xl px-6 pb-16 pt-20 sm:px-12 sm:pt-28 lg:px-16 lg:pb-28">
          {/* Flagship device showcase — decorative, desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] select-none lg:block"
          >
            {/* Soft glow grounding the device against the gradient */}
            <div className="absolute right-[8%] top-1/2 h-[64%] w-[68%] -translate-y-1/2 rounded-full bg-white/50 blur-3xl" />
            <div className="absolute right-[12%] top-1/2 aspect-[734/909] h-[78%] -translate-y-1/2">
              <Image
                src="/images/hero-iphone-16-pro.png"
                alt=""
                fill
                unoptimized
                preload
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <CertifiedBadge className="hero-float absolute right-[7%] top-[9%]" />
            <RatingBadge className="hero-float absolute left-[2%] top-[34%] [animation-delay:-2s]" />
            <BatteryBadge className="hero-float absolute bottom-[12%] right-[4%] [animation-delay:-4s]" />
          </div>
          <div className="relative text-center lg:text-left">
            <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tighter text-zinc-950 sm:text-6xl lg:mx-0 lg:max-w-[55%] lg:text-7xl">
              The iPhone you love, without the retail markup.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-700 lg:mx-0">
              Certified white-box iPhones, fully tested and fully guaranteed
              &mdash; delivered across South Africa for up to 40% less.
            </p>
            <HeroCtas className="mt-10 hidden flex-wrap gap-3 lg:flex" />
          </div>
          {/* Mobile / tablet showcase — device between copy and CTAs */}
          <div
            aria-hidden
            className="pointer-events-none mt-12 select-none lg:hidden"
          >
            <div className="flex justify-center">
              <CertifiedBadge className="hero-float" />
            </div>
            <div className="relative mx-auto mt-6 aspect-[734/909] w-56 sm:w-64">
              <Image
                src="/images/hero-iphone-16-pro.png"
                alt=""
                fill
                unoptimized
                className="object-contain drop-shadow-2xl"
              />
              <BatteryBadge className="hero-float absolute bottom-16 left-0 -translate-x-1/3 [animation-delay:-3s]" />
            </div>
          </div>
          <HeroCtas className="relative mt-10 flex flex-wrap justify-center gap-3 lg:hidden" />
        </div>
      </section>

      {/* Trust strip — mono caption, evenly spaced greyscale markers */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="eyebrow text-center text-zinc-500 dark:text-zinc-400">
          Trusted by iPhone buyers across South Africa
        </p>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {trustMarkers.map((marker) => (
            <li
              key={marker}
              className="text-sm font-semibold tracking-tight text-zinc-400 sm:text-base dark:text-zinc-500"
            >
              {marker}
            </li>
          ))}
        </ul>
      </section>

      {/* Big statement — full-width dark band */}
      <section className="section-dark">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <h2 className="max-w-3xl text-4xl font-extrabold tracking-tighter sm:text-6xl">
            Certified iPhones that let you skip the price you dread.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            White-box means brand-quality devices sold without retail packaging.
            Every phone is inspected, graded and warrantied before it reaches
            your door.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title} className="border-t border-zinc-800 pt-6">
                <h3 className="font-semibold">{perk.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {perk.body}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/catalogue"
            className="mt-14 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-80"
          >
            Explore the catalogue
          </Link>
        </div>
      </section>

      {/* Featured products — white band */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <p className="eyebrow text-zinc-500 dark:text-zinc-400">In stock now</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tighter sm:text-4xl">
            Ready to ship today.
          </h2>
          <Link
            href="/shop"
            className="shrink-0 text-sm text-zinc-500 transition-colors hover:text-foreground dark:text-zinc-400"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Closing CTA — dark band */}
      <section className="section-dark">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 sm:py-24">
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tighter sm:text-5xl">
            Ready to upgrade for less?
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-medium text-zinc-950 transition-opacity hover:opacity-80"
            >
              Browse phones
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-zinc-700 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:border-zinc-500"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
