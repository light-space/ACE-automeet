/**
 * THE CHROME CONTEXT — the layer that turns "pick a chrome" into "pick a playbook".
 *
 * A screen chooses `LightChrome` or `SalesforceChrome`. That choice has to
 * decide every colour, rule weight and radius on the screen, including inside
 * shared components the screen author never touches. Otherwise a Light-toned
 * status pill turns up on a Salesforce record and the lookalike stops looking
 * like anything.
 *
 * ── How the context is carried ──────────────────────────────────────────────
 * Each chrome stamps `data-chrome="…"` on its root element. This file defines
 * one alias vocabulary — `--chrome-*` — and gives it a different set of values
 * under each of those attributes. Shared components say `bg-chrome-card`,
 * `text-chrome-weak`, `bg-chrome-status-positive`, and the cascade resolves
 * them to whichever playbook they are rendering inside.
 *
 * The context is therefore the CSS cascade, not React context. That is not a
 * workaround, it is the only mechanism that works here: `createContext` is
 * unavailable in Server Components, so a React context would mean `"use
 * client"` on Field, Badge, Table, Callout, Checklist, ActionLog, Typography
 * and Button — the entire UI layer — to solve a problem that is purely about
 * which value a colour takes. The cascade also nests properly, which is what
 * lets `TeamsCard` re-scope its own subtree (see `chromeTeams` below).
 *
 * ── The one rule for this file ──────────────────────────────────────────────
 * **Every value here is `var(…)` pointing at a palette that already exists.**
 * Light's vendored tokens, SLDS's transcribed tokens, KeyShot's brand tokens.
 * This layer aliases; it never originates a colour. The single exception is
 * `chromeTeams`, which is a third product with no palette in this repo — its
 * values are Fluent's, listed with their source, exactly the way
 * `lib/salesforce-theme/palette.js` handles SLDS.
 *
 * Adding a key here means adding it to all four scopes. A scope that omits a
 * key inherits it from the scope it is nested in, which is occasionally what
 * you want and usually a bug.
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const { sldsFontFamily } = require("../salesforce-theme/theme.js");

const INTER_STACK = "var(--font-inter), ui-sans-serif, system-ui, sans-serif";
const SLDS_STACK = sldsFontFamily.join(", ");

/**
 * KEYSHOT — the default, on `:root`. Our own surfaces: the gallery, a
 * visualisation index, the framing round a screen. A component rendered
 * outside both chromes lands here.
 *
 * Note what KeyShot's brand palette does NOT have: a status ramp. There is no
 * green, no red, no blue in `lib/tokens.ts`, and inventing one is forbidden.
 * So outside a product chrome the status tones collapse to neutrals plus the
 * accent. That is a signal, not a bug: a status pill that needs to mean
 * "approved" versus "void" belongs on a screen, and a screen is inside a
 * chrome, where the real tones live.
 */
