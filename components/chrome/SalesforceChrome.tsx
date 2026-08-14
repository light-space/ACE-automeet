import React from "react";

import { Bell, ChevronDown, Grip, HelpCircle, Search, Settings, Star } from "lucide-react";

import { cn } from "@/lib/cn";
import { chromeScope } from "@/components/chrome/ChromeContext";
import { FieldValue } from "@/components/ui/Field";
import { Typography } from "@/components/ui/Typography";
import type { ProvenancedValue } from "@/lib/tokens";

/**
 * Salesforce **Lightning Experience** record page.
 *
 * Pick this chrome for ANY screen the KeyShot **sales team** touches — quotes,
 * opportunities, accounts, renewals, approvals a rep files. A sales-facing
 * screen drawn in the Light shell reads as the wrong system to a workshop
 * audience and is dead on arrival. `LightChrome` is for finance / back-office.
 *
 * ── Structure, not approximation ────────────────────────────────────────────
 * Four bands, in the order Lightning stacks them. Each one is a tell; drop one
 * and the screen stops being unmistakable:
 *
 *   1. global header    app launcher, global search, the utility icons
 *   2. app nav          the app name and its tab row
 *   3. record header    object icon tile, object type ABOVE the record name,
 *                       actions right-aligned, and the **highlights panel** —
 *                       the horizontal row of key fields under the name
 *   4. record body      whatever the screen composes, on the grey page floor
 *
 * The pieces that go in the body live in `components/salesforce/`: `Path` (the
 * stage chevrons), `RelatedList`, `DetailGrid`, `Toast`.
 *
 * ── Colour ──────────────────────────────────────────────────────────────────
 * Every colour here comes from `lib/salesforce-theme/` — SLDS's own tokens,
 * wired through Tailwind as `bg-sf-brand`, `text-sf-weak`, `border-sf-border`.
 * There are no hexes at the call sites and there is no KeyShot orange, because
 * **Salesforce chrome is Salesforce blue.** #FF6105 belongs to our own
 * surfaces — the gallery, callouts, the framing round a screen — not painted
 * onto a customer's product. Mocking a customer's tools means the tools look
 * like their tools. The same rule, mirrored, is why `LightChrome` is neutral.
 *
 * Typography is the SLDS system stack (`font-slds`), not Inter. It is a quiet
 * tell, and quiet tells are most of what makes a shell recognisable.
 *
 * ── This component opens the Salesforce playbook ────────────────────────────
 * `chromeScope("salesforce")` on the root is not decoration. Every shared
 * component inside it — `Field`, `Badge`, `Table`, `Callout`, `Checklist`,
 * `ActionLog`, `Button` — resolves its own tokens from SLDS because of that one
 * attribute. **Wrapping a screen in this chrome is the entire act of choosing
 * its palette**; nothing below takes a colour or a `chrome` prop. See
 * `components/chrome/ChromeContext.tsx`.
 */

export type SalesforceHighlight = {
  /** Field label, e.g. "Account Name". Static chrome. */
  label: string;
  value: ProvenancedValue;
};

export type SalesforceChromeProps = {
  children: React.ReactNode;
  /** Object-type label shown above the record title, e.g. "Quote". */
  objectType?: string;
  /** The record's own name, e.g. "Q-10428 — Northwind Design Group". */
  recordTitle?: string;
  /** App name in the nav bar. */
  appName?: string;
  /** Two-letter monogram for the object icon tile. Defaults from `objectType`. */
  objectIcon?: string;
  /** Tab strip labels. The first is rendered as the active tab. */
  tabs?: readonly string[];
  /** Right-aligned buttons in the record header. The last renders as brand. */
  actions?: readonly string[];
  /** The highlights panel: the row of key fields under the record name. */
  highlights?: readonly SalesforceHighlight[];
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
  highlights,
  className,
}: SalesforceChromeProps) {
  const monogram = (objectIcon ?? objectType.slice(0, 2)).toUpperCase();

  return (
    <div
      {...chromeScope("salesforce")}
      className={cn("flex min-h-full flex-col bg-sf-page font-slds", className)}
    >
      <GlobalHeader />
      <AppNav appName={appName} tabs={tabs} />

      <div className="flex flex-col gap-3 p-3">
        <RecordHeader
          monogram={monogram}
          objectType={objectType}
          recordTitle={recordTitle}
          actions={actions}
          highlights={highlights}
        />
        {children}
      </div>
    </div>
  );
}

/**
 * Band 1. The dark global header: app launcher on the left, the search box
 * that runs most of the width, utility icons and the avatar on the right.
 */
