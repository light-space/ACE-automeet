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
    <div className={cn("rounded-5 border-0.5 border-hairline bg-surface", className)}>
      <div className="flex items-center justify-between gap-3 border-b-0.5 border-hairline px-4 py-3">
        <Typography as="h3" size="sm" bold className="text-ink">
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
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                {!isLast && <span className="w-px flex-1 bg-hairline" aria-hidden />}
              </div>

              <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", !isLast && "pb-4")}>
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <FieldValue value={entry.actor} />
                  <Typography as="span" size="sm" className="text-text2">
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
