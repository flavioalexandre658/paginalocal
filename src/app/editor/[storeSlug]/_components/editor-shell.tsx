"use client";

import type { SiteBlueprint } from "@/types/ai-generation";
import { EditorProvider } from "../_lib/editor-context";
import { EditorTopbar } from "./editor-topbar";
import { EditorSidebar } from "./editor-sidebar";
import { EditorPreview } from "./editor-preview";
import { SectionEditDrawer } from "./section-edit-drawer";
import { InlineTextEditor } from "./inline-text-editor";
import { UnsavedChangesGuard } from "./unsaved-changes-guard";

interface Props {
  initialBlueprint: SiteBlueprint;
  storeId: string;
  storeSlug: string;
  storeName: string;
}

export function EditorShell({ initialBlueprint, storeId, storeSlug, storeName }: Props) {
  return (
    <EditorProvider initialBlueprint={initialBlueprint} storeId={storeId}>
      <UnsavedChangesGuard />
      <div className="flex h-screen flex-col overflow-hidden">
        <EditorTopbar storeId={storeId} storeSlug={storeSlug} storeName={storeName} />

        <div className="flex flex-1 overflow-hidden">
          <EditorSidebar />

          <div className="flex-1 overflow-hidden">
            <EditorPreview />
          </div>
        </div>
      </div>

      <SectionEditDrawer />
      <InlineTextEditor />
    </EditorProvider>
  );
}
