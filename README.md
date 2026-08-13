# KeyShot ACE — discovery visualisations

Future-state UI visualisations for the KeyShot ACE engagement. A Next.js app that hosts **many
independent visualisations side by side** — one per client discovery transcript. Each is a small
set of static screens showing how a workflow could work, drawn inside the application chrome its
real users would recognise (Salesforce for sales, Light for finance). Built for workshop review.

Visualisations are written into this repo by [sirius](https://github.com/light-space/sirius); see
`.sirius/config.yml` for the repo profile and **`CLAUDE.md`** for the rules that govern every
screen. Read `CLAUDE.md` before changing anything.

## A visualisation is a folder

```
app/visualisations/<slug>/
  meta.ts                 title, client, sourceTranscript, date, blurb
  page.tsx                index of this visualisation's screens
  <screen>/page.tsx       one screen
```

**There is no registry file.** The gallery at `/` reads `app/visualisations/` from disk during
prerender and a visualisation's index reads its own folder the same way, so creating the folder is
the whole act of publishing it.

That is the point. Each visualisation is written by a separate agent run, and the ones already on
the gallery get shown to clients. A central list would be a file every run had to edit — where two
runs collide, and where one bad run breaks work that was already good. Instead each run stays
inside `app/visualisations/<slug>/`, and **that folder is the blast radius**: a broken
visualisation breaks its own route and nothing else. A folder whose `meta.ts` will not load simply
drops off the gallery; every other visualisation still builds and still renders.

## Run it

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Route | What it is |
|---|---|
| `/` | Gallery — a card per visualisation, discovered from `app/visualisations/` |
| `/visualisations/<slug>` | One visualisation's index: its screens |
| `/visualisations/<slug>/<screen>` | A screen |
| `/visualisations/keyshot-reference` | Hand-built reference. Worked example of the whole component vocabulary — start here. |
| `/fallback` | Redirects to the reference visualisation (the old worked-example route) |

```bash
pnpm build        # production build
pnpm lint         # eslint, zero warnings tolerated
pnpm typecheck    # tsc --noEmit
```

## Layout

```
app/
  layout.tsx                 Inter + page floor. Chrome is a per-screen choice.
  page.tsx                   the gallery — cards for every visualisation
  visualisations/
    keyshot-reference/       the hand-built reference visualisation
      meta.ts                title, client, sourceTranscript, date, blurb
      page.tsx               its screen index
      quote-approval/        the worked example screen — read this first
components/
  chrome/                    SalesforceChrome, LightChrome — pick one per screen
  ui/                        Field, Typography, Button, Badge, Table, Checklist,
                             Callout, TeamsCard, ActionLog, ExportCsv
  gallery/                   VisualisationIndex — the shared screen index
lib/
  tokens.ts                  KeyShot brand tokens + the #FF6105 colour rule
  visualisations.ts          filesystem discovery + the ScreenChrome / meta types
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
  `text-accent` class deliberately does not exist. <!-- guard-ok: quoting the rule, not breaking it -->

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
