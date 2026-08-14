import React from "react";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/cn";

/**
 * Ported from axolotl `src/components/ui/Typography.tsx` @ 2eeea2714.
 *
 * Every piece of text on a screen goes through this. Do not hand-roll
 * `text-sm font-bold` on a raw <span>.
 *
 * Kept: the full `size` scale (3xs…5xl, including the odd `15`), `bold`, the
 * polymorphic `as`, and axolotl's habit of putting a default text colour on the
 * base class rather than leaving it to inherit.
 *
 * Changed: axolotl's `As` / `WithAs` / `WithChildren` globals do not exist
 * here, so `as` is narrowed to the tags a static screen actually needs, and
 * `size` defaults to `sm` rather than being required.
 *
 * The base colour is `text-chrome-text` — the enclosing chrome's default text,
 * whichever playbook that is. It used to be `text-text-default`, one of Light's
 * tokens, which meant every unstyled word on a Salesforce screen was quietly
 * Light-coloured. There is no `color` prop and there should not be one: pass a
 * `text-chrome-*` class when a piece of text is weak or inverted, and let the
 * chrome decide what those are.
 */

export type TypographySize =
  | "3xs"
  | "2xs"
  | "xs"
  | "sm"
  | "15"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl";

type Tag =
  | "span"
  | "p"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "label"
  | "td"
  | "th"
  | "li";

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
      "3xs": "text-[7px]",
      "2xs": "text-[10px]",
      xs: "text-xs",
      sm: "text-sm",
      "15": "text-[15px]",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
    },
    bold: { true: "font-bold", false: "font-normal" },
  },
});

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  function TypographyComponent(
    { as = "span", size = "sm", bold = false, className, children, ...rest },
    ref
  ) {
    return React.createElement(
      as,
      { ...rest, ref, className: cn("text-chrome-text", typography({ size, bold }), className) },
      children
    );
  }
);