function GlobalHeader() {
  return (
    <div className="flex h-12 shrink-0 items-center gap-3 bg-sf-brand-deep px-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sf-md bg-sf-brand-dark">
        <Grip size={16} aria-hidden className="text-sf-inverse" />
      </span>

      <span className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-sf-md bg-sf-brand-dark px-3">
        <Search size={14} aria-hidden className="shrink-0 text-sf-inverse" />
        <Typography size="xs" className="truncate text-sf-inverse opacity-70">
          Search Salesforce
        </Typography>
      </span>

      <div className="flex shrink-0 items-center gap-3">
        <Settings size={16} aria-hidden className="text-sf-inverse" />
        <HelpCircle size={16} aria-hidden className="text-sf-inverse" />
        <Bell size={16} aria-hidden className="text-sf-inverse" />
        <span className="flex h-7 w-7 items-center justify-center rounded-sf-circle bg-sf-brand-tint">
          <Typography size="2xs" bold className="text-sf-link">
            KS
          </Typography>
        </span>
      </div>
    </div>
  );
}

/** Band 2. App name plus the tab row. The active tab carries the brand underline. */
function AppNav({ appName, tabs }: { appName: string; tabs: readonly string[] }) {
  return (
    <div className="flex shrink-0 items-end gap-6 border-b border-sf-border bg-sf-card px-4">
      <span className="flex h-11 shrink-0 items-center gap-1.5">
        <Typography size="base" bold className="text-sf-text">
          {appName}
        </Typography>
        <ChevronDown size={14} aria-hidden className="text-sf-weak" />
      </span>

      <nav className="flex min-w-0 items-end gap-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <Typography
            key={tab}
            size="xs"
            bold={index === 0}
            className={cn(
              "h-11 shrink-0 leading-[2.75rem]",
              index === 0
                ? "border-b-2 border-sf-border-brand text-sf-link"
                : "border-b-2 border-transparent text-sf-text"
            )}
          >
            {tab}
          </Typography>
        ))}
      </nav>
    </div>
  );
}

/**
 * Band 3. The record header card.
 *
 * The object type sits ABOVE the record name in small weak caps — that vertical
 * order is one of the strongest Lightning tells and is worth preserving even
 * when it looks redundant. The highlights panel below the hairline is the other:
 * a horizontal strip of the fields a rep needs without opening Details.
 */
function RecordHeader({
  monogram,
  objectType,
  recordTitle,
  actions,
  highlights,
}: {
  monogram: string;
  objectType: string;
  recordTitle: string;
  actions: readonly string[];
  highlights?: readonly SalesforceHighlight[];
}) {
  return (
    <header className="rounded-sf-lg border border-sf-border bg-sf-card">
      <div className="flex items-start gap-3 px-4 pb-3 pt-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sf-md bg-sf-brand">
          <Typography size="sm" bold className="text-sf-inverse">
            {monogram}
          </Typography>
        </span>

        <div className="min-w-0 flex-1">
          <Typography size="2xs" bold className="uppercase tracking-wide text-sf-weak">
            {objectType}
          </Typography>
          <div className="flex min-w-0 items-center gap-2">
            <Typography as="h1" size="2xl" className="truncate text-sf-text">
              {recordTitle}
            </Typography>
            <Star size={14} aria-hidden className="shrink-0 text-sf-weak" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {actions.map((action, index) => {
            const brand = index === actions.length - 1;
            return (
              <span
                key={action}
                className={cn(
                  "flex h-8 items-center rounded-sf-md border px-3",
                  brand
                    ? "border-sf-brand-accessible bg-sf-brand-accessible"
                    : "border-sf-border-strong bg-sf-card"
                )}
              >
                <Typography
                  size="xs"
                  bold
                  className={brand ? "text-sf-inverse" : "text-sf-link"}
                >
                  {action}
                </Typography>
              </span>
            );
          })}
          <span className="flex h-8 w-8 items-center justify-center rounded-sf-md border border-sf-border-strong">
            <ChevronDown size={14} aria-hidden className="text-sf-link" />
          </span>
        </div>
      </div>

      {highlights && highlights.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 border-t border-sf-border px-4 py-3 sm:grid-cols-4">
          {highlights.map((highlight) => (
            <div key={highlight.label} className="flex min-w-0 flex-col gap-0.5">
              <dt>
                <Typography size="2xs" className="text-sf-weak">
                  {highlight.label}
                </Typography>
              </dt>
              <dd className="min-w-0">
                <FieldValue value={highlight.value} />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
