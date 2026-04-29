"use client";

import { useRef, useEffect, useState, useMemo, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useEditor } from "../_lib/editor-context";
import { EditorPageRenderer } from "./editor-page-renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { PreviewEnvProvider, type PreviewEnv } from "../_lib/preview-env";

/* ── CSS ──────────────────────────────────────────────────────────── */

/** Converts fixed→absolute inside the desktop scroll container.
 *  NOT needed in the iframe — fixed positioning works naturally there. */
const LAYOUT_CSS = `
.pgl-preview .fixed { position: absolute !important; }
`;

/** Editor interaction styles (edit mode only).
 *  IMPORTANT: Never set position:relative here — it breaks elements
 *  that use position:absolute (badges, floating elements).
 *  Use only box-shadow (inset) for all visual indicators. */
const EDITOR_CSS = `
.editor-preview [data-pgl-hover] {
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.4) !important;
}

.editor-preview [data-pgl-hover][data-pgl-edit="text"] { cursor: text; }
.editor-preview [data-pgl-hover][data-pgl-edit="button"],
.editor-preview [data-pgl-hover][data-pgl-edit="image"],
.editor-preview [data-pgl-hover][data-pgl-edit="icon"],
.editor-preview [data-pgl-hover][data-pgl-edit="nav"],
.editor-preview [data-pgl-hover][data-pgl-edit="footer"],
.editor-preview [data-pgl-hover][data-pgl-edit="pricing"] {
  cursor: pointer;
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.4), inset 0 0 0 9999px rgba(0, 0, 0, 0.18) !important;
}

.editor-preview [data-pgl-editing] {
  cursor: text;
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.6) !important;
  outline: none !important;
  border-color: inherit !important;
}
.editor-preview [contenteditable="true"] {
  outline: none !important;
  -webkit-tap-highlight-color: transparent;
}
.editor-preview [contenteditable="true"]:focus {
  outline: none !important;
}

.editor-preview { user-select: none; }
.editor-preview [data-pgl-editing] { user-select: text; }

.editor-preview a, .editor-preview button:not([data-editor-ui] button) { cursor: default; pointer-events: none; }
.editor-preview [data-pgl-edit] { pointer-events: auto; }
.editor-preview [data-editor-ui] { pointer-events: auto; }
.editor-preview [data-editor-ui] * { pointer-events: auto; }
`;

/* ── Skeleton ─────────────────────────────────────────────────────── */

function PreviewSkeleton() {
  return (
    <div className="mx-auto w-full max-w-4xl p-8 space-y-8">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40 bg-[#e5e5e5]" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16 bg-[#e5e5e5]" />
          <Skeleton className="h-4 w-16 bg-[#e5e5e5]" />
          <Skeleton className="h-4 w-16 bg-[#e5e5e5]" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full bg-[#e5e5e5]" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-[16px] bg-[#e5e5e5]" />
      <div className="space-y-3 max-w-xl mx-auto">
        <Skeleton className="h-8 w-72 mx-auto bg-[#e5e5e5]" />
        <Skeleton className="h-4 w-96 mx-auto bg-[#e5e5e5]" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-48 rounded-[12px] bg-[#e5e5e5]" />
        <Skeleton className="h-48 rounded-[12px] bg-[#e5e5e5]" />
        <Skeleton className="h-48 rounded-[12px] bg-[#e5e5e5]" />
      </div>
    </div>
  );
}

/* ── Scroll override helper ───────────────────────────────────────── */

function useScrollOverride(
  getScrollTop: (() => number) | null,
  scrollSource: EventTarget | null,
) {
  useEffect(() => {
    if (!getScrollTop || !scrollSource) return;

    const origScrollY =
      Object.getOwnPropertyDescriptor(window, "scrollY") ??
      Object.getOwnPropertyDescriptor(Window.prototype, "scrollY");

    Object.defineProperty(window, "scrollY", {
      get: getScrollTop,
      configurable: true,
    });
    Object.defineProperty(window, "pageYOffset", {
      get: getScrollTop,
      configurable: true,
    });

    const fwd = () => window.dispatchEvent(new Event("scroll"));
    scrollSource.addEventListener("scroll", fwd, { passive: true });

    return () => {
      scrollSource.removeEventListener("scroll", fwd);
      if (origScrollY) {
        Object.defineProperty(window, "scrollY", origScrollY);
      } else {
        delete (window as unknown as Record<string, unknown>).scrollY;
      }
      delete (window as unknown as Record<string, unknown>).pageYOffset;
    };
  }, [getScrollTop, scrollSource]);
}

/* ── Responsive iframe ────────────────────────────────────────────── */

interface FrameState {
  mount: HTMLElement;
  doc: Document;
}

function ResponsiveFrame({
  width,
  previewMode,
  children,
  onDocReady,
}: {
  width: number;
  previewMode?: boolean;
  children: ReactNode;
  onDocReady?: (doc: Document | null) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frame, setFrame] = useState<FrameState | null>(null);

  // Init the iframe document
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const id = requestAnimationFrame(() => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      doc.open();
      doc.write(
        "<!DOCTYPE html><html><head><meta charset=\"utf-8\"></head>" +
          '<body style="margin:0;padding:0;overflow-x:hidden;"></body></html>',
      );
      doc.close();

      // Clone all parent stylesheets into iframe
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
        doc.head.appendChild(el.cloneNode(true));
      });

      const mount = doc.createElement("div");
      mount.id = "pgl-root";
      doc.body.appendChild(mount);

      setFrame({ mount, doc });
    });

    return () => {
      cancelAnimationFrame(id);
      setFrame(null);
    };
  }, [width]);

  // HMR: re-sync stylesheets when parent head changes
  useEffect(() => {
    if (!frame) return;
    const { doc } = frame;

    const obs = new MutationObserver(() => {
      doc.querySelectorAll("head > [data-synced]").forEach((el) => el.remove());
      document.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
        const c = el.cloneNode(true) as HTMLElement;
        c.setAttribute("data-synced", "");
        doc.head.appendChild(c);
      });
    });

    obs.observe(document.head, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [frame]);

  // Notify parent when iframe doc is ready / torn down
  useEffect(() => {
    onDocReady?.(frame?.doc ?? null);
    return () => onDocReady?.(null);
  }, [frame, onDocReady]);

  // Build PreviewEnv for iframe-rendered components
  const env = useMemo<PreviewEnv | null>(() => {
    if (!frame) return null;
    const { doc } = frame;
    return {
      getDocument: () => doc,
      getPortalTarget: () => doc.body,
      getScrollContainer: () => doc.documentElement,
    };
  }, [frame]);

  return (
    <>
      <iframe
        ref={iframeRef}
        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
        title="Preview"
      />
      {frame &&
        env &&
        createPortal(
          <PreviewEnvProvider value={env}>
            {/* Editor CSS inside iframe (not LAYOUT_CSS — fixed works natively) */}
            {!previewMode && (
              <style dangerouslySetInnerHTML={{ __html: EDITOR_CSS }} />
            )}
            <div
              className={cn(!previewMode && "editor-preview")}
              style={{
                minHeight: "100vh",
                userSelect: previewMode ? "auto" : undefined,
              }}
            >
              {children}
            </div>
          </PreviewEnvProvider>,
          frame.mount,
        )}
    </>
  );
}

