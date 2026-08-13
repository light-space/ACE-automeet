import React from "react";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { FieldValue } from "@/components/ui/Field";
import { Typography } from "@/components/ui/Typography";
import type { ProvenancedValue } from "@/lib/tokens";

/**
 * A static, presentational table for prototype screens.
 *
 * Reach for it whenever a screen shows a list of records — quote lines, invoice
 * runs, opportunity rows. Columns may carry an `icon`, which renders as a small
 * lucide glyph immediately before the header text (pattern lifted from axolotl's
 * ledger tables; keep it — it is how a reader scans a wide table).
 *
 * Cells are the important part: pass a `ProvenancedValue` (`{ p, v }`) and the
 * cell routes through `FieldValue`, so Illustrative values badge themselves. Pass
 * a React node instead when the cell is chrome rather than data — a `Badge`, a
 * `Button`. Never interpolate a raw string into a cell; that defeats the gate.
 */

export type TableColumn = {
  key: string;
  header: string;
  icon?: LucideIcon;
  align?: "left" | "right";
};

export type TableRow = Record<string, ProvenancedValue | React.ReactNode>;

export type TableProps = {
  columns: TableColumn[];
  rows: TableRow[];
  /** Optional caption rendered above the table as static chrome. */
  caption?: string;
  className?: string;
};

/** Shape guard: is this cell a provenanced value rather than a React node? */
function isProvenanced(cell: unknown): cell is ProvenancedValue {
  if (typeof cell !== "object" || cell === null) return false;
  const candidate = cell as { p?: unknown; v?: unknown };
  return (
    typeof candidate.v === "string" &&
    (candidate.p === "V" || candidate.p === "I" || candidate.p === "X")
  );
}

export function Table({ columns, rows, caption, className }: TableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-5 border-0.5 border-hairline bg-surface",
        className
      )}
    >
      {caption && (
        <div className="border-b-0.5 border-hairline px-4 py-3">
          <Typography as="h3" size="sm" bold className="text-ink">
            {caption}
          </Typography>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-0.5 border-hairline bg-floor">
              {columns.map((column) => {
                const Icon = column.icon;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn(
                      "px-4 py-2 font-medium",
                      column.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5",
                        column.align === "right" && "flex-row-reverse"
                      )}
                    >
                      {Icon && <Icon size={13} strokeWidth={2} className="shrink-0 text-text3" />}
                      <Typography as="span" size="xs" className="tracking-wide text-text2">
                        {column.header}
                      </Typography>
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b-0.5 border-hairline last:border-b-0 hover:bg-floor"
              >
                {columns.map((column) => {
                  const cell = row[column.key];
                  return (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-2.5 align-middle",
                        column.align === "right" && "text-right"
                      )}
                    >
                      {isProvenanced(cell) ? (
                        <FieldValue
                          value={cell}
                          className={column.align === "right" ? "justify-end" : undefined}
                        />
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
