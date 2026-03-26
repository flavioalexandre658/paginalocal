"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconDeviceDesktop,
  IconDeviceTablet,
  IconDeviceMobile,
  IconDeviceFloppy,
  IconExternalLink,
  IconLoader2,
  IconChevronDown,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useEditor } from "../_lib/editor-context";
import type { ViewportMode } from "../_lib/editor-types";
import { updateBlueprintAction } from "@/actions/stores/update-blueprint.action";

interface Props {
  storeId: string;
  storeSlug: string;
  storeName: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  userStores: { id: string; name: string; slug: string }[];
}

export function EditorTopbar({ storeId, storeSlug, storeName, sidebarCollapsed, onToggleSidebar, userStores }: Props) {
  const { state, dispatch } = useEditor();
  const { executeAsync, isExecuting } = useAction(updateBlueprintAction);
  const router = useRouter();
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);

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

  const viewports: { mode: ViewportMode; icon: typeof IconDeviceDesktop; label: string }[] = [
    { mode: "desktop", icon: IconDeviceDesktop, label: "Desktop" },
    { mode: "tablet", icon: IconDeviceTablet, label: "Tablet" },
    { mode: "mobile", icon: IconDeviceMobile, label: "Mobile" },
  ];

  return (
    <header
      className="flex h-12 shrink-0 items-center justify-between px-3"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        backgroundColor: "#ffffff",
      }}
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
            className="flex items-center gap-2 rounded-[8px] px-2 py-1 transition-all duration-150"
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f4"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ backgroundColor: "#171717" }}
            >
              {storeName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[160px] truncate text-[14px] font-semibold" style={{ color: "#1a1a1a" }}>
              {storeName}
            </span>
            <IconChevronDown style={{ width: 14, height: 14, color: "#737373" }} />
          </button>

          {storeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setStoreDropdownOpen(false)} />
              <div
                className="absolute left-0 top-full z-50 mt-2 w-[260px] rounded-[12px] py-2"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
                }}
              >
                <div className="flex flex-col items-center py-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-[18px] font-semibold text-white"
                    style={{ backgroundColor: "#171717" }}
                  >
                    {storeName.charAt(0).toUpperCase()}
                  </div>
                  <p className="mt-2 text-[14px] font-semibold" style={{ color: "#1a1a1a" }}>{storeName}</p>
                </div>

                <div className="my-1" style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)" }} />

                <div className="px-2 py-1">
                  {userStores.map((s) => (
                    <button
                      key={s.id}
                      className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] transition-colors"
                      style={{
                        backgroundColor: s.slug === storeSlug ? "#f5f5f4" : "transparent",
                        color: s.slug === storeSlug ? "#1a1a1a" : "#737373",
                        fontWeight: s.slug === storeSlug ? 500 : 400,
                      }}
                      onMouseEnter={(e) => { if (s.slug !== storeSlug) e.currentTarget.style.backgroundColor = "#fafaf9"; }}
                      onMouseLeave={(e) => { if (s.slug !== storeSlug) e.currentTarget.style.backgroundColor = "transparent"; }}
                      onClick={() => {
                        setStoreDropdownOpen(false);
                        if (s.slug !== storeSlug) router.push(`/editor/${s.slug}`);
                      }}
                    >
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: "#171717" }}
                      >
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                  {userStores.length === 0 && (
                    <div className="px-3 py-2 text-[13px]" style={{ color: "#a3a3a3" }}>Carregando...</div>
                  )}
                </div>

                <div className="my-1" style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)" }} />

                <div className="px-2 py-1">
                  <button
                    className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] transition-colors"
                    style={{ color: "#737373" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    onClick={() => { setStoreDropdownOpen(false); router.push("/painel"); }}
                  >
                    + Adicionar negocio
                  </button>
                  <button
                    className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] transition-colors"
                    style={{ color: "#737373" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fafaf9"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    onClick={() => { setStoreDropdownOpen(false); router.push("/api/auth/sign-out"); }}
                  >
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {state.isDirty && (
          <span className="h-2 w-2 rounded-full bg-amber-400" title="Alteracoes nao salvas" />
        )}

        <button
          onClick={onToggleSidebar}
          className="rounded-[8px] p-1.5 transition-all duration-150"
          style={{ color: "#a3a3a3" }}
          title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; e.currentTarget.style.backgroundColor = "#f5f5f4"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#a3a3a3"; e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          {sidebarCollapsed ? (
            <IconLayoutSidebarLeftExpand style={{ width: 16, height: 16 }} />
          ) : (
            <IconLayoutSidebarLeftCollapse style={{ width: 16, height: 16 }} />
          )}
        </button>
      </div>

      <div
        className="flex items-center rounded-[10px] p-[3px]"
        style={{ backgroundColor: "#f5f5f4" }}
      >
        {viewports.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => dispatch({ type: "SET_VIEWPORT", mode })}
            title={label}
            className={cn(
              "rounded-[8px] p-2 transition-all duration-150",
              state.viewportMode === mode ? "shadow-[0_1px_3px_rgba(0,0,0,0.06)]" : "",
            )}
            style={{
              backgroundColor: state.viewportMode === mode ? "#ffffff" : "transparent",
              color: state.viewportMode === mode ? "#1a1a1a" : "#a3a3a3",
            }}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch({ type: "UNDO" })}
          disabled={state.undoStack.length === 0}
          className="rounded-[8px] p-2 transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ color: "#737373" }}
          title="Desfazer"
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = "#f5f5f4"; e.currentTarget.style.color = "#1a1a1a"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#737373"; }}
        >
          <IconArrowBackUp className="h-4 w-4" />
        </button>
        <button
          onClick={() => dispatch({ type: "REDO" })}
          disabled={state.redoStack.length === 0}
          className="rounded-[8px] p-2 transition-all duration-150 disabled:opacity-25 disabled:cursor-not-allowed"
          style={{ color: "#737373" }}
          title="Refazer"
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.backgroundColor = "#f5f5f4"; e.currentTarget.style.color = "#1a1a1a"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#737373"; }}
        >
          <IconArrowForwardUp className="h-4 w-4" />
        </button>

        <div className="mx-1.5 h-5 w-px" style={{ backgroundColor: "rgba(0,0,0,0.06)" }} />

        <button
          onClick={handleSave}
          disabled={!state.isDirty || isExecuting || state.isSaving}
          className="flex items-center gap-1.5 rounded-[8px] px-4 py-2 text-[13px] font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#171717", color: "#ffffff" }}
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
          className="ml-1 rounded-[8px] p-2 transition-all duration-150"
          style={{ color: "#737373" }}
          title="Visualizar site"
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f4"; e.currentTarget.style.color = "#1a1a1a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#737373"; }}
        >
          <IconExternalLink className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
