import React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

/**
 * Adapted from axolotl `src/components/ui/Typography.tsx`.
 *
 * Simplified: axolotl's version carries a global `As`/`WithAs` type helper set
 * that only exists in that repo. Here the polymorphism is narrowed to the tags
 * a prototype screen actually needs, which keeps the component dependency-free.
 *
 * Every piece of text on a screen goes through this. Do not hand-roll
 * `text-sm font-bold` on a raw <span>.
 */

export type TypographySize =
  | "2xs"
  | "xs"
  | "sm"
  | "15"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

type Tag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "label" | "td" | "th" | "li";

export type TypographyProps = {
  as?: Tag;
  size?: TypographySize;
  bold?: boolean;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "color">;

const typography = cva("", {
  variants: {
    size: {
      "2xs": "text-[10px]",
      xs: "text-xs",
      sm: "text-sm",
      "15": "text-[15px]",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    bold: { true: "font-semibold", false: "font-normal" },
  },
  defaultVariants: { size: "sm", bold: false },
});

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  function TypographyComponent({ as = "span", size = "sm", bold = false, className, children, ...rest }, ref) {
    return React.createElement(
      as,
      { ...rest, ref, className: cn("text-ink", typography({ size, bold }), className) },
      children
    );
  }
);
