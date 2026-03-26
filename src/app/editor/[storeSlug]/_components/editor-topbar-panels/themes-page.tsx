"use client";

interface Props {
  onBack: () => void;
}

interface ThemeCard {
  id: string;
  label: string;
  style: string;
  colors: { bg: string; primary: string; accent: string; text: string };
}

const PLACEHOLDER_THEMES: ThemeCard[] = [
  { id: "current", label: "Tema atual", style: "elegant", colors: { bg: "#faf9f6", primary: "#1a1a2e", accent: "#c9a96e", text: "#1a1a2e" } },
  { id: "modern", label: "Usar este tema", style: "minimal", colors: { bg: "#ffffff", primary: "#0f172a", accent: "#3b82f6", text: "#0f172a" } },
  { id: "bold", label: "Usar este tema", style: "bold", colors: { bg: "#111111", primary: "#ffffff", accent: "#84cc16", text: "#ffffff" } },
  { id: "warm", label: "Usar este tema", style: "warm", colors: { bg: "#fffbeb", primary: "#78350f", accent: "#f97316", text: "#1c1917" } },
  { id: "nature", label: "Usar este tema", style: "minimal", colors: { bg: "#f0fdf4", primary: "#14532d", accent: "#22c55e", text: "#14532d" } },
  { id: "corporate", label: "Usar este tema", style: "industrial", colors: { bg: "#f8fafc", primary: "#1e293b", accent: "#6366f1", text: "#0f172a" } },
];

function ThemePreviewCard({ theme, isCurrent }: { theme: ThemeCard; isCurrent: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-full overflow-hidden rounded-[10px] transition-all duration-150"
        style={{
          border: isCurrent ? "3px solid #171717" : "1px solid rgba(0,0,0,0.08)",
          aspectRatio: "3/4",
          backgroundColor: theme.colors.bg,
        }}
      >
        {/* Mini preview mockup */}
        <div className="flex h-full flex-col p-4">
          {/* Fake navbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="h-2.5 w-16 rounded-full" style={{ backgroundColor: theme.colors.primary, opacity: 0.7 }} />
            <div className="flex gap-2">
              <div className="h-2 w-8 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.2 }} />
              <div className="h-2 w-8 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.2 }} />
              <div className="h-2 w-8 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.2 }} />
            </div>
          </div>

          {/* Fake hero image */}
          <div
            className="mb-4 flex-1 rounded-[8px]"
            style={{ backgroundColor: theme.colors.primary, opacity: 0.12, minHeight: 80 }}
          />

          {/* Fake heading */}
          <div className="mb-2 h-4 w-3/4 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.8 }} />
          <div className="mb-1 h-4 w-1/2 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.8 }} />

          {/* Fake body text */}
          <div className="mt-3 space-y-1.5">
            <div className="h-2 w-full rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.15 }} />
            <div className="h-2 w-5/6 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.15 }} />
          </div>

          {/* Fake CTA */}
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
            <div className="h-6 w-16 rounded-full" style={{ border: `1px solid ${theme.colors.text}30` }} />
          </div>

          {/* Fake cards row */}
          <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
            <div className="rounded-[6px] p-2" style={{ backgroundColor: theme.colors.primary, opacity: 0.06 }}>
              <div className="h-8 w-full rounded-[4px] mb-1.5" style={{ backgroundColor: theme.colors.primary, opacity: 0.15 }} />
              <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.3 }} />
            </div>
            <div className="rounded-[6px] p-2" style={{ backgroundColor: theme.colors.primary, opacity: 0.06 }}>
              <div className="h-8 w-full rounded-[4px] mb-1.5" style={{ backgroundColor: theme.colors.primary, opacity: 0.15 }} />
              <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.3 }} />
            </div>
            <div className="rounded-[6px] p-2" style={{ backgroundColor: theme.colors.primary, opacity: 0.06 }}>
              <div className="h-8 w-full rounded-[4px] mb-1.5" style={{ backgroundColor: theme.colors.primary, opacity: 0.15 }} />
              <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: theme.colors.text, opacity: 0.3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <button
        className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-150"
        style={{
          backgroundColor: isCurrent ? "#171717" : "transparent",
          color: isCurrent ? "#ffffff" : "#1a1a1a",
          border: isCurrent ? "none" : "1px solid rgba(0,0,0,0.15)",
        }}
        onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)"; }}
        onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)"; }}
      >
        {theme.label}
      </button>
    </div>
  );
}

export function ThemesPage({}: Props) {
  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        borderLeft: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="mx-auto max-w-5xl px-10 py-10">
        <h1 className="text-[24px] font-semibold" style={{ color: "#1a1a1a" }}>
          Temas
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed" style={{ color: "#737373" }}>
          Selecione um novo tema para alterar seu design, voce sempre pode voltar a um tema anterior.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-8">
          {PLACEHOLDER_THEMES.map((theme, i) => (
            <ThemePreviewCard key={theme.id} theme={theme} isCurrent={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}
