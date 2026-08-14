import React from "react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * Ported from axolotl `src/components/ui/Badge.tsx` @ 2eeea2714.
 *
 * Kept: the `h-[21px] rounded-full px-2` pill, the `slotLeft` icon slot, the
 * `truncate` label, and — the part that matters — axolotl's `color` vocabulary,
 * where each entry is a background/foreground PAIR. Never pass a bare text
 * colour to a badge; the pairing is what keeps contrast honest, and it is why
 * these tones cannot be invented locally.
 *
 * ── The tones come from the chrome, not from here ───────────────────────────
 * The pairs below used to be Light's status tokens, hardcoded. A status pill is
 * one of the most-repeated shapes on a screen, so that put Light's soft pastel
 * pills on every Salesforce record in the repo — the single most visible way
 * these prototypes stopped looking like the customer's tools.
 *
 * Now each pair resolves through the chrome context, so the same `<StatusBadge
 * status="APPROVED" />` is Light's `status-positive` green wash inside
 * `LightChrome` and SLDS's solid `theme_success` inside `SalesforceChrome`.
 * **There is no `color`-to-hex mapping in this file and no palette prop.** The
 * nine names below are a vocabulary of MEANING; `lib/chrome-theme/` decides
 * what each one looks like in each playbook.
 *
 * Two consequences worth knowing before you reach for a tone:
 *   - Salesforce has no nine-tone ramp. SLDS themes success / warning / error
 *     and leaves the rest neutral or brand-tinted, so `draft`, `inactive` and
 *     `default` read alike there and the LABEL carries the meaning. That is
 *     Lightning, not a gap to paper over.
 *   - Outside both chromes (the gallery) the tones collapse to KeyShot's
 *     neutrals plus the accent, because KeyShot's brand palette has no status
 *     ramp and inventing one is forbidden.
 *
 * Dropped: `BadgeList` / `NumberBadge` / `BadgeListCount` and the overlap-counter
 * maths — they exist to pack many badges into a live table cell, which a static
 * prototype never does. The `Tooltip` they depend on went with them.
 *
 * `STATUS_LABELS` / `StatusBadge` below are ours, not axolotl's: the KeyShot
 * document-status vocabulary, keyed to these tones.
 */

const colorThemeClasses = {
  default: "bg-chrome-status-default text-chrome-on-default",
  pending: "bg-chrome-status-pending text-chrome-on-pending",
  draft: "bg-chrome-status-draft text-chrome-on-draft",
  positive: "bg-chrome-status-positive text-chrome-on-positive",
  negative: "bg-chrome-status-negative text-chrome-on-negative",
  inactive: "bg-chrome-status-inactive text-chrome-on-inactive",
  progress: "bg-chrome-status-progress text-chrome-on-progress",
  warning: "bg-chrome-status-warning text-chrome-on-warning",
  inverted: "bg-chrome-status-inverted text-chrome-on-inverted",
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
