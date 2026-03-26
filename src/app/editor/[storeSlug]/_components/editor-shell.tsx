"use client";

import { useState } from "react";
import type { SiteBlueprint } from "@/types/ai-generation";
import { EditorProvider } from "../_lib/editor-context";
import { EditorTopbar } from "./editor-topbar";
import { EditorSidebar } from "./editor-sidebar";
import { EditorPreview } from "./editor-preview";
import { SectionEditDrawer } from "./section-edit-drawer";
import { UnsavedChangesGuard } from "./unsaved-changes-guard";

interface Props {
  initialBlueprint: SiteBlueprint;
  storeId: string;
  storeSlug: string;
  storeName: string;
  userStores: { id: string; name: string; slug: string }[];
}

export function EditorShell({ initialBlueprint, storeId, storeSlug, storeName, userStores }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <EditorProvider initialBlueprint={initialBlueprint} storeId={storeId}>
      <UnsavedChangesGuard />
      <div
        className="flex h-screen flex-col overflow-hidden"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#ffffff" }}
      >
        <EditorTopbar
          storeId={storeId}
          storeSlug={storeSlug}
          storeName={storeName}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          userStores={userStores}
          previewMode={previewMode}
          onTogglePreview={() => setPreviewMode(!previewMode)}
        />

        <div className="flex flex-1 overflow-hidden">
          {!previewMode && (
            <div className="hidden md:block">
              <EditorSidebar collapsed={sidebarCollapsed} storeSlug={storeSlug} />
            </div>
          )}

          <div
            className="flex-1 overflow-hidden p-2"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div
              className="h-full overflow-hidden rounded-[12px]"
              style={{ backgroundColor: "#f5f5f4" }}
            >
              <EditorPreview previewMode={previewMode} />
            </div>
          </div>
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
        />
      )}

      {!previewMode && <SectionEditDrawer />}
    </EditorProvider>
  );
}
