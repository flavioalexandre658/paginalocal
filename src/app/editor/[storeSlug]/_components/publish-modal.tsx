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
  open, onClose, storeId, storeSlug, isPublished, onPublishSuccess, onOpenDomains,
}: Props) {
  const { state, dispatch } = useEditor();
  const { executeAsync: saveBlueprint, isExecuting: isSavingBlueprint } = useAction(updateBlueprintAction);
  const { executeAsync: activateStore, isExecuting: isActivating } = useAction(activateStoreAction);

  const domain = process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "paginalocal.com.br";
  const siteUrl = `https://${storeSlug}.${domain}`;
  const displayUrl = `https://${storeSlug}.${domain}`;

  async function handlePublish() {
    dispatch({ type: "SET_SAVING", isSaving: true });
    try {
      const res = await saveBlueprint({ storeId, blueprint: state.blueprint });
      if (!res?.data?.success) throw new Error("Falha ao salvar");
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
      <div className="fixed inset-0 z-[9998]" onClick={onClose} />

      <div
        className="fixed z-[9999] right-3 top-14 w-[376px] max-w-[calc(100vw-32px)] rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5"
        style={{ animation: "publish-enter 200ms ease-out" }}
      >
        <div className="flex flex-col gap-4">
          {/* Title */}
          <p className="text-base font-medium">
            {isPublished ? "Visualizar seu site" : "Publicar seu site"}
          </p>

          {/* Domain section */}
          <div className="flex flex-col justify-center gap-2">
            <p className="text-xs font-medium text-black/55">Seu dominio</p>

            {/* Domain card */}
            <div className={cn(
              "flex flex-col rounded-[14px]",
              isPublished ? "bg-[#DEF2E7]" : "bg-amber-100/50",
            )}>
              {/* URL row: white inner card */}
              <div className="m-0.5 flex items-center justify-between rounded-xl bg-white pl-3 pr-1">
                <button
                  onClick={() => window.open(siteUrl, "_blank")}
                  className="flex min-w-0 flex-1 items-center gap-2 py-2 outline-none"
                >
                  <IconWorld className="size-5 shrink-0 text-black/55" />
                  <p className="text-sm truncate text-left hover:underline">{displayUrl}</p>
                </button>
                <div className="flex items-center">
                  <button
                    onClick={handleCopy}
                    className="rounded-2xl p-2 text-black/55 transition-colors hover:bg-black/5 hover:text-black/80"
                    title="Copiar dominio"
                  >
                    <IconCopy className="size-5" />
                  </button>
                  <button
                    onClick={() => { onClose(); onOpenDomains(); }}
                    className="rounded-2xl p-2 text-black/55 transition-colors hover:bg-black/5 hover:text-black/80"
                  >
                    <IconPencil className="size-5" />
                  </button>
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-center gap-2 p-2">
                {isPublished ? (
                  <>
                    <div className="size-2 rounded-full bg-[#519A73]" />
                    <p className="text-xs font-medium text-[#519A73]">Seu site esta no ar</p>
                  </>
                ) : (
                  <>
                    <IconEyeOff className="size-3.5 text-amber-600" />
                    <p className="text-xs font-medium text-amber-600">Modo demonstracao</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Custom domain CTA card */}
          <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-black/[0.03] p-3">
            <div className="flex max-w-[174px] flex-col items-center gap-1 pt-3 text-center">
              <IconStar className="size-6 text-black/55" />
              <p className="text-sm font-medium">
                Tenha um visual profissional com um dominio personalizado.
              </p>
            </div>
            <button
              onClick={() => { onClose(); onOpenDomains(); }}
              className="w-full rounded-2xl bg-black/5 px-4 py-2 text-sm font-medium text-black/55 transition-colors hover:bg-black/10 hover:text-black/80"
            >
              Adicionar dominio
            </button>
          </div>

          {/* Main CTA */}
          {isPublished ? (
            <button
              onClick={() => window.open(siteUrl, "_blank")}
              className="flex items-center justify-center gap-1 rounded-2xl px-4 py-3 text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: "#519A73" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#408059"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#519A73"; }}
            >
              <IconExternalLink className="size-5" />
              Ver site
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isBusy}
              className="flex items-center justify-center gap-1 rounded-2xl px-4 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#519A73" }}
              onMouseEnter={(e) => { if (!isBusy) e.currentTarget.style.backgroundColor = "#408059"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#519A73"; }}
            >
              {isBusy ? (
                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <IconRocket className="size-5" />
              )}
              {isBusy ? "Publicando..." : "Publicar site"}
            </button>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `@keyframes publish-enter { from { opacity: 0; transform: translateY(-4px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }` }} />
    </>
  );
}
