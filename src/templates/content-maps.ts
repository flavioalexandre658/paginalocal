import type { SectionContentMap } from "./types";
import { PLUMBFLOW_CONTENT_MAP } from "./plumbflow/content-map";
import { AURORA_CONTENT_MAP } from "./grovia/content-map";
import { ROOFORA_CONTENT_MAP } from "./roofora/content-map";

const CONTENT_MAPS: Record<string, SectionContentMap[]> = {
  plumbflow: PLUMBFLOW_CONTENT_MAP,
  aurora: AURORA_CONTENT_MAP,
  roofora: ROOFORA_CONTENT_MAP,
};

export function getContentMapForTemplate(
  templateId: string
): SectionContentMap[] | undefined {
  return CONTENT_MAPS[templateId];
}
