"use client";

import { PageRenderer } from "@/components/site-renderer/page-renderer";
import type { SiteBlueprint } from "@/types/ai-generation";

interface Props {
  blueprint: SiteBlueprint;
}

export function SiteV2Renderer({ blueprint }: Props) {
  const homepage =
    blueprint.pages?.find((p) => p.isHomepage) ?? blueprint.pages?.[0];

  if (!homepage) return null;

  return <PageRenderer page={homepage} designTokens={blueprint.designTokens} navigation={blueprint.navigation} />;
}
