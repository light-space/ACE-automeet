import React from "react";

import { Search, Grip, ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * Salesforce Lightning Experience shell.
 *
 * Pick this chrome for ANY screen the KeyShot **sales team** touches — quotes,
 * opportunities, accounts, renewals, approvals a rep files. A sales-facing screen
 * drawn in the Light shell reads as the wrong system to a workshop audience and is
 * dead on arrival. Use `LightChrome` instead for finance / back-office screens.
 *
 * The Salesforce blue and its cool neutrals below are LITERAL SALESFORCE CHROME
 * COLOURS, not KeyShot brand tokens. That is why they appear as inline hex here and
 * are scoped to this one file — do not lift them into `lib/tokens.ts` or the Tailwind
 * palette, and do not use them on the screen body. Content inside `children` renders
 * on `floor` and stays on KeyShot tokens; `slate` (#4A5568) is the neutral to lean on.
 */

/** Salesforce Lightning chrome colours. This file only. */
const SF = {
  blue: "#0176D3",
  blueDark: "#014486",
  blueTint: "#D8EDFF",
  border: "#C9C9C9",
} as const;

export type SalesforceChromeProps = {
  children: React.ReactNode;
  /** Object-type label shown above the record title, e.g. "Quote". */
  objectType?: string;
  /** The record's own name, e.g. "Q-10428 — Autodesk EMEA". */
  recordTitle?: string;
  /** App name in the global nav bar. */
  appName?: string;
  /** Two-letter monogram for the object-type icon tile. Defaults from `objectType`. */
  objectIcon?: string;
  /** Tab strip labels. The first is rendered as the active tab. */
  tabs?: readonly string[];
  /** Right-aligned buttons in the object header. The last is rendered as primary. */
  actions?: readonly string[];
  className?: string;
};

export function SalesforceChrome({
  children,
  objectType = "Quote",
  recordTitle = "Untitled record",
  appName = "Sales",
  objectIcon,
  tabs = ["Related", "Details", "Approvals"],
  actions = ["Edit", "Submit for Approval"],
  className,
}: SalesforceChromeProps) {
  const monogram = (objectIcon ?? objectType.slice(0, 2)).toUpperCase();

  return (
    <div className={cn("flex min-h-full flex-col bg-floor", className)}>
      {/* Global nav */}
      <div
        className="flex h-12 items-center gap-3 px-4"
        style={{ backgroundColor: SF.blue }}
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded"
          style={{ backgroundColor: SF.blueDark }}
        >
          <Grip size={16} color="#FFFFFF" />
        </span>
        <Typography size="15" bold className="text-[#FFFFFF]">
          {appName}
        </Typography>
        <Typography size="xs" className="text-[#FFFFFF]/70">
          Sales Cloud
        </Typography>
        <div className="ml-auto flex items-center gap-3">
          <span
            className="flex h-7 w-56 items-center gap-2 rounded px-2"
            style={{ backgroundColor: SF.blueDark }}
          >
            <Search size={14} color="#FFFFFF" />
            <Typography size="xs" className="text-[#FFFFFF]/70">
              Search Salesforce
            </Typography>
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ backgroundColor: SF.blueTint }}
          >
            <Typography size="2xs" bold className="text-[#014486]">
              KS
            </Typography>
          </span>
        </div>
      </div>

      {/* Object header */}
      <div
        className="flex items-start gap-3 bg-surface px-4 pb-3 pt-3"
        style={{ borderBottom: `1px solid ${SF.border}` }}
      >
        <span
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded"
          style={{ backgroundColor: SF.blue }}
        >
          <Typography size="xs" bold className="text-[#FFFFFF]">
            {monogram}
          </Typography>
        </span>
        <div className="min-w-0">
          <Typography size="2xs" bold className="uppercase tracking-wide text-text3">
            {objectType}
          </Typography>
          <Typography as="h1" size="xl" bold className="truncate">
            {recordTitle}
          </Typography>
        </div>
        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          {actions.map((action, i) => {
            const primary = i === actions.length - 1;
            return (
              <Typography
                key={action}
                size="xs"
                bold
                className={cn(
                  "flex h-8 items-center rounded border px-3",
                  primary ? "text-[#FFFFFF]" : "text-slate"
                )}
                style={{
                  backgroundColor: primary ? SF.blue : "transparent",
                  borderColor: primary ? SF.blue : SF.border,
                }}
              >
                {action}
              </Typography>
            );
          })}
          <span
            className="flex h-8 w-8 items-center justify-center rounded border"
            style={{ borderColor: SF.border }}
          >
            <ChevronDown size={14} color={SF.blueDark} />
          </span>
        </div>
      </div>

      {/* Tab strip */}
      <div
        className="flex items-end gap-6 bg-surface px-4"
        style={{ borderBottom: `1px solid ${SF.border}` }}
      >
        {tabs.map((tab, i) => (
          <Typography
            key={tab}
            size="sm"
            bold={i === 0}
            className={cn("h-9 leading-9", i === 0 ? "text-slate" : "text-text3")}
            style={i === 0 ? { boxShadow: `inset 0 -3px 0 0 ${SF.blue}` } : undefined}
          >
            {tab}
          </Typography>
        ))}
      </div>

      <div className="flex-1 bg-floor p-4">{children}</div>
    </div>
  );
}
