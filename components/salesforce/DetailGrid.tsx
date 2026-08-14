import React from "react";

import { cn } from "@/lib/cn";
import { FieldValue } from "@/components/ui/Field";
import { Typography } from "@/components/ui/Typography";
import type { ProvenancedValue } from "@/lib/tokens";

/**
 * The **Details tab** of a Lightning record page: a two-column grid of fields,
 * label in weak text above the value, sections separated by a hairline.
 *
 * This is the shape a record's own data takes in Salesforce. It is not a
 * `Table` — a table is for many records, this is for one — and it is not
 * Light's `DetailSheet`, which pairs fields with a source document because
 * that is what a finance reviewer needs.
 *
 * ── Provenance, and one honest caveat ───────────────────────────────────────
 * Field values are `ProvenancedValue` and route through `FieldValue`, so an
 * invented value badges itself. But on a Salesforce screen there is a second
 * thing that can be invented: **which fields are on the layout, and in what
 * order.** KeyShot's Salesforce quoting is custom-coded, not standard CPQ, so
 * we have no page layout to copy — any quote field arrangement we draw is our
 * inference, however accurate the chrome around it is.
 *
 * That is what `note` is for. Pass it whenever the arrangement is inferred, and
 * say so in the client's terms. A reader can then tell an inferred *layout*
 * from an inferred *value*, which the per-field markers alone cannot express.
 */

export type DetailField = {
  /** Field label. Static chrome. */
  label: string;
  value: ProvenancedValue;
  /** Force the field across both columns — long text areas, addresses. */
  wide?: boolean;
};

export type DetailSection = {
  /** Section heading, e.g. "Quote Information". Static chrome. */
  title?: string;
  fields: readonly DetailField[];
};

export type DetailGridProps = {
  sections: readonly DetailSection[];
  /**
   * Provenance of the *layout itself*. Rendered under the heading as a caveat.
   * Use it whenever the field arrangement is inferred rather than observed.
   */
  note?: string;
  /** Card heading. Defaults to "Details". */
  title?: string;
  className?: string;
};

export function DetailGrid({ sections, note, title = "Details", className }: DetailGridProps) {
  return (
    <section
      className={cn("rounded-sf-lg border border-sf-border bg-sf-card font-slds", className)}
    >
      <header className="border-b border-sf-border px-4 py-3">
        <Typography as="h3" size="sm" bold className="text-sf-text">
          {title}
        </Typography>
        {note && (
          <Typography as="p" size="xs" className="mt-1 text-sf-weak">
            {note}
          </Typography>
        )}
      </header>

      <div className="flex flex-col">
        {sections.map((section, index) => (
          <div
            key={section.title ?? index}
            className={cn("px-4 py-4", index > 0 && "border-t border-sf-border")}
          >
            {section.title && (
              <Typography
                as="h4"
                size="2xs"
                bold
                className="mb-3 uppercase tracking-wide text-sf-weak"
              >
                {section.title}
              </Typography>
            )}
            <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {section.fields.map((field) => (
                <div
                  key={field.label}
                  className={cn("flex min-w-0 flex-col gap-1", field.wide && "sm:col-span-2")}
                >
                  <dt>
                    <Typography size="xs" className="text-sf-weak">
                      {field.label}
                    </Typography>
                  </dt>
                  <dd className="min-w-0 border-b border-dashed border-sf-border pb-1">
                    <FieldValue value={field.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
