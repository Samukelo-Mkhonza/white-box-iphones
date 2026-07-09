# Releasing

Releases are fully automated. You don't cut a release by hand — you merge to `main`, and the pipeline takes it from there.

## The pipeline

Every push to `main` (usually a merged pull request) runs three chained GitHub Actions workflows. Each stage only runs if the previous one succeeded, so a release always marks code that is actually live in production:

```
push to main
    │
    ▼
CI (.github/workflows/ci.yml)
    lint → typecheck → build
    │
    ▼
Deploy (.github/workflows/deploy.yml)
    remote Vercel production build & deploy
    │
    ▼
Release (.github/workflows/release.yml)
    tag the deployed commit → publish a GitHub Release
```

The Deploy workflow is the **only** production deploy path — Vercel's own Git auto-deploys for `main` are disabled in [vercel.json](vercel.json) so that nothing reaches production without passing CI.

## Versioning

Tags follow `vMAJOR.MINOR.PATCH` (semver). The Release workflow:

- **Automatically bumps the patch version** after each successful deploy (e.g. `v0.1.3` → `v0.1.4`), starting from `v0.1.0`.
- **Skips** commits that already carry a `v*` tag, so re-runs never double-release.
- **Generates release notes** from the merged pull requests since the previous tag.

### Minor and major bumps

For a minor or major bump, trigger the Release workflow by hand:

1. Go to **Actions → Release → Run workflow** on GitHub.
2. Pick the bump level (`minor` or `major`) and run it from `main`.

The manual run tags the current tip of `main`, and subsequent automatic patch releases continue from the new tag.

## Secrets and infrastructure

Deploys need three GitHub Actions secrets, stored in the `production` environment:

| Secret | Purpose |
| --- | --- |
| `VERCEL_TOKEN` | Vercel API token used by the Vercel CLI |
| `VERCEL_ORG_ID` | The Vercel team/org the project belongs to |
| `VERCEL_PROJECT_ID` | The Vercel project to deploy |

Application env vars (`TURSO_DATABASE_URL`, `AUTH_SECRET`, `PAYFAST_*`, …) are **not** GitHub secrets — they live in the Vercel project settings and are injected during Vercel's remote build. See the comments in [deploy.yml](.github/workflows/deploy.yml) for why the build must run remotely on Vercel rather than on the GitHub runner.

## Checking what's live

- The latest [GitHub Release](https://github.com/Samukelo-Mkhonza/white-box-iphones/releases) always points at the commit currently in production.
- Deploy history and logs are available in both the repo's Actions tab and the Vercel dashboard.

## If something goes wrong

- **CI failed:** nothing was deployed or released. Fix the issue on a branch and merge again.
- **Deploy failed:** no release was created. Check the Deploy run's logs and the Vercel dashboard, then re-run the workflow from the Actions tab once fixed.
- **Bad code reached production:** revert the offending commit on `main` (`git revert`) and merge — the pipeline will deploy and release the revert like any other change.
