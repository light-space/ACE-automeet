/**
 * The prototype screen registry — what the run index at `/` lists.
 *
 * Add an entry here when you add a screen under `app/prototype/<slug>/page.tsx`.
 * `chrome` is not decoration: it records who the screen is for. Sales-facing
 * screens are `salesforce`; finance and back-office screens are `light`. See
 * CLAUDE.md before choosing.
 */

export type ScreenChrome = "salesforce" | "light";

export type ScreenEntry = {
  slug: string;
  title: string;
  /** One line on what the screen shows and who looks at it. */
  blurb: string;
  chrome: ScreenChrome;
  /** Flip to true once `app/prototype/<slug>/page.tsx` exists. */
  built?: boolean;
};

export const SCREENS: readonly ScreenEntry[] = [
  // Screens land here as they are built. The list starts empty on purpose —
  // an agent run adds both the route and its entry.
];
