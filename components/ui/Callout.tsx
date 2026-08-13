import React from "react";

import { CircleAlert, CircleCheck, Info, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * An inline advisory box: a short piece of guidance attached to the thing it is
 * about, rather than a modal that interrupts the user.
 *
 * ── This is the component for warn-and-acknowledge messaging ─────────────────
 * When the system knows something the user should weigh but has no authority to
 * override them, the answer is a `Callout` with `tone="warning"` plus whatever
 * action the user was already taking. Warn, then let them proceed.
 *
 * The canonical case: **a missing purchase order (PO) is a WARNING, never a
 * blocker (guard-ok).** Plenty of legitimate KeyShot business is quoted and invoiced before
 * a PO number exists, and the customer supplies it later. Surface the gap so
 * nobody is surprised at collection time, and let the quote go out.
 *
 * Never build a flow that blocks a quote on a missing PO (guard-ok). If you catch yourself
 * disabling a "Send quote" button because a PO field is empty, replace the
 * disabled state with one of these.
 *
 * Tones:
 *   info      — neutral context the reader may not have.
 *   warning   — the warn-and-acknowledge tone. Proceeding stays possible.
 *   accent    — a KeyShot-branded highlight; automation or a new capability.
 *   positive  — confirmation that something is in good order.
 */

export type CalloutTone = "info" | "warning" | "accent" | "positive";

type ToneSpec = {
  icon: LucideIcon;
  container: string;
  /** Icon + title colour. Never #FF6105 as text — accent text is `text-accentText`. */
  glyph: string;
};

const toneSpecs: Record<CalloutTone, ToneSpec> = {
  info: {
    icon: Info,
    container: "bg-floor border-hairline",
    glyph: "text-text2",
  },
  warning: {
    icon: CircleAlert,
    container: "bg-illustrative border-hairline",
    glyph: "text-illustrative",
  },
  accent: {
    icon: Sparkles,
    container: "bg-accentTint border-accent",
    glyph: "text-accentText",
  },
  positive: {
    icon: CircleCheck,
    container: "bg-softFill border-hairline",
    glyph: "text-text2",
  },
};

export type CalloutProps = {
  tone?: CalloutTone;
  title?: string;
  className?: string;
  children: React.ReactNode;
};

export function Callout({ tone = "info", title, className, children }: CalloutProps) {
  const spec = toneSpecs[tone];
  const Icon = spec.icon;

  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-2.5 rounded-5 border-0.5 px-3 py-2.5",
        spec.container,
        className
      )}
    >
      <Icon size={15} strokeWidth={2} aria-hidden className={cn("mt-[2px] shrink-0", spec.glyph)} />

      <div className="flex min-w-0 flex-col gap-1">
        {title && (
          <Typography as="span" size="sm" bold className={spec.glyph}>
            {title}
          </Typography>
        )}
        <Typography as="div" size="sm" className="text-text2">
          {children}
        </Typography>
      </div>
    </div>
  );
}
