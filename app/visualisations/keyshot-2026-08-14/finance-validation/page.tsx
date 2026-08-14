import { BookOpen, Building2, Coins, FileMinus, FileText, LayoutDashboard, Receipt, User } from "lucide-react";

import { LightChrome, type LightNavItem } from "@/components/chrome/LightChrome";
import { ActionLog } from "@/components/ui/ActionLog";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checklist } from "@/components/ui/Checklist";
import { Field, I, V, X } from "@/components/ui/Field";
import { Table } from "@/components/ui/Table";
import { TeamsCard } from "@/components/ui/TeamsCard";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * Screen 2 — the manual gate the map didn't have.
 *
 * The diagram coming into discovery drew Salesforce → Light as a straight,
 * automatic line. It isn't. Someone in finance (Anett, mostly, or Vanessa) ticks
 * a "finance validated" checkbox on the opportunity, running a checklist that
 * lives in their heads. The sync then silently fails often enough that Anett
 * re-checks Light by hand for every one — on the order of 250 a month.
 *
 * Finance / back-office user → Light chrome. The future state doesn't remove the
 * validation, it makes the checklist visible and lets Light flag the drops
 * proactively (Astra is live on the tenant) instead of finance checking 250 by
 * hand. Audit trail is exportable (constraint 3); the Teams alert is Teams, not
 * anything else (constraint 4).
 */

const NAV: readonly LightNavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Sales invoices", icon: FileText, active: true },
  { label: "Customer credits", icon: FileMinus },
  { label: "Bills", icon: Receipt },
  { label: "Ledger", icon: BookOpen },
  { label: "Entities", icon: Building2 },
];

export const screenMeta: ScreenMeta = {
  title: "The finance-validation gate",
  blurb:
    "The manual checkbox and silent sync between Salesforce and Light that the process map treated as automatic. Finance-facing.",
  chrome: "light",
};

export default function FinanceValidationScreen() {
  return (
    <LightChrome
      title="Sales invoices"
      nav={NAV}
      tabs={["Awaiting sync", "Posted", "Draft", "Void"]}
      workspace="KeyShot"
      actions={
        <div className="flex items-center gap-2">
          <Button intent="outline">Filter</Button>
          <Button intent="primary">Recheck sync</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 py-2">
        <Callout tone="warning" title="Marked validated in Salesforce, but not created in Light yet">
          <Typography as="p" size="sm" className="text-text-secondary">
            Ticking &ldquo;finance validated&rdquo; on the opportunity is meant to create the sales
            invoice here, 1:1 and automatically. It silently fails often enough that finance
            re-checks Light by hand for every one — Anett after her own ticks, Vanessa after hers.
            When she says it like that, it sounds worse than it feels day to day.
          </Typography>
        </Callout>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Field label="Validated, not yet in Light" value={X("3 opportunities")} />
          <Field label="Validated this month" value={X("~250")} />
          <Field label="Manual re-checks / month" value={X("~250")} />
          <Field
            label="Time on re-checks"
            value={I("~8 hours / month")}
            hint="A tick plus a manual check, about a minute each, never counted"
          />
        </div>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-text-secondary">
            What finance checks before ticking &ldquo;finance validated&rdquo;
          </Typography>
          <Checklist
            items={[
              { label: "Dates are right", done: true, note: V("Start and end date on the opportunity") },
              { label: "Entity is right", done: true, note: V("Which KeyShot entity invoices") },
              {
                label: "Billing address looks correct",
                done: true,
                note: V("The AvaTax pick — the biggest US credit-note cause"),
              },
              {
                label: "PO present if the customer needs one",
                done: false,
                note: V("A check, chased later — not a gate"),
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text-secondary">
            Today this checklist is unwritten — it lives with Anett and Vanessa. Drawing it here is
            the first time it exists outside their heads.
          </Typography>
        </section>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-text-secondary">
            Direct-stream opportunities, checked against Light
          </Typography>
          <Table
            caption="Every validated opportunity, reconciled with what actually landed in Light."
            columns={[
              { key: "account", header: "Account", icon: Building2 },
              { key: "validated", header: "Validated by", icon: User },
              { key: "invoice", header: "Light invoice", icon: FileText },
              { key: "amount", header: "Amount", icon: Coins, align: "right" },
              { key: "status", header: "Status" },
            ]}
            rows={[
              {
                account: V("The Open Window"),
                validated: V("Anett Sores"),
                invoice: V("INL2502195"),
                amount: V("USD 6,560.00"),
                status: <StatusBadge status="PARTIALLY_CLEARED" />,
              },
              {
                account: V("Uniworld"),
                validated: V("Anett Sores"),
                invoice: X("— not created"),
                amount: X("USD 4,900.00"),
                status: <Badge color="warning">Not in Light</Badge>,
              },
              {
                account: V("Microsoft"),
                validated: V("Vanessa Cano"),
                invoice: X("INL2502240"),
                amount: X("USD 12,300.00"),
                status: <StatusBadge status="POSTED" />,
              },
            ]}
          />
        </section>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Typography as="h2" size="sm" bold className="text-text-secondary">
              Notification
            </Typography>
            <TeamsCard
              channel="Finance"
              author="Light · Astra"
              timestamp={X("Today at 09:20")}
              title="2 validated opportunities haven't created invoices in Light"
              facts={[
                { label: "Not synced", value: V("Uniworld") },
                { label: "Validated by", value: V("Anett Sores") },
                { label: "Waiting since", value: X("2 days ago") },
              ]}
              actions={["Open in Light", "Recheck sync"]}
            />
            <Typography as="p" size="xs" className="text-text-secondary">
              Light flags the drop instead of finance finding it — the alert lands in Teams,
              the only place approvals and reminders go here.
            </Typography>
          </div>

          <div className="flex flex-col gap-2">
            <Typography as="h2" size="sm" bold className="text-text-secondary">
              Audit trail
            </Typography>
            <ActionLog
              title="Sync activity"
              exportFilename="direct-stream-sync-activity"
              entries={[
                {
                  at: X("Today, 09:14"),
                  actor: V("Anett Sores"),
                  action: "marked the opportunity finance-validated",
                  detail: V("The Open Window"),
                },
                {
                  at: X("Today, 09:14"),
                  actor: V("Light"),
                  action: "created the sales invoice",
                  detail: V("INL2502195"),
                },
                {
                  at: X("Yesterday, 16:40"),
                  actor: V("Vanessa Cano"),
                  action: "marked the opportunity finance-validated",
                  detail: V("Uniworld"),
                },
                {
                  at: X("Yesterday, 16:40"),
                  actor: V("Light"),
                  action: "reported no invoice created",
                  detail: X("Sync returned no record"),
                },
              ]}
            />
            <Typography as="p" size="xs" className="text-text-secondary">
              Every log screen carries its own export control — constraint 3.
            </Typography>
          </div>
        </div>
      </div>
    </LightChrome>
  );
}
