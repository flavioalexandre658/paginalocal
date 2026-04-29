import type { SiteBlueprint, DesignTokens } from "@/types/ai-generation";

export type ViewportMode = "desktop" | "tablet" | "mobile";

export interface EditorState {
  blueprint: SiteBlueprint;
  activePageId: string;
  selectedSectionId: string | null;
  hoveredSectionId: string | null;
  drawerOpen: boolean;
  isDirty: boolean;
  isSaving: boolean;
  viewportMode: ViewportMode;
  undoStack: SiteBlueprint[];
  redoStack: SiteBlueprint[];
  isInlineEditing: boolean;
  /**
   * Incrementado quando phase 3 termina, para forçar re-mount das seções
   * (e por consequência das tags <img>) garantindo que toda imagem
   * aponte para a URL final do S3.
   */
  renderEpoch: number;
}

export type EditorAction =
  | { type: "SET_ACTIVE_PAGE"; pageId: string }
  | { type: "SELECT_SECTION"; sectionId: string | null }
  | { type: "HOVER_SECTION"; sectionId: string | null }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "SET_INLINE_EDITING"; value: boolean }
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
  | { type: "MERGE_GENERATED_SECTIONS"; blueprint: SiteBlueprint }
  | { type: "MERGE_IMAGE_URLS"; blueprint: SiteBlueprint }
  | { type: "BUMP_RENDER_EPOCH" }
  | { type: "SET_VIEWPORT"; mode: ViewportMode }
  | { type: "UPDATE_DESIGN_TOKENS"; tokens: Partial<DesignTokens> }
  | { type: "UPDATE_SECTION_VARIANT"; sectionId: string; variant: number }
  | { type: "UPDATE_NAVIGATION"; navigation: { label: string; href: string; isExternal?: boolean }[] }
  | { type: "UNDO" }
  | { type: "REDO" };
