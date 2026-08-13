import React from "react";

import {
  LayoutDashboard,
  FileText,
  Receipt,
  BookOpen,
  Building2,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

/**
 * Light (light.inc) finance product shell.
 *
 * Pick this chrome for finance and back-office screens — the ledger, invoices,
 * payment runs, month-end close, anything the KeyShot finance team owns. If the
 * person on the screen is a **sales** rep, use `SalesforceChrome` instead; sales work
 * must render in Salesforce chrome so the workshop audience recognises the system.
 *
 * Deliberately restrained: left sidebar with wordmark and nav, a main column whose
 * header follows axolotl's `DefaultLayout.Header` pattern (an <h1> title with a
 * right-side slot), and content below on `floor`. KeyShot tokens only — no colours
 * beyond the palette, and no #FF6105 in any text position.
 */

export type LightNavItem = {
  label: string;
  icon: LucideIcon;
  /** Renders the item as the current page. At most one item should set this. */
  active?: boolean;
};

const DEFAULT_NAV: readonly LightNavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Invoices", icon: FileText, active: true },
  { label: "Expenses", icon: Receipt },
  { label: "Ledger", icon: BookOpen },
  { label: "Entities", icon: Building2 },
  { label: "Settings", icon: Settings },
];

export type LightChromeProps = {
  children: React.ReactNode;
  /** Page title rendered as the <h1> in the header bar. */
  title?: string;
  /** Sidebar nav items. */
  nav?: readonly LightNavItem[];
  /** Right-hand slot of the header bar — buttons, filters, a status badge. */
  actions?: React.ReactNode;
  /** Workspace name under the wordmark. */
  workspace?: string;
  className?: string;
};

export function LightChrome({
  children,
  title = "Overview",
  nav = DEFAULT_NAV,
  actions,
  workspace = "KeyShot",
  className,
}: LightChromeProps) {
  return (
    <div className={cn("flex min-h-full bg-floor", className)}>
      <aside className="flex w-56 flex-shrink-0 flex-col gap-4 border-r-0.5 border-hairline bg-surface px-3 py-4">
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-5 bg-accent">
            <Typography size="2xs" bold className="text-surface">
              L
            </Typography>
          </span>
          <Typography size="15" bold>
            Light
          </Typography>
        </div>

        <nav className="flex flex-col gap-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.label}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-5 px-2",
                  item.active ? "bg-softFill" : "bg-transparent"
                )}
              >
                <Icon
                  size={15}
                  className={item.active ? "text-ink" : "text-text3"}
                  aria-hidden
                />
                <Typography
                  size="sm"
                  bold={item.active}
                  className={item.active ? "text-ink" : "text-text2"}
                >
                  {item.label}
                </Typography>
              </span>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-2 border-t-0.5 border-hairline px-1 pt-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-softFill">
            <Typography size="2xs" bold className="text-text2">
              {workspace.slice(0, 2).toUpperCase()}
            </Typography>
          </span>
          <Typography size="xs" className="truncate text-text2">
            {workspace}
          </Typography>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col px-4 pb-4">
        {/* negative margin-x so the header rule expands past the container padding */}
        <div className="-mx-4 mb-4 flex h-16 items-center justify-between border-b-0.5 border-hairline px-4">
          <Typography as="h1" size="xl" bold>
            {title}
          </Typography>
          {actions}
        </div>
        <div className="flex-1 bg-floor">{children}</div>
      </div>
    </div>
  );
}
