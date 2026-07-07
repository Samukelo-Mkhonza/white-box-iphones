const products = [
  {
    name: "iPhone 13",
    storage: "128 GB",
    price: "R8,999",
    tag: "Best value",
  },
  {
    name: "iPhone 14",
    storage: "128 GB",
    price: "R10,999",
    tag: null,
  },
  {
    name: "iPhone 15",
    storage: "128 GB",
    price: "R13,499",
    tag: "Popular",
  },
  {
    name: "iPhone 15 Pro",
    storage: "256 GB",
    price: "R17,999",
    tag: null,
  },
];

const perks = [
  {
    title: "Fully certified",
    body: "Every device is tested across 60+ checkpoints before it ships. Battery health 90% or better, guaranteed.",
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

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="h-16 w-16 text-zinc-300 dark:text-zinc-600"
      aria-hidden="true"
    >
      <rect
        x="13"
        y="4"
        width="22"
        height="40"
        rx="4"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <rect x="20" y="7" width="8" height="2.5" rx="1.25" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">
          White Box <span className="text-zinc-400">iPhones</span>
        </span>
        <nav className="flex gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <a href="#shop" className="hover:text-foreground">
            Shop
          </a>
          <a href="#why" className="hover:text-foreground">
            Why us
          </a>
          <a href="#contact" className="hover:text-foreground">
            Contact
          </a>
        </nav>
      </header>

      <main>
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
          <a
            href="#shop"
            className="mt-8 inline-block rounded-full bg-foreground px-8 py-3 font-medium text-background transition-opacity hover:opacity-80"
          >
            Browse phones
          </a>
        </section>

        <section id="shop" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight">
            In stock now
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <div
                key={p.name}
                className="relative flex flex-col items-center rounded-2xl border border-zinc-200 p-6 text-center transition-shadow hover:shadow-lg dark:border-zinc-800"
              >
                {p.tag && (
                  <span className="absolute right-3 top-3 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {p.tag}
                  </span>
                )}
                <PhoneIcon />
                <h3 className="mt-4 font-semibold">{p.name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {p.storage}
                </p>
                <p className="mt-3 text-xl font-bold">{p.price}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="why" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-8 text-2xl font-semibold tracking-tight">
            Why buy from us
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title}>
                <h3 className="mb-2 font-semibold">{perk.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {perk.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        id="contact"
        className="border-t border-zinc-200 dark:border-zinc-800"
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p className="font-medium text-foreground">White Box iPhones</p>
          <p>Questions? Reach us at hello@whiteboxiphones.example</p>
          <p>&copy; {new Date().getFullYear()} White Box iPhones</p>
        </div>
      </footer>
    </div>
  );
}
