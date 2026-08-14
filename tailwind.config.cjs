/* eslint-disable @typescript-eslint/no-require-imports */
const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

// Light's theme layer, vendored verbatim from axolotl @ 2eeea2714.
// See lib/light-theme/README.md before touching any of this.
const lightTheme = require("./lib/light-theme/lightTheme.js");
const darkTheme = require("./lib/light-theme/darkTheme.js");
const { colorsAsVariables } = require("./lib/light-theme/colorsAsVariables.js");

// SLDS's token subset, transcribed from @salesforce-ux/design-system@2.24.5.
// See lib/salesforce-theme/README.md.
const { sldsPaletteAsVariables } = require("./lib/salesforce-theme/paletteAsVariables.js");
const { sldsTheme, sldsFontFamily } = require("./lib/salesforce-theme/theme.js");

/**
 * Three palettes live here, and they do not mix.
 *
 * 1. KEYSHOT (`palette` below) — the client's brand. Wired to the CSS custom
 *    properties in `app/globals.css`; documented in `lib/tokens.ts`. Used on
 *    OUR surfaces: the gallery, callouts, the framing round a screen.
 *
 *    Note what is NOT here: `accent` is deliberately omitted from `textColor`,
 *    so `text-accent` does not exist and #FF6105 cannot be used as a text  guard-ok
 *    colour by accident. Accent text is `text-accentText` (#C64B03).
 *
 * 2. LIGHT (the `surface` / `text` / `icon` / `border` / `status` / `button` …
 *    blocks) — Light's real semantic tokens, resolved through `var(--…)` by the
 *    `addBase` plugin at the bottom. A Light screen says `bg-surface-level-1`
 *    and `text-text-secondary` because that is what production says.
 *
 * 3. SALESFORCE (the `sf` block) — SLDS's tokens, transcribed from the public
 *    design system. A Salesforce screen says `bg-sf-card` and `text-sf-weak`.
 *
 * Neither product's chrome is painted in KeyShot orange. Light chrome has no
 * saturated brand primary at all; Salesforce chrome is Salesforce blue. Mocking
 * a customer's tools means the tools look like their tools — the orange is what
 * makes each of them stop reading as itself.
 */

