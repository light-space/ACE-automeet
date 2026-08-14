import {
  Building2,
  FileMinus,
  FileText,
  LayoutDashboard,
  BookOpen,
  Settings,
} from "lucide-react";

import { LightChrome } from "@/components/chrome/LightChrome";
import { Badge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Checklist } from "@/components/ui/Checklist";
import { ExportCsv } from "@/components/ui/ExportCsv";
import { Field, V, X } from "@/components/ui/Field";
import { Table } from "@/components/ui/Table";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * Screen 3 — the baseline nobody had two hours ago.
 *
 * Jeppe came in believing PO validation would remove ~20% of credit notes. The
 * transcript contradicts him with counted data: the address syncing wrong to
 * AvaTax is the biggest cause, PO is second, and the address one is a system
 * problem — easier, and fixable at quote stage. This screen re-ranks the causes
 * and, crucially, surfaces the risk: the informal control on US addresses is
 * Frederik, who leaves at the end of August.
 *
 * Finance / back-office → Light chrome. The whole point for Tina Olesen is that
 * she can export it and show it, so the baseline carries its own CSV control
 * (constraint 3). Every counted figure is invented in the fixture and marked
 * Illustrative — the split is exactly what the run must not present as fact.
 */

export const screenMeta: ScreenMeta = {
  title: "Credit-note baseline",
  blurb:
    "The counted causes of credit notes, re-ranked away from PO-first, with the Frederik departure risk called out. Finance-facing, exportable.",
  chrome: "light",
};

const CAUSE_ROWS = [
  ["Wrong billing address → AvaTax (US entity)", "~40%", "~165"],
  ["Missing purchase order", "~30%", "~124"],
  ["Mixed — dates, entity, order changes, quote errors", "~30%", "~123"],
];

export default function CreditNoteBaselineScreen() {
  return (
    <LightChrome
      title="Customer credits"
      workspace="KeyShot"
      nav={[
        { label: "Overview", icon: LayoutDashboard },
        { label: "Sales invoices", icon: FileText },
        { label: "Customer credits", icon: FileMinus, active: true },
        { label: "Ledger", icon: BookOpen },
        { label: "Entities", icon: Building2 },
        { label: "Settings", icon: Settings },
      ]}
    >
      <div className="flex flex-col gap-6">
        <Callout tone="accent" title="A baseline, so the owners get a number">
          <Typography as="p" size="sm" className="text-text2">
            Jeppe&rsquo;s instinct was that fixing purchase orders would take out about 20% of
            credit notes. Counted from January to June, that is not what the data says — the address
            syncing wrong to AvaTax is the bigger cause, and it is a system problem, not sales
            behaviour. That makes it the easier one to fix, and it is fixable at quote stage.
          </Typography>
        </Callout>

        <section className="rounded-5 border-0.5 border-hairline bg-surface p-4">
          <Typography as="h2" size="15" bold className="mb-4">
            First half 2026
          </Typography>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Credit notes, Jan–Jun" value={X("412")} />
            <Field label="Of all invoices raised" value={X("~1 in 7")} />
            <Field
              label="Concentrated on"
              value={V("KeyShot Inc (US)")}
              hint="In Denmark the address is fine"
            />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <Typography as="h2" size="15" bold>
              Root causes, re-ranked
            </Typography>
            <ExportCsv
              filename="keyshot-credit-note-baseline-h1-2026"
              headers={["Cause", "Share", "Approx count (H1)"]}
              rows={CAUSE_ROWS}
            />
          </div>
          <Table
            caption="Why credit notes get raised — counted, not estimated"
            columns={[
              { key: "cause", header: "Cause" },
              { key: "share", header: "Share", align: "right" },
              { key: "count", header: "Approx count (H1)", align: "right" },
            ]}
            rows={[
              {
                cause: X("Wrong billing address → AvaTax (US entity)"),
                share: X("~40%"),
                count: X("~165"),
              },
              {
                cause: X("Missing purchase order"),
                share: X("~30%"),
                count: X("~124"),
              },
              {
                cause: X("Mixed — dates, entity, order changes, quote errors"),
                share: X("~30%"),
                count: X("~123"),
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text3">
            The address cause was assumed to be third at best. Counting it put it first — which is
            exactly why the fixture-supplied split is badged Illustrative until KeyShot confirms it.
          </Typography>
        </section>

        <Callout tone="warning" title="The control on US addresses leaves in three weeks">
          <Typography as="p" size="sm" className="text-text2">
            The wrong-address errors on US invoices are currently caught informally by Frederik
            Frost, the Financial Controller — he raised the June FL-vs-TX ticket. He leaves at the
            end of August, with two weeks of holiday first, so the control walks out the door in
            about three weeks. It was never a written rule, just a person who knew the customers.
            The quote-stage address selection is what replaces it.
          </Typography>
        </Callout>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            What one credit note actually costs
          </Typography>
          <Checklist
            title="The work behind a single credit note"
            items={[
              { label: "Raise the credit note", done: true, note: X("~10 minutes") },
              { label: "Reissue the invoice", done: true },
              { label: "Redo the customer statement, if one already went", done: false },
              {
                label: "Email Omar to apply an old credit to a newer invoice",
                done: false,
                note: V("Uniworld — cannot be done in-product"),
              },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">A few times a month</Badge>
            <Typography as="span" size="xs" className="text-text3">
              More around close. The ten minutes is the smallest part of the cost.
            </Typography>
          </div>
        </section>
      </div>
    </LightChrome>
  );
}
