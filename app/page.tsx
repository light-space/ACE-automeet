import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Typography } from "@/components/ui/Typography";
import { SCREENS } from "@/lib/screens";

/**
 * Run index. Lists every prototype screen registered in `lib/screens.ts`.
 * This is the page a workshop facilitator opens first, so it stays plain.
 */

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-3 border-b-0.5 border-hairline pb-6">
        <Typography as="span" size="xs" className="uppercase tracking-wide text-accentText">
          KeyShot ACE
        </Typography>
        <Typography as="h1" size="3xl" bold>
          Prototype screens
        </Typography>
        <Typography as="p" size="sm" className="max-w-2xl text-text2">
          Future-state screens for workshop review. Each one renders inside the application
          chrome its real users would see. Values marked{" "}
          <span className="rounded-full bg-illustrative px-1.5 py-0.5 text-[10px] font-medium text-illustrative">
            Illustrative
          </span>{" "}
          are invented to make the screen legible — they are not sourced from KeyShot.
        </Typography>
      </header>

      {SCREENS.length === 0 ? (
        <Callout tone="info" title="No screens yet">
          <Typography as="p" size="sm" className="text-text2">
            This is the app backbone. Add a screen at{" "}
            <code className="rounded bg-softFill px-1 py-0.5 text-xs">
              app/prototype/&lt;slug&gt;/page.tsx
            </code>{" "}
            and register it in{" "}
            <code className="rounded bg-softFill px-1 py-0.5 text-xs">lib/screens.ts</code>. See{" "}
            <Link href="/fallback" className="text-accentText underline underline-offset-4">
              the fallback screen
            </Link>{" "}
            for the component vocabulary.
          </Typography>
        </Callout>
      ) : (
        <ul className="flex flex-col gap-3">
          {SCREENS.map((screen) => (
            <li key={screen.slug}>
              <Link
                href={`/prototype/${screen.slug}`}
                className="focus-ring flex items-center justify-between gap-4 rounded-5 border-0.5 border-hairline bg-surface px-4 py-3 transition hover:border-text3"
              >
                <span className="flex min-w-0 flex-col gap-1">
                  <Typography as="span" size="15" bold>
                    {screen.title}
                  </Typography>
                  <Typography as="span" size="xs" className="text-text2">
                    {screen.blurb}
                  </Typography>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <Badge tone={screen.chrome === "salesforce" ? "pending" : "neutral"}>
                    {screen.chrome === "salesforce" ? "Salesforce" : "Light"}
                  </Badge>
                  {!screen.built && <Badge tone="draft">Draft</Badge>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-auto border-t-0.5 border-hairline pt-6">
        <Typography as="p" size="xs" className="text-text3">
          Read CLAUDE.md before adding a screen. The six hard constraints are not negotiable.
        </Typography>
      </footer>
    </main>
  );
}