const chromeKeyshot = {
  "--chrome-font": INTER_STACK,
  "--chrome-radius-card": "5px",
  "--chrome-radius-control": "5px",
  "--chrome-rule": "0.5px",

  "--chrome-card": "var(--ks-surface)",
  "--chrome-floor": "var(--ks-floor)",
  "--chrome-row-hover": "var(--ks-floor)",
  "--chrome-border": "var(--ks-hairline)",
  "--chrome-border-strong": "var(--ks-hairline)",

  "--chrome-text": "var(--ks-ink)",
  "--chrome-weak": "var(--ks-text-2)",
  "--chrome-faint": "var(--ks-text-3)",
  /* Accent TEXT, never #FF6105 — see the colour rule in lib/tokens.ts. */
  "--chrome-link": "var(--ks-accent-text)",
  "--chrome-inverse": "var(--ks-surface)",
  "--chrome-icon": "var(--ks-text-3)",
  "--chrome-marker": "var(--ks-text-3)",
  "--chrome-focus": "var(--ks-accent)",

  "--chrome-status-default": "var(--ks-soft-fill)",
  "--chrome-on-default": "var(--ks-ink)",
  "--chrome-status-inactive": "var(--ks-soft-fill)",
  "--chrome-on-inactive": "var(--ks-text-2)",
  "--chrome-status-draft": "var(--ks-hairline)",
  "--chrome-on-draft": "var(--ks-ink)",
  "--chrome-status-pending": "var(--ks-accent-tint)",
  "--chrome-on-pending": "var(--ks-accent-text)",
  "--chrome-status-progress": "var(--ks-accent-light)",
  "--chrome-on-progress": "var(--ks-ink)",
  "--chrome-status-positive": "var(--ks-soft-fill)",
  "--chrome-on-positive": "var(--ks-ink)",
  /* #FF6105 as a FILL with ink on top: 6.0:1. The one place the brand orange
     carries text, and the text is the dark ink, never the orange. */
  "--chrome-status-negative": "var(--ks-accent)",
  "--chrome-on-negative": "var(--ks-ink)",
  "--chrome-status-warning": "var(--ks-accent-tint)",
  "--chrome-on-warning": "var(--ks-accent-text)",
  "--chrome-status-inverted": "var(--ks-ink)",
  "--chrome-on-inverted": "var(--ks-surface)",

  "--chrome-button-primary": "var(--ks-ink)",
  "--chrome-on-button-primary": "var(--ks-surface)",
  "--chrome-button-primary-hover": "var(--ks-text-2)",
  "--chrome-button-secondary": "var(--ks-soft-fill)",
  "--chrome-on-button-secondary": "var(--ks-ink)",
  "--chrome-button-hover": "var(--ks-soft-fill)",
  "--chrome-button-pressed": "var(--ks-hairline)",
  "--chrome-button-negative": "var(--ks-accent)",
  "--chrome-on-button-negative": "var(--ks-ink)",

  "--chrome-glyph-positive": "var(--ks-text-2)",
  "--chrome-glyph-warning": "var(--ks-accent-text)",
  "--chrome-warning-wash": "var(--ks-soft-fill)",
  "--chrome-warning-edge": "var(--ks-hairline)",
  "--chrome-accent-wash": "var(--ks-accent-tint)",
  "--chrome-accent-edge": "var(--ks-accent)",
  "--chrome-accent-glyph": "var(--ks-accent-text)",
};

/**
 * LIGHT — `lib/light-theme/`, vendored byte-identical from axolotl.
 *
 * Every value is one of Light's own semantic names, so a shared component
 * inside `LightChrome` says exactly what Light's production frontend says.
 * There is no saturated brand primary: neutral greys, a yellow selection
 * accent, and the pink→purple AI gradient that `Button intent="magic"` keeps
 * for itself. The 0.5px hairline is Light's signature rule weight.
 */
const chromeLight = {
  "--chrome-font": INTER_STACK,
  "--chrome-radius-card": "0.5rem" /* rounded-lg — Light's panel radius */,
  "--chrome-radius-control": "6px",
  "--chrome-rule": "0.5px",

  "--chrome-card": "var(--surface-level-1)",
  "--chrome-floor": "var(--surface-level-2)",
  "--chrome-row-hover": "var(--surface-cell-hover)",
  "--chrome-border": "var(--border-secondary)",
  "--chrome-border-strong": "var(--border-default)",

  "--chrome-text": "var(--text-default)",
  "--chrome-weak": "var(--text-secondary)",
  "--chrome-faint": "var(--text-tertiary)",
  /* Light has no link blue on these surfaces; emphasis is weight, not hue. */
  "--chrome-link": "var(--text-default)",
  "--chrome-inverse": "var(--text-inverted)",
  "--chrome-icon": "var(--icon-secondary)",
  "--chrome-marker": "var(--icon-secondary)",
  "--chrome-focus": "var(--border-focus)",

  "--chrome-status-default": "var(--status-default)",
  "--chrome-on-default": "var(--text-default)",
  "--chrome-status-inactive": "var(--status-inactive)",
  "--chrome-on-inactive": "var(--text-on-inactive)",
  "--chrome-status-draft": "var(--status-draft)",
  "--chrome-on-draft": "var(--text-on-draft)",
  "--chrome-status-pending": "var(--status-pending)",
  "--chrome-on-pending": "var(--text-on-pending)",
  "--chrome-status-progress": "var(--status-progress)",
  "--chrome-on-progress": "var(--text-on-progress)",
  "--chrome-status-positive": "var(--status-positive)",
  "--chrome-on-positive": "var(--text-on-positive)",
  "--chrome-status-negative": "var(--status-negative)",
  "--chrome-on-negative": "var(--text-on-negative)",
  "--chrome-status-warning": "var(--status-warning)",
  "--chrome-on-warning": "var(--text-on-warning)",
  "--chrome-status-inverted": "var(--status-counter)",
  "--chrome-on-inverted": "var(--text-white-on-dark)",

  "--chrome-button-primary": "var(--button-primary)",
  "--chrome-on-button-primary": "var(--text-inverted)",
  "--chrome-button-primary-hover": "var(--button-hover-default)",
  "--chrome-button-secondary": "var(--button-secondary)",
  "--chrome-on-button-secondary": "var(--text-default)",
  "--chrome-button-hover": "var(--button-hover-alt1)",
  "--chrome-button-pressed": "var(--button-pressed-alt1)",
  "--chrome-button-negative": "var(--button-negative)",
  "--chrome-on-button-negative": "var(--text-white-on-dark)",

  "--chrome-glyph-positive": "var(--text-positive)",
  "--chrome-glyph-warning": "var(--text-on-warning)",
  /* `status-warning-alt` is the translucent wash; `status-warning` is the pill
     fill. A standing advisory takes the wash, a badge takes the pill. */
  "--chrome-warning-wash": "var(--status-warning-alt)",
  "--chrome-warning-edge": "var(--border-warning)",
  /* Light's "accent" is its yellow selection edge, not a colour wash. */
  "--chrome-accent-wash": "var(--surface-level-2)",
  "--chrome-accent-edge": "var(--border-selected)",
  "--chrome-accent-glyph": "var(--text-default)",
};

