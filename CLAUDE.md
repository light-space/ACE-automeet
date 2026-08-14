@AGENTS.md

# KeyShot ACE — discovery visualisations

This repo holds **future-state UI visualisations** for the KeyShot ACE engagement. A
*visualisation* is one client discovery transcript turned into a small set of screens: static
Next.js pages showing how a workflow *could* work, drawn inside the application chrome its real
users would recognise. They are projected in a workshop and argued over.

The app hosts many visualisations side by side. Each one is a self-contained folder under
`app/visualisations/`. The gallery at `app/page.tsx` lists them all.

There is no backend, no database, no auth, no data fetching. Every screen is a server component
rendering hardcoded props. If you find yourself adding an API route, stop — you have
misunderstood the task.

The worked examples that show the whole vocabulary are the two screens in
**`app/visualisations/keyshot-reference/`** — `quote-approval/` in Salesforce chrome and
`invoice-review/` in Light's. Read both before building anything.

---

## Building a visualisation

> **The one rule that governs everything else: work only inside
> `app/visualisations/<slug>/`. Never edit a file outside your visualisation's folder.**

You will be told a slug. Create that folder and put everything you write inside it:

```
app/visualisations/<slug>/
  meta.ts                 what this visualisation is: title, client, sourceTranscript, date, blurb
  page.tsx                the index of this visualisation's screens (a two-liner, see below)
  <screen>/page.tsx       one screen — as many folders as you need
```

**`meta.ts`** default-exports a `VisualisationMeta`:

```ts
import type { VisualisationMeta } from "@/lib/visualisations";

const meta: VisualisationMeta = {
  title: "Renewal approvals",
  client: "Northwind Design Group",
  sourceTranscript: "northwind-discovery-2026-08-04.txt",
  date: "2026-08-04",              // ISO, the date of the conversation
  blurb: "What the renewals desk asked for, drawn as three screens.",
};

export default meta;
```

**`page.tsx`** is always exactly this — the shared component discovers your screen folders:

```tsx
import { VisualisationIndex } from "@/components/gallery/VisualisationIndex";

export default function Page() {
  return <VisualisationIndex slug="<slug>" />;
}
```

**Each screen** is `app/visualisations/<slug>/<screen>/page.tsx`: a default-exported server
component wrapped in `SalesforceChrome` or `LightChrome`, plus a named `screenMeta` export so the
index knows its title and who it is for. `chrome` here must match the chrome you actually render.

```tsx
import type { ScreenMeta } from "@/lib/visualisations";

export const screenMeta: ScreenMeta = {
  title: "Renewal approval queue",
  blurb: "What a renewals manager sees on Monday morning. Sales-facing.",
  chrome: "salesforce",
};

export default function RenewalQueueScreen() { /* … */ }
```

### Why the folder boundary is absolute

**There is no registry.** The gallery reads `app/visualisations/` from disk during prerender
(`lib/visualisations.ts`), and a visualisation's index reads its own folder the same way. Adding a
folder is the entire act of publishing a visualisation.

That design exists to protect the visualisations already built. Every visualisation is written by
a separate run from a separate transcript, and the ones already on the gallery are shown to
clients. If there were a central list, every run would have to edit that one file — two runs would
collide in it, and one bad run could break every visualisation in the repo at once. There isn't,
so it can't.

The corollary is on you: **a file outside your folder is not yours to change.** Not
`lib/visualisations.ts`, not `app/page.tsx`, not a component under `components/`, not this file.
If you believe a shared component needs a change to build your screen, you are almost certainly
wrong — compose what exists. If you are genuinely blocked, say so in the PR description and leave
the shared file alone; a human will decide. Editing outside your folder is how a run that produced
one good visualisation ends up breaking five.

Two small exceptions, and only these: `.sirius/config.yml` and `CLAUDE.md` may be updated by a
human-directed change to the repo's own workflow. Never as a side effect of building a screen.

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
This client runs on Microsoft Teams. Use `TeamsCard` for notification mock-ups. Inside
`app/visualisations/` and `components/` the rule is absolute: the other tool's name must not
appear in a screen, a component, a comment or an example string. Showing a client a mock-up of a
tool they do not use says you were not listening.

