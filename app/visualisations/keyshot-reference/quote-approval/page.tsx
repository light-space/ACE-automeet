import { Building2, FileText, Hash } from "lucide-react";

import { SalesforceChrome } from "@/components/chrome/SalesforceChrome";
import { ActionLog } from "@/components/ui/ActionLog";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Checklist } from "@/components/ui/Checklist";
import { Field, I, V, X } from "@/components/ui/Field";
import { Table } from "@/components/ui/Table";
import { TeamsCard } from "@/components/ui/TeamsCard";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * The reference screen — the component gallery `.sirius/config.yml` points an
 * agent at. Hand-built by the Light team, not agent output.
 *
 * Read this before building a screen. It is a worked example of the whole
 * vocabulary: a sales-facing record in Salesforce chrome, every value carrying
 * provenance, a missing PO handled as a warning rather than a block (guard-ok), and an
 * audit log that the user can export.
 *
 * The data is mostly Illustrative on purpose — note that you can see which
 * parts are, without reading the source. That is the point of `Field`.
 *
 * Its sibling `invoice-review/` is the same vocabulary in Light's chrome. Read
 * both: the primitives are shared, but the palette is not — this screen is on
 * KeyShot's tokens, that one is on Light's.
 */

/**
 * Every screen exports this. It is how the visualisation index knows the
 * screen's title and who it is for without any central list. `chrome` here
 * must match the chrome component the screen actually renders.
 */
export const screenMeta: ScreenMeta = {
  title: "Quote approval",
  blurb: "A quote submitted for approval with no purchase order attached. Sales-facing.",
  chrome: "salesforce",
};

export default function QuoteApprovalScreen() {
  return (
    <SalesforceChrome
      objectType="Quote"
      recordTitle="Q-10428 — Northwind Design Group"
      appName="Sales"
      tabs={["Details", "Line Items", "Approvals", "Activity"]}
      actions={["Edit", "Submit for Approval"]}
    >
      <div className="flex flex-col gap-6">
        <Callout tone="warning" title="No purchase order on file">
          <Typography as="p" size="sm" className="text-text2">
            This quote has no PO attached. You can submit it for approval anyway — finance will
            chase the PO before invoicing. Nothing here gates on it, and nothing should: see
            constraint 2 in CLAUDE.md.
          </Typography>
        </Callout>

        <section className="rounded-5 border-0.5 border-hairline bg-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <Typography as="h2" size="15" bold>
              Quote summary
            </Typography>
            <StatusBadge status="APPROVAL_PENDING" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Account" value={V("Northwind Design Group")} />
            <Field label="Quote number" value={V("Q-10428")} />
            <Field label="Owner" value={I("Priya Raman")} hint="Inferred from the opportunity" />
            <Field label="Seats" value={X("42")} />
            <Field label="Annual value" value={X("£61,400")} />
            <Field label="Renewal date" value={X("14 March 2027")} />
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            Line items
          </Typography>
          <Table
            caption="Products on this quote"
            columns={[
              { key: "product", header: "Product", icon: FileText },
              { key: "entity", header: "Billing entity", icon: Building2 },
              { key: "qty", header: "Qty", icon: Hash, align: "right" },
              { key: "total", header: "Total", align: "right" },
              { key: "status", header: "Status" },
            ]}
            rows={[
              {
                product: V("KeyShot Pro — Floating"),
                entity: I("KeyShot EMEA Ltd"),
                qty: X("30"),
                total: X("£44,700"),
                status: <StatusBadge status="APPROVED" />,
              },
              {
                product: V("KeyShot Studio — Named"),
                entity: I("KeyShot EMEA Ltd"),
                qty: X("12"),
                total: X("£16,700"),
                status: <StatusBadge status="DRAFT" />,
              },
              {
                product: V("KeyShot Web Viewer"),
                entity: I("KeyShot EMEA Ltd"),
                qty: X("0"),
                total: X("£0"),
                status: <StatusBadge status="ARCHIVED" />,
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text3">
            Note the third row: <code className="rounded bg-softFill px-1">ARCHIVED</code> renders
            as <Badge color="negative">Void</Badge> — finance vocabulary, not &ldquo;Archived&rdquo;.
          </Typography>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="flex flex-col gap-2">
            <Typography as="h2" size="15" bold>
              Approval readiness
            </Typography>
            <Checklist
              items={[
                { label: "Account has a signed MSA", done: true, note: V("Signed 02 Feb 2026") },
                { label: "Discount within delegated authority", done: true, note: X("12% — limit 15%") },
                { label: "Billing entity confirmed", done: true, note: I("KeyShot EMEA Ltd") },
                { label: "Purchase order attached", done: false, note: X("Not required to submit") },
                { label: "Tax treatment reviewed", done: false },
              ]}
            />
          </section>

          <section className="flex flex-col gap-2">
            <Typography as="h2" size="15" bold>
              Notification
            </Typography>
            <TeamsCard
              channel="Deal Desk"
              author="KeyShot Quote Bot"
              timestamp={X("Today at 09:14")}
              title="Quote Q-10428 submitted for approval"
              facts={[
                { label: "Account", value: V("Northwind Design Group") },
                { label: "Annual value", value: X("£61,400") },
                { label: "Missing", value: X("Purchase order") },
              ]}
              actions={["Open in Salesforce", "Approve"]}
            />
          </section>
        </div>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            Audit trail
          </Typography>
          <ActionLog
            title="Quote activity"
            exportFilename="q-10428-activity"
            entries={[
              {
                at: X("12 Aug 2026, 09:14"),
                actor: I("Priya Raman"),
                action: "submitted the quote for approval",
                detail: X("No PO attached — acknowledged"),
              },
              {
                at: X("12 Aug 2026, 08:51"),
                actor: I("Priya Raman"),
                action: "applied a discount",
                detail: X("12% on KeyShot Pro — Floating"),
              },
              {
                at: X("11 Aug 2026, 16:02"),
                actor: V("KeyShot Quote Bot"),
                action: "created the quote from opportunity",
                detail: V("OPP-8841"),
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text3">
            Every log screen carries its own export control — constraint 3.
          </Typography>
        </section>
      </div>
    </SalesforceChrome>
  );
}
