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

## Gotchas

- SSR HTML splits JSX text with `<!-- -->`, so grep for fragments
  (`Hi, <!-- -->Thandiwe`), not the full rendered sentence.
- The dev-tools indicator (bottom-left "N") may show a transient "1 Issue"
  badge from compiles that happened while files were mid-edit; confirm with a
  fresh context + console/pageerror listeners before treating it as real.
