import type { VisualisationMeta } from "@/lib/visualisations";

/**
 * The hand-built reference visualisation.
 *
 * This one is not agent output and did not come from a client conversation. It
 * is the worked example `.sirius/config.yml` points an agent at: the whole
 * component vocabulary, the provenance rules and all six hard constraints
 * demonstrated on one screen. `reference: true` is what makes the grid label
 * it as such, so nobody in a workshop mistakes it for discovery findings.
 */
const meta: VisualisationMeta = {
  title: "Quote approval — reference",
  client: "KeyShot (internal)",
  sourceTranscript: "none — hand-built by the Light team",
  date: "2026-08-12",
  blurb:
    "The worked example. One sales-facing screen showing the whole component vocabulary: provenance markers, a missing purchase order handled as a warning, Teams notification, and an exportable audit trail. Read it before building a visualisation of your own.",
  reference: true,
};

export default meta;
