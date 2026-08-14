import { Building2, CalendarDays, Coins, FileText, Hash } from "lucide-react";

import { LightChrome } from "@/components/chrome/LightChrome";
import { ActionLog } from "@/components/ui/ActionLog";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { DetailSheet } from "@/components/ui/DetailSheet";
import { Field, I, V, X } from "@/components/ui/Field";
import { Table } from "@/components/ui/Table";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * The Light-side half of the reference. Read it alongside `quote-approval` —
 * that one shows the vocabulary in Salesforce chrome, this one shows it in
 * Light's, which is a different shell for a different person.
 *
 * What it exists to demonstrate:
 *   - `LightChrome` composed the way axolotl's `DefaultLayout` composes:
 *     sidebar panel, `rounded-lg` content card, `h-16` bordered header, tabs
 *   - `DetailSheet` — the two-column record sheet with the document well
 *   - `Table` columns carrying lucide icons, via `TableColumnHeader`
 *   - Light's semantic classes on the page itself: `bg-surface-level-2`,
 *     `text-text-secondary`, `border-border-secondary`. No hex, no KeyShot
 *     orange, no invented colour.
 */

export const screenMeta: ScreenMeta = {
  title: "Invoice review",
  blurb:
    "A supplier invoice mid-review in Light, next to the document it came from. Finance-facing.",
  chrome: "light",
};

export default function InvoiceReviewScreen() {
  return (
    <LightChrome
      title="Invoices"
      tabs={["Needs review", "Approved", "Paid", "Void"]}
      workspace="KeyShot"
      actions={
        <div className="flex items-center gap-2">
          <Button intent="outline">Assign</Button>
          <Button intent="primary">Approve</Button>
        </div>
      }
    >
      <DetailSheet
        title="INV-10428 · Northwind Design Group"
        headerSlot={<StatusBadge status="APPROVAL_PENDING" />}
        documentLabel="northwind-inv-10428.pdf"
        stateBanner={
          <Callout tone="warning" title="No purchase order matched">
            <Typography as="p" size="sm" className="text-text-secondary">
              Nothing on this invoice references a purchase order. Approve it anyway if the
              amounts check out — finance chases the reference before payment, and it has never
              been a reason to hold an invoice here. Constraint 2 in CLAUDE.md. {/* guard-ok */}
            </Typography>
          </Callout>
        }
        details={
          <>
            <section className="flex flex-col gap-4">
              <Typography as="h3" size="sm" bold className="text-text-secondary">
                Invoice
              </Typography>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Supplier" value={V("Northwind Design Group")} />
                <Field label="Invoice number" value={V("INV-10428")} />
                <Field label="Billing entity" value={I("KeyShot EMEA Ltd")} />
                <Field label="Issued" value={X("28 July 2026")} />
                <Field label="Due" value={X("27 August 2026")} />
                <Field label="Total" value={X("£61,400.00")} />
              </div>
            </section>

            <section className="flex flex-col gap-2 border-t-0.5 border-border-secondary pt-4">
              <Typography as="h3" size="sm" bold className="text-text-secondary">
                Coding
              </Typography>
              <div className="flex flex-wrap items-center gap-2">
                <Badge color="progress">Design services</Badge>
                <Badge color="pending">Reverse charge</Badge>
                <Badge color="inactive">FY27 Q1</Badge>
              </div>
            </section>
          </>
        }
        document={
          <div className="flex h-full min-h-[18rem] flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <Typography size="15" bold>
                Invoice
              </Typography>
              <Typography size="xs" className="text-text-secondary">
                Page 1 of 2
              </Typography>
            </div>
            <div className="flex flex-col gap-2 border-t-0.5 border-border-secondary pt-3">
              <Field label="Bill to" value={I("KeyShot EMEA Ltd")} layout="inline" />
              <Field label="Reference" value={X("NDG-2026-0714")} layout="inline" />
              <Field label="Subtotal" value={X("£51,166.67")} layout="inline" />
              <Field label="VAT" value={X("£10,233.33")} layout="inline" />
              <Field label="Total due" value={X("£61,400.00")} layout="inline" />
            </div>
            <Typography as="p" size="xs" className="mt-auto text-text-secondary">
              A rendered page would sit here. The well is `rounded-2xl bg-surface-level-2` — one
              surface level below the sheet, which is what makes it read as a well and not a card.
            </Typography>
          </div>
        }
        footer={
          <>
            <section className="flex flex-col gap-2">
              <Typography as="h3" size="15" bold>
                Line items
              </Typography>
              <Table
                columns={[
                  { key: "description", header: "Description", icon: FileText },
                  { key: "entity", header: "Entity", icon: Building2 },
                  { key: "period", header: "Period", icon: CalendarDays },
                  { key: "qty", header: "Qty", icon: Hash, align: "right" },
                  { key: "amount", header: "Amount", icon: Coins, align: "right" },
                  { key: "status", header: "Status" },
                ]}
                rows={[
                  {
                    description: V("Brand system — phase 2"),
                    entity: I("KeyShot EMEA Ltd"),
                    period: X("Jul 2026"),
                    qty: X("1"),
                    amount: X("£44,700.00"),
                    status: <StatusBadge status="APPROVED" />,
                  },
                  {
                    description: V("Motion assets"),
                    entity: I("KeyShot EMEA Ltd"),
                    period: X("Jul 2026"),
                    qty: X("6"),
                    amount: X("£16,700.00"),
                    status: <StatusBadge status="APPROVAL_PENDING" />,
                  },
                  {
                    description: V("Rush fee"),
                    entity: I("KeyShot EMEA Ltd"),
                    period: X("Jul 2026"),
                    qty: X("1"),
                    amount: X("£0.00"),
                    status: <StatusBadge status="ARCHIVED" />,
                  },
                ]}
              />
              <Typography as="p" size="xs" className="text-text-secondary">
                Every column header carries a lucide glyph — `TableColumnHeader`, ported from
                axolotl. The third row is <Badge color="negative">Void</Badge>, never
                &ldquo;Archived&rdquo;.
              </Typography>
            </section>

            <section className="flex flex-col gap-2">
              <Typography as="h3" size="15" bold>
                Audit trail
              </Typography>
              <ActionLog
                title="Invoice activity"
                exportFilename="inv-10428-activity"
                entries={[
                  {
                    at: X("12 Aug 2026, 10:02"),
                    actor: I("Dana Okafor"),
                    action: "routed the invoice for approval",
                    detail: X("Assigned to Finance — EMEA"),
                  },
                  {
                    at: X("12 Aug 2026, 09:47"),
                    actor: V("Light"),
                    action: "extracted the document",
                    detail: X("6 of 6 fields matched"),
                  },
                  {
                    at: X("11 Aug 2026, 17:20"),
                    actor: I("Dana Okafor"),
                    action: "uploaded the invoice",
                    detail: V("northwind-inv-10428.pdf"),
                  },
                ]}
              />
              <Typography as="p" size="xs" className="text-text-secondary">
                Every log screen carries its own export control — constraint 3.
              </Typography>
            </section>
          </>
        }
      />
    </LightChrome>
  );
}
