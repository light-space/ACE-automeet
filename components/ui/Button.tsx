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
 * Note what is NOT here: a saturated brand fill. Light has no orange primary.
 * `intent="primary"` is `bg-button-primary`, a near-black neutral. Painting
 * this orange is how Light chrome stops looking like Light — KeyShot's
 * #FF6105 belongs to `SalesforceChrome` and to callouts, not here.
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
  "relative flex h-8 cursor-pointer select-none items-center justify-center gap-2 rounded-[6px] px-3 text-text-default transition",
  {
    variants: {
      intent: {
        magic:
          "rounded-[6px] text-text-white-on-dark group-disabled:text-text-on-disabled-magic group-disabled:[&>svg]:text-icon-on-disabled-magic",
        primary:
          "bg-button-primary text-text-inverted hover:bg-button-hover-default active:bg-button-pressed-default group-disabled:bg-button-inactive-default group-disabled:text-text-tertiary",
        secondary:
          "bg-button-secondary text-text-default hover:bg-button-hover-alt1 active:bg-button-pressed-alt1 group-disabled:bg-button-inactive-alt1 group-disabled:text-text-tertiary",
        outline:
          "border border-border-default bg-transparent text-text-default hover:border-border-hover active:bg-button-pressed-alt1 group-disabled:border-border-tertiary group-disabled:text-text-tertiary",
        ghost:
          "hover:bg-button-hover-alt1 active:bg-button-pressed-alt1 group-disabled:text-text-tertiary",
        delete:
          "bg-button-negative text-text-white-on-dark hover:bg-button-negative-hover active:bg-button-negative-pressed group-disabled:bg-button-negative-disabled",
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
        intent !== "magic" && "light-focus-ring rounded-[6px]",
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
