import React from "react";

import { cn } from "@/lib/cn";
import { ExportCsv } from "@/components/ui/ExportCsv";
import { FieldValue } from "@/components/ui/Field";
import { Typography } from "@/components/ui/Typography";
import type { ProvenancedValue } from "@/lib/tokens";

/**
 * An audit trail: who did what, when, rendered as a vertical timeline.
 *
 * Reach for it whenever a screen has to answer "how did this record get into
 * this state?" — approval histories, sync records, document lifecycles.
 *
 * Two things are non-negotiable here.
 *
 * 1. Every entry value is a `ProvenancedValue` and renders through `FieldValue`,
 *    so invented timestamps and actor names badge themselves as Illustrative.
 *    `action` is the only plain string: it is a fixed verb phrase, chrome rather
 *    than data.
 * 2. The header composes `ExportCsv`. **A log the user cannot export is not
 *    finished** — see the note in `ExportCsv.tsx`. The CSV is derived from the
 *    entries' `.v` strings, so what downloads is what is on screen.
 *
 * This stays a server component; `ExportCsv` carries its own `"use client"`
 * boundary, and importing a client component from a server component is fine.
 *
 * ── This component used to take a `chrome` prop. It does not any more ───────
 * An audit trail is one of the few shapes that appears in BOTH shells — sales
 * approvals in Salesforce, invoice history in Light — so it needed to know
 * which palette to draw itself in, and it was told: `chrome="salesforce"`.
 *
 * That worked and was still the wrong shape. A prop is something a screen
 * author can forget, and forgetting it put a Light-toned card on a Salesforce
 * record with no error anywhere. Every other shared component would have needed
 * the same prop, threaded through every screen, correct every time.
 *
 * Now the chrome the component is INSIDE decides — `bg-chrome-card`,
 * `bg-chrome-marker`, `border-rule` — so there is nothing to pass and nothing
 * to get wrong. See `components/chrome/ChromeContext.tsx`.
 */

export type ActionLogEntry = {
  at: ProvenancedValue;
  actor: ProvenancedValue;
  /** Fixed verb phrase, e.g. "Approved quote". Static chrome, not data. */
  action: string;
  detail?: ProvenancedValue;
};

export type ActionLogProps = {
  entries: ActionLogEntry[];
  /** Static heading. Defaults to "Activity log". */
  title?: string;
  /** Base name for the exported file. `.csv` is appended. */
  exportFilename?: string;
  className?: string;
};

const CSV_HEADERS = ["Timestamp", "Actor", "Action", "Detail"];

export function ActionLog({
  entries,
  title = "Activity log",
  exportFilename = "activity-log",
  className,
}: ActionLogProps) {
  const csvRows = entries.map((entry) => [
    entry.at.v,
    entry.actor.v,
    entry.action,
    entry.detail?.v ?? "",
  ]);

  return (
    <div
      className={cn(
        "rounded-chrome-card border-rule border-chrome-border bg-chrome-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b-rule border-chrome-border px-4 py-3">
        <Typography as="h3" size="sm" bold className="text-chrome-text">
          {title}
        </Typography>
        <ExportCsv filename={exportFilename} headers={CSV_HEADERS} rows={csvRows} />
      </div>

      <ol className="flex flex-col px-4 py-3">
        {entries.map((entry, index) => {
          const isLast = index === entries.length - 1;
          return (
            <li key={index} className="flex gap-3">
              {/* Timeline rail: dot plus the connector down to the next entry. */}
              <div className="flex w-3 shrink-0 flex-col items-center">
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-chrome-marker"
                  aria-hidden
                />
                {!isLast && (
                  <span className="w-px flex-1 bg-chrome-border-strong" aria-hidden />
                )}
              </div>

              <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", !isLast && "pb-4")}>
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <FieldValue value={entry.actor} />
                  <Typography as="span" size="sm" className="text-chrome-weak">
                    {entry.action}
                  </Typography>
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                  <FieldValue value={entry.at} />
                  {entry.detail && <FieldValue value={entry.detail} />}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
