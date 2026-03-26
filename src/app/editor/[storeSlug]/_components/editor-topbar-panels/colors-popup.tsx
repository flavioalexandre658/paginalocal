"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IconAdjustments, IconArrowLeft, IconArrowsShuffle, IconLink, IconLinkOff, IconRefresh } from "@tabler/icons-react";
import { useEditor } from "../../_lib/editor-context";
import type { DesignTokens } from "@/types/ai-generation";

type Palette = DesignTokens["palette"];
type PaletteKey = keyof Palette;

interface PalettePreset {
  id: string;
  name: string;
  palette: Palette;
}

const PRESETS: PalettePreset[] = [
  { id: "dark-emerald", name: "Esmeralda Escuro", palette: { primary: "#0f1923", secondary: "#1e3a5f", accent: "#10b981", background: "#ffffff", surface: "#f8fafc", text: "#0f172a", textMuted: "#64748b" } },
  { id: "forest-teal", name: "Persa Classico", palette: { primary: "#134e4a", secondary: "#115e59", accent: "#f87171", background: "#1a3a36", surface: "#1f4944", text: "#e2e8f0", textMuted: "#94a3b8" } },
  { id: "royal-electric", name: "Eletrico Real", palette: { primary: "#312e81", secondary: "#3b82f6", accent: "#d4ff00", background: "#1e1b4b", surface: "#252270", text: "#e0e7ff", textMuted: "#a5b4fc" } },
  { id: "olive-navy", name: "Oliva Marinho", palette: { primary: "#a3966b", secondary: "#1e3a5f", accent: "#0f172a", background: "#faf8f0", surface: "#f5f0e0", text: "#1c1917", textMuted: "#78716c" } },
  { id: "teal-mint", name: "Verde Menta", palette: { primary: "#0d4f4f", secondary: "#5eead4", accent: "#f0fdfa", background: "#1a3a3a", surface: "#1f4a4a", text: "#e2f5f0", textMuted: "#94d8c8" } },
  { id: "sage-plum", name: "Salvia e Ameixa", palette: { primary: "#78716c", secondary: "#4d7c0f", accent: "#a855f7", background: "#fdf2f8", surface: "#fce7f3", text: "#1c1917", textMuted: "#a8a29e" } },
  { id: "slate-mono", name: "Cinza Neutro", palette: { primary: "#6b7280", secondary: "#9ca3af", accent: "#4b5563", background: "#e5e7eb", surface: "#d1d5db", text: "#374151", textMuted: "#6b7280" } },
  { id: "charcoal-silver", name: "Carvao Prata", palette: { primary: "#d1d5db", secondary: "#9ca3af", accent: "#6b7280", background: "#111111", surface: "#1c1c1c", text: "#e5e7eb", textMuted: "#9ca3af" } },
  { id: "mono-contrast", name: "Monocromatico", palette: { primary: "#525252", secondary: "#a3a3a3", accent: "#171717", background: "#ffffff", surface: "#fafafa", text: "#171717", textMuted: "#737373" } },
  { id: "navy-rose", name: "Marinho Rosa", palette: { primary: "#1e1b4b", secondary: "#f472b6", accent: "#fbbf24", background: "#0f0e2a", surface: "#1a1848", text: "#e0e7ff", textMuted: "#a5b4fc" } },
];

const EDITABLE_KEYS: { key: PaletteKey; label: string }[] = [
  { key: "primary", label: "Primaria" },
  { key: "accent", label: "Destaque" },
  { key: "secondary", label: "Secundaria" },
];

function isDarkBg(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s, max];
}

function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateHarmony(accentHex: string): Palette {
  const [h] = hexToHsv(accentHex);

  // Primary: shifted +50°, moderate sat so color is clearly visible, medium value
  const primaryH = (h + 50) % 360;
  const primary = hsvToHex(primaryH, 0.42, 0.62);

  // Secondary: shifted +220° (complement area), high sat + enough value so hue is visible
  // Dark but NOT black — the color tint must be clearly perceptible
  const secondaryH = (h + 220) % 360;
  const secondary = hsvToHex(secondaryH, 0.55, 0.24);

  // Background: barely-there tint of accent hue
  const background = hsvToHex(h, 0.04, 0.97);
  const surface = hsvToHex(h, 0.06, 0.94);

  // Text: near-black pulled from secondary family
  const text = hsvToHex(secondaryH, 0.20, 0.12);
  const textMuted = hsvToHex(primaryH, 0.08, 0.46);

  return { primary, secondary, accent: accentHex, background, surface, text, textMuted };
}

