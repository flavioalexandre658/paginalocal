"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "../_lib/editor-context";
import { findFieldByText, setFieldByPath } from "../_lib/text-field-mapper";

/** Tags that contain editable text */
const TEXT_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "LI", "SPAN", "A"]);
/** Tags to never make editable */
const SKIP_TAGS = new Set(["BUTTON", "INPUT", "TEXTAREA", "SVG", "PATH", "IMG", "IFRAME", "NAV"]);

/**
 * Walk up from clicked element to find the best text element to edit.
 * Prefers the outermost text container (h1 over span inside h1).
 */
function findEditableElement(target: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = target;
  let best: HTMLElement | null = null;

  while (el) {
    if (el.hasAttribute("data-pgl-editing")) return null;
    if (el.classList.contains("group/section")) break;

    if (SKIP_TAGS.has(el.tagName)) return null;

    if (TEXT_TAGS.has(el.tagName)) {
      const text = el.textContent?.trim();
      if (text && text.length > 1) {
        best = el;
      }
    }
    el = el.parentElement;
  }

  return best;
}

/** Find the section ID from a DOM element by walking up to section wrapper */
function findSectionId(el: HTMLElement): string | null {
  let current: HTMLElement | null = el;
  while (current) {
    if (current.classList.contains("group/section")) {
      // The section wrapper has a data attribute or we can match by position
      // Since we don't have data-section-id, we'll return null and match differently
      return null;
    }
    current = current.parentElement;
  }
  return null;
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

    // --- Hover: show outline on text elements ---
    function handleMouseOver(e: Event) {
      if (activeElRef.current) return;
      const target = e.target as HTMLElement;
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

    // --- Click handler ---
    function handleClick(e: Event) {
      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.target as HTMLElement;

      // If clicking outside active element, just save and stop
      if (activeElRef.current && !activeElRef.current.contains(target)) {
        mouseEvent.stopPropagation();
        mouseEvent.preventDefault();
        save();
        return;
      }

      // If already editing, let the click work normally (cursor positioning)
      if (activeElRef.current) return;

      const el = findEditableElement(target);
      if (!el) return;

      const text = el.textContent?.trim();
      if (!text || text.length < 2) return;

      // Find the section wrapper this element belongs to
      let sectionWrapper: HTMLElement | null = el;
      while (sectionWrapper && !sectionWrapper.classList.contains("group/section")) {
        sectionWrapper = sectionWrapper.parentElement;
      }
      if (!sectionWrapper) return;

      // Find the section by matching the wrapper's index in the DOM
      const currentState = stateRef.current;
      const activePage = currentState.blueprint.pages.find(
        (p) => p.id === currentState.activePageId
      );
      if (!activePage) return;

      // Get all section wrappers in order
      const allWrappers = previewContainer!.querySelectorAll(".group\\/section");
      let wrapperIndex = -1;
      allWrappers.forEach((w, i) => {
        if (w === sectionWrapper) wrapperIndex = i;
      });

      if (wrapperIndex === -1) return;

      // Match by order — sorted sections correspond to DOM order
      const sortedSections = [...activePage.sections].sort((a, b) => a.order - b.order);
      const section = sortedSections[wrapperIndex];
      if (!section) return;

      const content = section.content as Record<string, unknown>;
      const match = findFieldByText(content, text);
      if (!match) return;

      // Stop event from selecting the section or doing anything else
      mouseEvent.stopPropagation();
      mouseEvent.preventDefault();

      // Select the section in the sidebar
      dispatchRef.current({ type: "SELECT_SECTION", sectionId: section.id });

      // Activate editing
      activeElRef.current = el;
      originalValueRef.current = match.currentValue;
      fieldInfoRef.current = {
        sectionId: section.id,
        fieldPath: match.fieldPath,
      };

      el.contentEditable = "true";
      el.setAttribute("data-pgl-editing", "true");
      el.removeAttribute("data-pgl-hover");
      el.style.outline = "2px solid rgb(59, 130, 246)";
      el.style.outlineOffset = "4px";
      el.style.borderRadius = "4px";
      el.focus();

      // Place cursor at click position
      requestAnimationFrame(() => {
        if (document.caretRangeFromPoint) {
          const range = document.caretRangeFromPoint(mouseEvent.clientX, mouseEvent.clientY);
          if (range) {
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
      });
    }

    function save() {
      if (savingRef.current) return;
      savingRef.current = true;

      const el = activeElRef.current;
      const fieldInfo = fieldInfoRef.current;

      if (el && fieldInfo) {
        const newText = el.textContent?.trim() ?? "";
        const originalRaw = originalValueRef.current;
        const originalClean = originalRaw.replace(/\*/g, "");

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

      activeElRef.current = null;
      fieldInfoRef.current = null;
    }

    function handleKeyDown(e: Event) {
      const keyEvent = e as KeyboardEvent;
      if (!activeElRef.current) return;

      if (keyEvent.key === "Escape") {
        const el = activeElRef.current;
        if (el) {
          el.textContent = originalValueRef.current.replace(/\*/g, "");
        }
        deactivate();
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
