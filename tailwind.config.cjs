/* eslint-disable @typescript-eslint/no-require-imports */
const { fontFamily } = require("tailwindcss/defaultTheme");

/**
 * Colours are wired to the CSS custom properties declared in `app/globals.css`,
 * which is where the KeyShot hex values actually live. `lib/tokens.ts` documents
 * them for TypeScript consumers and is the file to read first.
 *
 * Note what is NOT here: `accent` is registered under `backgroundColor`,
 * `borderColor` and `fill` but deliberately omitted from `textColor`, so
 * `text-accent` does not exist and #FF6105 cannot be used as a text colour by
 * accident. Accent text is `text-accentText` (#C64B03).
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

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: palette,
      // #FF6105 fails 4.5:1 on #FAFAF8. Dropping it from textColor means the
      // `text-accent` class silently does not exist, which is a much better
      // failure mode than shipping unreadable body copy.
      textColor: {
        ...paletteWithoutAccent,
        illustrative: "var(--ks-illustrative-text)",
      },
      backgroundColor: {
        illustrative: "var(--ks-illustrative-bg)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
      },
      borderWidth: {
        0.5: "0.5px",
      },
      borderRadius: {
        5: "5px",
      },
    },
  },
  plugins: [],
};
