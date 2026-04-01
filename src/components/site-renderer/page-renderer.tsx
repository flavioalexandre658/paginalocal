"use client";

import { cn } from "@/lib/utils";
import type {
  PageBlueprint,
  DesignTokens,
  SectionBlock as SectionBlockType,
} from "@/types/ai-generation";
import { SectionBlock } from "./section-block";
import { DesignTokensProvider } from "./design-tokens-provider";
import { isLightColor, getContrastColor } from "@/lib/color-contrast";

/** Blocks that control their own background — don't apply alternation */
const SELF_BG_BLOCKS = new Set(["hero", "cta", "whatsapp-float", "about", "header", "footer"]);

/** Blocks eligible to become dark when positioned mid-page */
const DARK_ELIGIBLE = new Set(["stats"]);

interface PageRendererProps {
  page: PageBlueprint;
  designTokens: DesignTokens;
  isPreview?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
  templateId?: string;
}

/** Pick the best section to render as dark (~65 % down the page) */
function findDarkIndex(sections: SectionBlockType[]): number {
  const target = Math.floor(sections.length * 0.65);
  let best = -1;
  let bestDist = Infinity;
  sections.forEach((s, i) => {
    if (DARK_ELIGIBLE.has(s.blockType)) {
      const d = Math.abs(i - target);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
  });
  return best;
}

export function PageRenderer({
  page,
  designTokens,
  isPreview,
  navigation,
  templateId,
}: PageRendererProps) {
  const sortedSections = [...page.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const darkIdx = findDarkIndex(sortedSections);
  let vizIdx = 0; // counter for background alternation (skips self-bg blocks)

  return (
    <DesignTokensProvider tokens={designTokens}>
      <main
        className="min-h-screen"
        style={{
          backgroundColor: "var(--pgl-background)",
          color: "var(--pgl-text)",
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontWeight: "var(--body-weight, 400)" as unknown as undefined,
          WebkitFontSmoothing: "antialiased",
        }}
        data-preview={isPreview}
      >
        {sortedSections.map((section, idx) => {
          // Templates: each section controls its own background — no wrappers
          if (templateId) {
            return (
              <SectionBlock
                key={section.id}
                block={section}
                designTokens={designTokens}
                navigation={section.blockType === "header" || section.blockType === "footer" ? navigation : undefined}
                templateId={templateId}
              />
            );
          }

          // Legacy (no template) — apply background alternation
          const selfBg = SELF_BG_BLOCKS.has(section.blockType);
          const isDark = idx === darkIdx;

          let sectionStyle: React.CSSProperties = {};
          if (isDark) {
            sectionStyle = {
              backgroundColor: designTokens.palette.primary,
              color: getContrastColor(designTokens.palette.primary),
            };
          } else if (!selfBg) {
            if (vizIdx % 2 === 1) {
              const bg = designTokens.palette.surface;
              sectionStyle = {
                backgroundColor: bg,
                color: getContrastColor(bg),
              };
            }
            vizIdx++;
          }

          const needsPadding = !selfBg;

          return (
            <div key={section.id} style={sectionStyle}>
              <div className={cn(needsPadding && "py-24 md:py-32")}>
                <SectionBlock
                  block={section}
                  designTokens={designTokens}
                  isDark={isDark}
                  navigation={section.blockType === "header" || section.blockType === "footer" ? navigation : undefined}
                  templateId={templateId}
                />
              </div>
            </div>
          );
        })}
      </main>
    </DesignTokensProvider>
  );
}
