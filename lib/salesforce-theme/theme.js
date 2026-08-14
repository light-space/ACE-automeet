/**
 * SLDS's semantic layer: what each raw value is *for*.
 *
 * Everything here is a `--sf-*` custom property resolving to a `--slds-*` raw
 * value from `paletteAsVariables.js`. `tailwind.config.cjs` maps these onto the
 * `sf` colour namespace, so a Salesforce screen says `bg-sf-card`,
 * `text-sf-weak`, `border-sf-border` — never a hex, never a ramp step.
 *
 * The three namespaces in this repo never collide: `--ks-*` is KeyShot's brand,
 * `--surface-*` / `--text-*` / … are Light's (vendored), `--sf-*` is this.
 */

const sldsTheme = {
  /* ── Brand ──────────────────────────────────────────────────────────────
     Two blues do most of the work. `brand` is the vivid one used as a FILL
     (icon tiles, active-tab underline). `brand-accessible` is the darker one
     used for buttons and anything carrying white text. */
  "--sf-brand": "var(--slds-brand-60)" /* #1b96ff */,
  "--sf-brand-accessible": "var(--slds-brand-50)" /* #0176d3 */,
  "--sf-brand-dark": "var(--slds-brand-30)" /* #014486 */,
  "--sf-brand-deep": "var(--slds-brand-10)" /* #001639 — the global header */,
  "--sf-brand-tint": "var(--slds-brand-90)",
  "--sf-brand-wash": "var(--slds-brand-95)",

  /* ── Surfaces ───────────────────────────────────────────────────────────
     A Lightning record page is white cards on a grey floor. That contrast is
     doing more work than any single colour. */
  "--sf-bg-page": "var(--slds-neutral-95)" /* #f3f3f3 */,
  "--sf-bg-card": "var(--slds-neutral-100)",
  "--sf-bg-shade": "var(--slds-neutral-95)",

  /* ── Text ───────────────────────────────────────────────────────────────
     `weak` is SLDS's label colour: field labels, `.slds-text-title`, the object
     type above a record name. Link text is the darker blue, not the vivid one —
     #1b96ff would not clear contrast on white, the same trap that makes
     KeyShot's #FF6105 fill-only. */
  "--sf-text-default": "var(--slds-neutral-10)" /* #181818 */,
  "--sf-text-weak": "var(--slds-neutral-30)" /* #444444 */,
  "--sf-text-link": "var(--slds-brand-40)" /* #0b5cab */,
  "--sf-text-inverse": "var(--slds-neutral-100)",

  /* ── Borders ────────────────────────────────────────────────────────────
     `border` is the hairline between cards and rows; `border-strong` is the
     one on neutral buttons and inputs. See README on the #e5e5e5 / #c9c9c9
     disagreement inside SLDS itself. */
  "--sf-border": "var(--slds-neutral-90)" /* #e5e5e5 */,
  "--sf-border-strong": "var(--slds-neutral-80)" /* #c9c9c9 */,
  "--sf-border-brand": "var(--slds-brand-60)",
  "--sf-border-error": "var(--slds-error-50)" /* #ea001e */,

  /* ── Status fills (`.slds-theme_*`, what a toast is painted with) ──────── */
  "--sf-status-success": "var(--slds-success-50)",
  "--sf-status-error": "var(--slds-error-40)",
  "--sf-status-warning": "var(--slds-warning-60)",
  "--sf-status-info": "var(--slds-neutral-50)",

  /* ── Status pills (`.slds-badge` and the themed variants) ───────────────
     Lightning has no nine-tone status ramp. `.slds-badge` is a neutral grey
     pill; only success / warning / error get a theme, and everything else is
     neutral or brand-tinted with the LABEL carrying the meaning. These names
     exist so `lib/chrome-theme/` can map a nine-tone vocabulary onto what SLDS
     actually has, without inventing four Salesforce colours that do not exist.

     SLDS's own badge grey is a legacy one-off (#ecebea) that is not on any
     `:root` ramp; `neutral-90` is used instead rather than carrying a hex that
     cannot be re-checked against the source. */
  "--sf-badge-neutral": "var(--slds-neutral-90)" /* #e5e5e5 */,
  "--sf-badge-neutral-weak": "var(--slds-neutral-95)" /* #f3f3f3 */,
  "--sf-badge-brand-tint": "var(--slds-brand-90)" /* #d8e6fe */,
  "--sf-badge-brand-wash": "var(--slds-brand-95)" /* #eef4ff */,
  "--sf-badge-inverse": "var(--slds-neutral-10)" /* `.slds-badge_inverse` */,
  "--sf-on-badge-brand": "var(--slds-brand-30)" /* #014486 */,
  "--sf-on-badge-brand-wash": "var(--slds-brand-40)" /* #0b5cab */,

  /* ── Path stages ────────────────────────────────────────────────────────
     Complete is GREEN, not blue — the thing every Path lookalike gets wrong.
     See README. */
  "--sf-path-complete": "var(--slds-success-60)",
  "--sf-path-current": "var(--slds-brand-30)",
  "--sf-path-incomplete": "var(--slds-neutral-95)",

  /* ── Radius (`radiusBorder1..3` + circle) ───────────────────────────────── */
  "--sf-radius-small": "2px",
  "--sf-radius-medium": "4px",
  "--sf-radius-large": "8px",
  "--sf-radius-circle": "50%",

  /* ── Type ramp, in px, by role ──────────────────────────────────────────
     Emitted for the record, and because it is the ladder `ui/Typography`'s
     sizes already land on — see README. */
  "--sf-font-size-detail": "10px",
  "--sf-font-size-label": "12px",
  "--sf-font-size-body": "14px",
  "--sf-font-size-body-large": "16px",
  "--sf-font-size-heading": "24px",
  "--sf-font-size-display": "32px",
};

/**
 * SLDS's font stack, from the compiled stylesheet's `html` rule. Salesforce is
 * a system-font product; the emoji families are part of the real stack and are
 * kept so the fallback behaviour matches.
 */
const sldsFontFamily = [
  "-apple-system",
  "BlinkMacSystemFont",
  '"Segoe UI"',
  "Roboto",
  "Helvetica",
  "Arial",
  "sans-serif",
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

module.exports = { sldsTheme, sldsFontFamily };
