import Link from "next/link";

import { ArrowLeft, FileText } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Typography } from "@/components/ui/Typography";
import { formatDiscoveryDate, loadVisualisation } from "@/lib/visualisations";

/**
 * The index page of a single visualisation: its screens, discovered from the
 * folder rather than listed anywhere.
 *
 * A visualisation's own `page.tsx` is a two-liner that renders this with its
 * slug. That is on purpose — the discovery logic lives here, outside every
 * visualisation folder, so an agent building a visualisation never has to write
 * it (or get it wrong) and never has a reason to edit a shared file.
 */

export async function VisualisationIndex({ slug }: { slug: string }) {
  const visualisation = await loadVisualisation(slug);

  if (!visualisation) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-16">
        <Callout tone="warning" title="This visualisation has no meta.ts">
          <Typography as="p" size="sm" className="text-text2">
            {`app/visualisations/${slug}/meta.ts is missing or does not default-export a VisualisationMeta. Add it and this page fills itself in.`}
          </Typography>
        </Callout>
        <BackLink />
      </main>
    );
  }

  const { meta, screens } = visualisation;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-3 border-b-0.5 border-hairline pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Typography as="span" size="xs" className="uppercase tracking-wide text-accentText">
            {meta.client}
          </Typography>
          <Typography as="span" size="xs" className="text-text3">
            ·
          </Typography>
          <Typography as="span" size="xs" className="text-text3">
            {formatDiscoveryDate(meta.date)}
          </Typography>
          {meta.reference && <Badge tone="neutral">Hand-built reference</Badge>}
        </div>
        <Typography as="h1" size="3xl" bold>
          {meta.title}
        </Typography>
        <Typography as="p" size="sm" className="max-w-2xl text-text2">
          {meta.blurb}
        </Typography>
        <Typography as="p" size="xs" className="flex items-center gap-1.5 text-text3">
          <FileText size={13} aria-hidden />
          Source transcript: {meta.sourceTranscript}
        </Typography>
      </header>

      {screens.length === 0 ? (
        <Callout tone="info" title="No screens in this visualisation yet">
          <Typography as="p" size="sm" className="text-text2">
            {`Add one at app/visualisations/${slug}/<screen>/page.tsx. It appears here as soon as the folder exists — nothing to register.`}
          </Typography>
        </Callout>
      ) : (
        <ul className="flex flex-col gap-3">
          {screens.map((screen) => (
            <li key={screen.slug}>
              <Link
                href={`/visualisations/${slug}/${screen.slug}`}
                className="focus-ring flex items-center justify-between gap-4 rounded-5 border-0.5 border-hairline bg-surface px-4 py-3 transition hover:border-text3"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <Typography as="span" size="15" bold>
                    {screen.meta.title}
                  </Typography>
                  {screen.meta.blurb && (
                    <Typography as="span" size="xs" className="text-text2">
                      {screen.meta.blurb}
                    </Typography>
                  )}
                </span>
                <Badge tone={screen.meta.chrome === "salesforce" ? "pending" : "neutral"}>
                  {screen.meta.chrome === "salesforce" ? "Salesforce" : "Light"}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-auto border-t-0.5 border-hairline pt-6">
        <BackLink />
      </footer>
    </main>
  );
}

function BackLink() {
  return (
    <Link
      href="/"
      className="focus-ring flex w-fit items-center gap-1.5 text-sm font-medium text-accentText underline underline-offset-4"
    >
      <ArrowLeft size={14} aria-hidden />
      All visualisations
    </Link>
  );
}
