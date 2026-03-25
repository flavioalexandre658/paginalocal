"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { SiteBlueprint } from "@/types/ai-generation";
import type { EditorState, EditorAction } from "./editor-types";
import { editorReducer } from "./editor-reducer";

const EditorContext = createContext<{
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  storeId: string;
} | null>(null);

interface EditorProviderProps {
  children: ReactNode;
  initialBlueprint: SiteBlueprint;
  storeId: string;
}

export function EditorProvider({ children, initialBlueprint, storeId }: EditorProviderProps) {
  const homepage = initialBlueprint.pages.find((p) => p.isHomepage) ?? initialBlueprint.pages[0];

  const initialState: EditorState = {
    blueprint: initialBlueprint,
    activePageId: homepage?.id ?? "",
    selectedSectionId: null,
    hoveredSectionId: null,
    drawerOpen: false,
    isDirty: false,
    isSaving: false,
    viewportMode: "desktop",
    undoStack: [],
    redoStack: [],
    isInlineEditing: false,
  };

  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider value={{ state, dispatch, storeId }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