The repo's own operational docs (`README.md`, this file) necessarily name the chat tool *sirius*
is triggered from, which is a different subject. That is the only place the word belongs, and it
is why those lines carry `guard-ok`. If you are writing a screen, the rule is absolute.

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
| `chrome/SalesforceChrome` | **Sales-facing.** Quotes, opportunities, approvals, accounts. The Lightning record page: global header, app nav, record header with the **highlights panel**. Props: `objectType`, `recordTitle`, `appName`, `tabs`, `actions`, `highlights`. |
| `chrome/LightChrome` | **Finance / back-office.** Invoices, ledger, entities. Props: `title`, `nav`, `tabs`, `actions`, `workspace`. |

Choosing one is not just picking a header. It selects the whole playbook everything under it draws
itself from — see "Two playbooks" below.

### Salesforce pieces — only inside `SalesforceChrome`

| Component | Use when |
|---|---|
| `salesforce/Path` | The stage chevron strip. The most recognisable Lightning element — put one on anything with stages. Completed stages are **green**, not blue. |
| `salesforce/RelatedList` | Records belonging to the record on screen. Carries the count and the View All footer, because leaving them out is what makes a lookalike look wrong. |
| `salesforce/DetailGrid` | The Details tab: two-column field grid, label in weak text above value. Its `note` prop states the provenance of the *layout* — see below. |
| `salesforce/Toast` | SLDS's solid-filled action feedback. Not for a PO warning: a toast disappears, and constraint 2 needs a `Callout` that does not. |

### UI

| Component | Use when |
|---|---|
| `ui/Field` | Any labelled data value. The provenance gate. Exports `Field`, `FieldValue`, `V`/`I`/`X`. |
| `ui/Typography` | All text. `size` + `bold`; never hand-roll `text-sm font-bold`. |
| `ui/Button` | Actions. `intent`: `magic` \| `primary` \| `secondary` \| `outline` \| `ghost` \| `delete`. Non-functional in prototypes. |
| `ui/Badge` | Short status pills. `color`: `default` \| `inactive` \| `draft` \| `pending` \| `progress` \| `positive` \| `negative` \| `warning` \| `inverted`. Also exports `StatusBadge` + `STATUS_LABELS`. |
| `ui/Table` | Tabular data. Columns take an optional `lucide` `icon` rendered before the header text — use it. Cells that are `ProvenancedValue` auto-badge. Exports `TableColumnHeader` for a bespoke head. |
| `ui/DetailSheet` | Light's two-column record sheet: sticky `h-16` bar, fields left, source document in a `rounded-2xl bg-surface-level-2` well on the right. The default shape for a finance record. |
| `ui/Checklist` | Readiness criteria, approval steps, "what's outstanding". |
| `ui/Callout` | Inline advisory. **The warn-and-acknowledge component** — see constraint 2. |
| `ui/TeamsCard` | Microsoft Teams notification mock-ups. See constraint 4. |
| `ui/ActionLog` | Audit trails and activity feeds. Composes `ExportCsv` — see constraint 3. |
| `ui/ExportCsv` | The export control. The one `"use client"` component in the repo. |

None of these takes a colour or a palette prop; the chrome they are inside decides. See "Two
playbooks" below.

### Status vocabulary

`STATUS_LABELS` in `ui/Badge.tsx` is real finance vocabulary, lifted from Light's ledger.
**`ARCHIVED` renders as "Void", never "Archived".** Do not "fix" this.

---

## Two playbooks

There are two design playbooks here, and **picking a chrome is the entire act of picking one.**
Wrap the screen in `LightChrome` or `SalesforceChrome` and everything underneath follows —
surfaces, rules, radii, buttons, status tones, the lot.

| | Light playbook | Salesforce playbook |
|---|---|---|
| Pick it when | the user is **finance / back-office** | the user is **sales** |
| Shell | `chrome/LightChrome` | `chrome/SalesforceChrome` |
| Its own pieces | `ui/DetailSheet` | `salesforce/Path` · `RelatedList` · `DetailGrid` · `Toast` |
| Palette | `lib/light-theme/`, vendored byte-identical from axolotl | `lib/salesforce-theme/`, transcribed from public SLDS |
| Class vocabulary | `bg-surface-level-1` `text-text-secondary` `bg-status-positive` | `bg-sf-card` `text-sf-weak` `border-sf-border` `font-slds` |
| Signature | 0.5px hairlines on a flat surface; `rounded-[6px]` → `rounded-lg` → `rounded-2xl` | white cards on the grey `bg-sf-page` floor; 1px rules; system font |
| Has no | saturated brand primary of any kind | KeyShot orange |

