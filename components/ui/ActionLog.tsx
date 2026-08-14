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
 * ── Why this component knows which chrome it is in ──────────────────────────
 * An audit trail is one of the few shapes that appears in BOTH shells — sales
 * approvals in Salesforce, invoice history in Light. It used to render the same
 * card in both, in KeyShot's tokens, with the timeline dots in brand orange.
 * That was wrong in both places: KeyShot's orange belongs to KeyShot's own
 * surfaces, not painted onto a third party's product chrome. So `chrome`
 * selects the palette, and there is no orange in any of the three.
 */

export type ActionLogEntry = {
  at: ProvenancedValue;
  actor: ProvenancedValue;
  /** Fixed verb phrase, e.g. "Approved quote". Static chrome, not data. */
  action: string;
  detail?: ProvenancedValue;
};

/**
 * Which shell this log is rendering inside. Pass the one that matches the
 * chrome the screen wraps itself in — `keyshot` is for our own surfaces (the
 * gallery, a framing page), not for a screen in either product's chrome.
 */
export type ActionLogChrome = "keyshot" | "light" | "salesforce";

type ChromeSpec = {
  card: string;
  rule: string;
  title: string;
  body: string;
  dot: string;
  connector: string;
};

const chromeSpecs: Record<ActionLogChrome, ChromeSpec> = {
  keyshot: {
    card: "rounded-5 border-0.5 border-hairline bg-surface",
    rule: "border-b-0.5 border-hairline",
    title: "text-ink",
    body: "text-text2",
    // Was `bg-accent`. A timeline dot is a fill, so the colour rule permitted
    // it — but the orange still does not belong on a product shell.
    dot: "bg-text3",
    connector: "bg-hairline",
  },
  light: {
    card: "rounded-lg border-0.5 border-border-secondary bg-surface-level-1",
    rule: "border-b-0.5 border-border-secondary",
    title: "text-text-default",
    body: "text-text-secondary",
    dot: "bg-icon-secondary",
    connector: "bg-border-secondary",
  },
  salesforce: {
    card: "rounded-sf-lg border border-sf-border bg-sf-card font-slds",
    rule: "border-b border-sf-border",
    title: "text-sf-text",
    body: "text-sf-weak",
    dot: "bg-sf-brand",
    connector: "bg-sf-border-strong",
  },
};

export type ActionLogProps = {
  entries: ActionLogEntry[];
  /** Static heading. Defaults to "Activity log". */
  title?: string;
  /** Base name for the exported file. `.csv` is appended. */
  exportFilename?: string;
  /** Palette to render in. Match the screen's chrome. */
  chrome?: ActionLogChrome;
  className?: string;
};

const CSV_HEADERS = ["Timestamp", "Actor", "Action", "Detail"];

export function ActionLog({
  entries,
  title = "Activity log",
  exportFilename = "activity-log",
  chrome = "keyshot",
  className,
}: ActionLogProps) {
  const spec = chromeSpecs[chrome];
  const csvRows = entries.map((entry) => [
    entry.at.v,
    entry.actor.v,
    entry.action,
    entry.detail?.v ?? "",
  ]);

  return (
    <div className={cn(spec.card, className)}>
      <div className={cn("flex items-center justify-between gap-3 px-4 py-3", spec.rule)}>
        <Typography as="h3" size="sm" bold className={spec.title}>
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
                  className={cn("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", spec.dot)}
                  aria-hidden
                />
                {!isLast && <span className={cn("w-px flex-1", spec.connector)} aria-hidden />}
              </div>

              <div className={cn("flex min-w-0 flex-1 flex-col gap-0.5", !isLast && "pb-4")}>
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <FieldValue value={entry.actor} />
                  <Typography as="span" size="sm" className={spec.body}>
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
