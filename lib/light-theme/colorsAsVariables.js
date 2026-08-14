// This file converts the color palette to CSS variables
/* eslint-disable @typescript-eslint/no-require-imports */
const colors = require("./colors-new");

function flattenColors(obj, prefix = "") {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    const cssVarName = prefix ? `--${prefix}-${key}` : `--${key}`;

    if (typeof value === "string") {
      result[cssVarName] = value;
    } else {
      const nestedPrefix = prefix ? `${prefix}-${key}` : key;
      Object.assign(result, flattenColors(value, nestedPrefix));
    }
  }

  return result;
}

module.exports = { colorsAsVariables: flattenColors(colors) };
