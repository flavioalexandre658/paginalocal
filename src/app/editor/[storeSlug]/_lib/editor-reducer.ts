import type { SiteBlueprint } from "@/types/ai-generation";
import type { EditorState, EditorAction } from "./editor-types";

const MAX_UNDO = 20;

function cloneBlueprint(bp: SiteBlueprint): SiteBlueprint {
  return JSON.parse(JSON.stringify(bp));
}

/** Push current blueprint to undo stack before mutating */
function withUndo(state: EditorState): Pick<EditorState, "undoStack" | "redoStack" | "isDirty"> {
  const undoStack = [cloneBlueprint(state.blueprint), ...state.undoStack].slice(0, MAX_UNDO);
  return { undoStack, redoStack: [], isDirty: true };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SET_ACTIVE_PAGE":
      return { ...state, activePageId: action.pageId, selectedSectionId: null, drawerOpen: false };

    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.sectionId };

    case "HOVER_SECTION":
      return { ...state, hoveredSectionId: action.sectionId };

    case "OPEN_DRAWER":
      return { ...state, drawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, drawerOpen: false };

    case "UPDATE_SECTION_CONTENT": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      for (const page of blueprint.pages) {
        const section = page.sections.find((s) => s.id === action.sectionId);
        if (section) {
          section.content = action.content;
          break;
        }
      }
      return { ...state, ...undo, blueprint };
    }

    case "MOVE_SECTION": {
      const page = state.blueprint.pages.find((p) => p.id === state.activePageId);
      if (!page) return state;

      const sorted = [...page.sections].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((s) => s.id === action.sectionId);
      if (idx === -1) return state;

      const targetIdx = action.direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= sorted.length) return state;

      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      const bpPage = blueprint.pages.find((p) => p.id === state.activePageId)!;
      const bpSorted = [...bpPage.sections].sort((a, b) => a.order - b.order);

      // Swap orders
      const orderA = bpSorted[idx].order;
      const orderB = bpSorted[targetIdx].order;
      const sectionA = bpPage.sections.find((s) => s.id === bpSorted[idx].id)!;
      const sectionB = bpPage.sections.find((s) => s.id === bpSorted[targetIdx].id)!;
      sectionA.order = orderB;
      sectionB.order = orderA;

      return { ...state, ...undo, blueprint };
    }

    case "TOGGLE_SECTION_VISIBILITY": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      for (const page of blueprint.pages) {
        const section = page.sections.find((s) => s.id === action.sectionId);
        if (section) {
          section.visible = !section.visible;
          break;
        }
      }
      return { ...state, ...undo, blueprint };
    }

    case "DELETE_SECTION": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      for (const page of blueprint.pages) {
        const idx = page.sections.findIndex((s) => s.id === action.sectionId);
        if (idx !== -1) {
          page.sections.splice(idx, 1);
          break;
        }
      }
      return {
        ...state,
        ...undo,
        blueprint,
        selectedSectionId: state.selectedSectionId === action.sectionId ? null : state.selectedSectionId,
        drawerOpen: state.selectedSectionId === action.sectionId ? false : state.drawerOpen,
      };
    }

    case "SET_SAVING":
      return { ...state, isSaving: action.isSaving };

    case "MARK_SAVED":
      return { ...state, isDirty: false, isSaving: false };

    case "SET_BLUEPRINT":
      return { ...state, blueprint: action.blueprint, isDirty: false };

    case "SET_VIEWPORT":
      return { ...state, viewportMode: action.mode };

    case "UPDATE_DESIGN_TOKENS": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      const incoming = action.tokens;
      if (incoming.palette) {
        blueprint.designTokens.palette = { ...blueprint.designTokens.palette, ...incoming.palette };
      }
      if (incoming.fontPairing) blueprint.designTokens.fontPairing = incoming.fontPairing;
      if (incoming.style) blueprint.designTokens.style = incoming.style;
      if (incoming.borderRadius) blueprint.designTokens.borderRadius = incoming.borderRadius;
      if (incoming.spacing) blueprint.designTokens.spacing = incoming.spacing;
      return { ...state, ...undo, blueprint };
    }

    case "UPDATE_SECTION_VARIANT": {
      const undo = withUndo(state);
      const blueprint = cloneBlueprint(state.blueprint);
      for (const page of blueprint.pages) {
        const section = page.sections.find((s) => s.id === action.sectionId);
        if (section) {
          section.variant = action.variant;
          break;
        }
      }
      return { ...state, ...undo, blueprint };
    }

    case "SET_INLINE_EDITING":
      return { ...state, isInlineEditing: action.value };

    case "UNDO": {
      if (state.undoStack.length === 0) return state;
      const [prev, ...rest] = state.undoStack;
      return {
        ...state,
        blueprint: prev,
        undoStack: rest,
        redoStack: [cloneBlueprint(state.blueprint), ...state.redoStack].slice(0, MAX_UNDO),
        isDirty: true,
      };
    }

    case "REDO": {
      if (state.redoStack.length === 0) return state;
      const [next, ...rest] = state.redoStack;
      return {
        ...state,
        blueprint: next,
        redoStack: rest,
        undoStack: [cloneBlueprint(state.blueprint), ...state.undoStack].slice(0, MAX_UNDO),
        isDirty: true,
      };
    }

    default:
      return state;
  }
}
