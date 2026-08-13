@AGENTS.md

# KeyShot ACE — prototype screens

This repo holds **future-state UI prototypes** for the KeyShot ACE engagement. Each screen is a
static Next.js page showing how a KeyShot workflow *could* work, drawn inside the application
chrome its real users would recognise. The screens are projected in a workshop and argued over.

There is no backend, no database, no auth, no data fetching. Every screen is a server component
rendering hardcoded props. If you find yourself adding an API route, stop — you have
misunderstood the task.

Run index is `app/page.tsx`. The worked example that shows the whole vocabulary is
**`app/fallback/page.tsx`** — read it before building anything.

---

## The six hard constraints

These come from the client. They are not style preferences and they are not negotiable. A PR
that violates one is wrong even if it looks good.

**1. Anything the sales team touches renders in Salesforce chrome, not Light.**
KeyShot's sales team lives in Salesforce all day. A quote, an opportunity, an approval, an
account view — if a salesperson is the user, wrap it in `SalesforceChrome`. A Light-side quote
screen aimed at sales is dead on arrival in the workshop; the room stops listening. `LightChrome`
is for finance and back-office users only.

**2. Never emit a PO-block.**
A missing purchase order is a **warning**, never a gate. Plenty of legitimate KeyShot business is
quoted and invoiced before a PO number exists. Warn the user with `<Callout tone="warning">` and
let them proceed. Never disable a "Send quote" / "Submit" action because a PO field is empty.
Warn-and-acknowledge, always.

**3. Any audit or log screen must be exportable by the user.**
If a screen shows a history, an audit trail, an activity feed or a log, it carries an export
control. Compose `ExportCsv` (`ActionLog` already does this for you). A log the user cannot get
out of the system is a complaint waiting to happen.

**4. Microsoft Teams, never Slack.**
This client runs on Microsoft Teams. Use `TeamsCard` for notification mock-ups. The word "Slack"
must not appear anywhere in this repo — not in code, not in comments, not in example strings.

**5. No subscription management.**
Chargebee is explicitly out of scope for this engagement. No plan pickers, no billing-cycle
management, no upgrade/downgrade flows.

**6. Never promise unshipped product.**
Screens show capability that exists or is committed. Do not invent a feature to make a screen
land better. When you need a plausible value to make a screen legible, that is what the
Illustrative provenance marker is for — see below.

A `PostToolUse` hook (`.claude/hooks/check-constraints.sh`) enforces constraints 4, 5, part of 2,
and the colour rule mechanically, and hands you the failure mid-run so you can self-correct.

---

## Provenance: the rule that governs every value on screen

**`components/ui/Field.tsx` is the most important file in this repo. Read it.**

These prototypes get shown to a client. Some numbers on them are real; some are invented so the
screen reads as a screen. If the client cannot tell those apart, the prototype manufactures
agreement about facts nobody established. So every displayed value carries a marker:

| Marker | Meaning | Helper |
|---|---|---|
| `V` | **Verified** — from a real KeyShot artefact or workshop transcript | `V("…")` |
| `I` | **Inferred** — a defensible derivation from something verified | `I("…")` |
| `X` | **Illustrative** — invented to make the screen legible | `X("…")` |

`Field` renders an amber **Illustrative** chip automatically when `p === "X"`. There is no prop to
suppress it. That is the point: a screen author cannot forget.

```tsx
import { Field, V, I, X } from "@/components/ui/Field";

<Field label="Account"      value={V("Northwind Design Group")} />
<Field label="Owner"        value={I("Priya Raman")} hint="Inferred from the opportunity" />
<Field label="Annual value" value={X("£61,400")} />   {/* auto-badged */}
```

**The rule: every value a reader might mistake for a fact routes through `Field` or `FieldValue`.**
`Table` cells, `TeamsCard` facts, `ActionLog` entries and `Checklist` notes all accept
`ProvenancedValue` and badge it for you. If you are interpolating a data value straight into JSX —
`<span>{invoice.total}</span>` — stop. That is the exact bug this design prevents.

Static chrome is *not* data: column headings, button labels, nav items, section titles and fixed
verb phrases need no `Field`.

When in doubt, mark it `X`. Over-badging costs nothing; under-badging costs the client's trust.

---

## Component vocabulary

Build screens from these. Do not hand-roll a div with Tailwind classes when one of these fits, and
do not add a UI dependency — everything here is React + Tailwind + `lucide-react`.

### Chrome — pick exactly one per screen

| Component | Use when |
|---|---|
| `chrome/SalesforceChrome` | **Sales-facing.** Quotes, opportunities, approvals, accounts. Props: `objectType`, `recordTitle`, `appName`, `tabs`, `actions`. |
| `chrome/LightChrome` | **Finance / back-office.** Invoices, ledger, entities. Props: `title`, `nav`, `actions`, `workspace`. |

### UI

