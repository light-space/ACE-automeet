import next from "eslint-config-next";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Flat config. eslint-config-next 16 ships flat configs directly, so there is no
 * FlatCompat/eslintrc shim here — wrapping an already-flat config in FlatCompat
 * throws on a circular plugin reference.
 */
const eslintConfig = [
  {
    // legacy/ is the retired Python pipeline and its static HTML; the rest are
    // build output and generated artefacts.
    ignores: [
      ".next/**",
      "node_modules/**",
      "legacy/**",
      "outputs/**",
      "prototypes/**",
      "next-env.d.ts",
    ],
  },
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