/**
 * SALESFORCE — `lib/salesforce-theme/`, transcribed from SLDS.
 *
 * White cards on the grey page floor with 1px hairlines, tighter radii, the
 * system font stack. Two notes worth keeping in view:
 *
 * - `--chrome-link` is the DARK blue (`--sf-text-link`, #0b5cab), never the
 *   vivid `--sf-brand` (#1b96ff), which does not clear contrast on white. Same
 *   trap as KeyShot's #FF6105, same answer.
 * - SLDS has no nine-tone status ramp. Lightning themes success, warning and
 *   error and leaves everything else a neutral or brand-tinted pill, with the
 *   label carrying the meaning. That is reproduced rather than corrected:
 *   inventing four more Salesforce status colours would be a lookalike of
 *   something Salesforce does not have.
 */
const chromeSalesforce = {
  "--chrome-font": SLDS_STACK,
  "--chrome-radius-card": "var(--sf-radius-large)",
  "--chrome-radius-control": "var(--sf-radius-medium)",
  "--chrome-rule": "1px",

  "--chrome-card": "var(--sf-bg-card)",
  "--chrome-floor": "var(--sf-bg-page)",
  "--chrome-row-hover": "var(--sf-bg-shade)",
  "--chrome-border": "var(--sf-border)",
  "--chrome-border-strong": "var(--sf-border-strong)",

  "--chrome-text": "var(--sf-text-default)",
  "--chrome-weak": "var(--sf-text-weak)",
  "--chrome-faint": "var(--sf-text-weak)",
  "--chrome-link": "var(--sf-text-link)",
  "--chrome-inverse": "var(--sf-text-inverse)",
  "--chrome-icon": "var(--sf-text-weak)",
  "--chrome-marker": "var(--sf-brand)",
  "--chrome-focus": "var(--sf-brand-accessible)",

  "--chrome-status-default": "var(--sf-badge-neutral)",
  "--chrome-on-default": "var(--sf-text-default)",
  "--chrome-status-inactive": "var(--sf-badge-neutral)",
  "--chrome-on-inactive": "var(--sf-text-weak)",
  "--chrome-status-draft": "var(--sf-badge-neutral-weak)",
  "--chrome-on-draft": "var(--sf-text-weak)",
  "--chrome-status-pending": "var(--sf-badge-brand-tint)",
  "--chrome-on-pending": "var(--sf-on-badge-brand)",
  "--chrome-status-progress": "var(--sf-badge-brand-wash)",
  "--chrome-on-progress": "var(--sf-on-badge-brand-wash)",
  "--chrome-status-positive": "var(--sf-status-success)",
  "--chrome-on-positive": "var(--sf-text-inverse)",
  "--chrome-status-negative": "var(--sf-status-error)",
  "--chrome-on-negative": "var(--sf-text-inverse)",
  /* SLDS's warning orange is the one theme that takes DARK text — it is too
     light to carry white. Same reasoning as `Toast`'s warning variant. */
  "--chrome-status-warning": "var(--sf-status-warning)",
  "--chrome-on-warning": "var(--sf-text-default)",
  "--chrome-status-inverted": "var(--sf-badge-inverse)",
  "--chrome-on-inverted": "var(--sf-text-inverse)",

  "--chrome-button-primary": "var(--sf-brand-accessible)",
  "--chrome-on-button-primary": "var(--sf-text-inverse)",
  "--chrome-button-primary-hover": "var(--sf-brand-dark)",
  /* Lightning's neutral button is a WHITE fill with a grey outline and blue
     label — not a grey fill. Getting this wrong is one of the loudest tells. */
  "--chrome-button-secondary": "var(--sf-bg-card)",
  "--chrome-on-button-secondary": "var(--sf-text-link)",
  "--chrome-button-hover": "var(--sf-brand-wash)",
  "--chrome-button-pressed": "var(--sf-brand-tint)",
  "--chrome-button-negative": "var(--sf-status-error)",
  "--chrome-on-button-negative": "var(--sf-text-inverse)",

  "--chrome-glyph-positive": "var(--sf-status-success)",
  "--chrome-glyph-warning": "var(--sf-status-warning)",
  /* `.slds-scoped-notification`: a standing advisory in Lightning is a panel
     with a coloured glyph, not a saturated fill — the saturated fill is
     `.slds-theme_warning`, which is what `Toast` renders. The panel is a CARD,
     not the page shade: `bg-shade` is the same grey as the page floor a
     Salesforce screen sits on, so a shaded advisory would have no edges. */
  "--chrome-warning-wash": "var(--sf-bg-card)",
  "--chrome-warning-edge": "var(--sf-border-strong)",
  "--chrome-accent-wash": "var(--sf-brand-wash)",
  "--chrome-accent-edge": "var(--sf-border-brand)",
  "--chrome-accent-glyph": "var(--sf-text-link)",
};

