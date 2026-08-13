import { VisualisationIndex } from "@/components/gallery/VisualisationIndex";

/**
 * Index for this visualisation. Every visualisation's `page.tsx` is exactly
 * this: the shared component discovers the screen folders next to it, so adding
 * a screen means adding a folder and nothing else.
 */
export default function KeyshotReferenceIndex() {
  return <VisualisationIndex slug="keyshot-reference" />;
}
