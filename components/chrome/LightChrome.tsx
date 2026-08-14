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
import { chromeScope } from "@/components/chrome/ChromeContext";
import { Typography } from "@/components/ui/Typography";

/**
 * Light (light.inc) finance product shell.
 *
 * Pick this chrome for finance and back-office screens — the ledger, invoices,
 * payment runs, month-end close, anything the KeyShot finance team owns. If the
 * person on the screen is a **sales** rep, use `SalesforceChrome` instead; sales
 * work must render in Salesforce chrome so the workshop audience recognises the
 * system.
 *
 * ── Structure, not approximation ─────────────────────────────────────────────
 * This is a port of axolotl's real composition, not a lookalike:
 *
 *   `src/layouts/DefaultLayout.tsx`          → the grid, Container / Header /
 *                                              TabHeaders, the `h-16` header row,
 *                                              the `-mx-4` bleed, `border-b-0.5
 *                                              border-border-secondary`, the
 *                                              <h1> at size="xl" bold
 *   `src/modules/layout/SideNavigation.tsx`  → the sidebar: an inset panel on
 *                                              `surface-level-0` beside a
 *                                              `rounded-lg` `surface-level-1`
 *                                              content card
 *
 * Every colour here is one of Light's semantic tokens. **There is no saturated
 * brand primary in Light chrome** — neutral greys, a yellow selection accent
 * (`border-selected`), and the pink→purple AI gradient on `Button intent="magic"`.
 * KeyShot's orange belongs on our own surfaces, not on either product's shell.
 * Painting this one orange is exactly how it stops reading as Light.
 *
 * ── This component opens the Light playbook ─────────────────────────────────
 * `chromeScope("light")` on the root is not decoration. Every shared component
 * inside it — `Field`, `Badge`, `Table`, `Callout`, `Checklist`, `ActionLog`,
 * `Button` — resolves its own tokens from Light's palette because of that one
 * attribute. **Wrapping a screen in this chrome is the entire act of choosing
 * its palette**; nothing below takes a colour or a `chrome` prop. See
 * `components/chrome/ChromeContext.tsx`.
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
  /** Tab strip below the header. The first label renders as the active tab. */
  tabs?: readonly string[];
  /** Workspace name shown in the sidebar. */
  workspace?: string;
  className?: string;
};

export function LightChrome({
  children,
  title = "Overview",
  nav = DEFAULT_NAV,
  actions,
  tabs,
  workspace = "KeyShot",
  className,
}: LightChromeProps) {
  return (
    <div
      {...chromeScope("light")}
      className={cn(
        // axolotl's shell is fixed to the viewport and scrolls *inside* the
        // content card (a ScrollArea there). Reproduced with a plain
        // `overflow-y-auto` below — without it the sticky detail-sheet bar has
        // no scroll container to stick to.
        "grid h-screen max-h-screen overflow-hidden grid-cols-[auto_1fr] gap-x-[0.52rem] bg-surface-level-0 pb-2.5 pr-2.5 pt-2.5",
        className
      )}
    >
      <LightSideNavigation nav={nav} workspace={workspace} />

      {/* DefaultLayout's content card: rounded, one surface level up from the
          shell it sits on. Everything a screen renders lives inside it. */}
      <div className="min-h-0 min-w-0 overflow-y-auto rounded-lg bg-surface-level-1">
        <main className="outline-none" tabIndex={-1}>
          <Container>
            <Header title={title} tabs={tabs}>
              {actions}
            </Header>
            {tabs && tabs.length > 0 && <TabHeaders tabs={tabs} />}
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}

/** `DefaultLayout.Container`. The `px-4` the header then bleeds back out of. */
function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-4 pb-4", className)}>{children}</div>;
}

/**
 * `DefaultLayout.Header`, `variant="bordered-small"`.
 *
 * The `-mx-4` is not decoration: it lets the `border-b-0.5` rule run the full
 * width of the card while the content stays inside the container's `px-4`.
 * `border-b-0.5` is the 0.5px hairline — Light's signature rule weight. A 1px
 * border here reads as a different product.
 */
function Header({
  title,
  tabs,
  children,
}: {
  title: string;
  tabs?: readonly string[];
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "-mx-4 flex h-16 items-center justify-between border-b-0.5 border-border-secondary px-4",
        // TabHeaders carries its own bottom margin when it follows.
        tabs && tabs.length > 0 ? "mb-0" : "mb-4"
      )}
    >
      <Typography as="h1" size="xl" bold>
        {title}
      </Typography>
      {children}
    </div>
  );
}

/** `DefaultLayout.TabHeaders`. Same `-mx-4` bleed, same hairline. */
function TabHeaders({ tabs }: { tabs: readonly string[] }) {
  return (
    <div className="-mx-4 mb-4 grid h-8 grid-cols-[1fr_auto] content-end border-b-0.5 border-border-secondary px-4">
      <div className="flex items-end gap-4">
        {tabs.map((tab, index) => (
          <Typography
            key={tab}
            size="sm"
            bold={index === 0}
            className={cn(
              "h-8 leading-8",
              index === 0
                ? "border-b-2 border-border-selected text-text-default"
                : "text-text-secondary"
            )}
          >
            {tab}
          </Typography>
        ))}
      </div>
    </div>
  );
}

/**
 * The sidebar shape from `src/modules/layout/SideNavigation.tsx`: an inset panel
 * flush with the shell surface (`surface-level-0`), so the content card beside
 * it is the thing that reads as raised. Items are `h-8 rounded-lg px-3`; the
 * current one sits on `button-selected-default`, not on a brand colour.
 */
function LightSideNavigation({
  nav,
  workspace,
}: {
  nav: readonly LightNavItem[];
  workspace: string;
}) {
  return (
    <aside className="w-[15rem]">
      <div className="ml-2.5 flex h-full flex-col overflow-hidden bg-surface-level-0">
        <div className="flex h-12 items-center gap-2 px-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-5 bg-button-primary">
            <Typography size="2xs" bold className="text-text-inverted">
              L
            </Typography>
          </span>
          <Typography size="15" bold>
            Light
          </Typography>
        </div>

        <div className="mb-2 ml-3 mt-4 h-4 cursor-default select-none">
          <Typography size="xs" className="truncate text-text-secondary">
            {workspace}
          </Typography>
        </div>

        <nav className="flex flex-col gap-1 px-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.label}
                className={cn(
                  "flex h-8 select-none items-center gap-2 rounded-lg px-3",
                  item.active ? "bg-button-selected-default" : "hover:bg-button-hover-alt1"
                )}
              >
                <div className="w-4 flex-shrink-0">
                  <Icon
                    aria-hidden
                    className={cn(
                      "h-4 w-4 stroke-1.5",
                      item.active ? "text-icon-default" : "text-icon-secondary"
                    )}
                  />
                </div>
                <Typography
                  size="sm"
                  className={cn("truncate", item.active ? "text-text-default" : "text-text-secondary")}
                >
                  {item.label}
                </Typography>
              </span>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-2 px-3 pb-1 pt-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-level-1-alt">
            <Typography size="2xs" bold className="text-text-secondary">
              {workspace.slice(0, 2).toUpperCase()}
            </Typography>
          </span>
          <Typography size="xs" className="truncate text-text-secondary">
            {workspace} · Finance
          </Typography>
        </div>
      </div>
    </aside>
  );
}
