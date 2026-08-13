import Link from "next/link";

import { Callout } from "@/components/ui/Callout";
import { Typography } from "@/components/ui/Typography";
import { SCREENS } from "@/lib/screens";

/**
 * The slot prototype screens get dropped into.
 *
 * ── How to add a screen ─────────────────────────────────────────────────────
 * 1. Create `app/prototype/<slug>/page.tsx` — a real route directory, sibling
 *    to this one. Next matches a static segment before this dynamic one, so
 *    your route wins automatically and this placeholder stops rendering for it.
 * 2. Register it in `lib/screens.ts` so it appears on the run index at `/`.
 * 3. Wrap it in `SalesforceChrome` or `LightChrome` — see CLAUDE.md for which.
 *
 * Everything below is the not-yet-built state for an unregistered slug.
 */

export default async function PrototypeScreenPage({
  params,
}: {
  params: Promise<{ screen: string }>;
}) {
  const { screen } = await params;
  const known = SCREENS.find((s) => s.slug === screen);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <Typography as="span" size="xs" className="uppercase tracking-wide text-text3">
          Prototype screen
        </Typography>
        <Typography as="h1" size="2xl" bold>
          {known ? known.title : screen}
        </Typography>
      </div>

      <Callout tone="info" title="Not built yet">
        <Typography as="p" size="sm" className="text-text2">
          {known
            ? `“${known.title}” is registered in lib/screens.ts but has no route yet. Create app/prototype/${screen}/page.tsx to build it.`
            : `No screen is registered for the slug “${screen}”. Add it to lib/screens.ts, then create app/prototype/${screen}/page.tsx.`}
        </Typography>
      </Callout>

      <Link href="/" className="w-fit text-sm font-medium text-accentText underline underline-offset-4">
        ← Back to all screens
      </Link>
    </main>
  );
}