const palette = {
  accent: "var(--ks-accent)",
  accentText: "var(--ks-accent-text)",
  accentLight: "var(--ks-accent-light)",
  accentTint: "var(--ks-accent-tint)",
  ink: "var(--ks-ink)",
  text2: "var(--ks-text-2)",
  text3: "var(--ks-text-3)",
  hairline: "var(--ks-hairline)",
  softFill: "var(--ks-soft-fill)",
  surface: "var(--ks-surface)",
  floor: "var(--ks-floor)",
  slate: "var(--ks-slate)",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { accent, ...paletteWithoutAccent } = palette;

/**
 * Light's semantic colour keys, ported from axolotl's `tailwind.config.cjs`
 * `colors:` block. The raw palettes it also spreads (`...colors`,
 * `...newColors`) are deliberately not registered — they would override
 * Tailwind's stock `gray`/`red`/`blue`/… scales, which this repo forbids by
 * name. Rationale in lib/light-theme/README.md.
 */
const lightSemanticColors = {
  surface: {
    "level-0": "var(--surface-level-0)",
    "level-1": "var(--surface-level-1)",
    "level-1-alt": "var(--surface-level-1-alt)",
    "level-2": "var(--surface-level-2)",
    "level-2-alt": "var(--surface-level-2-alt)",
    "level-3": "var(--surface-level-3)",
    "level-3-alt": "var(--surface-level-3-alt)",
    scrim: "var(--surface-scrim)",
    "cell-hover": "var(--surface-cell-hover)",
    "cell-highlight": "var(--surface-cell-highlight)",
    "cell-highlight-positive": "var(--surface-cell-highlight-positive)",
  },
  text: {
    default: "var(--text-default)",
    secondary: "var(--text-secondary)",
    tertiary: "var(--text-tertiary)",
    inverted: "var(--text-inverted)",
    "on-inactive": "var(--text-on-inactive)",
    "on-draft": "var(--text-on-draft)",
    pending: "var(--text-pending)",
    "on-pending": "var(--text-on-pending)",
    "on-progress": "var(--text-on-progress)",
    positive: "var(--text-positive)",
    "on-positive": "var(--text-on-positive)",
    negative: "var(--text-negative)",
    "on-negative": "var(--text-on-negative)",
    warning: "var(--text-warning)",
    "on-warning": "var(--text-on-warning)",
    "on-warning-alt": "var(--text-on-warning-alt)",
    "white-on-dark": "var(--text-white-on-dark)",
    "dark-on-white": "var(--text-dark-on-white)",
    "on-disabled-magic": "var(--text-on-disabled-magic)",
  },
  icon: {
    default: "var(--icon-default)",
    secondary: "var(--icon-secondary)",
    tertirary: "var(--icon-tertirary)",
    inverted: "var(--icon-inverted)",
    "on-inactive": "var(--icon-on-inactive)",
    pending: "var(--icon-pending)",
    "on-pending": "var(--icon-on-pending)",
    positive: "var(--icon-positive)",
    "on-positive": "var(--icon-on-positive)",
    negative: "var(--icon-negative)",
    "on-negative": "var(--icon-on-negative)",
    warning: "var(--icon-warning)",
    "on-warning": "var(--icon-on-warning)",
    "on-progress": "var(--icon-on-progress)",
    "on-disabled-magic": "var(--icon-on-disabled-magic)",
    "on-accent": "var(--icon-on-accent)",
  },
  border: {
    default: "var(--border-default)",
    secondary: "var(--border-secondary)",
    tertiary: "var(--border-tertiary)",
    hover: "var(--border-hover)",
    focus: "var(--border-focus)",
    selected: "var(--border-selected)",
    negative: "var(--border-negative)",
    warning: "var(--border-warning)",
  },
  effect: {
    "drop-shadow": "var(--effect-drop-shadow)",
    "inner-shadow-hint": "var(--effect-inner-shadow-hint)",
    "inner-shadow-hint-bolder": "var(--effect-inner-shadow-hint-bolder)",
  },
  gradient: {
    "cta-fill-start": "var(--gradient-cta-fill-start)",
    "cta-fill-end": "var(--gradient-cta-fill-end)",
    "cta-stroke-start": "var(--gradient-cta-stroke-start)",
    "cta-stroke-end": "var(--gradient-cta-stroke-end)",
    "credit-start": "var(--gradient-credit-start)",
    "credit-end": "var(--gradient-credit-end)",
    "debit-start": "var(--gradient-debit-start)",
    "debit-end": "var(--gradient-debit-end)",
    "neutral-stroke-start": "var(--gradient-neutral-stroke-start)",
    "neutral-stroke-end": "var(--gradient-neutral-stroke-end)",
  },
  button: {
    primary: "var(--button-primary)",
    secondary: "var(--button-secondary)",
    "hover-default": "var(--button-hover-default)",
    "hover-alt1": "var(--button-hover-alt1)",
    "hover-alt2": "var(--button-hover-alt2)",
    "pressed-default": "var(--button-pressed-default)",
    "pressed-alt1": "var(--button-pressed-alt1)",
    "pressed-alt2": "var(--button-pressed-alt2)",
    "inactive-default": "var(--button-inactive-default)",
    "inactive-alt1": "var(--button-inactive-alt1)",
    "inactive-alt2": "var(--button-inactive-alt2)",
    "selected-default": "var(--button-selected-default)",
    "selected-alt1": "var(--button-selected-alt1)",
    "selected-alt2": "var(--button-selected-alt2)",
    "selected-alt3": "var(--button-selected-alt3)",
    "selected-alt3-disabled-bg": "var(--button-selected-alt3-disabled-bg)",
    "selected-alt3-disabled-circle": "var(--button-selected-alt3-disabled-circle)",
    negative: "var(--button-negative)",
    "negative-hover": "var(--button-negative-hover)",
    "negative-pressed": "var(--button-negative-pressed)",
    "negative-disabled": "var(--button-negative-disabled)",
  },
  status: {
    default: "var(--status-default)",
    inactive: "var(--status-inactive)",
    draft: "var(--status-draft)",
    pending: "var(--status-pending)",
    progress: "var(--status-progress)",
    positive: "var(--status-positive)",
    negative: "var(--status-negative)",
    warning: "var(--status-warning)",
    "warning-alt": "var(--status-warning-alt)",
    counter: "var(--status-counter)",
    accent: "var(--status-accent)",
  },
  input: {
    default: "var(--input-default)",
    disabled: "var(--input-disabled)",
    pill: "var(--input-pill)",
    "pill-disabled": "var(--input-pill-disabled)",
  },
  chart: {
    progress: "var(--chart-progress)",
    remaining: "var(--chart-remaining)",
    blue: "var(--chart-blue)",
    "blue-alt": "var(--chart-blue-alt)",
    cyan: "var(--chart-cyan)",
    "cyan-alt": "var(--chart-cyan-alt)",
    green: "var(--chart-green)",
    yellow: "var(--chart-yellow)",
    orange: "var(--chart-orange)",
    red: "var(--chart-red)",
    purple: "var(--chart-purple)",
  },
  avatar: {
    blue: "var(--avatar-blue)",
    orange: "var(--avatar-orange)",
    red: "var(--avatar-red)",
    green: "var(--avatar-green)",
  },
};

/**
 * SLDS's semantic keys, from `lib/salesforce-theme/theme.js`. One flat `sf`
 * namespace so a class reads as a sentence — `bg-sf-card`, `text-sf-weak`,
 * `border-sf-border-strong`, `bg-sf-path-complete`.
 */
const salesforceColors = {
  brand: "var(--sf-brand)",
  "brand-accessible": "var(--sf-brand-accessible)",
  "brand-dark": "var(--sf-brand-dark)",
  "brand-deep": "var(--sf-brand-deep)",
  "brand-tint": "var(--sf-brand-tint)",
  "brand-wash": "var(--sf-brand-wash)",

  page: "var(--sf-bg-page)",
  card: "var(--sf-bg-card)",
  shade: "var(--sf-bg-shade)",

  text: "var(--sf-text-default)",
  weak: "var(--sf-text-weak)",
  link: "var(--sf-text-link)",
  inverse: "var(--sf-text-inverse)",

  border: "var(--sf-border)",
  "border-strong": "var(--sf-border-strong)",
  "border-brand": "var(--sf-border-brand)",
  "border-error": "var(--sf-border-error)",

  success: "var(--sf-status-success)",
  error: "var(--sf-status-error)",
  warning: "var(--sf-status-warning)",
  info: "var(--sf-status-info)",

  "path-complete": "var(--sf-path-complete)",
  "path-current": "var(--sf-path-current)",
  "path-incomplete": "var(--sf-path-incomplete)",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // `accent` is deliberately ABSENT from `colors`. Tailwind derives every
      // per-property scale (textColor, backgroundColor, borderColor, …) from
      // `colors`, and `extend` can only add — so leaving #FF6105 in `colors`
      // and then "removing" it from `textColor` does nothing: `text-accent`  guard-ok
      // still resolves. It has to be registered per property instead, which is
      // what the blocks below do. `textColor` is the one that never gets it.
      colors: { ...paletteWithoutAccent, ...lightSemanticColors, sf: salesforceColors },
      textColor: {
        ...paletteWithoutAccent,
        ...lightSemanticColors,
        sf: salesforceColors,
        illustrative: "var(--ks-illustrative-text)",
      },
      backgroundColor: {
        accent: palette.accent,
        illustrative: "var(--ks-illustrative-bg)",
      },
      borderColor: { accent: palette.accent },
      ringColor: { accent: palette.accent },
      fill: { accent: palette.accent },
      stroke: { accent: palette.accent },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        // SLDS's stack. `SalesforceChrome` sets `font-slds` on its root, so a
        // Salesforce screen is not quietly rendered in Inter — Salesforce is a
        // system-font product and the difference is a real tell.
        slds: sldsFontFamily,
      },
      // 0.5px hairline. Light's signature rule weight — a 1px border reads as a
      // different product. Ported from axolotl alongside the radius conventions.
      borderWidth: {
        0.5: "0.5px",
      },
      borderRadius: {
        5: "5px",
        // SLDS `radiusBorder1..3` + circle. Salesforce's radii are tighter than
        // Light's ladder, which is part of why the two shells read differently.
        "sf-sm": "var(--sf-radius-small)",
        "sf-md": "var(--sf-radius-medium)",
        "sf-lg": "var(--sf-radius-large)",
        "sf-circle": "var(--sf-radius-circle)",
      },
      strokeWidth: {
        1.5: "1.5",
      },
    },
  },
  plugins: [
    // axolotl's own theme-application plugin, ported as-is: `:root` gets DARK,
    // `.light` gets light. We want light, so `app/layout.tsx` sets
    // `className="light"` on <html>. Both themes stay vendored; do not "fix"
    // this by editing lib/light-theme/*.
    plugin(function ({ addBase }) {
      addBase({
        ":root": {
          ...colorsAsVariables,
          ...darkTheme,
          // SLDS's layer rides along on `:root`: it has no dark/light split, so
          // it belongs with neither `darkTheme` nor `.light`. The `--slds-*`
          // raw ramp and the `--sf-*` semantic aliases are namespaced away from
          // Light's unprefixed names and KeyShot's `--ks-*`.
          ...sldsPaletteAsVariables,
          ...sldsTheme,
        },
        ".light": lightTheme,
      });
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".flex-center": {
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
        },
      });
    }),
  ],
};
