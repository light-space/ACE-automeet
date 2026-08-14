import React from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * Light's two-column detail sheet — the shape a finance user spends most of
 * their day inside. Ported from axolotl's `DefaultPageDetailsLayout`
 * (`src/components/ui/PageDetailsDialog.tsx` @ 2eeea2714).
 *
 * The recognisable parts, all preserved:
 *   - a sticky `h-16` bar carrying a close affordance and the record's title
 *   - `grid grid-cols-2 gap-6 p-6`, with `[&>*:only-child]:col-span-2` so the
 *     details column takes the full width when there is no document
 *   - the document panel on the right in `rounded-2xl bg-surface-level-2` — one
 *     surface level below the sheet, which is what makes it read as a well
 *     rather than a card
 *
 * Ported as a *shape*, not machinery. axolotl's version is a Radix Dialog with
 * a scroll area, a skeleton state and a `useDocumentPreviewVisibility` store;
 * none of that exists here. This renders inline, statically, and closes nothing
 * — the ✕ is chrome, like every other control in these prototypes.
 *
 * Values inside `details` are still data: route them through `Field`.
 */

export type DetailSheetProps = {
  /** Record title in the sticky bar. Static chrome — the record's name. */
  title: string;
  /** Right-hand slot of the sticky bar — a status badge, an action. */
  headerSlot?: React.ReactNode;
  /** Full-width notice above both columns. Reach for `Callout`. */
  stateBanner?: React.ReactNode;
  /** Left column: the record's fields. */
  details: React.ReactNode;
  /**
   * Right column: the source document. Omit it and `details` spans both
   * columns, which is axolotl's own `[&>*:only-child]:col-span-2` behaviour.
   */
  document?: React.ReactNode;
  /** Caption above the document panel, e.g. "invoice-10428.pdf". */
  documentLabel?: string;
  /** Full-width row below both columns — line items, an activity log. */
  footer?: React.ReactNode;
  className?: string;
};

export function DetailSheet({
  title,
  headerSlot,
  stateBanner,
  details,
  document,
  documentLabel,
  footer,
  className,
}: DetailSheetProps) {
  return (
    <div
      className={cn(
        // No `overflow-hidden` here, unlike axolotl: it would become the sticky
        // bar's scroll container and pin the bar in place. In axolotl the
        // ScrollArea inside the sheet plays that role; here the chrome's
        // content card does.
        "flex w-full flex-col rounded-lg bg-surface-level-1 pb-2",
        className
      )}
    >
      <div className="sticky top-0 z-10 flex h-16 w-full items-center gap-2 border-b-0.5 border-border-tertiary bg-surface-level-1 px-4">
        <span
          aria-hidden
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-icon-secondary"
        >
          <X className="h-4 w-4 stroke-1.5" />
        </span>
        <Typography as="h2" size="15" bold className="min-w-0 truncate">
          {title}
        </Typography>
        {headerSlot && <div className="ml-auto flex flex-shrink-0 items-center gap-2">{headerSlot}</div>}
      </div>

      <div className="grid grid-cols-2 gap-6 p-6 [&>*:only-child]:col-span-2">
        <div className="flex flex-col gap-4" id="details-section">
          {stateBanner}
          <div className="flex flex-col gap-4">{details}</div>
        </div>

        {document && (
          <div className="flex flex-col gap-2">
            {documentLabel && (
              <Typography size="xs" className="text-text-secondary">
                {documentLabel}
              </Typography>
            )}
            {/* The document well. `rounded-2xl` + one surface level down is the
                whole trick — do not turn this into a bordered card. */}
            <div className="flex-1 rounded-2xl bg-surface-level-2 p-4">{document}</div>
          </div>
        )}
      </div>

      {footer && <div className="flex flex-col gap-4 px-6 pb-6">{footer}</div>}
    </div>
  );
}
