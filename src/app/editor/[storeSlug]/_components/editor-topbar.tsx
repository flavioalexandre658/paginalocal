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
  IconChevronDown,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMenu2,
  IconSettings,
  IconArrowUp,
  IconDeviceFloppy,
  IconLoader2,
  IconPalette,
  IconBrush,
  IconTypography,
  IconExternalLink,
} from "@tabler/icons-react";
import { SiteSettingsModal } from "./site-settings-modal";
import { PublishModal } from "./publish-modal";
import { ColorsPopup } from "./editor-topbar-panels/colors-popup";
import { FontsPopup } from "./editor-topbar-panels/fonts-popup";
import { cn } from "@/lib/utils";
import { PglButton } from "@/components/ui/pgl-button";
import { useEditor } from "../_lib/editor-context";
import type { ViewportMode } from "../_lib/editor-types";
import { updateBlueprintAction } from "@/actions/stores/update-blueprint.action";

interface Props {
  storeId: string;
  storeSlug: string;
  storeName: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  userStores: { id: string; name: string; slug: string }[];
  previewMode: boolean;
  onTogglePreview: () => void;
  themesOpen: boolean;
  onOpenThemes: () => void;
  onCloseThemes: () => void;
  isPublished: boolean;
}

export function EditorTopbar({
  storeId, storeSlug, storeName, sidebarCollapsed, onToggleSidebar,
  onToggleMobileMenu, userStores, previewMode, onTogglePreview,
  themesOpen, onOpenThemes, onCloseThemes, isPublished: isPublishedProp,
}: Props) {
  const { state, dispatch } = useEditor();
  const { executeAsync, isExecuting } = useAction(updateBlueprintAction);
  const router = useRouter();
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<"general" | "domains" | "integrations" | "tracking">("general");
  const [publishOpen, setPublishOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<"colors" | "fonts" | null>(null);
  const [isPublished, setIsPublished] = useState(isPublishedProp);

  const isSaving = isExecuting || state.isSaving;

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
    { mode: "desktop", icon: IconDeviceDesktop, label: "Computador" },
    { mode: "tablet", icon: IconDeviceTablet, label: "Tablet" },
    { mode: "mobile", icon: IconDeviceMobile, label: "Celular" },
  ];

  const activePage = state.blueprint.pages.find((p) => p.id === state.activePageId);

  return (
    <header
      className="flex h-12 shrink-0 items-center justify-between px-3 bg-white dark:bg-slate-900"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        <PglButton variant="ghost" size="icon-sm" onClick={onToggleMobileMenu} className="md:hidden">
          <IconMenu2 className="h-5 w-5" />
        </PglButton>

        <div className="relative hidden md:block">
          <button
            onClick={() => setStoreDropdownOpen(!storeDropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition-all duration-150 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[12px] font-semibold text-white dark:bg-white dark:text-slate-900">
              {storeName.charAt(0).toUpperCase()}
            </div>
            <span className="max-w-[160px] truncate text-[14px] font-semibold text-slate-900 dark:text-white">
              {storeName}
            </span>
            <IconChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {storeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setStoreDropdownOpen(false)} />
              <div className="absolute left-0 top-full z-50 mt-2 w-[260px] rounded-xl border border-slate-200/60 bg-white/95 py-2 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/95 dark:shadow-slate-900/50">
                <div className="flex flex-col items-center py-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-[18px] font-semibold text-white dark:bg-white dark:text-slate-900">
                    {storeName.charAt(0).toUpperCase()}
                  </div>
                  <p className="mt-2 text-[14px] font-semibold text-slate-900 dark:text-white">{storeName}</p>
                </div>
                <div className="my-1 h-px bg-slate-200/60 dark:bg-slate-700/60" />
                <div className="px-2 py-1">
                  {userStores.map((s) => (
                    <button
                      key={s.id}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
                        s.slug === storeSlug
                          ? "bg-slate-100 text-slate-900 font-medium dark:bg-slate-800 dark:text-white"
                          : "text-slate-500 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:bg-slate-800/60",
                      )}
                      onClick={() => { setStoreDropdownOpen(false); if (s.slug !== storeSlug) router.push(`/negocio/${s.slug}/site`); }}
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white dark:bg-white dark:text-slate-900">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{s.name}</span>
                    </button>
                  ))}
                </div>
                <div className="my-1 h-px bg-slate-200/60 dark:bg-slate-700/60" />
                <div className="px-2 py-1">
                  <button
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-slate-500 transition-colors hover:bg-slate-100/60 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/60"
                    onClick={() => { setStoreDropdownOpen(false); router.push("/onboarding"); }}
                  >
                    + Adicionar negocio
                  </button>
                  <button
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400"
                    onClick={async () => { setStoreDropdownOpen(false); const { signOut } = await import("@/lib/auth-client"); await signOut({ fetchOptions: { onSuccess: () => { router.push("/entrar"); router.refresh(); } } }); }}
                  >
                    Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {state.isDirty && (
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" title="Alteracoes nao salvas" />
        )}

        <PglButton variant="ghost" size="icon-sm" onClick={onToggleSidebar} title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"} className="hidden md:inline-flex">
          {sidebarCollapsed ? <IconLayoutSidebarLeftExpand className="h-4 w-4" /> : <IconLayoutSidebarLeftCollapse className="h-4 w-4" />}
        </PglButton>
      </div>

      {/* Center — mobile page name */}
      {!previewMode && (
        <div className="flex items-center md:hidden">
          <span className="text-[13px] font-medium text-slate-900 dark:text-white">
            {activePage?.isHomepage ? "Inicio" : activePage?.slug ?? "Inicio"}
          </span>
        </div>
      )}

      {/* Center — viewport pills (preview) / theme-colors-fonts (editor) */}
      {previewMode ? (
        <div className="flex items-center rounded-xl bg-slate-100/80 p-[3px] dark:bg-slate-800/80">
          {viewports.map(({ mode, icon: Icon, label }) => {
            const isActive = state.viewportMode === mode;
            return (
              <button
                key={mode}
                onClick={() => dispatch({ type: "SET_VIEWPORT", mode })}
                title={label}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
                )}
              >
                <Icon className="h-4 w-4" />
                {isActive && <span>{label}</span>}
              </button>
            );
          })}
        </div>
      ) : themesOpen ? (
        <div className="hidden md:flex items-center">
          <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Alterar seu tema</span>
        </div>
      ) : (
        <div className="hidden items-center rounded-full border border-slate-200/60 p-[3px] md:flex dark:border-slate-700/60">
          {([
            { id: "theme" as const, icon: IconPalette, label: "Tema" },
            { id: "colors" as const, icon: IconBrush, label: "Cores" },
            { id: "fonts" as const, icon: IconTypography, label: "Fontes" },
          ]).map(({ id, icon: Icon, label }) => {
            const isActive = (id === "colors" && activePanel === "colors") || (id === "fonts" && activePanel === "fonts") || (id === "theme" && themesOpen);
            return (
              <button
                key={id}
                onClick={() => {
                  if (id === "theme") { onOpenThemes(); setActivePanel(null); }
                  else { setActivePanel(activePanel === id ? null : id); }
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium transition-all duration-150",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/60 dark:bg-slate-800 dark:text-white dark:border-slate-700/60"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/40 border border-transparent dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/40",
                )}
              >
                <Icon className="h-[15px] w-[15px]" />
                {label}
              </button>
            );
          })}
        </div>
      )}

      {activePanel === "colors" && <ColorsPopup onClose={() => setActivePanel(null)} />}
      {activePanel === "fonts" && <FontsPopup onClose={() => setActivePanel(null)} />}

      {/* Right */}
      {themesOpen ? (
        <div className="flex items-center">
          <PglButton variant="outline" size="sm" shape="pill" onClick={onCloseThemes}>
            Voltar ao editor
          </PglButton>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <PglButton variant="ghost" size="icon-sm" onClick={() => dispatch({ type: "UNDO" })} disabled={state.undoStack.length === 0} title="Desfazer" className="hidden md:inline-flex">
            <IconArrowBackUp className="h-4 w-4" />
          </PglButton>
          <PglButton variant="ghost" size="icon-sm" onClick={() => dispatch({ type: "REDO" })} disabled={state.redoStack.length === 0} title="Refazer" className="hidden md:inline-flex">
            <IconArrowForwardUp className="h-4 w-4" />
          </PglButton>

          <PglButton variant="ghost" size="icon-sm" onClick={handleSave} disabled={!state.isDirty || isSaving} loading={isSaving} title="Salvar" className="hidden md:inline-flex">
            {!isSaving && <IconDeviceFloppy className="h-4 w-4" />}
          </PglButton>

          <div className="mx-1 hidden h-5 w-px bg-slate-200/40 md:block dark:bg-slate-700/40" />

          <PglButton variant="ghost" size="icon-sm" onClick={() => { setSettingsInitialTab("general"); setSettingsOpen(true); }} title="Configuracoes">
            <IconSettings className="h-4 w-4" />
          </PglButton>

          <PglButton
            variant={previewMode ? "dark" : "outline"}
            size="sm"
            shape="pill"
            onClick={onTogglePreview}
            className="gap-2"
          >
            Previa
            <div className={cn("relative h-[18px] w-8 rounded-full transition-colors", previewMode ? "bg-white/30 dark:bg-slate-900/30" : "bg-slate-200 dark:bg-slate-700")}>
              <div className={cn("absolute top-[2px] h-[14px] w-[14px] rounded-full transition-all duration-200", previewMode ? "left-4 bg-white dark:bg-slate-900" : "left-[2px] bg-slate-400 dark:bg-slate-500")} />
            </div>
          </PglButton>

          <PglButton variant="ghost" size="icon-sm" onClick={handleSave} disabled={!state.isDirty || isSaving} loading={isSaving} title="Salvar" className="md:hidden">
            {!isSaving && <IconDeviceFloppy className="h-4 w-4" />}
          </PglButton>

          <PglButton
            variant={isPublished ? "dark" : "primary"}
            size="sm"
            shape="pill"
            onClick={() => setPublishOpen(true)}
            className="font-semibold md:px-4"
          >
            {isPublished ? <IconExternalLink className="h-3.5 w-3.5" /> : <IconArrowUp className="h-3.5 w-3.5" />}
            <span className="hidden md:inline">{isPublished ? "Visualizar" : "Publicar"}</span>
          </PglButton>
        </div>
      )}

      <SiteSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        storeId={storeId}
        storeSlug={storeSlug}
        storeName={storeName}
        initialTab={settingsInitialTab}
      />

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        storeId={storeId}
        storeSlug={storeSlug}
        isPublished={isPublished}
        onPublishSuccess={() => setIsPublished(true)}
        onOpenDomains={() => { setSettingsInitialTab("domains"); setSettingsOpen(true); }}
      />
    </header>
  );
}
