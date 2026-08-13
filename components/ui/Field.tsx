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
 */

export type FieldProps = {
  label: string;
  value: ProvenancedValue;
  hint?: string;
  className?: string;
  /** Stack label above value (default) or lay them out side by side. */
  layout?: "stacked" | "inline";
};

/** The chip. Amber and deliberately off-palette so it reads as a caveat, not decoration. */
export function IllustrativeChip({ className }: { className?: string }) {
  return (
    <span
      title="Illustrative — this value is invented to make the screen legible. It is not sourced from KeyShot."
      className={cn(
        "inline-flex h-[18px] shrink-0 items-center rounded-full bg-illustrative px-1.5 text-[10px] font-medium text-illustrative",
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
        className={cn("text-text2", layout === "inline" && "w-40 shrink-0")}
      >
        {label}
      </Typography>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <FieldValue value={value} />
      </div>

      {hint && (
        <Typography as="span" size="xs" className="text-text3">
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
      <Typography as="span" size="sm" className="truncate text-ink">
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
