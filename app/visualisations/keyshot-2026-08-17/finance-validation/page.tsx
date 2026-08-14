import { SalesforceChrome } from "@/components/chrome/SalesforceChrome";
import { ActionLog } from "@/components/ui/ActionLog";
import { StatusBadge } from "@/components/ui/Badge";
import { Callout } from "@/components/ui/Callout";
import { Checklist } from "@/components/ui/Checklist";
import { Field, I, V, X } from "@/components/ui/Field";
import { TeamsCard } from "@/components/ui/TeamsCard";
import { Typography } from "@/components/ui/Typography";
import type { ScreenMeta } from "@/lib/visualisations";

/**
 * Screen 2 — the hidden manual gate, made visible.
 *
 * Coming into the day the flow was drawn as a straight line: Salesforce → Light,
 * automatic. It is not. Someone in finance (mostly Anett, or Vanessa) ticks a
 * "finance validated" checkbox on the opportunity, running a mental checklist
 * that lives nowhere. And the sync silently fails often enough that Anett then
 * opens Light by hand to confirm each one landed — roughly 250 a month, ticked
 * and re-checked.
 *
 * The checkbox is a Salesforce opportunity field, so this finance task renders in
 * Salesforce chrome — but the user here is finance, not a sales rep. Future state:
 * the checklist is written down, the PO is advisory (constraint 2), and the sync
 * confirms itself so nobody has to go and look.
 *
 * The re-ranked volumes and the checklist contents are invented in the fixture,
 * so they carry the Illustrative marker; the checkbox and the silent-fail are
 * verified from the HubSpot tickets.
 */

export const screenMeta: ScreenMeta = {
  title: "Opportunity — finance validation",
  blurb:
    "The finance-validated checkbox drawn as the manual gate it is, with the sync to Light confirming itself. Finance-facing, inside Salesforce.",
  chrome: "salesforce",
};

export default function FinanceValidationScreen() {
  return (
    <SalesforceChrome
      objectType="Opportunity"
      recordTitle="OPP-4471 — The Open Window"
      appName="Sales"
      tabs={["Details", "Finance", "Sync to Light", "Activity"]}
      actions={["Edit", "Mark finance validated"]}
    >
      <div className="flex flex-col gap-6">
        <Callout tone="info" title="This is a manual gate, and it is invisible on the map">
          <Typography as="p" size="sm" className="text-text2">
            Nothing reaches Light until someone in finance ticks{" "}
            <Typography as="span" size="sm" bold className="text-ink">
              Finance validated
            </Typography>{" "}
            on the opportunity. The check
            is a mental one — dates, entity, address, PO — written down nowhere. Then, because the
            sync has silently dropped opportunities before, finance opens Light to confirm each one
            arrived. On the direct stream that is around 250 opportunities a month, ticked and then
            re-checked by hand.
          </Typography>
        </Callout>

        <section className="rounded-5 border-0.5 border-hairline bg-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <Typography as="h2" size="15" bold>
              Opportunity
            </Typography>
            <StatusBadge status="APPROVAL_PENDING" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Account" value={V("The Open Window")} />
            <Field label="Opportunity" value={X("OPP-4471")} />
            <Field label="Billing entity" value={V("KeyShot Inc (US)")} />
            <Field label="Validated by" value={V("Anett Sores")} hint="Revenue Accountant" />
            <Field label="Backup validator" value={I("Vanessa Cano")} hint="Staff Accountant" />
            <Field
              label="Time on this one"
              value={X("2 days")}
              hint="Waiting on the salesperson to answer"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="flex flex-col gap-2">
            <Typography as="h2" size="15" bold>
              Finance validation checklist
            </Typography>
            <Checklist
              items={[
                { label: "Start and end dates are right", done: true, note: X("01 Apr – 31 Mar") },
                { label: "Billing entity is correct", done: true, note: V("KeyShot Inc (US)") },
                { label: "Billing address is the right one", done: true, note: X("Miami, FL") },
                { label: "Purchase order present", done: false, note: X("Advisory — proceed without") },
                { label: "Discount within guideline", done: false, note: X("No system limit today") },
              ]}
            />
            <Typography as="p" size="xs" className="text-text3">
              The checklist that used to live in Anett&rsquo;s head, written down — so it survives
              when the person who knew it is away.
            </Typography>
          </section>

          <section className="flex flex-col gap-2">
            <Typography as="h2" size="15" bold>
              Sync to Light
            </Typography>
            <div className="rounded-5 border-0.5 border-hairline bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <Typography as="h3" size="sm" bold>
                  Invoice created 1:1
                </Typography>
                <StatusBadge status="POSTED" />
              </div>
              <div className="flex flex-col gap-3">
                <Field label="Light invoice" value={V("INL2502195")} />
                <Field label="Amount" value={V("USD 6,560.00")} />
                <Field label="Synced at" value={X("17 Aug 2026, 10:02")} hint="Confirmed — no manual check needed" />
              </div>
            </div>
            <Typography as="p" size="xs" className="text-text3">
              Vanessa, 30 July: &ldquo;No opportunities are being sent from Salesforce to Light.&rdquo;
              The confirmation is the point — finance stops re-checking Light by hand.
            </Typography>
          </section>
        </div>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            Notification
          </Typography>
          <TeamsCard
            channel="Finance"
            author="Light"
            timestamp={X("Today at 10:02")}
            title="OPP-4471 validated and synced to Light"
            facts={[
              { label: "Account", value: V("The Open Window") },
              { label: "Invoice", value: V("INL2502195") },
              { label: "Amount", value: V("USD 6,560.00") },
              { label: "Validated by", value: V("Anett Sores") },
            ]}
            actions={["Open in Light", "View opportunity"]}
          />
        </section>

        <section className="flex flex-col gap-2">
          <Typography as="h2" size="15" bold>
            Validation trail
          </Typography>
          <ActionLog
            title="Validation and sync"
            exportFilename="opp-4471-validation"
            entries={[
              {
                at: X("17 Aug 2026, 10:02"),
                actor: V("Light"),
                action: "created invoice in Light",
                detail: V("INL2502195 — USD 6,560.00"),
              },
              {
                at: X("17 Aug 2026, 10:01"),
                actor: V("Anett Sores"),
                action: "ticked finance validated",
                detail: X("Address and entity confirmed"),
              },
              {
                at: X("15 Aug 2026, 16:20"),
                actor: X("Marco Bianchi"),
                action: "submitted the opportunity to finance",
                detail: X("No PO — flagged as advisory"),
              },
            ]}
          />
          <Typography as="p" size="xs" className="text-text3">
            Tina Olesen has been burned by controls she cannot see. Every entry here exports to CSV,
            no request to Light required.
          </Typography>
        </section>
      </div>
    </SalesforceChrome>
  );
}
