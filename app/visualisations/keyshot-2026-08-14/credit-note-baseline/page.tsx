import { AlertTriangle, BookOpen, Building2, FileMinus, FileText, LayoutDashboard, Receipt } from "lucide-react";

import { LightChrome, type LightNavItem } from "@/components/chrome/LightChrome";
import { ActionLog } from "@/components/ui/ActionLog";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Field, I, V, X } from "@/components/ui/Field";
import { Table } from "@/components/ui/Table";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * Screen 3 — the baseline nobody had before this morning, re-ranked.
 *
 * The estimate coming into discovery put a missing PO first (~20% of credit
 * notes). Anett's own count of the first half contradicts it: the wrong US
 * billing address syncing to AvaTax is the largest single cause, ahead of the
 * PO. This screen shows the re-ranking, and the risk that comes with it —
 * Frederik Frost, the controller who catches wrong US addresses today, leaves
 * at the end of August, and that control is undocumented.
 *
 * Every credit-note volume and share here is illustrative: the context dump is
 * explicit that the real count and split are not available through any
 * connected tool, so 412 / 40% / 30% are the synthetic transcript's invented
 * figures, marked X. The shape of the ranking is the point, not the numbers.
 *
 * Finance-facing → Light chrome. Exportable audit trail (constraint 3) — Tina
 * Olesen has been burned by controls she couldn't pull out herself.
 */

const NAV: readonly LightNavItem[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Sales invoices", icon: FileText },
  { label: "Customer credits", icon: FileMinus, active: true },
  { label: "Bills", icon: Receipt },
  { label: "Ledger", icon: BookOpen },
  { label: "Entities", icon: Building2 },
];

export const screenMeta: ScreenMeta = {
  title: "Credit-note baseline, re-ranked",
  blurb:
    "The first-half credit-note count, with the billing address ahead of the PO — and the control that's about to leave. Finance-facing.",
  chrome: "light",
};

export default function CreditNoteBaselineScreen() {
  return (
    <LightChrome
      title="Customer credits"
      nav={NAV}
      tabs={["Root causes", "This half", "By entity", "Void"]}
      workspace="KeyShot"
      actions={<Button intent="outline">Jan–Jun 2026</Button>}
    >
      <div className="flex flex-col gap-6 py-2">
        <Callout tone="info" title="A baseline nobody had two hours ago">
          <Typography as="p" size="sm" className="text-text-secondary">
            Anett went through every credit note in the first half of the year and counted them by
            hand. Every figure below is illustrative until KeyShot confirms the real count — the
            ordering is what matters, not the numbers.
          </Typography>
        </Callout>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Field label="Credit notes, Jan–Jun" value={X("412")} />
          <Field label="Invoices, same period" value={X("~3,000")} />
          <Field label="Rate" value={X("about 1 in 7")} />
          <Field label="Counted in" value={V("Excel, by hand")} />
        </div>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-text-secondary">
            Root causes, re-ranked
          </Typography>
          <Table
            caption="The estimate coming into today put the PO first. The count puts the billing address first."
            columns={[
              { key: "cause", header: "Root cause", icon: AlertTriangle },
              { key: "share", header: "Share", align: "right" },
              { key: "entity", header: "Entity", icon: Building2 },
              { key: "fix", header: "Where it's fixable" },
            ]}
            rows={[
              {
                cause: V("Billing address → AvaTax (wrong US sales tax)"),
                share: X("~40%"),
                entity: V("US — KeyShot Inc"),
                fix: I("Pick the address at quote stage"),
              },
              {
                cause: V("Missing or wrong PO"),
                share: X("~30%"),
                entity: X("All"),
                fix: V("Warn at quote — chased by finance, not gated"),
              },
              {
                cause: V("Wrong dates, wrong entity, order changed, quote error"),
                share: X("~30%"),
                entity: X("Mixed"),
                fix: I("Upstream, in the quote"),
              },
            ]}
          />
        </section>

        <Callout tone="accent" title="The biggest cause is a selection bug, not missing data">
          <Typography as="p" size="sm" className="text-text-secondary">
            The correct billing address is already on the Salesforce account. AvaTax takes the wrong
            one when a customer has more than one — Florida instead of Texas in Frederik&rsquo;s June
            ticket. That is fixable at quote stage with a dropdown, which is a far cheaper thing to
            change than chasing salespeople for POs.
          </Typography>
        </Callout>

        <section className="flex flex-col gap-3">
          <Callout tone="warning" title="A manual control is walking out the door">
            <Typography as="p" size="sm" className="text-text-secondary">
              Frederik Frost raised the Florida-for-Texas AvaTax ticket and, as controller, reviews
              US invoices before they go out — he is the person who catches the wrong address today.
              He leaves at the end of August, with two weeks&rsquo; holiday first. The control that
              currently catches the largest single cause of credit notes is a person, it is not
              written down, and it is about to be gone.
            </Typography>
          </Callout>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Field
              label="Departing"
              value={V("Frederik Frost — Financial Controller")}
              hint="Leaves 31 August 2026, two weeks holiday first"
            />
            <Field
              label="The control at risk"
              value={I("US address review before invoicing")}
              hint="Inferred from his AvaTax ticket; undocumented"
            />
            <Field label="Covers" value={I("The biggest credit-note cause")} />
            <Field label="Who takes it over" value={X("Not yet assigned")} />
          </div>
        </section>

        <Callout tone="info" title="Why a credit note costs more than ten minutes">
          <Typography as="p" size="sm" className="text-text-secondary">
            A credit note is a reissue, sometimes a redone statement, and — when it needs to apply to
            a later invoice — an email to Omar for a back-end fix, because an old credit can&rsquo;t
            be applied to a newer invoice. Uniworld is the standing example. The VAT report sits
            downstream of all of this: fix the invoices and half the VAT problem goes with them.
          </Typography>
        </Callout>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-text-secondary">
            Audit trail
          </Typography>
          <ActionLog
            title="Recent customer credits"
            exportFilename="customer-credits-h1-2026"
            entries={[
              {
                at: V("30 June 2026"),
                actor: V("Anett Sores"),
                action: "raised a credit note",
                detail: V("Uniworld — could not apply it to a newer invoice"),
              },
              {
                at: V("17 June 2026"),
                actor: V("Frederik Frost"),
                action: "caught a wrong billing address",
                detail: V("AvaTax took the TX address, should be FL"),
              },
              {
                at: V("8 June 2026"),
                actor: V("Vanessa Cano"),
                action: "could not un-apply a payment",
                detail: V("Invoice INL2502195"),
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text-secondary">
            Finance can pull this out themselves — constraint 3, and the thing Tina Olesen asked for
            by name.
          </Typography>
        </section>
      </div>
    </LightChrome>
  );
}
