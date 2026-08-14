import {
  Building2,
  Banknote,
  FileText,
  FileMinus,
  LayoutDashboard,
  Settings,
} from "lucide-react";

import { LightChrome } from "@/components/chrome/LightChrome";
import { Badge } from "@/components/ui/Badge";
import { ActionLog } from "@/components/ui/ActionLog";
import { Callout } from "@/components/ui/Callout";
import { Field, V, X } from "@/components/ui/Field";
import { Table } from "@/components/ui/Table";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * Screen 4 — the reconciliation Light cannot see, because it happens in Excel.
 *
 * Since June, finance takes every Swedish invoice out of the automated bank
 * reconciliation and matches it by hand in a spreadsheet: invoice in SEK, payment
 * in DKK or USD, the FX rate worked out manually, the difference booked. Around
 * 40–50 a month, a day and a half of the close, on the third working day when
 * everything else is happening too. The bank syncing on interest date rather than
 * posting date stacks on top of it.
 *
 * Finance / back-office → Light chrome. The whole worklist is exportable
 * (constraint 3). The multi-currency problem and the interest-vs-posting-date bug
 * are verified; the volumes are invented in the fixture, so they are Illustrative.
 * Kyle&rsquo;s smart-matching tolerance is shown as what it is — being explored,
 * not yet shipped (constraint 6).
 */

export const screenMeta: ScreenMeta = {
  title: "Multi-currency reconciliation",
  blurb:
    "The Swedish invoices finance pulls out of auto-reconciliation and matches by hand, with the volumes and the bank-date bug that compound it. Finance-facing, exportable.",
  chrome: "light",
};

export default function CurrencyReconciliationScreen() {
  return (
    <LightChrome
      title="Bank reconciliation"
      workspace="KeyShot"
      nav={[
        { label: "Overview", icon: LayoutDashboard },
        { label: "Sales invoices", icon: FileText },
        { label: "Customer credits", icon: FileMinus },
        { label: "Bank rec", icon: Banknote, active: true },
        { label: "Entities", icon: Building2 },
        { label: "Settings", icon: Settings },
      ]}
    >
      <div className="flex flex-col gap-6">
        <Callout tone="info" title="One transaction, two currencies — the system will not match it">
          <Typography as="p" size="sm" className="text-text2">
            KeyShot invoices in Swedish krona, but the payment lands in Danish krone, dollars or
            euros. The reconciliation cannot hold two currencies against one transaction, so since
            June finance lifts the Swedish invoices out of the automated run and matches them by
            hand in a spreadsheet — the rate worked out manually, the difference booked. Nobody at
            Light was told the workaround existed.
          </Typography>
        </Callout>

        <section className="rounded-5 border-0.5 border-hairline bg-surface p-4">
          <Typography as="h2" size="15" bold className="mb-4">
            The manual run, each month
          </Typography>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="SEK invoices matched by hand" value={X("40–50 / month")} />
            <Field label="Time it takes" value={X("~1.5 days")} hint="On the third working day" />
            <Field label="Running since" value={X("June 2026")} />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            This month&rsquo;s manual matches
          </Typography>
          <Table
            caption="Swedish invoices held out of the automated reconciliation"
            columns={[
              { key: "invoice", header: "Invoice", icon: FileText },
              { key: "invoiced", header: "Invoiced", align: "right" },
              { key: "received", header: "Received", align: "right" },
              { key: "diff", header: "FX difference", align: "right" },
              { key: "status", header: "Status" },
            ]}
            rows={[
              {
                invoice: X("INL2503118"),
                invoiced: X("SEK 48,200.00"),
                received: X("DKK 31,540.00"),
                diff: X("SEK 210.00"),
                status: <Badge tone="positive">Matched by hand</Badge>,
              },
              {
                invoice: X("INL2503124"),
                invoiced: X("SEK 12,900.00"),
                received: X("USD 1,205.00"),
                diff: X("SEK 84.00"),
                status: <Badge tone="positive">Matched by hand</Badge>,
              },
              {
                invoice: X("INL2503130"),
                invoiced: X("SEK 65,400.00"),
                received: X("DKK 42,780.00"),
                diff: X("SEK 305.00"),
                status: <Badge tone="pending">Awaiting rate</Badge>,
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text3">
            The invoice numbers follow KeyShot&rsquo;s real INL format; the amounts and the volumes
            are illustrative until the spreadsheet is loaded.
          </Typography>
        </section>

        <Callout tone="warning" title="The bank date bug stacks on top of this">
          <Typography as="p" size="sm" className="text-text2">
            Bank data syncs on the interest date rather than the posting date, so the reconciliation
            does not line up at month end. It was raised on 1 July and is still open. The FX problem
            and the date problem hit the same reconciliation, in the same place.
          </Typography>
        </Callout>

        <Callout tone="info" title="Being explored, not yet available">
          <Typography as="p" size="sm" className="text-text2">
            Kyle is investigating a smart-matching tolerance band of 1 to 3% for exactly this — so a
            payment within a small FX margin of an invoice matches automatically. It is not built
            yet, and this screen does not pretend it is. Shown so the room knows the manual run has a
            successor in view.
          </Typography>
        </Callout>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            Reconciliation activity
          </Typography>
          <ActionLog
            title="Manual FX matches"
            exportFilename="keyshot-sek-reconciliation"
            entries={[
              {
                at: X("06 Aug 2026, 14:12"),
                actor: V("Tina Helbert"),
                action: "matched invoice to payment",
                detail: X("INL2503124 — SEK 12,900 / USD 1,205"),
              },
              {
                at: X("06 Aug 2026, 11:48"),
                actor: V("Tina Helbert"),
                action: "booked the FX difference",
                detail: X("INL2503118 — SEK 210.00"),
              },
              {
                at: X("06 Aug 2026, 09:30"),
                actor: V("Tina Helbert"),
                action: "pulled Swedish invoices from the automated run",
                detail: X("41 transactions this month"),
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text3">
            The workaround that lived in a spreadsheet, back in the system and exportable — so Light
            can finally see the volume it has been prioritising blind.
          </Typography>
        </section>
      </div>
    </LightChrome>
  );
}
