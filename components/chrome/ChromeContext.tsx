/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THE CHROME CONTEXT. Choosing a chrome is the entire act of choosing a
 * palette — this is the wire that makes that true.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * `LightChrome` and `SalesforceChrome` each open a scope. Every shared
 * component inside that scope — `Field`, `Badge`, `Table`, `Callout`,
 * `Checklist`, `ActionLog`, `Button`, `Typography` — reads it and resolves its
 * own tokens from the surrounding playbook. **No shared component takes a
 * colour, a palette or a `chrome` prop.** There is nothing to thread through
 * and nothing to forget, which is the point: one missed prop used to mean a
 * Light-toned status pill on a Salesforce record.
 *
 * ── How to use it ───────────────────────────────────────────────────────────
 * As a screen author: you don't. Wrap the screen in a chrome and compose the
 * vocabulary. That is the whole API.
 *
 * As the author of a shared component: never name a palette. Say
 * `bg-chrome-card`, `text-chrome-weak`, `border-rule border-chrome-border`,
 * `rounded-chrome-card`, `bg-chrome-status-positive text-chrome-on-positive`.
 * The full vocabulary is `chromeColors` in `lib/chrome-theme/chromeContext.js`.
 *
 * ── Why this is an attribute and not React context ──────────────────────────
 * `createContext` does not exist in Server Components, and every component in
 * this repo except `ExportCsv` is one. A React context would mean `"use
 * client"` across the whole UI layer to decide the value of a colour. The
 * cascade already resolves per-subtree, at zero runtime cost, and it nests —
 * which is what lets `TeamsCard` re-scope itself to Teams inside either shell.
 *
 * ── Defaults ────────────────────────────────────────────────────────────────
 * No scope means `keyshot`: the gallery and the visualisation indexes are our
 * own surfaces and keep KeyShot's brand palette. That default lives on `:root`
 * in `tailwind.config.cjs`, so there is nothing to wrap them in.
 */

/**
 * The scopes. `light` and `salesforce` are the two playbooks a screen picks
 * between; `keyshot` is the default for our own surfaces; `teams` is opened by
 * `TeamsCard` alone, for a third-party card that belongs to neither playbook.
 */
export type Chrome = "keyshot" | "light" | "salesforce" | "teams";

/**
 * Opens a chrome scope. Spread onto the root element of a chrome:
 *
 * ```tsx
 * <div {...chromeScope("light")} className="bg-chrome-card">…</div>
 * ```
 *
 * Only the two chromes and `TeamsCard` should call this. A screen that opens a
 * scope by hand is choosing a palette without choosing a shell, which is the
 * mismatch this whole layer exists to prevent.
 */
export function chromeScope(chrome: Chrome): { "data-chrome": Chrome } {
  return { "data-chrome": chrome };
}
