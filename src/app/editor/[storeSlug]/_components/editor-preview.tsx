"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useEditor } from "../_lib/editor-context";
import { EditorPageRenderer } from "./editor-page-renderer";

/**
 * CSS overrides for site components inside the editor:
 *
 * 1. Headers (fixed top-0) → sticky top-0: stick to the top of the scroll
 *    container instead of the browser viewport.
 *
 * 2. Mobile menu overlays (fixed inset-0) → absolute inset-0: fill the
 *    preview area, not the browser viewport.
 *
 * 3. Generic fallback: any remaining .fixed elements get absolute to prevent
 *    them from escaping the preview container.
 */
const PREVIEW_CSS = `
  /* Contain fixed/sticky elements inside the preview scroll container */
  .editor-preview .fixed {
    position: absolute !important;
  }

  /* Hover on ANY editable element */
  .editor-preview [data-pgl-hover] {
    outline: 2px solid rgba(59, 130, 246, 0.4) !important;
    outline-offset: 3px;
    border-radius: 3px;
  }

  /* Cursor by mode */
  .editor-preview [data-pgl-hover][data-pgl-edit="text"] {
    cursor: text;
  }
  .editor-preview [data-pgl-hover][data-pgl-edit="button"],
  .editor-preview [data-pgl-hover][data-pgl-edit="image"],
  .editor-preview [data-pgl-hover][data-pgl-edit="nav"],
  .editor-preview [data-pgl-hover][data-pgl-edit="footer"],
  .editor-preview [data-pgl-hover][data-pgl-edit="pricing"] {
    cursor: pointer;
  }

  /* Dark overlay on component hover */
  .editor-preview [data-pgl-hover][data-pgl-edit="image"],
  .editor-preview [data-pgl-hover][data-pgl-edit="nav"],
  .editor-preview [data-pgl-hover][data-pgl-edit="footer"],
  .editor-preview [data-pgl-hover][data-pgl-edit="pricing"] {
    position: relative;
  }
  .editor-preview [data-pgl-hover][data-pgl-edit="image"]::after,
  .editor-preview [data-pgl-hover][data-pgl-edit="nav"]::after,
  .editor-preview [data-pgl-hover][data-pgl-edit="footer"]::after,
  .editor-preview [data-pgl-hover][data-pgl-edit="pricing"]::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    border-radius: inherit;
    pointer-events: none;
    z-index: 1;
  }

  /* Active editing state */
  .editor-preview [data-pgl-editing] {
    cursor: text;
  }

  /* Prevent text selection while browsing */
  .editor-preview {
    user-select: none;
  }

  /* Allow selection inside active editing element */
  .editor-preview [data-pgl-editing] {
    user-select: text;
  }

  /* Default cursor for links/buttons in editor */
  .editor-preview a, .editor-preview button {
    cursor: default;
  }
`;

export function EditorPreview() {
  const { state } = useEditor();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll proxy: redirect container scroll events to window so that
  // header components (which listen to window scroll + window.scrollY)
  // work correctly inside the editor.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const originalDescriptor = Object.getOwnPropertyDescriptor(window, "scrollY")
      ?? Object.getOwnPropertyDescriptor(Window.prototype, "scrollY");

    // Override window.scrollY to return container's scrollTop
    Object.defineProperty(window, "scrollY", {
      get: () => container.scrollTop,
      configurable: true,
    });

    // Also override pageYOffset (alias for scrollY used by some code)
    Object.defineProperty(window, "pageYOffset", {
      get: () => container.scrollTop,
      configurable: true,
    });

    // When the container scrolls, fire a scroll event on window
    const handleScroll = () => {
      window.dispatchEvent(new Event("scroll"));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);

      // Restore original scrollY
      if (originalDescriptor) {
        Object.defineProperty(window, "scrollY", originalDescriptor);
      } else {
        delete (window as unknown as Record<string, unknown>).scrollY;
      }
      delete (window as unknown as Record<string, unknown>).pageYOffset;
    };
  }, []);

  const activePage = state.blueprint.pages.find((p) => p.id === state.activePageId);
  if (!activePage) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        Nenhuma pagina selecionada
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="editor-preview relative h-full overflow-y-auto overflow-x-hidden bg-slate-100"
    >
      <style dangerouslySetInnerHTML={{ __html: PREVIEW_CSS }} />
      <div
        className={cn(
          "relative mx-auto min-h-full bg-white shadow-sm transition-all duration-300",
          state.viewportMode === "tablet" && "max-w-[768px]",
          state.viewportMode === "mobile" && "max-w-[375px] rounded-2xl ring-4 ring-slate-300/50"
        )}
      >
        <EditorPageRenderer
          page={activePage}
          designTokens={state.blueprint.designTokens}
          navigation={state.blueprint.navigation}
        />
      </div>
    </div>
  );
}
