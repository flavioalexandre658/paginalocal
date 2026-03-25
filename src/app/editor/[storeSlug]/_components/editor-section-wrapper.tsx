"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconPencil } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { SectionBlock, BlockType } from "@/types/ai-generation";
import { useEditor } from "../_lib/editor-context";
import { SectionToolbar } from "./section-toolbar";
import { setFieldByPath } from "../_lib/text-field-mapper";
import { getFieldEditMode, resolveCompanionPath } from "../_lib/block-edit-map";
import { ButtonEditPopup } from "./popups/button-edit-popup";

interface Props {
  section: SectionBlock;
  style?: React.CSSProperties;
  className?: string;
  children: ReactNode;
}

function htmlToAccentText(html: string): string {
  return html
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findEditTarget(target: HTMLElement, boundary: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== boundary) {
    if (el.hasAttribute("data-editor-ui")) return null;
    if (el.dataset.pglEdit) return el;
    el = el.parentElement;
  }
  return null;
}

export function EditorSectionWrapper({ section, style, className, children }: Props) {
  const { state, dispatch } = useEditor();
  const isSelected = state.selectedSectionId === section.id;
  const isHovered = state.hoveredSectionId === section.id;

  const anotherHovered = state.hoveredSectionId !== null && state.hoveredSectionId !== section.id;
  const showToolbar = !state.isInlineEditing && (isHovered || (isSelected && !anotherHovered));

  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeElRef = useRef<HTMLElement | null>(null);
  const originalHtmlRef = useRef("");
  const fieldPathRef = useRef("");
  const hoverElRef = useRef<HTMLElement | null>(null);

  const buttonPopupRef = useRef<{
    rect: DOMRect;
    path: string;
    content: Record<string, unknown>;
  } | null>(null);

  const deactivate = useCallback(() => {
    const el = activeElRef.current;
    if (!el) return;

    el.contentEditable = "false";
    el.removeAttribute("data-pgl-editing");
    el.style.outline = "";
    el.style.outlineOffset = "";
    el.style.borderRadius = "";
    el.style.cursor = "";

    const preview = document.querySelector(".editor-preview") as HTMLElement | null;
    if (preview) {
      preview.style.userSelect = "none";
      preview.style.setProperty("-webkit-user-select", "none");
    }

    activeElRef.current = null;
    fieldPathRef.current = "";
    dispatch({ type: "SET_INLINE_EDITING", value: false });
  }, [dispatch]);

  const save = useCallback(() => {
    const el = activeElRef.current;
    const path = fieldPathRef.current;
    if (!el || !path) { deactivate(); return; }

    const newText = htmlToAccentText(el.innerHTML);
    const originalText = htmlToAccentText(originalHtmlRef.current);

    if (newText !== originalText && newText.length > 0) {
      const content = section.content as Record<string, unknown>;
      const updatedContent = setFieldByPath(content, path, newText);
      dispatch({
        type: "UPDATE_SECTION_CONTENT",
        sectionId: section.id,
        content: updatedContent,
      });
    }

    deactivate();
  }, [section.id, section.content, dispatch, deactivate]);

  const handleMouseOver = useCallback((e: React.MouseEvent) => {
    if (activeElRef.current) return;
    const target = e.target as HTMLElement;
    if (!wrapperRef.current) return;

    const el = findEditTarget(target, wrapperRef.current);
    if (el && el !== hoverElRef.current) {
      if (hoverElRef.current) hoverElRef.current.removeAttribute("data-pgl-hover");
      hoverElRef.current = el;
      el.setAttribute("data-pgl-hover", "true");
    }
  }, []);

  const handleMouseOut = useCallback((e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (hoverElRef.current) {
      if (related && hoverElRef.current.contains(related)) return;
      hoverElRef.current.removeAttribute("data-pgl-hover");
      hoverElRef.current = null;
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-editor-ui]")) return;

    if (activeElRef.current && !activeElRef.current.contains(target)) {
      e.stopPropagation();
      e.preventDefault();
      save();
      return;
    }

    if (activeElRef.current) return;
    if (!wrapperRef.current) return;

    const el = findEditTarget(target, wrapperRef.current);

    if (!el) {
      e.stopPropagation();
      dispatch({ type: "SELECT_SECTION", sectionId: section.id });
      return;
    }

    const mode = el.dataset.pglEdit;
    const path = el.dataset.pglPath;
    if (!mode || !path) return;

    e.stopPropagation();
    e.preventDefault();

    if (mode === "text") {
      dispatch({ type: "SELECT_SECTION", sectionId: section.id });
      dispatch({ type: "SET_INLINE_EDITING", value: true });

      const clickX = e.clientX;
      const clickY = e.clientY;

      activeElRef.current = el;
      originalHtmlRef.current = el.innerHTML;
      fieldPathRef.current = path;

      const preview = document.querySelector(".editor-preview") as HTMLElement | null;
      if (preview) {
        preview.style.userSelect = "auto";
        preview.style.setProperty("-webkit-user-select", "auto");
      }

      el.contentEditable = "true";
      el.setAttribute("data-pgl-editing", "true");
      el.removeAttribute("data-pgl-hover");
      el.style.outline = "2px solid rgb(59, 130, 246)";
      el.style.outlineOffset = "4px";
      el.style.borderRadius = "4px";
      el.style.cursor = "text";
      el.focus();

      if (document.caretRangeFromPoint) {
        const range = document.caretRangeFromPoint(clickX, clickY);
        if (range) {
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      }
    }

    if (mode === "button") {
      const blockType = section.blockType as BlockType;
      const fieldDef = getFieldEditMode(blockType, path);
      if (!fieldDef) return;

      const content = section.content as Record<string, unknown>;
      const parts = path.split(".");
      const leafKey = parts[parts.length - 1];
      const prefix = parts.slice(0, -1).join(".");

      const linkField = fieldDef.linkPath
        ? resolveCompanionPath(fieldDef, path, fieldDef.linkPath).split(".").pop()!
        : leafKey.replace("Text", "Link");

      const typeField = fieldDef.typePath
        ? resolveCompanionPath(fieldDef, path, fieldDef.typePath).split(".").pop()!
        : undefined;

      buttonPopupRef.current = {
        rect: el.getBoundingClientRect(),
        path,
        content,
      };

      dispatch({ type: "SELECT_SECTION", sectionId: section.id });

      // Force re-render to show popup
      wrapperRef.current?.dispatchEvent(new CustomEvent("pgl-popup-open"));
    }

    if (mode === "image") {
      dispatch({ type: "SELECT_SECTION", sectionId: section.id });
      dispatch({ type: "OPEN_DRAWER" });
    }
  }, [section.id, section.blockType, section.content, dispatch, save]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!activeElRef.current) return;

    if (e.key === "Escape") {
      activeElRef.current.innerHTML = originalHtmlRef.current;
      deactivate();
    }

    if (e.key === "Enter") {
      const tag = activeElRef.current.tagName;
      if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(tag)) {
        e.preventDefault();
        save();
      }
    }
  }, [save, deactivate]);

  return (
    <div
      ref={wrapperRef}
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
      onMouseLeave={() => {
        dispatch({ type: "HOVER_SECTION", sectionId: null });
        if (hoverElRef.current) {
          hoverElRef.current.removeAttribute("data-pgl-hover");
          hoverElRef.current = null;
        }
      }}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {!section.visible && (
        <div data-editor-ui className="absolute left-1/2 top-4 z-30 -translate-x-1/2 rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-medium text-white">
          Seção oculta
        </div>
      )}

      {children}

      {showToolbar && <SectionToolbar section={section} />}
    </div>
  );
}
