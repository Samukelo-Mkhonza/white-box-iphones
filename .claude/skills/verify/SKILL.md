---
name: verify
description: How to build, run and drive this Next.js store app to verify changes end-to-end.
---

# Verifying changes in white-box-iphones

Next.js 16 (App Router, Turbopack) + Prisma/SQLite store. Dev server is usually
already running on http://localhost:3000 (`npm run dev` if not — check with
`curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/`).

## Database

SQLite at `prisma/dev.db` (`DATABASE_URL=file:./dev.db`). Seeded users:
- `admin@whitebox.co.za` (ADMIN)
- `customer@example.com` (CUSTOMER, name "Thandiwe Nkosi")

## Authenticated pages (/account, /admin)

Auth is a `session_token` cookie backed by the `Session` table. Skip the login
form — mint a session directly:

```js
// node --input-type=module -e "..."
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const user = await prisma.user.findUnique({ where: { email: 'customer@example.com' } });
const token = 'verify-' + Date.now().toString(36);
await prisma.session.create({ data: { userId: user.id, token, expiresAt: new Date(Date.now() + 3600_000) } });
```

Then `curl -H "Cookie: session_token=<token>" http://localhost:3000/account`.
Clean up afterwards: `prisma.session.deleteMany({ where: { token: { startsWith: 'verify-' } } })`
and delete any test orders/wishlist rows you created.

## Screenshots

No Playwright browsers installed, but system Chrome exists. Use `playwright-core`
(install in the scratchpad, not the repo) with
`executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"`.
Write scripts to files — inline `node -e` mangles the backslashes in the path.

Dark mode is a `.dark` class on `<html>` driven by `localStorage.theme`; an init
script re-applies it from localStorage on load, so in Playwright set
`localStorage.setItem('theme', 'dark')` in `addInitScript` (adding the class
alone gets reverted).

## Cart-gated pages (/checkout)

/checkout redirects to /cart when the cart is empty. Carts are keyed by a
`cart_token` cookie mapped to `Cart.sessionToken`. Mint one directly:
create `prisma.cart` with a `sessionToken`, add `cartItem` rows pointing at
real `productVariant` ids, then send `Cookie: cart_token=<token>`. Clean up
cart items before the cart (FK).

## Verifying the catalogue PDF (/catalogue/download)

`pdf-parse@1.1.1` (scratchpad install) extracts text + page count. For a
visual check, render with `pdfjs-dist@3.11.174`: write an HTML file that
loads `node_modules/pdfjs-dist/legacy/build/pdf.js`, draws pages to canvases,
open it via `file://` in Chrome (`--allow-file-access-from-files`), and
screenshot the canvas elements.

## Gotchas

- SSR HTML splits JSX text with `<!-- -->`, so grep for fragments
  (`Hi, <!-- -->Thandiwe`), not the full rendered sentence.
- The dev-tools indicator (bottom-left "N") often shows a "1 Issue" badge
  that is just Next's dev-only LCP warning (above-the-fold `next/image`
  without `loading="eager"`), pre-existing site-wide. Confirm with a fresh
  context + console/pageerror listeners before treating it as real.
- Product `series` values include the word "Series" ("iPhone 14 Series");
  a hand-built `/shop?series=iPhone+14` URL matches nothing.
- Next injects an always-present empty `div[role="alert"]`
  (`__next-route-announcer__`); scope alert locators (e.g.
  `form div[role="alert"]`) or Playwright reads/strict-matches the wrong one.
