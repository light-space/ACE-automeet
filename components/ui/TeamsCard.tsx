import React from "react";

import { cn } from "@/lib/cn";
import { chromeScope } from "@/components/chrome/ChromeContext";
import { Button } from "@/components/ui/Button";
import { Field, FieldValue } from "@/components/ui/Field";
import { Typography } from "@/components/ui/Typography";
import type { ProvenancedValue } from "@/lib/tokens";

/**
 * A Microsoft Teams message card, rendered as it would appear in a Teams channel.
 *
 * Reach for it whenever a prototype screen needs to show a notification that
 * leaves the product and lands where the KeyShot team actually works. This
 * organisation runs on Microsoft Teams: every channel notification, approval
 * prompt and digest in these prototypes is a Teams card. There is no second
 * messaging surface to design for.
 *
 * Facts are data and route through `Field` / `FieldValue`, so Illustrative
 * values badge themselves even inside third-party chrome. Actions are
 * deliberately inert `Button`s — these screens do not wire anything up.
 *
 * ── This card does NOT adopt the surrounding chrome, and that is deliberate ─
 * Every other shared component here follows the chrome context: put it in
 * `SalesforceChrome` and it turns SLDS. This one opens its OWN scope instead
 * (`chromeScope("teams")`), so a Teams card is Teams-coloured on a Salesforce
 * screen and on a Light screen alike.
 *
 * The reason is what the card is claiming. A notification card is not part of
 * the product it sits next to — it is a picture of a message arriving in a
 * different application, and the point being made is precisely that the work
 * LEAVES the system and lands where the team already is. Painting it Salesforce
 * blue would assert that Teams looks different inside Salesforce, which is not
 * true of any screenshot anyone in that workshop has ever seen; the card would
 * stop reading as Teams and start reading as an in-product panel, which is the
 * opposite of the point.
 *
 * So: chrome-aware components adopt their surroundings, and a third-party
 * surface keeps its own. The context nesting is what makes both possible from
 * one mechanism — the `Field`s and `Button`s inside this card resolve against
 * the Teams scope, not the screen's.
 *
 * Teams' colours live with the other scopes in `lib/chrome-theme/`, sourced
 * from Fluent UI v9's `teamsLightTheme`, so this file carries no hexes at all.
 */

export type TeamsFact = {
  label: string;
  value: ProvenancedValue;
};

export type TeamsCardProps = {
  /** Channel the card is posted into, e.g. "Revenue Ops". Static chrome. */
  channel?: string;
  /** Posting app or person. Static chrome. */
  author?: string;
  /** When it was posted — data, so provenanced. */
  timestamp?: ProvenancedValue;
  title: string;
  facts?: TeamsFact[];
  /** Labels for non-functional action buttons along the card footer. */
  actions?: string[];
  className?: string;
};

export function TeamsCard({
  channel,
  author,
  timestamp,
  title,
  facts,
  actions,
  className,
}: TeamsCardProps) {
  return (
    <div
      {...chromeScope("teams")}
      className={cn(
        "flex overflow-hidden rounded-chrome-card border-rule border-chrome-border bg-chrome-card font-chrome",
        className
      )}
    >
      {/* Teams' purple accent bar down the left of a message card. */}
      <div className="w-1 shrink-0 bg-chrome-marker" aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-chrome-marker text-xs font-semibold text-chrome-inverse"
            aria-hidden
          >
            {(author ?? "MT").slice(0, 2).toUpperCase()}
          </div>

          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            {author && (
              <Typography as="span" size="sm" bold className="text-chrome-text">
                {author}
              </Typography>
            )}
            {channel && (
              <Typography as="span" size="xs" className="text-chrome-faint">
                Microsoft Teams · {channel}
              </Typography>
            )}
            {timestamp && <FieldValue value={timestamp} />}
          </div>
        </div>

        <Typography as="h3" size="15" bold className="text-chrome-text">
          {title}
        </Typography>

        {facts && facts.length > 0 && (
          <div className="flex flex-col gap-1.5 border-t-rule border-chrome-border pt-3">
            {facts.map((fact) => (
              <Field key={fact.label} label={fact.label} value={fact.value} layout="inline" />
            ))}
          </div>
        )}

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {actions.map((action, index) => (
              <Button key={action} intent={index === 0 ? "primary" : "outline"}>
                {action}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