/**
 * MICROSOFT TEAMS — a third product, and the reason this layer nests.
 *
 * `TeamsCard` re-scopes its own subtree to this. A Teams notification looks
 * like Teams wherever it is pinned, so it does NOT adopt the surrounding
 * playbook: a Teams card painted Salesforce blue would be a picture of
 * something that does not exist. See the note at the top of `TeamsCard.tsx`.
 *
 * These are the only originated values in this file, because there is no Teams
 * palette in this repo to alias. They are Fluent UI v9's Teams light theme
 * (`@fluentui/tokens`, `teamsLightTheme`) — the same posture as
 * `lib/salesforce-theme/palette.js`: a small, sourced subset, named for what it
 * is, rather than a dependency for six colours.
 */
const chromeTeams = {
  "--chrome-font": '"Segoe UI", "Segoe UI Web (West European)", system-ui, sans-serif',
  "--chrome-radius-card": "8px" /* borderRadiusLarge */,
  "--chrome-radius-control": "4px" /* borderRadiusMedium */,
  "--chrome-rule": "1px",

  "--chrome-card": "#ffffff" /* neutralBackground1 */,
  "--chrome-floor": "#f5f5f5" /* neutralBackground3 */,
  "--chrome-row-hover": "#f5f5f5" /* neutralBackground1Hover */,
  "--chrome-border": "#e0e0e0" /* neutralStroke2 */,
  "--chrome-border-strong": "#d1d1d1" /* neutralStroke1 */,

  "--chrome-text": "#242424" /* neutralForeground1 */,
  "--chrome-weak": "#616161" /* neutralForeground3 */,
  "--chrome-faint": "#707070" /* neutralForeground4 */,
  "--chrome-link": "#5b5fc7" /* brandForegroundLink — Teams purple */,
  "--chrome-inverse": "#ffffff" /* neutralForegroundInverted */,
  "--chrome-icon": "#616161",
  "--chrome-marker": "#5b5fc7",
  "--chrome-focus": "#5b5fc7",

  "--chrome-status-default": "#f0f0f0" /* neutralBackground4 */,
  "--chrome-on-default": "#242424",
  "--chrome-status-inactive": "#f0f0f0",
  "--chrome-on-inactive": "#616161",
  "--chrome-status-draft": "#e6e6e6",
  "--chrome-on-draft": "#424242",
  "--chrome-status-pending": "#e8ebfa" /* brandBackground2 */,
  "--chrome-on-pending": "#3d3e78" /* brandForeground2 */,
  "--chrome-status-progress": "#e8ebfa",
  "--chrome-on-progress": "#4f52b2",
  "--chrome-status-positive": "#dff6dd" /* successBackground1 */,
  "--chrome-on-positive": "#0e700e" /* successForeground1 */,
  "--chrome-status-negative": "#fdf3f4" /* dangerBackground1 */,
  "--chrome-on-negative": "#b10e1c" /* dangerForeground1 */,
  "--chrome-status-warning": "#fff4ce" /* warningBackground1 */,
  "--chrome-on-warning": "#835b00" /* warningForeground1 */,
  "--chrome-status-inverted": "#242424",
  "--chrome-on-inverted": "#ffffff",

  "--chrome-button-primary": "#5b5fc7" /* brandBackground */,
  "--chrome-on-button-primary": "#ffffff",
  "--chrome-button-primary-hover": "#4f52b2",
  "--chrome-button-secondary": "#ffffff",
  "--chrome-on-button-secondary": "#242424",
  "--chrome-button-hover": "#f5f5f5",
  "--chrome-button-pressed": "#e0e0e0",
  "--chrome-button-negative": "#b10e1c",
  "--chrome-on-button-negative": "#ffffff",

  "--chrome-glyph-positive": "#0e700e",
  "--chrome-glyph-warning": "#835b00",
  "--chrome-warning-wash": "#fff4ce",
  "--chrome-warning-edge": "#eaa300",
  "--chrome-accent-wash": "#e8ebfa",
  "--chrome-accent-edge": "#5b5fc7",
  "--chrome-accent-glyph": "#5b5fc7",
};