/* ── Main component ───────────────────────────────────────────────── */

interface Props {
  previewMode?: boolean;
}

export function EditorPreview({ previewMode }: Props) {
  const { state } = useEditor();
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [iframeDoc, setIframeDoc] = useState<Document | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const isResponsive = state.viewportMode !== "desktop";
  const viewportWidth =
    state.viewportMode === "tablet"
      ? 768
      : state.viewportMode === "mobile"
        ? 375
        : 0;

  // ── Scroll override: desktop ───────────────────────────────────
  const desktopScrollTop = useCallback(
    () => containerEl?.scrollTop ?? 0,
    [containerEl],
  );
  useScrollOverride(
    !isResponsive && containerEl ? desktopScrollTop : null,
    !isResponsive ? containerEl : null,
  );

  // ── Scroll override: responsive (iframe) ───────────────────────
  const iframeScrollTop = useCallback(
    () =>
      iframeDoc
        ? iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop
        : 0,
    [iframeDoc],
  );
  useScrollOverride(
    isResponsive && iframeDoc ? iframeScrollTop : null,
    isResponsive && iframeDoc ? iframeDoc : null,
  );

  const handleIframeDoc = useCallback((doc: Document | null) => {
    setIframeDoc(doc);
  }, []);

  // ── Desktop PreviewEnv ─────────────────────────────────────────
  const desktopEnv = useMemo<PreviewEnv>(
    () => ({
      getDocument: () => document,
      getPortalTarget: () => document.body,
      getScrollContainer: () => containerEl,
    }),
    [containerEl],
  );

  // ── Resolve active page ────────────────────────────────────────
  const activePage = state.blueprint.pages.find(
    (p) => p.id === state.activePageId,
  );
  if (!activePage) {
    return (
      <div
        className="flex h-full items-center justify-center text-sm"
        style={{ color: "#a3a3a3" }}
      >
        Nenhuma pagina selecionada
      </div>
    );
  }

  const pageContent = !loaded ? (
    <PreviewSkeleton />
  ) : (
    <EditorPageRenderer
      page={activePage}
      designTokens={state.blueprint.designTokens}
      navigation={state.blueprint.navigation}
      previewMode={previewMode}
      templateId={state.blueprint.templateId}
      renderEpoch={state.renderEpoch}
    />
  );

  // ── Responsive (iframe) ────────────────────────────────────────
  if (isResponsive) {
    return (
      <div
        className="flex h-full items-center justify-center"
        style={{ backgroundColor: "#e5e5e5" }}
      >
        <div
          className="overflow-hidden rounded-[16px] transition-all duration-300"
          style={{
            width: viewportWidth,
            height: "calc(100% - 32px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
            backgroundColor: "#ffffff",
          }}
        >
          <ResponsiveFrame
            width={viewportWidth}
            previewMode={previewMode}
            onDocReady={handleIframeDoc}
          >
            <div className="min-h-full bg-white">{pageContent}</div>
          </ResponsiveFrame>
        </div>
      </div>
    );
  }

  // ── Desktop (div) ──────────────────────────────────────────────
  return (
    <PreviewEnvProvider value={desktopEnv}>
      <div
        ref={setContainerEl}
        className={cn(
          "relative h-full overflow-y-auto overflow-x-hidden pgl-preview",
          !previewMode && "editor-preview",
        )}
        style={{
          backgroundColor: "#f5f5f4",
          userSelect: previewMode ? "auto" : undefined,
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: LAYOUT_CSS }} />
        {!previewMode && (
          <style dangerouslySetInnerHTML={{ __html: EDITOR_CSS }} />
        )}
        <div className="relative min-h-full bg-white mx-auto">
          {pageContent}
        </div>
      </div>
    </PreviewEnvProvider>
  );
}
