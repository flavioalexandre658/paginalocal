"use client";

import { createContext, useContext } from "react";

/**
 * Provides iframe-aware DOM access for editor components.
 *
 * In desktop mode the getters return the parent document/body.
 * In responsive (iframe) mode they return the iframe's document/body
 * so that portals, scroll listeners, and caret APIs work correctly.
 */
export interface PreviewEnv {
  /** Document for querySelector, caretRangeFromPoint, getSelection */
  getDocument: () => Document;
  /** Target element for React createPortal (replaces document.body) */
  getPortalTarget: () => HTMLElement;
  /** Scrollable element for scroll event listeners */
  getScrollContainer: () => Element | null;
}

const PreviewEnvCtx = createContext<PreviewEnv>({
  getDocument: () => document,
  getPortalTarget: () => document.body,
  getScrollContainer: () => document.querySelector(".pgl-preview"),
});

export const PreviewEnvProvider = PreviewEnvCtx.Provider;

export function usePreviewEnv(): PreviewEnv {
  return useContext(PreviewEnvCtx);
}
