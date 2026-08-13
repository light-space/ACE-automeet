import { twMerge } from "tailwind-merge";

/** Class-name joiner with Tailwind conflict resolution. Mirrors axolotl's `customTwMerge`. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(" "));
}
