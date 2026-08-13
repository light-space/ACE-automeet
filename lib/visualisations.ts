import fs from "node:fs";
import path from "node:path";

/**
 * Visualisation discovery — the reason there is no central registry file.
 *
 * ── Why this is a filesystem read and not a list ────────────────────────────
 * Every visualisation in `app/visualisations/<slug>/` is written by a separate
 * agent run from a separate client transcript. If the run index were a hand
 * maintained array, every run would have to edit that one file: two runs would
 * collide in it, and a bad run could break every visualisation already shipped
 * by writing a malformed entry.
 *
 * So nothing is registered. The index reads the directory. A run creates its
 * own folder and touches nothing else, which makes the folder boundary a real
 * blast radius: a broken visualisation breaks its own route and no other.
 *
 * This runs on the server at build time. Every helper here is called from a
 * Server Component with no dynamic APIs, so Next prerenders the pages that use
 * it — the directory is read during `next build`, not per request. Verify with
 * `pnpm build`: `/` and the visualisation indexes must be marked static (`○`).
 *
 * The dynamic `import()` calls take a template literal on purpose. The bundler
 * resolves the static prefix and builds a context of every module that matches,
 * so a folder added later needs no import statement written anywhere.
 */

/**
 * Which application chrome a screen is drawn in.
 *
 * `chrome` is not decoration: it records who the screen is for. Sales-facing
 * screens are `salesforce`; finance and back-office screens are `light`. See
 * CLAUDE.md before choosing.
 */
export type ScreenChrome = "salesforce" | "light";

/** `app/visualisations/<slug>/meta.ts` — the default export. */
export type VisualisationMeta = {
  /** What this visualisation is about, in the client's language. */
  title: string;
  /** The client the discovery call was with. */
  client: string;
  /** The transcript this was built from — a filename, or how to find it. */
  sourceTranscript: string;
  /** ISO date (`YYYY-MM-DD`) of the discovery conversation. */
  date: string;
  /** One or two lines on what the set of screens argues. */
  blurb: string;
  /**
   * Set only on hand-built references kept as a worked example. Agent-written
   * visualisations leave this off — the grid labels the difference so a reader
   * never mistakes a reference for output from a client conversation.
   */
  reference?: boolean;
};

/** Named export `screenMeta` from `app/visualisations/<vis>/<screen>/page.tsx`. */
export type ScreenMeta = {
  title: string;
  /** One line on what the screen shows and who looks at it. */
  blurb?: string;
  chrome: ScreenChrome;
};

export type DiscoveredScreen = {
  slug: string;
  meta: ScreenMeta;
};

export type DiscoveredVisualisation = {
  slug: string;
  meta: VisualisationMeta;
  screens: DiscoveredScreen[];
};

const VISUALISATIONS_DIR = path.join(process.cwd(), "app", "visualisations");

const PAGE_FILES = ["page.tsx", "page.jsx", "page.ts", "page.js"];
const META_FILES = ["meta.ts", "meta.tsx", "meta.js"];

/** Route-relevant subdirectories only: no dotfiles, no `_private` folders. */
function childDirectories(at: string): string[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(at, { withFileTypes: true });
  } catch {
    // No `app/visualisations/` yet is the empty state, not an error.
    return [];
  }
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith(".") && !e.name.startsWith("_"))
    .map((e) => e.name)
    .sort();
}

function hasOneOf(dir: string, names: readonly string[]): boolean {
  return names.some((n) => fs.existsSync(path.join(dir, n)));
}

/**
 * Slugs of every folder under `app/visualisations/` that is actually a
 * visualisation — it has both a `meta.ts` and an index `page.tsx`. A folder
 * mid-build, or a shared helper folder, is skipped rather than crashing the
 * index.
 */
export function visualisationSlugs(): string[] {
  return childDirectories(VISUALISATIONS_DIR).filter((slug) => {
    const dir = path.join(VISUALISATIONS_DIR, slug);
    return hasOneOf(dir, META_FILES) && hasOneOf(dir, PAGE_FILES);
  });
}

/** Screen folders inside one visualisation: any subdirectory holding a `page`. */
export function screenSlugs(visualisation: string): string[] {
  const dir = path.join(VISUALISATIONS_DIR, visualisation);
  return childDirectories(dir).filter((screen) => hasOneOf(path.join(dir, screen), PAGE_FILES));
}

/** Turns `quote-approval` into `Quote approval` for a screen with no `screenMeta`. */
function titleFromSlug(slug: string): string {
  const words = slug.replace(/[-_]+/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

async function loadScreen(visualisation: string, screen: string): Promise<DiscoveredScreen> {
  let meta: ScreenMeta = { title: titleFromSlug(screen), chrome: "salesforce" };
  try {
    const mod: { screenMeta?: ScreenMeta } = await import(
      `../app/visualisations/${visualisation}/${screen}/page`
    );
    if (mod.screenMeta) meta = mod.screenMeta;
  } catch {
    // A screen that does not export `screenMeta` still lists, under its slug.
  }
  return { slug: screen, meta };
}

/**
 * One visualisation with its screens, or `null` if its `meta.ts` will not load.
 * Returning null rather than throwing is deliberate: one malformed folder must
 * not take the whole index down with it.
 */
export async function loadVisualisation(slug: string): Promise<DiscoveredVisualisation | null> {
  let meta: VisualisationMeta;
  try {
    const mod: { default?: VisualisationMeta } = await import(
      `../app/visualisations/${slug}/meta`
    );
    if (!mod.default) return null;
    meta = mod.default;
  } catch {
    return null;
  }

  const screens = await Promise.all(screenSlugs(slug).map((s) => loadScreen(slug, s)));
  return { slug, meta, screens };
}

/** Every visualisation, newest discovery conversation first. */
export async function loadVisualisations(): Promise<DiscoveredVisualisation[]> {
  const loaded = await Promise.all(visualisationSlugs().map(loadVisualisation));
  return loaded
    .filter((v): v is DiscoveredVisualisation => v !== null)
    .sort((a, b) => (a.meta.date < b.meta.date ? 1 : a.meta.date > b.meta.date ? -1 : 0));
}

/**
 * `2026-08-12` → `12 Aug 2026`. Fixed locale, because this is rendered during
 * prerender and the output is baked into the HTML.
 */
export function formatDiscoveryDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
