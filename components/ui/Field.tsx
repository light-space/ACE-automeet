import React from "react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";
import type { ProvenancedValue } from "@/lib/tokens";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THE PROVENANCE GATE. This file is load-bearing — read it before you build any
 * screen that displays data.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * These prototypes get shown to a client in a workshop. Some of the numbers on
 * them come from real KeyShot artefacts; some are invented so the screen reads
 * as a screen. If the client cannot tell those two apart, the prototype is
 * actively harmful — it manufactures agreement about facts nobody established.
 *
 * So every displayed value carries a provenance marker:
 *
 *   { p: "V", v: "…" }  Verified     — from a real artefact or workshop transcript
 *   { p: "I", v: "…" }  Inferred     — a defensible derivation from something verified
 *   { p: "X", v: "…" }  Illustrative — invented to make the screen legible
 *
 * When `p === "X"`, `Field` renders an amber "Illustrative" chip beside the
 * value. Automatically. There is no prop to turn it off, because the whole
 * point is that a screen author cannot forget.
 *
 * ⚠️ THE RULE: every component that puts data on screen routes through `Field`,
 * or composes something that does (`Table` cells take `ProvenancedValue`,
 * `ActionLog` entries take them, and so on). If you find yourself interpolating
 * a value straight into JSX — `<span>{invoice.total}</span>` — stop. That is
 * exactly the bug this component exists to make impossible.
 *
 * Static chrome (column headings, button labels, nav items, section titles) is
 * not data and does not need a Field.
 *
 * ── Colour comes from the chrome, the chip does not ─────────────────────────
 * The label, value and hint resolve through the chrome context, so a Field
 * reads as Light inside `LightChrome` and as Lightning inside
 * `SalesforceChrome` without being told which. It takes no palette prop.
 *
 * The Illustrative chip is deliberately OUTSIDE that. See below.
 */

export type FieldProps = {
  label: string;
  value: ProvenancedValue;
  hint?: string;
  className?: string;
  /** Stack label above value (default) or lay them out side by side. */
  layout?: "stacked" | "inline";
};

/**
 * The chip. **The one thing on a screen that is the same in every chrome.**
 *
 * Everything else here follows the chrome context. This does not, on purpose.
 * The chip is our annotation on someone else's product — a redline, not part of
 * Light's or Salesforce's vocabulary — and it means precisely the same thing in
 * both. A caveat that recolours per screen stops being a mark a reader
 * recognises, and recognising it is the entire job.
 *
 * The amber clears 7.4:1 and reads cleanly on both shells (both are
 * light-surfaced), so the colour needs no per-chrome treatment. What it did
 * need was separating from the STATUS PILLS around it. `#894B00` on `#FEF3C7`
 * is a near sibling of Light's own warning badge (`--status-warning` +
 * `--text-on-warning`, the same brown), and it was a rounded-full pill of
 * almost exactly `Badge`'s height — so on a Light screen a caveat could read as
 * a status, which is the one confusion that must never happen.
 *
 * Hence the shape: a squared tag with a hard edge and micro-caps, next to
 * pills. Nothing in either playbook's badge vocabulary looks like this, in
 * either shell. Legibility of the mark beats palette purity here, because it is
 * the guard against showing a client an invented number as a fact.
 */
export function IllustrativeChip({ className }: { className?: string }) {
  return (
    <span
      title="Illustrative — this value is invented to make the screen legible. It is not sourced from KeyShot."
      className={cn(
        "inline-flex h-[18px] shrink-0 items-center rounded-[3px] bg-illustrative px-1.5",
        "text-[9px] font-semibold uppercase tracking-[0.06em] text-illustrative",
        "ring-1 ring-inset ring-illustrative",
        className
      )}
    >
      Illustrative
    </span>
  );
}

/**
 * Renders a provenanced value with its label. Use for anything a reader might
 * mistake for a fact.
 */
export function Field({ label, value, hint, className, layout = "stacked" }: FieldProps) {
  return (
    <div
      className={cn(
        "min-w-0",
        layout === "stacked" ? "flex flex-col gap-1" : "flex items-baseline gap-3",
        className
      )}
    >
      <Typography
        as="span"
        size="xs"
        className={cn("text-chrome-weak", layout === "inline" && "w-40 shrink-0")}
      >
        {label}
      </Typography>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <FieldValue value={value} />
      </div>

      {hint && (
        <Typography as="span" size="xs" className="text-chrome-faint">
          {hint}
        </Typography>
      )}
    </div>
  );
}

/**
 * The value half of a Field, without the label. Use inside table cells and
 * anywhere the label already exists as a column heading — it carries the same
 * automatic Illustrative badging, which is the part that matters.
 */
export function FieldValue({ value, className }: { value: ProvenancedValue; className?: string }) {
  const isIllustrative = value.p === "X";

  return (
    <span className={cn("flex min-w-0 items-center gap-2", className)}>
      <Typography as="span" size="sm" className="truncate text-chrome-text">
        {value.v}
      </Typography>
      {isIllustrative && <IllustrativeChip />}
    </span>
  );
}

/** Shorthand constructors, so screens read cleanly: `Field label="Total" value={X("£48,200")}` */
export const V = (v: string): ProvenancedValue => ({ p: "V", v });
export const I = (v: string): ProvenancedValue => ({ p: "I", v });
export const X = (v: string): ProvenancedValue => ({ p: "X", v });
