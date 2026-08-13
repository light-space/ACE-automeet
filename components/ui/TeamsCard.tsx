import React from "react";

import { cn } from "@/lib/cn";
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
 */

/**
 * Microsoft Teams' brand purple. This is a literal third-party chrome colour,
 * NOT a KeyShot brand token — it is the one place a non-palette hex is correct,
 * because the card has to look like Teams. Do not copy it into product surfaces.
 */
const TEAMS_PURPLE = "#5B5FC7";

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
      className={cn(
        "flex overflow-hidden rounded-5 border-0.5 border-hairline bg-surface",
        className
      )}
    >
      {/* Teams accent bar — third-party chrome colour, see TEAMS_PURPLE above. */}
      <div className="w-1 shrink-0" style={{ backgroundColor: TEAMS_PURPLE }} aria-hidden />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: TEAMS_PURPLE }}
            aria-hidden
          >
            {(author ?? "MT").slice(0, 2).toUpperCase()}
          </div>

          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            {author && (
              <Typography as="span" size="sm" bold className="text-ink">
                {author}
              </Typography>
            )}
            {channel && (
              <Typography as="span" size="xs" className="text-text3">
                Microsoft Teams · {channel}
              </Typography>
            )}
            {timestamp && <FieldValue value={timestamp} />}
          </div>
        </div>

        <Typography as="h3" size="15" bold className="text-ink">
          {title}
        </Typography>

        {facts && facts.length > 0 && (
          <div className="flex flex-col gap-1.5 border-t-0.5 border-hairline pt-3">
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
