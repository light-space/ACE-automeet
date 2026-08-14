import { ArrowLeftRight, BookOpen, Building2, Coins, FileMinus, FileText, LayoutDashboard, Receipt } from "lucide-react";

import { LightChrome, type LightNavItem } from "@/components/chrome/LightChrome";
import { ActionLog } from "@/components/ui/ActionLog";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Field, V, X } from "@/components/ui/Field";
import { Table } from "@/components/ui/Table";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * Screen 4 — the reconciliation workaround Light was never told about.
 *
 * A SEK invoice is paid in DKK, USD or EUR, and Light cannot reconcile one
 * transaction across two currencies. So since June, finance takes every Swedish
 * invoice out of the automated run and matches it by hand in Excel — and never
 * told Light they had built the workaround. On top of it, the bank feed syncs
 * on interest date rather than posting date, so the two problems compound in
 * the same place, on the same third working day.
 *
 * The two-currency limitation and the interest-vs-posting-date bug are both
 * verified. The volumes (40–50 a month, ~1.5 days) come from the synthetic
 * transcript and are invented, so they are marked X. Kyle's smart-matching
 * tolerance band is under investigation and NOT shipped (constraint 6) — shown
 * only to mark where it would land, said plainly on the screen.
 *
 * Finance-facing → Light chrome. The manual matches are exportable (constraint 3).
 */

const NAV: readonly LightNavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Sales invoices", icon: FileText },
  { label: "Customer credits", icon: FileMinus },
  { label: "Bills", icon: Receipt },
  { label: "Ledger", icon: BookOpen, active: true },
  { label: "Entities", icon: Building2 },
];

export const screenMeta: ScreenMeta = {
  title: "Multi-currency reconciliation",
  blurb:
    "The Swedish invoices finance pulls out of the automated run and matches by hand in Excel. Finance-facing.",
  chrome: "light",
};

export default function FxReconciliationScreen() {
  return (
    <LightChrome
      title="Ledger transactions"
      nav={NAV}
      tabs={["Unmatched", "Matched", "Swedish (manual)", "Journal entries"]}
      workspace="KeyShot"
      actions={<Button intent="outline">Filter</Button>}
    >
      <div className="flex flex-col gap-6 py-2">
        <Callout tone="warning" title="Swedish invoices are reconciled by hand, off-system">
          <Typography as="p" size="sm" className="text-text-secondary">
            A Swedish-krona invoice is paid in DKK, USD or EUR, and Light cannot reconcile one
            transaction across two currencies. So these are taken out of the automated run and
            matched by hand. Light heard about the currency problem — but not that finance had built
            a workaround around it.
          </Typography>
        </Callout>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Field label="Handled in" value={X("An Excel spreadsheet")} />
          <Field label="Transactions / month" value={X("40–50")} />
          <Field label="Time / month" value={X("~1.5 days")} />
          <Field label="Run on" value={X("The 3rd working day")} />
          <Field label="Since" value={X("June 2026")} />
          <Field label="Reported to Light?" value={X("The problem, yes; the workaround, no")} />
        </div>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-text-secondary">
            Swedish invoices matched by hand
          </Typography>
          <Table
            caption="Illustrative rows. The invoice-number format (INL, seven digits) and the currencies are real; these specific transactions are not."
            columns={[
              { key: "invoice", header: "Invoice", icon: FileText },
              { key: "invoiced", header: "Invoiced (SEK)", icon: Coins, align: "right" },
              { key: "received", header: "Received", icon: Coins, align: "right" },
              { key: "rate", header: "Rate applied", align: "right" },
              { key: "diff", header: "FX difference", icon: ArrowLeftRight, align: "right" },
              { key: "status", header: "Status" },
            ]}
            rows={[
              {
                invoice: X("INL2503118"),
                invoiced: X("SEK 48,200.00"),
                received: X("DKK 33,050.00"),
                rate: X("0.686"),
                diff: X("SEK 240.00"),
                status: <StatusBadge status="CLEARED" />,
              },
              {
                invoice: X("INL2503204"),
                invoiced: X("SEK 12,900.00"),
                received: X("USD 1,210.00"),
                rate: X("0.094"),
                diff: X("SEK 110.00"),
                status: <StatusBadge status="PARTIALLY_CLEARED" />,
              },
              {
                invoice: X("INL2503261"),
                invoiced: X("SEK 91,500.00"),
                received: X("EUR 8,050.00"),
                rate: X("0.088"),
                diff: X("SEK 630.00"),
                status: <Badge color="warning">Unmatched</Badge>,
              },
            ]}
          />
        </section>

        <Callout tone="warning" title="Two problems land on the same reconciliation">
          <Typography as="p" size="sm" className="text-text-secondary">
            On top of the currency mismatch, the bank feed syncs on interest date rather than posting
            date, so the bank rec doesn&rsquo;t line up at month end. That was raised on 1 July and is
            still open. The FX matching and the date offset compound in the same place, on the same
            third working day.
          </Typography>
        </Callout>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Typography as="h2" size="sm" bold className="text-text-secondary">
              Under investigation — not shipped
            </Typography>
            <Callout tone="info" title="Smart matching is being looked at, not promised">
              <Typography as="p" size="sm" className="text-text-secondary">
                Kyle is investigating a tolerance band for these FX differences. It is not
                implemented — it is marked here to show where it would sit, not to commit to it.
              </Typography>
            </Callout>
            <Field
              label="Smart matching"
              value={V("1–3% tolerance band")}
              hint="Under investigation with Kyle — not yet available"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Typography as="h2" size="sm" bold className="text-text-secondary">
              Audit trail
            </Typography>
            <ActionLog
              title="Reconciliation activity"
              exportFilename="swedish-fx-reconciliation"
              entries={[
                {
                  at: X("3rd working day"),
                  actor: V("Tina Helbert"),
                  action: "matched Swedish invoices by hand",
                  detail: X("40–50 transactions, in Excel"),
                },
                {
                  at: X("Last close"),
                  actor: V("Tina Helbert"),
                  action: "booked the FX difference",
                  detail: X("Rate applied manually, per invoice"),
                },
                {
                  at: V("1 July 2026"),
                  actor: V("Vanessa Cano"),
                  action: "raised the bank-sync date issue",
                  detail: V("Syncing on interest date, not posting date"),
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
