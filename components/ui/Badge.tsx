import React from "react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * Ported from axolotl `src/components/ui/Badge.tsx` @ 2eeea2714.
 *
 * Kept: the `h-[21px] rounded-full px-2` pill, the `slotLeft` icon slot, the
 * `truncate` label, and — the part that matters — axolotl's `color` vocabulary
 * mapped onto Light's real status tokens. Each entry is a background/foreground
 * PAIR (`bg-status-positive` + `text-text-on-positive`). Never pass a bare text
 * colour to a badge; the pairing is what keeps contrast honest, and it is why
 * these tones cannot be invented locally.
 *
 * Dropped: `BadgeList` / `NumberBadge` / `BadgeListCount` and the overlap-counter
 * maths — they exist to pack many badges into a live table cell, which a static
 * prototype never does. The `Tooltip` they depend on went with them.
 *
 * `STATUS_LABELS` / `StatusBadge` below are ours, not axolotl's: the KeyShot
 * document-status vocabulary, keyed to these tones.
 */

const colorThemeClasses = {
  default: "bg-status-default text-text-default",
  pending: "bg-status-pending text-text-on-pending",
  draft: "bg-status-draft text-text-on-draft",
  positive: "bg-status-positive text-text-on-positive",
  negative: "bg-status-negative text-text-on-negative",
  inactive: "bg-status-inactive text-text-on-inactive",
  progress: "bg-status-progress text-text-on-progress",
  warning: "bg-status-warning text-text-on-warning",
  inverted: "bg-status-counter text-text-white-on-dark",
} as const;

export type BadgeColor = keyof typeof colorThemeClasses;

export type BadgeProps = {
  color?: BadgeColor;
  slotLeft?: React.ReactNode;
  bold?: boolean;
  size?: React.ComponentProps<typeof Typography>["size"];
  className?: string;
  children: React.ReactNode;
};

export function Badge({
  color = "inactive",
  slotLeft,
  bold,
  size = "xs",
  className,
  children,
}: BadgeProps) {
  return (
    <Typography
      size={size}
      bold={bold}
      className={cn(
        "inline-flex h-[21px] max-w-full items-center gap-1 overflow-hidden rounded-full px-2",
        colorThemeClasses[color],
        slotLeft != null && "pl-1",
        className
      )}
    >
      {slotLeft && <span className="flex-shrink-0">{slotLeft}</span>}
      <span className="truncate">{children}</span>
    </Typography>
  );
}

/**
 * Canonical document statuses and how they render.
 *
 * `ARCHIVED` renders as **"Void"**, never "Archived" — this is real finance
 * vocabulary lifted from axolotl (`src/modules/ledger/utils.ts`), and the
 * KeyShot finance team uses the same word. Do not "fix" it.
 */
export const STATUS_LABELS = {
  DRAFT: "Draft",
  APPROVAL_PENDING: "Pending approval",
  APPROVED: "Approved",
  POSTED: "Posted",
  CLEARED: "Cleared",
  PARTIALLY_CLEARED: "Partially cleared",
  ARCHIVED: "Void",
} as const;

export type StatusKey = keyof typeof STATUS_LABELS;

const STATUS_COLORS: Record<StatusKey, BadgeColor> = {
  DRAFT: "draft",
  APPROVAL_PENDING: "pending",
  APPROVED: "positive",
  POSTED: "positive",
  CLEARED: "positive",
  PARTIALLY_CLEARED: "progress",
  ARCHIVED: "negative",
};

export function StatusBadge({ status, className }: { status: StatusKey; className?: string }) {
  return (
    <Badge color={STATUS_COLORS[status]} className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
