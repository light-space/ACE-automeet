import Link from "next/link";

import { CalendarDays, Layers } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Typography } from "@/components/ui/Typography";
import { formatDiscoveryDate, loadVisualisations } from "@/lib/visualisations";

/**
 * The gallery. One card per visualisation — one client discovery transcript
 * turned into a set of future-state screens.
 *
 * Nothing is registered here. `loadVisualisations()` reads
 * `app/visualisations/` during prerender, so a new visualisation appears by
 * existing as a folder. That is what keeps each agent run inside its own
 * folder: there is no shared list for two runs to collide in, and no shared
 * list a bad run can corrupt.
 */

export default async function HomePage() {
  const visualisations = await loadVisualisations();

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3 border-b-0.5 border-hairline pb-6">
        <Typography as="span" size="xs" className="uppercase tracking-wide text-accentText">
          Light · ACE
        </Typography>
        <Typography as="h1" size="3xl" bold>
          Visualisations
        </Typography>
        <Typography as="p" size="sm" className="max-w-2xl text-text2">
          Each visualisation turns one client discovery conversation into future-state screens,
          drawn inside the application chrome those users would really see. Values marked{" "}
          <span className="rounded-full bg-illustrative px-1.5 py-0.5 text-[10px] font-medium text-illustrative">
            Illustrative
          </span>{" "}
          are invented to make a screen legible — they are not sourced from the client.
        </Typography>
      </header>

      {visualisations.length === 0 ? (
        <Callout tone="info" title="No visualisations yet">
          <Typography as="p" size="sm" className="text-text2">
            A visualisation is a folder. Create{" "}
            <code className="rounded bg-softFill px-1 py-0.5 text-xs">
              app/visualisations/&lt;slug&gt;/
            </code>{" "}
            containing a{" "}
            <code className="rounded bg-softFill px-1 py-0.5 text-xs">meta.ts</code>, an index{" "}
            <code className="rounded bg-softFill px-1 py-0.5 text-xs">page.tsx</code>, and one
            folder per screen. It appears here on the next build — there is no registry to edit,
            and you should not edit anything outside your own folder. See{" "}
            <code className="rounded bg-softFill px-1 py-0.5 text-xs">CLAUDE.md</code>.
          </Typography>
        </Callout>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visualisations.map(({ slug, meta, screens }) => (
            <li key={slug} className="flex">
              <Link
                href={`/visualisations/${slug}`}
                className="focus-ring group flex w-full flex-col gap-3 rounded-5 border-0.5 border-hairline bg-surface p-5 transition hover:border-accentLight"
              >
                <div className="flex items-start justify-between gap-3">
                  <Typography
                    as="span"
                    size="xs"
                    bold
                    className="uppercase tracking-wide text-accentText"
                  >
                    {meta.client}
                  </Typography>
                  {meta.reference && <Badge color="inactive">Reference</Badge>}
                </div>

                <Typography as="h2" size="lg" bold className="leading-snug">
                  {meta.title}
                </Typography>

                <Typography as="p" size="xs" className="line-clamp-3 text-text2">
                  {meta.blurb}
                </Typography>

                <div className="mt-auto flex items-center gap-4 border-t-0.5 border-hairline pt-3">
                  <Typography as="span" size="xs" className="flex items-center gap-1.5 text-text3">
                    <CalendarDays size={13} aria-hidden />
                    {formatDiscoveryDate(meta.date)}
                  </Typography>
                  <Typography as="span" size="xs" className="flex items-center gap-1.5 text-text3">
                    <Layers size={13} aria-hidden />
                    {screens.length} {screens.length === 1 ? "screen" : "screens"}
                  </Typography>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-auto border-t-0.5 border-hairline pt-6">
        <Typography as="p" size="xs" className="text-text3">
          Read CLAUDE.md before adding a visualisation. Work only inside your own
          <code className="mx-1 rounded bg-softFill px-1 py-0.5">app/visualisations/&lt;slug&gt;/</code>
          folder — the six hard constraints are not negotiable.
        </Typography>
      </footer>
    </main>
  );
}
