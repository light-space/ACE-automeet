import { Building2, Hash, MapPin } from "lucide-react";

import { SalesforceChrome } from "@/components/chrome/SalesforceChrome";
import { ActionLog } from "@/components/ui/ActionLog";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Field, V, X } from "@/components/ui/Field";
import { Table } from "@/components/ui/Table";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * Screen 1 — the fix, at the point it belongs.
 *
 * The transcript's key insight: the biggest single cause of credit notes on the
 * US entity is the billing address syncing wrong to AvaTax (the June FL-vs-TX
 * case), not a missing PO. The correct address is already on the account — it is
 * a *selection* bug, not a data-collection one. So the fix is a dropdown the rep
 * picks at quote stage, which Jeppe explicitly endorsed as "just a dropdown".
 *
 * Sales-facing → Salesforce chrome (constraint 1). PO is a warning, never a gate
 * (constraint 2). The re-ranked cause split is invented in the fixture, so it is
 * Illustrative wherever it appears.
 */

export const screenMeta: ScreenMeta = {
  title: "Quote — pick the billing address",
  blurb:
    "A rep builds a US quote and chooses which billing address AvaTax will use, so the tax is right the first time. Sales-facing.",
  chrome: "salesforce",
};

export default function QuoteAddressScreen() {
  return (
    <SalesforceChrome
      objectType="Quote"
      recordTitle="Q-4471 — The Open Window"
      appName="Sales"
      tabs={["Details", "Line Items", "Billing", "Activity"]}
      actions={["Edit", "Submit for Finance"]}
    >
      <div className="flex flex-col gap-6">
        <Callout tone="accent" title="Choose the billing address for tax">
          <Typography as="p" size="sm" className="text-text2">
            AvaTax derives US sales tax from the billing address. When a US account carries more
            than one address, the sync has been taking the wrong one — the June case where an
            invoice took the Texas address instead of the Florida one, so the sales tax was wrong
            and the invoice had to be credited and reissued. Picking the right address here, at
            quote stage, settles it before the invoice is ever raised. It is already on the
            account; this is a selection, not a new field to fill in.
          </Typography>
        </Callout>

        <section className="rounded-5 border-0.5 border-hairline bg-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <Typography as="h2" size="15" bold>
              Quote summary
            </Typography>
            <StatusBadge status="DRAFT" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Account" value={V("The Open Window")} />
            <Field label="Quote number" value={X("Q-4471")} />
            <Field
              label="Billing entity"
              value={V("KeyShot Inc (US)")}
              hint="The US entity, where the address problem concentrates"
            />
            <Field label="Owner" value={X("Marco Bianchi")} />
            <Field label="Currency" value={V("USD")} />
            <Field label="Quote total" value={X("USD 6,560.00")} />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            Billing address
          </Typography>
          <Table
            caption="Addresses on this account — choose which one bills"
            columns={[
              { key: "address", header: "Address", icon: MapPin },
              { key: "region", header: "Region" },
              { key: "tax", header: "AvaTax rate", align: "right" },
              { key: "use", header: "Use for billing" },
            ]}
            rows={[
              {
                address: X("1200 Brickell Ave, Miami"),
                region: X("Florida"),
                tax: X("7.00%"),
                use: <Badge tone="accent">Selected</Badge>,
              },
              {
                address: X("500 W 2nd St, Austin"),
                region: X("Texas"),
                tax: X("8.25%"),
                use: <Badge tone="neutral">Available</Badge>,
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text3">
            Both addresses already exist on the account in Salesforce. The bug was never missing
            data — it was the sync choosing the wrong row.
          </Typography>
        </section>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            Line items
          </Typography>
          <Table
            caption="Products on this quote"
            columns={[
              { key: "product", header: "Product", icon: Building2 },
              { key: "qty", header: "Qty", icon: Hash, align: "right" },
              { key: "total", header: "Total", align: "right" },
            ]}
            rows={[
              {
                product: X("KeyShot Pro — Annual, Named"),
                qty: X("8"),
                total: X("USD 5,120.00"),
              },
              {
                product: X("KeyShot Web — Annual"),
                qty: X("2"),
                total: X("USD 1,440.00"),
              },
            ]}
          />
        </section>

        <Callout tone="warning" title="No purchase order on file">
          <Typography as="p" size="sm" className="text-text2">
            This customer has no purchase order attached. You can still submit the quote to finance
            — the gap is flagged for them to chase, and nothing here gates on it. Plenty of
            direct-stream business is quoted and invoiced first, and the customer supplies the
            number later.
          </Typography>
        </Callout>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            Quote activity
          </Typography>
          <ActionLog
            title="Quote activity"
            exportFilename="q-4471-activity"
            entries={[
              {
                at: X("17 Aug 2026, 09:41"),
                actor: X("Marco Bianchi"),
                action: "set the billing address to",
                detail: X("Miami, FL — 7.00% AvaTax"),
              },
              {
                at: X("17 Aug 2026, 09:38"),
                actor: X("Marco Bianchi"),
                action: "built the quote from opportunity",
                detail: X("OPP-4471"),
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text3">
            The address choice is on the record, so finance can see what tax will apply before they
            validate — and every log here exports to CSV.
          </Typography>
        </section>
      </div>
    </SalesforceChrome>
  );
}
