"use client";

import React from "react";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/Button";

/**
 * A working CSV download button. Builds the file in the browser — no server, no
 * network — and hands it to the user via a temporary object URL.
 *
 * ── Hard constraint ─────────────────────────────────────────────────────────
 * **Any audit or log screen must be exportable by the user.** People who are
 * accountable for a number need to take it out of the tool and reconcile it
 * elsewhere; a log they can only read on screen is a log they cannot use. So
 * every log-like screen in these prototypes — action logs, audit trails,
 * approval histories, sync records — includes this control, and `ActionLog`
 * composes it for exactly that reason. Do not ship a log screen without it.
 *
 * This is the ONLY client component in `components/ui`. It needs a click
 * handler; nothing else here does. Importing it from a server component is
 * fine and is how `ActionLog` stays a server component.
 */

export type ExportCsvProps = {
  /** File name offered to the user. `.csv` is appended if missing. */
  filename: string;
  headers: string[];
  rows: string[][];
  /** Button label. Static chrome, not data. */
  label?: string;
  className?: string;
};

/** RFC-4180-ish escaping: wrap in quotes and double any embedded quote. */
function escapeCsvField(field: string): string {
  if (/[",\r\n]/.test(field)) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function toCsv(headers: string[], rows: string[][]): string {
  return [headers, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\r\n");
}

export function ExportCsv({
  filename,
  headers,
  rows,
  label = "Export CSV",
  className,
}: ExportCsvProps) {
  const handleExport = React.useCallback(() => {
    const csv = toCsv(headers, rows);
    // Leading BOM so Excel reads UTF-8 correctly.
    const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename.toLowerCase().endsWith(".csv") ? filename : `${filename}.csv`;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);
  }, [filename, headers, rows]);

  return (
    <Button intent="outline" onClick={handleExport} className={className}>
      {/* No colour class: the glyph inherits `currentColor` from the Button, so
          it is whatever the surrounding chrome's text colour is. It used to be
          pinned to `text-text2`, a KeyShot token, which meant this control
          carried a KeyShot colour into Light and Salesforce chrome alike. A
          control that appears in every shell has to be chrome-agnostic. */}
      <Download size={14} strokeWidth={2} aria-hidden />
      {label}
    </Button>
  );
}
