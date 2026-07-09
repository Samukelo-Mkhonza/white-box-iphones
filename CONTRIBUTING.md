# Contributing

Thanks for your interest in contributing to White Box iPhones! This document explains how to get set up and how changes make their way into production.

## Getting set up

Follow the [Getting started](README.md#getting-started) section of the README. In short:

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

No real credentials are needed — the defaults use a local SQLite database and the PayFast sandbox.

## Development workflow

1. **Create a branch off `main`.** Use a short, descriptive name with a type prefix, matching the existing history:
   - `feature/…` for new functionality (e.g. `feature/dark-mode-and-cicd-pipeline`)
   - `fix/…` for bug fixes (e.g. `fix/deploy-remote-build`)
   - `docs/…` for documentation-only changes
2. **Make your changes.** Keep commits focused; write commit messages in the imperative mood ("Add cart page", not "Added cart page").
3. **Check your work before pushing** — the same checks CI runs:
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
4. **Open a pull request against `main`.** Describe what changed and why. Include screenshots for UI changes.
5. **Wait for CI to pass.** The [CI workflow](.github/workflows/ci.yml) lints, typechecks and builds every pull request. A red build won't be merged.

Merging to `main` triggers a production deploy and an automatic release — see [RELEASING.md](RELEASING.md) — so only merge when the change is ready to go live.

## Guidelines

### Code style

- TypeScript throughout; avoid `any` where a real type is practical.
- Follow the existing patterns: server components and server actions by default, client components (`"use client"`) only where interactivity requires them.
- Shared UI belongs in `components/`; server-side logic (database queries, payments, auth) belongs in `lib/`.
- Styling uses Tailwind utility classes and the theme tokens defined in `app/globals.css`.
- ESLint is the arbiter of formatting disputes — `npm run lint` must pass.

> **Note:** Per [AGENTS.md](AGENTS.md), the pinned Next.js version may differ from what you (or your AI tooling) expect. Check `node_modules/next/dist/docs/` when in doubt about framework APIs.

### Database changes

- Edit [prisma/schema.prisma](prisma/schema.prisma), then run `npm run db:push` to apply it locally.
- Update [prisma/seed.ts](prisma/seed.ts) if new models or fields need seed data.
- Remember that production runs on Turso — schema changes must be pushed there as part of the rollout.

### Environment variables

If you add a new environment variable:

1. Add it to [.env.example](.env.example) with a comment explaining what it does and a safe default.
2. Document it in the README's environment variables table.
3. Add a placeholder value to the `env` block in [ci.yml](.github/workflows/ci.yml) if the build references it.
4. Add the real value to the Vercel project settings for production.

Never commit `.env`, `.env.local` or any real secret.

## Reporting bugs and requesting features

Open a [GitHub issue](https://github.com/Samukelo-Mkhonza/white-box-iphones/issues) with:

- What you expected to happen and what actually happened
- Steps to reproduce (for bugs)
- Screenshots where relevant

## Questions

Not sure about something? Open an issue and ask — better to discuss an approach before writing the code than after.
