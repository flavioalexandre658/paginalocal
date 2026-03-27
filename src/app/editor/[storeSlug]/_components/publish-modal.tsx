"use client";

import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";
import {
  IconWorld,
  IconCopy,
  IconPencil,
  IconStar,
  IconEyeOff,
  IconExternalLink,
  IconRocket,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useEditor } from "../_lib/editor-context";
import { updateBlueprintAction } from "@/actions/stores/update-blueprint.action";
import { activateStoreAction } from "@/actions/stores/activate-store.action";

interface Props {
  open: boolean;
  onClose: () => void;
  storeId: string;
  storeSlug: string;
  isPublished: boolean;
  onPublishSuccess: () => void;
  onOpenDomains: () => void;
}

export function PublishModal({
  open,
  onClose,
  storeId,
  storeSlug,
  isPublished,
  onPublishSuccess,
  onOpenDomains,
}: Props) {
  const { state, dispatch } = useEditor();
  const { executeAsync: saveBlueprint, isExecuting: isSavingBlueprint } =
    useAction(updateBlueprintAction);
  const { executeAsync: activateStore, isExecuting: isActivating } =
    useAction(activateStoreAction);

  const siteUrl = `https://${storeSlug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "paginalocal.com.br"}`;
  const displayUrl =
    siteUrl.length > 30 ? siteUrl.slice(0, 30) + "..." : siteUrl;

  async function handlePublish() {
    dispatch({ type: "SET_SAVING", isSaving: true });
    try {
      const blueprintResult = await saveBlueprint({
        storeId,
        blueprint: state.blueprint,
      });
      if (!blueprintResult?.data?.success) throw new Error("Falha ao salvar");
      dispatch({ type: "MARK_SAVED" });
      await activateStore({ storeId });
      onPublishSuccess();
      toast.success("Site publicado com sucesso!");
      onClose();
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

  const isBusy = isSavingBlueprint || isActivating || state.isSaving;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/20"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="publish-modal fixed z-[9999] right-3 top-14 w-[320px] rounded-2xl bg-white"
        style={{
          boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* Content */}
        <div className="px-5 pt-5 pb-5">
          {/* ─── Title ─── */}
          <h3 className="text-[15px] font-semibold text-neutral-900 mb-4">
            {isPublished ? "Visualizar seu site" : "Publicar seu site"}
          </h3>

          {/* ─── Domain label ─── */}
          <p className="text-[12px] font-medium text-neutral-400 mb-1.5">
            Seu domínio
          </p>

          {/* ─── Domain container ─── */}
          <div className={cn(
            "rounded-2xl overflow-hidden border",
            isPublished
              ? "border-emerald-200/60 bg-emerald-50/30"
              : "border-red-200/60 bg-red-50/30",
          )}>
            <div className="flex items-center gap-2.5 px-4 py-3">
              <IconWorld className="size-4 shrink-0 text-neutral-400" />
              <span className="flex-1 truncate text-[13px] text-neutral-700">
                {displayUrl}
              </span>
              <button
                onClick={handleCopy}
                className="rounded-md p-1 text-neutral-300 transition-colors hover:text-neutral-500 hover:bg-black/[0.04]"
              >
                <IconCopy className="size-3.5" />
              </button>
              <button
                onClick={() => { onClose(); onOpenDomains(); }}
                className="rounded-md p-1 text-neutral-300 transition-colors hover:text-neutral-500 hover:bg-black/[0.04]"
              >
                <IconPencil className="size-3.5" />
              </button>
            </div>
            <div className={cn(
              "flex items-center justify-center gap-1.5 py-2",
              isPublished ? "bg-emerald-50/50" : "bg-red-50/50",
            )}>
              {isPublished ? (
                <>
                  <span className="size-[6px] rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-medium text-emerald-600">Seu site esta no ar</span>
                </>
              ) : (
                <>
                  <IconEyeOff className="size-3 text-red-400" />
                  <span className="text-[11px] font-medium text-red-500">Modo demonstracao</span>
                </>
              )}
            </div>
          </div>

          {/* ─── Custom domain CTA ─── */}
          <button
            onClick={() => {
              onClose();
              onOpenDomains();
            }}
            className="mt-3 w-full rounded-xl border border-neutral-150 bg-neutral-50/50 p-5 text-center transition-all hover:border-neutral-200 hover:bg-neutral-50"
          >
            <IconStar className="size-5 text-neutral-300 mx-auto mb-2" />
            <p className="text-[13px] font-medium text-neutral-700 leading-snug">
              Tenha um visual profissional
              <br />
              com um domínio personalizado.
            </p>
            <span className="inline-block mt-3 rounded-lg bg-neutral-100 px-4 py-1.5 text-[12px] font-medium text-neutral-500">
              Adicionar domínio
            </span>
          </button>

          {/* ─── Action button ─── */}
          {isPublished ? (
            <button
              onClick={() => window.open(siteUrl, "_blank")}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              Ver site
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isBusy}
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <IconRocket className="size-4" />
              )}
              {isBusy ? "Publicando..." : "Publicar site"}
            </button>
          )}
        </div>
      </div>

      {/* Animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .publish-modal {
              animation: publish-enter 200ms ease-out;
            }
            @keyframes publish-enter {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `,
        }}
      />
    </>
  );
}