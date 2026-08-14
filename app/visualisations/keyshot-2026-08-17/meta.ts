import type { VisualisationMeta } from "@/lib/visualisations";

/**
 * KeyShot Day 1 discovery — the Salesforce-direct quote-to-cash stream.
 *
 * Built from the Monday 17 August discovery segment. The argument across the
 * four screens: the direct stream (the ~20-25% of revenue where Light owns the
 * whole path) leaks at three manual points, and the biggest leak is not the one
 * anyone guessed. Credit notes are driven by the billing address syncing wrong
 * to AvaTax, not by missing POs — a selection bug that is fixable at quote stage
 * with a dropdown. The finance-validated checkbox is a hidden manual gate. And
 * multi-currency reconciliation is being done by hand in Excel.
 *
 * Where the transcript and the context dump disagreed, the transcript won: the
 * fixture re-ranks credit-note causes away from Jeppe's PO-first estimate. Those
 * re-ranked volumes are invented in the fixture, so they carry the Illustrative
 * marker on every screen.
 */
const meta: VisualisationMeta = {
  title: "Direct-stream quote-to-cash",
  client: "KeyShot",
  sourceTranscript: "Synthetic_Monday_transcript_____rehearsal_fixture.html",
  date: "2026-08-17",
  blurb:
    "The Salesforce-direct stream, drawn at its three manual gates. Fix the wrong billing address at quote stage — the real top cause of credit notes, not the missing PO everyone assumed. Make the hidden finance-validated gate visible. And show the multi-currency reconciliation finance now runs by hand.",
};

export default meta;
