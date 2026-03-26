"use client";

import { cn } from "@/lib/utils";
import type {
  PageBlueprint,
  DesignTokens,
  SectionBlock as SectionBlockType,
} from "@/types/ai-generation";
import { SectionBlock } from "./section-block";
import { DesignTokensProvider } from "./design-tokens-provider";

/** Blocks that control their own background — don't apply alternation */
const SELF_BG_BLOCKS = new Set(["hero", "cta", "whatsapp-float", "about", "header", "footer"]);

/** Blocks eligible to become dark when positioned mid-page */
const DARK_ELIGIBLE = new Set(["stats"]);

interface PageRendererProps {
  page: PageBlueprint;
  designTokens: DesignTokens;
  isPreview?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
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
          fontWeight: 300,
          WebkitFontSmoothing: "antialiased",
        }}
        data-preview={isPreview}
      >
        {sortedSections.map((section, idx) => {
          const selfBg = SELF_BG_BLOCKS.has(section.blockType);
          const isAlwaysDark = false; // About controls its own bg now
          const isDark = isAlwaysDark || idx === darkIdx;

          // Surface alternation via inline style for non-self-bg, non-dark blocks
          let sectionStyle: React.CSSProperties = {};
          if (!selfBg && !isDark) {
            if (vizIdx % 2 === 1) {
              sectionStyle = { backgroundColor: designTokens.palette.surface };
            }
            vizIdx++;
          }

          // Generous padding for non-self-bg blocks
          const needsPadding = !selfBg;

          return (
            <div key={section.id} style={sectionStyle}>
              <div className={cn(needsPadding && "py-24 md:py-32")}>
                <SectionBlock
                  block={section}
                  designTokens={designTokens}
                  isDark={isDark}
                  navigation={section.blockType === "header" ? navigation : undefined}
                />
              </div>
            </div>
          );
        })}
      </main>
    </DesignTokensProvider>
  );
}
