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
 *
 * Surfaces, rules, radius and text all resolve through the chrome context, so
 * the same table is a Light card with 0.5px hairlines inside `LightChrome` and
 * a white SLDS card with 1px rules inside `SalesforceChrome`. It takes no
 * palette prop.
 *
 * On a Salesforce screen, prefer `salesforce/RelatedList` when the rows are
 * records BELONGING to the record on screen — that is the shape Lightning uses,
 * and it carries the count and the View All footer. `Table` is the plain one.
 */

/**
 * The lucide-icon-prefixed column header, ported from axolotl's
 * `TableColumnHeader` (`src/components/Table.tsx` @ 2eeea2714) minus its
 * `Tooltip`. This is one of the two most recognisable shapes in Light: a 16px
 * `stroke-1.5` glyph in `icon-secondary`, then the label in `text-secondary`,
 * truncating. It is how a reader scans a wide table — give every column an icon.
 *
 * Exported so a screen can build a bespoke table head and still get the real
 * shape; `Table` below composes it for you from `columns`.
 */
export function TableColumnHeader({
  icon: Icon,
  title,
  align = "left",
  className,
  slotEnd,
}: {
  icon?: LucideIcon;
  title: string;
  align?: "left" | "center" | "right";
  className?: string;
  slotEnd?: React.ReactNode;
}) {
  return (
    <Typography
      as="span"
      size="sm"
      className={cn(
        "flex items-center gap-1 text-chrome-weak",
        align === "center" && "justify-center",
        align === "right" && "flex-row-reverse",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4 flex-shrink-0 stroke-1.5 text-chrome-icon" />}
      <span className="truncate text-chrome-weak">{title}</span>
      {slotEnd ?? null}
    </Typography>
  );
}

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
        "overflow-hidden rounded-chrome-card border-rule border-chrome-border bg-chrome-card",
        className
      )}
    >
      {caption && (
        <div className="border-b-rule border-chrome-border px-4 py-3">
          <Typography as="h3" size="sm" bold className="text-chrome-text">
            {caption}
          </Typography>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-rule border-chrome-border bg-chrome-floor">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 py-2 font-normal",
                    column.align === "right" ? "text-right" : "text-left"
                  )}
                >
                  <TableColumnHeader
                    icon={column.icon}
                    title={column.header}
                    align={column.align === "right" ? "right" : "left"}
                  />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b-rule border-chrome-border last:border-b-0 hover:bg-chrome-row-hover"
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
