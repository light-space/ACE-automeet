---
name: keyshot-visualisation
description: Turns a client discovery transcript into a KeyShot ACE visualisation. Use when building a visualisation from a discovery transcript, meeting recording, or workshop notes. Use when asked to draw a future-state workflow as screens, or when a request names a visualisation slug. Use when adding or revising screens for a client workshop. Use when working anywhere in app/visualisations/.
---

# Building a visualisation from a transcript

`CLAUDE.md` is the reference: the six hard constraints, the provenance markers, the component
vocabulary, the folder rules, the brand tokens. Read it. This skill is the *procedure* — how you
get from a raw transcript to a folder that earns its place in the workshop.

## The judgement that decides whether this works

**Specificity beats polish.** A rough screen carrying the client's own vocabulary, their real
amounts, their real system names and their real job titles will start an argument in the room —
which is the whole point of projecting it. A beautifully composed screen full of "Acme Corp",
"$10,000" and "Approver 1" gets a nod and no engagement. When you have to choose between making a
screen prettier and making it more specific, make it more specific.

**The one failure you cannot recover from is stating an invented number as though it were
established fact.** A client who spots one unmarked invention stops trusting every number on every
screen, including the true ones. That is what the `X` marker exists to prevent, and why
over-badging is free and under-badging is not.

## Procedure

### 1. Read the transcript end to end before writing anything

All of it, in one pass, before you form an opinion about what the screens are. Discovery calls
bury the real pain in an aside forty minutes in, after the participant has relaxed. If you start
designing from the first ten minutes you will build the process they described, not the one they
actually run.

Note as you read: names of systems, exact amounts, document names, job titles, turnaround times,
the phrases they repeat. That vocabulary is your raw material and it is the thing you cannot
invent later.

### 2. Extract the as-is process

Write down, for yourself, the current flow: who does what, in what order, on which system, and
where it breaks. Every step must be traceable to something someone actually said. If a step is
needed to make the flow make sense but nobody described it, mark it as your inference now — that
decision propagates straight into the provenance markers in step 5.

Be specific about breakage. "The approval is slow" is not a pain point you can draw. "Finance
re-keys the quote total into the invoice by hand because the two systems do not talk, and it goes
wrong on multi-currency deals" is.

### 3. Choose the moments worth showing

**How many screens is decided by the transcript, not by a fixed number.** Some transcripts carry
one sharp pain point and deserve two screens; some carry a five-handoff process and deserve five.
Do not pad to hit a count, and do not compress a genuinely multi-actor process into one screen to
look tidy.

A screen earns its place by making one specific pain point concrete — by showing the moment where
today's process costs someone something, and what it would look like if it didn't. If you cannot
name the pain point a screen is carrying, cut it. Two screens that each land beat four where two
are filler.

Order them the way the work flows, so the index reads as a story.

### 4. Decide chrome per screen, from who the user is

Per screen, ask who is sitting in front of it, then pick from `CLAUDE.md`'s constraint 1: sales
users get `SalesforceChrome`, finance and back-office users get `LightChrome`. The question is
never which system the *data* lives in — it is whose day this screen is part of. A salesperson
looking at an invoice status is still a salesperson, and still gets Salesforce chrome.

If a single screen genuinely serves two different users, that is usually a sign it is two screens.

Chrome also decides your class vocabulary, because the two products do not share a palette.

A **Light** screen composes `LightChrome` + `DetailSheet` + `Table` + `Field` / `Badge` / `Button` /
`Typography`, and every class on it is one of Light's own semantic tokens — `bg-surface-level-1`,
`text-text-secondary`, `border-b-0.5 border-border-secondary`, `bg-status-positive`,
`bg-button-primary`. Those are not lookalikes: `lib/light-theme/` is copied byte-identical from
Light's production frontend, so a screen written this way says exactly what production says. Light
has **no brand orange** — neutral greys, a yellow selection accent, a pink→purple AI gradient
(`Button intent="magic"`).

A **Salesforce** screen composes `SalesforceChrome` + `Path` / `RelatedList` / `DetailGrid` /
`Toast` from `components/salesforce/`, and every class on it is one of SLDS's tokens —
`bg-sf-card`, `text-sf-weak`, `border-sf-border`, `rounded-sf-lg`, `font-slds`. Those come from
`lib/salesforce-theme/`, transcribed from the public Salesforce Lightning Design System. Give a
staged record a `Path`; it is the element that makes a screen unmistakably Salesforce.

