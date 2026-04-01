"use client";

import { PageRenderer } from "@/components/site-renderer/page-renderer";
import { StoreProvider } from "@/components/site-renderer/store-context";
import type { SiteBlueprint } from "@/types/ai-generation";

interface Props {
  blueprint: SiteBlueprint;
  storeId?: string;
}

export function SiteV2Renderer({ blueprint, storeId }: Props) {
  const homepage =
    blueprint.pages?.find((p) => p.isHomepage) ?? blueprint.pages?.[0];

  if (!homepage) return null;

  return (
    <StoreProvider storeId={storeId || null}>
      <PageRenderer
        page={homepage}
        designTokens={blueprint.designTokens}
        navigation={blueprint.navigation}
        templateId={blueprint.templateId}
      />
    </StoreProvider>
  );
}
