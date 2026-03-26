"use client";

import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconPencil } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { SectionBlock, BlockType } from "@/types/ai-generation";
import { useEditor } from "../_lib/editor-context";
import { SectionToolbar } from "./section-toolbar";
import { setFieldByPath } from "../_lib/text-field-mapper";
import { getFieldEditMode, resolveCompanionPath } from "../_lib/block-edit-map";
import { ButtonEditPopup } from "./popups/button-edit-popup";
import { ImageEditPopup } from "./popups/image-edit-popup";
import { NavEditPopup } from "./popups/nav-edit-popup";
import { FooterEditPopup } from "./popups/footer-edit-popup";
import { PricingEditPopup } from "./popups/pricing-edit-popup";

interface Props {
  section: SectionBlock;
  style?: React.CSSProperties;
  className?: string;
  children: ReactNode;
}

type PopupType = "button" | "image" | "nav" | "footer" | "pricing";

interface PopupState {
  type: PopupType;
  rect: DOMRect;
  path: string;
  fieldPrefix: string;
  textField: string;
  linkField: string;
  typeField?: string;
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
  const { state, dispatch, storeId } = useEditor();
  const isSelected = state.selectedSectionId === section.id;
  const isHovered = state.hoveredSectionId === section.id;

  const anotherHovered = state.hoveredSectionId !== null && state.hoveredSectionId !== section.id;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const activeElRef = useRef<HTMLElement | null>(null);
  const originalHtmlRef = useRef("");
  const fieldPathRef = useRef("");
  const hoverElRef = useRef<HTMLElement | null>(null);

  const [popup, setPopup] = useState<PopupState | null>(null);
  const [hoverRect, setHoverRect] = useState<{ rect: DOMRect; mode: string } | null>(null);

  const showToolbar = !state.isInlineEditing && !popup && (isHovered || (isSelected && !anotherHovered));

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

