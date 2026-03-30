"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import { PglButton } from "@/components/ui/pgl-button";
import { useEditor } from "../../_lib/editor-context";
import type { DesignTokens } from "@/types/ai-generation";
import {
  getHeadingFonts,
  getBodyFonts,
  type FontOption,
  type FontCategory,
} from "@/lib/fonts";
import { migrateFontPairing } from "@/lib/font-migration";

type ActiveTab = "heading" | "body";
type CategoryFilter = "all" | FontCategory;

const CATEGORY_LABELS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "sans-serif", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "display", label: "Display" },
  { value: "handwriting", label: "Script" },
  { value: "decorative", label: "Decorativa" },
];

interface Props {
  onClose: () => void;
}

export function FontsPopup({ onClose }: Props) {
  const { state, dispatch } = useEditor();

  // Migrate legacy fontPairing to headingFont/bodyFont
  const migratedTokens = useMemo(
    () => migrateFontPairing(state.blueprint.designTokens),
    [state.blueprint.designTokens]
  );

  const [headingSlug, setHeadingSlug] = useState(migratedTokens.headingFont ?? "inter");
  const [bodySlug, setBodySlug] = useState(migratedTokens.bodyFont ?? "inter");
  const [activeTab, setActiveTab] = useState<ActiveTab>("heading");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const snapshotRef = useRef({ heading: headingSlug, body: bodySlug });

  useEffect(() => {
    snapshotRef.current = { heading: migratedTokens.headingFont ?? "inter", body: migratedTokens.bodyFont ?? "inter" };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fontsForTab = useMemo(() => {
    const base = activeTab === "heading" ? getHeadingFonts() : getBodyFonts();
    let filtered = base;

    if (categoryFilter !== "all") {
      filtered = filtered.filter((f) => f.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((f) => f.name.toLowerCase().includes(q));
    }

    return filtered;
  }, [activeTab, categoryFilter, searchQuery]);

  function selectFont(font: FontOption) {
    if (activeTab === "heading") {
      setHeadingSlug(font.slug);
      dispatch({
        type: "UPDATE_DESIGN_TOKENS",
        tokens: { headingFont: font.slug },
      });
    } else {
      setBodySlug(font.slug);
      dispatch({
        type: "UPDATE_DESIGN_TOKENS",
        tokens: { bodyFont: font.slug },
      });
    }
  }

  function handleCancel() {
    dispatch({
      type: "UPDATE_DESIGN_TOKENS",
      tokens: {
        headingFont: snapshotRef.current.heading,
        bodyFont: snapshotRef.current.body,
      },
    });
    onClose();
  }

  function handleDone() {
    onClose();
  }

  const currentSlug = activeTab === "heading" ? headingSlug : bodySlug;

  return (
    <>
      <div className="fixed inset-0 z-[9994]" onClick={handleCancel} />

      <div className="fixed z-[9995] inset-x-0 top-14 flex justify-center pointer-events-none">
        <div
          className="pointer-events-auto w-[520px] max-h-[calc(100vh-80px)] flex flex-col rounded-[16px] overflow-hidden"
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
            <div
              className="rounded-full"
              style={{ width: 40, height: 4, backgroundColor: "rgba(0,0,0,0.15)" }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center gap-2 px-6 pb-3">
            <IconChevronLeft
              style={{ width: 18, height: 18, color: "#1a1a1a", cursor: "pointer" }}
              onClick={handleCancel}
            />
            <p className="text-[16px] font-semibold" style={{ color: "#1a1a1a" }}>
              Tipografia
            </p>
          </div>

          {/* Preview */}
          <div
            className="mx-6 mb-3 rounded-[12px] p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}
          >
            <p
              className="text-[24px] font-bold leading-tight"
              style={{
                fontFamily: `var(--pgl-font-heading), system-ui, sans-serif`,
                color: "#1a1a1a",
              }}
            >
              Titulo de exemplo
            </p>
            <p
              className="mt-1.5 text-[14px] leading-relaxed"
              style={{
                fontFamily: `var(--pgl-font-body), system-ui, sans-serif`,
                color: "#737373",
              }}
            >
              Este e o texto de corpo do seu site. As fontes selecionadas serao
              aplicadas em todo o conteudo.
            </p>
          </div>

          {/* Tab pills */}
          <div className="flex gap-1 mx-6 mb-3 p-[3px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
            <button
              onClick={() => { setActiveTab("heading"); setSearchQuery(""); setCategoryFilter("all"); }}
              className="flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150"
              style={{
                backgroundColor: activeTab === "heading" ? "#fff" : "transparent",
                color: activeTab === "heading" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.45)",
                boxShadow: activeTab === "heading" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              Titulos
            </button>
            <button
              onClick={() => { setActiveTab("body"); setSearchQuery(""); setCategoryFilter("all"); }}
              className="flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150"
              style={{
                backgroundColor: activeTab === "body" ? "#fff" : "transparent",
                color: activeTab === "body" ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.45)",
                boxShadow: activeTab === "body" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              Texto
            </button>
          </div>

          {/* Search */}
          <div className="mx-6 mb-2">
            <div
              className="flex items-center gap-2 rounded-[10px] px-3 py-2"
              style={{ border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#fff" }}
            >
              <IconSearch style={{ width: 16, height: 16, color: "rgba(0,0,0,0.3)" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar fonte..."
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-black/30"
                style={{ color: "rgba(0,0,0,0.8)" }}
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 mx-6 mb-3 overflow-x-auto scrollbar-hide">
            {CATEGORY_LABELS.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className="shrink-0 rounded-full px-3 py-1 text-[12px] font-medium transition-colors duration-150"
                style={{
                  backgroundColor: categoryFilter === cat.value ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.04)",
                  color: categoryFilter === cat.value ? "#fff" : "rgba(0,0,0,0.55)",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Font list */}
          <div className="flex-1 overflow-y-auto px-6 pb-3 min-h-0" style={{ maxHeight: "320px" }}>
            <div className="flex flex-col gap-1">
              {fontsForTab.map((font) => {
                const isActive = font.slug === currentSlug;
                return (
                  <button
                    key={font.slug}
                    onClick={() => selectFont(font)}
                    className="flex items-center justify-between rounded-[10px] px-4 py-3 text-left transition-all duration-150"
                    style={{
                      backgroundColor: isActive ? "rgba(0,0,0,0.03)" : "transparent",
                      border: isActive ? "1.5px solid rgba(0,0,0,0.8)" : "1.5px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive)
                        e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <span
                      className="text-[18px] truncate"
                      style={{ fontFamily: `${font.family}, system-ui, sans-serif`, color: "#1a1a1a" }}
                    >
                      {font.name}
                    </span>
                    <span
                      className="shrink-0 ml-3 text-[11px] font-medium rounded-full px-2 py-0.5"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.04)",
                        color: "rgba(0,0,0,0.4)",
                      }}
                    >
                      {font.category === "sans-serif"
                        ? "Sans"
                        : font.category === "serif"
                        ? "Serif"
                        : font.category === "display"
                        ? "Display"
                        : font.category === "handwriting"
                        ? "Script"
                        : "Deco"}
                    </span>
                  </button>
                );
              })}
              {fontsForTab.length === 0 && (
                <p
                  className="py-8 text-center text-[13px]"
                  style={{ color: "rgba(0,0,0,0.35)" }}
                >
                  Nenhuma fonte encontrada
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-6 py-4"
            style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
          >
            <PglButton variant="ghost" size="sm" onClick={handleCancel}>
              Cancelar
            </PglButton>
            <PglButton variant="dark" size="sm" onClick={handleDone}>
              Aplicar
            </PglButton>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pgl-slide-down {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `,
        }}
      />
    </>
  );
}
