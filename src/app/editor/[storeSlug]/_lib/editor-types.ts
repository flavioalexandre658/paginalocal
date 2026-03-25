import type { SiteBlueprint } from "@/types/ai-generation";

export type ViewportMode = "desktop" | "tablet" | "mobile";

export interface EditorState {
  blueprint: SiteBlueprint;
  activePageId: string;
  selectedSectionId: string | null;
  drawerOpen: boolean;
  isDirty: boolean;
  isSaving: boolean;
  viewportMode: ViewportMode;
  undoStack: SiteBlueprint[];
  redoStack: SiteBlueprint[];
}

export type EditorAction =
  | { type: "SET_ACTIVE_PAGE"; pageId: string }
  | { type: "SELECT_SECTION"; sectionId: string | null }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | {
      type: "UPDATE_SECTION_CONTENT";
      sectionId: string;
      content: Record<string, unknown>;
    }
  | { type: "MOVE_SECTION"; sectionId: string; direction: "up" | "down" }
  | { type: "TOGGLE_SECTION_VISIBILITY"; sectionId: string }
  | { type: "DELETE_SECTION"; sectionId: string }
  | { type: "SET_SAVING"; isSaving: boolean }
  | { type: "MARK_SAVED" }
  | { type: "SET_BLUEPRINT"; blueprint: SiteBlueprint }
  | { type: "SET_VIEWPORT"; mode: ViewportMode }
  | { type: "UNDO" }
  | { type: "REDO" };
