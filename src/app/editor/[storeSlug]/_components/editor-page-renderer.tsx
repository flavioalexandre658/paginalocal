"use client";

import { cn } from "@/lib/utils";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type {
  PageBlueprint,
  DesignTokens,
  SectionBlock as SectionBlockType,
  BlockType,
} from "@/types/ai-generation";
import { SectionBlock } from "@/components/site-renderer/section-block";
import { DesignTokensProvider } from "@/components/site-renderer/design-tokens-provider";
import { EditorSectionWrapper } from "./editor-section-wrapper";
import { BLOCK_TYPE_LABELS } from "../_lib/block-type-labels";

/**
 * Blocks that use position:fixed + bottom and can't be converted to sticky.
 * We render a compact inline placeholder instead of the real component.
 * The user can still edit the content via the sidebar drawer.
 */
const PLACEHOLDER_BLOCKS = new Set(["whatsapp-float"]);

/** Blocks that control their own background — don't apply alternation */
const SELF_BG_BLOCKS = new Set(["hero", "cta", "whatsapp-float", "about", "header", "footer"]);

/** Blocks eligible to become dark when positioned mid-page */
const DARK_ELIGIBLE = new Set(["stats"]);

interface Props {
  page: PageBlueprint;
  designTokens: DesignTokens;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}

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

export function EditorPageRenderer({ page, designTokens, navigation }: Props) {
  // Editor shows ALL sections (including hidden), sorted by order
  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  // Dark index based on visible sections only
  const visibleSections = sortedSections.filter((s) => s.visible);
  const darkIdx = findDarkIndex(visibleSections);
  const darkSectionId = darkIdx >= 0 ? visibleSections[darkIdx]?.id : null;

  let vizIdx = 0;

  return (
    <DesignTokensProvider tokens={designTokens}>
      <main
        className="relative min-h-screen"
        style={{
          backgroundColor: "var(--pgl-background)",
          color: "var(--pgl-text)",
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
          fontWeight: 300,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {sortedSections.map((section) => {
          const selfBg = SELF_BG_BLOCKS.has(section.blockType);
          const isDark = section.id === darkSectionId;

          let sectionStyle: React.CSSProperties = {};
          if (section.visible && !selfBg && !isDark) {
            if (vizIdx % 2 === 1) {
              sectionStyle = { backgroundColor: designTokens.palette.surface };
            }
            vizIdx++;
          }

          const needsPadding = !selfBg;

          // Blocks with fixed+bottom positioning can't work inside a scroll
          // container. Show a compact placeholder instead.
          if (PLACEHOLDER_BLOCKS.has(section.blockType)) {
            const label = BLOCK_TYPE_LABELS[section.blockType as BlockType] ?? section.blockType;
            return (
              <EditorSectionWrapper
                key={section.id}
                section={section}
                style={sectionStyle}
              >
                <div className="flex items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 py-5 text-sm text-slate-400">
                  <IconBrandWhatsapp className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-slate-500">{label}</span>
                  <span className="text-[11px] text-slate-300">clique para editar</span>
                </div>
              </EditorSectionWrapper>
            );
          }

          // Header blocks use position:absolute inside the editor, so the
          // wrapper needs matching positioning to be clickable/selectable.
          const isHeader = section.blockType === "header";

          return (
            <EditorSectionWrapper
              key={section.id}
              section={section}
              style={sectionStyle}
              className={isHeader ? "!absolute top-0 left-0 right-0 z-50" : undefined}
            >
              <div className={cn(needsPadding && "py-24 md:py-32")}>
                <SectionBlock
                  block={section}
                  designTokens={designTokens}
                  isDark={isDark}
                  navigation={isHeader ? navigation : undefined}
                />
              </div>
            </EditorSectionWrapper>
          );
        })}
      </main>
    </DesignTokensProvider>
  );
}
