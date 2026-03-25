"use client";

import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";
import { IconArrowBackUp, IconArrowForwardUp, IconArrowLeft, IconDeviceDesktop, IconDeviceTablet, IconDeviceMobile, IconDeviceFloppy, IconExternalLink, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEditor } from "../_lib/editor-context";
import type { ViewportMode } from "../_lib/editor-types";
import { updateBlueprintAction } from "@/actions/stores/update-blueprint.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  storeId: string;
  storeSlug: string;
  storeName: string;
}

export function EditorTopbar({ storeId, storeSlug, storeName }: Props) {
  const { state, dispatch } = useEditor();
  const { executeAsync, isExecuting } = useAction(updateBlueprintAction);

  const activePage = state.blueprint.pages.find((p) => p.id === state.activePageId);

  async function handleSave() {
    dispatch({ type: "SET_SAVING", isSaving: true });
    try {
      const result = await executeAsync({ storeId, blueprint: state.blueprint });
      if (result?.data?.success) {
        dispatch({ type: "MARK_SAVED" });
        toast.success("Alteracoes salvas!");
      } else {
        throw new Error("Falha ao salvar");
      }
    } catch {
      dispatch({ type: "SET_SAVING", isSaving: false });
      toast.error("Erro ao salvar alteracoes");
    }
  }

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      {/* Left: Back + Page selector */}
      <div className="flex items-center gap-3">
        <Link
          href={`/painel/${storeSlug}`}
          className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <IconArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Painel</span>
        </Link>
        <div className="h-5 w-px bg-slate-200" />
        <Select
          value={state.activePageId}
          onValueChange={(pageId) => dispatch({ type: "SET_ACTIVE_PAGE", pageId })}
        >
          <SelectTrigger className="h-8 w-[180px] text-sm">
            <SelectValue placeholder="Selecionar pagina" />
          </SelectTrigger>
          <SelectContent>
            {state.blueprint.pages.map((page) => (
              <SelectItem key={page.id} value={page.id}>
                {page.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Center: Store name + viewport toggle + dirty indicator */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">{storeName}</span>
        {state.isDirty && (
          <span className="h-2 w-2 rounded-full bg-amber-400" title="Alteracoes nao salvas" />
        )}

        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {(
            [
              { mode: "desktop" as ViewportMode, icon: IconDeviceDesktop, label: "Desktop" },
              { mode: "tablet" as ViewportMode, icon: IconDeviceTablet, label: "Tablet" },
              { mode: "mobile" as ViewportMode, icon: IconDeviceMobile, label: "Mobile" },
            ] as const
          ).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => dispatch({ type: "SET_VIEWPORT", mode })}
              title={label}
              className={cn(
                "rounded-md p-1.5 transition-colors",
                state.viewportMode === mode
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Undo/Redo + Save + Preview */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={state.undoStack.length === 0}
          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Desfazer"
        >
          <IconArrowBackUp className="h-4 w-4" />
        </button>
        <button
          onClick={() => dispatch({ type: "REDO" })}
          disabled={state.redoStack.length === 0}
          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Refazer"
        >
          <IconArrowForwardUp className="h-4 w-4" />
        </button>

        <div className="mx-1 h-5 w-px bg-slate-200" />

        <button
          onClick={handleSave}
          disabled={!state.isDirty || isExecuting || state.isSaving}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExecuting || state.isSaving ? (
            <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <IconDeviceFloppy className="h-3.5 w-3.5" />
          )}
          Salvar
        </button>

        <a
          href={`/site/${storeSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          title="Visualizar site"
        >
          <IconExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
