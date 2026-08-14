import { Coins, FileText, Hash } from "lucide-react";

import { SalesforceChrome } from "@/components/chrome/SalesforceChrome";
import { DetailGrid } from "@/components/salesforce/DetailGrid";
import { Path } from "@/components/salesforce/Path";
import { RelatedList } from "@/components/salesforce/RelatedList";
import { Toast } from "@/components/salesforce/Toast";
import { StatusBadge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Checklist } from "@/components/ui/Checklist";
import { V, X } from "@/components/ui/Field";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * Screen 1 — the quote step, where the biggest credit-note cause is created.
 *
 * The transcript re-ranked the credit-note root causes: the wrong US billing
 * address syncing to AvaTax is the largest single cause (~40%), not the missing
 * PO. And the fix is not to collect anything new — the correct address is
 * already on the Salesforce account. It is a selection bug: when a customer has
 * more than one address, the sync takes the wrong one (Frederik's June ticket:
 * the TX address instead of the FL one). Jeppe explicitly backed adding an
 * address dropdown at quote stage, and was just as explicit that a quote must
 * not be gated on a PO.
 *
 * Sales-facing → Salesforce chrome (constraint 1: sales stays in Salesforce).
 * The missing PO warns and lets the send proceed (constraint 2). KeyShot's
 * Salesforce quoting is custom-coded, not CPQ, so the field layout is our
 * inference — disclosed in DetailGrid's `note`.
 */

export const screenMeta: ScreenMeta = {
  title: "Billing address at quote stage",
  blurb:
    "The salesperson picks the right US billing address on the opportunity, before AvaTax ever sees it. Sales-facing.",
  chrome: "salesforce",
};

export default function QuoteBillingAddressScreen() {
  return (
    <SalesforceChrome
      objectType="Opportunity"
      recordTitle="The Open Window"
      appName="Sales"
      objectIcon="OP"
      tabs={["Details", "Related", "Activity"]}
      actions={["Edit", "Send Quote"]}
      highlights={[
        { label: "Account Name", value: V("The Open Window") },
        { label: "Billing Entity", value: V("KeyShot Inc (US)") },
        { label: "Amount", value: V("USD 6,560.00") },
        { label: "Close Date", value: X("30 September 2026") },
      ]}
    >
      <Toast variant="info" title="Pick a billing address before sending.">
        AvaTax uses it to set US sales tax. Choosing it here is what keeps the invoice from being
        credited and reissued later.
      </Toast>

      <Path
        stages={["Draft", "Quoted", "Accepted", "Finance validated", "Invoiced"]}
        currentIndex={1}
        action="Mark Stage as Complete"
      />

      <Callout tone="accent" title="The billing address is chosen here, at quote stage">
        <Typography as="p" size="sm" className="text-sf-weak">
          This account has more than one address on file. AvaTax uses whichever one syncs, and the
          wrong pick produces the wrong US sales tax — then a credit note and a reissue. Selecting
          the billing address on the opportunity settles it before the invoice exists. It is a
          dropdown, not new information: the right address is already on the account.
        </Typography>
      </Callout>

      <DetailGrid
        title="Opportunity Details"
        note="Inferred layout. KeyShot's Salesforce quoting is custom-coded rather than standard CPQ, so this arrangement is our reading of the process, not a copy of their page layout."
        sections={[
          {
            title: "Opportunity",
            fields: [
              { label: "Account Name", value: V("The Open Window") },
              { label: "Billing Entity", value: V("KeyShot Inc (US)") },
              { label: "Amount", value: V("USD 6,560.00") },
              { label: "Opportunity Owner", value: X("Sofia Berg") },
              { label: "Start Date", value: X("1 October 2026") },
              { label: "End Date", value: X("30 September 2027") },
            ],
          },
          {
            title: "Billing address",
            fields: [
              { label: "Billing address (selected)", value: V("Florida (FL)") },
              { label: "Also on this account", value: V("Texas (TX)") },
              { label: "US sales tax source", value: V("AvaTax — from the selected billing address") },
              {
                label: "Why it matters",
                value: V("June credit note: AvaTax took the TX address, not the FL one"),
                wide: true,
              },
            ],
          },
        ]}
      />

      <Callout tone="warning" title="No purchase order on this opportunity">
        <Typography as="p" size="sm" className="text-sf-weak">
          The Open Window has not supplied a PO. Send the quote anyway — a missing PO is a flag for
          finance, not a reason to hold the deal. Sometimes there genuinely is no PO, and holding a
          real deal over one costs more than the occasional credit note. Finance chases the
          reference before invoicing; nothing here gates on it, and nothing should: constraint 2 in
          CLAUDE.md. {/* guard-ok */}
        </Typography>
      </Callout>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <RelatedList
          title="Opportunity Line Items"
          icon="OL"
          columns={[
            { key: "product", header: "Product", icon: FileText },
            { key: "sku", header: "SKU", icon: Hash },
            { key: "qty", header: "Quantity", icon: Hash, align: "right" },
            { key: "amount", header: "Amount", icon: Coins, align: "right" },
            { key: "status", header: "Status" },
          ]}
          rows={[
            {
              product: X("KeyShot Pro — annual"),
              sku: X("KS-PRO-1Y"),
              qty: X("40"),
              amount: X("USD 6,560.00"),
              status: <StatusBadge status="DRAFT" />,
            },
          ]}
        />

        <div className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-sf-text">
            Send readiness
          </Typography>
          <Checklist
            items={[
              { label: "Billing address selected", done: true, note: V("Florida (FL)") },
              { label: "Billing entity confirmed", done: true, note: V("KeyShot Inc (US)") },
              {
                label: "Purchase order",
                done: false,
                note: X("Not supplied — not required to send"),
              },
              {
                label: "Discount within guideline",
                done: false,
                note: V("No discount ceiling is enforced in Salesforce"),
              },
            ]}
          />
        </div>
      </div>
    </SalesforceChrome>
  );
}
