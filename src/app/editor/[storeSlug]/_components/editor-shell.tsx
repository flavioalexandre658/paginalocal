"use client";

import { useState } from "react";
import type { SiteBlueprint } from "@/types/ai-generation";
import { EditorProvider } from "../_lib/editor-context";
import { EditorTopbar } from "./editor-topbar";
import { EditorSidebar } from "./editor-sidebar";
import { EditorPreview } from "./editor-preview";
import { SectionEditDrawer } from "./section-edit-drawer";
import { UnsavedChangesGuard } from "./unsaved-changes-guard";
import { ThemesPage } from "./editor-topbar-panels/themes-page";
import { UpgradeModal } from "@/components/shared/upgrade-modal";

interface Props {
  initialBlueprint: SiteBlueprint;
  storeId: string;
  storeSlug: string;
  storeName: string;
  userStores: { id: string; name: string; slug: string }[];
  isPublished: boolean;
}

export function EditorShell({ initialBlueprint, storeId, storeSlug, storeName, userStores, isPublished }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <EditorProvider initialBlueprint={initialBlueprint} storeId={storeId}>
      <UnsavedChangesGuard />
      <div
        className="flex overflow-hidden bg-sidebar"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif", height: "100dvh" }}
      >
        {/* Sidebar — full height, hidden on mobile and in preview mode */}
        {!previewMode && (
          <div className="hidden md:block">
            <EditorSidebar
              collapsed={sidebarCollapsed}
              storeName={storeName}
              storeSlug={storeSlug}
              userStores={userStores}
              onOpenSettings={() => setSettingsOpen(true)}
              onOpenUpgrade={() => setUpgradeOpen(true)}
            />
          </div>
        )}

        {/* Right column: topbar + content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <EditorTopbar
            storeId={storeId}
            storeSlug={storeSlug}
            storeName={storeName}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            previewMode={previewMode}
            onTogglePreview={() => setPreviewMode(!previewMode)}
            themesOpen={themesOpen}
            onOpenThemes={() => { setThemesOpen(true); setPreviewMode(false); }}
            onCloseThemes={() => setThemesOpen(false)}
            isPublished={isPublished}
            settingsOpen={settingsOpen}
            onOpenSettings={() => setSettingsOpen(true)}
            onCloseSettings={() => setSettingsOpen(false)}
            onOpenUpgrade={() => setUpgradeOpen(true)}
          />

          {themesOpen ? (
            <ThemesPage onBack={() => setThemesOpen(false)} />
          ) : (
            <div className="flex-1 overflow-hidden p-2">
              <div className="h-full overflow-hidden rounded-2xl bg-slate-100/80 dark:bg-slate-800/50">
                <EditorPreview previewMode={previewMode} />
              </div>
            </div>
          )}
        </div>
      </div>

      {!previewMode && (
        <EditorSidebar
          collapsed={false}
          mobileOverlay
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          storeName={storeName}
          storeSlug={storeSlug}
          userStores={userStores}
          onOpenUpgrade={() => setUpgradeOpen(true)}
        />
      )}

      {!previewMode && <SectionEditDrawer />}

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        storeSlug={storeSlug}
      />
    </EditorProvider>
  );
}