function randomAccent(): string {
  const h = Math.random() * 360;
  const s = 0.5 + Math.random() * 0.4;
  const v = 0.5 + Math.random() * 0.4;
  return hsvToHex(h, s, v);
}

interface Props {
  onClose: () => void;
}

export function ColorsPopup({ onClose }: Props) {
  const { state, dispatch } = useEditor();
  const currentPalette = state.blueprint.designTokens.palette;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const snapshotRef = useRef(currentPalette);

  const [customizePreset, setCustomizePreset] = useState<PalettePreset | null>(null);
  const [editingKey, setEditingKey] = useState<PaletteKey>("accent");
  const [hexInput, setHexInput] = useState("");
  const [linked, setLinked] = useState(true);

  useEffect(() => {
    snapshotRef.current = currentPalette;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectPreset(preset: PalettePreset) {
    setSelectedId(preset.id);
    dispatch({ type: "UPDATE_DESIGN_TOKENS", tokens: { palette: preset.palette } });
  }

  function openCustomize(preset: PalettePreset) {
    setCustomizePreset(preset);
    setEditingKey("accent");
    setHexInput(preset.palette.accent);
    setLinked(true);
  }

  function handleCancel() {
    dispatch({ type: "UPDATE_DESIGN_TOKENS", tokens: { palette: snapshotRef.current } });
    onClose();
  }

  function handleDone() {
    onClose();
  }

  function isActive(preset: PalettePreset) {
    if (selectedId) return selectedId === preset.id;
    return (
      preset.palette.primary === currentPalette.primary &&
      preset.palette.accent === currentPalette.accent &&
      preset.palette.background === currentPalette.background
    );
  }

  function updateCustomColor(color: string) {
    setHexInput(color);
    if (linked && editingKey === "accent") {
      const harmony = generateHarmony(color);
      dispatch({ type: "UPDATE_DESIGN_TOKENS", tokens: { palette: harmony } });
    } else {
      const updated = { ...currentPalette, [editingKey]: color };
      dispatch({ type: "UPDATE_DESIGN_TOKENS", tokens: { palette: updated } });
    }
  }

  function handleShuffle() {
    const accent = randomAccent();
    setHexInput(accent);
    setEditingKey("accent");
    const harmony = generateHarmony(accent);
    dispatch({ type: "UPDATE_DESIGN_TOKENS", tokens: { palette: harmony } });
  }

  // ── Customize view ──
  if (customizePreset) {
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

            {/* Header with back + reset */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCustomizePreset(null)}
                  className="rounded-[8px] p-1 transition-colors"
                  style={{ color: "#737373" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}
                >
                  <IconArrowLeft style={{ width: 18, height: 18 }} />
                </button>
                <p className="text-[16px] font-semibold" style={{ color: "#1a1a1a" }}>{customizePreset.name}</p>
              </div>
              <button
                onClick={() => {
                  dispatch({ type: "UPDATE_DESIGN_TOKENS", tokens: { palette: customizePreset.palette } });
                  setEditingKey("accent");
                  setHexInput(customizePreset.palette.accent);
                }}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors"
                style={{ border: "1px solid rgba(0,0,0,0.1)", color: "#737373" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}
              >
                <IconRefresh style={{ width: 13, height: 13 }} />
                <span className="text-[12px] font-medium">Resetar</span>
              </button>
            </div>

            {/* Color circles + picker */}
            <div className="px-6 pb-5">
              <div className="flex gap-6">
                {/* Left: circles + controls */}
                <div className="flex flex-col items-center gap-4" style={{ minWidth: 170 }}>
                  {/* Editable circles */}
                  <div className="relative flex items-center" style={{ width: 160, height: 74 }}>
                    {EDITABLE_KEYS.map(({ key }, i) => {
                      const isEditing = editingKey === key;
                      const color = currentPalette[key];
                      const size = isEditing ? 60 : 46;
                      const positions = [{ left: 4, top: 14 }, { left: 52, top: 0 }, { left: 100, top: 14 }];
                      const pos = positions[i];
                      const dark = isDarkBg(color);
                      const isLocked = linked && key !== "accent";
                      return (
                        <button
                          key={key}
                          onClick={() => {
                            if (linked && key !== "accent") {
                              setLinked(false);
                            }
                            setEditingKey(key);
                            setHexInput(currentPalette[key]);
                          }}
                          className="absolute rounded-full transition-all duration-200 flex items-center justify-center"
                          style={{
                            width: size, height: size,
                            left: isEditing ? pos.left - 7 : pos.left,
                            top: isEditing ? pos.top - 7 : pos.top,
                            backgroundColor: color,
                            border: isEditing
                              ? `3px solid ${dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.12)"}`
                              : `2px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"}`,
                            zIndex: isEditing ? 10 : 3 - i,
                            boxShadow: isEditing ? "0 4px 14px rgba(0,0,0,0.18)" : "none",
                            opacity: isLocked ? 0.7 : 1,
                          }}
                        >
                          {!isEditing && (
                            <IconLink style={{ width: 13, height: 13, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.18)" }} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Shuffle + linked toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShuffle}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors"
                      style={{ border: "1px solid rgba(0,0,0,0.1)", color: "#737373" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)"; e.currentTarget.style.color = "#1a1a1a"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.color = "#737373"; }}
                    >
                      <IconArrowsShuffle style={{ width: 14, height: 14 }} />
                      <span className="text-[12px] font-medium">Aleatorio</span>
                    </button>
                    <button
                      onClick={() => setLinked(!linked)}
                      className="flex items-center rounded-full transition-all duration-200"
                      style={{
                        padding: "5px 8px",
                        backgroundColor: linked ? "#171717" : "transparent",
                        border: linked ? "1px solid #171717" : "1px solid rgba(0,0,0,0.15)",
                      }}
                      title={linked ? "Modo vinculado: cores geradas automaticamente" : "Modo livre: edite cada cor independente"}
                    >
                      {linked ? (
                        <IconLink style={{ width: 14, height: 14, color: "#ffffff" }} />
                      ) : (
                        <IconLinkOff style={{ width: 14, height: 14, color: "#737373" }} />
                      )}
                    </button>
                  </div>

                  {/* Background swatch */}
                  <button
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors"
                    style={{
                      border: editingKey === "background" ? "1.5px solid #171717" : "1px solid rgba(0,0,0,0.1)",
                      color: "#737373",
                    }}
                    onClick={() => { setEditingKey("background"); setHexInput(currentPalette.background); if (linked) setLinked(false); }}
                  >
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: currentPalette.background, border: "1px solid rgba(0,0,0,0.1)" }}
                    />
                    <span className="text-[12px] font-medium">Fundo</span>
                  </button>
                </div>

                {/* Right: color picker */}
                <div className="flex-1">
                  <ColorPicker
                    color={hexInput || currentPalette[editingKey]}
                    onChange={updateCustomColor}
                  />
                </div>
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
        <style dangerouslySetInnerHTML={{ __html: `@keyframes pgl-slide-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }` }} />
      </>
    );
  }

  // ── Presets grid view ──
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
          <div className="flex items-center justify-between px-6 pb-4">
            <p className="text-[16px] font-semibold" style={{ color: "#1a1a1a" }}>Paleta de Cores</p>
            <button
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                const activePreset = PRESETS.find((p) => isActive(p)) ?? PRESETS[0];
                openCustomize(activePreset);
              }}
            >
              <span className="text-[13px] font-medium" style={{ color: "#737373" }}>Personalizar</span>
              <div
                className="h-[22px] w-[22px] rounded-full"
                style={{
                  backgroundColor: currentPalette.primary,
                  border: "3px solid rgba(0,0,0,0.08)",
                }}
              />
            </button>
          </div>

          {/* Grid */}
          <div className="px-6 pb-4 max-h-[420px] overflow-y-auto">
            <div className="grid grid-cols-3 gap-3">
              {PRESETS.map((preset) => {
                const active = isActive(preset);
                const dark = isDarkBg(preset.palette.background);
                const ringColor = dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.08)";
                const activeRing = dark ? "rgba(255,255,255,0.6)" : preset.palette.primary;

                return (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className="relative rounded-[12px] transition-all duration-150 overflow-hidden"
                    style={{
                      backgroundColor: preset.palette.background,
                      border: active ? `2.5px solid ${activeRing}` : `1.5px solid ${ringColor}`,
                      padding: "16px 12px",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = active ? activeRing : ringColor; }}
                  >
                    <div className="flex items-center justify-center" style={{ height: 36 }}>
                      <div className="relative flex items-center" style={{ width: 76, height: 32 }}>
                        <div className="absolute rounded-full" style={{ width: 32, height: 32, left: 0, backgroundColor: preset.palette.primary, border: `2px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)"}`, zIndex: 3 }} />
                        <div className="absolute rounded-full" style={{ width: 32, height: 32, left: 22, backgroundColor: preset.palette.accent, border: `2px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)"}`, zIndex: 2 }} />
                        <div className="absolute rounded-full" style={{ width: 32, height: 32, left: 44, backgroundColor: preset.palette.secondary, border: `2px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)"}`, zIndex: 1 }} />
                      </div>
                    </div>
                    {active && (
                      <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.06)", backdropFilter: "blur(4px)" }}>
                        <IconAdjustments style={{ width: 14, height: 14, color: dark ? "#ffffff" : "#1a1a1a" }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <button onClick={handleCancel} className="rounded-[8px] px-4 py-2 text-[13px] font-medium transition-colors" style={{ color: "#737373" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#737373"; }}>
              Cancelar
            </button>
            <button onClick={handleDone} className="rounded-[8px] px-5 py-2 text-[13px] font-semibold transition-opacity" style={{ backgroundColor: "#171717", color: "#ffffff" }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
              Aplicar
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes pgl-slide-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }` }} />
    </>
  );
}

/* ── Inline Color Picker ─────────────────────────────── */

function ColorPicker({ color, onChange }: { color: string; onChange: (hex: string) => void }) {
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(color));
  const areaRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"area" | "hue" | null>(null);

  useEffect(() => {
    setHsv(hexToHsv(color));
  }, [color]);

  const emitColor = useCallback((h: number, s: number, v: number) => {
    setHsv([h, s, v]);
    onChange(hsvToHex(h, s, v));
  }, [onChange]);

  const handleAreaMove = useCallback((clientX: number, clientY: number) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
    emitColor(hsv[0], s, v);
  }, [hsv, emitColor]);

  const handleHueMove = useCallback((clientX: number) => {
    const rect = hueRef.current?.getBoundingClientRect();
    if (!rect) return;
    const h = Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360));
    emitColor(h, hsv[1], hsv[2]);
  }, [hsv, emitColor]);

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: PointerEvent) {
      if (dragging === "area") handleAreaMove(e.clientX, e.clientY);
      else handleHueMove(e.clientX);
    }
    function onUp() { setDragging(null); }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [dragging, handleAreaMove, handleHueMove]);

  const pureHue = hsvToHex(hsv[0], 1, 1);
  const currentHex = hsvToHex(hsv[0], hsv[1], hsv[2]);

  return (
    <div className="flex flex-col gap-3">
      {/* Saturation/Value area */}
      <div
        ref={areaRef}
        className="relative h-[140px] w-full cursor-crosshair rounded-[10px] overflow-hidden"
        style={{ backgroundColor: pureHue }}
        onPointerDown={(e) => { setDragging("area"); handleAreaMove(e.clientX, e.clientY); }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #ffffff, transparent)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #000000, transparent)" }} />
        <div
          className="absolute rounded-full"
          style={{
            width: 18, height: 18,
            left: `${hsv[1] * 100}%`, top: `${(1 - hsv[2]) * 100}%`,
            transform: "translate(-50%, -50%)",
            border: "3px solid #ffffff",
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            backgroundColor: currentHex,
          }}
        />
      </div>

      {/* Hue slider */}
      <div className="flex items-center gap-3">
        <div
          className="h-5 w-5 rounded-full shrink-0"
          style={{ backgroundColor: currentHex, border: "2px solid rgba(0,0,0,0.08)" }}
        />
        <div
          ref={hueRef}
          className="relative h-3 flex-1 cursor-pointer rounded-full"
          style={{ background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)" }}
          onPointerDown={(e) => { setDragging("hue"); handleHueMove(e.clientX); }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 16, height: 16,
              left: `${(hsv[0] / 360) * 100}%`,
              transform: "translate(-50%, -50%)",
              backgroundColor: pureHue,
              border: "3px solid #ffffff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            }}
          />
        </div>
      </div>

      {/* Hex input */}
      <div
        className="flex items-center rounded-[8px] px-3 py-2"
        style={{ backgroundColor: currentHex }}
      >
        <input
          type="text"
          value={currentHex.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{6}$/.test(v)) {
              onChange(v);
            }
          }}
          className="w-full bg-transparent text-[13px] font-medium outline-none"
          style={{ color: isDarkBg(currentHex) ? "#ffffff" : "#1a1a1a" }}
        />
      </div>
    </div>
  );
}
