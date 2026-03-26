"use client";

import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";
import {
  IconWorld,
  IconCopy,
  IconPencil,
  IconLink,
  IconStar,
  IconLoader2,
  IconRocket,
} from "@tabler/icons-react";
import { useEditor } from "../_lib/editor-context";
import { updateBlueprintAction } from "@/actions/stores/update-blueprint.action";

interface Props {
  open: boolean;
  onClose: () => void;
  storeId: string;
  storeSlug: string;
  onOpenDomains: () => void;
}

export function PublishModal({ open, onClose, storeId, storeSlug, onOpenDomains }: Props) {
  const { state, dispatch } = useEditor();
  const { executeAsync, isExecuting } = useAction(updateBlueprintAction);

  const siteUrl = `https://${storeSlug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "paginalocal.com.br"}`;
  const displayUrl = siteUrl.length > 32 ? siteUrl.slice(0, 32) + "..." : siteUrl;

  async function handlePublish() {
    dispatch({ type: "SET_SAVING", isSaving: true });
    try {
      const result = await executeAsync({ storeId, blueprint: state.blueprint });
      if (result?.data?.success) {
        dispatch({ type: "MARK_SAVED" });
        toast.success("Site publicado com sucesso!");
        onClose();
      } else {
        throw new Error("Falha ao publicar");
      }
    } catch {
      dispatch({ type: "SET_SAVING", isSaving: false });
      toast.error("Erro ao publicar site");
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(siteUrl);
    toast.success("Link copiado!");
  }

  if (!open) return null;

  const isBusy = isExecuting || state.isSaving;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998] bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed z-[9999] right-3 top-14 w-[340px] rounded-[16px] overflow-hidden"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          animation: "pgl-fade-in 200ms ease-out",
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[10px] pb-[4px]">
          <div
            className="rounded-full"
            style={{ width: 40, height: 4, backgroundColor: "rgba(0,0,0,0.15)" }}
          />
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          {/* Title */}
          <p
            className="text-[16px] font-semibold mb-4"
            style={{ color: "#1a1a1a" }}
          >
            Publicar seu site
          </p>

          {/* Domain section */}
          <p
            className="text-[13px] font-medium mb-[6px]"
            style={{ color: "#737373" }}
          >
            Seu dominio
          </p>

          <div
            className="flex items-center gap-3 rounded-[10px] px-3 py-2.5"
            style={{
              backgroundColor: "#f5f5f4",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <IconWorld style={{ width: 18, height: 18, color: "#737373", flexShrink: 0 }} />
            <span
              className="flex-1 truncate text-[14px]"
              style={{ color: "#1a1a1a" }}
            >
              {displayUrl}
            </span>
            <button
              onClick={handleCopy}
              className="rounded-[6px] p-1 transition-colors"
              style={{ color: "#a3a3a3" }}
              title="Copiar link"
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <IconCopy style={{ width: 15, height: 15 }} />
            </button>
            <button
              onClick={() => { onClose(); onOpenDomains(); }}
              className="rounded-[6px] p-1 transition-colors"
              style={{ color: "#a3a3a3" }}
              title="Editar dominio"
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <IconPencil style={{ width: 15, height: 15 }} />
            </button>
          </div>

          {/* Demo mode notice */}
          <div className="flex flex-col items-center gap-1 py-4">
            <IconLink style={{ width: 20, height: 20, color: "#737373" }} />
            <p
              className="text-[13px] font-semibold"
              style={{ color: "#1a1a1a" }}
            >
              Modo demonstracao
            </p>
            <p
              className="text-[12px] text-center leading-relaxed"
              style={{ color: "#a3a3a3" }}
            >
              Seu site esta oculto dos mecanismos de
              <br />
              busca ate voce publicar
            </p>
          </div>

          {/* Custom domain CTA card */}
          <button
            onClick={() => { onClose(); onOpenDomains(); }}
            className="w-full rounded-[12px] p-4 text-left transition-all duration-150"
            style={{
              backgroundColor: "#fefce8",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)"; }}
          >
            <div className="flex flex-col items-center gap-2">
              <IconStar style={{ width: 22, height: 22, color: "#a3a3a3" }} />
              <p
                className="text-[14px] font-medium text-center"
                style={{ color: "#1a1a1a" }}
              >
                Tenha um visual profissional com
                <br />
                um dominio personalizado.
              </p>
              <div
                className="mt-1 rounded-[8px] px-4 py-2 text-[13px] font-medium"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  color: "#1a1a1a",
                }}
              >
                Adicionar dominio
              </div>
            </div>
          </button>

          {/* Publish action */}
          <button
            onClick={handlePublish}
            disabled={isBusy}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] py-3 text-[14px] font-semibold transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#171717", color: "#ffffff" }}
            onMouseEnter={(e) => { if (!isBusy) e.currentTarget.style.opacity = "0.9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            {isBusy ? (
              <IconLoader2 style={{ width: 16, height: 16 }} className="animate-spin" />
            ) : (
              <IconRocket style={{ width: 16, height: 16 }} />
            )}
            Publicar site
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pgl-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
