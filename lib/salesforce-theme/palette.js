/**
 * SLDS's raw colour ramps. Values only — nothing here says what a colour is
 * *for*; that is `theme.js`.
 *
 * Read `README.md` in this folder before changing a value. In particular:
 * **in SLDS a lower number is DARKER.** `brand-10` is the near-black navy and
 * `brand-100` is white, which is the opposite of most ramps. The numbering is
 * kept exactly as SLDS ships it so a value can be checked against the source in
 * one search rather than translated first.
 *
 * Transcribed from `@salesforce-ux/design-system@2.24.5`:
 *   assets/styles/salesforce-lightning-design-system.css   (the `:root` hooks)
 *   design-tokens/dist/palettes.common.js
 * Cross-checked against 2.30.4. See README for the two places where SLDS's own
 * inline fallbacks disagree with its `:root` block.
 */

const sldsPalette = {
  /** `--slds-g-color-brand-base-*`. Salesforce blue. */
  brand: {
    10: "#001639",
    15: "#03234d",
    20: "#032d60",
    30: "#014486",
    40: "#0b5cab",
    50: "#0176d3",
    60: "#1b96ff",
    65: "#57a3fd",
    70: "#78b0fd",
    80: "#aacbff",
    90: "#d8e6fe",
    95: "#eef4ff",
    100: "#ffffff",
  },

  /** `--slds-g-color-neutral-base-*`. Every surface, border and text colour. */
  neutral: {
    10: "#181818",
    20: "#2e2e2e",
    30: "#444444",
    40: "#5c5c5c",
    50: "#747474",
    60: "#939393",
    70: "#aeaeae",
    80: "#c9c9c9",
    90: "#e5e5e5",
    95: "#f3f3f3",
    100: "#ffffff",
  },

  success: {
    50: "#2e844a",
    /**
     * The Path's "complete" green. It is hardcoded in `.slds-path__item.slds-is-complete`
     * rather than drawn from a named ramp step — recorded here so the Path does
     * not carry a loose hex, but do not treat it as a general success colour.
     */
    60: "#3ba755",
  },

  error: {
    /** What `.slds-theme_error` actually resolves to. */
    40: "#ba0517",
    /** The brighter red used for error *borders* and the Path's "lost" stage. */
    50: "#ea001e",
  },

  warning: {
    /** What `.slds-theme_warning` actually resolves to. */
    60: "#dd7a01",
    70: "#fe9339",
  },
};

module.exports = { sldsPalette };