/**
 * The Tailwind colour namespace. One flat `chrome` key so a class reads as a
 * sentence: `bg-chrome-card`, `text-chrome-weak`, `bg-chrome-status-positive`,
 * `text-chrome-on-positive`, `border-chrome-border-strong`.
 */
const chromeColors = {
  card: "var(--chrome-card)",
  floor: "var(--chrome-floor)",
  "row-hover": "var(--chrome-row-hover)",
  border: "var(--chrome-border)",
  "border-strong": "var(--chrome-border-strong)",

  text: "var(--chrome-text)",
  weak: "var(--chrome-weak)",
  faint: "var(--chrome-faint)",
  link: "var(--chrome-link)",
  inverse: "var(--chrome-inverse)",
  icon: "var(--chrome-icon)",
  marker: "var(--chrome-marker)",
  focus: "var(--chrome-focus)",

  "status-default": "var(--chrome-status-default)",
  "status-inactive": "var(--chrome-status-inactive)",
  "status-draft": "var(--chrome-status-draft)",
  "status-pending": "var(--chrome-status-pending)",
  "status-progress": "var(--chrome-status-progress)",
  "status-positive": "var(--chrome-status-positive)",
  "status-negative": "var(--chrome-status-negative)",
  "status-warning": "var(--chrome-status-warning)",
  "status-inverted": "var(--chrome-status-inverted)",

  "on-default": "var(--chrome-on-default)",
  "on-inactive": "var(--chrome-on-inactive)",
  "on-draft": "var(--chrome-on-draft)",
  "on-pending": "var(--chrome-on-pending)",
  "on-progress": "var(--chrome-on-progress)",
  "on-positive": "var(--chrome-on-positive)",
  "on-negative": "var(--chrome-on-negative)",
  "on-warning": "var(--chrome-on-warning)",
  "on-inverted": "var(--chrome-on-inverted)",

  "button-primary": "var(--chrome-button-primary)",
  "on-button-primary": "var(--chrome-on-button-primary)",
  "button-primary-hover": "var(--chrome-button-primary-hover)",
  "button-secondary": "var(--chrome-button-secondary)",
  "on-button-secondary": "var(--chrome-on-button-secondary)",
  "button-hover": "var(--chrome-button-hover)",
  "button-pressed": "var(--chrome-button-pressed)",
  "button-negative": "var(--chrome-button-negative)",
  "on-button-negative": "var(--chrome-on-button-negative)",

  "glyph-positive": "var(--chrome-glyph-positive)",
  "glyph-warning": "var(--chrome-glyph-warning)",
  "warning-wash": "var(--chrome-warning-wash)",
  "warning-edge": "var(--chrome-warning-edge)",
  "accent-wash": "var(--chrome-accent-wash)",
  "accent-edge": "var(--chrome-accent-edge)",
  "accent-glyph": "var(--chrome-accent-glyph)",
};

module.exports = {
  chromeKeyshot,
  chromeLight,
  chromeSalesforce,
  chromeTeams,
  chromeColors,
};
