"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "../_lib/editor-context";
import { findFieldByMode, findFieldByText, setFieldByPath } from "../_lib/text-field-mapper";
import { findSectionForElement } from "../_lib/section-matcher";
import type { BlockType } from "@/types/ai-generation";

/** Block-level text tags: prefer outermost (H1 > SPAN → we want H1) */
const BLOCK_TEXT_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "BLOCKQUOTE"]);

/** Inline text tags: prefer innermost */
const INLINE_TEXT_TAGS = new Set(["SPAN", "LI"]);

/** Tags to never make editable */
const SKIP_TAGS = new Set(["BUTTON", "INPUT", "TEXTAREA", "SVG", "PATH", "IMG", "IFRAME", "NAV", "SELECT"]);

/** Block-level tags that disqualify a DIV from being a "leaf" */
const BLOCK_CHILDREN = new Set([
  "DIV", "P", "H1", "H2", "H3", "H4", "H5", "H6", "UL", "OL",
  "TABLE", "SECTION", "ARTICLE", "HEADER", "FOOTER", "FORM", "BLOCKQUOTE",
]);

/**
 * Check if a DIV/TD/TH is a "leaf text element" — contains only text
 * and inline elements, no block-level children.
 *
 * Examples:
 *   <div>5.0</div>                    → leaf ✓
 *   <div>JOSAFÁ SAMPAIO</div>         → leaf ✓
 *   <div><em>serra</em> text</div>    → leaf ✓ (em is inline)
 *   <div><h1>title</h1><p>text</p></div> → NOT leaf ✗ (has block children)
 */
function isLeafText(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (tag !== "DIV" && tag !== "TD" && tag !== "TH" && tag !== "LABEL") return false;

  const children = el.children;
  for (let i = 0; i < children.length; i++) {
    if (BLOCK_CHILDREN.has(children[i].tagName)) return false;
  }
  return true;
}

/**
 * Walk UP from clicked element to find the best text element to edit.
 *
 * Rules:
 * - Block tags (H1-H6, P): always take outermost
 * - Inline tags (SPAN, LI): take innermost (first match)
 * - Leaf DIV/TD/TH: take innermost only if no block children
 * - SKIP_TAGS: stop, but return any text element found inside
 */
function findEditableElement(target: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = target;
  let best: HTMLElement | null = null;

  while (el) {
    if (el.hasAttribute("data-pgl-editing")) return null;
    if (el.classList.contains("group/section")) break;
    if (el.hasAttribute("data-editor-ui")) return null;

    if (SKIP_TAGS.has(el.tagName)) {
      if (best) break;
      return null;
    }

    // CTA-styled A tags → handled by ComponentEditOverlay
    if (el.tagName === "A") {
      const computed = window.getComputedStyle(el);
      const py = parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
      const px = parseFloat(computed.paddingLeft) + parseFloat(computed.paddingRight);
      const hasBg = computed.backgroundColor !== "rgba(0, 0, 0, 0)" && computed.backgroundColor !== "transparent";
      const hasBorder = computed.borderWidth !== "0px" && computed.borderStyle !== "none";
      if ((py > 12 || px > 16) && (hasBg || hasBorder)) {
        if (best) break;
        return null;
      }
    }

    const text = el.textContent?.trim();
    const hasText = text && text.length >= 1;

    if (BLOCK_TEXT_TAGS.has(el.tagName) && hasText) {
      // Block tags: take outermost (keep overwriting)
      best = el;
    } else if (INLINE_TEXT_TAGS.has(el.tagName) && hasText && !best) {
      // Inline tags: take innermost only
      best = el;
    } else if (isLeafText(el) && hasText && !best) {
      // Leaf DIV/TD/TH: take innermost only (no container DIVs!)
      best = el;
    }

    el = el.parentElement;
  }

  return best;
}

