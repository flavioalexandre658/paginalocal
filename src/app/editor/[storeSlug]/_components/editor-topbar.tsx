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
  IconChevronRight,
  IconWorld,
  IconX,
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
import { usePlanRestrictions } from "@/hooks/use-plan-restrictions";

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
  onOpenUpgrade: () => void;
}

export function EditorTopbar({
  storeId, storeSlug, storeName, sidebarCollapsed, onToggleSidebar,
  onToggleMobileMenu, previewMode, onTogglePreview,
  themesOpen, onOpenThemes, onCloseThemes, isPublished: isPublishedProp,
  settingsOpen, onOpenSettings, onCloseSettings, onOpenUpgrade,
}: Props) {
  const { state, dispatch } = useEditor();
  const { executeAsync, isExecuting } = useAction(updateBlueprintAction);
  const [settingsInitialTab, setSettingsInitialTab] = useState<"general" | "domains" | "integrations" | "tracking">("general");
  const [publishOpen, setPublishOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<"colors" | "fonts" | null>(null);
  const [isPublished, setIsPublished] = useState(isPublishedProp);
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const { hasActiveSubscription } = usePlanRestrictions();

  const isSaving = isExecuting || state.isSaving;

  function handleOpenDomains() {
    if (!hasActiveSubscription()) {
      onOpenUpgrade();
    } else {
      setSettingsInitialTab("domains");
      onOpenSettings("domains");
    }
  }

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

  return (
    <>
      <header
        className="flex h-12 shrink-0 items-center justify-between px-4 bg-sidebar"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {/* Left */}
        <div className="flex items-center gap-1">
          <PglButton variant="ghost" size="icon-sm" onClick={onToggleMobileMenu} className="md:hidden">
            <IconMenu2 className="size-5" />
          </PglButton>

          <PglButton variant="ghost" size="icon-sm" onClick={onToggleSidebar} title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"} className="hidden md:inline-flex">
            {sidebarCollapsed ? <IconLayoutSidebarLeftExpand className="size-5" /> : <IconLayoutSidebarLeftCollapse className="size-5" />}
          </PglButton>

          {/* Mobile: settings (opens bottom sheet) */}
          <PglButton variant="ghost" size="icon-sm" onClick={() => setMobileOptionsOpen(true)} className="md:hidden">
            <IconSettings className="size-5" />
          </PglButton>

          {state.isDirty && (
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" title="Alteracoes nao salvas" />
          )}
        </div>

        {/* Center — desktop: viewport pills (preview) / theme-colors-fonts (editor) */}
        {previewMode ? (
          <PglPillSwitcher shape="rounded" border="none" className="hidden bg-black/[0.04] md:inline-flex">
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
          <div className="hidden items-center md:flex">
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
            {/* Desktop: undo/redo/save */}
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

            {/* Desktop: settings */}
            <PglButton variant="ghost" size="icon-sm" onClick={() => { setSettingsInitialTab("general"); onOpenSettings("general"); }} title="Configuracoes" className="hidden md:inline-flex">
              <IconSettings className="size-5" />
            </PglButton>

            {/* Desktop: preview toggle with label */}
            <PglButton
              variant={previewMode ? "dark" : "outline"}
              size="sm"
              shape="pill"
              onClick={onTogglePreview}
              className="hidden gap-2 md:inline-flex"
            >
              Previa
              <div className={cn("relative h-[18px] w-8 rounded-full transition-colors", previewMode ? "bg-white/30" : "bg-black/10")}>
                <div className={cn("absolute top-[2px] h-[14px] w-[14px] rounded-full shadow-sm transition-transform duration-200", previewMode ? "left-4 bg-white" : "left-[2px] bg-black/40")} />
              </div>
            </PglButton>

            {/* Mobile: undo/redo */}
            <PglButton variant="ghost" size="icon-sm" onClick={() => dispatch({ type: "UNDO" })} disabled={state.undoStack.length === 0} className="md:hidden">
              <IconArrowBackUp className="size-5" />
            </PglButton>
            <PglButton variant="ghost" size="icon-sm" onClick={() => dispatch({ type: "REDO" })} disabled={state.redoStack.length === 0} className="md:hidden">
              <IconArrowForwardUp className="size-5" />
            </PglButton>

            {/* Mobile: save */}
            <PglButton variant="ghost" size="icon-sm" onClick={handleSave} disabled={!state.isDirty || isSaving} loading={isSaving} className="md:hidden">
              {!isSaving && <IconDeviceFloppy className="size-5" />}
            </PglButton>

            {/* Publish */}
            <PglButton
              variant={isPublished ? "dark" : "primary"}
              size="sm"
              shape="pill"
              onClick={() => setPublishOpen(true)}
              className="font-semibold md:px-4"
            >
              {isPublished ? <IconExternalLink className="h-3.5 w-3.5" /> : <IconArrowUp className="h-3.5 w-3.5" />}
              <span className="md:hidden">{isPublished ? "Ver" : "Publicar"}</span>
              <span className="hidden md:inline">{isPublished ? "Visualizar" : "Publicar"}</span>
            </PglButton>
          </div>
        )}
      </header>

      {/* ── Mobile Options Bottom Sheet ── */}
      <MobileOptionsSheet
        open={mobileOptionsOpen}
        onClose={() => setMobileOptionsOpen(false)}
        onOpenColors={() => { setMobileOptionsOpen(false); setActivePanel("colors"); }}
        onOpenFonts={() => { setMobileOptionsOpen(false); setActivePanel("fonts"); }}
        onOpenThemes={() => { setMobileOptionsOpen(false); onOpenThemes(); }}
        onOpenSettings={() => { setMobileOptionsOpen(false); setSettingsInitialTab("general"); onOpenSettings("general"); }}
      />

      <SiteSettingsModal
        open={settingsOpen}
        onClose={onCloseSettings}
        storeId={storeId}
        storeSlug={storeSlug}
        storeName={storeName}
        initialTab={settingsInitialTab}
        onOpenUpgrade={() => { onCloseSettings(); onOpenUpgrade(); }}
        onPublishChange={(active) => setIsPublished(active)}
      />

      <PublishModal
        open={publishOpen}
        onClose={() => setPublishOpen(false)}
        storeId={storeId}
        storeSlug={storeSlug}
        isPublished={isPublished}
        onPublishSuccess={() => setIsPublished(true)}
        onOpenDomains={handleOpenDomains}
      />
    </>
  );
}

// ─── Mobile Options Bottom Sheet ────────────────────────────────────────────

interface MobileOptionsSheetProps {
  open: boolean;
  onClose: () => void;
  onOpenColors: () => void;
  onOpenFonts: () => void;
  onOpenThemes: () => void;
  onOpenSettings: () => void;
}

const MOBILE_OPTIONS = [
  { id: "colors", label: "Cores", icon: IconBrush },
  { id: "fonts", label: "Fontes", icon: IconTypography },
  { id: "theme", label: "Tema", icon: IconPalette },
  { id: "discoverability", label: "Descoberta", icon: IconWorld },
  { id: "settings", label: "Configuracoes", icon: IconSettings },
] as const;

function MobileOptionsSheet({
  open,
  onClose,
  onOpenColors,
  onOpenFonts,
  onOpenThemes,
  onOpenSettings,
}: MobileOptionsSheetProps) {
  function handleSelect(id: string) {
    switch (id) {
      case "colors": onOpenColors(); break;
      case "fonts": onOpenFonts(); break;
      case "theme": onOpenThemes(); break;
      case "discoverability": onOpenSettings(); break;
      case "settings": onOpenSettings(); break;
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[80dvh] flex-col rounded-t-3xl bg-white transition-transform duration-300 ease-out md:hidden",
        )}
        style={{ transform: open ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-black/10" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between px-5 pb-2 pt-1">
          <p className="text-base font-semibold text-black/80">Opcoes</p>
          <PglButton variant="ghost" size="icon-sm" onClick={onClose}>
            <IconX className="size-5" />
          </PglButton>
        </div>

        {/* Options list */}
        <div className="flex flex-col gap-0.5 overflow-y-auto px-3 pb-6">
          {MOBILE_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-[background,color] duration-150 hover:bg-black/5"
            >
              <Icon className="size-5 shrink-0 text-black/55" />
              <span className="flex-1 text-sm font-medium text-black/80">{label}</span>
              <IconChevronRight className="size-4 shrink-0 text-black/20" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
