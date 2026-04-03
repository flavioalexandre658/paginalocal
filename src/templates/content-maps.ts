import type { SectionContentMap } from "./types";
import { PLUMBFLOW_CONTENT_MAP } from "./plumbflow/content-map";
import { AURORA_CONTENT_MAP } from "./grovia/content-map";
import { ROOFORA_CONTENT_MAP } from "./roofora/content-map";
import { VERVEDENT_CONTENT_MAP } from "./vervedent/content-map";
import { BELLEZZA_CONTENT_MAP } from "./bellezza/content-map";
import { FOLIOXA_CONTENT_MAP } from "./folioxa/content-map";
import { REALESTIC_CONTENT_MAP } from "./realestic/content-map";
import { STRATEX_CONTENT_MAP } from "./stratex/content-map";
import { CLEANLY_CONTENT_MAP } from "./cleanly/content-map";
import { LARKO_CONTENT_MAP } from "./larko/content-map";

const CONTENT_MAPS: Record<string, SectionContentMap[]> = {
  plumbflow: PLUMBFLOW_CONTENT_MAP,
  aurora: AURORA_CONTENT_MAP,
  roofora: ROOFORA_CONTENT_MAP,
  vervedent: VERVEDENT_CONTENT_MAP,
  bellezza: BELLEZZA_CONTENT_MAP,
  folioxa: FOLIOXA_CONTENT_MAP,
  realestic: REALESTIC_CONTENT_MAP,
  stratex: STRATEX_CONTENT_MAP,
  cleanly: CLEANLY_CONTENT_MAP,
  larko: LARKO_CONTENT_MAP,
};

export function getContentMapForTemplate(
  templateId: string
): SectionContentMap[] | undefined {
  return CONTENT_MAPS[templateId];
}
