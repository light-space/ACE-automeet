import React from "react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * Adapted from axolotl `src/components/ui/Badge.tsx`.
 *
 * Kept: the pill geometry (`h-[21px] rounded-full px-2`), the `slotLeft` icon
 * slot, and the status-tone vocabulary keyed draft / pending / positive /
 * negative. Recoloured onto the KeyShot palette.
 *
 * Dropped: `BadgeList` / `NumberBadge` / the overlap-counter maths — a
 * prototype screen never has enough badges in a cell to need them.
 *
 * Note the tones are background+text PAIRS. Never pass a bare text colour to a
 * badge; the pairing is what keeps contrast honest.
 */

export type BadgeTone =
  | "neutral"
  | "draft"
  | "pending"
  | "positive"
  | "negative"
  | "warning"
  | "accent";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-softFill text-text2",
  draft: "bg-[#FFEDD4] text-[#7E2A0C]",
  pending: "bg-[#DBEAFE] text-[#1C398E]",
  positive: "bg-[#D0FAE5] text-[#016630]",
  negative: "bg-[#FFE2E2] text-[#9F0712]",
  warning: "bg-illustrative text-illustrative",
  // Accent as a *fill* with the accessible accent as text. Never #FF6105 text.
  accent: "bg-accentTint text-accentText",
};

export type BadgeProps = {
  tone?: BadgeTone;
  slotLeft?: React.ReactNode;
  bold?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ tone = "neutral", slotLeft, bold, className, children }: BadgeProps) {
  return (
    <Typography
      size="xs"
      bold={bold}
      className={cn(
        "inline-flex h-[21px] max-w-full items-center gap-1 overflow-hidden rounded-full px-2",
        toneClasses[tone],
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

const STATUS_TONES: Record<StatusKey, BadgeTone> = {
  DRAFT: "draft",
  APPROVAL_PENDING: "pending",
  APPROVED: "positive",
  POSTED: "positive",
  CLEARED: "positive",
  PARTIALLY_CLEARED: "pending",
  ARCHIVED: "negative",
};

export function StatusBadge({ status, className }: { status: StatusKey; className?: string }) {
  return (
    <Badge tone={STATUS_TONES[status]} className={className}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
