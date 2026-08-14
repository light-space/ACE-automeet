/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Flattens `palette.js` into CSS custom properties — `--slds-brand-60`,
 * `--slds-neutral-95`, … — for the `addBase` call in `tailwind.config.cjs`.
 *
 * Mirrors what `lib/light-theme/colorsAsVariables.js` does for Light: raw values
 * become variables, and the *semantic* layer (`theme.js`) then points at those
 * variables rather than at hexes. Same two-step, so both theme layers are read
 * the same way.
 */

const { sldsPalette } = require("./palette.js");

const sldsPaletteAsVariables = Object.fromEntries(
  Object.entries(sldsPalette).flatMap(([group, steps]) =>
    Object.entries(steps).map(([step, hex]) => [`--slds-${group}-${step}`, hex])
  )
);

module.exports = { sldsPaletteAsVariables };
