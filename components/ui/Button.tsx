import React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

/**
 * Ported from axolotl `src/components/ui/Button.tsx` @ 2eeea2714.
 *
 * Kept: the full `intent` vocabulary — including `magic`, whose pink→purple
 * gradient is Light's AI affordance and one of the few saturated things in the
 * product — the `h-8` / `rounded-[6px]` / `px-3` geometry, the focus ring, the
 * `square` and `fullWidth` variants, and the disabled semantics.
 *
 * Dropped: the `Tooltip`-backed `disabledReason` overlay and the `AppLink`
 * branch of the polymorphic `as` type. Neither earns its weight in a static
 * prototype — there is nothing to hover and nothing to navigate to.
 *
 * ── The fills come from the chrome, the geometry does not ───────────────────
 * A button appears on every screen in both shells, and the two products draw it
 * differently in a way a reader clocks instantly: Light's `primary` is a
 * near-black neutral (Light has no saturated brand primary at all), while
 * Lightning's is `brand-accessible` blue and its neutral button is a WHITE fill
 * with a grey outline and a blue label, not a grey fill. This file used to
 * hardcode Light's version of both, so every Salesforce screen carried Light's
 * buttons.
 *
 * So the fills, text pairs, radius and focus ring resolve through the chrome
 * context. **There is no palette prop and no `intent="brand"`.** KeyShot's
 * #FF6105 appears on neither shell — it belongs on our own surfaces.
 *
 * `intent="magic"` is the exception and stays Light's: the pink→purple gradient
 * is a specific Light affordance for AI actions, not a generic one. It has no
 * Salesforce equivalent, so do not reach for it on a Salesforce screen.
 */

export type ButtonIntent =
  | "magic"
  | "secondary"
  | "outline"
  | "ghost"
  | "delete"
  | "primary";

export type ButtonStyleVariants = {
  intent?: ButtonIntent;
  fullWidth?: boolean;
  square?: boolean;
};

export const buttonVariants = cva(
  "relative flex h-8 cursor-pointer select-none items-center justify-center gap-2 rounded-chrome-control px-3 text-chrome-text transition",
  {
    variants: {
      intent: {
        // Light's AI gradient, kept verbatim. The one intent that does not
        // follow the chrome — see the note at the top of this file.
        magic:
          "rounded-[6px] text-text-white-on-dark group-disabled:text-text-on-disabled-magic group-disabled:[&>svg]:text-icon-on-disabled-magic",
        primary:
          "bg-chrome-button-primary text-chrome-on-button-primary hover:bg-chrome-button-primary-hover group-disabled:opacity-50",
        secondary:
          "bg-chrome-button-secondary text-chrome-on-button-secondary hover:bg-chrome-button-hover active:bg-chrome-button-pressed group-disabled:text-chrome-faint",
        outline:
          // 1px, not `border-rule`: the 0.5px hairline is Light's RULE weight,
          // between rows and panels. Both products outline a control at 1px.
          "border border-chrome-border-strong bg-chrome-card text-chrome-link hover:bg-chrome-button-hover active:bg-chrome-button-pressed group-disabled:border-chrome-border group-disabled:text-chrome-faint",
        ghost:
          "hover:bg-chrome-button-hover active:bg-chrome-button-pressed group-disabled:text-chrome-faint",
        delete:
          "bg-chrome-button-negative text-chrome-on-button-negative hover:opacity-90 group-disabled:opacity-50",
      },
      square: { true: "w-8 p-0" },
      fullWidth: { true: "w-full" },
    },
    compoundVariants: [{ intent: "magic", square: true, className: "w-7" }],
    defaultVariants: { intent: "secondary" },
  }
);

export type ButtonProps = ButtonStyleVariants & {
  /** Outer wrapper class — reach for it to customise the focus outline. */
  containerClassName?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { intent = "secondary", fullWidth, square, disabled, className, containerClassName, children, ...rest },
  ref
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={rest.type ?? "button"}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "group relative h-8 shrink-0 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed",
        intent !== "magic" && "chrome-focus-ring rounded-chrome-control",
        intent === "magic" && "outline-none focus-visible:outline-none",
        fullWidth && "w-full",
        containerClassName
      )}
    >
      {/* The magic gradient is a stroke: a gradient-filled outer pill with an
          inset fill sitting 1px inside it. Light's AI affordance, verbatim. */}
      {intent === "magic" && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-[6px] bg-gradient-to-r from-gradient-cta-fill-start to-gradient-cta-fill-end"
        >
          <span className="block h-full w-full rounded-[5px] transition-colors duration-300 group-hover:bg-button-hover-alt2 group-active:bg-button-pressed-alt2 group-disabled:bg-button-inactive-alt2" />
        </span>
      )}
      <span className={cn(buttonVariants({ intent, fullWidth, square }), className)}>
        {children}
      </span>
    </button>
  );
});
