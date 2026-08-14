# The chrome context — one alias layer over three palettes

`lib/light-theme/` is Light's palette. `lib/salesforce-theme/` is SLDS's. `lib/tokens.ts` is
KeyShot's. This folder is the layer that lets a component render correctly in any of them without
being told which one it is in.

It defines one vocabulary — `--chrome-*` — and gives it different values under each
`data-chrome` scope. `LightChrome` and `SalesforceChrome` stamp the attribute; shared components
say `bg-chrome-card` and get whichever surface that playbook uses.

**This layer aliases. It does not originate colour.** Every value is a `var(…)` pointing at one of
the three palettes above. The one exception is the `teams` scope, which has no palette in this repo
to point at — see below.

## Why the cascade rather than React context

`createContext` is unavailable in Server Components, and everything here except `ExportCsv` is one.
A React context would mean `"use client"` on `Field`, `Badge`, `Table`, `Callout`, `Checklist`,
`ActionLog`, `Typography` and `Button` — the entire UI layer hydrated — to decide the value of a
colour. The cascade resolves per-subtree at zero runtime cost, and it nests, which is what lets
`TeamsCard` re-scope itself.

The trade is that a scope is only as good as its coverage: a `--chrome-*` key defined in one scope
and missing from another silently inherits from the enclosing scope. **Add a key to all four
scopes or to none.**

## The four scopes

| Scope | Selector | Palette |
| --- | --- | --- |
| `keyshot` | `:root` (the default) | KeyShot brand — the gallery, indexes, our own framing |
| `light` | `[data-chrome="light"]` | Light's vendored semantic tokens |
| `salesforce` | `[data-chrome="salesforce"]` | SLDS's transcribed tokens |
| `teams` | `[data-chrome="teams"]` | Fluent's Teams light theme, for `TeamsCard` only |

## Three things the scopes are careful about

1. **KeyShot has no status ramp, and one is not invented.** There is no green, no red and no blue
   in `lib/tokens.ts`. Outside a product chrome the nine status tones collapse to neutrals plus the
   accent. That is a signal rather than a defect: a pill that has to distinguish "approved" from
   "void" belongs on a screen, and a screen is inside a chrome.

2. **Salesforce has no nine-tone status ramp either.** SLDS themes success, warning and error and
   leaves everything else a neutral or brand-tinted pill, with the label carrying the meaning. That
   is reproduced rather than corrected — inventing four more Salesforce status colours would be a
   lookalike of something Salesforce does not have. `--sf-badge-*` in
   `lib/salesforce-theme/theme.js` are the names this mapping needs.

3. **`teams` is originated, and says so.** A Teams card looks like Teams wherever it is pinned, so
   it adopts neither playbook and there is no Teams palette here to alias. Its values are Fluent UI
   v9's `teamsLightTheme`, each commented with its Fluent token name — the same posture as
   `lib/salesforce-theme/palette.js`: a small sourced subset rather than a dependency for a dozen
   colours.

## What is deliberately outside the context

**The Illustrative chip.** It is our annotation on someone else's product, not part of either
product's vocabulary, and it means exactly the same thing in both. A caveat that recolours per
screen stops being a recognisable mark. It stays `--ks-illustrative-*` in every scope — see
`components/ui/Field.tsx`.

**`Button intent="magic"`.** Light's pink→purple AI gradient is a Light affordance, not a generic
"AI" treatment. It has no Salesforce equivalent and is not given one.

## Beyond colour

Three non-colour aliases carry as much of the difference as the palettes do:

```
border-rule            0.5px in Light, 1px in Salesforce
rounded-chrome-card    Light's rounded-lg panel, SLDS's 8px card
rounded-chrome-control Light's 6px control, SLDS's 4px control
```

Light's 0.5px hairline on a flat surface and Salesforce's 1px rules on white cards over a grey
floor are the two shells' loudest structural tells. A shared component that hardcodes either one
is wrong in the other shell even when every colour is right.
