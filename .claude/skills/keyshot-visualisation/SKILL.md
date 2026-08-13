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
