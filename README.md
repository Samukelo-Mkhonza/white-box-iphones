# White Box iPhones

An e-commerce storefront for **White Box iPhones** — certified, warrantied iPhones sold without retail packaging at up to 40% off.

**Live site:** [white-box-iphones.vercel.app](https://white-box-iphones.vercel.app)

## Features

- **Storefront** — homepage, shop and catalogue pages, product detail pages with colourway/variant pickers, FAQ, policies, about and contact pages
- **Cart & checkout** — session-based cart, checkout with [PayFast](https://payfast.io) payments (sandbox-ready out of the box), order tracking
- **Customer accounts** — registration and login, order history, wishlists, product reviews
- **Admin dashboard** — manage products, orders, customers, reviews, discount codes and store settings, with a revenue chart
- **Dark mode** — theme toggle with system preference detection

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router) with React and TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Database | [Prisma](https://www.prisma.io) ORM — SQLite locally, [Turso](https://turso.tech) (libSQL) in production |
| Payments | PayFast (South African payment gateway) |
| Hosting | [Vercel](https://vercel.com), deployed via GitHub Actions |

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# 1. Install dependencies (also runs `prisma generate`)
npm install

# 2. Create your environment file
cp .env.example .env

# 3. Create the local SQLite database and seed it with products
npm run db:push
npm run db:seed

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

The default `.env.example` values work as-is for local development: the database is a local SQLite file and PayFast uses its publicly documented sandbox merchant, so you can test checkout end to end without any real credentials.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Local SQLite file used in development (`file:./dev.db`) |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | Hosted Turso database — only needed in deployed environments; leave unset locally |
| `AUTH_SECRET` | Secret used to sign auth sessions |
| `PAYFAST_MERCHANT_ID` / `PAYFAST_MERCHANT_KEY` / `PAYFAST_PASSPHRASE` | PayFast merchant credentials (sandbox test values by default) |
| `PAYFAST_SANDBOX` | `true` to use the PayFast sandbox, `false` for live payments |
| `NEXT_PUBLIC_SITE_URL` | Base URL used for PayFast return/cancel/notify callbacks |

See [.env.example](.env.example) for the full annotated list.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:seed` | Seed the database with brands, products and demo data |
| `npm run db:studio` | Open Prisma Studio to browse the database |
| `npm run db:reset` | Reset the database and re-seed it |

## Project structure

```
app/            Routes (App Router): storefront, cart, checkout, account, admin, API
components/     Shared React components (forms, product cards, header/footer, …)
lib/            Server-side logic: auth, cart, payments, products, Prisma client
prisma/         Schema, seed script and local dev database
.github/        CI, deploy and release workflows
```

## Deployment

Every push to `main` flows through three chained GitHub Actions workflows:

1. **CI** ([ci.yml](.github/workflows/ci.yml)) — lint, typecheck and build
2. **Deploy** ([deploy.yml](.github/workflows/deploy.yml)) — remote Vercel production build, only if CI passed
3. **Release** ([release.yml](.github/workflows/release.yml)) — tags and publishes a GitHub Release for the deployed commit

Production uses Turso instead of local SQLite because Vercel's filesystem is ephemeral (see [lib/prisma.ts](lib/prisma.ts)).

## Contributing & releases

- [CONTRIBUTING.md](CONTRIBUTING.md) — how to set up, branch, and open pull requests
- [RELEASING.md](RELEASING.md) — how versioning and the automated release pipeline work
