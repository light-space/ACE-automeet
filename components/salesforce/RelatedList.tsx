import React from "react";

import { ChevronDown, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { FieldValue } from "@/components/ui/Field";
import { Typography } from "@/components/ui/Typography";
import type { ProvenancedValue } from "@/lib/tokens";

/**
 * SLDS **related list** — the card that hangs off a record: "Contact Roles (3)",
 * "Quote Line Items (12)", "Approval History (2)".
 *
 * A Lightning record page is mostly these. If a screen needs to show records
 * that belong to the record on screen, this is the shape, not a bare `Table`.
 *
 * Two Salesforce-specific tells worth keeping: the **count in the header** —
 * SLDS writes `(3)`, or `(6+)` when the list is truncated — and the **View All
 * footer**. Both are in the API because leaving them out is what makes a
 * lookalike look wrong.
 *
 * Cells are `ProvenancedValue` and render through `FieldValue`, so an invented
 * row badges itself as Illustrative exactly as it does in `Table`. A cell can
 * also be a ReactNode (a `Badge`, say) when it is chrome rather than data.
 */

export type RelatedListColumn = {
  key: string;
  /** Column heading. Static chrome, not data. */
  header: string;
  /** Lucide glyph rendered before the heading. */
  icon?: LucideIcon;
  align?: "left" | "right";
};

export type RelatedListRow = Record<string, ProvenancedValue | React.ReactNode>;

export type RelatedListProps = {
  /** Object name, e.g. "Quote Line Items". Static chrome. */
  title: string;
  columns: readonly RelatedListColumn[];
  rows: readonly RelatedListRow[];
  /**
   * Count shown beside the title. Defaults to `rows.length`. Pass a string to
   * reproduce SLDS's truncation form — `"6+"`.
   */
  count?: number | string;
  /** Object icon monogram in the header tile. Two letters. */
  icon?: string;
  /** Footer link label. Set to `null` to drop the footer. */
  viewAllLabel?: string | null;
  className?: string;
};

function isProvenanced(cell: unknown): cell is ProvenancedValue {
  return (
    typeof cell === "object" &&
    cell !== null &&
    "p" in (cell as Record<string, unknown>) &&
    "v" in (cell as Record<string, unknown>)
  );
}

export function RelatedList({
  title,
  columns,
  rows,
  count,
  icon,
  viewAllLabel = "View All",
  className,
}: RelatedListProps) {
  const monogram = (icon ?? title.slice(0, 2)).toUpperCase();
  const shownCount = count ?? rows.length;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-sf-lg border border-sf-border bg-sf-card font-slds",
        className
      )}
    >
      <header className="flex items-center gap-2 border-b border-sf-border px-4 py-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sf-md bg-sf-brand">
          <Typography size="3xs" bold className="text-sf-inverse">
            {monogram}
          </Typography>
        </span>
        <Typography as="h3" size="sm" bold className="truncate text-sf-link">
          {title}
        </Typography>
        <Typography size="sm" className="shrink-0 text-sf-weak">
          ({shownCount})
        </Typography>
        <ChevronDown size={14} aria-hidden className="ml-auto shrink-0 text-sf-weak" />
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-sf-border bg-sf-page">
              {columns.map((column) => {
                const Icon = column.icon;
                return (
                  <th key={column.key} scope="col" className="px-4 py-2">
                    <span
                      className={cn(
                        "flex items-center gap-1.5",
                        column.align === "right" && "justify-end"
                      )}
                    >
                      {Icon && <Icon size={12} aria-hidden className="shrink-0 text-sf-weak" />}
                      <Typography size="2xs" bold className="uppercase tracking-wide text-sf-weak">
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
              <tr key={rowIndex} className="border-b border-sf-border last:border-b-0">
                {columns.map((column) => {
                  const cell = row[column.key];
                  return (
                    <td key={column.key} className="px-4 py-2 align-middle">
                      <span
                        className={cn(
                          "flex items-center gap-2",
                          column.align === "right" && "justify-end"
                        )}
                      >
                        {isProvenanced(cell) ? <FieldValue value={cell} /> : cell}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewAllLabel && (
        <footer className="border-t border-sf-border px-4 py-2 text-center">
          <Typography size="xs" bold className="text-sf-link">
            {viewAllLabel}
          </Typography>
        </footer>
      )}
    </section>
  );
}
