import React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

/**
 * Adapted from axolotl `src/components/ui/Button.tsx`.
 *
 * Kept: the `intent` vocabulary, the 8px/`h-8`/`rounded-[6px]` geometry, the
 * `focus-ring` treatment and the disabled semantics (`aria-disabled` +
 * `pointer-events-none`).
 *
 * Dropped: the `magic` gradient intent (Light-branded, wrong for KeyShot), the
 * polymorphic `as` machinery, the Tooltip-based `disabledReason` overlay, and
 * the loading spinner — none earn their weight in a static prototype.
 *
 * `primary` fills with brand accent. That is a *background*, which is the only
 * legitimate use of #FF6105; the label on it is white.
 */

export type ButtonIntent = "primary" | "secondary" | "outline" | "ghost";

const buttonVariants = cva(
  "inline-flex h-8 shrink-0 cursor-pointer select-none items-center justify-center gap-2 rounded-[6px] px-3 text-sm font-medium transition focus-ring aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
  {
    variants: {
      intent: {
        primary: "bg-accent text-white hover:brightness-95 active:brightness-90",
        secondary: "bg-softFill text-ink hover:bg-hairline",
        outline: "border-0.5 border-hairline bg-surface text-ink hover:border-text3",
        ghost: "text-text2 hover:bg-softFill",
      },
      fullWidth: { true: "w-full" },
      square: { true: "w-8 p-0" },
    },
    defaultVariants: { intent: "secondary" },
  }
);

export type ButtonProps = {
  intent?: ButtonIntent;
  fullWidth?: boolean;
  square?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { intent = "secondary", fullWidth, square, disabled, className, children, ...rest },
  ref
) {
  return (
    <button
      {...rest}
      ref={ref}
      type={rest.type ?? "button"}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(buttonVariants({ intent, fullWidth, square }), className)}
    >
      {children}
    </button>
  );
});
