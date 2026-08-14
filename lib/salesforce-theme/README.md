# Salesforce's theme layer — transcribed from SLDS

Salesforce chrome in this repo is drawn on **SLDS**, the Salesforce Lightning Design System —
Salesforce's own public design system, and the only source of truth we have for what Lightning
Experience looks like.

- **Docs:** https://www.lightningdesignsystem.com/
- **Package read:** `@salesforce-ux/design-system@2.24.5`, cross-checked against `2.30.4`
  - `assets/styles/salesforce-lightning-design-system.css` — the `:root` styling hooks and the
    component rules
  - `design-tokens/dist/{palettes,radius,font,spacing}.common.js`

## Why transcribed rather than vendored

`lib/light-theme/` is byte-identical to axolotl because we have the repo and the claim being made
is "this is Light". Here there is no repo to copy and no such claim to protect — and the SLDS
package is enormous (the compiled stylesheet alone is megabytes) for a shell that needs about
twenty colours. **Do not add `@salesforce-ux/design-system` as a dependency.** What is needed is a
small honest subset, sourced and dated, which is what `palette.js` and `theme.js` are.

The trade is that this layer can drift and a `diff` will not catch it. So every value carries its
SLDS token name, and the two files are split the way Light's are — raw ramp, then semantic
aliases — so re-checking a value against the source is a single search.

## How the layer is wired

Same two-step as Light's, deliberately:

| Step | Light | Salesforce |
| --- | --- | --- |
| raw values | `colors-new.js` | `palette.js` |
| flattened to CSS variables | `colorsAsVariables.js` → `--new-*` | `paletteAsVariables.js` → `--slds-*` |
| semantic names | `lightTheme.js` → `--surface-level-1`, … | `theme.js` → `--sf-*` |
| Tailwind | `surface` / `text` / `status` / … keys | the `sf` key |

`tailwind.config.cjs` emits both `--slds-*` and `--sf-*` on `:root` in the same `addBase` call as
Light's tokens, and registers `sf` in `theme.extend.colors`. So a screen says `bg-sf-card`,
`text-sf-weak`, `border-sf-border`, `rounded-sf-lg`, `font-slds` — **semantic names, no hexes at
the call site.** The three namespaces never collide: `--ks-*` is KeyShot's brand, Light's vendored
names are unprefixed (`--surface-level-1`), `--sf-*` is this.

Unlike Light's, this layer has no dark variant. Lightning Experience's dark theme is not something
we can verify, and a prototype does not need it.

## Reading SLDS's numbering

**In SLDS a lower number is darker.** `brand-10` is the near-black navy `#001639`; `brand-100` is
white. That is the reverse of most ramps, and it is preserved here rather than normalised so a
value can be checked against the SLDS source without translating it first.

## Four places SLDS does not transfer cleanly

Recorded because each one is a place a plausible-looking guess is wrong.

1. **SLDS disagrees with itself about the border colour.** The compiled CSS carries
   `var(--slds-g-color-border-base-1, #e5e5e5)` in ~120 rules, but the `:root` block defines that
   hook as `#c9c9c9` — so the fallback is stale and never wins at runtime. We keep both:
   `--sf-border` is `#e5e5e5`, the hairline between cards and rows, and `--sf-border-strong` is
   `#c9c9c9` for button and input outlines. That split reads correctly and matches Lightning
   screenshots; it is a judgement, not a token.

2. **The toast themes do not resolve to the reds and oranges you would expect.**
   `.slds-theme_error` points at `error-base-40` = `#ba0517`, not the `#ea001e` sitting right next
   to it as an inline fallback; `.slds-theme_warning` resolves to `#dd7a01`, not `#fe9339`; and
   `.slds-theme_info` is neutral `#747474`, not blue. `--sf-status-*` uses the resolved values.
   `#ea001e` survives as `--sf-border-error`, which is what it is actually for.

3. **The Path's "complete" stage is green (`#3ba755`), not blue.** Almost every Path lookalike
   paints completed stages brand blue. SLDS does not — and the green is hardcoded in
   `.slds-path__item.slds-is-complete` rather than drawn from a named ramp step, which is why
   `palette.js` records it with a comment instead of pretending it is `success-60`.

   SLDS also distinguishes `is-current` (the record's real stage: white, with a 2px `#014486`
   outline) from `is-active` (the stage the user has clicked into: solid `#014486`). A static
   prototype has no clicking, so the two collapse and `Path` renders the current stage the way
   SLDS renders `is-active`. That is a deliberate simplification, not an error.

4. **Spacing and type are already in Tailwind, so they are not duplicated here.** SLDS's spacing
   scale is 2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 px, which lands exactly on Tailwind's default
   `0.5 1 2 3 4 6 8 12`. Registering a parallel `sf-` spacing scale would add a second way to say
   the same thing. Likewise the type ramp: `ui/Typography`'s existing sizes hit 10 / 12 / 14 / 16 /
   24 px (`2xs` / `xs` / `sm` / `base` / `2xl`), so Salesforce screens keep using `Typography` and
   no `text-sf-*` size utilities exist — which also avoids `tailwind-merge` mistaking a font-size
   class for a colour. The ramp is still emitted as `--sf-font-size-*` for the record.

   One honest gap: SLDS's real body size is **13px** (`.slds-text-body_regular` is `0.8125rem`) and
   its `heading_large` is 28px. Neither is on Tailwind's ladder. We use 14px and 24px. It is a
   point of drift, and a small one, but it is drift.

## Re-checking a value

```bash
V=2.24.5
curl -s "https://unpkg.com/@salesforce-ux/design-system@$V/assets/styles/salesforce-lightning-design-system.css" \
  | grep -o -- '--slds-g-color-brand-base-[0-9]*: *#[0-9a-f]*' | sort -u
```

Trust the `:root` block, never the inline `var(…, #fallback)`. If a value moves, update
`palette.js` and the version at the top of this file together.