  useEffect(() => {
    if (!hoverRect || !hoverElRef.current) return;
    const container = document.querySelector(".editor-preview");
    if (!container) return;

    function onScroll() {
      if (hoverElRef.current) {
        setHoverRect((prev) =>
          prev ? { ...prev, rect: hoverElRef.current!.getBoundingClientRect() } : null
        );
      }
    }

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [hoverRect !== null]);

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
    if (activeElRef.current || popup) return;
    const target = e.target as HTMLElement;
    if (!wrapperRef.current) return;

    const el = findEditTarget(target, wrapperRef.current);
    if (el && el !== hoverElRef.current) {
      if (hoverElRef.current) hoverElRef.current.removeAttribute("data-pgl-hover");
      hoverElRef.current = el;
      el.setAttribute("data-pgl-hover", "true");
      const mode = el.dataset.pglEdit || "";
      if (mode !== "text") {
        setHoverRect({ rect: el.getBoundingClientRect(), mode });
      } else {
        setHoverRect(null);
      }
    }
  }, [popup]);

  const handleMouseOut = useCallback((e: React.MouseEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (related?.closest("[data-editor-ui]")) return;
    if (hoverElRef.current) {
      if (related && hoverElRef.current.contains(related)) return;
      hoverElRef.current.removeAttribute("data-pgl-hover");
      hoverElRef.current = null;
      setHoverRect(null);
    }
  }, []);

  const openPopup = useCallback((el: HTMLElement, mode: string, path: string) => {
    const rect = el.getBoundingClientRect();
    const content = section.content as Record<string, unknown>;

    if (mode === "button") {
      const blockType = section.blockType as BlockType;
      const fieldDef = getFieldEditMode(blockType, path);
      if (!fieldDef) return;

      const parts = path.split(".");
      const leafKey = parts[parts.length - 1];
      const prefix = parts.slice(0, -1).join(".");

      const linkField = fieldDef.linkPath
        ? resolveCompanionPath(fieldDef, path, fieldDef.linkPath).split(".").pop()!
        : leafKey.replace("Text", "Link");

      const typeField = fieldDef.typePath
        ? resolveCompanionPath(fieldDef, path, fieldDef.typePath).split(".").pop()!
        : undefined;

      setPopup({ type: "button", rect, path, fieldPrefix: prefix, textField: leafKey, linkField, typeField });
    } else if (mode === "image") {
      setPopup({ type: "image", rect, path, fieldPrefix: "", textField: "", linkField: "" });
    } else if (mode === "nav") {
      setPopup({ type: "nav", rect, path, fieldPrefix: "", textField: "", linkField: "" });
    } else if (mode === "footer") {
      setPopup({ type: "footer", rect, path, fieldPrefix: "", textField: "", linkField: "" });
    } else if (mode === "pricing") {
      setPopup({ type: "pricing", rect, path, fieldPrefix: "", textField: "", linkField: "" });
    }

    dispatch({ type: "SELECT_SECTION", sectionId: section.id });
    setHoverRect(null);
    if (hoverElRef.current) {
      hoverElRef.current.removeAttribute("data-pgl-hover");
      hoverElRef.current = null;
    }
  }, [section.id, section.blockType, section.content, dispatch]);

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
    } else {
      openPopup(el, mode, path);
    }
  }, [section.id, dispatch, save, openPopup]);

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

  const closePopup = useCallback(() => setPopup(null), []);

  const content = section.content as Record<string, unknown>;

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
        setHoverRect(null);
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

      {hoverRect && !popup && !state.isInlineEditing && createPortal(
        <div
          data-editor-ui
          className="pointer-events-auto"
          style={{
            position: "fixed",
            top: hoverRect.rect.top + hoverRect.rect.height / 2 - 16,
            left: hoverRect.rect.left + hoverRect.rect.width / 2 - 30,
            zIndex: 99998,
          }}
          onMouseEnter={() => {
            if (hoverElRef.current) hoverElRef.current.setAttribute("data-pgl-hover", "true");
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (hoverElRef.current) {
                const mode = hoverElRef.current.dataset.pglEdit || "";
                const path = hoverElRef.current.dataset.pglPath || "";
                openPopup(hoverElRef.current, mode, path);
              }
            }}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-lg ring-1 ring-black/5 transition-colors hover:bg-slate-900 hover:text-white"
          >
            <IconPencil className="h-3.5 w-3.5" />
            {hoverRect.mode === "nav" ? "Editar navegação" : hoverRect.mode === "footer" ? "Editar rodapé" : hoverRect.mode === "pricing" ? "Editar planos" : "Editar"}
          </button>
        </div>,
        document.body
      )}

      {popup?.type === "button" && (
        <ButtonEditPopup
          sectionId={section.id}
          content={content}
          fieldPrefix={popup.fieldPrefix}
          textField={popup.textField}
          linkField={popup.linkField}
          typeField={popup.typeField}
          onClose={closePopup}
        />
      )}

      {popup?.type === "image" && (
        <ImageEditPopup
          sectionId={section.id}
          content={content}
          fieldPath={popup.path}
          storeId={storeId}
          currentUrl={typeof getNestedValue(content, popup.path) === "string" ? getNestedValue(content, popup.path) as string : undefined}
          onClose={closePopup}
        />
      )}

      {popup?.type === "nav" && (
        <NavEditPopup
          sectionId={section.id}
          content={content}
          onClose={closePopup}
        />
      )}

      {popup?.type === "footer" && (
        <FooterEditPopup
          sectionId={section.id}
          content={content}
          onClose={closePopup}
        />
      )}

      {popup?.type === "pricing" && (
        <PricingEditPopup
          sectionId={section.id}
          content={content}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const key of parts) {
    if (current == null || typeof current !== "object") return undefined;
    const idx = parseInt(key);
    if (Array.isArray(current) && !isNaN(idx)) {
      current = (current as unknown[])[idx];
    } else {
      current = (current as Record<string, unknown>)[key];
    }
  }
  return current;
}