**The reason is not aesthetic.** These prototypes claim to show the client their own tools. A
customer's product painted in the consultant's brand colour is a mock-up of something that does not
exist, and the room can tell. Mocking a customer's tools means the tools look like their tools.

### No component takes a colour or a palette prop

The chrome decides. `LightChrome` and `SalesforceChrome` open a **chrome scope**
(`components/chrome/ChromeContext.tsx`), and every shared component inside one — `Field`, `Badge`,
`Table`, `Callout`, `Checklist`, `ActionLog`, `Button`, `Typography`, `ExportCsv` — resolves its own
tokens from the surrounding playbook. The same `<StatusBadge status="APPROVED" />` is a Light
status wash in one shell and a solid SLDS `theme_success` pill in the other, and you write it
identically both times.

So: **if you find yourself wanting to tell a shared component which palette to use, the answer is
that you already did, by choosing the chrome.** There is no `chrome` prop, no `color` prop, no
`palette` prop, and adding one would put back exactly the bug this removed — one screen forgetting
to pass it and shipping a Light-toned pill on a Salesforce record.

Classes you write *on the screen itself* still name the playbook directly (`text-sf-weak` on a
Salesforce screen, `text-text-secondary` on a Light one) — a screen knows which chrome it is.
`chrome-*` classes are for shared components, which do not.

### Inventing a colour, or reaching into the other playbook, is wrong

Not a judgement call. A raw hex, a stock Tailwind colour (`text-gray-500`, `bg-blue-50`), a new
token, or a Light class on a Salesforce screen all produce a screen that reads as neither product,
which is worse than plain. If a shape you need is not in the vocabulary, compose the shapes that
are.

Three exceptions exist and are all documented at their definitions: the **Illustrative chip**,
which is deliberately outside both playbooks because it is our annotation and must look the same in
both; **`Button intent="magic"`**, Light's AI gradient, which has no Salesforce equivalent and
belongs only in Light chrome; and **`TeamsCard`**, which opens its own Teams scope because a Teams
notification looks like Teams wherever it is pinned.

### Light screens use Light's own semantic tokens

