"use client";

import { cn } from "@/lib/utils";
import { IconGripVertical, IconEyeOff } from "@tabler/icons-react";
import { useEditor } from "../_lib/editor-context";
import { BLOCK_TYPE_LABELS } from "../_lib/block-type-labels";
import type { BlockType } from "@/types/ai-generation";

export function EditorSidebar() {
  const { state, dispatch } = useEditor();

  const activePage = state.blueprint.pages.find((p) => p.id === state.activePageId);
  if (!activePage) return null;

  const sortedSections = [...activePage.sections].sort((a, b) => a.order - b.order);

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50/50">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Secoes
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sortedSections.map((section) => {
          const isSelected = state.selectedSectionId === section.id;
          const label = BLOCK_TYPE_LABELS[section.blockType as BlockType] ?? section.blockType;

          return (
            <button
              key={section.id}
              onClick={() => dispatch({ type: "SELECT_SECTION", sectionId: section.id })}
              onDoubleClick={() => {
                dispatch({ type: "SELECT_SECTION", sectionId: section.id });
                dispatch({ type: "OPEN_DRAWER" });
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                isSelected
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  : "text-slate-700 hover:bg-slate-100",
                !section.visible && "opacity-50"
              )}
            >
              <IconGripVertical className="h-3.5 w-3.5 shrink-0 text-slate-300" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-medium">{label}</span>
                  {!section.visible && (
                    <IconEyeOff className="h-3 w-3 shrink-0 text-slate-400" />
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  Variante {section.variant}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