**KeyShot's `#FF6105` / `#C64B03` go on neither shell.** They are for our own surfaces — the
gallery, callouts, the framing round a screen. A customer's product painted in the consultant's
brand colour is a mock-up of something that does not exist, and the room can tell: mocking a
client's tools means the tools look like their tools. `ActionLog` takes a `chrome` prop for this
reason — pass the shell the screen is in.

One thing to be honest about on the Salesforce side: KeyShot's quoting in Salesforce is
**custom-coded, not standard CPQ**. The chrome is accurate; any quote field layout you draw is
your inference, and the `V`/`I`/`X` markers on individual fields cannot say that. Put it in
`DetailGrid`'s `note`, the way `quote-approval/` does.

Either way: **inventing a colour or hand-rolling a bespoke layout is wrong, not a judgement call.**
If a shape you need is not in the vocabulary, compose the shapes that are. Reaching for a raw hex,
a stock Tailwind colour, or a hand-built div-and-border panel means the screen will read as neither
product, which is worse than plain. `CLAUDE.md` lists the full vocabulary.

### 5. Mark provenance honestly, value by value

Go through every value you are about to put on screen and classify it before you write it:

- **`V`** — the value is in the transcript, or in a real artefact you were given. Their words,
  their number. Quote it exactly, including the currency and the spelling of the account name.
- **`I`** — a defensible derivation from something verified. A total you added up from stated line
  items; a role you inferred from a described responsibility. If you could not defend the
  derivation out loud to the client, it is not `I`.
- **`X`** — invented so the screen reads as a screen. Dates, IDs, filler rows, a plausible amount
  where none was stated. `Field` badges these automatically and there is no way to suppress it.

The test for `V` is not "is this plausible" but "can I point at the line in the transcript". If
you find yourself reasoning about whether something is probably true, it is `I` at best. **When
in doubt, `X`.**

### If a context dump is attached

A run may come with a second file alongside the transcript — a context dump: the accumulated
source of truth for this client, assembled from earlier calls and real artefacts. Read it before
you start, and treat it as carrying the same authority as the transcript.

It is already tagged with the same three markers, so they carry straight across: a `[V]` in the
dump is a `V` on screen, `[I]` is `I`, `[X]` is `X`. Do not upgrade a marker because a value looks
solid — the dump has done the sourcing work already, and re-deciding it is how a `[X]` quietly
becomes a fact.

Two things it gives you that a transcript alone does not. **Exact specimens** — real document
number formats, real account names, real amounts, the actual status vocabulary of their systems.
Use them verbatim rather than inventing lookalikes; a real invoice number is the cheapest
specificity available. And **hard constraints** — a context dump usually records what the client
has already rejected. Contradicting one is the fastest way to lose a room, and the dump is often
the only place that knowledge is written down.

Where the transcript and the dump disagree, the transcript wins for anything the client said
today, and say so in your PR description. People change their process between calls, and the
newer statement is the one they will defend in the room.

### 6. Write the folder, then verify

Build the folder exactly as `CLAUDE.md` specifies — `meta.ts`, the two-line `page.tsx`, one
folder per screen with a `screenMeta` export — and stay inside it. Set `sourceTranscript` in
`meta.ts` to the transcript's actual filename so any number on any screen can be traced back.

Then:

```bash
pnpm build     # every route must prerender static (○)
pnpm lint      # zero warnings
```

Both must be clean before you finish. The constraint hook fires as you write; if it hands you a
violation, fix the file rather than working around it.

## Before you call it done

- Every screen names a pain point from the transcript. None is filler.
- Chrome matches the user, not the data.
- No raw value interpolated into JSX — everything a reader could mistake for a fact goes through
  `Field` / `FieldValue`.
- Nothing marked `V` that you cannot point at a transcript line for.
- Any history, log or audit trail on screen is exportable, and a missing purchase order warns and lets the user proceed rather than blocking them — `CLAUDE.md` constraints 2 and 3. <!-- guard-ok: naming the rule, not breaking it -->
- The client's own vocabulary survived. If you renamed their systems or rounded their numbers to
  make things read nicely, put them back.
- Nothing outside `app/visualisations/<slug>/` was touched.