`lib/light-theme/` holds five files copied **byte-identical** from Light's production frontend
(axolotl @ `2eeea2714`) — see its `README.md`. `tailwind.config.cjs` maps them to the same class
names production uses, and `<html className="light">` in `app/layout.tsx` selects the light theme
(axolotl's `addBase` puts dark on `:root`, light on `.light`). Do not edit the vendored files.

So a Light screen says exactly what production says:

```
surface   bg-surface-level-0   bg-surface-level-1   bg-surface-level-2
text      text-text-default    text-text-secondary  text-text-tertiary
icon      text-icon-secondary
border    border-border-secondary   border-border-tertiary   border-border-selected
status    bg-status-positive   bg-status-draft   bg-status-pending   bg-status-negative
button    bg-button-primary    bg-button-secondary   bg-button-hover-alt1
```

Two conventions carry the look: **`border-b-0.5`** — the 0.5px hairline, Light's signature rule
weight; a 1px border reads as a different product — and the radius ladder `rounded-[6px]` on
controls, `rounded-lg` on panels, `rounded-2xl` on the document well.

Status tones are background/foreground **pairs** (`bg-status-positive` + `text-text-on-positive`).
Never pass a bare text colour to a badge. `Badge`, `Button` and `Typography` already encode the
right pairs for whichever playbook they are in — compose them rather than restyling.

### Light has no brand orange

Production Light has no saturated brand primary: neutral greys, a yellow selection accent
(`border-border-selected`), and a pink→purple AI gradient (`Button intent="magic"`). Painting Light
chrome in KeyShot orange makes it look *less* like Light, which defeats the point of drawing it.

### Salesforce screens use SLDS's tokens

`lib/salesforce-theme/` holds a small, sourced subset of the **Salesforce Lightning Design
System** — SLDS is public, and it is the only source of truth we have for what Lightning
Experience looks like. There is no Salesforce codebase to vendor from and the SLDS package is not
a dependency here; see that folder's `README.md` for what was read, from which version, and the
four places SLDS does not transfer cleanly.

It is wired the same way Light's is — raw ramp → CSS variables → semantic names → Tailwind — so a
Salesforce screen carries no hexes either:

```
surface   bg-sf-page   bg-sf-card
text      text-sf-text   text-sf-weak   text-sf-link   text-sf-inverse
brand     bg-sf-brand   bg-sf-brand-accessible   bg-sf-brand-deep   border-sf-border-brand
border    border-sf-border   border-sf-border-strong
status    bg-sf-success   bg-sf-error   bg-sf-warning   bg-sf-info
radius    rounded-sf-sm   rounded-sf-md   rounded-sf-lg      type  font-slds
```

Two conventions carry the look: **white cards on the `bg-sf-page` grey floor** with 1px
`border-sf-border` hairlines — the opposite of Light's 0.5px rules on a flat surface — and the
system font stack (`font-slds`), never Inter. `SalesforceChrome` sets both for you.

One thing SLDS does not have: a nine-tone status ramp. Lightning themes success, warning and error
and leaves everything else a neutral or brand-tinted pill, with the **label** carrying the meaning.
`Badge` reproduces that rather than correcting it, so `draft` and `inactive` read alike on a
Salesforce screen. Write the status word you mean and let the pill be quiet.

### What we know about KeyShot's Salesforce, and what we do not

KeyShot's Salesforce quoting is **custom-coded, not standard CPQ** — their Group Finance Manager
said so. So the chrome is accurate (SLDS is SLDS) but **any quote field layout we draw is
inference**: we have never seen their page layout, and there is no standard one to copy.

That is a different kind of invention from an invented value, and the per-field `V`/`I`/`X`
markers cannot express it — every field can be honestly marked and the *arrangement* still be
ours. So say it on the screen: `DetailGrid` takes a `note` for exactly this, and
`quote-approval/` shows the wording. A screen that shows an inferred layout without saying so
reads as a photograph of their system, which is precisely the claim we cannot make.

## KeyShot brand tokens

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
| `slate` | `#4A5568` | Cool neutral for our own surfaces |

Typeface is **Inter**, loaded in `app/layout.tsx` and wired to `font-sans`.

### The colour rule

> **`#FF6105` must NEVER appear in a `color:` declaration.**

It measures ~3.1:1 on `#FAFAF8` and fails WCAG AA for body text. It is a fill: backgrounds,
borders, rules, chart marks, large icon glyphs. **Accent text is `#C64B03` — `text-accentText`.**
That is the entire reason two accent values exist.

The `text-accent` Tailwind class is deliberately **not generated**: `accent` is left out of
`theme.extend.colors` entirely and registered per property (`backgroundColor`, `borderColor`,
`ringColor`, `fill`, `stroke`) — never `textColor`. Reaching for it fails loudly rather than
shipping unreadable copy.

```
✅  bg-accent   border-accent   text-accentText
❌  text-accent   style={{ color: "#FF6105" }}
```

These are the **third** palette, and they are for our own surfaces — the gallery, the visualisation
indexes, the framing round a screen. They are also what the chrome context falls back to when a
shared component renders outside both chromes, which is why a `Badge` on the gallery is a warm
neutral rather than a Light pastel.

Use palette utilities only — KeyShot's on our surfaces, Light's in Light chrome, SLDS's in
Salesforce chrome, `chrome-*` inside a shared component. No stock Tailwind colours
(`text-gray-500`, `bg-blue-50`). The only originated hexes in the repo are Fluent's Teams values in
`lib/chrome-theme/`, each labelled with its Fluent token, because a Teams card is a third product
with no palette here to alias.

---

## Conventions

- **Next.js App Router**, TypeScript strict, Tailwind 3. **pnpm** — commit the lockfile; the sirius
  install step runs `--frozen-lockfile` and a stale lockfile breaks the run.
- **Server components by default.** `ExportCsv` is the only `"use client"` file, and it should stay
  that way. Prototypes are static; if you reach for `useState`, ask whether the screen needs it.
- Dynamic route params are a **Promise** in this Next version — `const { screen } = await params`.
  Visualisations use static route segments, so you should not need params at all.
- Imports use the `@/` alias rooted at the repo. Named exports for components.
- Add a screen: create a folder `app/visualisations/<slug>/<screen>/` containing `page.tsx` with a
  default export and a `screenMeta` export. It appears on the visualisation's index on the next
  build. **There is nothing to register, and nothing outside your folder to edit** — see
  "Building a visualisation" above.
- Every route in this app is prerendered static (`○` in the `next build` output). Discovery reads
  the filesystem at build time; keep it that way — no `cookies()`, `headers()` or `searchParams` in
  a screen, all of which would force it dynamic.
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
