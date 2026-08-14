import React from "react";

import { Check } from "lucide-react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * SLDS **Path** — the stage chevron strip.
 *
 * This is the single most recognisable element on a Lightning record page. A
 * sales screen that carries a Path reads as Salesforce before anyone reads a
 * word of it; the same screen without one reads as a generic web app. Reach for
 * it on anything with a stage: opportunities, quotes, approvals, cases.
 *
 * ── The chevron ─────────────────────────────────────────────────────────────
 * SLDS builds the arrow from a rotated square pseudo-element. We use `clip-path`
 * instead, which gets the same silhouette with one element and no z-index
 * stack. Three geometry constants do all the work:
 *
 *   POINT  the depth of the arrowhead on the right of every item
 *   NOTCH  the depth of the bite taken out of the left of every item
 *   OVERLAP how far each item is pulled back over its predecessor
 *
 * `NOTCH - POINT` is the hairline of page background you can see between two
 * stages. Keep NOTCH > POINT or the stages fuse into one solid bar.
 *
 * ── Colour: the thing every Path lookalike gets wrong ───────────────────────
 * Completed stages are **green** (`#3ba755`), not brand blue. SLDS hardcodes it
 * in `.slds-path__item.slds-is-complete`; painting them blue is the single
 * clearest tell that a Path was drawn from memory. The current stage is the
 * dark brand navy and stages still to come are the neutral shade.
 *
 * SLDS separates `is-current` (the record's real stage — white with a 2px
 * `#014486` outline) from `is-active` (the stage the user has clicked into —
 * solid `#014486`). Nothing here is clickable, so the two collapse and the
 * current stage renders the way SLDS renders `is-active`. Deliberate; see
 * `lib/salesforce-theme/README.md`.
 *
 * All three colours come from `lib/salesforce-theme/`. **No KeyShot orange** —
 * this is Salesforce's chrome and it is Salesforce blue, the same way
 * `LightChrome` is Light's neutrals.
 *
 * Stage labels are static chrome (a fixed stage vocabulary), not data, so they
 * are plain strings and carry no provenance marker. The *record's position* in
 * the path is data — if it is invented, say so on the screen.
 */

const POINT = 12;
const NOTCH = 14;
const OVERLAP = 12;

export type PathStageState = "complete" | "current" | "incomplete";

export type PathProps = {
  /** Stage names, in order. Static chrome — a fixed vocabulary, not data. */
  stages: readonly string[];
  /** Index of the stage the record is currently in. Everything before it is complete. */
  currentIndex?: number;
  /** Optional right-hand action, e.g. "Mark Stage as Complete". Static label. */
  action?: string;
  className?: string;
};

function clipPath(isFirst: boolean, isLast: boolean): string {
  const right = isLast
    ? ["100% 0", "100% 100%"]
    : [`calc(100% - ${POINT}px) 0`, "100% 50%", `calc(100% - ${POINT}px) 100%`];
  const left = isFirst ? ["0 100%"] : ["0 100%", `${NOTCH}px 50%`];
  return `polygon(0 0, ${[...right, ...left].join(", ")})`;
}

const stateStyles: Record<PathStageState, string> = {
  complete: "bg-sf-path-complete text-sf-inverse",
  current: "bg-sf-path-current text-sf-inverse",
  incomplete: "bg-sf-path-incomplete text-sf-text",
};

export function Path({ stages, currentIndex = 0, action, className }: PathProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-sf-lg border border-sf-border bg-sf-card p-3 font-slds",
        className
      )}
    >
      <ol className="flex min-w-0 flex-1 items-stretch">
        {stages.map((stage, index) => {
          const state: PathStageState =
            index < currentIndex ? "complete" : index === currentIndex ? "current" : "incomplete";
          const isFirst = index === 0;
          const isLast = index === stages.length - 1;

          return (
            <li
              key={stage}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "flex h-8 min-w-0 flex-1 items-center justify-center gap-1.5 px-3",
                stateStyles[state]
              )}
              style={{
                clipPath: clipPath(isFirst, isLast),
                marginLeft: isFirst ? undefined : -OVERLAP,
                paddingLeft: isFirst ? undefined : NOTCH + 4,
              }}
            >
              {state === "complete" && (
                <Check size={12} strokeWidth={3} aria-hidden className="shrink-0" />
              )}
              <Typography
                size="xs"
                bold={state === "current"}
                className="truncate text-current"
                title={stage}
              >
                {stage}
              </Typography>
            </li>
          );
        })}
      </ol>

      {action && (
        <span className="flex h-8 shrink-0 items-center rounded-sf-md border border-sf-border-strong px-3">
          <Typography size="xs" bold className="text-sf-link">
            {action}
          </Typography>
        </span>
      )}
    </div>
  );
}
