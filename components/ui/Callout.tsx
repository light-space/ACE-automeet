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
 *   accent    — a highlight: automation, or a new capability.
 *   positive  — confirmation that something is in good order.
 *
 * ── The tones come from the chrome ──────────────────────────────────────────
 * A standing advisory is drawn very differently by the two products, and both
 * are reproduced from one component:
 *
 *   Light        the yellow warning wash and its brown-on-yellow pair, and a
 *                yellow selection edge for `accent` — Light's only accent.
 *   Salesforce   `.slds-scoped-notification_light`: a neutral panel with a
 *                coloured GLYPH, not a saturated fill. The saturated orange bar
 *                is `.slds-theme_warning`, which is what `salesforce/Toast`
 *                renders — and a toast disappears, so a standing advisory must
 *                never be one. Constraint 2 in CLAUDE.md.
 *
 * `warning` used to be painted in the Illustrative chip's own amber, which put
 * a caveat colour and a system warning side by side meaning different things.
 * The amber now belongs to the chip alone.
 */

export type CalloutTone = "info" | "warning" | "accent" | "positive";

type ToneSpec = {
  icon: LucideIcon;
  container: string;
  /** Icon colour. May be a saturated fill — it is a glyph, never body text. */
  glyph: string;
  /** Title colour. Always the chrome's own text: a heading has to stay readable. */
  title: string;
};

const toneSpecs: Record<CalloutTone, ToneSpec> = {
  info: {
    icon: Info,
    container: "bg-chrome-floor border-chrome-border",
    glyph: "text-chrome-weak",
    title: "text-chrome-text",
  },
  warning: {
    icon: CircleAlert,
    container: "bg-chrome-warning-wash border-chrome-warning-edge",
    glyph: "text-chrome-glyph-warning",
    title: "text-chrome-text",
  },
  accent: {
    icon: Sparkles,
    container: "bg-chrome-accent-wash border-chrome-accent-edge",
    glyph: "text-chrome-accent-glyph",
    title: "text-chrome-text",
  },
  positive: {
    icon: CircleCheck,
    container: "bg-chrome-floor border-chrome-border",
    glyph: "text-chrome-glyph-positive",
    title: "text-chrome-text",
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
        "flex items-start gap-2.5 rounded-chrome-card border-rule px-3 py-2.5",
        spec.container,
        className
      )}
    >
      <Icon size={15} strokeWidth={2} aria-hidden className={cn("mt-[2px] shrink-0", spec.glyph)} />

      <div className="flex min-w-0 flex-col gap-1">
        {title && (
          <Typography as="span" size="sm" bold className={spec.title}>
            {title}
          </Typography>
        )}
        <Typography as="div" size="sm" className="text-chrome-weak">
          {children}
        </Typography>
      </div>
    </div>
  );
}