| Component | Use when |
|---|---|
| `ui/Field` | Any labelled data value. The provenance gate. Exports `Field`, `FieldValue`, `V`/`I`/`X`. |
| `ui/Typography` | All text. `size` + `bold`; never hand-roll `text-sm font-bold`. |
| `ui/Button` | Actions. `intent`: `primary` \| `secondary` \| `outline` \| `ghost`. Non-functional in prototypes. |
| `ui/Badge` | Short status pills. Also exports `StatusBadge` + `STATUS_LABELS`. |
| `ui/Table` | Tabular data. Columns take an optional `lucide` `icon` rendered before the header text — use it. Cells that are `ProvenancedValue` auto-badge. |
| `ui/Checklist` | Readiness criteria, approval steps, "what's outstanding". |
| `ui/Callout` | Inline advisory. **The warn-and-acknowledge component** — see constraint 2. |
| `ui/TeamsCard` | Microsoft Teams notification mock-ups. See constraint 4. |
| `ui/ActionLog` | Audit trails and activity feeds. Composes `ExportCsv` — see constraint 3. |
| `ui/ExportCsv` | The export control. The one `"use client"` component in the repo. |

### Status vocabulary

`STATUS_LABELS` in `ui/Badge.tsx` is real finance vocabulary, lifted from Light's ledger.
**`ARCHIVED` renders as "Void", never "Archived".** Do not "fix" this.

---

## Brand tokens

Full detail and rationale in **`lib/tokens.ts`**; the values live as CSS custom properties in
`app/globals.css` and are exposed as Tailwind utilities via `tailwind.config.cjs`.

| Token | Hex | Role |
|---|---|---|
| `accent` | `#FF6105` | Brand orange. **Fill only.** |
| `accentText` | `#C64B03` | Accent text. Clears 4.5:1. |
| `accentLight` | `#FFB380` | Hovers, decorative rules |
| `accentTint` | `#FFECE1` | Faint washes, selected rows |
| `ink` | `#1D1C1A` | Primary text |
| `text2` | `#54534E` | Secondary text, labels |
| `text3` | `#8B8A84` | Hints, timestamps |
| `hairline` | `#C7C6C0` | Borders, rules |
| `softFill` | `#E5E4DF` | Inert fills, chips |
| `surface` | `#FFFFFF` | Cards, panels |
| `floor` | `#FAFAF8` | Page background |
| `slate` | `#4A5568` | Salesforce-side neutral |

Typeface is **Inter**, loaded in `app/layout.tsx` and wired to `font-sans`.

### The colour rule

> **`#FF6105` must NEVER appear in a `color:` declaration.**

It measures ~3.1:1 on `#FAFAF8` and fails WCAG AA for body text. It is a fill: backgrounds,
borders, rules, chart marks, large icon glyphs. **Accent text is `#C64B03` — `text-accentText`.**
That is the entire reason two accent values exist.

The `text-accent` Tailwind class is deliberately **not generated** (`tailwind.config.cjs` drops
`accent` from `textColor`), so reaching for it fails loudly rather than shipping unreadable copy.

```
✅  bg-accent   border-accent   text-accentText
❌  text-accent   style={{ color: "#FF6105" }}
```

Use palette utilities only. No stock Tailwind colours (`text-gray-500`, `bg-blue-50`). The two
documented exceptions are literal third-party chrome — Salesforce blue in `SalesforceChrome.tsx`
and Teams purple in `TeamsCard.tsx` — both commented as such at their definition.

---

## Conventions

- **Next.js App Router**, TypeScript strict, Tailwind 3. **pnpm** — commit the lockfile; the sirius
  install step runs `--frozen-lockfile` and a stale lockfile breaks the run.
- **Server components by default.** `ExportCsv` is the only `"use client"` file, and it should stay
  that way. Prototypes are static; if you reach for `useState`, ask whether the screen needs it.
- Dynamic route params are a **Promise** in this Next version — `const { screen } = await params`.
- Imports use the `@/` alias rooted at the repo. Named exports for components.
- Add a screen: create `app/prototype/<slug>/page.tsx`, then register it in `lib/screens.ts` so it
  appears on the run index. A static route wins over the `[screen]` placeholder automatically.
- `legacy/` holds the retired Python pipeline. Frozen — do not read it for guidance, do not edit it,
  do not import from it.
- Verify with `pnpm build` and `pnpm lint` before finishing. Both must be clean.
- The guard script honours a `guard-ok` marker on a line, used **only** for prose that quotes a
  constraint (four places, all doc comments). Never use it to silence a real violation —
  `git grep guard-ok` makes every use visible in review.
- The hook is a fast nudge inside the run, not the gate. It is escapable by design, because the
  alternative is a guard that flags its own documentation. **The CI constraint scan must not
  honour `guard-ok`** — that layering is what makes the marker safe to have: cheap to satisfy
  mid-run, impossible to smuggle past review.
