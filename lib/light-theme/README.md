# Light's theme layer — vendored, verbatim

The five `.js` files in this folder are **byte-identical copies** of Light's production
frontend. They are not ours to edit.

| Vendored file          | Source                                              |
| ---------------------- | --------------------------------------------------- |
| `colors.js`            | `src/styles/themes/colors.js`                       |
| `colors-new.js`        | `src/styles/themes/colors-new.js`                   |
| `colorsAsVariables.js` | `src/styles/themes/colorsAsVariables.js`            |
| `lightTheme.js`        | `src/styles/themes/lightTheme.js`                   |
| `darkTheme.js`         | `src/styles/themes/darkTheme.js`                    |

- **Repo:** `light-space/axolotl` (Light's Next.js frontend)
- **SHA:** `2eeea27147762117760f568133a7acb03e0c1042` (2026-08-11)

## Why verbatim

These prototypes are shown to a client as "this is what it would look like in Light".
That claim only holds if the tokens *are* Light's. Keeping the files byte-identical means
drift is a clean `diff` rather than an archaeology exercise, so a re-sync is mechanical.

Nothing was renamed, reordered, recoloured or commented. **Do not add a header comment to
the copied files** — that is what this README is for.

## How the layer is wired

`colorsAsVariables.js` flattens `colors-new.js` into `--new-*` CSS custom properties.
`lightTheme.js` / `darkTheme.js` map Light's *semantic* names (`--surface-level-1`,
`--text-secondary`, `--status-positive`, `--border-secondary`, …) onto those raw values.

`tailwind.config.cjs` reproduces axolotl's `addBase` plugin exactly:

```js
addBase({
  ":root": { ...colorsAsVariables, ...darkTheme },
  ".light": lightTheme,
});
```

`:root` gets **dark**; `.light` gets light. We want light, so `app/layout.tsx` puts
`className="light"` on `<html>` — axolotl's own mechanism. Both themes stay vendored; the
theme choice lives in one attribute, not in an edit to these files.

## One deliberate omission in the Tailwind wiring

axolotl's `colors:` block also spreads the two **raw** palettes (`...colors`,
`...newColors`), which registers utilities like `bg-new-red-500` and, more importantly,
*overrides* Tailwind's stock `gray` / `red` / `blue` / `yellow` / `green` / `purple` /
`orange` scales. This repo's `CLAUDE.md` forbids stock Tailwind colours precisely so that
`text-gray-500` fails to say anything meaningful; silently repointing those scales at
Light's palette would make the wrong thing quietly work.

So `tailwind.config.cjs` registers only the **semantic** keys (`surface`, `text`, `icon`,
`border`, `status`, `button`, `input`, `chart`, `gradient`, `avatar`, `effect`,
`illustration`) — the `var(--…)` layer. The raw palettes are still *loaded* here, because
`colorsAsVariables` needs them to emit the `--new-*` variables that the semantic layer
resolves against. Nothing is lost; only the raw utility classes are.

## Re-syncing

```bash
AX=/path/to/axolotl
for f in colors.js colors-new.js colorsAsVariables.js lightTheme.js darkTheme.js; do
  cp "$AX/src/styles/themes/$f" "lib/light-theme/$f"
done
git diff --stat lib/light-theme
```

Then update the SHA above, and check `tailwind.config.cjs` for semantic keys that were
added or removed upstream.
