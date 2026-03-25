"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { IconPencil } from "@tabler/icons-react";
import { useEditor } from "../_lib/editor-context";
import { findSectionForElement } from "../_lib/section-matcher";
import { findFieldByMode } from "../_lib/text-field-mapper";
import { resolveCompanionPath } from "../_lib/block-edit-map";
import type { BlockType } from "@/types/ai-generation";
import { ButtonEditPopup } from "./popups/button-edit-popup";

type ComponentType = "button" | "image";

interface HoverInfo {
  element: HTMLElement;
  type: ComponentType;
  rect: DOMRect;
}

interface EditInfo {
  element: HTMLElement;
  type: ComponentType;
  rect: DOMRect;
  sectionId: string;
  content: Record<string, unknown>;
  fieldPrefix: string;
  textField: string;
  linkField: string;
  typeField?: string;
}

/** Detect a BUTTON or CTA-styled A tag walking up the DOM */
function findComponentElement(target: HTMLElement): { el: HTMLElement; type: ComponentType } | null {
  let el: HTMLElement | null = target;

  while (el) {
    if (el.classList.contains("group/section")) break;
    if (el.classList.contains("editor-preview")) break;
    if (el.hasAttribute("data-editor-ui")) return null;

    if (el.tagName === "BUTTON") {
      // Skip Radix accordion triggers
      if (el.closest("[data-slot='accordion-item']")) {
        el = el.parentElement;
        continue;
      }
      // Skip FAQ toggle buttons (full-width + SVG icon)
      if (el.classList.contains("w-full") && el.querySelector("svg")) {
        el = el.parentElement;
        continue;
      }
      // Skip icon-only buttons (carousel arrows, dots, toggles)
      const btnText = el.textContent?.trim() ?? "";
      if (!btnText || btnText.length <= 2) {
        el = el.parentElement;
        continue;
      }
      return { el, type: "button" };
    }

    if (el.tagName === "A") {
      const computed = window.getComputedStyle(el);
      const py = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
      const px = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
      const hasBg = computed.backgroundColor !== "rgba(0, 0, 0, 0)" && computed.backgroundColor !== "transparent";
      const hasBorder = computed.borderWidth !== "0px" && computed.borderStyle !== "none";
      if ((py > 12 || px > 16) && (hasBg || hasBorder)) {
        return { el, type: "button" };
      }
    }

    if (el.tagName === "IMG") {
      return { el, type: "image" };
    }

    el = el.parentElement;
  }

  return null;
}

