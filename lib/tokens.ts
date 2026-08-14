/**
 * KeyShot brand tokens.
 *
 * These are the ONLY colours this prototype uses. Do not invent new hex values,
 * do not reach for stock Tailwind palette colours (`text-gray-500`, `bg-blue-50`,
 * …). Every colour below is exposed as a Tailwind utility via `tailwind.config.cjs`
 * — prefer the utility (`text-ink`, `bg-floor`, `border-hairline`) over inline styles.
 *
 * ── The one hard colour rule ────────────────────────────────────────────────
 * `#FF6105` (`accent`) must NEVER appear in a `color:` declaration. It measures
 * ~3.1:1 against `#FAFAF8` and fails WCAG AA for body text. It is a FILL colour:
 * backgrounds, borders, rules, chart marks, icon glyphs at 24px+.
 *
 * Accent-coloured *text* uses `#C64B03` (`accentText`), which clears 4.5:1.
 * That is the entire reason two accent values exist. In Tailwind terms:
 *
 *   ✅ bg-accent  border-accent  fill-accent   ❌ text-accent          guard-ok
 *   ✅ text-accentText
 *
 * That utility is deliberately NOT generated — see tailwind.config.cjs.
 */

export const tokens = {
  /** Primary brand orange. FILL ONLY — never a text colour. */
  accent: "#FF6105",
  /** Accessible accent for text and small glyphs. Clears 4.5:1 on `floor`. */
  accentText: "#C64B03",
  /** Tinted accent for hovers, decorative rules, disabled fills. */
  accentLight: "#FFB380",
  /** Faintest accent wash — callout backgrounds, selected rows. */
  accentTint: "#FFECE1",

  /** Primary text. */
  ink: "#1D1C1A",
  /** Secondary text — labels, captions, table headers. */
  text2: "#54534E",
  /** Tertiary text — hints, timestamps, disabled. */
  text3: "#8B8A84",

  /** Borders, dividers, table rules. */
  hairline: "#C7C6C0",
  /** Inert fills — chips, zebra rows, skeletons. */
  softFill: "#E5E4DF",
  /** Cards, panels, anything raised. */
  surface: "#FFFFFF",
  /** Page background. */
  floor: "#FAFAF8",
  /**
   * Cool neutral. It used to be the stand-in Salesforce grey; `SalesforceChrome`
   * now runs on SLDS's own tokens (`lib/salesforce-theme/`), so this is just a
   * KeyShot-side neutral — for our surfaces, not a product shell.
   */
  slate: "#4A5568",
} as const;

export type TokenName = keyof typeof tokens;

/** The one typeface. Loaded via `next/font/google` in `app/layout.tsx`. */
export const fontFamily = "Inter";

/**
 * Provenance markers. Every value rendered on a prototype screen carries one.
 *
 *   V — Verified.     Sourced from a real KeyShot artefact or a workshop transcript.
 *   I — Inferred.     A reasonable derivation from something verified.
 *   X — Illustrative. Made up to make the screen legible. MUST be badged.
 *
 * `components/ui/Field.tsx` badges `X` automatically. Route every displayed
 * value through `Field` (or a component that composes it) and it is structurally
 * impossible to put an unsourced number on screen without the reader knowing.
 */
export type Provenance = "V" | "I" | "X";

export type ProvenancedValue = {
  p: Provenance;
  v: string;
};

/** Amber chip styling for illustrative values. Not part of the brand palette — deliberately foreign so it reads as a warning. */
export const illustrativeChip = {
  bg: "#FEF3C7",
  text: "#894B00",
} as const;
