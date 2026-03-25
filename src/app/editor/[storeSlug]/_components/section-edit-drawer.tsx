"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEditor } from "../_lib/editor-context";
import { BLOCK_TYPE_LABELS } from "../_lib/block-type-labels";
import { SectionFieldRenderer } from "./section-field-renderer";
import type { BlockType } from "@/types/ai-generation";

export function SectionEditDrawer() {
  const { state, dispatch } = useEditor();

  const activePage = state.blueprint.pages.find((p) => p.id === state.activePageId);
  const selectedSection = activePage?.sections.find((s) => s.id === state.selectedSectionId);

  const isOpen = state.drawerOpen && !!selectedSection;

  function handleContentChange(content: Record<string, unknown>) {
    if (!selectedSection) return;
    dispatch({
      type: "UPDATE_SECTION_CONTENT",
      sectionId: selectedSection.id,
      content,
    });
  }

  const blockLabel = selectedSection
    ? BLOCK_TYPE_LABELS[selectedSection.blockType as BlockType] ?? selectedSection.blockType
    : "";

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) dispatch({ type: "CLOSE_DRAWER" });
      }}
    >
      <SheetContent side="right" className="w-96 overflow-y-auto sm:max-w-[384px]">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-base">
            {blockLabel}
            {selectedSection && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                Variante {selectedSection.variant}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {selectedSection && (
          <SectionFieldRenderer
            blockType={selectedSection.blockType as BlockType}
            content={selectedSection.content as Record<string, unknown>}
            onChange={handleContentChange}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