export function ComponentEditOverlay() {
  const { state, dispatch } = useEditor();
  const stateRef = useRef(state);
  stateRef.current = state;

  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [editInfo, setEditInfo] = useState<EditInfo | null>(null);
  const hoverElRef = useRef<HTMLElement | null>(null);
  const editBtnRef = useRef<HTMLDivElement | null>(null);

  const openEdit = useCallback(() => {
    if (!hoverInfo) return;

    const previewContainer = document.querySelector(".editor-preview");
    if (!previewContainer) return;

    const currentState = stateRef.current;
    const activePage = currentState.blueprint.pages.find(
      (p) => p.id === currentState.activePageId
    );
    if (!activePage) return;

    const match = findSectionForElement(hoverInfo.element, previewContainer, activePage);
    if (!match) return;

    const blockType = match.section.blockType as BlockType;

    if (hoverInfo.type === "button") {
      const buttonText = hoverInfo.element.textContent ?? "";

      // Use BLOCK_EDIT_MAP: only search "button" mode fields
      const fieldMatch = findFieldByMode(match.content, buttonText, blockType, "button");
      if (!fieldMatch) return;

      // Extract companion paths from the map field definition
      const fieldDef = fieldMatch.field;
      const concretePath = fieldMatch.fieldPath;

      // Split concrete path to get prefix and leaf field name
      const parts = concretePath.split(".");
      // The leaf key (e.g. "ctaText") is the last part of the concrete path
      // The prefix is everything before the last field name in the pattern
      const patternParts = fieldDef.path.split(".");
      const leafKey = patternParts[patternParts.length - 1]; // e.g. "ctaText"
      const prefix = parts.slice(0, parts.length - 1).join("."); // e.g. "plans.0" or ""

      const linkField = fieldDef.linkPath
        ? resolveCompanionPath(fieldDef, concretePath, fieldDef.linkPath).split(".").pop()!
        : leafKey.replace("Text", "Link");

      const typeField = fieldDef.typePath
        ? resolveCompanionPath(fieldDef, concretePath, fieldDef.typePath).split(".").pop()!
        : undefined;

      setEditInfo({
        ...hoverInfo,
        rect: hoverInfo.element.getBoundingClientRect(),
        sectionId: match.section.id,
        content: match.content,
        fieldPrefix: prefix,
        textField: leafKey,
        linkField,
        typeField,
      });
    }

    // Image: select section and open drawer for full editing
    if (hoverInfo.type === "image") {
      dispatch({ type: "SELECT_SECTION", sectionId: match.section.id });
      dispatch({ type: "OPEN_DRAWER" });
      // Clear hover state
      if (hoverElRef.current) {
        hoverElRef.current.removeAttribute("data-pgl-component-hover");
        hoverElRef.current = null;
      }
      setHoverInfo(null);
    }
  }, [hoverInfo, dispatch]);

  // Event delegation
  useEffect(() => {
    const previewContainer = document.querySelector(".editor-preview");
    if (!previewContainer) return;

    function handleMouseOver(e: Event) {
      if (stateRef.current.isInlineEditing) return;
      if (editInfo) return;

      const target = e.target as HTMLElement;
      if (target.closest("[data-editor-ui]")) return;

      const result = findComponentElement(target);
      if (result && result.el !== hoverElRef.current) {
        // Validate: only show edit UI if this element maps to a real field
        if (result.type === "button") {
          const cs = stateRef.current;
          const page = cs.blueprint.pages.find((p) => p.id === cs.activePageId);
          if (page) {
            const sec = findSectionForElement(result.el, previewContainer!, page);
            if (sec) {
              const btnText = result.el.textContent ?? "";
              const fieldMatch = findFieldByMode(
                sec.content, btnText, sec.section.blockType as BlockType, "button"
              );
              if (!fieldMatch) return; // Not a real CTA → ignore
            } else {
              return;
            }
          }
        }

        if (hoverElRef.current) {
          hoverElRef.current.removeAttribute("data-pgl-component-hover");
        }
        hoverElRef.current = result.el;
        result.el.setAttribute("data-pgl-component-hover", "true");
        setHoverInfo({
          element: result.el,
          type: result.type,
          rect: result.el.getBoundingClientRect(),
        });
      }
    }

    function handleMouseOut(e: Event) {
      const related = (e as MouseEvent).relatedTarget as HTMLElement | null;
      if (related?.closest("[data-editor-ui]")) return;

      if (hoverElRef.current) {
        if (related && hoverElRef.current.contains(related)) return;
        hoverElRef.current.removeAttribute("data-pgl-component-hover");
        hoverElRef.current = null;
        setHoverInfo(null);
      }
    }

    function handleClick(e: Event) {
      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.target as HTMLElement;
      if (target.closest("[data-editor-ui]")) return;

      const clickedButton = target.closest("button");
      const clickedLink = target.closest("a");
      if (clickedButton || clickedLink) {
        mouseEvent.preventDefault();
      }
    }

    previewContainer.addEventListener("mouseover", handleMouseOver, true);
    previewContainer.addEventListener("mouseout", handleMouseOut, true);
    previewContainer.addEventListener("click", handleClick, true);

    return () => {
      previewContainer.removeEventListener("mouseover", handleMouseOver, true);
      previewContainer.removeEventListener("mouseout", handleMouseOut, true);
      previewContainer.removeEventListener("click", handleClick, true);
      if (hoverElRef.current) {
        hoverElRef.current.removeAttribute("data-pgl-component-hover");
      }
    };
  }, [editInfo]);

  useEffect(() => {
    if (!hoverInfo) return;
    const container = document.querySelector(".editor-preview");
    if (!container) return;

    function onScroll() {
      setHoverInfo((prev) =>
        prev ? { ...prev, rect: prev.element.getBoundingClientRect() } : null
      );
    }

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [hoverInfo?.element]);

  const handleCloseEdit = useCallback(() => {
    setEditInfo(null);
    if (hoverElRef.current) {
      hoverElRef.current.removeAttribute("data-pgl-component-hover");
      hoverElRef.current = null;
    }
    setHoverInfo(null);
  }, []);

  const showEditBtn = hoverInfo && !editInfo && !state.isInlineEditing;

  return (
    <>
      {showEditBtn &&
        createPortal(
          <div
            ref={editBtnRef}
            data-editor-ui
            style={{
              position: "fixed",
              top: hoverInfo.rect.top - 12,
              left: hoverInfo.rect.right - 12,
              zIndex: 99998,
              pointerEvents: "auto",
            }}
            onMouseEnter={() => {
              if (hoverElRef.current) {
                hoverElRef.current.setAttribute("data-pgl-component-hover", "true");
              }
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                openEdit();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition-colors hover:bg-blue-600 hover:text-white"
            >
              <IconPencil className="h-3.5 w-3.5" />
            </button>
          </div>,
          document.body
        )}

      {editInfo?.type === "button" && (
        <ButtonEditPopup
          anchorRect={editInfo.rect}
          sectionId={editInfo.sectionId}
          content={editInfo.content}
          fieldPrefix={editInfo.fieldPrefix}
          textField={editInfo.textField}
          linkField={editInfo.linkField}
          typeField={editInfo.typeField}
          onClose={handleCloseEdit}
        />
      )}
    </>
  );
}
