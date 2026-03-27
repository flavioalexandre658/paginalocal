"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import toast from "react-hot-toast";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconDeviceDesktop,
  IconDeviceTablet,
  IconDeviceMobile,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMenu2,
  IconSettings,
  IconArrowUp,
  IconDeviceFloppy,
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
import { PglPillSwitcher, PglPillSwitcherItem } from "@/components/ui/pgl-pill-switcher";
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
  previewMode: boolean;
  onTogglePreview: () => void;
  themesOpen: boolean;
  onOpenThemes: () => void;
  onCloseThemes: () => void;
  isPublished: boolean;
  settingsOpen: boolean;
  onOpenSettings: (tab?: "general" | "domains" | "integrations" | "tracking") => void;
  onCloseSettings: () => void;
}

export function EditorTopbar({
  storeId, storeSlug, storeName, sidebarCollapsed, onToggleSidebar,
  onToggleMobileMenu, previewMode, onTogglePreview,
  themesOpen, onOpenThemes, onCloseThemes, isPublished: isPublishedProp,
  settingsOpen, onOpenSettings, onCloseSettings,
}: Props) {
  const { state, dispatch } = useEditor();
  const { executeAsync, isExecuting } = useAction(updateBlueprintAction);
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
      className="flex h-12 shrink-0 items-center justify-between px-4 bg-sidebar"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Left */}
      <div className="flex items-center gap-2">
        <PglButton variant="ghost" size="icon-sm" onClick={onToggleMobileMenu} className="md:hidden">
          <IconMenu2 className="h-5 w-5" />
        </PglButton>

        <PglButton variant="ghost" size="icon-sm" onClick={onToggleSidebar} title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"} className="hidden md:inline-flex">
          {sidebarCollapsed ? <IconLayoutSidebarLeftExpand className="size-5" /> : <IconLayoutSidebarLeftCollapse className="size-5" />}
        </PglButton>

        {state.isDirty && (
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" title="Alteracoes nao salvas" />
        )}
      </div>

      {/* Center — mobile page name */}
      {!previewMode && (
        <div className="flex items-center md:hidden">
          <span className="text-[13px] font-medium text-black/80">
            {activePage?.isHomepage ? "Inicio" : activePage?.slug ?? "Inicio"}
          </span>
        </div>
      )}

      {/* Center — viewport pills (preview) / theme-colors-fonts (editor) */}
      {previewMode ? (
        <PglPillSwitcher shape="rounded" border="none" className="bg-black/[0.04]">
          {viewports.map(({ mode, icon: Icon, label }) => {
            const isActive = state.viewportMode === mode;
            return (
              <PglPillSwitcherItem
                key={mode}
                active={isActive}
                size="sm"
                icon={<Icon />}
                onClick={() => dispatch({ type: "SET_VIEWPORT", mode })}
                title={label}
              >
                {isActive && <span>{label}</span>}
              </PglPillSwitcherItem>
            );
          })}
        </PglPillSwitcher>
      ) : themesOpen ? (
        <div className="hidden md:flex items-center">
          <span className="text-[13px] font-medium text-black/40">Alterar seu tema</span>
        </div>
      ) : (
        <PglPillSwitcher className="hidden md:inline-flex">
          <PglPillSwitcherItem
            icon={<IconPalette />}
            active={themesOpen}
            onClick={() => { onOpenThemes(); setActivePanel(null); }}
          >
            Tema
          </PglPillSwitcherItem>
          <PglPillSwitcherItem
            icon={<IconBrush />}
            active={activePanel === "colors"}
            onClick={() => setActivePanel(activePanel === "colors" ? null : "colors")}
          >
            Cores
          </PglPillSwitcherItem>
          <PglPillSwitcherItem
            icon={<IconTypography />}
            active={activePanel === "fonts"}
            onClick={() => setActivePanel(activePanel === "fonts" ? null : "fonts")}
          >
            Fontes
          </PglPillSwitcherItem>
        </PglPillSwitcher>
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
            <IconArrowBackUp className="size-5" />
          </PglButton>
          <PglButton variant="ghost" size="icon-sm" onClick={() => dispatch({ type: "REDO" })} disabled={state.redoStack.length === 0} title="Refazer" className="hidden md:inline-flex">
            <IconArrowForwardUp className="size-5" />
          </PglButton>

          <PglButton variant="ghost" size="icon-sm" onClick={handleSave} disabled={!state.isDirty || isSaving} loading={isSaving} title="Salvar" className="hidden md:inline-flex">
            {!isSaving && <IconDeviceFloppy className="size-5" />}
          </PglButton>

          <div className="mx-1 hidden h-5 w-px bg-black/[0.06] md:block" />

          <PglButton variant="ghost" size="icon-sm" onClick={() => { setSettingsInitialTab("general"); onOpenSettings("general"); }} title="Configuracoes">
            <IconSettings className="size-5" />
          </PglButton>

          <PglButton
            variant={previewMode ? "dark" : "outline"}
            size="sm"
            shape="pill"
            onClick={onTogglePreview}
            className="gap-2"
          >
            Previa
            <div className={cn("relative h-[18px] w-8 rounded-full transition-colors", previewMode ? "bg-white/30" : "bg-black/10")}>
              <div className={cn("absolute top-[2px] h-[14px] w-[14px] rounded-full shadow-sm transition-transform duration-200", previewMode ? "left-4 bg-white" : "left-[2px] bg-black/40")} />
            </div>
          </PglButton>

          <PglButton variant="ghost" size="icon-sm" onClick={handleSave} disabled={!state.isDirty || isSaving} loading={isSaving} title="Salvar" className="md:hidden">
            {!isSaving && <IconDeviceFloppy className="size-5" />}
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
        onClose={onCloseSettings}
        storeId={storeId}
        storeSlug={storeSlug}
        storeName={storeName}
        initialTab={settingsInitialTab}
        onPublishChange={(active) => setIsPublished(active)}
      />

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        storeId={storeId}
        storeSlug={storeSlug}
        isPublished={isPublished}
        onPublishSuccess={() => setIsPublished(true)}
        onOpenDomains={() => { setSettingsInitialTab("domains"); onOpenSettings("domains"); }}
      />
    </header>
  );
}
