import { Building2, FileText, Hash, User } from "lucide-react";

import { SalesforceChrome } from "@/components/chrome/SalesforceChrome";
import { DetailGrid } from "@/components/salesforce/DetailGrid";
import { Path } from "@/components/salesforce/Path";
import { RelatedList } from "@/components/salesforce/RelatedList";
import { Toast } from "@/components/salesforce/Toast";
import { ActionLog } from "@/components/ui/ActionLog";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Checklist } from "@/components/ui/Checklist";
import { I, V, X } from "@/components/ui/Field";
import { TeamsCard } from "@/components/ui/TeamsCard";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * The Salesforce half of the reference — the screen `.sirius/config.yml` points
 * an agent at. Hand-built by the Light team, not agent output.
 *
 * Read this before building a sales-facing screen. It is a worked example of
 * the whole vocabulary: a record in Lightning chrome, a Path, a highlights
 * panel, a two-column detail grid, a related list, a toast; every value
 * carrying provenance; a missing PO warned about rather than blocked (guard-ok);
 * and an audit log the user can export.
 *
 * The data is mostly Illustrative on purpose — note that you can see which
 * parts are, without reading the source. That is the point of `Field`.
 *
 * ── One thing this screen is careful about ──────────────────────────────────
 * KeyShot's Salesforce quoting is **custom-coded, not standard CPQ** — their
 * Group Finance Manager said so. The chrome below is accurate SLDS; the field
 * arrangement inside it is our inference, because there is no standard layout
 * to copy and we have not seen theirs. `DetailGrid`'s `note` says that on the
 * screen rather than in a comment, which is where the client can read it.
 *
 * Its sibling `invoice-review/` is the same vocabulary in Light's chrome. Read
 * both: the primitives are shared, the palettes are not. This screen is on
 * SLDS's tokens, that one is on Light's, and neither is on KeyShot's orange.
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
      objectIcon="Q"
      tabs={["Details", "Related", "Approvals", "Activity"]}
      actions={["Edit", "Submit for Approval"]}
      highlights={[
        { label: "Account Name", value: V("Northwind Design Group") },
        { label: "Quote Owner", value: I("Priya Raman") },
        { label: "Total Price", value: X("£61,400") },
        { label: "Expiration Date", value: X("14 March 2027") },
      ]}
    >
      <Toast variant="success" title="Quote submitted.">
        Q-10428 has been sent to the approval queue.
      </Toast>

      <Path
        stages={["Draft", "In Review", "Approved", "Sent", "Accepted"]}
        currentIndex={1}
        action="Mark Stage as Complete"
      />

      <Callout tone="warning" title="No purchase order on file">
        <Typography as="p" size="sm" className="text-text2">
          This quote has no PO attached. You can submit it for approval anyway — finance will chase
          the PO before invoicing. Nothing here gates on it, and nothing should: see constraint 2 in
          CLAUDE.md.
        </Typography>
      </Callout>

      <DetailGrid
        title="Quote Details"
        note="Inferred layout. KeyShot's Salesforce quoting is custom-built rather than standard CPQ, so these fields are our reading of the process, not a copy of their page layout."
        sections={[
          {
            title: "Quote Information",
            fields: [
              { label: "Quote Number", value: V("Q-10428") },
              { label: "Account Name", value: V("Northwind Design Group") },
              { label: "Quote Owner", value: I("Priya Raman") },
              { label: "Billing Entity", value: I("KeyShot EMEA Ltd") },
              { label: "Seats", value: X("42") },
              { label: "Discount", value: X("12%") },
            ],
          },
          {
            title: "Approval",
            fields: [
              { label: "Approval Status", value: X("Pending — Deal Desk") },
              { label: "Purchase Order", value: X("Not supplied") },
              {
                label: "Approver Note",
                value: X("Discount inside delegated authority; no exception needed."),
                wide: true,
              },
            ],
          },
        ]}
      />

      <RelatedList
        title="Quote Line Items"
        icon="QL"
        columns={[
          { key: "product", header: "Product", icon: FileText },
          { key: "entity", header: "Billing Entity", icon: Building2 },
          { key: "qty", header: "Quantity", icon: Hash, align: "right" },
          { key: "total", header: "Total Price", align: "right" },
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

      <Typography as="p" size="xs" className="text-sf-weak">
        Note the third line item: <code className="rounded bg-sf-page px-1">ARCHIVED</code> renders
        as <Badge color="negative">Void</Badge> — finance vocabulary, not &ldquo;Archived&rdquo;.
      </Typography>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <RelatedList
          title="Approval History"
          icon="AH"
          count="2"
          viewAllLabel={null}
          columns={[
            { key: "step", header: "Step", icon: FileText },
            { key: "approver", header: "Assigned To", icon: User },
            { key: "status", header: "Status" },
          ]}
          rows={[
            {
              step: X("Deal Desk review"),
              approver: I("Priya Raman"),
              status: <StatusBadge status="APPROVAL_PENDING" />,
            },
            {
              step: X("Regional VP sign-off"),
              approver: X("Not yet assigned"),
              status: <StatusBadge status="DRAFT" />,
            },
          ]}
        />

        <div className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-sf-text">
            Approval readiness
          </Typography>
          <Checklist
            items={[
              { label: "Account has a signed MSA", done: true, note: V("Signed 02 Feb 2026") },
              {
                label: "Discount within delegated authority",
                done: true,
                note: X("12% — limit 15%"),
              },
              { label: "Billing entity confirmed", done: true, note: I("KeyShot EMEA Ltd") },
              { label: "Purchase order attached", done: false, note: X("Not required to submit") },
              { label: "Tax treatment reviewed", done: false },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-sf-text">
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
        </div>

        <div className="flex flex-col gap-2">
          <Typography as="h2" size="sm" bold className="text-sf-text">
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
          <Typography as="p" size="xs" className="text-sf-weak">
            Every log screen carries its own export control — constraint 3.
          </Typography>
        </div>
      </div>
    </SalesforceChrome>
  );
}
