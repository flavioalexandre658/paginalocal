"use client";

import { useState, useRef, useEffect } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { useEditor } from "../../_lib/editor-context";
import type { DesignTokens } from "@/types/ai-generation";

type FontPairing = DesignTokens["fontPairing"];

interface FontOption {
  id: FontPairing;
  heading: string;
  body: string;
  previewHeading: string;
  previewBody: string;
}

const FONT_OPTIONS: FontOption[] = [
  { id: "inter+merriweather", heading: "Inter", body: "Merriweather", previewHeading: "'Inter', sans-serif", previewBody: "'Merriweather', serif" },
  { id: "poppins+lora", heading: "Poppins", body: "Lora", previewHeading: "'Poppins', sans-serif", previewBody: "'Lora', serif" },
  { id: "montserrat+opensans", heading: "Montserrat", body: "Open Sans", previewHeading: "'Montserrat', sans-serif", previewBody: "'Open Sans', sans-serif" },
  { id: "playfair+source-sans", heading: "Playfair Display", body: "Source Sans", previewHeading: "'Playfair Display', serif", previewBody: "'Source Sans 3', sans-serif" },
  { id: "dm-sans+dm-serif", heading: "DM Sans", body: "DM Serif Display", previewHeading: "'DM Sans', sans-serif", previewBody: "'DM Serif Display', serif" },
  { id: "raleway+roboto", heading: "Raleway", body: "Roboto", previewHeading: "'Raleway', sans-serif", previewBody: "'Roboto', sans-serif" },
  { id: "oswald+roboto", heading: "Oswald", body: "Roboto", previewHeading: "'Oswald', sans-serif", previewBody: "'Roboto', sans-serif" },
  { id: "space-grotesk+inter", heading: "Space Grotesk", body: "Inter", previewHeading: "'Space Grotesk', sans-serif", previewBody: "'Inter', sans-serif" },
];

const FONT_URLS: Record<string, string> = {
  "inter+merriweather": "Inter:wght@400;700|Merriweather:wght@400;700",
  "poppins+lora": "Poppins:wght@400;700|Lora:wght@400;700",
  "montserrat+opensans": "Montserrat:wght@400;700|Open+Sans:wght@400;600",
  "playfair+source-sans": "Playfair+Display:wght@400;700|Source+Sans+3:wght@400;600",
  "dm-sans+dm-serif": "DM+Sans:wght@400;700|DM+Serif+Display:wght@400",
  "raleway+roboto": "Raleway:wght@400;700|Roboto:wght@400;500",
  "oswald+roboto": "Oswald:wght@400;700|Roboto:wght@400;500",
  "space-grotesk+inter": "Space+Grotesk:wght@400;700|Inter:wght@400;500",
};

interface Props {
  onClose: () => void;
}

export function FontsPopup({ onClose }: Props) {
  const { state, dispatch } = useEditor();
  const currentFont = state.blueprint.designTokens.fontPairing;
  const [selectedId, setSelectedId] = useState<FontPairing>(currentFont);
  const snapshotRef = useRef(currentFont);

  useEffect(() => {
    snapshotRef.current = currentFont;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    FONT_OPTIONS.forEach((opt) => {
      const url = FONT_URLS[opt.id];
      if (!url) return;
      const href = `https://fonts.googleapis.com/css2?family=${url}&display=swap`;
      if (document.querySelector(`link[href="${href}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    });
  }, []);

  function selectFont(id: FontPairing) {
    setSelectedId(id);
    dispatch({ type: "UPDATE_DESIGN_TOKENS", tokens: { fontPairing: id } });
  }

  function handleCancel() {
    dispatch({ type: "UPDATE_DESIGN_TOKENS", tokens: { fontPairing: snapshotRef.current } });
    onClose();
  }

  function handleDone() {
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-[9994]" onClick={handleCancel} />

      <div className="fixed z-[9995] inset-x-0 top-14 flex justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-[480px] rounded-[16px] overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            animation: "pgl-slide-down 200ms ease-out",
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-[10px] pb-[6px]">
            <div className="rounded-full" style={{ width: 40, height: 4, backgroundColor: "rgba(0,0,0,0.15)" }} />
          </div>

          {/* Header */}
          <div className="flex items-center gap-2 px-6 pb-4">
            <IconChevronLeft
              style={{ width: 18, height: 18, color: "#1a1a1a", cursor: "pointer" }}
              onClick={handleCancel}
            />
            <p className="text-[16px] font-semibold" style={{ color: "#1a1a1a" }}>Tipografia</p>
          </div>

          {/* Grid */}
          <div className="px-6 pb-4 max-h-[420px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {FONT_OPTIONS.map((opt) => {
                const active = selectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => selectFont(opt.id)}
                    className="rounded-[14px] px-5 py-4 text-left transition-all duration-150"
                    style={{
                      backgroundColor: active ? "#f5f5f4" : "#ffffff",
                      border: active ? "2px solid #171717" : "1.5px solid rgba(0,0,0,0.08)",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = "rgba(0,0,0,0.18)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = active ? "#171717" : "rgba(0,0,0,0.08)"; }}
                  >
                    <p
                      className="text-[22px] font-bold leading-tight"
                      style={{ fontFamily: opt.previewHeading, color: "#1a1a1a" }}
                    >
                      {opt.heading}
                    </p>
                    <p
                      className="mt-1.5 text-[14px]"
                      style={{ fontFamily: opt.previewBody, color: "#737373" }}
                    >
                      {opt.body}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4"
            style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            <button
              onClick={handleCancel}
              className="rounded-[8px] px-4 py-2 text-[13px] font-medium transition-colors"
              style={{ color: "#737373" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDone}
              className="rounded-[8px] px-5 py-2 text-[13px] font-semibold transition-opacity"
              style={{ backgroundColor: "#171717", color: "#ffffff" }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pgl-slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
