"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { SectionBlock } from "@/types/ai-generation";
import { useEditor } from "../_lib/editor-context";
import { SectionToolbar } from "./section-toolbar";

interface Props {
  section: SectionBlock;
  style?: React.CSSProperties;
  className?: string;
  children: ReactNode;
}

export function EditorSectionWrapper({ section, style, className, children }: Props) {
  const { state, dispatch } = useEditor();
  const isSelected = state.selectedSectionId === section.id;
  const isHovered = state.hoveredSectionId === section.id;

  // Show toolbar when:
  // - This section is hovered, OR
  // - This section is selected AND no other section is being hovered
  const anotherHovered = state.hoveredSectionId !== null && state.hoveredSectionId !== section.id;
  const showToolbar = !state.isInlineEditing && (isHovered || (isSelected && !anotherHovered));

  return (
    <div
      className={cn(
        "group/section relative cursor-pointer transition-all duration-150",
        isSelected && "ring-2 ring-inset ring-blue-500",
        !isSelected && "hover:ring-1 hover:ring-inset hover:ring-blue-300",
        (isSelected || isHovered) && "z-10",
        !section.visible && "opacity-30",
        className
      )}
      style={style}
      onMouseEnter={() => dispatch({ type: "HOVER_SECTION", sectionId: section.id })}
      onMouseLeave={() => dispatch({ type: "HOVER_SECTION", sectionId: null })}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-pgl-editing]")) return;
        e.stopPropagation();
        dispatch({ type: "SELECT_SECTION", sectionId: section.id });
      }}
    >
      {!section.visible && (
        <div className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-white">
          Seção oculta
        </div>
      )}

      {children}

      {showToolbar && <SectionToolbar section={section} />}
    </div>
  );
}
