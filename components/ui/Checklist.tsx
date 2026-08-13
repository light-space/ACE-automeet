import React from "react";

import { Circle, CircleCheck } from "lucide-react";

import { cn } from "@/lib/cn";
import { FieldValue } from "@/components/ui/Field";
import { Typography } from "@/components/ui/Typography";
import type { ProvenancedValue } from "@/lib/tokens";

/**
 * A read-only list of steps or acceptance criteria.
 *
 * Reach for it when a screen needs to show progress through a defined sequence —
 * approval gates, document readiness, onboarding steps. It is presentational
 * only: nothing here is clickable, because these are prototype screens, not a
 * working app.
 *
 * Item labels are static chrome (the criterion is a fixed part of the screen).
 * The optional `note` is *data* — a date, a name, an amount — so it is a
 * `ProvenancedValue` and renders through `FieldValue`, which badges Illustrative
 * values automatically.
 */

export type ChecklistItem = {
  label: string;
  done?: boolean;
  note?: ProvenancedValue;
};

export type ChecklistProps = {
  items: ChecklistItem[];
  /** Static section heading rendered above the list. */
  title?: string;
  className?: string;
};

export function Checklist({ items, title, className }: ChecklistProps) {
  return (
    <div
      className={cn("rounded-5 border-0.5 border-hairline bg-surface p-4", className)}
    >
      {title && (
        <Typography as="h3" size="sm" bold className="mb-3 text-ink">
          {title}
        </Typography>
      )}

      <ul className="flex flex-col gap-2.5">
        {items.map((item, index) => {
          const Icon = item.done ? CircleCheck : Circle;
          return (
            <li key={index} className="flex items-start gap-2.5">
              <Icon
                size={15}
                strokeWidth={2}
                aria-hidden
                className={cn("mt-[3px] shrink-0", item.done ? "text-accentText" : "text-text3")}
              />

              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
                <Typography
                  as="span"
                  size="sm"
                  className={cn(item.done ? "text-text2 line-through" : "text-ink")}
                >
                  {item.label}
                </Typography>

                {item.note && <FieldValue value={item.note} />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
