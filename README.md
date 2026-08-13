# KeyShot ACE — prototype screens

Future-state UI prototypes for the KeyShot ACE engagement. A Next.js app of static screens
showing how KeyShot workflows could work, each drawn inside the application chrome its real
users would recognise (Salesforce for sales, Light for finance). Built for workshop review.

Screens are written into this repo by [sirius](https://github.com/light-space/sirius); see
`.sirius/config.yml` for the repo profile and **`CLAUDE.md`** for the rules that govern every
screen. Read `CLAUDE.md` before changing anything.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Route | What it is |
|---|---|
| `/` | Run index — every screen registered in `lib/screens.ts` |
| `/fallback` | Worked example of the whole component vocabulary. Start here. |
| `/prototype/<slug>` | A prototype screen; unregistered slugs render a placeholder |

```bash
pnpm build        # production build
pnpm lint         # eslint, zero warnings tolerated
pnpm typecheck    # tsc --noEmit
```

## Layout

```
app/
  layout.tsx                 Inter + page floor. Chrome is a per-screen choice.
  page.tsx                   run index
  fallback/page.tsx          worked example / component gallery
  prototype/[screen]/        slot new screens land in
components/
  chrome/                    SalesforceChrome, LightChrome — pick one per screen
  ui/                        Field, Typography, Button, Badge, Table, Checklist,
                             Callout, TeamsCard, ActionLog, ExportCsv
lib/
  tokens.ts                  KeyShot brand tokens + the #FF6105 colour rule
  screens.ts                 screen registry backing the run index
  cn.ts                      tailwind-merge helper
.sirius/config.yml           sirius repo profile
.claude/                     settings.json + the constraint hook
legacy/                      retired Python pipeline (frozen — do not edit)
docs/ knowledge_base/        engagement material
prototypes/ outputs/         generated artefacts (gitignored)
```

Two things to know before editing:

- **`components/ui/Field.tsx` is load-bearing.** Every value on screen carries a provenance marker
  (`V`erified / `I`nferred / `X` illustrative) and `Field` badges illustrative values automatically,
  so no unsourced number reaches a client unlabelled.
- **`#FF6105` is fill-only** — it fails contrast as text. Accent text is `#C64B03`. The
  `text-accent` class deliberately does not exist.

## Deployment (Vercel)

Next.js is zero-config on Vercel, so there is no `vercel.json` — adding one would only override
sensible defaults. The build is a plain `next build` with the pnpm lockfile committed.

**A human has to do these once, in the Vercel dashboard.** They cannot be done from this repo.
`light-space/landingpage` is the existing precedent — mirror its settings.

1. **Create the project under the `light-space` org** (not a personal account) and link it to the
   `light-space/ACE-automeet` GitHub repo. Framework preset: Next.js. Install command:
   `pnpm install --frozen-lockfile`.
2. **Enable preview deployments on pull requests**, so each sirius PR gets a URL a reviewer can
   click. This is the main way screens get reviewed.
3. **Set `ANTHROPIC_API_KEY`** in Project Settings → Environment Variables.

> Note: the app itself does not read `ANTHROPIC_API_KEY` — every screen is static and there is no
> backend. It is set for the agent tooling that writes into this repo. If a screen ever needs a
> server-side secret, that is a signal to re-read `CLAUDE.md`, not to add an API route.

Once preview deploys are on, `.sirius/config.yml` can grow a `preview:` block so sirius verifies
the deployment before opening a PR. It is deliberately omitted today (a bare `preview:` line is
YAML null and fails the whole config).

## Legacy

`legacy/` holds the Phase 1 Python orchestrator — a FastAPI + Claude Agent SDK pipeline that
turned a meeting transcript into an as-is process map. It is retired, kept for history, and moved
with `git mv` so `git log --follow` still works. Nothing in the Next app depends on it.