export function InlineTextEditor() {
  const { state, dispatch } = useEditor();
  const stateRef = useRef(state);
  stateRef.current = state;
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  const activeElRef = useRef<HTMLElement | null>(null);
  const originalValueRef = useRef("");
  const fieldInfoRef = useRef<{ sectionId: string; fieldPath: string } | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    const previewContainer = document.querySelector(".editor-preview");
    if (!previewContainer) return;

    function handleMouseOver(e: Event) {
      if (activeElRef.current) return;
      const target = e.target as HTMLElement;
      if (target.closest("[data-editor-ui]")) return;
      const el = findEditableElement(target);
      if (el) {
        el.setAttribute("data-pgl-hover", "true");
      }
    }

    function handleMouseOut(e: Event) {
      const target = e.target as HTMLElement;
      let el: HTMLElement | null = target;
      while (el && !el.classList.contains("editor-preview")) {
        el.removeAttribute("data-pgl-hover");
        el = el.parentElement;
      }
    }

    function handleClick(e: Event) {
      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.target as HTMLElement;

      if (target.closest("[data-editor-ui]")) return;

      // If clicking outside active element, save and stop
      if (activeElRef.current && !activeElRef.current.contains(target)) {
        mouseEvent.stopPropagation();
        mouseEvent.preventDefault();
        save();
        return;
      }

      if (activeElRef.current) return;

      const el = findEditableElement(target);
      if (!el) return;

      const text = el.textContent?.trim();
      if (!text) return;

      const currentState = stateRef.current;
      const activePage = currentState.blueprint.pages.find(
        (p) => p.id === currentState.activePageId
      );
      if (!activePage) return;

      const sectionMatch = findSectionForElement(el, previewContainer!, activePage);
      if (!sectionMatch) return;

      const blockType = sectionMatch.section.blockType as BlockType;

      let fieldMatch = findFieldByMode(sectionMatch.content, text, blockType, "text");
      if (!fieldMatch) {
        const fallback = findFieldByText(sectionMatch.content, text);
        if (fallback) {
          fieldMatch = { ...fallback, field: { path: fallback.fieldPath, mode: "text", label: "" } };
        }
      }
      if (!fieldMatch) return;

      mouseEvent.stopPropagation();
      mouseEvent.preventDefault();

      // Save click coordinates — we'll need them after React re-renders
      const clickX = mouseEvent.clientX;
      const clickY = mouseEvent.clientY;

      // Store field info BEFORE dispatch (dispatch may cause re-render that
      // replaces DOM nodes, making `el` stale)
      originalValueRef.current = fieldMatch.currentValue;
      fieldInfoRef.current = {
        sectionId: sectionMatch.section.id,
        fieldPath: fieldMatch.fieldPath,
      };

      // Dispatch state changes — this may re-render components and replace DOM nodes
      dispatchRef.current({ type: "SELECT_SECTION", sectionId: sectionMatch.section.id });
      dispatchRef.current({ type: "SET_INLINE_EDITING", value: true });

      // Defer contentEditable activation to AFTER React finishes re-rendering.
      // Some components (like faq-two-columns) define sub-components inline,
      // causing React to unmount/remount DOM nodes on re-render. We need to
      // re-find the element in the updated DOM.
      setTimeout(() => {
        const preview = previewContainer as HTMLElement;
        preview.style.userSelect = "auto";
        preview.style.setProperty("-webkit-user-select", "auto");

        // Re-find the element at the click position in the (possibly new) DOM
        const newTarget = document.elementFromPoint(clickX, clickY) as HTMLElement | null;
        if (!newTarget) return;

        const newEl = findEditableElement(newTarget);
        if (!newEl) return;

        activeElRef.current = newEl;
        newEl.contentEditable = "true";
        newEl.setAttribute("data-pgl-editing", "true");
        newEl.removeAttribute("data-pgl-hover");
        newEl.style.outline = "2px solid rgb(59, 130, 246)";
        newEl.style.outlineOffset = "4px";
        newEl.style.borderRadius = "4px";
        newEl.style.cursor = "text";
        newEl.focus();

        // Place caret at click position
        if (document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(clickX, clickY);
          if (range) {
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
      }, 50);
    }

    function save() {
      if (savingRef.current) return;
      savingRef.current = true;

      const el = activeElRef.current;
      const fieldInfo = fieldInfoRef.current;

      if (el && fieldInfo) {
        const newText = el.textContent?.trim() ?? "";
        const originalRaw = originalValueRef.current;
        const originalClean = originalRaw.replace(/\*/g, "").replace(/~/g, "");

        if (newText !== originalClean && newText.length > 0) {
          const newValue = preserveAccentMarkers(originalRaw, newText);

          const currentState = stateRef.current;
          const activePage = currentState.blueprint.pages.find(
            (p) => p.id === currentState.activePageId
          );
          const section = activePage?.sections.find((s) => s.id === fieldInfo.sectionId);

          if (section) {
            const updatedContent = setFieldByPath(
              section.content as Record<string, unknown>,
              fieldInfo.fieldPath,
              newValue
            );
            dispatchRef.current({
              type: "UPDATE_SECTION_CONTENT",
              sectionId: fieldInfo.sectionId,
              content: updatedContent,
            });
          }
        }
      }

      deactivate();
      savingRef.current = false;
    }

    function deactivate() {
      const el = activeElRef.current;
      if (!el) return;

      el.contentEditable = "false";
      el.removeAttribute("data-pgl-editing");
      el.style.outline = "";
      el.style.outlineOffset = "";
      el.style.borderRadius = "";
      el.style.cursor = "";

      // Restore user-select: none on preview container
      const preview = document.querySelector(".editor-preview") as HTMLElement | null;
      if (preview) {
        preview.style.userSelect = "none";
        preview.style.setProperty("-webkit-user-select", "none");
      }

      activeElRef.current = null;
      fieldInfoRef.current = null;

      dispatchRef.current({ type: "SET_INLINE_EDITING", value: false });
    }

    function handleKeyDown(e: Event) {
      const keyEvent = e as KeyboardEvent;
      if (!activeElRef.current) return;

      if (keyEvent.key === "Escape") {
        const el = activeElRef.current;
        if (el) {
          el.textContent = originalValueRef.current.replace(/\*/g, "").replace(/~/g, "");
        }
        deactivate();
      }

      if (keyEvent.key === "Enter") {
        const el = activeElRef.current;
        if (el && ["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)) {
          keyEvent.preventDefault();
          save();
        }
      }
    }

    previewContainer.addEventListener("mouseover", handleMouseOver, true);
    previewContainer.addEventListener("mouseout", handleMouseOut, true);
    previewContainer.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      previewContainer.removeEventListener("mouseover", handleMouseOver, true);
      previewContainer.removeEventListener("mouseout", handleMouseOut, true);
      previewContainer.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
      deactivate();
    };
  }, []);

  return null;
}

function preserveAccentMarkers(original: string, newText: string): string {
  const accentRegex = /\*([^*]+)\*/g;
  const accentWords: string[] = [];
  let match;
  while ((match = accentRegex.exec(original)) !== null) {
    accentWords.push(match[1]);
  }
  if (accentWords.length === 0) return newText;

  let result = newText;
  for (const word of accentWords) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![*])(${escaped})(?![*])`, "gi");
    result = result.replace(regex, "*$1*");
  }
  return result;
}
