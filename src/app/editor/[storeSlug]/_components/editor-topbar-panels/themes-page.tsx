"use client";

import { useState, useEffect } from "react";
import { useEditor } from "../../_lib/editor-context";
import { getTemplatesAction } from "@/actions/templates/get-templates.action";

interface TemplateItem {
  id: string;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  previewUrl: string | null;
  forceStyle: string;
  forceRadius: string;
}

interface Props {
  onBack: () => void;
}

function TemplatePreviewCard({
  template,
  isCurrent,
  onSelect,
}: {
  template: TemplateItem;
  isCurrent: boolean;
  onSelect: () => void;
}) {
  const previewColors = {
    bg: template.forceStyle === "elegant" ? "#faf9f6" : template.forceStyle === "bold" ? "#111" : "#fff",
    primary: template.forceStyle === "bold" ? "#fff" : "#1a1a1a",
    text: template.forceStyle === "bold" ? "#fff" : "#1a1a1a",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-full overflow-hidden rounded-[10px] transition-all duration-150 cursor-pointer hover:shadow-lg"
        style={{
          border: isCurrent ? "3px solid #171717" : "1px solid rgba(0,0,0,0.08)",
          aspectRatio: "3/4",
          backgroundColor: previewColors.bg,
        }}
        onClick={onSelect}
      >
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-2.5 w-16 rounded-full" style={{ backgroundColor: previewColors.primary, opacity: 0.7 }} />
            <div className="flex gap-2">
              <div className="h-2 w-8 rounded-full" style={{ backgroundColor: previewColors.text, opacity: 0.2 }} />
              <div className="h-2 w-8 rounded-full" style={{ backgroundColor: previewColors.text, opacity: 0.2 }} />
              <div className="h-2 w-8 rounded-full" style={{ backgroundColor: previewColors.text, opacity: 0.2 }} />
            </div>
          </div>
          <div className="mb-4 flex-1 rounded-[8px]" style={{ backgroundColor: previewColors.primary, opacity: 0.12, minHeight: 80 }} />
          <div className="mb-2 h-4 w-3/4 rounded-full" style={{ backgroundColor: previewColors.text, opacity: 0.8 }} />
          <div className="mb-1 h-4 w-1/2 rounded-full" style={{ backgroundColor: previewColors.text, opacity: 0.8 }} />
          <div className="mt-3 space-y-1.5">
            <div className="h-2 w-full rounded-full" style={{ backgroundColor: previewColors.text, opacity: 0.15 }} />
            <div className="h-2 w-5/6 rounded-full" style={{ backgroundColor: previewColors.text, opacity: 0.15 }} />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 rounded-full" style={{ backgroundColor: previewColors.primary, opacity: 0.8 }} />
            <div className="h-6 w-16 rounded-full" style={{ border: `1px solid ${previewColors.text}30` }} />
          </div>
          <div className="mt-auto grid grid-cols-3 gap-2 pt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-[6px] p-2" style={{ backgroundColor: previewColors.primary, opacity: 0.06 }}>
                <div className="h-8 w-full rounded-[4px] mb-1.5" style={{ backgroundColor: previewColors.primary, opacity: 0.15 }} />
                <div className="h-1.5 w-3/4 rounded-full" style={{ backgroundColor: previewColors.text, opacity: 0.3 }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[13px] font-medium" style={{ color: "#1a1a1a" }}>{template.name}</p>
        {template.description && (
          <p className="text-[11px] mt-0.5 max-w-[200px]" style={{ color: "#999" }}>
            {template.description.length > 60 ? template.description.slice(0, 60) + "..." : template.description}
          </p>
        )}
      </div>

      <button
        onClick={onSelect}
        className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-150"
        style={{
          backgroundColor: isCurrent ? "#171717" : "transparent",
          color: isCurrent ? "#ffffff" : "#1a1a1a",
          border: isCurrent ? "none" : "1px solid rgba(0,0,0,0.15)",
        }}
      >
        {isCurrent ? "Tema atual" : "Usar este tema"}
      </button>
    </div>
  );
}

export function ThemesPage({ onBack }: Props) {
  const { state } = useEditor();
  const currentTemplateId = state.blueprint.templateId || "";
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTemplatesAction()
      .then((data) => setTemplates(data))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        borderLeft: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10 py-10">
        <h1 className="text-[24px] font-semibold" style={{ color: "#1a1a1a" }}>
          Temas
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed" style={{ color: "#737373" }}>
          Selecione um novo tema para alterar seu design, voce sempre pode voltar a um tema anterior.
        </p>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="rounded-[10px] bg-black/5" style={{ aspectRatio: "3/4" }} />
                <div className="mt-3 h-4 w-20 mx-auto rounded-full bg-black/5" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <TemplatePreviewCard
                key={template.id}
                template={template}
                isCurrent={template.id === currentTemplateId}
                onSelect={() => {
                  // TODO: Aplicar template — regenerar blueprint com novo templateId
                  console.log("Selecionar template:", template.id);
                }}
              />
            ))}
          </div>
        )}

        {!loading && templates.length <= 1 && (
          <div className="mt-12 text-center">
            <p className="text-[14px]" style={{ color: "#999" }}>
              Mais temas em breve! Estamos trabalhando em novos designs premium.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
